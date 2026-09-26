import type { NewsDetailResponse, NewsListResponse, NewsPayload } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "reportase_admin_token";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(path: string, init: RequestInit = {}, authenticated = false): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (authenticated) {
    const token = tokenStore.get();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Permintaan gagal diproses");
  return body as T;
}

export const api = {
  listNews: (params = "") => request<NewsListResponse>(`/news${params ? `?${params}` : ""}`),
  getNews: (slug: string) => request<NewsDetailResponse>(`/news/${slug}`),
  login: (email: string, password: string) => request<{ token: string; user: { id: number; name: string; email: string } }>("/admin/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => request<{ user: { id: number; name: string; email: string } }>("/admin/me", {}, true),
  adminNews: (params = "") => request<NewsListResponse>(`/admin/news${params ? `?${params}` : ""}`, {}, true),
  adminNewsById: (id: string) => request<{ data: NewsDetailResponse["data"] }>(`/admin/news/${id}`, {}, true),
  createNews: (payload: NewsPayload) => request("/admin/news", { method: "POST", body: JSON.stringify(payload) }, true),
  updateNews: (id: string, payload: NewsPayload) => request(`/admin/news/${id}`, { method: "PUT", body: JSON.stringify(payload) }, true),
  deleteNews: (id: number) => request(`/admin/news/${id}`, { method: "DELETE" }, true),
  uploadImage: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return request<{ url: string }>("/admin/uploads", { method: "POST", body: form }, true);
  },
};

export function imageUrl(path: string): string {
  if (!path) return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85";
  if (/^https?:\/\//.test(path)) return path;
  const base = API_URL.replace(/\/api\/?$/, "");
  return `${base}${path}`;
}
