# 🚀 Career Mentor AI - START HERE

Welcome to the AI Career Mentor, powered by Hindsight memory system!

This document will get you up and running in the fastest way possible.

---

## What Is This?

An intelligent AI career coach that:
- **Remembers** your skills, projects, and career journey (using Hindsight)
- **Analyzes** your resume and provides feedback
- **Finds** internships matched to your profile
- **Identifies** skill gaps for your target role
- **Chats** with you about career questions

---

## Get Started in 3 Steps

### Step 1: Get Your API Key (2 minutes)
1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy it (you'll use it in Step 3)

### Step 2: Start the Memory System (1 minute)
```bash
docker-compose up -d
```
Done! Hindsight is now running.

### Step 3: Configure & Run (2 minutes)
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and paste your API key
# GEMINI_API_KEY=your_key_here

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Step 4: Open in Browser
Visit **http://localhost:3000** and create a profile!

---

## That's It! 🎉

You now have a working AI career mentor. Start by:
1. **Adding Skills** - List your technical skills
2. **Adding Projects** - Document what you've built
3. **Asking Mentor** - Click "Chat with Mentor" for guidance
4. **Getting Feedback** - Upload a resume for AI feedback

---

## Next Steps

### Want to learn more?
- 📖 Read [README.md](./README.md) for feature overview
- 🔧 Check [QUICKSTART.md](./QUICKSTART.md) for detailed setup
- 📚 See [DOCS_INDEX.md](./DOCS_INDEX.md) for all documentation

### Want to deploy to production?
- 🌐 Read [DEPLOYMENT.md](./DEPLOYMENT.md)
- 📋 Choose your hosting (Vercel, AWS, DigitalOcean, etc.)

### Having issues?
- 🆘 Check [GETTING_HELP.md](./GETTING_HELP.md)
- 🐛 Most issues have quick fixes there

### Want to customize it?
- 💻 Check [BUILD_SUMMARY.md](./BUILD_SUMMARY.md) for code structure
- 📝 See [HINDSIGHT_EXAMPLES.md](./HINDSIGHT_EXAMPLES.md) for API usage

---

## Quick Reference

### Important Commands
```bash
# Start everything
docker-compose up -d
pnpm dev

# Stop everything
Ctrl+C  # stop dev server
docker-compose down  # stop Hindsight

# Troubleshoot
docker-compose logs hindsight  # view Hindsight logs
curl http://localhost:8000/health  # check Hindsight health
```

### Important URLs
```
Your app:       http://localhost:3000
Hindsight API:  http://localhost:8000
Health check:   http://localhost:8000/health
Get API key:    https://makersuite.google.com
```

### Important Files
```
Configuration:  .env.local (keep secret!)
Dependencies:   docker-compose.yml (for Hindsight)
Starting point: app/page.tsx
```

---

## Tech Stack

- **Frontend**: Next.js 16 + React 19
- **Styling**: Tailwind CSS
- **Memory**: Hindsight (runs locally)
- **AI**: Google Gemini API
- **Deployment**: Vercel (frontend) + your choice (backend)

All modern, production-ready tools.

---

## Features

✅ **Dashboard** - Career overview  
✅ **Skills Tracker** - Document your abilities  
✅ **Projects Tracker** - Build your portfolio  
✅ **Resume Feedback** - AI-powered suggestions  
✅ **Skill Gap Analysis** - Find missing skills  
✅ **Internship Finder** - Personalized matches  
✅ **Mentor Chat** - Ask your AI coach  

---

## Need Help?

| Issue | Read This |
|-------|-----------|
| Nothing works | [GETTING_HELP.md](./GETTING_HELP.md) |
| Can't get started | [QUICKSTART.md](./QUICKSTART.md) |
| Want to understand it | [README.md](./README.md) |
| Deploying to production | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| API questions | [HINDSIGHT_EXAMPLES.md](./HINDSIGHT_EXAMPLES.md) |
| All documentation | [DOCS_INDEX.md](./DOCS_INDEX.md) |

---

## Common Questions

**Q: Do I need a database?**  
A: No! Hindsight is your memory system.

**Q: Does this work offline?**  
A: Yes, locally. Hindsight runs on your machine.

**Q: What happens when I deploy?**  
A: Deploy frontend to Vercel, backend to your choice.

**Q: Is my data private?**  
A: Yes, you control where data is stored.

**Q: Can I modify the AI responses?**  
A: Yes, edit `lib/gemini.ts` for custom prompts.

**Q: How much does this cost?**  
A: Hindsight is free. Gemini API is pay-as-you-go (~$5-20/month for typical use).

---

## What Happens Next?

### In 5 Minutes
- [ ] Get API key
- [ ] Start Hindsight
- [ ] Run app
- [ ] Create profile

### In 30 Minutes
- [ ] Add skills
- [ ] Add projects
- [ ] Try resume feedback
- [ ] Chat with mentor

### In 1 Hour
- [ ] Explore all features
- [ ] Try skill gap analysis
- [ ] Get internship matches
- [ ] Understand how it works

### When Ready to Deploy
- [ ] Read DEPLOYMENT.md
- [ ] Deploy frontend to Vercel
- [ ] Deploy Hindsight backend
- [ ] Share with others

---

## How Hindsight Works (30 seconds)

```
You add skills/projects
       ↓
Hindsight remembers them
       ↓
AI asks Hindsight about you
       ↓
AI provides personalized advice
       ↓
Hindsight learns more about you
```

Each interaction makes the mentor smarter. That's the power of memory!

---

## Example: First Use

```
1. You: Create profile (name, email)
2. System: Creates first memory
3. You: Add "React" skill
4. System: Stores in Hindsight
5. You: Add 5 more skills
6. System: Starts understanding your profile
7. You: Ask "What should I learn?"
8. Mentor: Gives advice based on YOUR profile
9. You: Get internship matches
10. System: Shows 5 companies matching YOUR interests
```

All personalized because Hindsight remembers everything about you.

---

## Ready? Let's Go! 🚀

```bash
# Copy and paste these commands:

# 1. Start Hindsight
docker-compose up -d

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local and add your API key

# 3. Install and run
pnpm install
pnpm dev

# 4. Open browser
open http://localhost:3000
```

That's it! You're running the AI Career Mentor.

---

## 5-Minute Walkthrough

1. **Create Profile** (30 sec)
   - Enter name and email
   - Click "Start Your Journey"

2. **Add Skills** (1 min)
   - Click "Add Skills" tab
   - Add 3-5 of your skills
   - System remembers them

3. **Chat with Mentor** (2 min)
   - Click "Mentor Chat" tab
   - Type: "What should I focus on learning?"
   - See personalized advice

4. **Get Resume Feedback** (1.5 min)
   - Click "Resume" tab
   - Paste your resume
   - Get AI feedback

---

## Success Checklist

- [ ] Docker and Node installed
- [ ] API key from Google obtained
- [ ] `.env.local` created with API key
- [ ] `docker-compose up -d` ran successfully
- [ ] `pnpm dev` running without errors
- [ ] App loads at http://localhost:3000
- [ ] Can create profile
- [ ] Can add skills
- [ ] Can chat with mentor

If all checked, you're ready to go! 🎉

---

## Common Issues (Instant Fixes)

**App won't start?**
```bash
# Check if ports are free
lsof -i :3000
# Kill if needed: kill -9 <PID>
```

**Hindsight won't connect?**
```bash
# Check if running
docker-compose ps
# If not, start it
docker-compose up -d
```

**API key error?**
```bash
# Check .env.local has your key
cat .env.local | grep GEMINI_API_KEY
# If empty, add it and restart dev server
```

More issues? See [GETTING_HELP.md](./GETTING_HELP.md)

---

## You're All Set! 

You now have an AI career mentor that:
- ✅ Remembers everything about you
- ✅ Gives personalized advice
- ✅ Improves over time
- ✅ Helps you land internships
- ✅ Develops your skills

All powered by Hindsight memory system.

**Next**: Read [README.md](./README.md) to understand all features, or start using the app!

---

## Questions?

- **Setup issues**: [GETTING_HELP.md](./GETTING_HELP.md)
- **How to use**: [README.md](./README.md)
- **More docs**: [DOCS_INDEX.md](./DOCS_INDEX.md)
- **Deploy**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Code examples**: [HINDSIGHT_EXAMPLES.md](./HINDSIGHT_EXAMPLES.md)

---

**Built for the Hindsight Hackathon** 🧠🚀

Your intelligent AI career coach awaits. Let's build your future! 💪
