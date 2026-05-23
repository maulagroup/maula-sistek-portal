import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  FolderKanban, 
  TrendingUp, 
  Clock 
} from "lucide-react"

const stats = [
  { title: "Total Users", value: "1,248", icon: Users, trend: "+12%" },
  { title: "Active Projects", value: "36", icon: FolderKanban, trend: "+5%" },
  { title: "Revenue", value: "$45,231", icon: TrendingUp, trend: "+23%" },
  { title: "Tasks Completed", value: "892", icon: Clock, trend: "+18%" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Selamat datang di Portal Maula SisTek
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">{stat.trend}</span> dari bulan lalu
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Konten aktivitas akan ditampilkan di sini
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Proyek Mendatang</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Konten proyek akan ditampilkan di sini
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
