"use client";

import { AuthProvider } from "@/lib/providers";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
