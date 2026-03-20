import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 px-4 pb-8 pt-4 bg-gradient-to-t from-background via-background to-transparent">
      <div className="max-w-2xl mx-auto bg-card rounded-2xl shadow-elevated border border-border/50 p-2 focus-within:ring-2 ring-primary/20 transition-all">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your career situation..."
          disabled={disabled}
          rows={1}
          className="w-full bg-transparent border-0 focus:ring-0 focus:outline-none text-base text-foreground placeholder:text-muted-foreground resize-none px-3 py-2"
        />
        <div className="flex justify-end px-1">
          <button
            onClick={handleSubmit}
            disabled={disabled || !value.trim()}
            className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-30 hover:bg-primary/90 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
