# Career Mentor AI - Powered by Hindsight

An intelligent AI career mentor that uses Hindsight memory system to remember your skills, projects, internship applications, and provide personalized career guidance.

## Overview

Career Mentor AI is a full-stack web application built for the Hindsight hackathon that helps students and early-career professionals:

- **Track Skills & Projects**: Document your technical skills and completed projects
- **Get Resume Feedback**: Receive AI-powered feedback on your resume
- **Analyze Skill Gaps**: Identify missing skills for your target roles
- **Find Internships**: Get personalized internship recommendations
- **Chat with Mentor**: Have real-time conversations with your AI career coach

The app uses **Hindsight** to persistently remember your profile, so the AI mentor becomes more intelligent and personalized over time.

## Tech Stack

- **Frontend**: Next.js 16 with React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui components
- **Memory**: Hindsight (Vectorize) - runs locally via Docker
- **AI**: Google Gemini API
- **State Management**: React hooks + Server Actions
- **Hosting Ready**: Deploy to Vercel

## Features

### 🎯 Dashboard
- Career journey overview
- Profile completeness tracker
- Quick stats on skills, projects, applications
- Recommended next steps

### 📚 Skills Tracker
- Add technical and soft skills
- Track proficiency levels
- Organize by categories
- Mentor remembers all skills

### 🏗️ Projects Tracker
- Document completed projects
- Add descriptions, technologies, links
- Highlight key accomplishments
- Build your portfolio

### 📄 Resume Feedback
- Upload and paste resume content
- Get AI-powered feedback
- Improvement suggestions
- Tailored to your field

### 🔍 Skill Gap Analysis
- Define your target role/company
- Identify missing skills
- Get learning roadmap
- Priority-ranked recommendations

### 💼 Internship Recommendations
- Personalized internship matches
- Compatibility scoring
- Application tracking
- Role-specific tips

### 💬 Mentor Chat
- Real-time AI conversation
- Context-aware responses (remembers your profile)
- Career advice and guidance
- Ask anything about your journey

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Google Gemini API Key ([Get one free](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone and install:**
```bash
git clone <repo-url>
cd career-mentor
pnpm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY
```

3. **Start Hindsight locally:**
```bash
docker-compose up -d
```

4. **Run development server:**
```bash
pnpm dev
```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Project Structure

```
career-mentor/
├── app/
│   ├── page.tsx              # Welcome/login page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles & theme
│   └── actions.ts            # Server actions
├── components/
│   ├── dashboard.tsx         # Main dashboard
│   ├── skills-tracker.tsx    # Skills management
│   ├── projects-tracker.tsx  # Projects portfolio
│   ├── resume-feedback.tsx   # Resume analysis
│   ├── skill-gap-analysis.tsx # Gap identification
│   ├── internship-recommendations.tsx
│   ├── mentor-chat.tsx       # AI chat interface
│   └── navigation.tsx        # Sidebar nav
├── lib/
│   ├── types.ts              # TypeScript types
│   ├── hindsight.ts          # Hindsight client
│   ├── gemini.ts             # Gemini API wrapper
│   └── utils.ts              # Utilities
├── public/
│   └── hero-mentor.jpg       # Hero image
├── HINDSIGHT_SETUP.md        # Detailed setup guide
└── docker-compose.yml        # Docker config
```

## How Hindsight Memory Works

The app stores three types of memories:

### 1. Experiences
- Skills you've learned
- Projects you've completed
- Internship applications you've submitted
- Real-world experiences and achievements

### 2. Observations
- Synthesized insights (e.g., "Strong in frontend, needs backend")
- Patterns in your career interests
- Areas of strengths and weaknesses
- Learning velocity and style

### 3. Mental Models
- Your ideal role and company type
- Career aspirations and goals
- Preferred tech stacks
- Work culture preferences

## API Integration

### Hindsight
- Stores and recalls user memories
- Semantic search through memories
- Contextual awareness for responses
- Running locally on `http://localhost:8000`

### Google Gemini
- Provides intelligent mentor responses
- Analyzes resumes and provides feedback
- Generates skill recommendations
- Creates personalized internship matches

## Example Usage

```typescript
// Store a memory in Hindsight
await storeMemory('skill', {
  name: 'React',
  level: 'Advanced',
  yearsExp: 2,
  projects: ['Project A', 'Project B']
});

// Get AI feedback
const feedback = await getMentorFeedback(userId, 'resume', resumeContent);

// Get recommendations
const internships = await getInternshipRecommendations(userId);
```

## Performance Optimizations

- Server-side memory management (no client storage)
- Semantic caching of frequently accessed memories
- Efficient batch updates
- Stream responses for chat

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import repo to Vercel
3. Set environment variables:
   - `GEMINI_API_KEY`
   - `HINDSIGHT_API_URL` (your deployed Hindsight URL)
4. Deploy

### Deploy Hindsight Backend

Options:
- Self-hosted on your infrastructure
- Cloud deployment (AWS, GCP, Azure)
- Docker container orchestration (Kubernetes)

## Design System

**Color Palette:**
- Primary: Deep purple/blue (RGB: 0x453f9e)
- Accent: Bright purple (RGB: 0xb3a6f7)
- Neutral: White/gray for backgrounds
- Text: Dark gray for light mode, light gray for dark mode

**Typography:**
- Headings: Sans-serif, bold
- Body: Sans-serif, regular
- Code: Monospace

**Components:**
- All UI built with shadcn/ui
- Responsive design (mobile-first)
- Dark mode support

## Future Enhancements

- [ ] Integration with LinkedIn for skill verification
- [ ] Mock interviews with video recording
- [ ] Peer mentoring network
- [ ] Salary negotiation coaching
- [ ] Career path visualization
- [ ] Job market analysis
- [ ] Learning resource recommendations
- [ ] Real-time job alerts

## Contributing

This is a hackathon project. Feel free to fork, modify, and improve!

## Support

**Stuck on setup?**
1. Check [HINDSIGHT_SETUP.md](./HINDSIGHT_SETUP.md) for detailed instructions
2. Verify Docker is running: `docker ps`
3. Check Hindsight health: `curl http://localhost:8000/health`
4. Verify API key is set: `echo $GEMINI_API_KEY`

**Questions about features?**
- Review component source in `/components`
- Check server actions in `/app/actions.ts`
- See integration logic in `/lib`

## License

MIT - Built for the Hindsight Hackathon

## Acknowledgments

- Built with [Hindsight](https://hindsight.vectorize.io) - Memory system for AI agents
- AI powered by [Google Gemini API](https://makersuite.google.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Framework: [Next.js](https://nextjs.org)

---

**Made for the Hindsight Hackathon** 🚀

Have an amazing career journey with your AI mentor!
