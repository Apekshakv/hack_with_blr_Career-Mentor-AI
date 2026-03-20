'use client';

import { useCallback, useEffect, useState } from 'react';
import { UserProfile, Skill, Project, InternshipApplication } from './types';

const KEY = 'career_mentor_profile';

function load(): UserProfile | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    p.createdAt = new Date(p.createdAt);
    p.updatedAt = new Date(p.updatedAt);
    p.skills = (p.skills || []).map((s: any) => ({ ...s, dateAdded: new Date(s.dateAdded) }));
    p.projects = (p.projects || []).map((p: any) => ({ ...p, dateCompleted: new Date(p.dateCompleted) }));
    p.applications = (p.applications || []).map((a: any) => ({ ...a, appliedDate: new Date(a.appliedDate) }));
    return p;
  } catch { return null; }
}

function save(p: UserProfile) {
  localStorage.setItem(KEY, JSON.stringify(p));
}

function defaultProfile(): UserProfile {
  return {
    userId: 'local-user',
    name: 'You',
    email: '',
    skills: [],
    projects: [],
    applications: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function useProfile() {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const p = load() ?? defaultProfile();
    save(p);
    setProfileState(p);
    setReady(true);
  }, []);

  const updateProfile = useCallback((updated: UserProfile) => {
    updated.updatedAt = new Date();
    save(updated);
    setProfileState({ ...updated }); // new ref forces re-render
  }, []);

  const addSkill = useCallback((skill: Omit<Skill, 'id' | 'dateAdded'>) => {
    setProfileState(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        skills: [...prev.skills, { ...skill, id: `skill-${Date.now()}`, dateAdded: new Date() }],
        updatedAt: new Date(),
      };
      save(updated);
      return updated;
    });
  }, []);

  const removeSkill = useCallback((skillId: string) => {
    setProfileState(prev => {
      if (!prev) return prev;
      const updated = { ...prev, skills: prev.skills.filter(s => s.id !== skillId), updatedAt: new Date() };
      save(updated);
      return updated;
    });
  }, []);

  const addProject = useCallback((project: Omit<Project, 'id' | 'dateCompleted'>) => {
    setProfileState(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        projects: [...prev.projects, { ...project, id: `project-${Date.now()}`, dateCompleted: new Date() }],
        updatedAt: new Date(),
      };
      save(updated);
      return updated;
    });
  }, []);

  const removeProject = useCallback((projectId: string) => {
    setProfileState(prev => {
      if (!prev) return prev;
      const updated = { ...prev, projects: prev.projects.filter(p => p.id !== projectId), updatedAt: new Date() };
      save(updated);
      return updated;
    });
  }, []);

  const addApplication = useCallback((app: Omit<InternshipApplication, 'id' | 'appliedDate'>) => {
    setProfileState(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        applications: [...prev.applications, { ...app, id: `app-${Date.now()}`, appliedDate: new Date() }],
        updatedAt: new Date(),
      };
      save(updated);
      return updated;
    });
  }, []);

  const updateApplicationStatus = useCallback((appId: string, status: InternshipApplication['status']) => {
    setProfileState(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        applications: prev.applications.map(a => a.id === appId ? { ...a, status } : a),
        updatedAt: new Date(),
      };
      save(updated);
      return updated;
    });
  }, []);

  const removeApplication = useCallback((appId: string) => {
    setProfileState(prev => {
      if (!prev) return prev;
      const updated = { ...prev, applications: prev.applications.filter(a => a.id !== appId), updatedAt: new Date() };
      save(updated);
      return updated;
    });
  }, []);

  return {
    profile,
    ready,
    updateProfile,
    addSkill,
    removeSkill,
    addProject,
    removeProject,
    addApplication,
    updateApplicationStatus,
    removeApplication,
  };
}
