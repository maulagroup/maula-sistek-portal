"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CRMPageClient() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
        <p className="text-slate-400 mt-1">
          Kelola customer dan hubungan bisnis Anda
        </p>
      </div>

      <Card className="border-slate-800 bg-slate-950/50">
        <CardHeader>
          <CardTitle>Daftar Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-sm">
            Konten CRM akan ditampilkan di sini
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
