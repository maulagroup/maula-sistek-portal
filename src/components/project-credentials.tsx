"use client";

import { useState, useTransition, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Search,
  Server,
  Globe,
  Mail,
  Key,
  Database,
  Cloud,
  Shield,
  Loader2,
} from "lucide-react";
import {
  getCredentialsByProjectId,
  createCredential,
  updateCredential,
  deleteCredential,
} from "@/lib/actions/credentials";
import type { Credential, CreateCredentialInput } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/lib/providers";

const PLATFORMS = [
  "Vercel",
  "Cloudflare",
  "Domain Registrar",
  "Hosting",
  "Supabase",
  "Email",
  "API Key",
  "Other",
];

const getPlatformIcon = (platform: string) => {
  const lower = platform.toLowerCase();
  if (lower.includes("vercel")) return <Server className="h-4 w-4" />;
  if (lower.includes("cloudflare")) return <Cloud className="h-4 w-4" />;
  if (lower.includes("domain")) return <Globe className="h-4 w-4" />;
  if (lower.includes("hosting")) return <Server className="h-4 w-4" />;
  if (lower.includes("supabase")) return <Database className="h-4 w-4" />;
  if (lower.includes("email")) return <Mail className="h-4 w-4" />;
  if (lower.includes("api")) return <Key className="h-4 w-4" />;
  return <Shield className="h-4 w-4" />;
};

const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`Berhasil copy ${label}`);
  } catch (err) {
    toast.error(`Gagal copy ${label}`);
  }
};

interface ProjectCredentialsProps {
  projectId: string;
}

