"use client";

import { useState } from "react";
import { Mail, Phone, Plus, CheckCircle2 } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export function TicketComposer({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [contactType, setContactType] = useState("email");
  const [contact, setContact] = useState("");

  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState("");

  async function createTicket() {
    if (!title.trim() || !description.trim() || !contact.trim()) {
      return;
    }

    try {
      setCreating(true);
      setSuccess("");

      const res = await fetch(
        `${API_BASE}/tickets/create?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(
          description
        )}&customer_contact=${encodeURIComponent(contact)}`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      setTitle("");
      setDescription("");
      setContact("");

      setSuccess(
        `Ticket #${data.ticket_id} has been sent to our support team.`
      );

      onCreated();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl">
      <div className="mb-5">
        <h3 className="text-xl font-bold">Contact Support</h3>

        <p className="text-sm text-white/50">
          Describe your issue and our support team will receive it.
        </p>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Issue title"
        className="mb-3 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your issue..."
        className="h-28 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none"
      />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setContactType("email")}
          className={`rounded-2xl p-3 transition ${
            contactType === "email"
              ? "bg-cyan-300 text-slate-900"
              : "bg-black/25 text-white"
          }`}
        >
          <Mail size={18} className="mx-auto mb-2" />
          Email
        </button>

        <button
          type="button"
          onClick={() => setContactType("phone")}
          className={`rounded-2xl p-3 transition ${
            contactType === "phone"
              ? "bg-cyan-300 text-slate-900"
              : "bg-black/25 text-white"
          }`}
        >
          <Phone size={18} className="mx-auto mb-2" />
          Phone
        </button>
      </div>

      <input
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder={
          contactType === "email"
            ? "your@email.com"
            : "+1 404 ..."
        }
        className="mt-4 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none"
      />

      <button
        onClick={createTicket}
        disabled={creating}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 font-bold text-slate-900 transition hover:bg-cyan-200 disabled:opacity-60"
      >
        <Plus size={18} />
        {creating ? "Creating Ticket..." : "Submit Ticket"}
      </button>

      {success && (
        <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2
              size={20}
              className="text-emerald-300"
            />

            <div>
              <p className="font-semibold text-emerald-300">
                Ticket Submitted
              </p>

              <p className="mt-1 text-sm text-white/70">
                {success}
              </p>

              <p className="mt-3 text-xs text-white/45">
                Your request has been routed to our support inbox.
              </p>

              <p className="text-sm font-semibold text-cyan-300">
                ddwer5777@gmail.com
              </p>

              <p className="mt-2 text-xs text-white/45">
                We'll notify you at your {contactType} when our support team
                responds, and you'll also be able to view the response directly
                in the portal.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}