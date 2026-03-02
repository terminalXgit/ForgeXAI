import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/create", label: "Create AI" },
  { to: "/chat", label: "Chat" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/templates", label: "Templates" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass-strong futuristic-border border-b border-glass-border/80"
      >
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/foundrx-logo.png"
              alt="FoundrX"
              className="w-9 h-9 object-contain rounded-lg logo-glow"
            />
            <span className="text-lg font-bold tracking-tight text-foreground font-display">
              Foundr<span className="text-primary">X</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/create"
              className="hidden sm:flex px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity glow-sm"
            >
              Get Started
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-40 glass-strong p-4 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/create"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold text-center"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
