import useAuthStore from "@/store/authStore";

const API_URL = "http://localhost:3003";

export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) {
    throw new Error("No access token available");
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    // Token expired, refresh token and retry
    try {
      await useAuthStore.getState().refreshAccessToken();
      const newAccessToken = useAuthStore.getState().accessToken;

      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    } catch (error) {
      console.error("Error refreshing token:", error);
      useAuthStore.getState().logout();
      throw new Error("Session expired. Please login again.");
    }
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "API request failed");
  }

  return response.json();
}

export { API_URL };
