import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React, { useState } from 'react';
import remarkBreaks from 'remark-breaks';
import {
  Bot,
  User,
  BrainCircuit,
  Sparkles,
  Send,
  ServerCrash,
  Server,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const modelConfigurations = {
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    provider: 'OpenRouter Cloud',
    endpoint: `{API_BASE}/open-router/api/chat`,
    glassCard: 'bg-sky-50/50 border-sky-200/80 hover:border-sky-400 hover:shadow-sky-100',
    headerBg: 'bg-gradient-to-r from-sky-200/90 via-cyan-100/90 to-teal-100/80 border-sky-300',
    badge: 'bg-sky-500/15 text-sky-700 border-sky-300',
    titleColor: 'text-slate-900',
    accentColor: 'text-sky-600',
    bubbleUser: 'bg-sky-50/70 border-sky-100 text-slate-700',
    bubbleAi: 'bg-white/80 border-sky-100 text-slate-800 shadow-sm',
    icon: <BrainCircuit className="w-5 h-5 text-sky-600" />
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    provider: 'Google AI Studio',
    endpoint: `{API_BASE}/gemini/api/chat`,
    glassCard: 'bg-emerald-50/50 border-emerald-200/80 hover:border-emerald-400 hover:shadow-emerald-100',
    headerBg: 'bg-gradient-to-r from-emerald-200/90 via-teal-100/90 to-green-100/80 border-emerald-300',
    badge: 'bg-emerald-500/15 text-emerald-700 border-emerald-300',
    titleColor: 'text-slate-900',
    accentColor: 'text-emerald-600',
    bubbleUser: 'bg-emerald-50/70 border-emerald-100 text-slate-700',
    bubbleAi: 'bg-white/80 border-emerald-100 text-slate-800 shadow-sm',
    icon: <Sparkles className="w-5 h-5 text-emerald-600" />
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama',
    provider: 'Local Machine',
    endpoint: `{API_BASE}/ollama/chat`,
    glassCard: 'bg-orange-50/50 border-orange-200/80 hover:border-orange-400 hover:shadow-orange-100',
    headerBg: 'bg-gradient-to-r from-orange-200/90 via-amber-100/90 to-orange-100/80 border-orange-300',
    badge: 'bg-orange-500/15 text-orange-700 border-orange-300',
    titleColor: 'text-slate-900',
    accentColor: 'text-orange-600',
    bubbleUser: 'bg-orange-50/70 border-orange-100 text-slate-700',
    bubbleAi: 'bg-white/80 border-orange-100 text-slate-800 shadow-sm',
    icon: <Server className="w-5 h-5 text-orange-600" />
  }
};

