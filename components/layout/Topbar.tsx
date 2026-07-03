"use client";

import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function Topbar() {
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="relative w-96">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />

        <Input
          placeholder="Search tickets..."
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-6">
        <Bell
          size={20}
          className="cursor-pointer text-muted-foreground hover:text-foreground transition"
        />

        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}