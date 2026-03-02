import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Bot, Rocket, Shield, Zap, Globe } from "lucide-react";

const HeroSection = () => {
  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden scanline">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid-fine opacity-30" />
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute inset-0 bg-radial-glow-purple" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[180px]" />
        <div className="absolute top-2/3 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[140px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/4 blur-[100px]" />

        <div className="relative container mx-auto px-6 pt-28 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted-foreground mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>No coding required · Deploy in 60 seconds</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6 font-display">
              Create Your
              <br />
              <span className="text-gradient">Personal AI</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-body">
              Build, deploy, and share custom AI personalities in under a minute.
              Zero code. Full stack. Instant download.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/create">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-lg flex items-center gap-2.5 glow-md hover:opacity-90 transition-opacity"
                >
                  Create Your AI
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
              <Link
                to="/marketplace"
                className="px-8 py-4 rounded-2xl glass text-foreground font-medium text-lg hover:bg-secondary/80 transition-colors"
              >
                Explore Marketplace
              </Link>
            </div>
          </motion.div>

          {/* 3-step process */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {[
              {
                icon: Bot,
                step: "01",
                title: "Define Personality",
                desc: "Set your AI's name, traits, and behavior with intuitive sliders and fields.",
              },
              {
                icon: Sparkles,
                step: "02",
                title: "Forge Configuration",
                desc: "We auto-generate system prompts, behavior rules, and a full React application.",
              },
              {
                icon: Rocket,
                step: "03",
                title: "Download & Deploy",
                desc: "Get a production-ready ZIP with chat UI, config, and API setup — ready to ship.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.15 }}
                className="glass rounded-2xl p-8 group hover:glow-sm transition-all duration-300 hover:border-primary/30"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center group-hover:from-primary/25 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground tracking-wider">
                    STEP {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-body">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow-purple opacity-50" />
        <div className="relative container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 font-display">
              Everything You <span className="text-gradient-purple">Need</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-body">
              Production-ready AI applications with enterprise-grade features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {[
              { icon: Zap, title: "Instant Generation", desc: "Full-stack project generated in under 60 seconds." },
              { icon: Shield, title: "Secure by Default", desc: "API keys in .env, never exposed in frontend code." },
              { icon: Globe, title: "Ready to Deploy", desc: "Download ZIP, install, and launch on any platform." },
              { icon: Bot, title: "Custom Personality", desc: "Fine-tune behavior with sliders and custom rules." },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-subtle rounded-2xl p-6 hover:glass transition-all duration-300"
              >
                <feat.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-foreground mb-1.5">{feat.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center glass rounded-3xl p-12 md:p-16 glow-md"
          >
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 font-display">
              Ready to Build Your AI?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 font-body">
              Join thousands of creators building custom AI experiences.
            </p>
            <Link to="/create">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-lg glow-md"
              >
                <Sparkles className="w-5 h-5" />
                Start Creating — Free
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