export function ProjectCredentials({ projectId }: ProjectCredentialsProps) {
  const { isSuperAdmin, isLoading: authLoading } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [deletingCredentialId, setDeletingCredentialId] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  const loadCredentials = useCallback(() => {
    setIsLoading(true);
    startTransition(async () => {
      try {
        const data = await getCredentialsByProjectId(projectId);
        setCredentials(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load credentials:", err);
        toast.error("Gagal memuat credentials");
        setCredentials([]);
      } finally {
        setIsLoading(false);
      }
    });
  }, [projectId]);

  const [formData, setFormData] = useState<Partial<CreateCredentialInput>>({
    platform: "",
    email_login: null,
    username: null,
    password: null,
    url_login: null,
    catatan: null,
  });

  const resetForm = useCallback(() => {
    setFormData({
      platform: "",
      email_login: null,
      username: null,
      password: null,
      url_login: null,
      catatan: null,
    });
    setEditingCredential(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.platform) {
        toast.error("Mohon pilih platform");
        return;
      }

      startTransition(async () => {
        try {
          if (editingCredential) {
            await updateCredential({ ...formData, id: editingCredential.id });
            toast.success("Credential berhasil diupdate");
          } else {
            await createCredential({ ...formData, project_id: projectId } as CreateCredentialInput);
            toast.success("Credential berhasil ditambahkan");
          }
          resetForm();
          setIsAddDialogOpen(false);
          loadCredentials();
        } catch (err) {
          console.error("Failed to save credential:", err);
          toast.error(editingCredential ? "Gagal mengupdate credential" : "Gagal menambah credential");
        }
      });
    },
    [formData, editingCredential, projectId, loadCredentials, resetForm]
  );

  const handleEdit = useCallback((credential: Credential) => {
    setEditingCredential(credential);
    setFormData({
      platform: credential.platform,
      email_login: credential.email_login,
      username: credential.username,
      password: credential.password,
      url_login: credential.url_login,
      catatan: credential.catatan,
    });
    setIsAddDialogOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deletingCredentialId) return;
    startTransition(async () => {
      try {
        await deleteCredential(deletingCredentialId);
        toast.success("Credential berhasil dihapus");
        setDeletingCredentialId(null);
        loadCredentials();
      } catch (err) {
        console.error("Failed to delete credential:", err);
        toast.error("Gagal menghapus credential");
      }
    });
  }, [deletingCredentialId, loadCredentials]);

  const filteredCredentials = useMemo(() => {
    if (!search) return credentials;
    const lowerSearch = search.toLowerCase();
    return credentials.filter(
      (c) =>
        c.platform.toLowerCase().includes(lowerSearch) ||
        (c.email_login?.toLowerCase().includes(lowerSearch) || false) ||
        (c.username?.toLowerCase().includes(lowerSearch) || false)
    );
  }, [credentials, search]);

  const toggleShowPassword = (id: string) => {
    if (!isSuperAdmin) return;
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    loadCredentials();
  }, [loadCredentials]);

  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading auth...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle>Credentials</CardTitle>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari credential..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-800"
            />
          </div>
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Credential
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCredential ? "Edit Credential" : "Tambah Credential"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform *</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, platform: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email_login">Email Login</Label>
                    <Input
                      id="email_login"
                      value={formData.email_login || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email_login: e.target.value || null }))
                      }
                      placeholder="email@example.com"
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, username: e.target.value || null }))
                      }
                      placeholder="username"
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, password: e.target.value || null }))
                    }
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url_login">URL Login</Label>
                  <Input
                    id="url_login"
                    value={formData.url_login || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, url_login: e.target.value || null }))
                    }
                    placeholder="https://example.com/login"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="catatan">Catatan</Label>
                  <Textarea
                    id="catatan"
                    value={formData.catatan || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, catatan: e.target.value || null }))
                    }
                    placeholder="Catatan tambahan..."
                    rows={3}
                    autoComplete="off"
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Simpan"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-slate-800 bg-slate-950/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCredentials.length === 0 ? (
        <Card className="border-slate-800 bg-slate-950/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted rounded-full p-6 mb-4">
              <Key className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {search ? "Credential tidak ditemukan" : "Belum ada credential"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {search
                ? "Coba kata kunci lain"
                : "Mulai dengan menambahkan credential pertama untuk project ini"}
            </p>
            {!search && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Credential Pertama
                  </Button>
                </DialogTrigger>
              </Dialog>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCredentials.map((credential) => (
            <Card key={credential.id} className="border-slate-800 bg-slate-950/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {getPlatformIcon(credential.platform)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {credential.platform}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {credential.email_login && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Email</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">{credential.email_login}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => copyToClipboard(credential.email_login!, "email")}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {credential.username && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Username</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">{credential.username}</p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => copyToClipboard(credential.username!, "username")}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {isSuperAdmin && credential.password && (
                          <div className="space-y-1 md:col-span-2">
                            <p className="text-xs text-muted-foreground">Password</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium font-mono">
                                {showPasswords[credential.id]
                                  ? credential.password
                                  : "••••••••••••"}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => toggleShowPassword(credential.id)}
                              >
                                {showPasswords[credential.id] ? (
                                  <EyeOff className="h-3.5 w-3.5" />
                                ) : (
                                  <Eye className="h-3.5 w-3.5" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => copyToClipboard(credential.password!, "password")}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {!isSuperAdmin && credential.password && (
                          <div className="space-y-1 md:col-span-2">
                            <p className="text-xs text-muted-foreground">Password</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium font-mono text-muted-foreground">
                                ••••••••••••
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-50 cursor-not-allowed"
                                disabled
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-50 cursor-not-allowed"
                                disabled
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {credential.url_login && (
                          <div className="space-y-1 md:col-span-2">
                            <p className="text-xs text-muted-foreground">URL Login</p>
                            <div className="flex items-center gap-2">
                              <a
                                href={credential.url_login}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-400 hover:text-blue-300 truncate"
                              >
                                {credential.url_login}
                              </a>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => copyToClipboard(credential.url_login!, "URL")}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                        {credential.catatan && (
                          <div className="space-y-1 md:col-span-2">
                            <p className="text-xs text-muted-foreground">Catatan</p>
                            <p className="text-sm text-muted-foreground">{credential.catatan}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(credential)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingCredentialId(credential.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak bisa dibatalkan. Credential ini akan dihapus selamanya.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDelete}
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
