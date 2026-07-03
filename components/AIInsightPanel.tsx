"use client";

import { useMemo, useState } from "react";
import {
  Bot,
  Copy,
  Loader2,
  MessageSquare,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Wand2,
} from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

const suggestedPrompts = [
  "What are customers complaining about?",
  "Which tickets should we fix first?",
  "What is the biggest risk right now?",
  "Summarize the billing issues.",
];

export function AIInsightPanel({
  total,
  open,
  topCategory,
}: {
  total: number;
  open: number;
  topCategory: string;
}) {
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);
  const [copied, setCopied] = useState(false);

  const systemSummary = useMemo(() => {
    if (total === 0) return "Add tickets to unlock AI analysis.";

    return `${total} tickets processed. ${open} still need attention. Strongest signal: ${topCategory}.`;
  }, [total, open, topCategory]);

  async function askAI(customPrompt?: string) {
    const finalQuery = customPrompt ?? query;
    if (!finalQuery.trim()) return;

    try {
      setLoadingAI(true);
      setAiResponse("");
      setFeedback(null);
      setCopied(false);

      const res = await fetch(
        `${API_BASE}/tickets/search?query=${encodeURIComponent(finalQuery)}`
      );

      const data = await res.json();

      const response =
        typeof data === "string"
          ? data
          : data.answer ||
            data.message ||
            data.response ||
            data.summary ||
            formatSearchResponse(data, finalQuery);

      setAiResponse(response);
      setQuery(finalQuery);
    } catch (error) {
      console.error("AI request failed:", error);
      setAiResponse(
        "I could not reach the AI route. Make sure your FastAPI backend is running on http://127.0.0.1:8000."
      );
    } finally {
      setLoadingAI(false);
    }
  }

  async function copyResponse() {
    if (!aiResponse) return;
    await navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-3xl border border-cyan-300/20 bg-gradient-to-b from-cyan-400/10 via-white/[0.04] to-purple-500/10 p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
            <Bot size={22} />
          </div>

          <div>
            <h3 className="text-xl font-bold">AI Copilot</h3>
            <p className="text-sm text-white/50">
              Free local support assistant
            </p>
          </div>
        </div>

        <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
          Online
        </span>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-white/70">
        <div className="mb-2 flex items-center gap-2 text-cyan-200">
          <Sparkles size={15} />
          Live context
        </div>
        {systemSummary}
      </div>

      <div className="mt-5 grid gap-2">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => askAI(prompt)}
            disabled={loadingAI}
            className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm text-white/65 transition hover:border-cyan-300/30 hover:bg-cyan-400/10 hover:text-cyan-100 disabled:opacity-60"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me like ChatGPT: What should support do about billing?"
          className="h-28 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/50"
        />

        <button
          onClick={() => askAI()}
          disabled={loadingAI || !query.trim()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingAI ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <Wand2 size={18} />
              Ask AI
            </>
          )}
        </button>

        {(loadingAI || aiResponse) && (
          <div className="mt-5 rounded-3xl border border-white/10 bg-black/30 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
                <MessageSquare size={16} />
                AI response
              </div>

              {aiResponse && (
                <button
                  onClick={copyResponse}
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs text-white/70 transition hover:bg-white/15"
                >
                  <Copy size={13} />
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            {loadingAI ? (
              <div className="space-y-3">
                <div className="h-4 w-4/5 animate-pulse rounded-full bg-white/10" />
                <div className="h-4 w-3/5 animate-pulse rounded-full bg-white/10" />
                <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/10" />
              </div>
            ) : (
              <div className="whitespace-pre-wrap text-sm leading-6 text-white/75">
                {aiResponse}
              </div>
            )}

            {aiResponse && (
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <p className="text-xs text-white/40">Was this useful?</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setFeedback("good")}
                    className={`rounded-xl px-3 py-2 text-xs transition ${
                      feedback === "good"
                        ? "bg-emerald-400/20 text-emerald-300"
                        : "bg-white/10 text-white/60 hover:bg-white/15"
                    }`}
                  >
                    <ThumbsUp size={14} />
                  </button>

                  <button
                    onClick={() => setFeedback("bad")}
                    className={`rounded-xl px-3 py-2 text-xs transition ${
                      feedback === "bad"
                        ? "bg-red-400/20 text-red-300"
                        : "bg-white/10 text-white/60 hover:bg-white/15"
                    }`}
                  >
                    <ThumbsDown size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function formatSearchResponse(data: unknown, query: string) {
  const results = Array.isArray(data)
    ? data
    : (data as any)?.results || (data as any)?.tickets || (data as any)?.matches || [];

  if (!Array.isArray(results) || results.length === 0) {
    return "I could not find matching tickets for that yet. Try asking about billing, refunds, login, shipping, or high-priority issues.";
  }

  const top = results[0];
  const queryLower = query.toLowerCase();
  const category = top.category || "uncategorized";

  const open = results.filter((t: any) => (t.status || "open") === "open").length;
  const high = results.filter((t: any) => (t.priority || "low") === "high").length;

  const mainIssue =
    category === "billing"
      ? "payment, refund, or checkout problems"
      : `${category} issues`;

  const intro =
    queryLower.includes("fix") || queryLower.includes("first") || queryLower.includes("priority")
      ? `I would start with the ${category} tickets first.`
      : queryLower.includes("risk") || queryLower.includes("biggest")
      ? `The biggest visible risk is around ${category}.`
      : `For ${query}, I found a clear pattern.`;

  return `
${intro}

The main issue seems to be ${mainIssue}. The strongest match is Ticket #${top.id}: "${top.title}".

Here’s what I’m seeing:
• ${results.length} related tickets matched your question.
• ${open} of them are still open.
• ${high} are high priority.
• The main category is ${category}.

My read:
This matters because customers are not just asking general questions — they are reporting issues that can affect trust, support volume, and product confidence.

What I would do next:
1. Review the high-priority tickets first.
2. Check whether these tickets share the same root cause.
3. Prepare a clear support response for affected customers.
4. Escalate repeated unresolved issues.

Related tickets:
${results
  .slice(0, 5)
  .map(
    (t: any) =>
      `- Ticket #${t.id}: ${t.title} | ${t.priority || "low"} | ${t.status || "open"}`
  )
  .join("\n")}
`.trim();
}