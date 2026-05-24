"use client"

import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Edit2, Trash2, Loader2, Users, UserPlus } from "lucide-react"
import { getClients, createClient, updateClient, deleteClient } from "@/lib/actions/clients"
import type { Client, CreateClientInput } from "@/types"
import { toast } from "sonner"

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState<CreateClientInput>({
    nama_client: "",
    nama_pic: "",
    nomor_wa: "",
    catatan: null,
  })

  const loadClients = () => {
    setIsLoading(true)
    startTransition(async () => {
      try {
        const data = await getClients()
        setClients(Array.isArray(data) ? (data as Client[]) : [])
      } catch (err) {
        console.error("Failed to load clients:", err)
        toast.error("Gagal memuat clients", {
          description: err instanceof Error ? err.message : "Terjadi kesalahan"
        })
        setClients([])
      } finally {
        setIsLoading(false)
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        if (editingClient) {
          await updateClient({ ...formData, id: editingClient.id })
          toast.success("Client berhasil diupdate")
        } else {
          await createClient(formData)
          toast.success("Client berhasil ditambahkan")
        }
        setFormData({ nama_client: "", nama_pic: "", nomor_wa: "", catatan: null })
        setEditingClient(null)
        setIsAddDialogOpen(false)
        loadClients()
      } catch (err) {
        console.error("Failed to save client:", err)
        toast.error(editingClient ? "Gagal mengupdate client" : "Gagal menambah client", {
          description: err instanceof Error ? err.message : "Terjadi kesalahan"
        })
      }
    })
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setFormData({
      nama_client: client.nama_client,
      nama_pic: client.nama_pic,
      nomor_wa: client.nomor_wa,
      catatan: client.catatan,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingClientId) return
    startTransition(async () => {
      try {
        await deleteClient(deletingClientId)
        toast.success("Client berhasil dihapus")
        setDeletingClientId(null)
        loadClients()
      } catch (err) {
        console.error("Failed to delete client:", err)
        toast.error("Gagal menghapus client", {
          description: err instanceof Error ? err.message : "Terjadi kesalahan"
        })
      }
    })
  }

  useEffect(() => {
    loadClients()
  }, [])

  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
      <TableCell><Skeleton className="h-5 w-28" /></TableCell>
      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
    </TableRow>
  )

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted rounded-full p-6 mb-4">
        <Users className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Belum ada client</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Mulai dengan menambahkan client pertama Anda
      </p>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Client Pertama
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Client</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nama_client">Nama Client</Label>
              <Input
                id="nama_client"
                value={formData.nama_client}
                onChange={(e) => setFormData({ ...formData, nama_client: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nama_pic">Nama PIC</Label>
              <Input
                id="nama_pic"
                value={formData.nama_pic}
                onChange={(e) => setFormData({ ...formData, nama_pic: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nomor_wa">Nomor WhatsApp</Label>
              <Input
                id="nomor_wa"
                value={formData.nomor_wa}
                onChange={(e) => setFormData({ ...formData, nomor_wa: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan</Label>
              <Textarea
                id="catatan"
                value={formData.catatan || ""}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value || null })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setIsAddDialogOpen(false)
                setFormData({ nama_client: "", nama_pic: "", nomor_wa: "", catatan: null })
              }}>
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
      </Dialog>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Halaman Management Client.
          </p>
        </div>
        {(clients ?? []).length > 0 && (
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open)
            if (!open) {
              setEditingClient(null)
              setFormData({ nama_client: "", nama_pic: "", nomor_wa: "", catatan: null })
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingClient ? "Edit Client" : "Tambah Client"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nama_client">Nama Client</Label>
                  <Input
                    id="nama_client"
                    value={formData.nama_client}
                    onChange={(e) => setFormData({ ...formData, nama_client: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nama_pic">Nama PIC</Label>
                  <Input
                    id="nama_pic"
                    value={formData.nama_pic}
                    onChange={(e) => setFormData({ ...formData, nama_pic: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomor_wa">Nomor WhatsApp</Label>
                  <Input
                    id="nomor_wa"
                    value={formData.nomor_wa}
                    onChange={(e) => setFormData({ ...formData, nomor_wa: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="catatan">Catatan</Label>
                  <Textarea
                    id="catatan"
                    value={formData.catatan || ""}
                    onChange={(e) => setFormData({ ...formData, catatan: e.target.value || null })}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsAddDialogOpen(false)
                    setEditingClient(null)
                    setFormData({ nama_client: "", nama_pic: "", nomor_wa: "", catatan: null })
                  }}>
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
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Clients</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Client</TableHead>
                  <TableHead>PIC</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Catatan</TableHead>
                  <TableHead className="w-[150px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </TableBody>
            </Table>
          ) : (clients ?? []).length === 0 ? (
            <EmptyState />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Client</TableHead>
                  <TableHead>PIC</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Catatan</TableHead>
                  <TableHead className="w-[150px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(clients ?? []).map((client) => (
                  <TableRow key={client?.id ?? Date.now().toString()}>
                    <TableCell className="font-medium">{client?.nama_client ?? "-"}</TableCell>
                    <TableCell>{client?.nama_pic ?? "-"}</TableCell>
                    <TableCell>{client?.nomor_wa ?? "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">{client?.catatan ?? "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => client && handleEdit(client)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => client?.id && setDeletingClientId(client.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Yakin ingin menghapus?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tindakan ini tidak bisa dibatalkan. Client ini akan dihapus selamanya.
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
