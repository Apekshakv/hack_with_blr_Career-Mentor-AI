# Quick Reference Card

Keep this handy while developing!

## Setup Commands

```bash
# Initial setup
docker-compose up -d          # Start Hindsight
cp .env.example .env.local    # Copy env template
pnpm install                  # Install dependencies
pnpm dev                       # Start dev server

# Cleanup
docker-compose down           # Stop Hindsight
Ctrl+C                        # Stop dev server
pnpm build                    # Build for production
```

## Development

```bash
# View logs
docker-compose logs hindsight        # Hindsight logs
docker-compose logs -f hindsight     # Follow logs

# Health checks
curl http://localhost:8000/health    # Hindsight health

# Ports
3000  = Next.js app
8000  = Hindsight API
```

## Environment Variables

```env
# Required
GEMINI_API_KEY=sk-...
HINDSIGHT_API_URL=http://localhost:8000

# Optional
NODE_ENV=development
```

## File Structure

```
app/
├── page.tsx              # Entry point
├── layout.tsx            # Root layout
├── globals.css           # Global styles
└── actions.ts            # Server actions

components/
├── dashboard.tsx         # Main hub
├── skills-tracker.tsx    # Skills
├── projects-tracker.tsx  # Projects
├── resume-feedback.tsx   # Resume
├── skill-gap-analysis.tsx # Gaps
├── internship-recommendations.tsx
├── mentor-chat.tsx       # Chat
└── navigation.tsx        # Nav

lib/
├── types.ts              # Types
├── hindsight.ts          # Memory API
├── gemini.ts             # AI API
└── utils.ts              # Utilities
```

## Common Code Patterns

### Add a Skill
```typescript
await addSkill(userId, {
  name: 'React',
  level: 'Advanced'
});
```

### Get Mentor Feedback
```typescript
const feedback = await getMentorFeedback(
  userId,
  'resume',
  resumeContent
);
```

### Query Memories
```typescript
const memories = await queryMemories(userId, {
  query: 'What skills do I have?',
  limit: 10
});
```

### Generate Response
```typescript
const response = await generateMentorResponse(
  'resume-feedback',
  userContent,
  context
);
```

## Component Props Pattern

```typescript
interface ComponentProps {
  userId: string;
  profile: UserProfile;
  onProfileUpdate?: () => void;
}

export default function Component({ 
  userId, 
  profile, 
  onProfileUpdate 
}: ComponentProps) {
  // ...
}
```

## Styling

### Colors
```
Primary:    oklch(0.45 0.28 264.4)    # Deep Purple
Secondary:  oklch(0.48 0.25 264.4)    # Medium Purple
Accent:     oklch(0.7 0.15 260)       # Light Purple
Background: oklch(0.98 0.001 219.4)   # Off-white
```

### Common Classes
```
Text:      text-foreground, text-muted-foreground
BG:        bg-background, bg-card, bg-muted
Border:    border-border, border-border/50
Spacing:   p-4, m-2, gap-4, space-y-4
```

## Deployment Checklist

- [ ] `.env.local` created (never committed)
- [ ] GEMINI_API_KEY obtained
- [ ] Hindsight set up locally
- [ ] `pnpm dev` runs without errors
- [ ] All features tested
- [ ] No console errors
- [ ] Ready for production

### To Deploy Frontend
```bash
vercel deploy --prod
```

### To Deploy Backend
```bash
# Choose: AWS, DigitalOcean, Railway, etc
# See DEPLOYMENT.md for options
```

## Debugging Checklist

```bash
# 1. Check environment
echo $GEMINI_API_KEY    # Should not be empty
docker-compose ps       # Should show hindsight running

# 2. Check health
curl http://localhost:8000/health    # Should be OK
curl http://localhost:3000           # Should load

# 3. Check logs
docker-compose logs hindsight
npm run build  # Check for errors

# 4. Test locally
# Open http://localhost:3000
# Create profile
# Add skill
# Try chat
```

## Memory Types

| Type | Purpose | Example |
|------|---------|---------|
| Experience | Event/fact | "Built e-commerce app" |
| Observation | Insight | "Strong frontend, needs DevOps" |
| Mental Model | Summary | "Wants startup job" |

## Hindsight API Endpoints

```bash
POST /memories              # Create memory
GET  /memories/:id          # Get one
POST /memories/query        # Search
PUT  /memories/:id          # Update
DELETE /memories/:id        # Delete
GET  /health                # Health check
```

## Gemini API Models

```
gemini-pro          # Text generation
gemini-pro-vision   # Image understanding
gemini-1.5-flash    # Fast, efficient
```

## TypeScript Interfaces

### UserProfile
```typescript
interface UserProfile {
  userId: string;
  name: string;
  email: string;
  skills: Skill[];
  projects: Project[];
  applications: Application[];
  resume?: string;
  createdAt: Date;
}
```

### Skill
```typescript
interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsExperience: number;
}
```

### Project
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  completedDate: Date;
}
```

## Performance Tips

- Cache memories (5-10 min TTL)
- Batch API calls when possible
- Lazy load components
- Use pagination for lists
- Debounce search queries

## Security

- ✅ API keys in env only
- ✅ No secrets in code
- ✅ HTTPS for production
- ✅ User isolation in memories
- ✅ Input validation
- ✅ Server-side API calls

## Useful Links

| Resource | URL |
|----------|-----|
| Get Gemini Key | https://makersuite.google.com/app/apikey |
| Hindsight Docs | https://hindsight.vectorize.io |
| Next.js Docs | https://nextjs.org/docs |
| Tailwind CSS | https://tailwindcss.com |
| shadcn/ui | https://ui.shadcn.com |

## Command Shortcuts

```bash
# Development
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run linting
npm run type-check  # Check types

# Docker
docker ps        # List containers
docker logs -f <name>  # Follow logs
docker exec -it <name> bash  # Shell access

# Git
git status       # Check status
git add .        # Stage all
git commit -m "message"  # Commit
git push         # Push to remote
```

## Feature Checklist

### MVP Features
- [x] Dashboard
- [x] Skills tracker
- [x] Projects tracker
- [x] Resume feedback
- [x] Skill gap analysis
- [x] Internship recommendations
- [x] Mentor chat

### Future Features
- [ ] LinkedIn integration
- [ ] Mock interviews
- [ ] Peer network
- [ ] Learning paths
- [ ] Job alerts
- [ ] Analytics

## Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| Port in use | `lsof -i :port` then `kill -9 PID` |
| No Docker | Install from docker.com |
| API key error | Check `.env.local` |
| Hindsight down | `docker-compose restart` |
| Build error | `rm -rf .next` then rebuild |
| Type error | Check imports and types |

## Copy-Paste Commands

```bash
# Full setup in one go
docker-compose up -d && cp .env.example .env.local && pnpm install && pnpm dev

# Quick restart
docker-compose restart && pnpm dev

# Full cleanup
docker-compose down && rm -rf .next node_modules && pnpm install
```

## Remember

- ✅ Save `.env.local` in secure location
- ✅ Never commit secrets
- ✅ Test locally before deploying
- ✅ Check Hindsight is running
- ✅ Verify API key is valid
- ✅ Read error messages carefully
- ✅ Check docs first before asking
- ✅ Keep dependencies updated

---

**Print this and keep it handy!** 📋
