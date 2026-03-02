import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter Spark",
    badge: "FREE",
    price: "$0",
    subtitle: "Perfect to explore FoundrX",
    highlight: "30 Coffees / month",
    gradient: "from-zinc-700/40 to-zinc-900/60",
    border: "border-zinc-500/40",
    buttonVariant: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    features: [
      "Create 1 AI",
      "30 Coffees / month",
      "Basic customization",
      "Forge AI watermark",
      "Community support",
    ],
  },
  {
    name: "Creator Mode",
    badge: "POPULAR",
    price: "$12",
    suffix: "/month",
    subtitle: "Scale your personal AI brand",
    highlight: "500 Coffees / month",
    gradient: "from-sky-500/40 via-sky-400/20 to-slate-900/80",
    border: "border-sky-400/60",
    buttonVariant: "bg-primary text-primary-foreground hover:bg-primary/90",
    glow: "glow-sm",
    features: [
      "Create 10 AIs",
      "500 Coffees / month",
      "Memory enabled",
      "Custom personality",
      "Remove watermark",
      "Basic analytics",
      "Priority queue",
    ],
  },
  {
    name: "Empire Builder",
    badge: "BUSINESS",
    price: "$29",
    suffix: "/month",
    subtitle: "Launch a full AI business",
    highlight: "2,500 Coffees / month",
    gradient: "from-violet-500/40 via-fuchsia-500/20 to-slate-900/80",
    border: "border-violet-400/60",
    buttonVariant: "bg-violet-500 text-white hover:bg-violet-400",
    glow: "glow-purple",
    features: [
      "Unlimited AI creation",
      "2,500 Coffees / month",
      "API access",
      "Custom domain support",
      "Monetize your AI",
      "Advanced analytics",
      "Early feature access",
    ],
  },
  {
    name: "Founder Pass",
    badge: "LIFETIME • 100 SPOTS",
    price: "$79",
    subtitle: "Own a piece of FoundrX forever",
    highlight: "1,000 Coffees monthly reset",
    gradient: "from-amber-400/60 via-amber-200/10 to-slate-900/90",
    border: "border-amber-400/70",
    buttonVariant: "bg-amber-400 text-slate-900 hover:bg-amber-300",
    glow: "glow-sm",
    isLifetime: true,
    features: [
      "All PRO features forever",
      "1,000 Coffees / month",
      "Founder badge on profile",
      "Price locked forever",
      "Limited to 100 founders",
    ],
  },
];

const coffeePacks = [
  { name: "Small Brew", coffees: 200, price: "$4" },
  { name: "Medium Brew", coffees: 600, price: "$9" },
  { name: "Power Brew", coffees: 2000, price: "$19" },
  { name: "Mega Brew", coffees: 5000, price: "$39" },
];

const PricingSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow opacity-40" />
      <div className="relative container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-subtle text-xs font-mono tracking-wide text-muted-foreground mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            1 Coffee = 1,000 AI tokens
          </p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 font-display">
            Fuel Your <span className="text-gradient-purple">Forge</span> with Coffees
          </h2>
          <p className="text-muted-foreground text-lg font-body">
            Start free, grow into Creator Mode, or lock in a Founder Pass for life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto mb-14">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className={`relative rounded-3xl glass-subtle border ${plan.border} bg-gradient-to-br ${plan.gradient} p-6 flex flex-col justify-between overflow-hidden group ${plan.glow || ""}`}
            >
              <div className="absolute inset-px rounded-[22px] border border-white/5 pointer-events-none group-hover:border-white/10 transition-colors" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-mono tracking-[0.18em] uppercase text-muted-foreground">
                    {plan.badge}
                  </p>
                  <span className="px-2.5 py-1 rounded-full bg-black/20 text-[10px] font-semibold tracking-wide text-amber-100 border border-white/10">
                    {plan.highlight}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground font-body mb-5">{plan.subtitle}</p>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-black text-foreground">{plan.price}</span>
                  {plan.suffix && (
                    <span className="text-xs text-muted-foreground font-body">{plan.suffix}</span>
                  )}
                </div>
                <ul className="space-y-2.5 mb-6 text-sm text-muted-foreground font-body">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary/70 shadow-[0_0_10px_rgba(56,189,248,0.6)]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className={`relative mt-auto w-full py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${plan.buttonVariant}`}
                type="button"
              >
                {plan.isLifetime ? "Get Founder Pass" : "Upgrade"}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto glass-subtle rounded-3xl p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold mb-1">Coffee Recharge Packs</h3>
              <p className="text-sm text-muted-foreground font-body">
                Top up your Coffees any time. Perfect for spikes in usage or viral launches.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
              {coffeePacks.map((pack) => (
                <div
                  key={pack.name}
                  className="rounded-2xl bg-secondary/60 border border-glass-border/50 px-3 py-3 text-xs font-body flex flex-col gap-1"
                >
                  <span className="font-semibold text-foreground">{pack.name}</span>
                  <span className="text-muted-foreground">{pack.coffees.toLocaleString()} Coffees</span>
                  <span className="text-primary font-semibold">{pack.price}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;

