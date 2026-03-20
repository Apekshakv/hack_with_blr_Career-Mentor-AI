import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface AdviceCardProps {
  content: string;
  isStreaming?: boolean;
  memoryUsed?: boolean;
}

const AdviceCard = ({ content, isStreaming, memoryUsed }: AdviceCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    className={`p-6 border-b border-border last:border-0 ${memoryUsed ? 'border-l-2 border-l-accent animate-memory-pulse' : ''}`}
  >
    <div className="prose prose-sm max-w-none text-foreground text-pretty
      prose-headings:text-foreground prose-headings:tracking-tight prose-headings:font-semibold
      prose-p:text-foreground/85 prose-p:leading-relaxed
      prose-code:font-mono prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
      prose-strong:text-foreground prose-strong:font-semibold
      prose-li:text-foreground/85
      prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
    {isStreaming && (
      <div className="mt-3 h-0.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary/40 rounded-full animate-progress" />
      </div>
    )}
  </motion.div>
);

export default AdviceCard;
