import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Halaman Pengaturan Portal.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Umum</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Fitur pengaturan akan ditampilkan di sini - Saat ini belum tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
