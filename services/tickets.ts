import { api } from "./api";

export type Ticket = {
  id: number;
  title: string;
  description: string;
  status?: string;
  category?: string;
  priority?: string;
  created_at?: string;
};

export async function getTickets(): Promise<Ticket[]> {
  const response = await api.get("/tickets/");
  return response.data;
}