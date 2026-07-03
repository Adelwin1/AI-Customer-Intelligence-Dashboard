"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RefreshCw } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";

const API_BASE = "http://127.0.0.1:8000";

type Metrics = {
  total_tickets: number;
  open_tickets: number;
  resolved_tickets: number;
  top_category: string;
  ai_confidence: number;
  customer_health: number;
  revenue_at_risk: number;
  category_breakdown: { name: string; value: number }[];
  priority_breakdown: { name: string; value: number }[];
  status_breakdown: { name: string; value: number }[];
  ticket_trends: { day: string; tickets: number }[];
};

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchMetrics() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/dashboard/metrics`);
      const data = await res.json();
      setMetrics(data);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <DashboardShell>
      <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Analytics
          </p>
          <h2 className="mt-2 text-3xl font-bold md:text-5xl">
            Support operations intelligence
          </h2>
          <p className="mt-3 max-w-2xl text-white/60">
            Track ticket volume, customer health, risk, priorities, and support
            performance from one command center.
          </p>
        </div>

        <button
          onClick={fetchMetrics}
          className="flex items-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </header>

      {loading || !metrics ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-36 animate-pulse rounded-3xl bg-white/5" />
          ))}
        </div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Revenue at Risk"
              value={`$${metrics.revenue_at_risk.toLocaleString()}`}
              detail="Estimated support impact"
            />
            <MetricCard
              label="Customer Health"
              value={`${metrics.customer_health}%`}
              detail="Lower means more risk"
            />
            <MetricCard
              label="AI Confidence"
              value={`${metrics.ai_confidence}%`}
              detail="Insight reliability"
            />
            <MetricCard
              label="Top Category"
              value={metrics.top_category}
              detail="Most common issue"
            />
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <ChartCard title="Ticket volume trend" subtitle="Weekly support demand">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={metrics.ticket_trends}>
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.45)" />
                  <YAxis stroke="rgba(255,255,255,0.45)" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="tickets"
                    stroke="#67e8f9"
                    fill="#67e8f9"
                    fillOpacity={0.18}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Status mix" subtitle="Open vs resolved">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={metrics.status_breakdown}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {metrics.status_breakdown.map((_, index) => (
                      <Cell key={index} fill={index === 0 ? "#fb923c" : "#34d399"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-2">
            <ChartCard title="Category breakdown" subtitle="Most reported problem areas">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.category_breakdown}>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.45)" />
                  <YAxis stroke="rgba(255,255,255,0.45)" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" fill="#67e8f9" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Priority distribution" subtitle="Operational urgency">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.priority_breakdown}>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.45)" />
                  <YAxis stroke="rgba(255,255,255,0.45)" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" fill="#a78bfa" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </section>
        </>
      )}
    </DashboardShell>
  );
}

const tooltipStyle = {
  background: "#0b1020",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "14px",
  color: "white",
};

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl">
      <p className="text-sm text-white/50">{label}</p>
      <div className="mt-4 text-3xl font-black capitalize">{value}</div>
      <p className="mt-2 text-sm text-cyan-200/70">{detail}</p>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-5">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-white/50">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}