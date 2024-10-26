import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Barbershop {
  barbershopId: string;
  barbershopName: string;
  barbershopAddress: string;
  barbershopCity: string;
  barbershopState: string;
  barbershopZipCode: string;
  barbershopLatitude: number;
  barbershopLongitude: number;
  barbershopImages: string[];
  countryCode: string;
  phoneNumber: string;
  additionalInfo?: string;
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
  signup: (
    email: string,
    password: string,
    username: string,
    phone: string
  ) => Promise<string>;
  googleSignup: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  logout: () => void;
  setActiveBarbershop: (barbershop: Barbershop) => void;
  createOrUpdateBarbershop: (
    barbershopData: FormData,
    barbershopId?: string
  ) => Promise<Barbershop>;
  fetchBarbershopDetails: (barbershopId: string) => Promise<Barbershop>;
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
          body: JSON.stringify({ email, password }),
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

      signup: async (
        email: string,
        password: string,
        username: string,
        phone: string
      ) => {
        const response = await fetch("http://localhost:3003/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            username,
            phone,
            role: "CLIENT",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Registration failed");
        }

        const data = await response.json();

        set({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          user: {
            id: data.userId,
            email: email,
            role: "CLIENT",
            createdAt: new Date().toISOString(),
          },
        });

        return data.message;
      },

      googleSignup: async () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await fetch(
          "http://localhost:3003/auth/refresh-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          }
        );

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

      createOrUpdateBarbershop: async (
        barbershopData: FormData,
        barbershopId?: string
      ): Promise<Barbershop> => {
        const { accessToken } = get();
        if (!accessToken) throw new Error("No access token available");

        const url = barbershopId
          ? `http://localhost:3003/barbershops/${barbershopId}`
          : "http://localhost:3003/barbershops";

        const method = barbershopId ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: barbershopData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to create/update barbershop"
          );
        }

        const barbershop: Barbershop = await response.json();
        set({ activeBarbershop: barbershop });
        return barbershop;
      },

      fetchBarbershopDetails: async (
        barbershopId: string
      ): Promise<Barbershop> => {
        const { accessToken } = get();
        if (!accessToken) throw new Error("No access token available");

        const response = await fetch(
          `http://localhost:3003/barbershops/${barbershopId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch barbershop details"
          );
        }

        const barbershop: Barbershop = await response.json();
        return barbershop;
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