const GlassCard = ({ config, prompt, response, loading, error }) => {
  return (
      <div
          className={`relative flex flex-col rounded-3xl p-6 backdrop-blur-xl border shadow-lg 
        transition-all duration-300 ease-out cursor-default
        hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl
        ${config.glassCard}`}
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/60 via-transparent to-transparent pointer-events-none" />

        <div className={`relative flex items-center justify-between p-3.5 rounded-2xl border mb-5 ${config.headerBg}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/90 rounded-xl shadow-sm">
              {config.icon}
            </div>
            <div>
              <h3 className={`font-bold text-base leading-snug ${config.titleColor}`}>
                {config.name}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {config.provider}
              </p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${config.badge}`}>
            Active
          </span>
        </div>

        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-slate-200/80 rounded-lg mt-0.5">
              <User className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <div className="flex-1">
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Prompt
              </span>
              <div className={`p-3 text-xs rounded-xl border mt-1 min-h-[44px] ${config.bubbleUser}`}>
                {prompt || <span className="text-slate-400 italic">Awaiting prompt...</span>}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className="p-1 bg-white/80 rounded-lg mt-0.5 shadow-sm shrink-0">
              <Bot className={`w-3 h-3 ${config.accentColor}`} />
            </div>

            <div className="flex-1 flex flex-col h-full min-w-0">
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                Output
              </span>

              <div className={`p-4 text-sm leading-relaxed rounded-xl border mt-1 flex-1 min-h-[180px] max-h-[450px] overflow-y-auto overflow-x-hidden min-w-0 ${config.bubbleAi}`}>
                {loading && (
                    <div className={`flex items-center gap-2 font-medium ${config.accentColor} animate-pulse pt-2`}>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating response...
                    </div>
                )}
                {error && (
                    <div className="text-rose-600 font-medium flex items-start gap-2 pt-1">
                      <ServerCrash className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                )}
                {!loading && !error && response && (
                    <div className="
                      break-words text-slate-800 prose prose-sm max-w-none
                      leading-[1.75] tracking-[0.01em]
                      prose-p:mt-0 prose-p:mb-4
                      prose-headings:mt-6 prose-headings:mb-3 prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight
                      prose-hr:my-6 prose-hr:border-slate-200
                      prose-ul:mt-0 prose-ul:mb-4 prose-ol:mt-0 prose-ol:mb-4 prose-li:my-1.5
                      prose-strong:font-bold prose-strong:text-slate-900
                      prose-pre:my-4 prose-pre:p-4 prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:shadow-sm
                      prose-code:px-1.5 prose-code:py-0.5 prose-code:bg-slate-100 prose-code:text-sky-700 prose-code:rounded-md prose-code:font-mono prose-code:text-[13px]
                      prose-table:w-full prose-table:border-collapse prose-table:my-4 prose-table:text-sm
                      prose-th:border prose-th:border-slate-200 prose-th:p-3.5 prose-th:bg-slate-50/80 prose-th:text-left prose-th:font-bold prose-th:align-top
                      prose-td:border prose-td:border-slate-200 prose-td:p-3.5 prose-td:align-top
                      [&>p]:empty:hidden
                    ">
                      <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkBreaks]}
                          components={{
                            pre({ children, ...props }) {
                              return (
                                  <div className="w-full overflow-x-auto bg-slate-800 rounded-xl my-4 shadow-sm">
                                    <pre className="p-4 m-0 bg-transparent text-[13px] leading-relaxed" style={{ background: 'transparent' }} {...props}>
                                      {children}
                                    </pre>
                                  </div>
                              );
                            },
                            // Destructured 'inline' out of props to prevent React DOM attribute warnings
                            code({ node, inline, className, children, ...props }) {
                              const content = String(children).replace(/\n$/, '');
                              const match = /language-(\w+)/.exec(className || '');

                              if (!match && content.includes('\\n')) {
                                const parts = content.split('\\n');
                                return (
                                    <div className="w-full overflow-x-auto bg-slate-800 rounded-xl my-3 shadow-sm">
                                      <pre className="p-4 m-0 bg-transparent text-[13px] leading-relaxed" style={{ background: 'transparent' }}>
                                        <code style={{ color: '#f8fafc', background: 'transparent' }} {...props}>
                                          {parts.map((part, i) => (
                                              <React.Fragment key={i}>
                                                {part}
                                                {i !== parts.length - 1 && <br />}
                                              </React.Fragment>
                                          ))}
                                        </code>
                                      </pre>
                                    </div>
                                );
                              }

                              if (!inline && (match || content.includes('\n'))) {
                                return (
                                    <code className={className} style={{ color: '#f8fafc', background: 'transparent', whiteSpace: 'pre' }} {...props}>
                                      {children}
                                    </code>
                                );
                              }

                              return (
                                  <code className="px-1.5 py-0.5 rounded-md font-mono text-[13px]" style={{ color: '#0369a1', background: '#f1f5f9' }} {...props}>
                                    {children}
                                  </code>
                              );
                            }
                          }}
                      >
                        {response}
                      </ReactMarkdown>
                    </div>
                )}
                {!loading && !error && !response && (
                    <span className="text-slate-400 italic text-xs">Response will appear here.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [activePrompt, setActivePrompt] = useState('');
  const [loading, setLoading] = useState({ openRouter: false, gemini: false, ollama: false });
  const [responses, setResponses] = useState({ openRouter: '', gemini: '', ollama: '' });
  const [errors, setErrors] = useState({ openRouter: null, gemini: null, ollama: null });

  const fetchModelResponse = async (modelKey, endpoint, currentPrompt) => {
    setLoading(prev => ({ ...prev, [modelKey]: true }));
    setResponses(prev => ({ ...prev, [modelKey]: '' }));
    setErrors(prev => ({ ...prev, [modelKey]: null }));

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: currentPrompt
      });

      if (!res.ok) {
        // THIS IS THE FIX: It reads the detailed error text from your Spring Boot backend
        const errorText = await res.text();
        throw new Error(errorText || `Server error: HTTP ${res.status}`);
      }

      const text = await res.text();
      setResponses(prev => ({ ...prev, [modelKey]: text }));
    } catch (err) {
      setErrors(prev => ({ ...prev, [modelKey]: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, [modelKey]: false }));
    }
  };

  const handleSendPrompt = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const submittedPrompt = prompt.trim();
    setActivePrompt(submittedPrompt);

    Object.values(modelConfigurations).forEach(config => {
      fetchModelResponse(config.id, config.endpoint, submittedPrompt);
    });
  };

  const isAnyLoading = Object.values(loading).some(Boolean);

  return (
      <div className="min-h-screen bg-white relative overflow-hidden text-slate-800 font-sans selection:bg-sky-100 selection:text-sky-800">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

        <div className="relative w-full px-8 py-10">
          <header className="flex items-center justify-between pb-8 mb-8 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-500 to-amber-500 text-white shadow-md shadow-sky-200">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                  Model<span className="text-sky-600">Deck</span>
                </h1>
                <p className="text-xs text-slate-600">
                  Simultaneous Multi-Model Prompt Benchmarking
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Online</span>
            </div>
          </header>

          <section className="mb-10">
            <form
                onSubmit={handleSendPrompt}
                className="p-3 bg-white/70 backdrop-blur-2xl rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 flex flex-col sm:flex-row items-center gap-3 transition-all focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100"
            >
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask one question to evaluate OpenRouter, Gemini, and Ollama in real-time..."
                rows={2}
                className="w-full bg-transparent px-4 py-2 text-slate-800 placeholder-slate-400 resize-none outline-none text-sm leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendPrompt(e);
                  }
                }}
            />
              <button
                  type="submit"
                  disabled={isAnyLoading || !prompt.trim()}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </section>

          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(modelConfigurations).map(([key, config]) => (
                <GlassCard
                    key={key}
                    config={config}
                    prompt={activePrompt}
                    response={responses[key]}
                    loading={loading[key]}
                    error={errors[key]}
                />
            ))}
          </main>
        </div>
      </div>
  );
};

export default App;
