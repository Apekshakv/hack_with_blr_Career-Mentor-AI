'use server';

import { UserProfile, Skill, Project, InternshipApplication } from '@/lib/types';
import { getMentorFeedback, askMentor } from '@/lib/gemini';

// ── Gemini-only server actions ─────────────────────────────────────────────
// Profile data is persisted in localStorage on the client.
// These server actions only handle AI calls that need the API key server-side.

export async function getInternshipRecommendations(profile: UserProfile): Promise<string> {
  return getMentorFeedback('recommendations', profile, buildMemoryContext(profile));
}

export async function askQuestion(question: string, profile: UserProfile): Promise<string> {
  return askMentor(question, profile, buildMemoryContext(profile));
}

// ── Helpers ────────────────────────────────────────────────────────────────

function buildMemoryContext(profile: UserProfile): string {
  const lines: string[] = [];

  if (profile.skills.length > 0) {
    lines.push('Skills: ' + profile.skills.map(s => `${s.name} (${s.proficiency})`).join(', '));
  }
  if (profile.projects.length > 0) {
    lines.push('Projects: ' + profile.projects.map(p => p.title).join(', '));
  }
  if (profile.applications.length > 0) {
    lines.push('Applications: ' + profile.applications.map(a => `${a.company} - ${a.status}`).join(', '));
  }
  if (profile.targetRole) {
    lines.push(`Target Role: ${profile.targetRole}`);
  }
  if (profile.currentRole) {
    lines.push(`Current Role: ${profile.currentRole}`);
  }

  return lines.length > 0 ? lines.join('\n') : 'No prior context available.';
}

export async function parseResumeFile(fileName: string, fileBase64: string): Promise<string> {
  try {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const buffer = Buffer.from(fileBase64, 'base64');

    switch (extension) {
      case 'txt':
        return buffer.toString('utf-8');
      case 'pdf': {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(buffer);
        return data.text || '';
      }
      case 'docx':
      case 'doc': {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        return result.value || '';
      }
      default:
        throw new Error(`Unsupported file format: ${extension}`);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to parse file: ${msg}`);
  }
}
