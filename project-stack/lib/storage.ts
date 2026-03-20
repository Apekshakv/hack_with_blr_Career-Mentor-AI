// localStorage-based persistence for the career mentor app
// This runs client-side only — check for window before using

import { UserProfile } from './types';

const PROFILE_KEY = 'career_mentor_profile';

export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Revive Date objects
    parsed.createdAt = new Date(parsed.createdAt);
    parsed.updatedAt = new Date(parsed.updatedAt);
    parsed.skills = parsed.skills.map((s: any) => ({ ...s, dateAdded: new Date(s.dateAdded) }));
    parsed.projects = parsed.projects.map((p: any) => ({ ...p, dateCompleted: new Date(p.dateCompleted) }));
    parsed.applications = parsed.applications.map((a: any) => ({ ...a, appliedDate: new Date(a.appliedDate) }));
    return parsed as UserProfile;
  } catch {
    return null;
  }
}

export function clearProfile(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PROFILE_KEY);
}
