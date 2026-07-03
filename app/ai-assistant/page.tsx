"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  Brain,
  Loader2,
  MessageSquare,
  Search,
  Sparkles,
  Wand2,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";

const API_BASE = "http://127.0.0.1:8000";

type AIResult = {
  id?: number;
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  status?: string;
  resolution?: string;
  score?: number;
};

const suggestedPrompts = [
  "What are customers complaining about?",
  "Which tickets should I prioritize?",
  "Summarize all open tickets.",
  "What is the biggest risk right now?",
];

export default function AIAssistantPage() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState<AIResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function askAI(customQuery?: string) {
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;

    try {
      setLoading(true);
      setAnswer("");
      setResults([]);
      setQuery(finalQuery);

      const aiRes = await fetch(
        `${API_BASE}/tickets/ai-help?query=${encodeURIComponent(finalQuery)}`
      );

      const aiData = await aiRes.json();

      setAnswer(
        typeof aiData === "string"
          ? aiData
          : aiData.answer ||
              aiData.message ||
              aiData.response ||
              JSON.stringify(aiData, null, 2)
      );

      const searchRes = await fetch(
        `${API_BASE}/tickets/search-ai?query=${encodeURIComponent(finalQuery)}`
      );

      const searchData = await searchRes.json();
      setResults(Array.isArray(searchData) ? searchData.slice(0, 5) : []);
    } catch (error) {
      console.error("AI assistant failed:", error);
      setAnswer("AI assistant failed. Check your backend AI routes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setAnswer(
      "Ask me about customer issues, ticket priorities, billing problems, refunds, login complaints, or operational risk."
    );
  }, []);

  return (
    <DashboardShell>
      <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/15 via-white/[0.04] to-purple-500/15 p-6 shadow-2xl md:p-8">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
            <Sparkles size={16} />
            AI Copilot
          </div>

          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            AI Assistant
          </p>
          <h2 className="mt-2 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Ask your support data anything
          </h2>
          <p className="mt-4 max-w-2xl text-white/65">
            Use semantic search and AI reasoning to understand customer pain,
            prioritize tickets, and surface operational risk.
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
              <Bot size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold">AI command prompt</h3>
              <p className="text-sm text-white/50">
                Ask a question about your tickets
              </p>
            </div>
          </div>

          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Example: Which tickets should I prioritize today?"
            className="h-40 w-full resize-none rounded-3xl border border-white/10 bg-black/30 p-5 text-sm leading-6 text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
          />

          <button
            onClick={() => askAI()}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-4 font-bold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
            {loading ? "Analyzing..." : "Ask AI Copilot"}
          </button>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => askAI(prompt)}
                className="rounded-2xl border border-white/10 bg-black/20 p-4 text-left text-sm text-white/65 transition hover:bg-white/[0.06] hover:text-white"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-300/10 p-3 text-cyan-100">
              <Brain size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-cyan-100">
                Executive answer
              </h3>
              <p className="text-sm text-white/50">Generated from ticket data</p>
            </div>
          </div>

          <div className="min-h-72 rounded-3xl bg-black/30 p-5 text-sm leading-7 text-white/75">
            {loading ? (
              <div className="flex items-center gap-3 text-cyan-100">
                <Loader2 size={18} className="animate-spin" />
                Reading ticket history and generating insight...
              </div>
            ) : (
              <pre className="whitespace-pre-wrap font-sans">{answer}</pre>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-purple-400/10 p-3 text-purple-200">
            <Search size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Related tickets</h3>
            <p className="text-sm text-white/50">
              Semantic matches from your support database
            </p>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl bg-black/20 p-6 text-white/50">
            Ask a question to see related tickets.
          </div>
        ) : (
          <div className="grid gap-3">
            {results.map((ticket, index) => (
              <div
                key={`${ticket.id}-${index}`}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-cyan-200">
                      <MessageSquare size={15} />
                      Ticket #{ticket.id}
                    </div>
                    <h4 className="mt-2 text-lg font-bold">{ticket.title}</h4>
                    <p className="mt-1 text-sm leading-6 text-white/55">
                      {ticket.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Badge>{ticket.category || "uncategorized"}</Badge>
                    <Badge>{ticket.priority || "low"}</Badge>
                    <Badge>{ticket.status || "open"}</Badge>
                  </div>
                </div>

                {typeof ticket.score === "number" && (
                  <p className="mt-3 text-xs text-white/35">
                    Match score: {ticket.score.toFixed(3)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/10 px-3 py-1 text-xs capitalize text-white/70">
      {children}
    </span>
  );
}