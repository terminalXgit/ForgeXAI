import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Plus,
  MessageSquare,
  Trash2,
  Menu,
  X,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { streamChat } from "@/lib/streamChat";
import { generateSystemPrompt, defaultConfig, type AIConfig } from "@/lib/generateAIConfig";
import { useSearchParams } from "react-router-dom";

type Msg = { role: "user" | "assistant"; content: string };

interface Conversation {
  id: string;
  title: string;
  messages: Msg[];
  systemPrompt: string;
  aiName: string;
  createdAt: number;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem("foundrx-conversations");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveConversations(convos: Conversation[]) {
  localStorage.setItem("foundrx-conversations", JSON.stringify(convos));
}

const Chat = () => {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const activeConvo = conversations.find((c) => c.id === activeId) || null;
  const messages = activeConvo?.messages || [];

  // Initialize from URL params (from forge flow)
  useEffect(() => {
    const configParam = searchParams.get("config");
    if (configParam) {
      try {
        const config: AIConfig = JSON.parse(decodeURIComponent(configParam));
        const systemPrompt = generateSystemPrompt(config);
        const convo: Conversation = {
          id: generateId(),
          title: `Chat with ${config.name}`,
          messages: [],
          systemPrompt,
          aiName: config.name,
          createdAt: Date.now(),
        };
        setConversations((prev) => {
          const updated = [convo, ...prev];
          saveConversations(updated);
          return updated;
        });
        setActiveId(convo.id);
      } catch {}
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isStreaming) inputRef.current?.focus();
  }, [isStreaming, activeId]);

  const createNewChat = useCallback(() => {
    const convo: Conversation = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      systemPrompt: generateSystemPrompt(defaultConfig),
      aiName: defaultConfig.name,
      createdAt: Date.now(),
    };
    setConversations((prev) => {
      const updated = [convo, ...prev];
      saveConversations(updated);
      return updated;
    });
    setActiveId(convo.id);
    setSidebarOpen(false);
    setError(null);
  }, []);

  const deleteChat = useCallback((id: string) => {
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveConversations(updated);
      return updated;
    });
    setActiveId((prevId) => (prevId === id ? null : prevId));
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming) return;

    let convoId = activeId;
    const userMsg: Msg = { role: "user", content: input.trim() };

    // Auto-create conversation if none active
    if (!convoId) {
      const convo: Conversation = {
        id: generateId(),
        title: input.trim().slice(0, 40),
        messages: [],
        systemPrompt: generateSystemPrompt(defaultConfig),
        aiName: defaultConfig.name,
        createdAt: Date.now(),
      };
      convoId = convo.id;
      setConversations((prev) => {
        const updated = [convo, ...prev];
        saveConversations(updated);
        return updated;
      });
      setActiveId(convoId);
    }

    setInput("");
    setError(null);
    setIsStreaming(true);

    // Add user message
    setConversations((prev) => {
      const updated = prev.map((c) => {
        if (c.id !== convoId) return c;
        const newMessages = [...c.messages, userMsg];
        const title = c.messages.length === 0 ? userMsg.content.slice(0, 40) : c.title;
        return { ...c, messages: newMessages, title };
      });
      saveConversations(updated);
      return updated;
    });

    const convo = conversations.find((c) => c.id === convoId);
    const allMessages = [...(convo?.messages || []), userMsg];

    const controller = new AbortController();
    abortRef.current = controller;
    let assistantContent = "";

    const updateAssistant = (content: string) => {
      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c.id !== convoId) return c;
          const msgs = [...c.messages];
          const last = msgs[msgs.length - 1];
          if (last?.role === "assistant") {
            msgs[msgs.length - 1] = { ...last, content };
          } else {
            msgs.push({ role: "assistant", content });
          }
          return { ...c, messages: msgs };
        });
        saveConversations(updated);
        return updated;
      });
    };

    await streamChat({
      messages: allMessages,
      systemPrompt: convo?.systemPrompt,
      signal: controller.signal,
      onDelta: (chunk) => {
        assistantContent += chunk;
        updateAssistant(assistantContent);
      },
      onDone: () => {
        setIsStreaming(false);
        abortRef.current = null;
      },
      onError: (err) => {
        setError(err);
        setIsStreaming(false);
        abortRef.current = null;
      },
    });
  }, [input, isStreaming, activeId, conversations]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar overlay (mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:relative z-50 lg:z-auto h-full w-72 flex flex-col border-r border-border bg-card ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform duration-200`}
      >
        <div className="p-4 flex items-center justify-between border-b border-border">
          <span className="text-sm font-bold text-foreground flex items-center gap-2 font-display">
            <img src="/foundrx-logo.png" alt="" className="w-5 h-5 object-contain rounded" />
            FoundrX Chat
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={createNewChat}
          className="mx-3 mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm text-foreground hover:bg-secondary transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>

        <div className="flex-1 overflow-y-auto mt-3 px-3 space-y-1">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveId(c.id);
                setSidebarOpen(false);
                setError(null);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-colors group ${
                activeId === c.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="flex-1 truncate">{c.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(c.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 transition-all"
              >
                <Trash2 className="w-3 h-3 text-destructive" />
              </button>
            </button>
          ))}
        </div>
      </motion.aside>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-14 flex items-center px-4 gap-3 border-b border-border bg-card/50 backdrop-blur-md shrink-0 futuristic-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img
            src="/foundrx-logo.png"
            alt="FoundrX"
            className="w-8 h-8 object-contain rounded-lg shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {activeConvo?.aiName || "FoundrX AI"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isStreaming ? "Thinking..." : "Online"}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 flex items-center justify-center mb-6 glow-md">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  How can I help you?
                </h2>
                <p className="text-muted-foreground text-sm font-body max-w-md">
                  Start a conversation with your AI assistant. Ask anything — I'm here to help.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary/15 border border-primary/20 rounded-br-md"
                      : "bg-secondary/60 rounded-bl-md"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed font-body [&_p]:mb-2 [&_p:last-child]:mb-0 [&_code]:bg-background/50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_pre]:bg-background/50 [&_pre]:rounded-xl [&_pre]:p-3 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm text-foreground leading-relaxed font-body">
                      {msg.content}
                    </p>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}

            {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-center gap-1.5 py-3 px-4">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <div ref={endRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card/30 backdrop-blur-md shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="chat-input-curved flex items-end gap-3 px-5 py-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                disabled={isStreaming}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none resize-none font-body max-h-32 disabled:opacity-50"
                style={{ minHeight: "24px" }}
              />
              <button
                onClick={sendMessage}
                disabled={isStreaming || !input.trim()}
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  input.trim() && !isStreaming
                    ? "bg-primary text-primary-foreground glow-sm hover:opacity-90"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
