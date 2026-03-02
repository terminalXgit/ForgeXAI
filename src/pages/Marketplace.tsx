import { motion } from "framer-motion";
import { Bot, Star, Users, Search, ArrowUpRight } from "lucide-react";
import { useState } from "react";

const mockMarketplace = [
  { id: 1, name: "CodeMentor", speciality: "Programming", rating: 4.9, users: 2341, creator: "Sarah K.", tags: ["Code", "Debug"] },
  { id: 2, name: "HealthBot", speciality: "Medical Advice", rating: 4.7, users: 1892, creator: "Dr. Mike", tags: ["Health", "Wellness"] },
  { id: 3, name: "LegalEagle", speciality: "Legal Consultation", rating: 4.8, users: 1567, creator: "James L.", tags: ["Law", "Contracts"] },
  { id: 4, name: "FinanceGuru", speciality: "Investment", rating: 4.6, users: 1234, creator: "Alex T.", tags: ["Finance", "Stocks"] },
  { id: 5, name: "ChefAI", speciality: "Cooking & Recipes", rating: 4.9, users: 3102, creator: "Maria G.", tags: ["Food", "Recipes"] },
  { id: 6, name: "FitCoach", speciality: "Fitness", rating: 4.5, users: 987, creator: "Chris P.", tags: ["Fitness", "Health"] },
];

const Marketplace = () => {
  const [search, setSearch] = useState("");
  const filtered = mockMarketplace.filter(
    (ai) =>
      ai.name.toLowerCase().includes(search.toLowerCase()) ||
      ai.speciality.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-black tracking-tight mb-3">
            AI <span className="text-gradient">Marketplace</span>
          </h1>
          <p className="text-muted-foreground text-lg font-body">Discover and clone powerful AI personalities</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-lg mx-auto mb-12"
        >
          <div className="chat-input-curved flex items-center gap-3 px-5 py-3.5">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search AIs by name or speciality..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none font-body"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {filtered.map((ai, i) => (
            <motion.div
              key={ai.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className="glass rounded-2xl p-6 hover:glow-sm hover:border-primary/20 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{ai.name}</h3>
                    <p className="text-xs text-muted-foreground font-body">{ai.speciality}</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {ai.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg bg-secondary text-xs text-muted-foreground font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-primary fill-primary" />
                  {ai.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {ai.users.toLocaleString()}
                </span>
                <span className="font-body">by {ai.creator}</span>
              </div>

              <button className="w-full py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-colors">
                Clone AI
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
