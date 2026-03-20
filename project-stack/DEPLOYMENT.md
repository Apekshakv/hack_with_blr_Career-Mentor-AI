# Deployment Guide - Career Mentor AI

Complete guide to deploying your AI Career Mentor to production.

## Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] `.env.example` committed to repo
- [ ] `.env.local` NOT committed (in .gitignore)
- [ ] Docker Compose setup documented
- [ ] README has clear setup instructions
- [ ] All APIs tested with real data
- [ ] Performance optimized (check metrics)

## Deployment Strategy

You need to deploy two main components:

1. **Frontend** (Next.js app) → Vercel
2. **Backend** (Hindsight server) → Self-hosted or Cloud

### Option 1: Full Deployment (Recommended)

```
┌─────────────────────────────────────────────┐
│            PRODUCTION SETUP                 │
├─────────────────────────────────────────────┤
│                                             │
│  Users → Vercel (Frontend) → Your Server   │
│                  ↓                         │
│          Hindsight (Backend)               │
│          Gemini API (Cloud)                │
│                                             │
└─────────────────────────────────────────────┘
```

### Option 2: Heroku/Railway (Simple)

```
┌──────────────────────────────────────────┐
│  Vercel (Frontend)                       │
│           ↓                              │
│  Heroku/Railway (Full-stack with both)   │
│  - Next.js server                        │
│  - Hindsight server                      │
│           ↓                              │
│  Gemini API                              │
└──────────────────────────────────────────┘
```

## Step 1: Deploy Frontend to Vercel

### Option A: GitHub Integration (Easiest)

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/career-mentor.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repo
   - Click "Import"

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add:
     ```
     GEMINI_API_KEY=your_api_key
     HINDSIGHT_API_URL=https://your-hindsight-domain.com
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live at `https://your-project.vercel.app`

### Option B: CLI Deployment

```bash
npm install -g vercel
vercel login
vercel --prod
# Follow the prompts
# Set environment variables when asked
```

## Step 2: Deploy Hindsight Backend

### Option 1: AWS EC2 (Full Control)

1. **Launch EC2 Instance**
   ```bash
   # Ubuntu 22.04 LTS, t2.medium or larger
   # Security group: open ports 22, 80, 443, 8000
   ```

2. **SSH into instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Docker**
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose
   sudo usermod -aG docker ubuntu
   ```

4. **Clone and start Hindsight**
   ```bash
   git clone https://github.com/yourusername/career-mentor.git
   cd career-mentor
   docker-compose up -d
   ```

5. **Set up SSL with Let's Encrypt**
   ```bash
   sudo apt install nginx certbot python3-certbot-nginx
   sudo certbot certonly --standalone -d your-domain.com
   # Configure nginx to proxy to localhost:8000
   ```

6. **Configure Nginx Reverse Proxy**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name your-domain.com;
   
       ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
   
       location / {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Option 2: DigitalOcean App Platform

1. Go to DigitalOcean dashboard
2. Click "Create" → "Apps"
3. Connect GitHub repo
4. Configure:
   - **Build Command**: `docker-compose build`
   - **Run Command**: `docker-compose up`
5. Set environment variables
6. Deploy

### Option 3: Docker Hub + Cloud Run (GCP)

1. **Build and push Docker image**
   ```bash
   docker build -t gcr.io/your-project/hindsight:latest .
   docker push gcr.io/your-project/hindsight:latest
   ```

2. **Deploy to Google Cloud Run**
   ```bash
   gcloud run deploy hindsight \
     --image gcr.io/your-project/hindsight:latest \
     --platform managed \
     --region us-central1 \
     --port 8000 \
     --memory 2Gi
   ```

### Option 4: Railway (Easiest)

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repo
4. Configure `docker-compose.yml`
5. Railway auto-deploys on push

## Step 3: Update Frontend URLs

Once Hindsight is deployed, update your Vercel environment:

```
HINDSIGHT_API_URL=https://your-hindsight-domain.com
```

Then redeploy:
```bash
vercel deploy --prod
```

## SSL/HTTPS Setup

All production URLs must use HTTPS:

```
# Frontend
https://your-project.vercel.app ✅ (automatic)

# Backend
https://your-hindsight-domain.com ✅ (needs setup)

# Update code
HINDSIGHT_API_URL=https://your-hindsight-domain.com
```

## Database Backup

Hindsight stores data locally in `/data` volume:

```bash
# Backup locally
docker exec hindsight_server tar czf - /data > hindsight_backup.tar.gz

