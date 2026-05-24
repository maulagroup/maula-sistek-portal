"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/actions/clients";
import type { CreateClientInput } from "@/types";
import { toast } from "sonner";

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddClientModal({ open, onOpenChange, onSuccess }: AddClientModalProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<CreateClientInput>({
    nama_client: "",
    nama_pic: "",
    nomor_wa: "",
    catatan: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await createClient(formData);
        toast.success("Client berhasil ditambahkan");
        setFormData({ nama_client: "", nama_pic: "", nomor_wa: "", catatan: null });
        onOpenChange(false);
        onSuccess?.();
      } catch (err) {
        console.error("Failed to add client:", err);
        toast.error("Gagal menambah client", {
          description: err instanceof Error ? err.message : "Terjadi kesalahan"
        });
      }
    });
  };

  const handleCancel = () => {
    setFormData({ nama_client: "", nama_pic: "", nomor_wa: "", catatan: null });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama_client">Nama Client</Label>
            <Input
              id="nama_client"
              value={formData.nama_client}
              onChange={(e) => setFormData({ ...formData, nama_client: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nama_pic">Nama PIC</Label>
            <Input
              id="nama_pic"
              value={formData.nama_pic}
              onChange={(e) => setFormData({ ...formData, nama_pic: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nomor_wa">Nomor WhatsApp</Label>
            <Input
              id="nomor_wa"
              value={formData.nomor_wa}
              onChange={(e) => setFormData({ ...formData, nomor_wa: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="catatan">Catatan</Label>
            <Textarea
              id="catatan"
              value={formData.catatan || ""}
              onChange={(e) => setFormData({ ...formData, catatan: e.target.value || null })}
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
