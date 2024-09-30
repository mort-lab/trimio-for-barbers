// lib/auth.ts
import useAuthStore from "@/store/authStore";

export function useAuth() {
  const {
    user,
    login,
    signup,
    logout,
    refreshAccessToken,
    accessToken,
    refreshToken,
  } = useAuthStore();

  return {
    user,
    login,
    signup,
    logout,
    refreshAccessToken,
    accessToken,
    refreshToken,
  };
}
