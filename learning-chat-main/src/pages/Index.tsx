import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ChatInput from "@/components/ChatInput";
import AdviceCard from "@/components/AdviceCard";
import UserMessage from "@/components/UserMessage";
import MemoryChip from "@/components/MemoryChip";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Brain, X } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isPending?: boolean;
  isStreaming?: boolean;
  memoryUsed?: boolean;
};

type MemoryFact = {
  id: string;
  timestamp: string;
  content: string;
  type: "world" | "experience" | "observation";
};

const generateId = () => crypto.randomUUID();

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [memories, setMemories] = useState<MemoryFact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecalling, setIsRecalling] = useState(false);
  const [bankReady, setBankReady] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Init bank on mount
  useEffect(() => {
    supabase.functions.invoke("chat", { body: { action: "init-bank" } })
      .then(() => setBankReady(true))
      .catch(() => setBankReady(true)); // bank may already exist
  }, []);

  const handleSend = useCallback(
    async (input: string) => {
      if (isLoading) return;

      const userMsg: Message = { id: generateId(), role: "user", content: input, isPending: true };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // Recall memories
      setIsRecalling(true);
      try {
        const { data } = await supabase.functions.invoke("chat", {
          body: { action: "recall", message: input },
        });
        if (data?.results?.length) {
          setMemories(
            data.results.slice(0, 6).map((r: any) => ({
              id: r.id || generateId(),
              timestamp: r.timestamp ? new Date(r.timestamp).toLocaleDateString() : "Recalled",
              content: r.text,
              type: r.type === "observation" ? "observation" : "world",
            }))
          );
        }
      } catch {}
      setIsRecalling(false);

      // Mark sent
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsg.id ? { ...m, isPending: false } : m))
      );

      // Get response
      const assistantId = generateId();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", isStreaming: true },
      ]);

      try {
        const { data, error } = await supabase.functions.invoke("chat", {
          body: { action: "reflect", message: input },
        });
        if (error) throw error;

        const text = data?.text || data?.error || "I couldn't generate a response.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: text, isStreaming: false, memoryUsed: !data?.fallback }
              : m
          )
        );

        // Retain conversation
        supabase.functions
          .invoke("chat", {
            body: { action: "retain", message: `User: ${input}\nAdvisor: ${text}` },
          })
          .catch(() => {});
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "Something went wrong. Please try again.", isStreaming: false }
              : m
          )
        );
      }

      setIsLoading(false);
    },
    [isLoading]
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2.5">
          <Compass className="h-5 w-5 text-primary" />
          <h1 className="text-base font-semibold text-foreground tracking-tight">Pathfinder</h1>
          <span className="text-xs text-muted-foreground">Career Advisor</span>
        </div>
        {isRecalling && (
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-accent font-medium">Recalling...</span>
          </div>
        )}
      </header>

      {/* Progress bar */}
      {isLoading && (
        <div className="h-0.5 bg-muted">
          <div className="h-full bg-primary/60 animate-progress rounded-full" />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <Compass className="h-7 w-7 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-2">
                  Your career has a history.
                </h2>
                <p className="text-base text-muted-foreground mb-1">Now your advisor does too.</p>
                <p className="text-sm text-muted-foreground/70 mt-3 leading-relaxed">
                  Powered by Hindsight — I remember your goals, preferences, and past conversations.
                </p>
              </motion.div>
            ) : (
              <div className="max-w-2xl mx-auto bg-card rounded-xl shadow-card">
                {messages.map((msg) =>
                  msg.role === "user" ? (
                    <UserMessage key={msg.id} content={msg.content} isPending={msg.isPending} />
                  ) : (
                    <AdviceCard
                      key={msg.id}
                      content={msg.content}
                      isStreaming={msg.isStreaming}
                      memoryUsed={msg.memoryUsed}
                    />
                  )
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>

        {/* Memory sidebar */}
        <AnimatePresence>
          {memories.length > 0 && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-l border-border bg-card overflow-hidden"
            >
              <div className="w-[280px] h-full flex flex-col">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">Memories</span>
                  </div>
                  <button
                    onClick={() => setMemories([])}
                    className="h-6 w-6 rounded hover:bg-secondary flex items-center justify-center"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                  {memories.map((fact) => (
                    <MemoryChip key={fact.id} timestamp={fact.timestamp} content={fact.content} type={fact.type} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
