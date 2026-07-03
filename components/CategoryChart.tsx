"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function CategoryChart({
  data,
}: {
  data: { category: string; count: number }[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-5">
        <h3 className="text-xl font-bold">Category breakdown</h3>
        <p className="text-sm text-white/50">Which problems show up most</p>
      </div>

      <div className="h-72">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl bg-white/5 text-white/50">
            No chart data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="category" stroke="rgba(255,255,255,0.45)" />
              <YAxis stroke="rgba(255,255,255,0.45)" />
              <Tooltip
                contentStyle={{
                  background: "#0b1020",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "14px",
                  color: "white",
                }}
              />
              <Bar dataKey="count" fill="#67e8f9" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}