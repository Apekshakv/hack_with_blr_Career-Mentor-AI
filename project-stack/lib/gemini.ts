// Gemini AI Integration for Career Mentor
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Fallback mock feedback for when API quota is exceeded
function getMockFeedback(topic: string, userProfile: any): string {
  const mockResponses: Record<string, string> = {
    resume: `**Resume Analysis & Feedback** (Demo Mode)

📊 **3 Key Strengths:**
1. Clear structure and organization - your resume layout makes it easy to scan
2. Project experience section - demonstrates hands-on learning and initiative
3. Relevant technical skills - good foundation for internship applications

⚠️ **3 Areas for Improvement:**
1. Quantify achievements - add metrics (e.g., "increased efficiency by 30%")
2. Add more context to projects - explain the challenge, solution, and impact
3. Tailor for each position - customize your resume to highlight relevant experience

✅ **5 Action Items:**
1. Review job descriptions and mirror keywords in your resume
2. Add 2-3 quantifiable metrics to each bullet point
3. Include a brief summary statement at the top
4. Ensure consistent formatting and spacing
5. Have 2-3 people review your resume for feedback

**Pro Tip:** The Gemini API quota has been exceeded. This is a demo response based on general best practices. For personalized feedback, please wait a moment and try again, or upgrade your API plan.`,

    skills: `**Skills Development Recommendations** (Demo Mode)

🎯 **Current Skill Assessment:**
Your profile shows a solid foundation in foundational technologies. With focused practice, you're well-positioned for internship roles.

📚 **Top 3 Skills to Develop Next:**
1. **Full-Stack Development** - Combines frontend + backend, highly valued by companies
2. **System Design Basics** - Understanding scalability helps you stand out
3. **Communication & Documentation** - Often overlooked but critical for team success

💡 **Learning Resources:**
- Build 1-2 complete projects that combine multiple technologies
- Contribute to open source to gain real-world experience
- Join community hackathons for hands-on practice
- Read code from popular open-source projects

🚀 **Alignment with Internships:**
These skills directly align with modern tech internships where companies want developers who can:
- Solve real problems (full-stack skills)
- Think about scalability (system design)
- Communicate clearly (technical writing)

**Note:** This is a demo response. For personalized skill recommendations based on your specific goals, please try again later.`,

    'gap-analysis': `**Skill Gap Analysis** (Demo Mode)

📋 **Skills for Your Target Role:**
- Frontend Development (HTML, CSS, JavaScript/React)
- Backend Fundamentals (databases, APIs, server logic)
- Version Control (Git, collaboration workflows)
- Testing & Debugging (unit tests, debugging practices)

✅ **Current Level vs. Required:**

| Skill | You Have | Need | Gap |
|-------|---------|------|-----|
| Frontend | Intermediate | Intermediate | ✓ Aligned |
| Backend | Beginner | Intermediate | ⚠️ Critical |
| Database | Beginner | Intermediate | ⚠️ Critical |
| Collaboration | Intermediate | Advanced | ⚠️ Important |

🗺️ **Learning Roadmap:**

**3 Months:**
- Deep dive into one backend framework
- Build and deploy a full-stack project
- Start contributing to open source

**6 Months:**
- Master database design and optimization
- Learn system design fundamentals
- Complete 2-3 portfolio projects

**12 Months:**
- Become proficient in multiple frameworks
- Lead a significant project
- Network with industry professionals

**Note:** This is a demo response. For a personalized gap analysis, please try again later.`,

    recommendations: `**Internship Recommendations** (Demo Mode)

🎯 **5 Types of Internships Well-Suited to You:**

1. **Early-Stage Startup Internships**
   - Why: Fast-paced, full-stack opportunities, mentorship
   - Example: Series A-B tech startups in your area
   - Timeline: 3-4 months to be competitive

2. **Fortune 500 Tech Programs**
   - Why: Structure, mentorship, networking, brand recognition
   - Example: Microsoft, Google, Amazon internship programs
   - Timeline: 4-6 months to be competitive

3. **Specialized Tech Companies**
   - Why: Deep expertise, cutting-edge work, specialized skills
   - Example: Cloud providers, DevTools, FinTech companies
   - Timeline: 2-3 months to be competitive

4. **Remote-First Companies**
   - Why: Flexibility, diverse teams, home-based work
   - Example: GitLab, Zapier, Auth0, and similar companies
   - Timeline: 1-2 months to be competitive

5. **Non-Tech Company Engineering Teams**
   - Why: Domain expertise, real-world problems, full-stack work
   - Example: Fintech, HealthTech, EdTech companies
   - Timeline: 2-3 months to be competitive

💪 **How to Position Your Profile:**
- Emphasize personal projects and impact
- Show you can learn independently
- Demonstrate communication skills
- Build relationships at companies

**Note:** This is a demo response. For personalized internship matches based on your specific interests and skills, please try again later.`
  };

  return mockResponses[topic] || `Demo response for ${topic}. The Gemini API quota has been temporarily exceeded. Please try again in a few moments or upgrade your API plan for continued access.`;
}

