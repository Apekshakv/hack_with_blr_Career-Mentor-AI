// Hindsight Memory System Integration
// Connects to the real Hindsight API running via Docker on port 8888
// API docs: https://hindsight.vectorize.io/api-reference

import { UserProfile, MentorMemory } from './types';

const HINDSIGHT_API_URL = process.env.HINDSIGHT_API_URL || 'http://localhost:8888';

// Each user gets their own memory bank in Hindsight
const getBankId = (userId: string) => `career-mentor-${userId}`;

// Ensure the user's memory bank exists (Hindsight auto-creates on first use,
// but we call this explicitly so we can set a meaningful mission)
async function ensureBankExists(userId: string): Promise<void> {
  const bankId = getBankId(userId);
  try {
    await fetch(`${HINDSIGHT_API_URL}/v1/default/banks/${bankId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Career Mentor - ${userId}`,
        mission:
          "Remember this user's skills, projects, career goals, and internship applications. " +
          'Use this memory to provide personalized, contextual career advice.',
      }),
    });
  } catch {
    // Bank may already exist — non-fatal
  }
}

class HindsightMemory {
  // Fallback in-memory store used only when Hindsight is unreachable
  private fallback: Map<string, MentorMemory> = new Map();

  // ── Retain ────────────────────────────────────────────────────────────────

  async recordExperience(userId: string, experience: string): Promise<void> {
    await ensureBankExists(userId);
    try {
      const res = await fetch(
        `${HINDSIGHT_API_URL}/v1/default/banks/${getBankId(userId)}/memories/retain`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: experience,
            type: 'experience',
            metadata: { userId, category: 'experience', timestamp: new Date().toISOString() },
          }),
        }
      );
      if (!res.ok) throw new Error(`Hindsight retain failed: ${res.status}`);
      console.log(`[Hindsight] Retained experience: ${experience}`);
    } catch (error) {
      console.warn('[Hindsight] Falling back to in-memory for experience:', error);
      const mem = this.fallback.get(userId) || { experiences: [], observations: [], mentalModels: [] };
      mem.experiences.push(`[${new Date().toISOString()}] ${experience}`);
      this.fallback.set(userId, mem);
    }
  }

  async recordObservation(userId: string, observation: string): Promise<void> {
    await ensureBankExists(userId);
    try {
      const res = await fetch(
        `${HINDSIGHT_API_URL}/v1/default/banks/${getBankId(userId)}/memories/retain`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: observation,
            type: 'experience',
            metadata: { userId, category: 'observation', timestamp: new Date().toISOString() },
          }),
        }
      );
      if (!res.ok) throw new Error(`Hindsight retain failed: ${res.status}`);
      console.log(`[Hindsight] Retained observation: ${observation}`);
    } catch (error) {
      console.warn('[Hindsight] Falling back to in-memory for observation:', error);
      const mem = this.fallback.get(userId) || { experiences: [], observations: [], mentalModels: [] };
      mem.observations.push(`[${new Date().toISOString()}] ${observation}`);
      this.fallback.set(userId, mem);
    }
  }

  async recordMentalModel(userId: string, model: string): Promise<void> {
    await ensureBankExists(userId);
    try {
      const res = await fetch(
        `${HINDSIGHT_API_URL}/v1/default/banks/${getBankId(userId)}/memories/retain`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: model,
            type: 'experience',
            metadata: { userId, category: 'mental-model', timestamp: new Date().toISOString() },
          }),
        }
      );
      if (!res.ok) throw new Error(`Hindsight retain failed: ${res.status}`);
      console.log(`[Hindsight] Retained mental model: ${model}`);
    } catch (error) {
      console.warn('[Hindsight] Falling back to in-memory for mental model:', error);
      const mem = this.fallback.get(userId) || { experiences: [], observations: [], mentalModels: [] };
      mem.mentalModels.push(`[${new Date().toISOString()}] ${model}`);
      this.fallback.set(userId, mem);
    }
  }

  // ── Recall ────────────────────────────────────────────────────────────────

  async getMemories(userId: string): Promise<MentorMemory> {
    try {
      const res = await fetch(
        `${HINDSIGHT_API_URL}/v1/default/banks/${getBankId(userId)}/memories/recall`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: 'career skills projects goals applications', budget: 'medium' }),
        }
      );
      if (!res.ok) throw new Error(`Hindsight recall failed: ${res.status}`);

      const data = await res.json();
      const results: Array<{ text: string }> = data.results || [];

      const memory: MentorMemory = { experiences: [], observations: [], mentalModels: [] };
      results.forEach(r => memory.experiences.push(r.text));
      return memory;
    } catch (error) {
      console.warn('[Hindsight] Falling back to in-memory for getMemories:', error);
      return this.fallback.get(userId) || { experiences: [], observations: [], mentalModels: [] };
    }
  }

  async getMemoryContext(userId: string): Promise<string> {
    try {
      const res = await fetch(
        `${HINDSIGHT_API_URL}/v1/default/banks/${getBankId(userId)}/memories/recall`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: 'user career skills projects goals internship applications experience',
            budget: 'medium',
          }),
        }
      );
      if (!res.ok) throw new Error(`Hindsight recall failed: ${res.status}`);

      const data = await res.json();
      const results: Array<{ text: string }> = data.results || [];

      if (results.length === 0) return 'No prior context available.';
      return 'Relevant memories about this user:\n' + results.map(r => `- ${r.text}`).join('\n');
    } catch (error) {
      console.warn('[Hindsight] Falling back to in-memory for getMemoryContext:', error);
      const memory = this.fallback.get(userId) || { experiences: [], observations: [], mentalModels: [] };

      let context = '';
      if (memory.experiences.length > 0)
        context += 'User Experiences:\n' + memory.experiences.join('\n') + '\n\n';
      if (memory.observations.length > 0)
        context += 'AI Observations:\n' + memory.observations.join('\n') + '\n\n';
      if (memory.mentalModels.length > 0)
        context += 'User Goals & Preferences:\n' + memory.mentalModels.join('\n');

      return context || 'No prior context available.';
    }
  }

  async clearMemories(userId: string): Promise<void> {
    try {
      await fetch(`${HINDSIGHT_API_URL}/v1/default/banks/${getBankId(userId)}`, {
        method: 'DELETE',
      });
      console.log(`[Hindsight] Deleted memory bank for user: ${userId}`);
    } catch (error) {
      console.warn('[Hindsight] Could not delete bank, clearing fallback only:', error);
    }
    this.fallback.delete(userId);
  }
}

export const hindsightMemory = new HindsightMemory();
