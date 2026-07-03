"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Bot,
  LayoutDashboard,
  Search,
  Settings,
  Ticket,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tickets", href: "/tickets", icon: Ticket },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
  { name: "Search", href: "/search", icon: Search },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-[#070A13] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-white/10 bg-white/[0.03] p-6 lg:block">
          <div className="mb-10">
            <div className="text-sm uppercase tracking-[0.3em] text-cyan-300">
              PulseDesk
            </div>
            <h1 className="mt-2 text-2xl font-bold">AI Support Ops</h1>
          </div>

          <nav className="space-y-3 text-sm text-white/70">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                    active
                      ? "bg-cyan-400/15 text-cyan-200"
                      : "hover:bg-white/10"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="flex-1">
          <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#070A13]/80 px-5 py-4 backdrop-blur-xl md:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/35">
                AI Customer Intelligence
              </p>
              <p className="mt-1 text-sm text-white/55">
                Production command center
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-white/70 transition hover:bg-white/10">
                <Bell size={18} />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-300 text-xs font-bold text-slate-950">
                  3
                </span>
              </button>

              <div className="hidden rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70 md:block">
                Adel / Admin
              </div>
            </div>
          </header>

          <div className="p-5 md:p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}