"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Edit2, Calendar, DollarSign, Globe, Server, User, FileText, Loader2 } from "lucide-react";
import { updateProject } from "@/lib/actions/projects";
import { getClients } from "@/lib/actions/clients";
import type { Project, CreateProjectInput, Client } from "@/types";
import { PROJECT_STATUS, type ProjectStatus } from "@/lib/constants";
import { toast } from "sonner";
import { ProjectActivityTimeline } from "@/components/project-activity-timeline";
import { ProjectCredentials } from "@/components/project-credentials";

const STATUS_COLORS: Record<string, string> = {
  "Leads": "bg-blue-900/30 text-blue-400 border-blue-800",
  "DP & Planning": "bg-purple-900/30 text-purple-400 border-purple-800",
  "UI/UX Design": "bg-pink-900/30 text-pink-400 border-pink-800",
  "Development": "bg-yellow-900/30 text-yellow-400 border-yellow-800",
  "Internal Testing": "bg-orange-900/30 text-orange-400 border-orange-800",
  "Client Review": "bg-cyan-900/30 text-cyan-400 border-cyan-800",
  "Revision": "bg-red-900/30 text-red-400 border-red-800",
  "Pelunasan & Deploy": "bg-green-900/30 text-green-400 border-green-800",
  "Maintenance": "bg-gray-900/30 text-gray-400 border-gray-800",
  "Archived": "bg-zinc-900/30 text-zinc-500 border-zinc-800",
};

interface ProjectDetailClientProps {
  project: Project;
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const router = useRouter();
  const [localProject, setLocalProject] = useState<Project>(project);
  const [clients, setClients] = useState<Client[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateProjectInput>>({
    nama_project: localProject.nama_project,
    client_id: localProject.client_id,
    jenis_layanan: localProject.jenis_layanan,
    status: localProject.status,
    domain: localProject.domain,
    deployment_platform: localProject.deployment_platform,
    deadline: localProject.deadline,
    harga_project: localProject.harga_project,
    biaya_renewal: localProject.biaya_renewal,
    tanggal_renewal: localProject.tanggal_renewal,
    pic_internal: localProject.pic_internal,
    catatan: localProject.catatan,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadClients = useCallback(async () => {
    try {
      const data = await getClients();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load clients:", err);
    }
  }, []);

  useState(() => {
    loadClients();
  }, [loadClients]);

  const handleEditSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_id || !formData.nama_project || !formData.jenis_layanan) {
      toast.error("Mohon isi semua field yang wajib");
      return;
    }
    startTransition(async () => {
      try {
        const updatedProject = await updateProject({ 
          ...formData, 
          id: localProject.id 
        });
        setLocalProject(updatedProject);
        toast.success("Project berhasil diupdate");
        setIsEditDialogOpen(false);
      } catch (err) {
        console.error("Failed to update project:", err);
        toast.error("Gagal mengupdate project", {
          description: err instanceof Error ? err.message : "Terjadi kesalahan"
        });
      }
    });
  }, [formData, localProject.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{localProject.nama_project}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-muted-foreground">Client ID: {localProject.client_id}</span>
              <span>•</span>
              <Badge className={STATUS_COLORS[localProject.status] || "bg-gray-100"} variant="outline">
                {localProject.status}
              </Badge>
            </div>
          </div>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="nama_project">Nama Project *</Label>
                    <Input
                      id="nama_project"
                      value={formData.nama_project ?? ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, nama_project: e.target.value }))}
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_id">Client *</Label>
                    {isLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select
                        value={formData.client_id}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, client_id: value }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.length === 0 ? (
                            <SelectItem value="" disabled>
                              Belum ada client
                            </SelectItem>
                          ) : (
                            clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.nama_client}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jenis_layanan">Jenis Layanan *</Label>
                    <Input
                      id="jenis_layanan"
                      value={formData.jenis_layanan ?? ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, jenis_layanan: e.target.value }))}
                      placeholder="Website, Mobile App, dll"
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as ProjectStatus }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROJECT_STATUS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      value={formData.domain ?? ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value || null }))}
                      placeholder="example.com"
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deployment_platform">Deployment Platform</Label>
                    <Input
                      id="deployment_platform"
                      value={formData.deployment_platform ?? ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, deployment_platform: e.target.value || null }))}
                      placeholder="Vercel, Netlify, cPanel, dll"
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline ?? ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value || null }))}
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="harga_project">Harga Project</Label>
                    <Input
                      id="harga_project"
                      type="number"
                      value={formData.harga_project ?? ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, harga_project: e.target.value ? Number(e.target.value) : null }))}
                      placeholder="0"
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="biaya_renewal">Biaya Renewal</Label>
                    <Input
                      id="biaya_renewal"
                      type="number"
                      value={formData.biaya_renewal ?? ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, biaya_renewal: e.target.value ? Number(e.target.value) : null }))}
                      placeholder="0"
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tanggal_renewal">Tanggal Renewal</Label>
                    <Input
                      id="tanggal_renewal"
                      type="date"
                      value={formData.tanggal_renewal ?? ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, tanggal_renewal: e.target.value || null }))}
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pic_internal">PIC Internal</Label>
                    <Input
                      id="pic_internal"
                      value={formData.pic_internal ?? ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, pic_internal: e.target.value || null }))}
                      placeholder="Nama PIC internal"
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="catatan">Catatan</Label>
                    <Textarea
                      id="catatan"
                      value={formData.catatan ?? ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, catatan: e.target.value || null }))}
                      placeholder="Catatan tambahan..."
                      rows={3}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Simpan"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-slate-800 bg-slate-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informasi Client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Client</p>
            <p className="font-medium">{localProject.clients?.nama_client || "-"}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Tanggal Penting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Deadline</p>
            <p className="font-medium">{localProject.deadline ? new Date(localProject.deadline).toLocaleDateString("id-ID") : "-"}</p>
            <p className="text-sm text-muted-foreground mt-4">Tanggal Renewal</p>
            <p className="font-medium">{localProject.tanggal_renewal ? new Date(localProject.tanggal_renewal).toLocaleDateString("id-ID") : "-"}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Keuangan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Harga Project</p>
            <p className="font-medium">{localProject.harga_project ? `Rp ${localProject.harga_project.toLocaleString("id-ID")}` : "-"}</p>
            <p className="text-sm text-muted-foreground mt-4">Biaya Renewal</p>
            <p className="font-medium">{localProject.biaya_renewal ? `Rp ${localProject.biaya_renewal.toLocaleString("id-ID")}` : "-"}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Teknis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Domain</p>
            <p className="font-medium">{localProject.domain || "-"}</p>
            <p className="text-sm text-muted-foreground mt-4">Deployment Platform</p>
            <p className="font-medium">{localProject.deployment_platform || "-"}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Layanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">Jenis Layanan</p>
            <p className="font-medium">{localProject.jenis_layanan || "-"}</p>
            <p className="text-sm text-muted-foreground mt-4">PIC Internal</p>
            <p className="font-medium">{localProject.pic_internal || "-"}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950/50 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Catatan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{localProject.catatan || "Tidak ada catatan"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-10">
        <ProjectActivityTimeline projectId={localProject.id} />
        <ProjectCredentials projectId={localProject.id} />
      </div>
    </div>
  );
}
