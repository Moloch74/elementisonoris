import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, X, Save, Loader2, Image as ImageIcon, ArrowUp, ArrowDown, Eye, EyeOff, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type GalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  is_active: boolean;
};

const GalleryManager = () => {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editOrder, setEditOrder] = useState("0");

  const { data: images = [] } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_images").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data as GalleryImage[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-gallery"] });
    qc.invalidateQueries({ queryKey: ["public-gallery"] });
  };

  const insertMut = useMutation({
    mutationFn: async (image_url: string) => {
      const nextOrder = (images[images.length - 1]?.sort_order ?? -1) + 1;
      const { error } = await supabase.from("gallery_images").insert({ image_url, sort_order: nextOrder });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Foto aggiunta!"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, ...payload }: Partial<GalleryImage> & { id: string }) => {
      const { error } = await supabase.from("gallery_images").update(payload).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Foto eliminata!"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const ext = file.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("gallery").upload(path, file, { contentType: file.type });
        if (error) throw error;
        const { data } = supabase.storage.from("gallery").getPublicUrl(path);
        await insertMut.mutateAsync(data.publicUrl);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Errore upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const move = (img: GalleryImage, dir: -1 | 1) => {
    const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((x) => x.id === img.id);
    const target = sorted[idx + dir];
    if (!target) return;
    updateMut.mutate({ id: img.id, sort_order: target.sort_order });
    updateMut.mutate({ id: target.id, sort_order: img.sort_order });
  };

  const openEdit = (img: GalleryImage) => {
    setEditing(img);
    setEditCaption(img.caption || "");
    setEditOrder(String(img.sort_order));
  };

  const saveEdit = () => {
    if (!editing) return;
    updateMut.mutate({ id: editing.id, caption: editCaption || null, sort_order: parseInt(editOrder) || 0 });
    setEditing(null);
    toast.success("Foto aggiornata!");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-muted-foreground text-xs font-mono tracking-[0.2em]">{images.length} FOTO</p>
        <label className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs tracking-[0.2em] rounded-none gap-2 inline-flex items-center justify-center px-4 py-2 cursor-pointer">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {uploading ? "CARICAMENTO..." : "CARICA FOTO (multiple)"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <div key={img.id} className={`border bg-card group relative ${img.is_active ? "border-border" : "border-border/40 opacity-60"}`}>
            <div className="aspect-square bg-secondary/40 overflow-hidden">
              <img src={img.image_url} alt={img.caption || ""} className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-1 left-1 bg-background/80 backdrop-blur-sm border border-border px-1.5 py-0.5">
              <span className="text-[9px] tracking-[0.15em] font-mono text-primary">[{String(idx + 1).padStart(2, "0")}]</span>
            </div>
            <div className="p-2 flex items-center gap-0.5 border-t border-border">
              <button onClick={() => move(img, -1)} title="Sposta su" className="p-1 text-muted-foreground hover:text-primary transition-colors"><ArrowUp className="h-3 w-3" /></button>
              <button onClick={() => move(img, 1)} title="Sposta giù" className="p-1 text-muted-foreground hover:text-primary transition-colors"><ArrowDown className="h-3 w-3" /></button>
              <button onClick={() => updateMut.mutate({ id: img.id, is_active: !img.is_active })} title={img.is_active ? "Nascondi" : "Mostra"} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                {img.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </button>
              <button onClick={() => openEdit(img)} title="Modifica didascalia" className="p-1 text-muted-foreground hover:text-primary transition-colors ml-auto"><Edit className="h-3 w-3" /></button>
              <button onClick={() => { if (confirm("Eliminare questa foto?")) deleteMut.mutate(img.id); }} title="Elimina" className="p-1 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3 w-3" /></button>
            </div>
            {img.caption && <p className="px-2 pb-2 text-[10px] font-mono text-muted-foreground line-clamp-2">{img.caption}</p>}
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full border border-dashed border-border p-12 text-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" strokeWidth={1} />
            <p className="text-muted-foreground text-xs font-mono tracking-[0.2em]">NESSUNA FOTO. CARICA LE PRIME.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="bg-card border border-border w-full max-w-md p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-foreground">MODIFICA FOTO</h2>
                <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
              </div>
              <img src={editing.image_url} alt="" className="w-full aspect-square object-cover border border-border mb-4" />
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">DIDASCALIA (opzionale)</label>
                  <Input value={editCaption} onChange={(e) => setEditCaption(e.target.value)} className="bg-background border-border font-mono rounded-none" />
                </div>
                <div>
                  <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">ORDINE</label>
                  <Input type="number" value={editOrder} onChange={(e) => setEditOrder(e.target.value)} className="bg-background border-border font-mono rounded-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={saveEdit} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs tracking-[0.2em] rounded-none py-5 gap-2">
                    <Save className="h-4 w-4" /> SALVA
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(null)} className="border-border font-mono text-xs tracking-[0.2em] rounded-none">ANNULLA</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GalleryManager;
