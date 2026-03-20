'use client';

import { useState } from 'react';
import { Skill } from '@/lib/types';
import { useProfile } from '@/lib/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus } from 'lucide-react';
import { toast } from 'sonner';

const proficiencyLevels = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
const skillCategories = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'data', label: 'Data & Analytics' },
  { value: 'devops', label: 'DevOps' },
  { value: 'soft', label: 'Soft Skills' },
  { value: 'other', label: 'Other' },
];

export default function SkillsTracker({ store }: { store: ReturnType<typeof useProfile> }) {
  const { profile, addSkill, removeSkill } = store;
  const [form, setForm] = useState({ name: '', proficiency: 'intermediate' as Skill['proficiency'], years: '1', category: 'frontend' as Skill['category'] });

  if (!profile) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Enter a skill name'); return; }
    addSkill({ name: form.name.trim(), proficiency: form.proficiency, yearsOfExperience: parseInt(form.years) || 0, category: form.category });
    setForm({ name: '', proficiency: 'intermediate', years: '1', category: 'frontend' });
    toast.success(`Added ${form.name}`);
  };

  const grouped = skillCategories.reduce((acc, cat) => {
    const skills = profile.skills.filter(s => s.category === cat.value);
    if (skills.length > 0) acc[cat.label] = skills;
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5 text-primary" />Add New Skill</CardTitle>
          <CardDescription>Track skills you've developed</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <FieldLabel>Skill Name</FieldLabel>
              <Input placeholder="e.g., React, Python, SQL" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FieldGroup>
                <FieldLabel>Category</FieldLabel>
                <Select value={form.category} onValueChange={(v: any) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{skillCategories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>Proficiency</FieldLabel>
                <Select value={form.proficiency} onValueChange={(v: any) => setForm({ ...form, proficiency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{proficiencyLevels.map(l => <SelectItem key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</SelectItem>)}</SelectContent>
                </Select>
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>Years of Experience</FieldLabel>
                <Input type="number" min="0" max="50" value={form.years} onChange={e => setForm({ ...form, years: e.target.value })} />
              </FieldGroup>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90"><Plus className="w-4 h-4 mr-2" />Add Skill</Button>
          </form>
        </CardContent>
      </Card>

      {profile.skills.length === 0 ? (
        <Card className="border-border/50 border-dashed">
          <CardContent className="pt-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No skills added yet</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(grouped).map(([category, skills]) => (
          <Card key={category} className="border-border/50">
            <CardHeader><CardTitle className="text-lg">{category}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {skills.map(skill => (
                  <div key={skill.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{skill.name}</div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{skill.proficiency}</Badge>
                        <Badge variant="outline" className="text-xs">{skill.yearsOfExperience}y</Badge>
                      </div>
                    </div>
                    <button onClick={() => { removeSkill(skill.id); toast.success('Removed'); }} className="ml-2 text-muted-foreground hover:text-destructive text-xs">✕</button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
