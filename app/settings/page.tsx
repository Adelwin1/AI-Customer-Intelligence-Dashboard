"use client";

import { useState } from "react";
import {
  Bell,
  Bot,
  CheckCircle2,
  Database,
  Shield,
  User,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    aiResolutions: true,
    semanticSearch: true,
    executiveSummaries: true,
    highPriorityAlerts: true,
    resolvedUpdates: true,
    weeklyDigest: false,
  });

  function toggle(key: keyof typeof settings) {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  return (
    <DashboardShell>
      <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/15 via-white/[0.04] to-purple-500/15 p-6 shadow-2xl md:p-8">
        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Settings
          </p>
          <h2 className="mt-2 max-w-4xl text-4xl font-black md:text-6xl">
            Workspace control center
          </h2>
          <p className="mt-4 max-w-2xl text-white/65">
            Configure AI behavior, notification rules, and workspace preferences.
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <SettingsCard icon={User} title="Profile" description="Admin identity">
            <div className="rounded-3xl bg-black/25 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-300 text-2xl font-black text-slate-950">
                  A
                </div>
                <div>
                  <h3 className="text-lg font-bold">Adel</h3>
                  <p className="text-sm text-white/50">Workspace Admin</p>
                </div>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard icon={Database} title="System status" description="Platform health">
            <StatusRow label="FastAPI backend" status="Online" />
            <StatusRow label="SQLite database" status="Connected" />
            <StatusRow label="Semantic search" status="Ready" />
            <StatusRow label="AI Copilot" status="Ready" />
          </SettingsCard>
        </div>

        <div className="space-y-6">
          <SettingsCard icon={Bot} title="AI configuration" description="Tune AI behavior">
            <ToggleRow
              title="AI suggested resolutions"
              description="Generate recommended resolutions when tickets are created."
              enabled={settings.aiResolutions}
              onClick={() => toggle("aiResolutions")}
            />
            <ToggleRow
              title="Semantic search"
              description="Find tickets by meaning, not only exact words."
              enabled={settings.semanticSearch}
              onClick={() => toggle("semanticSearch")}
            />
            <ToggleRow
              title="Executive summaries"
              description="Generate management-style summaries from ticket patterns."
              enabled={settings.executiveSummaries}
              onClick={() => toggle("executiveSummaries")}
            />
          </SettingsCard>

          <SettingsCard icon={Bell} title="Notifications" description="Workspace alerts">
            <ToggleRow
              title="High priority alerts"
              description="Alert when high priority tickets are created."
              enabled={settings.highPriorityAlerts}
              onClick={() => toggle("highPriorityAlerts")}
            />
            <ToggleRow
              title="Resolved ticket updates"
              description="Notify admins when tickets are resolved."
              enabled={settings.resolvedUpdates}
              onClick={() => toggle("resolvedUpdates")}
            />
            <ToggleRow
              title="Weekly support digest"
              description="Send weekly ticket trend summaries."
              enabled={settings.weeklyDigest}
              onClick={() => toggle("weeklyDigest")}
            />
          </SettingsCard>

          <SettingsCard icon={Shield} title="Security" description="Access settings">
            <div className="grid gap-3 md:grid-cols-2">
              <InfoBox label="Current role" value="Admin" />
              <InfoBox label="Auth mode" value="Local dev" />
              <InfoBox label="API access" value="Allowed" />
              <InfoBox label="Environment" value="Development" />
            </div>
          </SettingsCard>
        </div>
      </section>
    </DashboardShell>
  );
}

function SettingsCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
          <Icon size={22} />
        </div>
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm text-white/50">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
  onClick,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 border-b border-white/10 py-4 text-left last:border-b-0"
    >
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-white/45">{description}</p>
      </div>

      <div className={`flex h-7 w-12 items-center rounded-full p-1 ${enabled ? "bg-cyan-300" : "bg-white/15"}`}>
        <div className={`h-5 w-5 rounded-full bg-white transition ${enabled ? "translate-x-5" : "translate-x-0"}`} />
      </div>
    </button>
  );
}

function StatusRow({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 py-4 last:border-b-0">
      <div className="flex items-center gap-3">
        <CheckCircle2 size={18} className="text-emerald-300" />
        <span className="text-white/70">{label}</span>
      </div>
      <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
        {status}
      </span>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/25 p-4">
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-2 font-bold">{value}</p>
    </div>
  );
}