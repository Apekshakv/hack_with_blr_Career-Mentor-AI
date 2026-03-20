# Quick Start Guide - Career Mentor AI

Get up and running in 5 minutes!

## Step 1: Get Your API Key (2 minutes)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key (you'll need this in Step 3)

## Step 2: Start Hindsight (1 minute)

Make sure you have Docker installed, then:

```bash
cd career-mentor
docker-compose up -d
```

Verify it's running:
```bash
curl http://localhost:8000/health
```

You should see: `{"status":"healthy"}`

## Step 3: Configure Environment (1 minute)

Create `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API key:

```
GEMINI_API_KEY=paste_your_key_here
HINDSIGHT_API_URL=http://localhost:8000
```

## Step 4: Install & Run (1 minute)

```bash
pnpm install
pnpm dev
```

## Step 5: Open in Browser

Visit **[http://localhost:3000](http://localhost:3000)**

Create a profile and start exploring!

## What to Try First

1. **Add Skills** - Add your top 5 programming skills
2. **Add a Project** - Document one project you've built
3. **Get Resume Feedback** - Paste a sample resume and see AI feedback
4. **Chat with Mentor** - Ask career questions like "What should I learn next?"

## Common Issues

### Hindsight won't start
```bash
docker-compose ps
docker-compose logs hindsight
```

### API key error
- Copy-paste exactly from Google AI Studio (no spaces)
- Make sure `.env.local` file exists
- Run `pnpm dev` again

### Port 3000 already in use
```bash
pnpm dev -- -p 3001
```

### Port 8000 already in use
Edit `docker-compose.yml` and change `8000:8000` to `8001:8000`

## Architecture Quick Overview

```
You (Browser)
    ↓
Next.js App (Frontend)
    ↓
Server Actions
    ↓
Hindsight (Memory) ← remembers your profile
Gemini API (Intelligence) ← provides feedback
    ↓
AI Response
```

## Features Overview

| Feature | What it does |
|---------|-------------|
| **Skills Tracker** | Remember your technical skills |
| **Projects Tracker** | Document what you've built |
| **Resume Feedback** | Get AI suggestions to improve your resume |
| **Skill Gap Analysis** | Find missing skills for your target role |
| **Internship Finder** | Get personalized internship matches |
| **Mentor Chat** | Ask your AI mentor anything |

## Next Steps

- Read [README.md](./README.md) for full feature overview
- Check [HINDSIGHT_SETUP.md](./HINDSIGHT_SETUP.md) for advanced setup
- Review [HINDSIGHT_EXAMPLES.md](./HINDSIGHT_EXAMPLES.md) for API usage

## Deploying

When ready to share with others:

```bash
# Deploy frontend to Vercel
vercel deploy

# Deploy Hindsight (requires own infrastructure)
# See HINDSIGHT_SETUP.md for options
```

---

**That's it!** You now have a working AI career mentor. Start by adding your skills and ask the mentor for guidance. The more you use it, the smarter it gets! 🚀
