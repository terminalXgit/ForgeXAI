import { motion } from "framer-motion";
import { Bot, Send, User } from "lucide-react";
import { AIConfig } from "@/lib/generateAIConfig";
import { useMemo } from "react";

interface ChatPreviewProps {
  config: AIConfig;
}

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-3 py-2">
    <div className="typing-dot" />
    <div className="typing-dot" />
    <div className="typing-dot" />
  </div>
);

const ChatPreview = ({ config }: ChatPreviewProps) => {
  const previewMessages = useMemo(() => {
    const tone = config.humor > 60 ? "😄 " : "";
    const depth = config.depth > 70 ? " Let me elaborate on that..." : "";
    const creative = config.creativity > 70 ? " Here's an unconventional perspective:" : "";
    const empathy = config.emotionalIntelligence > 70 ? " I appreciate your curiosity! " : "";

    return [
      { role: "user" as const, content: "Tell me about yourself" },
      {
        role: "assistant" as const,
        content: `${tone}${empathy}Hi, I'm ${config.name || "your AI"}! ${
          config.personality ? `I'm ${config.personality.toLowerCase()}.` : ""
        } ${
          config.speciality ? `I specialize in ${config.speciality.toLowerCase()}.` : ""
        }${creative}${depth}`,
      },
    ];
  }, [config]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground text-sm">
            {config.name || "Unnamed AI"}
          </p>
          <p className="text-xs text-muted-foreground">
            {config.speciality || "General purpose"}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-5 space-y-4 overflow-y-auto min-h-[280px]">
        {previewMessages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.3 }}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-primary/15 border border-primary/20 rounded-br-md"
                  : "bg-secondary/80 rounded-bl-md"
              }`}
            >
              <p className="text-sm text-foreground leading-relaxed font-body">
                {msg.content}
              </p>
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Personality Matrix */}
      <div className="px-5 pb-3">
        <div className="border-t border-border pt-4 space-y-2">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
            Personality Matrix
          </p>
          {[
            { label: "CRE", value: config.creativity },
            { label: "STR", value: config.strictness },
            { label: "HUM", value: config.humor },
            { label: "EIQ", value: config.emotionalIntelligence },
            { label: "DEP", value: config.depth },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground w-8">
                {stat.label}
              </span>
              <div className="flex-1 h-1 rounded-full bg-secondary">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.value}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground w-8 text-right">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Curved chat input */}
      <div className="p-4">
        <div className="chat-input-curved flex items-center gap-3 px-5 py-3.5">
          <input
            disabled
            placeholder="Type a message to test..."
            className="flex-1 bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/40 outline-none font-body"
          />
          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
            <Send className="w-3.5 h-3.5 text-primary/50" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPreview;
