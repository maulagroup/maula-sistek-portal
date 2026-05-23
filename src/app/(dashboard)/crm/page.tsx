import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CRMPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">CRM</h1>
        <p className="text-muted-foreground mt-1">
          Kelola customer dan hubungan bisnis Anda
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Konten CRM akan ditampilkan di sini
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
