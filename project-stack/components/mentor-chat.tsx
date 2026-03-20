'use client';

import { useEffect, useRef, useState } from 'react';
import { useProfile } from '@/lib/useProfile';
import { askQuestion } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Message { id: string; role: 'user' | 'mentor'; content: string; }

export default function MentorChat({ store }: { store: ReturnType<typeof useProfile> }) {
  const { profile } = store;
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'mentor', content: `Hi! I'm your AI Career Mentor. Ask me anything about your career journey, skills, or internship strategy!` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  if (!profile) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input.trim();
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    try {
      const response = await askQuestion(text, profile);
      setMessages(prev => [...prev, { id: `m-${Date.now()}`, role: 'mentor', content: response }]);
    } catch { toast.error('Failed to get response'); }
    finally { setLoading(false); }
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary" />Mentor Chat</CardTitle>
        <CardDescription>Get personalized career advice powered by Gemini</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96 overflow-y-auto space-y-4 mb-4 p-2">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg"><Spinner className="w-4 h-4" /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <Input placeholder="Ask your mentor anything..." value={input} onChange={e => setInput(e.target.value)} disabled={loading} className="flex-1" />
          <Button type="submit" disabled={loading || !input.trim()} className="bg-primary hover:bg-primary/90"><Send className="w-4 h-4" /></Button>
        </form>
      </CardContent>
    </Card>
  );
}
