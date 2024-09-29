"use client";
//app/dashboard/page.tsx
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to Trimio for Barbers</h1>
      <p>Hello, {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Account created: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
