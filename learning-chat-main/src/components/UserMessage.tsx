import { motion } from "framer-motion";

interface UserMessageProps {
  content: string;
  isPending?: boolean;
}

const UserMessage = ({ content, isPending }: UserMessageProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: isPending ? 0.5 : 1, y: 0 }}
    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    className="p-6 border-b border-border last:border-0"
  >
    <div className="flex items-center gap-2 mb-2">
      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
        <span className="text-[10px] font-semibold text-primary-foreground">Y</span>
      </div>
      <span className="text-xs font-medium text-muted-foreground">You</span>
    </div>
    <p className="text-sm text-foreground/90 leading-relaxed pl-7">{content}</p>
  </motion.div>
);

export default UserMessage;
