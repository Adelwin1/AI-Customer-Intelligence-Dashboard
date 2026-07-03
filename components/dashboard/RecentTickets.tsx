"use client";

import { useEffect, useState } from "react";
import { getTickets, Ticket } from "@/services/tickets";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RecentTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await getTickets();
        setTickets(data.slice(0, 5));
      } finally {
        setLoading(false);
      }
    }

    loadTickets();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-lg border p-6 text-sm text-muted-foreground">
            No tickets found yet. Create a ticket to see it here.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Title</th>
                  <th className="px-4 py-3 text-left font-medium">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-t transition hover:bg-muted/40"
                  >
                    <td className="px-4 py-4">{ticket.id}</td>
                    <td className="px-4 py-4 font-medium">{ticket.title}</td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {ticket.description}
                    </td>
                    <td className="px-4 py-4">
                      <Badge>{ticket.status || "Open"}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}