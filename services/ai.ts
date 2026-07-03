import { api } from "./api";

export async function getAIHelp(query: string) {
  const response = await api.get("/tickets/ai-help", {
    params: { query },
  });

  return response.data;
}