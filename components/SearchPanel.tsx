"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Ticket } from "./TicketList";

export function SearchPanel({ tickets }: { tickets: Ticket[] }) {
  const [search, setSearch] = useState("");

  const results = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return tickets.slice(0, 5);

    return tickets.filter((ticket) => {
      return (
        ticket.title.toLowerCase().includes(q) ||
        ticket.description.toLowerCase().includes(q) ||
        (ticket.category || "").toLowerCase().includes(q)
      );
    });
  }, [search, tickets]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-5">
        <h3 className="text-xl font-bold">Search tickets</h3>
        <p className="text-sm text-white/50">
          Search across titles, descriptions, and categories
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4">
        <Search size={18} className="text-white/40" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search payment, refund, login..."
          className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-white/35"
        />
      </div>

      <div className="mt-4 space-y-3">
        {results.length === 0 ? (
          <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/50">
            No matching tickets found.
          </div>
        ) : (
          results.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <h4 className="font-semibold">{ticket.title}</h4>
                <span className="text-xs text-cyan-200">
                  {ticket.category || "uncategorized"}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-white/50">
                {ticket.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}