"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { createActivityLog } from "@/lib/actions/activity-logs";
import { getProjects } from "@/lib/actions/projects";
import { useAuth } from "@/lib/providers/auth-provider";
import type { CreateActivityLogInput, Project } from "@/types";
import { toast } from "sonner";

interface AddActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddActivityModal({ open, onOpenChange, onSuccess }: AddActivityModalProps) {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [formData, setFormData] = useState<Partial<CreateActivityLogInput>>({
    project_id: "",
    pesan: "",
    dibuat_oleh: user?.nama || "Admin",
  });

  useEffect(() => {
    if (open) {
      loadProjects();
    }
  }, [open]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, dibuat_oleh: user?.nama || "Admin" }));
  }, [user?.nama]);

  const loadProjects = async () => {
    try {
      setIsLoadingProjects(true);
      const data = await getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load projects:", err);
      toast.error("Gagal memuat projects", {
        description: err instanceof Error ? err.message : "Terjadi kesalahan"
      });
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.project_id || !formData.pesan || !formData.dibuat_oleh) {
      toast.error("Mohon isi semua field yang wajib");
      return;
    }
    startTransition(async () => {
      try {
        await createActivityLog(formData as CreateActivityLogInput);
        toast.success("Activity berhasil ditambahkan");
        resetForm();
        onOpenChange(false);
        onSuccess?.();
      } catch (err) {
        console.error("Failed to add activity:", err);
        toast.error("Gagal menambah activity", {
          description: err instanceof Error ? err.message : "Terjadi kesalahan"
        });
      }
    });
  };

  const resetForm = () => {
    setFormData({
      project_id: "",
      pesan: "",
      dibuat_oleh: user?.nama || "Admin",
    });
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Activity</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project_id">Project *</Label>
            {isLoadingProjects ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={formData.project_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, project_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.length === 0 ? (
                    <SelectItem value="" disabled>
                      Belum ada project
                    </SelectItem>
                  ) : (
                    projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.nama_project}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pesan">Pesan Activity *</Label>
            <Textarea
              id="pesan"
              value={formData.pesan ?? ""}
              onChange={(e) => setFormData(prev => ({ ...prev, pesan: e.target.value }))}
              placeholder="Masukkan pesan activity..."
              rows={4}
              autoComplete="off"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dibuat_oleh">Dibuat Oleh</Label>
            <Input
              id="dibuat_oleh"
              value={formData.dibuat_oleh ?? ""}
              onChange={(e) => setFormData(prev => ({ ...prev, dibuat_oleh: e.target.value }))}
              placeholder="Nama pembuat"
              autoComplete="off"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
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
  );
}
