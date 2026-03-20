# Career Mentor AI - Hindsight Setup Guide

This application uses **Hindsight**, a memory system by Vectorize, to create an AI career mentor that remembers your skills, projects, and internship journey.

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Google Gemini API Key

## Quick Start

### 1. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
HINDSIGHT_API_URL=http://localhost:8000
```

Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 2. Start Hindsight Locally with Docker

First, ensure Docker and Docker Compose are installed. Then:

```bash
# Create a docker-compose.yml file for Hindsight
docker-compose up -d
```

**docker-compose.yml example:**
```yaml
version: '3.8'

services:
  hindsight:
    image: vectorize/hindsight:latest
    ports:
      - "8000:8000"
    environment:
      - LOG_LEVEL=info
    volumes:
      - hindsight_data:/data

volumes:
  hindsight_data:
```

Verify Hindsight is running:
```bash
curl http://localhost:8000/health
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run the Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to start using the Career Mentor.

## How It Works

### Memory System (Hindsight)

The app stores three types of memories in Hindsight:

1. **Experiences**: Skills learned, projects built, applications submitted
2. **Observations**: Insights synthesized from your profile (e.g., "strong in frontend, needs backend")
3. **Mental Models**: Summary of your preferences (e.g., "prefers startup internships")

### AI Integration (Gemini)

The Gemini API provides intelligent responses for:
- Resume feedback and improvement suggestions
- Skill gap analysis for target roles
- Personship recommendations based on your profile
- General career advice and mentoring

### Data Flow

```
User Input → Server Actions → Hindsight (Memory) + Gemini API → AI Response → UI
```

## Features

### 1. Dashboard
- Overview of your career journey
- Profile completeness tracker
- Quick stats and recommendations

### 2. Skills Tracker
- Add and manage technical and soft skills
- Track proficiency levels
- Memory remembers all skills for future reference

### 3. Projects Tracker
- Document completed projects
- Link to GitHub repositories
- Highlight key technologies used

### 4. Resume Feedback
- Upload your resume
- Get AI-powered feedback
- Suggestions for improvement

### 5. Skill Gap Analysis
- Define your target role
- Identify missing skills
- Get learning recommendations

### 6. Internship Recommendations
- Receive personalized recommendations
- Track applications
- Get matching score based on your profile

### 7. Mentor Chat
- Real-time conversation with AI mentor
- Ask career questions
- Get advice based on your remembered profile

## API Endpoints

The app communicates with Hindsight through Server Actions:

- `POST /api/hindsight/memory/create` - Store a memory
- `GET /api/hindsight/memory/recall` - Retrieve memories
- `POST /api/hindsight/memory/query` - Query memories semantically

## Troubleshooting

### Hindsight Connection Issues
```bash
# Check if Hindsight is running
docker ps | grep hindsight

# View Hindsight logs
docker logs -f <hindsight_container_id>

# Restart Hindsight
docker-compose restart hindsight
```

### Gemini API Issues
- Verify API key is correct in `.env.local`
- Check your API quota at Google AI Studio
- Ensure you have credits/billing enabled

### Port Conflicts
- Change Hindsight port in docker-compose.yml if 8000 is busy
- Update `HINDSIGHT_API_URL` to match new port

## Advanced Configuration

### Custom Memory Types

Edit `lib/hindsight.ts` to define custom memory types:

```typescript
const memoryTypes = {
  'skill': 'Technical and professional skills',
  'project': 'Completed projects and experiences',
  'application': 'Internship applications and status',
  'observation': 'Synthesized insights about the user',
  'goal': 'Career goals and aspirations'
};
```

### Customize AI Prompts

Edit `lib/gemini.ts` to customize mentor prompts and behavior.

## Deployment

To deploy this app:

1. Deploy frontend to Vercel
2. Deploy Hindsight backend (self-hosted or cloud)
3. Set environment variables in Vercel project settings
4. Update `HINDSIGHT_API_URL` to your production URL

## Performance Tips

- Hindsight stores memories locally by default (no external DB needed)
- First request is slower due to memory initialization
- Use semantic queries for better results
- Batch memory updates for efficiency

## Support

For issues with:
- **Hindsight**: [Hindsight Documentation](https://hindsight.vectorize.io)
- **Gemini API**: [Google AI Studio](https://makersuite.google.com)
- **This App**: Check the components and lib folders for implementation details

---

**Built for the Hindsight Hackathon** 🚀
