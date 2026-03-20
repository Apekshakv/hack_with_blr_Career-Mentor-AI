'use client';

import { useState, useRef } from 'react';
import { UserProfile } from '@/lib/types';
import { getResumeFeedback, parseResumeFile } from '@/app/actions';
import { validateResumeFile, fileToBase64 } from '@/lib/file-parser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { FileText, Send, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface ResumeFeedbackProps {
  userId: string;
  profile: UserProfile;
}

export default function ResumeFeedback({ userId, profile }: ResumeFeedbackProps) {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    const validation = validateResumeFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    try {
      setParsing(true);
      toast.loading(`Parsing ${file.name}...`);
      
      // Convert file to base64 and send to server for parsing
      const base64 = await fileToBase64(file);
      const text = await parseResumeFile(file.name, base64);
      
      if (!text || text.trim().length === 0) {
        toast.error('Could not extract text from file. Please try a different file or paste manually.');
        return;
      }
      
      setResumeText(text);
      setFileName(file.name);
      toast.success(`Successfully loaded ${file.name} (${text.length} characters)`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse file';
      toast.error(`Error: ${errorMessage}`);
      console.error('Error parsing file:', error);
    } finally {
      setParsing(false);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleGetFeedback = async () => {
    if (!resumeText.trim()) {
      toast.error('Please upload or paste your resume');
      return;
    }

    setLoading(true);
    try {
      console.log('[v0] Requesting resume feedback for userId:', userId);
      console.log('[v0] Resume text length:', resumeText.length);
      const response = await getResumeFeedback(userId, resumeText);
      console.log('[v0] Feedback received:', response.substring(0, 100));
      setFeedback(response);
      
      // Check if it's a demo response due to API quota
      if (response.includes('Demo Mode') || response.includes('quota')) {
        toast.success('Demo feedback loaded - API at capacity, using smart fallback');
      } else {
        toast.success('Got your resume feedback!');
      }
    } catch (error) {
      console.error('[v0] Error getting feedback:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      
      // Provide helpful message for API issues
      if (errorMsg.includes('quota') || errorMsg.includes('429')) {
        toast.error('API quota exceeded. Please try again in a moment or check your API plan.');
      } else {
        toast.error(`Error: ${errorMsg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearResume = () => {
    setResumeText('');
    setFileName(null);
    setFeedback(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Resume Upload/Input */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Resume Analysis
          </CardTitle>
          <CardDescription>
            Upload your resume or paste text to get AI-powered feedback from your mentor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload/Drag Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/10'
                : 'border-border/50 bg-muted/30 hover:border-primary/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              accept=".txt,.pdf,.docx,.doc"
              disabled={loading || parsing}
              className="hidden"
            />
            
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <div className="space-y-2">
              <p className="font-medium text-foreground">
                {dragActive ? 'Drop your resume here' : 'Drag and drop your resume'}
              </p>
              <p className="text-sm text-muted-foreground">
                or
              </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || parsing}
              variant="outline"
              className="border-border/50"
            >
              {parsing ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Parsing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </>
              )}
            </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Supported formats: TXT, PDF, DOCX (Max 5MB)
              </p>
            </div>
          </div>

          {/* Show loaded file name */}
          {fileName && (
            <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{fileName}</span>
              </div>
              <button
                onClick={() => {
                  setFileName(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                disabled={loading}
                className="p-1 hover:bg-primary/20 rounded transition-colors"
              >
                <X className="w-4 h-4 text-primary" />
              </button>
            </div>
          )}

          {/* Text area for manual input/editing */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <FieldLabel>Resume Content</FieldLabel>
              {resumeText && (
                <button
                  onClick={() => setResumeText('')}
                  disabled={loading}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear text
                </button>
              )}
            </div>
            <Textarea
              placeholder="Your resume content will appear here, or paste it manually..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              disabled={loading}
              rows={10}
              className="font-mono text-sm resize-none"
            />
          </div>

          <Button 
            onClick={handleGetFeedback} 
            disabled={loading || !resumeText.trim()}
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
                Get Resume Feedback
              </>
            )}
          </Button>

          {resumeText && (
            <Button 
              onClick={clearResume}
              disabled={loading}
              variant="outline"
              className="w-full border-border/50"
            >
              Clear All
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Feedback Display */}
      {feedback && (
        <Card className="border-border/50 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Mentor's Feedback</CardTitle>
            <CardDescription>Personalized suggestions to strengthen your resume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                {feedback}
              </div>
            </div>

            <Button
              onClick={() => setFeedback(null)}
              variant="outline"
              className="mt-6 border-border/50"
            >
              Clear Feedback
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Placeholder when empty */}
      {!feedback && resumeText && !loading && (
        <Card className="border-border/50 border-dashed">
          <CardContent className="pt-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Click "Get Resume Feedback" to analyze your resume</p>
          </CardContent>
        </Card>
      )}

      {!feedback && !resumeText && (
        <Card className="border-border/50 border-dashed">
          <CardContent className="pt-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-2">No resume uploaded yet</p>
            <p className="text-sm text-muted-foreground">Paste your resume above to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
