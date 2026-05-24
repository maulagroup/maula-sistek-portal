"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Search,
  Server,
  Globe,
  Mail,
  Key,
  Database,
  Cloud,
  Shield,
  Copy,
  Eye,
  EyeOff,
  Link2,
  FolderKanban,
  User,
  Clock,
  Loader2,
} from "lucide-react";
import type { Credential } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/lib/providers";

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

interface CredentialsClientProps {
  credentials: Credential[];
}

export function CredentialsClient({ credentials }: CredentialsClientProps) {
  const { isSuperAdmin, isLoading: authLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const filteredCredentials = useMemo(() => {
    if (!search) return credentials;
    const lowerSearch = search.toLowerCase();
    return credentials.filter(
      (c) =>
        c.platform.toLowerCase().includes(lowerSearch) ||
        (c.projects?.nama_project?.toLowerCase().includes(lowerSearch) || false) ||
        (c.projects?.clients?.nama_client?.toLowerCase().includes(lowerSearch) || false) ||
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Credentials</h1>
        <p className="text-muted-foreground mt-1">
          Semua credentials untuk seluruh project
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari credential (platform, project, client, email, username)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-800"
          />
        </div>
      </div>

      {credentials.length === 0 ? (
        <Card className="border-slate-800 bg-slate-950/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted rounded-full p-6 mb-4">
              <Key className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Belum ada credential</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Tambahkan credential di halaman detail project untuk melihatnya di sini
            </p>
          </CardContent>
        </Card>
      ) : filteredCredentials.length === 0 ? (
        <Card className="border-slate-800 bg-slate-950/50">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted rounded-full p-6 mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Credential tidak ditemukan</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Coba kata kunci lain
            </p>
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
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {credential.platform}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 flex items-center gap-1">
                          <FolderKanban className="h-3 w-3" />
                          {credential.projects?.nama_project || "-"}
                        </Badge>
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {credential.projects?.clients?.nama_client || "-"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {credential.email_login && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              Email
                            </p>
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
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Username
                            </p>
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
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Key className="h-3 w-3" />
                              Password
                            </p>
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
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Key className="h-3 w-3" />
                              Password
                            </p>
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

                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Dibuat
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(credential.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
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
