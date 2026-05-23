"use client"

import { useState, useTransition, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Clock, User, MessageSquare, FolderKanban, Building2 } from "lucide-react"
import { getAllProjectLogs } from "@/lib/actions/project-logs"
import type { ProjectLog } from "@/types/project-log"
import { toast } from "sonner"

export default function ActivityLogsPage() {
  const [projectLogs, setProjectLogs] = useState<ProjectLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const loadProjectLogs = useCallback(() => {
    setIsLoading(true)
    startTransition(async () => {
      try {
        const data = await getAllProjectLogs()
        setProjectLogs(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Failed to load project logs:", err)
        toast.error("Gagal memuat activity log", {
          description: err instanceof Error ? err.message : "Terjadi kesalahan"
        })
      } finally {
        setIsLoading(false)
      }
    })
  }, [])

  useEffect(() => {
    loadProjectLogs()
  }, [loadProjectLogs])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
        <p className="text-muted-foreground mt-1">
          Riwayat aktivitas di portal
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : projectLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted rounded-full p-6 mb-4">
                <MessageSquare className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Belum ada activity</h3>
              <p className="text-muted-foreground">
                Riwayat aktivitas akan muncul di sini
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {projectLogs.map((log, index) => (
                <div key={log.id} className={`flex gap-4 py-6 ${index < projectLogs.length - 1 ? 'border-b border-border' : ''}`}>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline" className="font-medium">
                        {log.dibuat_oleh}
                      </Badge>
                      {log.projects && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <FolderKanban className="h-3 w-3" />
                          {log.projects.nama_project}
                        </Badge>
                      )}
                      {log.projects?.clients && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {log.projects.clients.nama_client}
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground ml-auto">
                        {new Date(log.created_at).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <p className="text-foreground">{log.pesan}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
