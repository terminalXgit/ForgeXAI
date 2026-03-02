import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, Bot } from "lucide-react";
import { AIConfig, defaultConfig, generateSystemPrompt } from "@/lib/generateAIConfig";
import ForgeProgress from "./ForgeProgress";
import ForgeResults from "./ForgeResults";
import ChatPreview from "./ChatPreview";

const SliderField = ({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <span className="text-xs font-mono text-primary">{value}%</span>
    </div>
    <div className="relative">
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-secondary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_10px_hsl(185_80%_55%/0.4)] disabled:opacity-50"
      />
      <div
        className="absolute top-0 left-0 h-1.5 rounded-full bg-gradient-to-r from-primary/40 to-primary/70 pointer-events-none"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const FORGE_STEPS = [
  "Analyzing personality traits…",
  "Generating system prompt…",
  "Building behavior constraints…",
  "Packaging React application…",
  "Preparing deployment bundle…",
  "Complete!",
];

type Phase = "edit" | "forging" | "done";

const fields = [
  { key: "name" as const, label: "AI Name", placeholder: "e.g. Atlas", textarea: false },
  { key: "personality" as const, label: "Personality", placeholder: "Friendly, curious, insightful...", textarea: true },
  { key: "speciality" as const, label: "Speciality", placeholder: "Technology, health, finance...", textarea: false },
  { key: "rules" as const, label: "Logic Rules", placeholder: "Always cite sources, stay concise...", textarea: true },
  { key: "interests" as const, label: "Interests", placeholder: "Science, art, music...", textarea: false },
];

const sliders = [
  { key: "creativity" as const, label: "Creativity" },
  { key: "strictness" as const, label: "Strictness" },
  { key: "humor" as const, label: "Humor" },
  { key: "emotionalIntelligence" as const, label: "Emotional Intelligence" },
  { key: "depth" as const, label: "Depth" },
];

const AICreator = () => {
  const [config, setConfig] = useState<AIConfig>(defaultConfig);
  const [phase, setPhase] = useState<Phase>("edit");
  const [forgeStep, setForgeStep] = useState(0);
  const [systemPrompt, setSystemPrompt] = useState("");

  const update = (key: keyof AIConfig, value: string | number) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  const handleForge = useCallback(() => {
    setPhase("forging");
    setForgeStep(0);
    const prompt = generateSystemPrompt(config);
    setSystemPrompt(prompt);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setForgeStep(step);
      if (step >= FORGE_STEPS.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("done"), 400);
      }
    }, 700);
  }, [config]);

  const handleReset = () => {
    setPhase("edit");
    setForgeStep(0);
    setConfig(defaultConfig);
  };

  if (phase === "done") {
    return <ForgeResults config={config} systemPrompt={systemPrompt} onReset={handleReset} />;
  }

  const isForging = phase === "forging";

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            Forge Your <span className="text-gradient">AI</span>
          </h1>
          <p className="text-muted-foreground text-lg font-body">
            Define personality, set behaviors, download instantly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8 space-y-6"
          >
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              Identity
            </h2>

            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium text-foreground">{field.label}</label>
                {field.textarea ? (
                  <textarea
                    value={config[field.key]}
                    onChange={(e) => update(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={2}
                    disabled={isForging}
                    className="w-full rounded-xl bg-secondary/50 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none disabled:opacity-50 font-body"
                  />
                ) : (
                  <input
                    value={config[field.key] as string}
                    onChange={(e) => update(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    disabled={isForging}
                    className="w-full rounded-xl bg-secondary/50 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 font-body"
                  />
                )}
              </div>
            ))}

            <div className="pt-4 space-y-5">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Behavior Tuning
              </h2>
              {sliders.map((s) => (
                <SliderField
                  key={s.key}
                  label={s.label}
                  value={config[s.key]}
                  onChange={(v) => update(s.key, v)}
                  disabled={isForging}
                />
              ))}
            </div>

            {isForging ? (
              <div className="pt-4">
                <ForgeProgress currentStep={forgeStep} steps={FORGE_STEPS} />
              </div>
            ) : (
              <motion.button
                onClick={handleForge}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 glow-md hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-5 h-5" />
                Forge My AI
              </motion.button>
            )}
          </motion.div>

          {/* Live Preview */}
          <ChatPreview config={config} />
        </div>
      </div>
    </div>
  );
};

export default AICreator;
