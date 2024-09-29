// lib/api.ts
import { User } from "@/types/user";

const API_URL = "http://localhost:3003";

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("access_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "API request failed");
  }

  return response.json();
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export const api = {
  login: (email: string, password: string): Promise<AuthResponse> =>
    fetchWithAuth<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, role: "BARBER" }),
    }),

  signup: (email: string, password: string): Promise<AuthResponse> =>
    fetchWithAuth<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, role: "BARBER" }),
    }),

  getProfile: (): Promise<User> => fetchWithAuth<User>("/users/profile"),

  // Add more API methods as needed
};
