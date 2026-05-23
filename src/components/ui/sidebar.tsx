"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const SidebarContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  isMobile: boolean
}>({
  open: true,
  setOpen: () => {},
  isMobile: false,
})

export function useSidebar() {
  return React.useContext(SidebarContext)
}

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(true)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <SidebarContext.Provider value={{ open, setOpen, isMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { open, setOpen, isMobile } = useSidebar()

  const sidebarContent = (
    <div
      className={cn(
        "min-h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col flex-shrink-0",
        isMobile ? "fixed inset-y-0 left-0 z-50 w-64" : (open ? "w-64" : "w-16")
      )}
    >
      {children}
    </div>
  )

  if (isMobile) {
    return (
      <>
        {open && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setOpen(false)}
          />
        )}
        {sidebarContent}
      </>
    )
  }

  return sidebarContent
}

export function SidebarTrigger() {
  const { setOpen, isMobile, open } = useSidebar()
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setOpen((prev) => !prev)}
    >
      {isMobile && open ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 overflow-auto p-2">{children}</div>
}

export function SidebarHeader({ children }: { children: React.ReactNode }) {
  const { isMobile, setOpen } = useSidebar()
  return (
    <div className="p-4 border-b border-sidebar-border">
      <div className="flex items-center justify-between">
        {children}
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export function SidebarFooter({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border-t border-sidebar-border">{children}</div>
}

export function SidebarSeparator() {
  return <div className="h-px bg-sidebar-border my-2" />
}

export function SidebarGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>
}

export function SidebarGroupLabel({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar()
  return (
    <div className={cn(
      "px-3 py-2 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider",
      !open && "hidden"
    )}>
      {children}
    </div>
  )
}

export function SidebarGroupContent({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>
}

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-1">{children}</ul>
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>
}

const sidebarMenuButtonVariants = cva(
  "flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  {
    variants: {
      isActive: {
        true: "bg-sidebar-accent text-sidebar-accent-foreground",
        false: "",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
)

export function SidebarMenuButton({
  children,
  isActive,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & {
  isActive?: boolean
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "button"
  const { open } = useSidebar()
  return (
    <Comp
      className={cn(sidebarMenuButtonVariants({ isActive }), !open && "justify-center")}
      {...props}
    >
      {children}
    </Comp>
  )
}

export function SidebarInset({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`flex flex-col min-h-screen ${className || ''}`}>
      {children}
    </div>
  )
}
