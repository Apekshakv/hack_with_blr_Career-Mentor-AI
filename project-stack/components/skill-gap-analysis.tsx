'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/types';
import { getSkillGapAnalysis, updateProfile } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { TrendingUp, Send } from 'lucide-react';
import { toast } from 'sonner';

interface SkillGapAnalysisProps {
  userId: string;
  profile: UserProfile;
}

export default function SkillGapAnalysis({ userId, profile }: SkillGapAnalysisProps) {
  const [targetRole, setTargetRole] = useState(profile.targetRole || '');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyzeGaps = async () => {
    if (!targetRole.trim()) {
      toast.error('Please enter a target role');
      return;
    }

    setLoading(true);
    try {
      // Update profile with target role
      await updateProfile(userId, { targetRole });

      // Get gap analysis
      const response = await getSkillGapAnalysis(userId, targetRole);
      setAnalysis(response);
      toast.success('Got your skill gap analysis!');
    } catch (error) {
      console.error('Error analyzing gaps:', error);
      toast.error('Failed to get gap analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Target Role Input */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Skill Gap Analysis
          </CardTitle>
          <CardDescription>
            Get a personalized analysis of skills you need to develop
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <FieldLabel>Target Role</FieldLabel>
            <Input
              placeholder="e.g., Full Stack Engineer, Data Scientist, DevOps Engineer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAnalyzeGaps();
              }}
            />
          </FieldGroup>

          <Button 
            onClick={handleAnalyzeGaps} 
            disabled={loading || !targetRole.trim()}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Analyze Skill Gaps
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Display */}
      {analysis && (
        <Card className="border-border/50 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Gap Analysis for: {targetRole}</CardTitle>
            <CardDescription>Your personalized roadmap to success</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                {analysis}
              </div>
            </div>

            <Button
              onClick={() => setAnalysis(null)}
              variant="outline"
              className="mt-6 border-border/50"
            >
              Clear Analysis
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current Skills Summary */}
      {profile.skills.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Your Current Skills ({profile.skills.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.skills.map(skill => (
                <div key={skill.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{skill.name}</p>
                    <p className="text-xs text-muted-foreground">{skill.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary capitalize">{skill.proficiency}</p>
                    <p className="text-xs text-muted-foreground">{skill.yearsOfExperience}y exp</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!analysis && profile.skills.length === 0 && (
        <Card className="border-border/50 border-dashed">
          <CardContent className="pt-12 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-2">No skills tracked yet</p>
            <p className="text-sm text-muted-foreground">Add skills first to get a gap analysis</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
