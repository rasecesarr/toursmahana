import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Search, MoreHorizontal, Edit2, Trash2, Tags, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCategorySchema } from "@server/db/schema";
import { z } from "zod";

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<any>(null);

  const { data: categories = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: editingCat || {
      id: "",
      name: "",
      shortName: "",
      icon: "waves",
      description: "",
      image: "",
      color: "#0A2540",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Could not save category");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast.success("Categoría guardada");
      setIsOpen(false);
      form.reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-deep-blue tracking-tight">Categorías</h1>
          <p className="text-muted-foreground mt-1">Administra los grupos de aventuras del catálogo</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCat(null)} className="bg-gold hover:bg-gold-light text-deep-blue font-bold px-6 rounded-xl shadow-lg transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" /> Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl border-none shadow-2xl p-0 overflow-hidden max-w-lg">
            <DialogHeader className="bg-sand/20 py-8 px-8 border-b">
              <DialogTitle className="text-xl font-bold text-deep-blue">Propiedades de Categoría</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ID</Label>
                  <Input {...form.register("id")} placeholder="ej. eco-hiking" className="bg-sand/10 border-sand-dark" />
                </div>
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input {...form.register("name")} placeholder="ej. Eco-Hiking" className="bg-sand/10 border-sand-dark font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Nombre Corto</Label>
                <Input {...form.register("shortName")} placeholder="ej. Hiking" className="bg-sand/10 border-sand-dark" />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input {...form.register("description")} className="bg-sand/10 border-sand-dark" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Icono (Lucide)</Label>
                  <Input {...form.register("icon")} className="bg-sand/10 border-sand-dark" />
                </div>
                <div className="space-y-2">
                  <Label>Color (HEX)</Label>
                  <Input {...form.register("color")} type="color" className="bg-sand/10 border-sand-dark h-10" />
                </div>
              </div>
              <DialogFooter className="pt-6">
                <Button type="submit" disabled={mutation.isPending} className="w-full bg-deep-blue hover:bg-ocean text-white font-bold h-12 rounded-xl">
                  {mutation.isPending ? "Guardando..." : "Guardar Categoría"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-xl bg-white overflow-hidden rounded-2xl">
        <CardHeader className="border-b bg-sand/20 py-8 px-8">
          <div className="flex items-center gap-4">
            <Tags className="w-6 h-6 text-gold" />
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-deep-blue">Lista de Categorías</CardTitle>
            </div>
            <div className="relative w-full max-w-xs scale-95 origin-right">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar categoría..."
                className="pl-10 bg-white border-sand-dark rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-sand/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold text-deep-blue uppercase tracking-widest text-[10px] pl-8 py-4">ID</TableHead>
                <TableHead className="font-bold text-deep-blue uppercase tracking-widest text-[10px] py-4">Nombre</TableHead>
                <TableHead className="font-bold text-deep-blue uppercase tracking-widest text-[10px] py-4">Nombre Corto</TableHead>
                <TableHead className="font-bold text-deep-blue uppercase tracking-widest text-[10px] py-4">Icono</TableHead>
                <TableHead className="font-bold text-deep-blue uppercase tracking-widest text-[10px] py-4 pr-8 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">Cargando...</TableCell></TableRow>
              ) : filtered.map((cat) => (
                <TableRow key={cat.id} className="hover:bg-sand/10 group">
                  <TableCell className="pl-8 py-4 font-mono text-[11px] text-muted-foreground">{cat.id}</TableCell>
                  <TableCell className="py-4 font-bold text-deep-blue">{cat.name}</TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className="bg-white border-sand-dark text-xs">{cat.shortName}</Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Hash className="w-4 h-4 text-gold-dark" /> {cat.icon}
                    </div>
                  </TableCell>
                  <TableCell className="pr-8 text-right py-4">
                    <Button variant="ghost" size="icon" className="hover:bg-sand/50 rounded-full text-muted-foreground">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
