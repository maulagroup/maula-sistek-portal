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

export function ClientsPageClient() {
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
        setIsAddDialogOpen(false)
        setEditingClient(null)
        setFormData({ nama_client: "", nama_pic: "", nomor_wa: "", catatan: null })
        loadClients()
      } catch (err) {
        console.error("Failed to save client:", err)
        toast.error("Gagal menyimpan client", {
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

  const handleDelete = (clientId: string) => {
    startTransition(async () => {
      try {
        await deleteClient(clientId)
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

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-slate-400">Kelola data client Anda</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setEditingClient(null)
                    setFormData({ nama_client: "", nama_pic: "", nomor_wa: "", catatan: null })
                  }}
                >
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

      <Card className="border-slate-800 bg-slate-950/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Daftar Clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada client</p>
              <p className="text-sm">Tambahkan client pertama Anda</p>
            </div>
          ) : (
            <div className="rounded-md border border-slate-800">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800">
                    <TableHead>Nama Client</TableHead>
                    <TableHead>Nama PIC</TableHead>
                    <TableHead>Nomor WA</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id} className="border-slate-800">
                      <TableCell className="font-medium">{client.nama_client}</TableCell>
                      <TableCell>{client.nama_pic}</TableCell>
                      <TableCell>{client.nomor_wa}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(client)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-400 hover:text-red-400 hover:border-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Client?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus client ini?
                                  Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDelete(client.id)}
                                >
                                  {isPending && deletingClientId === client.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Menghapus...
                                    </>
                                  ) : (
                                    "Hapus"
                                  )}
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
