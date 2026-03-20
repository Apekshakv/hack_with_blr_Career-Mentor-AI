# Hindsight API Examples

This guide shows how to use Hindsight in the Career Mentor application.

## Overview

Hindsight is a memory system that helps AI agents remember and learn from interactions. In our Career Mentor, it stores:

- **Skills & Experiences**: What you've learned and built
- **Career Insights**: Patterns in your preferences and goals
- **Mental Models**: Your ideal career path

## Core Concepts

### Memory Types

1. **Experiences** - Events and facts
   ```
   "Learned React in 2023"
   "Built e-commerce app with 500 users"
   "Applied to 5 startups"
   ```

2. **Observations** - Synthesized insights
   ```
   "Strong frontend skills, needs DevOps experience"
   "Prefers small team environments"
   "Learning velocity: 2 new skills per month"
   ```

3. **Mental Models** - Summaries
   ```
   "Ideal role: Junior Frontend Engineer at startup"
   "Tech stack preference: React, Node.js, PostgreSQL"
   "Career goal: CTO in 5 years"
   ```

## Usage Examples

### 1. Store a Skill Memory

```typescript
// lib/hindsight.ts
import { HindsightClient } from './hindsight';

const client = new HindsightClient('http://localhost:8000');

// Store a skill experience
await client.createMemory('user-123', {
  type: 'experience',
  content: 'Learned React and built 3 production applications',
  metadata: {
    category: 'technical-skill',
    skill: 'React',
    level: 'Advanced',
    projectCount: 3,
    yearsExperience: 2
  }
});
```

### 2. Store a Project Memory

```typescript
await client.createMemory('user-123', {
  type: 'experience',
  content: 'Built full-stack e-commerce platform with React, Node.js, and MongoDB. Implemented shopping cart, payment processing, and admin dashboard.',
  metadata: {
    category: 'project',
    projectName: 'TechShop E-commerce',
    technologies: ['React', 'Node.js', 'MongoDB'],
    deploymentUrl: 'https://techshop-demo.com',
    linesOfCode: 15000,
    completionDate: '2024-01-15'
  }
});
```

### 3. Query for Skill Recommendations

```typescript
// Ask Hindsight what skills to learn next
const memories = await client.queryMemories('user-123', {
  query: 'What technical skills do I have and what should I learn next for backend development?',
  limit: 10
});

// Response includes memories about current skills + insights
// Then pass to Gemini for personalized recommendations
const recommendation = await generateMentorResponse(
  'Based on your experience, here are skills to focus on...'
);
```

### 4. Store Career Goal Memory

```typescript
await client.createMemory('user-123', {
  type: 'mental-model',
  content: 'User aspires to become a full-stack engineer, prefers startup environments with 10-50 people, interested in AI/ML applications',
  metadata: {
    category: 'career-goal',
    targetRole: 'Full-Stack Engineer',
    preferredCompanySize: '10-50',
    targetIndustries: ['AI', 'FinTech', 'SaaS'],
    salaryExpectation: 80000,
    timeline: '6 months'
  }
});
```

### 5. Recall Memories for Resume Feedback

```typescript
// Get user's portfolio for context
const portfolio = await client.queryMemories('user-123', {
  query: 'List all projects, skills, and achievements',
  type: 'experience'
});

// Send to Gemini with resume for feedback
const feedback = await generateResumeFeedback(resume, portfolio);
```

### 6. Get Internship Recommendations

```typescript
// Query user profile memories
const profile = await client.queryMemories('user-123', {
  query: 'User profile including skills, interests, and goals',
  limit: 20
});

// Send to Gemini for personalized recommendations
const recommendations = await generateInternshipMatches(profile);
```

### 7. Update Observation

```typescript
// As system learns, update observations about user
await client.updateMemory('observation-456', {
  type: 'observation',
  content: 'User has strong frontend skills (React, Vue), intermediate backend (Node.js), and growing DevOps knowledge. Prefers startups over large enterprises. Learning trajectory suggests full-stack engineer path.',
  metadata: {
    lastUpdated: new Date(),
    confidence: 0.95
  }
});
```

### 8. Application Tracking

```typescript
// Store internship application
await client.createMemory('user-123', {
  type: 'experience',
  content: 'Applied to Google STEP internship program for frontend engineering',
  metadata: {
    category: 'application',
    company: 'Google',
    position: 'STEP Program - Frontend',
    applicationDate: '2024-02-01',
    status: 'submitted',
    matchScore: 0.87,
    keyRequirements: ['Data Structures', 'Web Development', 'Python/Java']
  }
});
```

## Server Action Implementation

Here's how to implement memory operations in server actions:

