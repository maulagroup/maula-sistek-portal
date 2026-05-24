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

interface ReminderStats {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
  category: ReminderCategory;
}

export default function DashboardPage() {
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

  const reminders = useMemo(() => {
    const renewalOverdue: Project[] = [];
    const renewalH7: Project[] = [];
    const renewalH30: Project[] = [];
    const deadlineWeek: Project[] = [];
    const maintenance: Project[] = [];

    projects.forEach((project) => {
      if (project.status === "Maintenance") {
        maintenance.push(project);
      }

      if (project.tanggal_renewal) {
        const renewalDate = new Date(project.tanggal_renewal);
        const diffDays = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          renewalOverdue.push(project);
        } else if (diffDays <= 7) {
          renewalH7.push(project);
        } else if (diffDays <= 30) {
          renewalH30.push(project);
        }
      }

      if (project.deadline) {
        const deadlineDate = new Date(project.deadline);
        const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 7) {
          deadlineWeek.push(project);
        }
      }
    });

    return {
      "renewal-overdue": renewalOverdue,
      "renewal-h7": renewalH7,
      "renewal-h30": renewalH30,
      "deadline-week": deadlineWeek,
      maintenance,
    };
  }, [projects]);

  const reminderStats: ReminderStats[] = [
    {
      title: "Expired Project",
      count: reminders["renewal-overdue"].length,
      icon: AlertCircle,
      color: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20",
      category: "renewal-overdue",
    },
    {
      title: "Renewal H-7",
      count: reminders["renewal-h7"].length,
      icon: Clock,
      color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20",
      category: "renewal-h7",
    },
    {
      title: "Renewal H-30",
      count: reminders["renewal-h30"].length,
      icon: Calendar,
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20",
      category: "renewal-h30",
    },
    {
      title: "Deadline Minggu Ini",
      count: reminders["deadline-week"].length,
      icon: Clock,
      color: "bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20",
      category: "deadline-week",
    },
    {
      title: "Maintenance Aktif",
      count: reminders["maintenance"].length,
      icon: Wrench,
      color: "bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20",
      category: "maintenance",
    },
  ];

  const getProjectsForCategory = (category: ReminderCategory): Project[] => {
    return reminders[category] || [];
  };

  const getCategoryTitle = (category: ReminderCategory): string => {
    const stat = reminderStats.find((s) => s.category === category);
    return stat?.title || "";
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Leads": "bg-blue-500/10 text-blue-400",
      "DP & Planning": "bg-purple-500/10 text-purple-400",
      "UI/UX Design": "bg-pink-500/10 text-pink-400",
      "Development": "bg-yellow-500/10 text-yellow-400",
      "Internal Testing": "bg-orange-500/10 text-orange-400",
      "Client Review": "bg-cyan-500/10 text-cyan-400",
      "Revision": "bg-red-500/10 text-red-400",
      "Pelunasan & Deploy": "bg-green-500/10 text-green-400",
      "Maintenance": "bg-gray-500/10 text-gray-400",
      "Archived": "bg-zinc-500/10 text-zinc-500",
    };
    return colors[status] || "bg-gray-500/10 text-gray-400";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Informasi penting tentang proyek dan client.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-800 bg-slate-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "-" : projects.length}</div>
            <p className="text-xs text-muted-foreground">
              Seluruh client aktif
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "-" : projects.filter((p) => p.status !== "Archived").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Proyek sedang berjalan
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "-" : reminders["maintenance"].length}</div>
            <p className="text-xs text-muted-foreground">
              Proyek dalam maintenance
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-950/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {loading ? "-" : reminders["renewal-overdue"].length}
            </div>
            <p className="text-xs text-muted-foreground">
              Perlu penanganan segera
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Reminder</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {reminderStats.map((stat) => (
            <Card
              key={stat.category}
              className={`border cursor-pointer transition-all duration-200 ${stat.color}`}
              onClick={() => setSelectedCategory(stat.category)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-5 w-5" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loading ? "-" : stat.count}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{selectedCategory ? getCategoryTitle(selectedCategory) : ""}</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setSelectedCategory(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription>Daftar project yang membutuhkan perhatian</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {selectedCategory &&
              getProjectsForCategory(selectedCategory).map((project) => (
                <Card key={project.id} className="border-slate-800 bg-slate-950/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base">{project.nama_project}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {project.clients?.nama_client || "-"}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(selectedCategory === "renewal-overdue" ||
                            selectedCategory === "renewal-h7" ||
                            selectedCategory === "renewal-h30") && (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                              Renewal: {formatDate(project.tanggal_renewal)}
                            </Badge>
                          )}
                          {selectedCategory === "deadline-week" && (
                            <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                              Deadline: {formatDate(project.deadline)}
                            </Badge>
                          )}
                          <Badge variant="outline" className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            {selectedCategory && getProjectsForCategory(selectedCategory).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada project untuk kategori ini
              </div>
            )}
          </div>
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
