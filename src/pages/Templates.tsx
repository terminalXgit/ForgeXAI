import { motion } from "framer-motion";
import { Bot, Sparkles, ShoppingBag, ArrowUpRight } from "lucide-react";

const templates = [
  {
    name: "StudyMaster AI",
    price: "$7",
    category: "Productivity",
    description: "Homework solver, exam prep mode, and smart notes generator.",
    tag: "Student Toolkit",
  },
  {
    name: "Islamic Scholar AI",
    price: "$9",
    category: "Faith",
    description: "Quran explanation, hadith lookup, and respectful Islamic Q&A.",
    tag: "Deen Companion",
  },
  {
    name: "Resume Builder AI",
    price: "$6",
    category: "Career",
    description: "ATS-friendly resumes and instant job description tailoring.",
    tag: "Career Launch",
  },
  {
    name: "Relationship Coach AI",
    price: "$8",
    category: "Lifestyle",
    description: "Tone-aware messaging advice and conflict de‑escalation prompts.",
    tag: "Heart Helper",
  },
  {
    name: "Startup Advisor AI",
    price: "$12",
    category: "Business",
    description: "Idea validation, lean business plans, and market analysis prompts.",
    tag: "Founder OS",
  },
];

const Templates = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-subtle text-xs font-mono tracking-wide text-muted-foreground mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Pre-built, production ready AI blueprints
          </p>
          <h1 className="text-4xl font-black tracking-tight mb-3 font-display">
            Templates <span className="text-gradient">Marketplace</span>
          </h1>
          <p className="text-muted-foreground text-lg font-body max-w-2xl mx-auto">
            Buy a template once, clone it into your account, and start chatting in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {templates.map((tpl, i) => (
            <motion.div
              key={tpl.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass rounded-2xl p-6 hover:glow-sm hover:border-primary/25 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{tpl.name}</h3>
                    <p className="text-xs text-muted-foreground font-body">{tpl.category}</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <p className="text-sm text-muted-foreground font-body mb-4">{tpl.description}</p>

              <div className="flex items-center justify-between mb-4 text-xs font-body">
                <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                  {tpl.tag}
                </span>
                <span className="text-primary font-semibold flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {tpl.price}
                </span>
              </div>

              <button
                type="button"
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                Buy &amp; Clone Template
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;