```typescript
// app/actions.ts
'use server';

import { HindsightClient } from '@/lib/hindsight';
import { generateMentorResponse } from '@/lib/gemini';

const hindsight = new HindsightClient(
  process.env.HINDSIGHT_API_URL || 'http://localhost:8000'
);

export async function addSkill(
  userId: string, 
  skill: { name: string; level: string; }
) {
  // Store in Hindsight
  const memory = await hindsight.createMemory(userId, {
    type: 'experience',
    content: `Developed proficiency in ${skill.name} at ${skill.level} level`,
    metadata: {
      category: 'skill',
      skillName: skill.name,
      level: skill.level,
      addedDate: new Date()
    }
  });

  return memory;
}

export async function getMentorFeedback(
  userId: string,
  feedbackType: string,
  content: string
) {
  // Get user memories for context
  const context = await hindsight.queryMemories(userId, {
    query: 'User profile and experience',
    limit: 10
  });

  // Generate personalized feedback with Gemini
  const feedback = await generateMentorResponse(
    feedbackType,
    content,
    context
  );

  // Store the feedback interaction
  await hindsight.createMemory(userId, {
    type: 'observation',
    content: `Mentor provided ${feedbackType} feedback: ${feedback.summary}`,
    metadata: {
      feedbackType,
      timestamp: new Date(),
      keyPoints: feedback.keyPoints
    }
  });

  return feedback;
}
```

## Hindsight API Endpoints

### POST /memories

Create a new memory for a user.

```bash
curl -X POST http://localhost:8000/memories \
  -H "Content-Type: application/json" \
  -d {
    "userId": "user-123",
    "type": "experience",
    "content": "Memory content",
    "metadata": {}
  }
```

### GET /memories/:id

Retrieve a specific memory.

```bash
curl http://localhost:8000/memories/memory-123
```

### POST /memories/query

Query memories semantically.

```bash
curl -X POST http://localhost:8000/memories/query \
  -H "Content-Type: application/json" \
  -d {
    "userId": "user-123",
    "query": "What frontend frameworks do I know?",
    "limit": 5
  }
```

### PUT /memories/:id

Update an existing memory.

```bash
curl -X PUT http://localhost:8000/memories/memory-123 \
  -H "Content-Type: application/json" \
  -d {
    "content": "Updated content",
    "metadata": {}
  }
```

### DELETE /memories/:id

Delete a memory.

```bash
curl -X DELETE http://localhost:8000/memories/memory-123
```

## Best Practices

1. **Rich Metadata**: Always include structured metadata for better querying
   ```typescript
   metadata: {
     category: 'skill',
     skillName: 'React',
     level: 'Advanced',
     yearsExperience: 2,
     projects: ['ProjectA', 'ProjectB']
   }
   ```

2. **Semantic Queries**: Use natural language for querying
   ```typescript
   // Good
   "What are my strongest technical skills?"
   "Where should I focus my learning?"
   
   // Less effective
   "skills"
   "learning"
   ```

3. **Update Periodically**: Refresh observations as user progresses
   ```typescript
   // Update every 5-10 additions or quarterly
   await updateObservations(userId);
   ```

4. **Context-Aware Responses**: Use memories when generating responses
   ```typescript
   const userContext = await hindsight.queryMemories(userId, query);
   const response = await gemini.generate({
     userContext,
     question: userQuestion
   });
   ```

5. **Privacy**: All memories are stored per user (user-123 only sees own memories)

## Performance Tips

- Batch operations: Store multiple memories in one request when possible
- Limit queries: Set reasonable limits (5-20) for large user profiles
- Cache: Consider caching frequently accessed memories for 5-10 minutes
- Async: Always use async/await, don't block on memory operations

## Troubleshooting

### "Hindsight connection refused"
```bash
docker-compose ps  # Check if Hindsight is running
curl http://localhost:8000/health  # Test connection
```

### Memory not found after storing
```bash
# Hindsight needs a moment to index
await new Promise(resolve => setTimeout(resolve, 100));
const memory = await hindsight.getMemory(memoryId);
```

### Query returns no results
```typescript
// Try broader query
// Instead of: "specific technology X"
// Use: "technologies I have experience with"

// Check memory was created
const allMemories = await hindsight.getMemoriesByUser(userId);
```

## Real-World Flow

### Student Creates Profile
```
1. User enters name, email
2. createProfile() → creates first experience memory
3. Dashboard loads
```

### Student Adds Skills
```
1. User clicks "Add Skill" → fills form
2. addSkill() → stores in Hindsight
3. System generates observation (if 5+ skills added)
4. Mentor can now reference skills in feedback
```

### Student Gets Resume Feedback
```
1. User uploads resume
2. getResumeFeedback() → queries Hindsight for context
3. Send resume + context to Gemini
4. Generate personalized feedback
5. Store interaction as observation
```

### Student Gets Internship Matches
```
1. getInternshipRecommendations() → query memories
2. Pass to Gemini with internship database
3. Generate matches based on user profile
4. Return ranked recommendations
5. Track applications in Hindsight
```

---

For more, see [Hindsight Documentation](https://hindsight.vectorize.io)
