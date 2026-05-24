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
import { createProject } from "@/lib/actions/projects";
import { getClients } from "@/lib/actions/clients";
import type { CreateProjectInput, Client } from "@/types";
import { PROJECT_STATUS, type ProjectStatus } from "@/lib/constants";
import { toast } from "sonner";

interface AddProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddProjectModal({ open, onOpenChange, onSuccess }: AddProjectModalProps) {
  const [isPending, startTransition] = useTransition();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [formData, setFormData] = useState<Partial<CreateProjectInput>>({
    nama_project: "",
    client_id: "",
    jenis_layanan: "",
    status: "Leads",
    domain: null,
    deployment_platform: null,
    deadline: null,
    harga_project: null,
    biaya_renewal: null,
    tanggal_renewal: null,
    pic_internal: null,
    catatan: null,
  });

  useEffect(() => {
    if (open) {
      loadClients();
    }
  }, [open]);

  const loadClients = async () => {
    try {
      setIsLoadingClients(true);
      const data = await getClients();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load clients:", err);
      toast.error("Gagal memuat clients", {
        description: err instanceof Error ? err.message : "Terjadi kesalahan"
      });
    } finally {
      setIsLoadingClients(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_id || !formData.nama_project || !formData.jenis_layanan) {
      toast.error("Mohon isi semua field yang wajib");
      return;
    }
    startTransition(async () => {
      try {
        await createProject(formData as CreateProjectInput);
        toast.success("Project berhasil ditambahkan");
        resetForm();
        onOpenChange(false);
        onSuccess?.();
      } catch (err) {
        console.error("Failed to add project:", err);
        toast.error("Gagal menambah project", {
          description: err instanceof Error ? err.message : "Terjadi kesalahan"
        });
      }
    });
  };

  const resetForm = () => {
    setFormData({
      nama_project: "",
      client_id: "",
      jenis_layanan: "",
      status: "Penawaran",
      domain: null,
      deployment_platform: null,
      deadline: null,
      harga_project: null,
      biaya_renewal: null,
      tanggal_renewal: null,
      pic_internal: null,
      catatan: null,
    });
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              {isLoadingClients ? (
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
                value={formData.status ?? "Penawaran"}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as ProjectStatus }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Penawaran">Penawaran</SelectItem>
                  <SelectItem value="Deal">Deal</SelectItem>
                  <SelectItem value="Pembuatan">Pembuatan</SelectItem>
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
              <Select
                value={formData.deployment_platform ?? ""}
                onValueChange={(value) => setFormData(prev => ({ ...prev, deployment_platform: value || null }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih deployment platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Domainesia, Cloudflare, Github, Vercel">Domainesia, Cloudflare, Github, Vercel</SelectItem>
                  <SelectItem value="Domainesia, Cloudflare, Github, Vercel, Server">Domainesia, Cloudflare, Github, Vercel, Server</SelectItem>
                  <SelectItem value="Cloudflare, Github, Vercel">Cloudflare, Github, Vercel</SelectItem>
                  <SelectItem value="Cloudflare, Github, Vercel, Server">Cloudflare, Github, Vercel, Server</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                lang="id-ID"
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
                lang="id-ID"
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
