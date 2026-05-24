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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      console.log("Auth Session:", session);
      console.log("Session Error:", sessionError);

      if (!session) {
        console.log("No session found");
        setUser(null);
        setRole(null);
        setIsLoading(false);
        return;
      }

      console.log("Fetching user profile for ID:", session.user.id);

      const { data: userData, error } = await supabase
        .from("users")
        .select("id, nama, email, role, created_at")
        .eq("id", session.user.id)
        .single();

      console.log("PROFILE USER:", userData);
      console.log("Fetch Error:", error);

      if (error) {
        console.error("Failed to fetch user profile:", error);
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
