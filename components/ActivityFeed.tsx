"use client";

import { CheckCircle2, Sparkles, TicketIcon, AlertTriangle } from "lucide-react";
import { Ticket } from "@/components/TicketList";

export function ActivityFeed({ tickets }: { tickets: Ticket[] }) {
  const recentTickets = [...tickets].slice(-5).reverse();

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-5">
        <h3 className="text-xl font-bold">Live activity</h3>
        <p className="text-sm text-white/50">
          Recent support events from your workspace
        </p>
      </div>

      {recentTickets.length === 0 ? (
        <div className="rounded-2xl bg-black/20 p-5 text-sm text-white/50">
          No activity yet. Create a ticket to start the feed.
        </div>
      ) : (
        <div className="space-y-4">
          {recentTickets.map((ticket) => {
            const resolved = ticket.status === "resolved";

            return (
              <div key={ticket.id} className="flex gap-4">
                <div
                  className={`mt-1 rounded-2xl p-3 ${
                    resolved
                      ? "bg-emerald-400/10 text-emerald-300"
                      : ticket.priority === "high"
                      ? "bg-red-400/10 text-red-300"
                      : "bg-cyan-400/10 text-cyan-200"
                  }`}
                >
                  {resolved ? (
                    <CheckCircle2 size={18} />
                  ) : ticket.priority === "high" ? (
                    <AlertTriangle size={18} />
                  ) : (
                    <TicketIcon size={18} />
                  )}
                </div>

                <div className="flex-1 border-b border-white/10 pb-4">
                  <p className="text-sm font-semibold">
                    {resolved ? "Ticket resolved" : "Ticket created"}
                  </p>
                  <p className="mt-1 text-sm text-white/55">
                    #{ticket.id} — {ticket.title}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs capitalize text-cyan-200">
                      {ticket.category || "uncategorized"}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs capitalize text-white/60">
                      {ticket.priority || "low"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex gap-4">
            <div className="mt-1 rounded-2xl bg-purple-400/10 p-3 text-purple-200">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">AI system ready</p>
              <p className="mt-1 text-sm text-white/55">
                Copilot, semantic search, and analytics are online.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}