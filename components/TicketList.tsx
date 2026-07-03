"use client";

import { useState } from "react";
import { X, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";

const API_BASE = "http://127.0.0.1:8000";

export type Ticket = {
  id: number;
  title: string;
  description: string;

  customer_contact?: string | null;
  support_inbox?: string | null;
  agent_response?: string | null;

  category?: string | null;
  priority?: string | null;
  status?: string | null;

  ai_suggested_resolution?: string | null;
  resolution?: string | null;

  created_at?: string;
};

export function TicketList({
  tickets,
  loading,
  onResolved,
}: {
  tickets: Ticket[];
  loading: boolean;
  onResolved?: () => void;
}) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  return (
    <>
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Recent Tickets</h3>
            <p className="text-sm text-white/50">
              Live data from your FastAPI backend
            </p>
          </div>

          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
            Backend Online
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-2xl bg-white/5 p-5 text-white/60">
            No tickets available.
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.slice(0, 8).map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold">{ticket.title}</h4>

                    <p className="mt-1 line-clamp-2 text-sm text-white/55">
                      {ticket.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      label={ticket.category || "uncategorized"}
                    />

                    <PriorityBadge
                      priority={ticket.priority || "low"}
                    />
                  </div>
                </div>

                <div className="mt-3 text-xs text-white/35">
                  Status: {getTicketStatus(ticket)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedTicket && (
        <TicketDrawer
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onResolved={onResolved}
        />
      )}
    </>
  );
}

function TicketDrawer({
  ticket,
  onClose,
  onResolved,
}: {
  ticket: Ticket;
  onClose: () => void;
  onResolved?: () => void;
}) {
  const status = getTicketStatus(ticket);

  const [response, setResponse] = useState(
    ticket.agent_response || ""
  );

  const [sending, setSending] = useState(false);

  async function sendResponse() {
    try {
      setSending(true);

      const res = await fetch(
        `${API_BASE}/tickets/${ticket.id}/respond`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            response,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to send response.");
      }

      onResolved?.();

      alert("Response sent successfully.");

      onClose();
    } catch (err) {
      console.error(err);
      alert("Unable to send response.");
    } finally {
      setSending(false);
    }
  }
    return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#080C18] p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
              Ticket #{ticket.id}
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {ticket.title}
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge
                label={ticket.category || "uncategorized"}
              />

              <PriorityBadge
                priority={ticket.priority || "low"}
              />

              <StatusBadge status={status} />
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl bg-white/10 p-3 hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="font-bold">
            Customer Issue
          </h3>

          <p className="mt-3 text-sm leading-7 text-white/70">
            {ticket.description}
          </p>
        </section>

        <section className="mt-5 rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-5">
          <div className="flex items-center gap-3">
            <Sparkles
              size={18}
              className="text-cyan-200"
            />

            <h3 className="font-bold text-cyan-100">
              AI Suggested Resolution
            </h3>
          </div>

          <p className="mt-3 text-sm leading-7 text-white/75">
            {ticket.ai_suggested_resolution ||
              "No AI recommendation has been generated yet."}
          </p>
        </section>

        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <h3 className="font-bold">
            Ticket Information
          </h3>

          <div className="mt-4 grid gap-3">
            <DetailRow
              label="Customer Contact"
              value={
                ticket.customer_contact ||
                "website customer"
              }
            />

            <DetailRow
              label="Support Inbox"
              value={
                ticket.support_inbox ||
                "ddwer5777@gmail.com"
              }
            />

            <DetailRow
              label="Priority"
              value={ticket.priority || "low"}
            />

            <DetailRow
              label="Status"
              value={status}
            />

            <DetailRow
              label="Category"
              value={
                ticket.category ||
                "uncategorized"
              }
            />

            <DetailRow
              label="Created"
              value={
                ticket.created_at
                  ? new Date(
                      ticket.created_at
                    ).toLocaleString()
                  : "Unknown"
              }
            />
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-cyan-300/20 bg-cyan-400/5 p-5">
          <h3 className="font-bold">
            Respond to Customer
          </h3>

          <p className="mt-2 text-sm text-white/55">
            This response will be stored on the
            ticket and can later be emailed or
            shown to the customer through the
            customer portal.
          </p>

          <textarea
            value={response}
            onChange={(e) =>
              setResponse(e.target.value)
            }
            placeholder="Type your response here..."
            className="mt-4 h-40 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none placeholder:text-white/35"
          />

          <button
            disabled={
              sending || !response.trim()
            }
            onClick={sendResponse}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-4 font-bold text-slate-900 transition hover:bg-cyan-200 disabled:opacity-50"
          >
            <CheckCircle2 size={18} />

            {sending
              ? "Sending Response..."
              : "Send Response"}
          </button>
        </section>

        <section className="mt-5 rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-5">
          <h3 className="font-bold text-emerald-300">
            Latest Customer Response
          </h3>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/75">
            {ticket.agent_response ||
              "No response has been sent yet."}
          </p>
        </section>
      </div>
    </div>
  );
}

function getTicketStatus(ticket: Ticket) {
  return (
    ticket.status ||
    (ticket.resolution &&
    ticket.resolution.trim().length > 0
      ? "resolved"
      : "open")
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-black/25 px-4 py-3">
      <span className="text-white/45">
        {label}
      </span>

      <span className="font-semibold capitalize text-white/85">
        {value}
      </span>
    </div>
  );
}

function Badge({
  label,
}: {
  label: string;
}) {
  return (
    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs capitalize text-cyan-200">
      {label}
    </span>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: string;
}) {
  const normalized =
    priority.toLowerCase();

  const styles =
    normalized === "high"
      ? "bg-red-400/10 text-red-300"
      : normalized === "medium"
      ? "bg-yellow-400/10 text-yellow-300"
      : "bg-emerald-400/10 text-emerald-300";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs capitalize ${styles}`}
    >
      <AlertTriangle
        size={12}
        className="mr-1 inline"
      />

      {normalized}
    </span>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized =
    status.toLowerCase();

  const styles =
    normalized === "resolved"
      ? "bg-emerald-400/10 text-emerald-300"
      : "bg-orange-400/10 text-orange-300";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs capitalize ${styles}`}
    >
      {normalized}
    </span>
  );
}