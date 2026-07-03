import { api } from "./api";

export async function checkBackendHealth() {
  const response = await api.get("/");
  return response.data;
}