import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, Loader2 } from "lucide-react";

interface ForgeProgressProps {
  currentStep: number;
  steps: string[];
}

const ForgeProgress = ({ currentStep, steps }: ForgeProgressProps) => {
  const progress = Math.min((currentStep / (steps.length - 1)) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-mono">FORGING</span>
          <span className="text-primary font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2.5">
        {steps.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-all duration-300 ${
                  done
                    ? "bg-primary/20 text-primary"
                    : active
                    ? "bg-primary/10 text-primary border border-primary/40"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {done ? (
                  <Check className="w-3 h-3" />
                ) : active ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <span className="text-[10px] font-mono">{i + 1}</span>
                )}
              </div>
              <span
                className={`text-sm font-body ${
                  done ? "text-primary/80" : active ? "text-foreground" : "text-muted-foreground/60"
                }`}
              >
                {step}
              </span>
              <AnimatePresence>
                {active && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ForgeProgress;
