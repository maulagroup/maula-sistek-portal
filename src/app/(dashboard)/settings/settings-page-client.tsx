"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsPageClient() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-400 mt-1">
          Halaman Pengaturan Portal.
        </p>
      </div>

      <Card className="border-slate-800 bg-slate-950/50">
        <CardHeader>
          <CardTitle>Pengaturan Umum</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-sm">
            Fitur pengaturan akan ditampilkan di sini - Saat ini belum tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
