import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, X, Save, ShieldAlert, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useLang } from "@/contexts/LangContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type ProductCategory = Database["public"]["Enums"]["product_category"];

type ProductForm = {
  name: string;
  description: string;
  price: string;
  category: ProductCategory;
  stock: string;
  badge: string;
  image_url: string;
  is_active: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  category: "vinili",
  stock: "0",
  badge: "",
  image_url: "",
  is_active: true,
};

const categories: ProductCategory[] = ["vinili", "streetwear", "gadgets"];

const Admin = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useAdmin();
  const { t } = useLang();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        category: form.category,
        stock: parseInt(form.stock),
        badge: form.badge || null,
        image_url: form.image_url || null,
        is_active: form.is_active,
      };
      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingId ? "Prodotto aggiornato!" : "Prodotto creato!");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Prodotto eliminato!");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: urlData.publicUrl }));
      toast.success("Immagine caricata!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Errore upload");
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (product: typeof products[0]) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      badge: product.badge || "",
      image_url: product.image_url || "",
      is_active: product.is_active,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  if (!user) return <Navigate to="/auth" replace />;

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShieldAlert className="h-16 w-16 text-destructive mx-auto" />
          <h1 className="font-display text-3xl font-bold text-foreground">ACCESSO NEGATO</h1>
          <p className="text-muted-foreground font-mono text-sm">Non hai i permessi per accedere a questa pagina.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">ADMIN</h1>
            <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono mt-2">GESTIONE PRODOTTI</p>
          </div>
          <Button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs tracking-[0.2em] rounded-none gap-2"
          >
            <Plus className="h-4 w-4" /> NUOVO PRODOTTO
          </Button>
        </div>

        {/* Product Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={resetForm}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    {editingId ? "MODIFICA PRODOTTO" : "NUOVO PRODOTTO"}
                  </h2>
                  <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">NOME *</label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-background border-border font-mono text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">DESCRIZIONE</label>
                    <Textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="bg-background border-border font-mono text-sm min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">PREZZO (€) *</label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="bg-background border-border font-mono text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">STOCK *</label>
                      <Input
                        type="number"
                        min="0"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                        className="bg-background border-border font-mono text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">CATEGORIA *</label>
                      <div className="flex gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setForm({ ...form, category: cat })}
                            className={`flex-1 text-[10px] tracking-[0.15em] font-mono py-2 border transition-all ${
                              form.category === cat
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground hover:border-foreground"
                            }`}
                          >
                            {cat.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">BADGE</label>
                      <Input
                        value={form.badge}
                        onChange={(e) => setForm({ ...form, badge: e.target.value })}
                        placeholder="es. NEW, LIMITED"
                        className="bg-background border-border font-mono text-sm"
                      />
                    </div>
                  </div>

                  {/* Image upload */}
                  <div>
                    <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">IMMAGINE</label>
                    <div className="flex items-center gap-4">
                      {form.image_url && (
                        <img src={form.image_url} alt="" className="w-16 h-16 object-cover border border-border" />
                      )}
                      <label className="flex-1 border border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary cursor-pointer flex items-center justify-center gap-2 py-4 transition-colors">
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                        <span className="text-xs font-mono tracking-wider">
                          {uploading ? "CARICAMENTO..." : "CARICA IMMAGINE"}
                        </span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                      </label>
                    </div>
                    {form.image_url && (
                      <Input
                        value={form.image_url}
                        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                        className="bg-background border-border font-mono text-xs mt-2"
                        placeholder="URL immagine"
                      />
                    )}
                  </div>

                  {/* Active toggle */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, is_active: !form.is_active })}
                      className={`w-10 h-5 rounded-full transition-colors relative ${form.is_active ? "bg-primary" : "bg-muted"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.is_active ? "left-5" : "left-0.5"}`} />
                    </button>
                    <span className="text-xs font-mono tracking-[0.2em] text-muted-foreground">
                      {form.is_active ? "ATTIVO" : "DISATTIVATO"}
                    </span>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={saveMutation.isPending}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs tracking-[0.2em] rounded-none py-5 gap-2"
                    >
                      {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {editingId ? "AGGIORNA" : "CREA PRODOTTO"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="border-border font-mono text-xs tracking-[0.2em] rounded-none"
                    >
                      ANNULLA
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Table */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="border border-border">
            {/* Header */}
            <div className="hidden md:grid grid-cols-[1fr_120px_80px_80px_80px_100px] gap-4 px-6 py-3 bg-secondary text-muted-foreground text-[10px] tracking-[0.2em] font-mono border-b border-border">
              <span>PRODOTTO</span>
              <span>CATEGORIA</span>
              <span>PREZZO</span>
              <span>STOCK</span>
              <span>STATO</span>
              <span className="text-right">AZIONI</span>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-mono text-sm">
                Nessun prodotto. Crea il primo!
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_120px_80px_80px_80px_100px] gap-4 px-6 py-4 border-b border-border items-center hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {product.image_url && (
                      <img src={product.image_url} alt="" className="w-10 h-10 object-cover border border-border hidden sm:block" />
                    )}
                    <div>
                      <p className="text-foreground text-sm font-display font-semibold">{product.name}</p>
                      {product.badge && (
                        <Badge className="bg-primary/20 text-primary text-[8px] tracking-wider font-mono rounded-none mt-1">
                          {product.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className="text-muted-foreground text-xs font-mono tracking-wider">{product.category.toUpperCase()}</span>
                  <span className="text-foreground font-mono text-sm font-bold">€{Number(product.price).toFixed(2)}</span>
                  <span className="text-muted-foreground font-mono text-sm">{product.stock}</span>
                  <span>
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${product.is_active ? "bg-primary" : "bg-destructive"}`} />
                    <span className="text-[10px] font-mono tracking-wider text-muted-foreground">
                      {product.is_active ? "ON" : "OFF"}
                    </span>
                  </span>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => startEdit(product)}
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      title="Modifica"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Eliminare questo prodotto?")) deleteMutation.mutate(product.id);
                      }}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      title="Elimina"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <p className="text-muted-foreground text-[10px] tracking-[0.2em] font-mono mt-6 text-center">
          {products.length} PRODOTTI TOTALI
        </p>
      </div>
    </div>
  );
};

export default Admin;
