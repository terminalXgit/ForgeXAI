import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Create from "./pages/Create";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import Templates from "./pages/Templates";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/create" element={<Layout><Create /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/marketplace" element={<Layout><Marketplace /></Layout>} />
          <Route path="/templates" element={<Layout><Templates /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
