import { getTickets } from "./tickets";

export async function getTicketStats() {
  const tickets = await getTickets();

  return {
    total: tickets.length,
    open: tickets.filter((t) => !t.status || t.status === "Open").length,
    resolved: tickets.filter((t) => t.status === "Resolved").length,
    escalated: tickets.filter((t) => t.priority === "High").length,
  };
}