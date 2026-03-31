import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Plus, Search, MoreHorizontal, Edit2, Trash2, ExternalLink, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { toast } from "sonner";
import { useState } from "react";

export default function AdminTours() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: tours = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/tours"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/tours/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete tour");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tours"] });
      toast.success("Tour eliminado");
    },
    onError: (err) => toast.error(err.message),
  });

  const filteredTours = tours.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-deep-blue tracking-tight">Gestión de Tours</h1>
          <p className="text-muted-foreground mt-1">Administra todo el catálogo de experiencias en tiempo real</p>
        </div>
        <Link href="/admin/tours/new">
          <Button className="bg-gold hover:bg-gold-light text-deep-blue font-bold px-6 rounded-xl shadow-lg transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" /> Nuevo Tour
          </Button>
        </Link>
      </div>

      <Card className="border-none shadow-xl bg-white overflow-hidden rounded-2xl">
        <CardHeader className="border-b bg-sand/20 py-8 px-8">
          <div className="flex items-center gap-4">
            <Package className="w-6 h-6 text-gold" />
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-deep-blue">Inventario de Tours</CardTitle>
              <CardDescription>Mostrando {filteredTours.length} tours registrados</CardDescription>
            </div>
            <div className="relative w-full max-w-xs scale-95 origin-right">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o ID..."
                className="pl-10 bg-white border-sand-dark rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-sand/10">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[80px] font-bold text-deep-blue uppercase tracking-widest text-[10px] pl-8 py-4">Imagen</TableHead>
                  <TableHead className="font-bold text-deep-blue uppercase tracking-widest text-[10px] py-4">Tour / ID</TableHead>
                  <TableHead className="font-bold text-deep-blue uppercase tracking-widest text-[10px] py-4">Categoría</TableHead>
                  <TableHead className="font-bold text-deep-blue uppercase tracking-widest text-[10px] py-4">Precio</TableHead>
                  <TableHead className="font-bold text-deep-blue uppercase tracking-widest text-[10px] py-4">Capacidad</TableHead>
                  <TableHead className="font-bold text-deep-blue uppercase tracking-widest text-[10px] pr-8 text-right py-4">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center gap-4 text-muted-foreground">
                        <div className="w-8 h-8 rounded-full border-4 border-gold border-t-transparent animate-spin" />
                        Cargando tours...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredTours.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center text-muted-foreground">
                      No se encontraron tours.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTours.map((tour) => (
                    <TableRow key={tour.id} className="hover:bg-sand/10 group transition-colors">
                      <TableCell className="pl-8 py-6">
                        <div className="w-20 h-14 rounded-lg overflow-hidden shadow-sm border border-sand-dark">
                          <img src={tour.image} alt={tour.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-deep-blue text-sm leading-none mb-1.5">{tour.name}</span>
                          <span className="text-[11px] font-mono text-muted-foreground uppercase leading-none">{tour.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        <Badge variant="outline" className="bg-white border-sand-dark capitalize text-xs tracking-tight font-medium text-deep-blue/70">
                          {tour.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-6 font-bold text-gold-dark text-base">${tour.price}</TableCell>
                      <TableCell className="py-6 text-sm text-muted-foreground">{tour.maxPax} pax</TableCell>
                      <TableCell className="pr-8 text-right py-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/tour/${tour.id}`}>
                            <Button variant="ghost" size="icon" className="hover:bg-gold/10 text-muted-foreground hover:text-gold-dark rounded-full">
                              <ExternalLink className="w-5 h-5" />
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="hover:bg-sand/50 rounded-full">
                                <MoreHorizontal className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-sand-dark">
                              <Link href={`/admin/tours/edit/${tour.id}`}>
                                <DropdownMenuItem className="py-3 px-4 flex items-center gap-3 cursor-pointer hover:bg-sand/30">
                                  <Edit2 className="w-4 h-4 text-deep-blue" /> Editar información
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem
                                onClick={() => {
                                  if (confirm("¿Estás seguro de eliminar este tour?")) {
                                    deleteMutation.mutate(tour.id);
                                  }
                                }}
                                className="py-3 px-4 flex items-center gap-3 cursor-pointer text-red-500 hover:bg-red-50 focus:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" /> Eliminar permanentemente
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
