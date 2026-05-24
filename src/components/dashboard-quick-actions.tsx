"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FolderKanban,
  Activity,
  Key,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface QuickAction {
  title: string;
  icon: React.ElementType;
  href: string;
}

const quickActions: QuickAction[] = [
  {
    title: "Tambah Client",
    icon: Users,
    href: "/clients",
  },
  {
    title: "Tambah Project",
    icon: FolderKanban,
    href: "/projects",
  },
  {
    title: "Tambah Activity",
    icon: Activity,
    href: "/activity-logs",
  },
  {
    title: "Tambah Credential",
    icon: Key,
    href: "/credentials",
  },
];

export function DashboardQuickActions() {
  const router = useRouter();

  return (
    <Card className="border-slate-800 bg-slate-950/50">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center gap-2 border-slate-700 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200"
              onClick={() => router.push(action.href)}
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <action.icon className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{action.title}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
