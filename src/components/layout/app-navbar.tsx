"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, Search, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClientComponentClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/providers"
import { Skeleton } from "@/components/ui/skeleton"

export function AppNavbar() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { user, isLoading: authLoading } = useAuth()

  console.log("NAVBAR USER:", user)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <header className="flex h-16 items-center gap-4 border-b px-6">
      <SidebarTrigger />
      <div className="flex-1 flex items-center gap-4 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 bg-muted/50 border-0"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
            <User className="h-4 w-4 text-muted-foreground" />
            {authLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <span className="text-sm font-medium">
                {user?.nama || "User"}
              </span>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