# Or configure persistent volume on cloud
# AWS EBS, GCP Persistent Disk, DigitalOcean Block Storage, etc.
```

## Monitoring & Logging

### Vercel Monitoring
- Built-in analytics at vercel.com/dashboard
- Monitor build times, errors, usage

### Hindsight Monitoring
```bash
docker logs -f hindsight_server
# or
docker stats hindsight_server
```

### Error Tracking
Consider adding [Sentry](https://sentry.io):

```typescript
// In your Next.js app
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Performance Optimization

### Frontend (Vercel)
- Automatic CDN optimization
- Image optimization
- Code splitting
- ISR (Incremental Static Regeneration)

### Backend (Hindsight)
```bash
# Use caching
docker run -e CACHE_TTL=3600 hindsight

# Monitor memory
docker stats

# Scale if needed
# Multiple instances behind load balancer
```

## Security Best Practices

### Environment Variables
```bash
# Never commit .env.local
echo ".env.local" >> .gitignore
git rm --cached .env.local

# Use vault systems
# AWS Secrets Manager, GCP Secret Manager, etc.
```

### API Keys
```bash
# Rotate regularly
# Use short-lived tokens if possible
# Monitor API usage

# Hindsight API key (if needed)
# Keep in secure vault
```

### CORS
Update `next.config.js` if needed:
```javascript
// Allow requests from Hindsight domain
const corsOrigins = [
  'https://your-hindsight-domain.com',
];
```

### Rate Limiting
```bash
# Add to reverse proxy
rate_limit requests per IP
```

## Troubleshooting Production

### Hindsight won't connect
```bash
# Check DNS
nslookup your-hindsight-domain.com

# Check SSL
curl -v https://your-hindsight-domain.com

# Check Docker
docker ps
docker logs hindsight_server
```

### Gemini API errors
```bash
# Verify API key
curl -H "Authorization: Bearer YOUR_KEY" \
  https://generativelanguage.googleapis.com/v1beta/models
```

### Performance issues
```bash
# Check Vercel analytics
# Check cloud provider metrics
# Monitor Hindsight memory usage
docker stats hindsight_server
```

## Auto-Scaling

### Vercel
- Automatic (scales based on traffic)
- No configuration needed

### Hindsight (on cloud)
```bash
# Set minimum/maximum instances
# AWS Auto Scaling groups
# GCP Managed Instance Groups
# Azure Auto Scale Sets
```

## Cost Estimation

| Service | Free Tier | Production Cost |
|---------|-----------|-----------------|
| Vercel | 100 deploys/month | $20-80/month |
| Gemini API | 60 calls/min free | Pay-as-you-go |
| EC2 (t2.medium) | 12 months free | ~$30/month |
| DigitalOcean (app) | None | ~$12/month |
| Railway | $5/month free | $5-50/month |

**Budget estimate**: $50-150/month for full production setup

## Scaling Beyond MVP

When you need more capacity:

### Horizontal Scaling
```
Load Balancer
    ├─→ Hindsight Instance 1
    ├─→ Hindsight Instance 2
    └─→ Hindsight Instance 3
```

### Database Scaling
```bash
# Move from local storage to managed:
# AWS RDS, Google Cloud SQL, Azure Database
```

### Cache Layer
```bash
# Add Redis for frequently accessed data
# AWS ElastiCache, Heroku Redis, etc.
```

## Rollback Plan

If deployment fails:

```bash
# Vercel - automatic (revert to previous)
vercel rollback

# Manual rollback
git revert <commit-hash>
git push
vercel deploy --prod

# Hindsight
git revert <commit-hash>
docker-compose down
docker-compose up -d
```

## Deployment Checklist (Final)

- [ ] All tests pass locally
- [ ] Environment variables configured in Vercel
- [ ] Hindsight deployed and accessible
- [ ] HTTPS/SSL working on both domains
- [ ] API keys secured in vaults
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Team notified
- [ ] DNS configured correctly
- [ ] Load testing completed
- [ ] Error tracking enabled
- [ ] Rate limiting active

## Post-Deployment

### Monitor First Week
- Check error logs daily
- Monitor API quota usage
- Track user feedback
- Performance metrics

### Weekly Tasks
- Check backups
- Update dependencies
- Monitor costs
- Review analytics

### Monthly Tasks
- Rotate API keys
- Review security logs
- Plan scaling if needed
- Update documentation

---

**Congratulations! Your Career Mentor is now live! 🚀**

For support:
- Vercel docs: https://vercel.com/docs
- Hindsight docs: https://hindsight.vectorize.io
- GCP Cloud Run: https://cloud.google.com/run/docs
