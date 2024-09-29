"use client";
// lib/auth.ts
import { useState, useEffect } from "react";
import { api } from "./api";
import { User } from "@/types/user";

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      api
        .getProfile()
        .then((userData: User) => setUser(userData))
        .catch(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response: AuthResponse = await api.login(email, password);
    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("refresh_token", response.refresh_token);
    setUser(response.user);
  };

  const signup = async (email: string, password: string): Promise<void> => {
    const response: AuthResponse = await api.signup(email, password);
    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("refresh_token", response.refresh_token);
    setUser(response.user);
  };

  const logout = (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return { user, login, signup, logout, loading };
}
