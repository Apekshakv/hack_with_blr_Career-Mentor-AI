'use client';

import { useState } from 'react';
import { useProfile } from '@/lib/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Plus, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectsTracker({ store }: { store: ReturnType<typeof useProfile> }) {
  const { profile, addProject, removeProject } = store;
  const [form, setForm] = useState({ title: '', description: '', skills: '', link: '', impact: '' });

  if (!profile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Enter a project title'); return; }
    if (!form.description.trim()) { toast.error('Enter a description'); return; }
    addProject({
      title: form.title.trim(),
      description: form.description.trim(),
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      link: form.link.trim() || undefined,
      impact: form.impact.trim() || undefined,
    });
    setForm({ title: '', description: '', skills: '', link: '', impact: '' });
    toast.success(`Added project: ${form.title}`);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5 text-primary" />Add Project</CardTitle>
          <CardDescription>Document projects you've built</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <FieldLabel>Project Title</FieldLabel>
              <Input placeholder="e.g., E-commerce Platform" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>Description</FieldLabel>
              <Textarea placeholder="What did you build and how?" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldGroup>
                <FieldLabel>Skills Used (comma-separated)</FieldLabel>
                <Input placeholder="React, Node.js, MongoDB" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>Link (optional)</FieldLabel>
                <Input placeholder="https://github.com/..." value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} />
              </FieldGroup>
            </div>
            <FieldGroup>
              <FieldLabel>Impact (optional)</FieldLabel>
              <Input placeholder="e.g., Reduced load time by 40%" value={form.impact} onChange={e => setForm({ ...form, impact: e.target.value })} />
            </FieldGroup>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-2" />Add Project</Button>
          </form>
        </CardContent>
      </Card>

      {profile.projects.length === 0 ? (
        <Card className="border-border/50 border-dashed">
          <CardContent className="pt-12 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No projects added yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.projects.map(project => (
            <Card key={project.id} className="border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{project.title}</CardTitle>
                  <button onClick={() => { removeProject(project.id); toast.success('Removed'); }} className="text-muted-foreground hover:text-destructive text-xs ml-2">✕</button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{project.description}</p>
                {project.impact && <p className="text-sm text-primary font-medium">Impact: {project.impact}</p>}
                <div className="flex flex-wrap gap-1">
                  {project.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                </div>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <ExternalLink className="w-3 h-3" />View Project
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
