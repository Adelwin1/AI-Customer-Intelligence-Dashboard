"use client";

import { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl transition hover:-translate-y-1 hover:bg-white/[0.07]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/50">{label}</p>
        <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-4 text-4xl font-black">{value}</div>
      <p className="mt-2 text-sm text-cyan-200/70">{detail}</p>
    </div>
  );
}