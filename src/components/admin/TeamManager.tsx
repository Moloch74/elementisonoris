import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, X, Save, Loader2, Image as ImageIcon, ArrowUp, ArrowDown, Eye, EyeOff, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type FormState = {
  name: string;
  role: string;
  bio: string;
  image_url: string;
  sort_order: string;
  is_active: boolean;
};

const emptyForm: FormState = { name: "", role: "", bio: "", image_url: "", sort_order: "0", is_active: true };

const TeamManager = () => {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [uploading, setUploading] = useState(false);

  const { data: members = [] } = useQuery({
    queryKey: ["admin-team"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_members").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-team"] });
    qc.invalidateQueries({ queryKey: ["public-team"] });
  };

  const saveMut = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        role: form.role,
        bio: form.bio || null,
        image_url: form.image_url || null,
        sort_order: parseInt(form.sort_order) || 0,
        is_active: form.is_active,
      };
      if (editingId) {
        const { error } = await supabase.from("team_members").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("team_members").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingId ? "Membro aggiornato!" : "Membro creato!");
      invalidate();
      reset();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("team_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Membro eliminato!"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("team_members").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidate(),
    onError: (e: Error) => toast.error(e.message),
  });

  const reorder = useMutation({
    mutationFn: async ({ id, sort_order }: { id: string; sort_order: number }) => {
      const { error } = await supabase.from("team_members").update({ sort_order }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => invalidate(),
    onError: (e: Error) => toast.error(e.message),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("team-avatars").upload(path, file, { contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from("team-avatars").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
      toast.success("Foto caricata!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Errore upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const startEdit = (m: TeamMember) => {
    setEditingId(m.id);
    setForm({
      name: m.name, role: m.role, bio: m.bio || "",
      image_url: m.image_url || "", sort_order: String(m.sort_order), is_active: m.is_active,
    });
    setShowForm(true);
  };

  const reset = () => { setForm(emptyForm); setEditingId(null); setShowForm(false); };

  const move = (m: TeamMember, dir: -1 | 1) => {
    const sorted = [...members].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((x) => x.id === m.id);
    const target = sorted[idx + dir];
    if (!target) return;
    reorder.mutate({ id: m.id, sort_order: target.sort_order });
    reorder.mutate({ id: target.id, sort_order: m.sort_order });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground text-xs font-mono tracking-[0.2em]">{members.length} MEMBRI</p>
        <Button onClick={() => { reset(); setShowForm(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs tracking-[0.2em] rounded-none gap-2">
          <Plus className="h-4 w-4" /> NUOVO MEMBRO
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {members.map((m, idx) => (
          <div key={m.id} className={`border bg-card flex flex-col ${m.is_active ? "border-border" : "border-border/40 opacity-60"}`}>
            <div className="aspect-square bg-secondary/40 border-b border-border flex items-center justify-center overflow-hidden">
              {m.image_url
                ? <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
                : <User className="h-12 w-12 text-muted-foreground" strokeWidth={1} />}
            </div>
            <div className="p-4 flex-1 flex flex-col gap-2">
              <p className="text-[9px] tracking-[0.2em] font-mono text-primary">[{String(idx + 1).padStart(2, "0")}] · ORDINE {m.sort_order}</p>
              <h3 className="font-display text-base font-bold leading-tight uppercase">{m.name}</h3>
              <p className="text-muted-foreground text-[10px] tracking-[0.2em] font-mono">{m.role}</p>
              {m.bio && <p className="text-muted-foreground text-xs font-mono line-clamp-2">{m.bio}</p>}
              <div className="flex items-center gap-1 mt-auto pt-3 border-t border-border">
                <button onClick={() => move(m, -1)} title="Sposta su" className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><ArrowUp className="h-3.5 w-3.5" /></button>
                <button onClick={() => move(m, 1)} title="Sposta giù" className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><ArrowDown className="h-3.5 w-3.5" /></button>
                <button onClick={() => toggleActive.mutate({ id: m.id, is_active: !m.is_active })} title={m.is_active ? "Nascondi" : "Mostra"} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  {m.is_active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
                <button onClick={() => startEdit(m)} title="Modifica" className="p-1.5 text-muted-foreground hover:text-primary transition-colors ml-auto"><Edit className="h-3.5 w-3.5" /></button>
                <button onClick={() => { if (confirm(`Eliminare ${m.name}?`)) deleteMut.mutate(m.id); }} title="Elimina" className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <div className="col-span-full border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground text-xs font-mono tracking-[0.2em]">NESSUN MEMBRO. AGGIUNGINE UNO.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={reset}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="bg-card border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground">{editingId ? "MODIFICA MEMBRO" : "NUOVO MEMBRO"}</h2>
                <button onClick={reset} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); saveMut.mutate(); }} className="space-y-4">
                <div>
                  <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">FOTO / AVATAR</label>
                  <div className="flex items-center gap-4">
                    {form.image_url
                      ? <img src={form.image_url} alt="" className="w-20 h-20 object-cover border border-border" />
                      : <div className="w-20 h-20 border border-border bg-secondary/40 flex items-center justify-center"><User className="h-8 w-8 text-muted-foreground" /></div>}
                    <label className="flex-1 border border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary cursor-pointer flex items-center justify-center gap-2 py-4 transition-colors">
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                      <span className="text-xs font-mono tracking-wider">{uploading ? "CARICAMENTO..." : (form.image_url ? "SOSTITUISCI FOTO" : "CARICA FOTO")}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">NOME *</label>
                  <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-background border-border font-mono rounded-none" placeholder="Mario Rossi" />
                </div>
                <div>
                  <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">RUOLO *</label>
                  <Input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="bg-background border-border font-mono rounded-none" placeholder="FOUNDER / SELECTOR" />
                </div>
                <div>
                  <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">BIO (opzionale)</label>
                  <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="bg-background border-border font-mono rounded-none min-h-[80px]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">ORDINE</label>
                    <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="bg-background border-border font-mono rounded-none" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer h-10">
                      <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-primary" />
                      <span className="text-xs font-mono tracking-[0.2em] text-foreground">VISIBILE</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={saveMut.isPending} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs tracking-[0.2em] rounded-none py-5 gap-2">
                    {saveMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {editingId ? "AGGIORNA" : "CREA MEMBRO"}
                  </Button>
                  <Button type="button" variant="outline" onClick={reset} className="border-border font-mono text-xs tracking-[0.2em] rounded-none">ANNULLA</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TeamManager;
