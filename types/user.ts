// types/user.ts

export interface User {
  id: string;
  email: string;
  role: "BARBER" | "ADMIN" | "CLIENT"; // Add other roles if needed
  createdAt: string;
  // Add other user properties as needed
}