export async function getMentorFeedback(
  topic: 'resume' | 'skills' | 'gap-analysis' | 'recommendations',
  userProfile: any,
  memoryContext: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompts: Record<typeof topic, string> = {
    resume: `You are an expert career mentor. Analyze this student's resume and profile based on their career journey. 
    
User Profile:
${JSON.stringify(userProfile, null, 2)}

Memory Context (from previous conversations):
${memoryContext}

Provide:
1. 3 specific strengths in their resume/profile
2. 3 areas for improvement
3. 5 concrete action items to strengthen their candidacy for internships

Be encouraging but honest. Reference their past experiences shown in memory.`,

    skills: `You are an expert career advisor specializing in tech skills. Based on the user's profile and learning journey, provide skill development recommendations.

User Profile:
${JSON.stringify(userProfile, null, 2)}

Memory Context:
${memoryContext}

Provide:
1. Assessment of their current skill portfolio
2. Top 3 skills to develop next based on their goals
3. Concrete learning resources (courses, projects, practices)
4. How these skills align with target internships

Be specific and actionable.`,

    'gap-analysis': `You are a career coach analyzing skill gaps. Based on the user's current skills and target role, identify gaps and growth areas.

User Profile:
${JSON.stringify(userProfile, null, 2)}

Memory Context:
${memoryContext}

Provide:
1. Key skills for their target role
2. Current proficiency in each skill (what they have)
3. Required proficiency level
4. Gap severity (Critical/Important/Nice-to-have)
5. 3-month, 6-month, and 12-month learning roadmap

Format clearly with priorities.`,

    recommendations: `You are an expert internship placement advisor. Based on the user's profile, skills, and preferences, recommend specific internship opportunities.

User Profile:
${JSON.stringify(userProfile, null, 2)}

Memory Context (including preferences):
${memoryContext}

Provide:
1. 5 specific types of internships well-suited to them
2. Example companies for each type
3. Why each is a good fit
4. How to position their profile for each opportunity
5. Estimated timeline to be competitive

Consider both their current level and growth potential.`
  };

  try {
    const result = await model.generateContent(prompts[topic]);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Check if it's a quota/rate limit error
    const errorStr = error instanceof Error ? error.message : JSON.stringify(error);
    if (errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('rate limit')) {
      // Return smart fallback response based on topic
      return getMockFeedback(topic, userProfile);
    }
    
    throw new Error('Failed to generate mentor feedback');
  }
}

export async function askMentor(
  question: string,
  userProfile: any,
  memoryContext: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const systemPrompt = `You are an empathetic and knowledgeable career mentor for college students pursuing internships. 
You have access to the student's career journey, skills, projects, and application history. 
You provide personalized, actionable advice drawing from their specific experiences and goals.
Be encouraging, honest, and practical in your guidance.

User Context:
${JSON.stringify(userProfile, null, 2)}

Previous Conversations & Insights:
${memoryContext}

Remember:
- Reference their specific projects and skills
- Acknowledge challenges they've mentioned
- Connect advice to their actual experiences
- Be warm but direct`;

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: question }]
        }
      ],
      systemInstruction: systemPrompt
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Check if it's a quota/rate limit error
    const errorStr = error instanceof Error ? error.message : JSON.stringify(error);
    if (errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('rate limit')) {
      // Return a helpful fallback response
      return `I'm currently experiencing high traffic and can't process your request right now. 
      
However, here's some general advice that might help:

The best approach to your question is to:
1. Break it down into smaller, manageable steps
2. Research similar questions in documentation
3. Look for patterns in what successful people in your field have done
4. Practice, iterate, and learn from each attempt

**What you can do right now:**
- Review your previous mentor feedback and action items
- Work on one specific skill or project
- Update your portfolio with recent accomplishments
- Prepare for your next internship application

Please try asking again in a moment, or feel free to explore other sections of the app while the API recovers.`;
    }
    
    throw new Error('Failed to get mentor response');
  }
}
