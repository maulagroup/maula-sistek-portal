"use client";

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Loader2, MessageSquare, Clock, User } from "lucide-react"
import { getActivityLogsByProjectId, createActivityLog } from "@/lib/actions/activity-logs"
import type { ActivityLog } from "@/types"
import { toast } from "sonner"

interface ProjectActivityTimelineProps {
  projectId: string
}

export function ProjectActivityTimeline({ projectId }: ProjectActivityTimelineProps) {
  const [projectLogs, setProjectLogs] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pesan, setPesan] = useState("")
  const [dibuatOleh, setDibuatOleh] = useState("Admin")

  const loadProjectLogs = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getActivityLogsByProjectId(projectId)
      setProjectLogs(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Failed to load project logs:", err)
      setProjectLogs([])
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!pesan.trim()) {
      toast.error("Mohon isi pesan")
      return
    }

    if (!dibuatOleh.trim()) {
      toast.error("Mohon isi dibuat oleh")
      return
    }

    if (!projectId) {
      toast.error("Project ID tidak ditemukan")
      return
    }

    setIsSubmitting(true)
    try {
      await createActivityLog({
        project_id: projectId,
        pesan: pesan.trim(),
        dibuat_oleh: dibuatOleh.trim(),
      })
      
      toast.success("Activity log berhasil ditambahkan")
      setPesan("")
      await loadProjectLogs()
    } catch (err) {
      console.error("Failed to add activity log:", err)
      toast.error("Gagal menambah activity log", {
        description: err instanceof Error ? err.message : "Terjadi kesalahan"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    loadProjectLogs()
  }, [loadProjectLogs])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Tambah Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddActivity} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pesan">Pesan *</Label>
                <Input
                  id="pesan"
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                  placeholder="Masukkan pesan activity..."
                  autoComplete="off"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dibuatOleh">Dibuat Oleh *</Label>
                <Input
                  id="dibuatOleh"
                  value={dibuatOleh}
                  onChange={(e) => setDibuatOleh(e.target.value)}
                  placeholder="Nama pembuat"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Simpan...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Activity
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timeline Activity
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
                Mulai dengan menambah activity log pertama
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {projectLogs.map((log, index) => (
                <div key={log.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    {index < projectLogs.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{log.pesan}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Dibuat oleh: {log.dibuat_oleh}</p>
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
