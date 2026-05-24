"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  PenLine,
  Edit2,
  Trash2,
  Key,
  Calendar,
  Clock,
  MessageSquare,
  Building2,
  Wrench,
} from "lucide-react";
import { getAllActivityLogs } from "@/lib/actions/activity-logs";
import type { ActivityLog } from "@/types";
import { getRelativeTime } from "@/lib/utils/date";

interface RecentActivityProps {
  limit?: number;
}

type ActivityType = "create" | "update" | "credential" | "delete" | "maintenance" | "default";

function getActivityType(pesan: string): ActivityType {
  const lower = pesan.toLowerCase();
  
  if (lower.includes("create") || lower.includes("tambah") || lower.includes("add") || lower.includes("menambahkan") || lower.includes("dibuatkan") || lower.includes("new")) {
    return "create";
  }
  if (lower.includes("update") || lower.includes("ubah") || lower.includes("edit") || lower.includes("revisi")) {
    return "update";
  }
  if (lower.includes("delete") || lower.includes("hapus") || lower.includes("menghapus") || lower.includes("error") || lower.includes("overdue") || lower.includes("gagal")) {
    return "delete";
  }
  if (lower.includes("credential") || lower.includes("security") || lower.includes("password") || lower.includes("login") || lower.includes("akun") || lower.includes("api")) {
    return "credential";
  }
  if (lower.includes("maintenance") || lower.includes("perbaikan") || lower.includes("server")) {
    return "maintenance";
  }
  
  return "default";
}

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "create":
      return <PenLine className="h-4 w-4" />;
    case "update":
      return <Edit2 className="h-4 w-4" />;
    case "delete":
      return <Trash2 className="h-4 w-4" />;
    case "credential":
      return <Key className="h-4 w-4" />;
    case "maintenance":
      return <Wrench className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
}

function getActivityColors(type: ActivityType) {
  switch (type) {
    case "create":
      return {
        border: "border-l-green-500",
        icon: "text-green-400",
        iconBg: "bg-green-500/10",
      };
    case "update":
      return {
        border: "border-l-yellow-500",
        icon: "text-yellow-400",
        iconBg: "bg-yellow-500/10",
      };
    case "delete":
      return {
        border: "border-l-red-500",
        icon: "text-red-400",
        iconBg: "bg-red-500/10",
      };
    case "credential":
      return {
        border: "border-l-blue-500",
        icon: "text-blue-400",
        iconBg: "bg-blue-500/10",
      };
    case "maintenance":
      return {
        border: "border-l-purple-500",
        icon: "text-purple-400",
        iconBg: "bg-purple-500/10",
      };
    default:
      return {
        border: "border-l-slate-500",
        icon: "text-slate-400",
        iconBg: "bg-slate-500/10",
      };
  }
}

export function DashboardRecentActivity({ limit = 10 }: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllActivityLogs();
      const limitedData = Array.isArray(data) ? data.slice(0, limit) : [];
      setActivities(limitedData);
    } catch (err) {
      console.error("RECENT ACTIVITY ERROR:", err);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if (isLoading) {
    return (
      <Card className="border-slate-800 bg-slate-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card className="border-slate-800 bg-slate-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted rounded-full p-6 mb-4">
            <MessageSquare className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Belum ada aktivitas</h3>
          <p className="text-muted-foreground max-w-sm">
            Riwayat aktivitas akan ditampilkan di sini
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-800 bg-slate-950/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">

          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 px-1">
        {activities.map((log, index) => {
          const type = getActivityType(log.pesan);
          const colors = getActivityColors(type);
          
          return (
            <div
              key={log.id}
              className="relative"
            >
              {index < activities.length - 1 && (
                <div className="absolute left-7 top-9 bottom-0 w-px bg-slate-800 hidden md:block" />
              )}
              
              <div
                className={`
                  pl-3 pr-3 py-3 rounded-xl border-l-2
                  ${colors.border}
                  bg-slate-900/40
                  border border-slate-800
                  hover:bg-slate-900/70
                  transition-all duration-200
                `}
              >
                <div className="flex gap-3 items-start">
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                    ${colors.icon}
                    ${colors.iconBg}
                  `}>
                    {getActivityIcon(type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-sm font-semibold text-white truncate">
                          {log.projects?.nama_project || "Aktivitas"}
                        </span>
                        {log.dibuat_oleh && (
                          <Badge 
                            variant="outline" 
                            className="h-4 px-1.5 text-[9px] font-medium border-slate-700/50 bg-green-500/10 text-green-400 flex-shrink-0"
                          >
                            {log.dibuat_oleh}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                        <Clock className="h-3 w-3" />
                        {getRelativeTime(log.created_at)}
                      </span>
                    </div>
                    
                    {log.projects?.clients && (
                      <div className="flex items-center gap-1 mb-1.5">
                        <Building2 className="h-3 w-3 text-slate-400 flex-shrink-0" />
                        <span className="text-xs text-slate-400 truncate">
                          {log.projects.clients.nama_client}
                        </span>
                      </div>
                    )}
                    
                    <p className="text-sm text-slate-300 leading-tight line-clamp-2">
                      {log.pesan}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
