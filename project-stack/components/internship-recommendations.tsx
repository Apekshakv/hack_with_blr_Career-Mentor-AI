'use client';

import { useState } from 'react';
import { InternshipApplication } from '@/lib/types';
import { useProfile } from '@/lib/useProfile';
import { getInternshipRecommendations } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Briefcase, Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const statuses = ['applied', 'interviewing', 'offered', 'accepted', 'rejected'] as const;

export default function InternshipRecommendations({ store }: { store: ReturnType<typeof useProfile> }) {
  const { profile, addApplication, updateApplicationStatus, removeApplication } = store;
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: '', position: '', status: 'applied' as InternshipApplication['status'], notes: '' });

  if (!profile) return null;

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const res = await getInternshipRecommendations(profile);
      setRecommendations(res);
      toast.success('Got your recommendations!');
    } catch { toast.error('Failed to get recommendations'); }
    finally { setLoading(false); }
  };

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.position.trim()) { toast.error('Fill in company and position'); return; }
    addApplication({ company: form.company.trim(), position: form.position.trim(), status: form.status, notes: form.notes.trim() || undefined });
    setForm({ company: '', position: '', status: 'applied', notes: '' });
    setShowForm(false);
    toast.success(`Added application for ${form.company}`);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" />AI Internship Recommendations</CardTitle>
          <CardDescription>Get personalized recommendations based on your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGetRecommendations} disabled={loading} className="bg-primary hover:bg-primary/90">
            {loading ? <><Spinner className="w-4 h-4 mr-2" />Analyzing...</> : <><Sparkles className="w-4 h-4 mr-2" />Get Recommendations</>}
          </Button>
          {recommendations && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap font-sans">{recommendations}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" />Application Tracker</CardTitle>
              <CardDescription>Track your internship applications</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4 mr-1" />Add</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showForm && (
            <form onSubmit={handleAddApplication} className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldGroup>
                  <FieldLabel>Company</FieldLabel>
                  <Input placeholder="Google" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel>Position</FieldLabel>
                  <Input placeholder="Software Engineering Intern" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
                </FieldGroup>
              </div>
              <FieldGroup>
                <FieldLabel>Status</FieldLabel>
                <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}</SelectContent>
                </Select>
              </FieldGroup>
              <FieldGroup>
                <FieldLabel>Notes (optional)</FieldLabel>
                <Textarea placeholder="Any notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </FieldGroup>
              <div className="flex gap-2">
                <Button type="submit" className="bg-primary hover:bg-primary/90">Add Application</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          )}

          {profile.applications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No applications tracked yet</p>
          ) : (
            <div className="space-y-3">
              {profile.applications.map(app => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{app.company}</p>
                    <p className="text-xs text-muted-foreground">{app.position}</p>
                    {app.notes && <p className="text-xs text-muted-foreground mt-1">{app.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={app.status} onValueChange={(v: any) => updateApplicationStatus(app.id, v)}>
                      <SelectTrigger className="w-32 h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}</SelectContent>
                    </Select>
                    <button onClick={() => { removeApplication(app.id); toast.success('Removed'); }} className="text-muted-foreground hover:text-destructive text-xs">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
