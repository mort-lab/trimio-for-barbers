//app/(auth)/google-callback.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";

export default function GoogleCallback() {
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);
  const setUser = useAuthStore((state) => state.setUser);
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      router.push("/login");
    } else if (token) {
      // Decode the JWT to get user information
      const payload = JSON.parse(atob(token.split(".")[1]));

      setAccessToken(token);

      setRefreshToken(payload.refreshToken);
      setUser({
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        createdAt: new Date(payload.iat * 1000).toISOString(),
      });

      toast({
        title: "Success",
        description: "You have successfully signed in with Google.",
        variant: "default",
      });
      router.push("/dashboard");
    } else {
      toast({
        title: "Error",
        description: "Authentication failed. Please try again.",
        variant: "destructive",
      });
      router.push("/login");
    }
  }, [router, setAccessToken, setRefreshToken, setUser, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Processing authentication...</p>
    </div>
  );
}
