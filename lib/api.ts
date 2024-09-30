import useAuthStore from "@/store/authStore";
import { User } from "@/types/user";

const API_URL = "http://localhost:3003";

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = useAuthStore.getState().accessToken;
  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    // Token has expired, try to refresh it
    const refreshToken = useAuthStore.getState().refreshToken;
    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (refreshResponse.ok) {
      const { access_token } = await refreshResponse.json();
      useAuthStore.getState().setAccessToken(access_token);

      // Retry the original request with the new token
      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });
    }
  }

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

interface Barbershop {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  additionalInfo?: string;
}

export const api = {
  fetchWithAuth,

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: "BARBER" }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }
    return response.json();
  },

  signup: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: "BARBER" }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }
    return response.json();
  },

  getProfile: (): Promise<User> => fetchWithAuth<User>("/users/profile"),

  fetchBarbershops: (): Promise<Barbershop[]> =>
    fetchWithAuth<Barbershop[]>("/barbershops"),

  createBarbershop: (
    barbershopData: Omit<Barbershop, "id">
  ): Promise<Barbershop> =>
    fetchWithAuth<Barbershop>("/barbershops", {
      method: "POST",
      body: JSON.stringify(barbershopData),
    }),

  updateBarbershop: (
    id: string,
    barbershopData: Partial<Barbershop>
  ): Promise<Barbershop> =>
    fetchWithAuth<Barbershop>(`/barbershops/${id}`, {
      method: "PUT",
      body: JSON.stringify(barbershopData),
    }),

  deleteBarbershop: (id: string): Promise<void> =>
    fetchWithAuth(`/barbershops/${id}`, { method: "DELETE" }),

  searchBarbershops: (query: string): Promise<Barbershop[]> =>
    fetchWithAuth<Barbershop[]>(`/barbershops/search?query=${query}`),
};
