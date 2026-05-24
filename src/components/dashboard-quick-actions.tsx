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

interface DashboardQuickActionsProps {
  onAddClientClick?: () => void;
  onAddProjectClick?: () => void;
  onAddActivityClick?: () => void;
}

interface QuickAction {
  title: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
}

export function DashboardQuickActions({ onAddClientClick, onAddProjectClick, onAddActivityClick }: DashboardQuickActionsProps) {
  const router = useRouter();

  const quickActions: QuickAction[] = [
    {
      title: "Tambah Client",
      icon: Users,
      onClick: onAddClientClick,
    },
    {
      title: "Tambah Project",
      icon: FolderKanban,
      onClick: onAddProjectClick,
    },
    {
      title: "Tambah Activity",
      icon: Activity,
      onClick: onAddActivityClick,
    },
    {
      title: "Tambah Credential",
      icon: Key,
      href: "/credentials",
    },
  ];

  const handleClick = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick();
    } else if (action.href) {
      router.push(action.href);
    }
  };

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
              onClick={() => handleClick(action)}
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
