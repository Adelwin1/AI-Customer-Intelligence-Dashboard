"use client";

import { useState } from "react";
import { Loader2, Search, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

type SearchResult = {
  id: number;
  title: string;
  description: string;
  category?: string | null;
  priority?: string | null;
  status?: string | null;
  resolution?: string | null;
  score?: number;
};

const examples = [
  "duplicate payment",
  "login password reset",
  "refund delay",
  "app crash",
  "shipping tracking",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"semantic" | "keyword">("semantic");

  async function runSearch(customQuery?: string) {
    const finalQuery = customQuery || query;
    if (!finalQuery.trim()) return;

    try {
      setLoading(true);
      setQuery(finalQuery);

      const endpoint =
        mode === "semantic" ? "/tickets/search-ai" : "/tickets/search";

      const res = await fetch(
        `${API_BASE}${endpoint}?query=${encodeURIComponent(finalQuery)}`
      );

      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardShell>
      <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/15 via-white/[0.04] to-purple-500/15 p-6 shadow-2xl md:p-8">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
            <Sparkles size={16} />
            Semantic search
          </div>

          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Search
          </p>
          <h2 className="mt-2 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Find tickets by meaning, not just keywords
          </h2>
          <p className="mt-4 max-w-2xl text-white/65">
            Search across customer complaints using keyword matching or AI
            similarity search.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex w-full items-center gap-3 rounded-3xl border border-white/10 bg-black/30 px-5 xl:max-w-3xl">
            <Search size={20} className="text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSearch();
              }}
              placeholder="Search for payment failures, refund delays, login issues..."
              className="w-full bg-transparent py-5 text-sm text-white outline-none placeholder:text-white/35"
            />
          </div>

          <div className="flex gap-2">
            {(["semantic", "keyword"] as const).map((item) => (
              <button
                key={item}
                onClick={() => setMode(item)}
                className={`rounded-2xl px-4 py-3 text-sm capitalize transition ${
                  mode === item
                    ? "bg-cyan-300 text-slate-950"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {item}
              </button>
            ))}

            <button
              onClick={() => runSearch()}
              disabled={loading}
              className="flex items-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example}
              onClick={() => runSearch(example)}
              className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs text-white/55 transition hover:bg-white/10 hover:text-white"
            >
              {example}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-5">
          <h3 className="text-xl font-bold">Search results</h3>
          <p className="text-sm text-white/50">
            {results.length > 0
              ? `${results.length} matching tickets found`
              : "Run a search to find related tickets"}
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-28 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-3xl bg-black/20 p-10 text-center text-white/50">
            No results yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {results.map((ticket) => (
              <article
                key={ticket.id}
                className="rounded-3xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/[0.05]"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                      Ticket #{ticket.id}
                    </p>
                    <h4 className="mt-2 text-xl font-bold">{ticket.title}</h4>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
                      {ticket.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Badge>{ticket.category || "uncategorized"}</Badge>
                    <PriorityBadge priority={ticket.priority || "low"} />
                    <StatusBadge status={ticket.status || "open"} />
                  </div>
                </div>

                {typeof ticket.score === "number" && (
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs text-white/40">
                      <span>Match score</span>
                      <span>{ticket.score.toFixed(3)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-cyan-300"
                        style={{
                          width: `${Math.min(Math.max(ticket.score * 100, 8), 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs capitalize text-cyan-200">
      {children}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const normalized = priority.toLowerCase();

  const styles =
    normalized === "high"
      ? "bg-red-400/10 text-red-300"
      : normalized === "medium"
      ? "bg-yellow-400/10 text-yellow-300"
      : "bg-emerald-400/10 text-emerald-300";

  return (
    <span className={`rounded-full px-3 py-1 text-xs capitalize ${styles}`}>
      {normalized}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();

  const styles =
    normalized === "resolved"
      ? "bg-emerald-400/10 text-emerald-300"
      : "bg-orange-400/10 text-orange-300";

  return (
    <span className={`rounded-full px-3 py-1 text-xs capitalize ${styles}`}>
      {normalized}
    </span>
  );
}