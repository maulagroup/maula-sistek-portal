import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CredentialsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Credentials</h1>
        <p className="text-muted-foreground mt-1">
          Kelola credentials akses (hanya superadmin)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Konten credentials akan ditampilkan di sini
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
