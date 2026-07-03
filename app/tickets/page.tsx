"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, TicketIcon } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { Ticket } from "@/components/TicketList";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  async function fetchTickets() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/tickets/`);
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const q = search.toLowerCase().trim();

      const status =
        ticket.status ||
        (ticket.resolution && ticket.resolution.trim().length > 0
          ? "resolved"
          : "open");

      const matchesSearch =
        !q ||
        ticket.title.toLowerCase().includes(q) ||
        ticket.description.toLowerCase().includes(q) ||
        (ticket.category || "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" || status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, search, statusFilter]);

  return (
    <DashboardShell>
      <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Tickets
          </p>
          <h2 className="mt-2 text-3xl font-bold md:text-5xl">
            Ticket management
          </h2>
          <p className="mt-3 max-w-2xl text-white/60">
            Review every customer issue, filter by status, and track what needs
            attention.
          </p>
        </div>

        <button
          onClick={fetchTickets}
          className="flex items-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </header>

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <MiniStat label="Total" value={tickets.length} />
        <MiniStat
          label="Open"
          value={tickets.filter((t) => getStatus(t) === "open").length}
        />
        <MiniStat
          label="Resolved"
          value={tickets.filter((t) => getStatus(t) === "resolved").length}
        />
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 md:w-96">
            <Search size={18} className="text-white/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets..."
              className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-white/35"
            />
          </div>

          <div className="flex gap-2">
            {["all", "open", "resolved"].map((item) => (
              <button
                key={item}
                onClick={() => setStatusFilter(item)}
                className={`rounded-2xl px-4 py-3 text-sm capitalize transition ${
                  statusFilter === item
                    ? "bg-cyan-300 text-slate-950"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="rounded-2xl bg-white/5 p-8 text-center text-white/50">
            No matching tickets found.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-white/[0.04] text-white/45">
                <tr>
                  <th className="p-4">Ticket</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created</th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-t border-white/10 transition hover:bg-white/[0.04]"
                  >
                    <td className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
                          <TicketIcon size={18} />
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {ticket.title}
                          </div>
                          <div className="mt-1 line-clamp-1 max-w-xl text-white/45">
                            {ticket.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <Badge>{ticket.category || "uncategorized"}</Badge>
                    </td>

                    <td className="p-4">
                      <PriorityBadge priority={ticket.priority || "low"} />
                    </td>

                    <td className="p-4">
                      <StatusBadge status={getStatus(ticket)} />
                    </td>

                    <td className="p-4 text-white/45">
                      {ticket.created_at
                        ? new Date(ticket.created_at).toLocaleDateString()
                        : "Unknown"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </DashboardShell>
  );
}

function getStatus(ticket: Ticket) {
  return (
    ticket.status ||
    (ticket.resolution && ticket.resolution.trim().length > 0
      ? "resolved"
      : "open")
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm text-white/45">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
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