import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { insertUserSchema, selectUserSchema } from "@server/db/schema";
import { z } from "zod";
import { toast } from "sonner";

type User = z.infer<typeof selectUserSchema>;
type LoginData = z.infer<typeof insertUserSchema>;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null>({
    queryKey: ["/api/admin/me"],
    queryFn: async () => {
      const res = await fetch("/api/admin/me");
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Could not fetch user profile");
      return res.json();
    },
  });

  const loginMutation = useMutation<User, Error, LoginData>({
    mutationFn: async (credentials) => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Invalid credentials");
      }
      return res.json();
    },
    onSuccess: (user) => {
      toast.success(`Welcome back, ${user.username}!`);
      // Re-trigger query
      window.location.reload(); 
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
      window.location.href = "/admin/login";
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
