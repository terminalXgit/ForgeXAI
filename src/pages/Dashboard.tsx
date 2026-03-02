import { motion } from "framer-motion";
import { Bot, BarChart3, DollarSign, ExternalLink, Plus, Settings, Trash2, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const mockAIs = [
  { id: 1, name: "Atlas", speciality: "Technology", responses: 1243, status: "active", created: "2 days ago" },
  { id: 2, name: "Nova", speciality: "Health & Wellness", responses: 847, status: "active", created: "5 days ago" },
  { id: 3, name: "Echo", speciality: "Creative Writing", responses: 312, status: "paused", created: "1 week ago" },
];

const stats = [
  { label: "Total AIs", value: "3", icon: Bot, trend: "+1 this week" },
  { label: "Total Responses", value: "2,402", icon: BarChart3, trend: "+342 today" },
  { label: "Revenue", value: "$0.00", icon: DollarSign, trend: "Set up payments" },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1 font-body">Manage your AI creations</p>
          </div>
          <Link
            to="/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm glow-sm hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New AI
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-2xl p-6 hover:glow-sm transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  {stat.label}
                </span>
              </div>
              <p className="text-3xl font-black text-foreground mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-body">{stat.trend}</p>
            </div>
          ))}
        </motion.div>

        {/* AI List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-bold mb-4">Your AIs</h2>
          <div className="space-y-3">
            {mockAIs.map((ai, i) => (
              <motion.div
                key={ai.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="glass rounded-2xl p-5 flex items-center justify-between group hover:glow-sm hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{ai.name}</h3>
                    <p className="text-sm text-muted-foreground font-body">{ai.speciality}</p>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">{ai.responses.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Responses</p>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        ai.status === "active"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {ai.status}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-body">{ai.created}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button className="p-2.5 rounded-xl hover:bg-secondary transition-colors" title="Settings">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-2.5 rounded-xl hover:bg-secondary transition-colors" title="View">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
