import JSZip from "jszip";
import { saveAs } from "file-saver";
import { AIConfig, generateSystemPrompt, generatePersonalityMatrix } from "./generateAIConfig";

// Same chat API as the main app (Supabase Edge Function → OpenRouter)
const CHAT_API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const CHAT_AUTH = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

function generateViteProject(config: AIConfig, systemPrompt: string): Record<string, string> {
  const slug = config.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "my-ai";
  const chatUrl = CHAT_API_URL;
  const chatAuth = CHAT_AUTH;

  return {
    "package.json": JSON.stringify({
      name: slug,
      version: "1.0.0",
      private: true,
      type: "module",
      scripts: {
        dev: "vite",
        build: "vite build",
        preview: "vite preview",
      },
      dependencies: {
        react: "^18.3.1",
        "react-dom": "^18.3.1",
      },
      devDependencies: {
        "@types/react": "^18.3.0",
        "@types/react-dom": "^18.3.0",
        "@vitejs/plugin-react": "^4.3.0",
        vite: "^5.4.0",
      },
    }, null, 2),

    "vite.config.js": `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n});`,

    "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${config.name} AI</title>
  <meta name="description" content="${config.name} - AI assistant specializing in ${config.speciality}" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>`,

    "src/main.jsx": `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')).render(\n  <React.StrictMode><App /></React.StrictMode>\n);`,

    "src/index.css": `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #0a0a0f; color: #e2e8f0; min-height: 100vh; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }`,

    "src/App.jsx": `import { useState, useRef, useEffect } from 'react';
import { SYSTEM_PROMPT, AI_CONFIG } from './config';

const CHAT_URL = ${JSON.stringify(chatUrl)};
const CHAT_AUTH = ${JSON.stringify(chatAuth)};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(CHAT_AUTH && { Authorization: \`Bearer \${CHAT_AUTH}\` }),
        },
        body: JSON.stringify({ messages: newMessages, systemPrompt: SYSTEM_PROMPT }),
      });

      if (!res.ok) throw new Error('API error');

      // Handle streaming
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to AI service. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ padding: '20px 0', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(168,85,247,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>${config.name}</h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>${config.speciality}</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569' }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>👋</p>
            <p style={{ fontSize: 16, fontWeight: 500 }}>Start a conversation with ${config.name}</p>
            <p style={{ fontSize: 14, marginTop: 4 }}>${config.speciality}</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12, gap: 8 }}>
            {m.role === 'assistant' && <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(56,189,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, marginTop: 2 }}>🤖</div>}
            <div style={{ maxWidth: '80%', padding: '10px 16px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.role === 'user' ? 'rgba(56,189,248,0.1)' : '#111827', border: '1px solid ' + (m.role === 'user' ? 'rgba(56,189,248,0.15)' : '#1e293b'), color: '#e2e8f0', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div style={{ display: 'flex', gap: 4, padding: '8px 0' }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', animation: 'pulse 1.4s ease-in-out infinite', animationDelay: i * 0.2 + 's' }} />)}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '16px 0', borderTop: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', gap: 8, background: '#111827', borderRadius: 24, border: '1px solid #1e293b', padding: '4px 4px 4px 20px', alignItems: 'center' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Type a message..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#e2e8f0', fontSize: 14, padding: '10px 0' }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            style={{ width: 40, height: 40, borderRadius: 20, background: input.trim() ? '#38bdf8' : '#1e293b', border: 'none', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() ? '#0a0a0f' : '#475569'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>
          </button>
        </div>
      </div>
      <style>{\`@keyframes pulse { 0%,60%,100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-4px); } }\`}</style>
    </div>
  );
}`,

    "src/config.js": `export const SYSTEM_PROMPT = ${JSON.stringify(systemPrompt)};

export const AI_CONFIG = ${JSON.stringify({ name: config.name, personality: config.personality, speciality: config.speciality, rules: config.rules, interests: config.interests }, null, 2)};

export const PERSONALITY_MATRIX = ${JSON.stringify(generatePersonalityMatrix(config), null, 2)};`,

    "README.md": `# ${config.name} AI

A custom AI assistant specializing in ${config.speciality}.

## Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

No backend required. Chat uses the same FoundrX API (OpenRouter).

## Architecture

- **Frontend**: React + Vite with streaming chat UI
- **API**: FoundrX Supabase Edge Function (OpenRouter)
- **Config**: System prompt and personality in \`src/config.js\`

## Customization

Edit \`src/config.js\` to adjust the system prompt, personality, and behavior rules.

## Deployment

Deploy to any static host (Vercel, Netlify, etc.).
`,
  };
}

export async function generateAndDownloadZip(config: AIConfig): Promise<void> {
  const systemPrompt = generateSystemPrompt(config);
  const files = generateViteProject(config, systemPrompt);
  const zip = new JSZip();
  const slug = config.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "my-ai";

  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${slug}-ai.zip`);
}
