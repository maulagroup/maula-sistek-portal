"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClientComponentClient } from "@/lib/supabase/client";
import type { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setUser(null);
        setRole(null);
        setIsLoading(false);
        return;
      }

      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
        setRole(null);
      } else {
        setUser(userData);
        setRole(userData.role);
      }
    } catch (err) {
      console.error("Error in fetchUser:", err);
      setUser(null);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUser, supabase]);

  const value: AuthContextType = {
    user,
    role,
    isLoading,
    isSuperAdmin: role === "superadmin",
    isAdmin: role === "admin" || role === "superadmin",
    refreshUser: fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
