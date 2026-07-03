"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  HeartPulse,
  Sparkles,
  TicketIcon,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { StatCard } from "@/components/StatCard";
import { Ticket, TicketList } from "@/components/TicketList";
import { AIInsightPanel } from "@/components/AIInsightPanel";
import { CategoryChart } from "@/components/CategoryChart";
import { TicketComposer } from "@/components/TicketComposer";
import { SearchPanel } from "@/components/SearchPanel";
import { ActivityFeed } from "@/components/ActivityFeed";
import { ExecutiveBrief } from "@/components/ExecutiveBrief";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

type Metrics = {
  total_tickets: number;
  open_tickets: number;
  resolved_tickets: number;
  top_category: string;
  ai_confidence: number;
  customer_health: number;
  revenue_at_risk: number;
  category_breakdown: { name: string; value: number }[];
};

type Brief = {
  summary: string;
  risk_score: number;
  risk_level: string;
  top_issue: string;
  recommendation: string;
  signals: string[];
};

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loadingTickets, setLoadingTickets] = useState(true);

  async function fetchTickets() {
    try {
      setLoadingTickets(true);
      const res = await fetch(`${API_BASE}/tickets/`);
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoadingTickets(false);
    }
  }

  async function fetchMetrics() {
    try {
      const res = await fetch(`${API_BASE}/dashboard/metrics`);
      const data = await res.json();
      setMetrics(data);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    }
  }

  async function fetchBrief() {
    try {
      const res = await fetch(`${API_BASE}/dashboard/executive-brief`);
      const data = await res.json();
      setBrief(data);
    } catch (error) {
      console.error("Failed to fetch executive brief:", error);
    }
  }

  async function refreshDashboard() {
    await Promise.all([fetchTickets(), fetchMetrics(), fetchBrief()]);
  }

  useEffect(() => {
    refreshDashboard();
  }, []);

  const chartData =
    metrics?.category_breakdown?.map((item) => ({
      category: item.name,
      count: item.value,
    })) ?? [];

  return (
    <DashboardShell>
      <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-400/15 via-white/[0.04] to-purple-500/15 p-6 shadow-2xl md:p-8">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-purple-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              <Sparkles size={16} />
              AI operations command center
            </div>

            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
              Dashboard
            </p>
            <h2 className="mt-2 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
              Customer intelligence command center
            </h2>
            <p className="mt-4 max-w-2xl text-white/65">
              Track support tickets, detect risk, discover patterns, and use AI
              to turn customer complaints into product decisions.
            </p>
          </div>

          <button
            onClick={refreshDashboard}
            className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
          >
            Refresh data
          </button>
        </div>

        <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <HeroMetric
            label="Revenue at Risk"
            value={`$${(metrics?.revenue_at_risk ?? 0).toLocaleString()}`}
            icon={DollarSign}
          />
          <HeroMetric
            label="Customer Health"
            value={`${metrics?.customer_health ?? 0}%`}
            icon={HeartPulse}
          />
          <HeroMetric
            label="Top Issue"
            value={metrics?.top_category ?? "none"}
            icon={AlertTriangle}
          />
          <HeroMetric
            label="AI Confidence"
            value={`${metrics?.ai_confidence ?? 0}%`}
            icon={Activity}
          />
        </div>
      </section>

      <section className="mb-6">
        <ExecutiveBrief brief={brief} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Tickets"
          value={metrics?.total_tickets ?? 0}
          detail="All customer issues"
          icon={TicketIcon}
        />
        <StatCard
          label="Open Tickets"
          value={metrics?.open_tickets ?? 0}
          detail="Need attention"
          icon={Clock}
        />
        <StatCard
          label="Resolved"
          value={metrics?.resolved_tickets ?? 0}
          detail="Completed cases"
          icon={CheckCircle2}
        />
        <StatCard
          label="AI Confidence"
          value={`${metrics?.ai_confidence ?? 0}%`}
          detail="Insight quality"
          icon={Activity}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <TicketList
          tickets={tickets}
          loading={loadingTickets}
          onResolved={refreshDashboard}
        />

        <div className="space-y-6">
          <AIInsightPanel
            total={metrics?.total_tickets ?? 0}
            open={metrics?.open_tickets ?? 0}
            topCategory={metrics?.top_category ?? "none yet"}
          />

          <TicketComposer onCreated={refreshDashboard} />

          <ActivityFeed tickets={tickets} />
        </div>
      </section>

      <section className="mt-6">
        <CategoryChart data={chartData} />
      </section>

      <section className="mt-6">
        <SearchPanel tickets={tickets} />
      </section>
    </DashboardShell>
  );
}

function HeroMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-black/35">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-white/50">{label}</p>
        <div className="rounded-2xl bg-cyan-300/10 p-3 text-cyan-200">
          <Icon size={18} />
        </div>
      </div>
      <p className="text-3xl font-black capitalize">{value}</p>
    </div>
  );
}