"use client";

import { AlertTriangle, Brain, CheckCircle2, Sparkles } from "lucide-react";

type Brief = {
  summary: string;
  risk_score: number;
  risk_level: string;
  top_issue: string;
  recommendation: string;
  signals: string[];
};

export function ExecutiveBrief({ brief }: { brief: Brief | null }) {
  const risk = brief?.risk_score ?? 0;
  const level = brief?.risk_level ?? "low";

  const riskStyle =
    level === "high"
      ? "text-red-300 bg-red-400/10"
      : level === "medium"
      ? "text-yellow-300 bg-yellow-400/10"
      : "text-emerald-300 bg-emerald-400/10";

  return (
    <div className="rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-300/10 p-3 text-cyan-200">
            <Brain size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Executive Brief</h3>
            <p className="text-sm text-white/50">
              Free local AI analysis from your ticket data
            </p>
          </div>
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${riskStyle}`}>
          {level} risk
        </span>
      </div>

      <p className="text-sm leading-7 text-white/70">
        {brief?.summary || "No executive brief available yet."}
      </p>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-white/45">
          <span>Risk score</span>
          <span>{risk}/100</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-cyan-300 transition-all"
            style={{ width: `${risk}%` }}
          />
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-black/25 p-4">
        <div className="mb-2 flex items-center gap-2 text-cyan-200">
          <Sparkles size={16} />
          <p className="font-semibold">Recommended action</p>
        </div>
        <p className="text-sm leading-6 text-white/65">
          {brief?.recommendation || "Create tickets to generate recommendations."}
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {(brief?.signals || []).map((signal) => (
          <div
            key={signal}
            className="flex items-center gap-3 rounded-2xl bg-black/20 px-4 py-3 text-sm text-white/65"
          >
            {level === "high" ? (
              <AlertTriangle size={16} className="text-red-300" />
            ) : (
              <CheckCircle2 size={16} className="text-emerald-300" />
            )}
            {signal}
          </div>
        ))}
      </div>
    </div>
  );
}