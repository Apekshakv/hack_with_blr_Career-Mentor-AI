import { motion } from "framer-motion";

interface MemoryChipProps {
  timestamp: string;
  content: string;
  type?: "world" | "experience" | "observation";
}

const MemoryChip = ({ timestamp, content, type = "world" }: MemoryChipProps) => (
  <motion.div
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    className="flex items-start gap-3 p-3 mb-2 bg-card border border-border rounded-lg shadow-card"
  >
    <div className="mt-1.5 h-2 w-2 rounded-full bg-accent shrink-0" />
    <div className="min-w-0 flex-1">
      <span className="text-xs text-muted-foreground tabular-nums block mb-0.5">
        {timestamp}
      </span>
      <span className="text-xs text-foreground/80 font-medium leading-relaxed">
        {content}
      </span>
      {type === "observation" && (
        <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-memory-light text-accent font-medium">
          observation
        </span>
      )}
    </div>
  </motion.div>
);

export default MemoryChip;
