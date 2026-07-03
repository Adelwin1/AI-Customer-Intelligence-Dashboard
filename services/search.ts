import { api } from "./api";

export type SearchResult = {
  id: number;
  title: string;
  description: string;
  category: string;
  resolution: string;
  score: number;
};

export async function semanticSearch(query: string): Promise<SearchResult[]> {
  const response = await api.get("/tickets/search-ai", {
    params: { query },
  });

  return response.data;
}