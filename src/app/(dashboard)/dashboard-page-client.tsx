"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  AlertCircle,
  Clock,
  Wrench,
  Users,
  FolderKanban,
  TrendingUp,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/lib/actions/projects";
import type { Project } from "@/types";
import { DashboardRecentActivity } from "@/components/dashboard-recent-activity";
import { DashboardQuickActions } from "@/components/dashboard-quick-actions";
import { AddClientModal } from "@/components/add-client-modal";
import { AddProjectModal } from "@/components/add-project-modal";
import { AddActivityModal } from "@/components/add-activity-modal";

type ReminderCategory =
  | "renewal-overdue"
  | "renewal-h7"
  | "renewal-h30"
  | "deadline-week"
  | "maintenance";

interface Reminder {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  projects: Project[];
}

export function DashboardPageClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ReminderCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reminders = useMemo<Reminder[]>(() => {
    const addDays = (date: Date, days: number) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const isDateInRange = (dateStr: string | null, start: Date, end: Date) => {
      if (!dateStr) return false;
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);
      return date >= start && date <= end;
    };

    const isDateBefore = (dateStr: string | null) => {
      if (!dateStr) return false;
      const date = new Date(dateStr);
      date.setHours(0, 0, 0, 0);
      return date < today;
    };

    return [
      {
        id: "renewal-overdue",
        title: "Renewal Overdue",
        icon: AlertCircle,
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        projects: projects.filter((p) => isDateBefore(p.tanggal_renewal)),
      },
      {
        id: "renewal-h7",
        title: "Renewal H-7",
        icon: Calendar,
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        projects: projects.filter((p) =>
          isDateInRange(p.tanggal_renewal, today, addDays(today, 7))
        ),
      },
      {
        id: "renewal-h30",
        title: "Renewal H-30",
        icon: Clock,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        projects: projects.filter((p) =>
          isDateInRange(p.tanggal_renewal, addDays(today, 8), addDays(today, 30))
        ),
      },
      {
        id: "deadline-week",
        title: "Deadline Minggu Ini",
        icon: TrendingUp,
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        projects: projects.filter((p) =>
          isDateInRange(p.deadline, today, addDays(today, 7))
        ),
      },
      {
        id: "maintenance",
        title: "Maintenance Aktif",
        icon: Wrench,
        color: "text-slate-400",
        bgColor: "bg-slate-500/10",
        projects: projects.filter((p) => p.status.includes("Maintenance")),
      },
    ];
  }, [projects, today]);

  const selectedReminder = selectedCategory
    ? reminders.find((r) => r.id === selectedCategory)
    : null;

  const stats = {
    totalClients: projects.length,
    activeProjects: projects.filter((p) => !p.status.includes("Selesai")).length,
    maintenance: projects.filter((p) => p.status.includes("Maintenance")).length,
    urgentAlerts: reminders[0].projects.length + reminders[1].projects.length,
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-400">Selamat datang di Maula Portal</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-800 bg-slate-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalClients}</div>
            <p className="text-xs text-slate-400">Total clients terdaftar</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.activeProjects}</div>
            <p className="text-xs text-slate-400">Project aktif saat ini</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.maintenance}</div>
            <p className="text-xs text-slate-400">Project dalam maintenance</p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{loading ? "..." : stats.urgentAlerts}</div>
            <p className="text-xs text-slate-400">Membutuhkan perhatian segera</p>
          </CardContent>
        </Card>
      </div>

      {/* Reminders Section */}
      <Card className="border-slate-800 bg-slate-950/50">
        <CardHeader>
          <CardTitle>Reminder & Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 rounded-lg bg-slate-800/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {reminders.map((reminder) => (
                <button
                  key={reminder.id}
                  onClick={() => setSelectedCategory(reminder.id as ReminderCategory)}
                  className="group relative overflow-hidden rounded-lg border p-4 text-left transition-all hover:bg-slate-800/50"
                  style={{
                    borderColor: reminder.color.replace("text-", "rgba(255,255,255,0.1)"),
                  }}
                >
                  <div className="flex items-center justify-between">
                    <reminder.icon className={`h-5 w-5 ${reminder.color}`} />
                    <Badge variant="secondary" className={reminder.bgColor}>
                      {reminder.projects.length}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <p className={`font-medium ${reminder.color}`}>{reminder.title}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reminder Detail Dialog */}
      <Dialog open={!!selectedReminder} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedReminder && (
                <>
                  <selectedReminder.icon className={`h-5 w-5 ${selectedReminder.color}`} />
                  {selectedReminder.title}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Daftar project yang membutuhkan perhatian
            </DialogDescription>
          </DialogHeader>
          {selectedReminder && (
            <div className="max-h-[400px] overflow-y-auto">
              {selectedReminder.projects.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  Tidak ada project untuk kategori ini
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedReminder.projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between rounded-lg border border-slate-800 p-4"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{project.nama_project}</p>
                        <p className="text-sm text-slate-400">
                          {project.clients?.nama_client}
                        </p>
                        {(project.tanggal_renewal || project.deadline) && (
                          <p className="text-xs text-slate-500">
                            {selectedReminder.id.includes("renewal")
                              ? `Renewal: ${new Date(project.tanggal_renewal!).toLocaleDateString("id-ID")}`
                              : `Deadline: ${new Date(project.deadline!).toLocaleDateString("id-ID")}`}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary">{project.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardQuickActions 
          onAddClientClick={() => setIsAddClientModalOpen(true)}
          onAddProjectClick={() => setIsAddProjectModalOpen(true)}
          onAddActivityClick={() => setIsAddActivityModalOpen(true)}
        />
        <DashboardRecentActivity />
      </div>

      <AddClientModal 
        open={isAddClientModalOpen}
        onOpenChange={setIsAddClientModalOpen}
        onSuccess={() => {
          loadProjects();
        }}
      />
      <AddProjectModal 
        open={isAddProjectModalOpen}
        onOpenChange={setIsAddProjectModalOpen}
        onSuccess={() => {
          loadProjects();
        }}
      />
      <AddActivityModal 
        open={isAddActivityModalOpen}
        onOpenChange={setIsAddActivityModalOpen}
        onSuccess={() => {
          loadProjects();
        }}
      />
    </div>
  );
}
