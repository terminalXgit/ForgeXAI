import { motion } from "framer-motion";
import { Check, Download, Copy, RotateCcw, FileCode, Terminal, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AIConfig } from "@/lib/generateAIConfig";
import { generateAndDownloadZip } from "@/lib/generateZip";

interface ForgeResultsProps {
  config: AIConfig;
  systemPrompt: string;
  onReset: () => void;
}

const ForgeResults = ({ config, systemPrompt, onReset }: ForgeResultsProps) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

  const openLiveChat = () => {
    const configParam = encodeURIComponent(JSON.stringify(config));
    navigate(`/chat?config=${configParam}`);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(systemPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setDownloading(true);
    await generateAndDownloadZip(config);
    setTimeout(() => setDownloading(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen pt-24 pb-16"
    >
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-5 glow-md"
          >
            <Check className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            <span className="text-gradient">{config.name}</span> is Ready
          </h1>
          <p className="text-muted-foreground font-body">Your AI has been forged and packaged.</p>
        </div>

        <div className="space-y-4">
          {/* Live Chat */}
          <motion.button
            onClick={openLiveChat}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="w-full rounded-2xl p-6 flex items-center gap-4 bg-gradient-to-r from-primary/15 to-accent/10 border border-primary/20 hover:glow-md transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/15 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left flex-1">
              <p className="font-bold text-foreground">Try Live Chat</p>
              <p className="text-sm text-muted-foreground font-body">
                Chat with {config.name} right now — real AI responses
              </p>
            </div>
          </motion.button>
          {/* Download */}
          <motion.button
            onClick={handleDownload}
            disabled={downloading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full glass rounded-2xl p-6 flex items-center gap-4 hover:glow-sm transition-all duration-300 group hover:border-primary/30 disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left flex-1">
              <p className="font-bold text-foreground">
                {downloading ? "Generating ZIP…" : "Download Full Project"}
              </p>
              <p className="text-sm text-muted-foreground font-body">
                React + Vite app with chat UI, config & API setup
              </p>
            </div>
            <FileCode className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </motion.button>

          {/* Quick start */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-primary" />
              <p className="text-sm font-bold text-foreground">Quick Start</p>
            </div>
            <pre className="text-xs text-muted-foreground bg-secondary/50 rounded-xl p-4 font-mono overflow-x-auto">
{`unzip ${(config.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "my-ai")}-ai.zip
cd ${config.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "my-ai"}
npm install
# Add your OpenRouter API key to .env
npm run dev`}
            </pre>
          </motion.div>

          {/* System Prompt */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-foreground">System Prompt</p>
              <button
                onClick={copyPrompt}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Copy className="w-3 h-3" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="text-xs text-secondary-foreground bg-secondary/50 rounded-xl p-4 whitespace-pre-wrap max-h-48 overflow-y-auto font-mono leading-relaxed">
              {systemPrompt}
            </pre>
          </motion.div>

          {/* Create Another */}
          <motion.button
            onClick={onReset}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full py-4 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Create Another AI
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgeResults;
