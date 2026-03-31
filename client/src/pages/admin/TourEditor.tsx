import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTourSchema } from "@server/db/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, ArrowLeft, Image as ImageIcon, Plus, Trash2, Loader2, Upload } from "lucide-react";
import { useState, useEffect } from "react";

// Extension for form handling since inclusions are JSON strings in DB
const formSchema = z.object({
  id: z.string().min(3),
  name: z.string().min(3),
  category: z.string(),
  price: z.coerce.number().min(0),
  duration: z.string(),
  maxPax: z.coerce.number().min(1),
  description: z.string().min(10),
  shortDescription: z.string().min(5),
  image: z.string(),
  difficulty: z.string().optional(),
  available: z.string(),
  meetingPoint: z.string().optional(),
  includes: z.array(z.string()),
  notIncludes: z.array(z.string()),
  whatToBring: z.array(z.string()),
  quote: z.string().optional(),
  gallery: z.array(z.string()).length(6),
});

type FormData = z.infer<typeof formSchema>;

export default function TourEditor() {
  const { id } = useParams<{ id?: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const isEditing = id !== "new";

  const { data: tours = [] } = useQuery<any[]>({
    queryKey: ["/api/tours"],
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  const tour = isEditing ? tours.find((t) => t.id === id) : null;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      id: "",
      name: "",
      category: "",
      price: 0,
      duration: "4 horas",
      maxPax: 15,
      description: "",
      shortDescription: "",
      image: "",
      difficulty: "Fácil",
      available: "Todo el año",
      meetingPoint: "",
      includes: [],
      notIncludes: [],
      whatToBring: [],
      quote: "",
      gallery: ["", "", "", "", "", ""],
    },
  });

  useEffect(() => {
    if (tour) {
      form.reset({
        ...tour,
        difficulty: tour.difficulty || "Fácil",
        meetingPoint: tour.meetingPoint || "",
      });
    }
  }, [tour, form]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const url = isEditing ? `/api/admin/tours/${id}` : "/api/admin/tours";
      const method = isEditing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Could not save tour");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tours"] });
      toast.success(isEditing ? "Tour actualizado" : "Tour creado");
      setLocation("/admin/tours");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "gallery", index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      
      if (field === "image") {
        form.setValue("image", data.url);
      } else if (field === "gallery" && index !== undefined) {
        const current = form.getValues("gallery");
        const updated = [...current];
        updated[index] = data.url;
        form.setValue("gallery", updated);
      }
      
      toast.success("Imagen subida");
    } catch (err) {
      toast.error("Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleListChange = (field: "includes" | "notIncludes" | "whatToBring", index: number, value: string) => {
    const current = form.getValues(field);
    const updated = [...current];
    updated[index] = value;
    form.setValue(field, updated);
  };

  const addListItem = (field: "includes" | "notIncludes" | "whatToBring") => {
    const current = form.getValues(field);
    form.setValue(field, [...current, ""]);
  };

  const removeListItem = (field: "includes" | "notIncludes" | "whatToBring", index: number) => {
    const current = form.getValues(field);
    form.setValue(field, current.filter((_, i) => i !== index));
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/tours")} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-deep-blue tracking-tight">{isEditing ? "Editar Tour" : "Crear Nuevo Tour"}</h1>
          <p className="text-muted-foreground">{isEditing ? `Modificando: ${tour?.name}` : "Completa la información para publicar un nuevo tour"}</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data as FormData))} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* General Info */}
            <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-sand/20 border-b py-6 px-8">
                <CardTitle className="text-lg font-bold text-deep-blue capitalize">Información Principal</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Identificador Único (ID)</Label>
                    <Input {...form.register("id")} disabled={isEditing} placeholder="ej. surf-101-pro" className="bg-sand/10 border-sand-dark" />
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Este ID se usa en la URL</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre del Tour</Label>
                    <Input {...form.register("name")} placeholder="Nombre comercial" className="bg-sand/10 border-sand-dark font-semibold" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Breve Descripción (Listado)</Label>
                  <Input {...form.register("shortDescription")} placeholder="Resumen corto para el catálogo" className="bg-sand/10 border-sand-dark" />
                </div>

                <div className="space-y-2">
                  <Label>Descripción Completa (Storytelling)</Label>
                  <Textarea {...form.register("description")} placeholder="Cuenta la experiencia..." className="min-h-[200px] bg-sand/10 border-sand-dark leading-relaxed" />
                </div>

                <div className="space-y-2">
                  <Label>Cita Inspiradora (Inspirational Quote)</Label>
                  <Input {...form.register("quote")} placeholder="ej. El viento y las olas no esperan..." className="bg-sand/10 border-sand-dark italic" />
                </div>
              </CardContent>
            </Card>

            {/* Gallery Sections */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-deep-blue px-2">Galería de Imágenes (6 Slots)</h3>
              
              {/* Experience Gallery */}
              <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gold/10 border-b py-4 px-8">
                  <CardTitle className="text-sm font-bold text-deep-blue">Sección: La Experiencia (2 imágenes)</CardTitle>
                </CardHeader>
                <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[0, 1].map((idx) => (
                    <div key={idx} className="space-y-4">
                      <div className="aspect-video bg-sand/30 rounded-xl overflow-hidden border-2 border-dashed border-sand-dark flex items-center justify-center relative group">
                        {form.watch("gallery")[idx] ? (
                          <img src={form.watch("gallery")[idx]} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4">
                            <ImageIcon className="w-8 h-8 text-sand-dark mx-auto mb-1" />
                            <p className="text-[10px] text-muted-foreground uppercase">Slot {idx + 1}</p>
                          </div>
                        )}
                        <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/40 text-white font-bold text-xs">
                          {form.watch("gallery")[idx] ? "Cambiar" : "Subir"}
                          <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "gallery", idx)} accept="image/*" />
                        </label>
                      </div>
                      <Input value={form.watch("gallery")[idx]} onChange={(e) => {
                        const updated = [...form.getValues("gallery")];
                        updated[idx] = e.target.value;
                        form.setValue("gallery", updated);
                      }} placeholder="URL de la imagen" className="text-[10px] border-sand-dark h-8" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Detail Gallery */}
              <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gold/10 border-b py-4 px-8">
                  <CardTitle className="text-sm font-bold text-deep-blue">Sección: Detalles (3 imágenes)</CardTitle>
                </CardHeader>
                <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[2, 3, 4].map((idx) => (
                    <div key={idx} className="space-y-4">
                      <div className="aspect-video bg-sand/30 rounded-xl overflow-hidden border-2 border-dashed border-sand-dark flex items-center justify-center relative group">
                        {form.watch("gallery")[idx] ? (
                          <img src={form.watch("gallery")[idx]} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-2">
                            <ImageIcon className="w-6 h-6 text-sand-dark mx-auto mb-1" />
                            <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">Slot {idx + 1}</p>
                          </div>
                        )}
                        <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/40 text-white font-bold text-[10px]">
                          {form.watch("gallery")[idx] ? "Cambiar" : "Subir"}
                          <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "gallery", idx)} accept="image/*" />
                        </label>
                      </div>
                      <Input value={form.watch("gallery")[idx]} onChange={(e) => {
                        const updated = [...form.getValues("gallery")];
                        updated[idx] = e.target.value;
                        form.setValue("gallery", updated);
                      }} placeholder="URL" className="text-[10px] border-sand-dark h-8" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Footer Gallery */}
              <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gold/10 border-b py-4 px-8">
                  <CardTitle className="text-sm font-bold text-deep-blue">Sección: Sobre Playa Caracol (1 imagen)</CardTitle>
                </CardHeader>
                <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="aspect-video bg-sand/30 rounded-xl overflow-hidden border-2 border-dashed border-sand-dark flex items-center justify-center relative group">
                      {form.watch("gallery")[5] ? (
                        <img src={form.watch("gallery")[5]} alt="Gallery 5" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="w-8 h-8 text-sand-dark mx-auto mb-1" />
                          <p className="text-[10px] text-muted-foreground uppercase">Imagen de Ubicación</p>
                        </div>
                      )}
                      <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/40 text-white font-bold text-xs">
                        {form.watch("gallery")[5] ? "Cambiar" : "Subir"}
                        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "gallery", 5)} accept="image/*" />
                      </label>
                    </div>
                    <Input value={form.watch("gallery")[5]} onChange={(e) => {
                      const updated = [...form.getValues("gallery")];
                      updated[5] = e.target.value;
                      form.setValue("gallery", updated);
                    }} placeholder="URL de la imagen" className="text-[10px] border-sand-dark h-8" />
                  </div>
                  <div className="flex items-center">
                    <p className="text-xs text-muted-foreground italic">
                      TIP: Esta imagen aparece junto al texto descriptivo de Playa Caracol en la parte inferior de la página.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Inclusions / Exclusions */}
            <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-sand/20 border-b py-6 px-8">
                <CardTitle className="text-lg font-bold text-deep-blue capitalize">Detalles de la Experiencia</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Includes */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-deep-blue font-bold">¿Qué incluye?</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addListItem("includes")} className="border-gold text-gold-dark hover:bg-gold/10 text-xs gap-1.5 rounded-full px-4">
                      <Plus className="w-3 h-3" /> Añadir ítem
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {form.watch("includes").map((include, i) => (
                      <div key={i} className="flex gap-2">
                        <Input value={include} onChange={(e) => handleListChange("includes", i, e.target.value)} className="bg-sand/5 border-sand-dark text-sm" placeholder="ej. Equipo completo" />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeListItem("includes", i)} className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Not Includes */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-deep-blue font-bold">No incluye</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addListItem("notIncludes")} className="border-sand-dark text-muted-foreground hover:bg-sand/10 text-xs gap-1.5 rounded-full px-4">
                      <Plus className="w-3 h-3" /> Añadir ítem
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {form.watch("notIncludes").map((item, i) => (
                      <div key={i} className="flex gap-2">
                        <Input value={item} onChange={(e) => handleListChange("notIncludes", i, e.target.value)} className="bg-sand/5 border-sand-dark text-sm" placeholder="ej. Almuerzo" />
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeListItem("notIncludes", i)} className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Image Preview & Upload */}
            <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-deep-blue py-6 px-8 text-white">
                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-gold" /> Imagen Principal
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <div className="aspect-video bg-sand/30 rounded-xl overflow-hidden border-2 border-dashed border-sand-dark flex items-center justify-center relative group">
                  {form.watch("image") ? (
                    <img src={form.watch("image")} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6">
                      <ImageIcon className="w-10 h-10 text-sand-dark mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Sube una imagen o ingresa una URL</p>
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    </div>
                  )}
                  <label className="absolute inset-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/40 text-white font-bold text-sm">
                    Cambiar Imagen
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, "image")} accept="image/*" />
                  </label>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Ruta Directa</Label>
                  <Input {...form.register("image")} placeholder="/uploads/..." className="text-xs border-sand-dark" />
                </div>
              </CardContent>
            </Card>

            {/* Sidebar Params */}
            <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-sand/20 border-b py-6 px-8">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-deep-blue">Parámetros</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Categoría</Label>
                    <Select value={form.watch("category")} onValueChange={(val) => form.setValue("category", val)}>
                      <SelectTrigger className="bg-sand/5 border-sand-dark">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-sand-dark">
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id} className="cursor-pointer py-3">{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Precio ($)</Label>
                    <Input type="number" {...form.register("price")} className="bg-sand/5 border-sand-dark text-lg font-bold text-gold-dark" />
                  </div>

                  <div className="space-y-2">
                    <Label>Máximo Pax</Label>
                    <Input type="number" {...form.register("maxPax")} className="bg-sand/5 border-sand-dark" />
                  </div>

                  <div className="space-y-2">
                    <Label>Disponibilidad</Label>
                    <Input {...form.register("available")} placeholder="ej. Todo el año" className="bg-sand/5 border-sand-dark" />
                  </div>
                </div>

                <div className="pt-6 border-t border-sand-dark flex flex-col gap-3">
                  <Button type="submit" disabled={mutation.isPending} className="w-full bg-deep-blue hover:bg-ocean text-white font-bold py-6 rounded-xl transition-all flex items-center gap-2">
                    {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Guardar Tour
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setLocation("/admin/tours")} className="text-muted-foreground hover:bg-sand/50 rounded-xl">
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
