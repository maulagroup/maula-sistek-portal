"use client"

import { useState, useTransition, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Edit2, Trash2, Loader2, FolderKanban, Eye } from "lucide-react"
import { getProjects, createProject, updateProject, deleteProject } from "@/lib/actions/projects"
import { getClients } from "@/lib/actions/clients"
import type { Project, CreateProjectInput, ProjectStatus } from "@/types/project"
import type { Client } from "@/types/client"
import { toast } from "sonner"

const STATUS_COLORS: Record<ProjectStatus, string> = {
  "Leads": "bg-blue-900/30 text-blue-400 border-blue-800",
  "DP & Planning": "bg-purple-900/30 text-purple-400 border-purple-800",
  "UI/UX Design": "bg-pink-900/30 text-pink-400 border-pink-800",
  "Development": "bg-yellow-900/30 text-yellow-400 border-yellow-800",
  "Internal Testing": "bg-orange-900/30 text-orange-400 border-orange-800",
  "Client Review": "bg-cyan-900/30 text-cyan-400 border-cyan-800",
  "Revision": "bg-red-900/30 text-red-400 border-red-800",
  "Pelunasan & Deploy": "bg-green-900/30 text-green-400 border-green-800",
  "Maintenance": "bg-gray-900/30 text-gray-400 border-gray-800",
  "Archived": "bg-zinc-900/30 text-zinc-500 border-zinc-800",
}

function ProjectForm({
  formData,
  setFormData,
  clients,
  onSubmit,
  onCancel,
  isPending,
  isEdit,
  isLoading,
}: {
  formData: Partial<CreateProjectInput>
  setFormData: (data: Partial<CreateProjectInput> | ((prev: Partial<CreateProjectInput>) => Partial<CreateProjectInput>)) => void
  clients: Client[]
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  isPending: boolean
  isEdit: boolean
  isLoading: boolean
}) {
  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Project" : "Tambah Project"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="nama_project">Nama Project *</Label>
            <Input
              id="nama_project"
              value={formData.nama_project ?? ""}
              onChange={(e) => setFormData(prev => ({ ...prev, nama_project: e.target.value }))}
              autoComplete="off"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client_id">Client *</Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={formData.client_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, client_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.length === 0 ? (
                    <SelectItem value="" disabled>
                      Belum ada client
                    </SelectItem>
                  ) : (
                    clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.nama_client}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="jenis_layanan">Jenis Layanan *</Label>
            <Input
              id="jenis_layanan"
              value={formData.jenis_layanan ?? ""}
              onChange={(e) => setFormData(prev => ({ ...prev, jenis_layanan: e.target.value }))}
              placeholder="Website, Mobile App, dll"
              autoComplete="off"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              value={formData.status ?? "Leads"}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ProjectStatus }))}
              placeholder="Leads, Development, dll"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              value={formData.domain ?? ""}
              onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value || null }))}
              placeholder="example.com"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deployment_platform">Deployment Platform</Label>
            <Input
              id="deployment_platform"
              value={formData.deployment_platform ?? ""}
              onChange={(e) => setFormData(prev => ({ ...prev, deployment_platform: e.target.value || null }))}
              placeholder="Vercel, Netlify, cPanel, dll"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline ?? ""}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value || null }))}
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="harga_project">Harga Project</Label>
            <Input
              id="harga_project"
              type="number"
              value={formData.harga_project ?? ""}
              onChange={(e) => setFormData(prev => ({ ...prev, harga_project: e.target.value ? Number(e.target.value) : null }))}
              placeholder="0"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="biaya_renewal">Biaya Renewal</Label>
            <Input
              id="biaya_renewal"
              type="number"
              value={formData.biaya_renewal ?? ""}
              onChange={(e) => setFormData(prev => ({ ...prev, biaya_renewal: e.target.value ? Number(e.target.value) : null }))}
              placeholder="0"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggal_renewal">Tanggal Renewal</Label>
            <Input
              id="tanggal_renewal"
              type="date"
              value={formData.tanggal_renewal ?? ""}
              onChange={(e) => setFormData(prev => ({ ...prev, tanggal_renewal: e.target.value || null }))}
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pic_internal">PIC Internal</Label>
            <Input
              id="pic_internal"
              value={formData.pic_internal ?? ""}
              onChange={(e) => setFormData(prev => ({ ...prev, pic_internal: e.target.value || null }))}
              placeholder="Nama PIC internal"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="catatan">Catatan</Label>
            <Textarea
              id="catatan"
              value={formData.catatan ?? ""}
              onChange={(e) => setFormData(prev => ({ ...prev, catatan: e.target.value || null }))}
              placeholder="Catatan tambahan..."
              rows={3}
              autoComplete="off"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Simpan"
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

const SkeletonRow = () => (
  <TableRow>
    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
  </TableRow>
)

