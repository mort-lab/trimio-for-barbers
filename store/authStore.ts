import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Barbershop {
  id: string;
  name: string;
  address: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  activeBarbershop: Barbershop | null;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  logout: () => void;
  setActiveBarbershop: (barbershop: Barbershop) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      activeBarbershop: null,

      setAccessToken: (token: string) => set({ accessToken: token }),
      setRefreshToken: (token: string) => set({ refreshToken: token }),
      setUser: (user: User) => set({ user }),

      login: async (email: string, password: string) => {
        const response = await fetch("http://localhost:3003/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, role: "BARBER" }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Login failed");
        }

        const data = await response.json();
        set({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          user: data.user,
        });
      },

      signup: async (email: string, password: string) => {
        const response = await fetch("http://localhost:3003/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, role: "BARBER" }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Registration failed");
        }

        const data = await response.json();
        set({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          user: data.user,
        });
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await fetch("http://localhost:3003/auth/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to refresh token");
        }

        const data = await response.json();
        set({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        });
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          activeBarbershop: null,
        });
      },

      setActiveBarbershop: (barbershop: Barbershop) => {
        set({ activeBarbershop: barbershop });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
