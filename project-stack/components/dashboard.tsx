'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, BookOpen, Briefcase, TrendingUp } from 'lucide-react';
import SkillsTracker from './skills-tracker';
import ProjectsTracker from './projects-tracker';
import InternshipRecommendations from './internship-recommendations';
import { useProfile } from '@/lib/useProfile';

interface DashboardProps {
  store: ReturnType<typeof useProfile>;
}

export default function Dashboard({ store }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { profile } = store;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="border-b border-border/50 bg-white/50 dark:bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Brain className="w-8 h-8 text-primary" />Career Mentor AI
              </h1>
              <p className="text-muted-foreground mt-1">Your personalized career development companion</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="font-semibold text-foreground">{profile.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: BookOpen, label: 'Skills', count: profile.skills.length, sub: 'skills tracked' },
            { icon: TrendingUp, label: 'Projects', count: profile.projects.length, sub: 'projects completed' },
            { icon: Briefcase, label: 'Applications', count: profile.applications.length, sub: 'applications tracked' },
          ].map(({ icon: Icon, label, count, sub }) => (
            <Card key={label} className="border-border/50 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />{label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{count}</div>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Brain className="w-4 h-4" /><span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" /><span className="hidden sm:inline">Skills</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /><span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Your Career Journey</CardTitle>
                <CardDescription>Track your progress and get personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Start by adding your skills and projects. Get AI-powered internship recommendations based on your profile.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => setActiveTab('skills')}>Add Skills</Button>
                  <Button variant="outline" onClick={() => setActiveTab('projects')}>Add Projects</Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-lg">Profile Completeness</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: 'Skills Added', done: profile.skills.length > 0 },
                    { label: 'Projects Added', done: profile.projects.length > 0 },
                    { label: 'Applications Tracked', done: profile.applications.length > 0 },
                  ].map(({ label, done }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-sm font-medium">{label}</span>
                      <span className="text-sm">{done ? '✓' : '○'}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardHeader><CardTitle className="text-lg">Recommended Next Steps</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {['Add at least 5–10 key skills', 'Document your completed projects', 'Get personalized internship recommendations'].map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary font-bold">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <InternshipRecommendations store={store} />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsTracker store={store} />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsTracker store={store} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