const EmptyState = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  formData,
  setFormData,
  clients,
  onSubmit,
  resetForm,
  isPending,
  isLoading,
}: {
  isAddDialogOpen: boolean
  setIsAddDialogOpen: (open: boolean) => void
  formData: Partial<CreateProjectInput>
  setFormData: (data: Partial<CreateProjectInput> | ((prev: Partial<CreateProjectInput>) => Partial<CreateProjectInput>)) => void
  clients: Client[]
  onSubmit: (e: React.FormEvent) => void
  resetForm: () => void
  isPending: boolean
  isLoading: boolean
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="bg-muted rounded-full p-6 mb-4">
      <FolderKanban className="h-12 w-12 text-muted-foreground" />
    </div>
    <h3 className="text-xl font-semibold mb-2">Belum ada project</h3>
    <p className="text-muted-foreground mb-6 max-w-sm">
      Mulai dengan menambahkan project pertama Anda
    </p>
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Project Pertama
        </Button>
      </DialogTrigger>
      <ProjectForm
        formData={formData}
        setFormData={setFormData}
        clients={clients}
        onSubmit={onSubmit}
        onCancel={() => {
          setIsAddDialogOpen(false)
          resetForm()
        }}
        isPending={isPending}
        isEdit={false}
        isLoading={isLoading}
      />
    </Dialog>
  </div>
)

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<Partial<CreateProjectInput>>({
    nama_project: "",
    client_id: "",
    jenis_layanan: "",
    status: "Leads",
    domain: null,
    deployment_platform: null,
    deadline: null,
    harga_project: null,
    biaya_renewal: null,
    tanggal_renewal: null,
    pic_internal: null,
    catatan: null,
  })

  const resetForm = useCallback(() => {
    setFormData({
      nama_project: "",
      client_id: "",
      jenis_layanan: "",
      status: "Leads",
      domain: null,
      deployment_platform: null,
      deadline: null,
      harga_project: null,
      biaya_renewal: null,
      tanggal_renewal: null,
      pic_internal: null,
      catatan: null,
    })
    setEditingProject(null)
  }, [])

  const loadData = useCallback(() => {
    setIsLoading(true)
    startTransition(async () => {
      try {
        const [projectsData, clientsData] = await Promise.all([
          getProjects(),
          getClients(),
        ])
        setProjects(Array.isArray(projectsData) ? projectsData : [])
        setClients(Array.isArray(clientsData) ? clientsData : [])
      } catch (err) {
        console.error("Failed to load data:", err)
        toast.error("Gagal memuat data", {
          description: err instanceof Error ? err.message : "Terjadi kesalahan"
        })
      } finally {
        setIsLoading(false)
      }
    })
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.client_id || !formData.nama_project || !formData.jenis_layanan) {
      toast.error("Mohon isi semua field yang wajib")
      return
    }
    startTransition(async () => {
      try {
        if (editingProject) {
          await updateProject({ ...formData, id: editingProject.id } as Partial<CreateProjectInput> & { id: string })
          toast.success("Project berhasil diupdate")
        } else {
          await createProject(formData as CreateProjectInput)
          toast.success("Project berhasil ditambahkan")
        }
        resetForm()
        setIsAddDialogOpen(false)
        loadData()
      } catch (err) {
        console.error("Failed to save project:", err)
        toast.error(editingProject ? "Gagal mengupdate project" : "Gagal menambah project", {
          description: err instanceof Error ? err.message : "Terjadi kesalahan"
        })
      }
    })
  }, [formData, editingProject, loadData, resetForm])

  const handleEdit = useCallback((project: Project) => {
    setEditingProject(project)
    setFormData({
      nama_project: project.nama_project,
      client_id: project.client_id,
      jenis_layanan: project.jenis_layanan,
      status: project.status,
      domain: project.domain,
      deployment_platform: project.deployment_platform,
      deadline: project.deadline,
      harga_project: project.harga_project,
      biaya_renewal: project.biaya_renewal,
      tanggal_renewal: project.tanggal_renewal,
      pic_internal: project.pic_internal,
      catatan: project.catatan,
    })
    setIsAddDialogOpen(true)
  }, [])

  const handleDelete = useCallback(async () => {
    if (!deletingProjectId) return
    startTransition(async () => {
      try {
        await deleteProject(deletingProjectId)
        toast.success("Project berhasil dihapus")
        setDeletingProjectId(null)
        loadData()
      } catch (err) {
        console.error("Failed to delete project:", err)
        toast.error("Gagal menghapus project", {
          description: err instanceof Error ? err.message : "Terjadi kesalahan"
        })
      }
    })
  }, [deletingProjectId, loadData])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Kelola semua project Anda
          </p>
        </div>
        {projects.length > 0 && (
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Project
              </Button>
            </DialogTrigger>
            <ProjectForm
              formData={formData}
              setFormData={setFormData}
              clients={clients}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsAddDialogOpen(false)
                resetForm()
              }}
              isPending={isPending}
              isEdit={!!editingProject}
              isLoading={isLoading}
            />
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Jenis Layanan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="w-[180px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </TableBody>
            </Table>
          ) : projects.length === 0 ? (
            <EmptyState
              isAddDialogOpen={isAddDialogOpen}
              setIsAddDialogOpen={setIsAddDialogOpen}
              formData={formData}
              setFormData={setFormData}
              clients={clients}
              onSubmit={handleSubmit}
              resetForm={resetForm}
              isPending={isPending}
              isLoading={isLoading}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Jenis Layanan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="w-[180px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.nama_project}</TableCell>
                    <TableCell>{project.client_id}</TableCell>
                    <TableCell>{project.jenis_layanan}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[project.status] || "bg-gray-100"} variant="outline">
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{project.deadline ? new Date(project.deadline).toLocaleDateString("id-ID") : "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/projects/${project.id}`} className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent">
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setDeletingProjectId(project.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tindakan ini tidak bisa dibatalkan. Project ini akan dihapus selamanya beserta semua data yang terkait.
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
