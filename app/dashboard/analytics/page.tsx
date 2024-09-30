"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore"; // Zustand store for auth
import { api } from "@/lib/api"; // API calls handler
import { User } from "@/types/user"; // Import User type if it's defined in a separate file

export default function Analytics() {
  const { user, accessToken } = useAuthStore(); // Access Zustand store data
  const [profileData, setProfileData] = useState<User | null>(null); // Specify type for profileData
  const [error, setError] = useState<string | null>(null); // Error should be of type string | null

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data: User = await api.getProfile(); // Fetch the user profile and type it as User
        setProfileData(data);
      } catch (err) {
        // Handle the error by checking if it has a message property
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch profile");
        } else {
          setError("Unknown error occurred");
        }
      }
    };

    // Fetch profile only if accessToken is available
    if (accessToken) {
      fetchProfile();
    }
  }, [accessToken]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <p>View your business analytics here.</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">User Info:</h2>
        {user ? (
          <pre>{JSON.stringify(user, null, 2)}</pre>
        ) : (
          <p>No user logged in.</p>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Access Token:</h2>
        {accessToken ? <pre>{accessToken}</pre> : <p>No token available.</p>}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Profile Data:</h2>
        {profileData ? (
          <pre>{JSON.stringify(profileData, null, 2)}</pre>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p>No profile data fetched yet.</p>
        )}
      </div>
    </div>
  );
}
