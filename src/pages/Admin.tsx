import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, Loader2, X, Save, ShieldAlert,
  Image as ImageIcon, Package, Users, ShoppingBag, BarChart3,
  Eye, ChevronDown, ChevronUp,
} from "lucide-react";
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
type OrderStatus = Database["public"]["Enums"]["order_status"];

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
  name: "", description: "", price: "", category: "vinili",
  stock: "0", badge: "", image_url: "", is_active: true,
};

const categories: ProductCategory[] = ["vinili", "streetwear", "gadgets"];
const orderStatuses: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  paid: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

type Tab = "overview" | "products" | "orders" | "customers";

const Admin = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useAdmin();
  const { t } = useLang();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // ─── Queries ───
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: orderItems = [] } = useQuery({
    queryKey: ["admin-order-items"],
    enabled: isAdmin && orders.length > 0,
    queryFn: async () => {
      const ids = orders.map((o) => o.id);
      const { data, error } = await supabase.from("order_items").select("*, products(name, image_url)").in("order_id", ids);
      if (error) throw error;
      return data;
    },
  });

  const { data: profiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ["admin-profiles"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // ─── Mutations ───
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

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Stato ordine aggiornato!");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ─── Helpers ───
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
      name: product.name, description: product.description || "",
      price: String(product.price), category: product.category,
      stock: String(product.stock), badge: product.badge || "",
      image_url: product.image_url || "", is_active: product.is_active,
    });
    setShowForm(true);
  };

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(false); };

  // ─── Guards ───
  if (!user) return <Navigate to="/auth" replace />;
  if (roleLoading) return (
    <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
  if (!isAdmin) return (
    <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
      <div className="text-center space-y-4">
        <ShieldAlert className="h-16 w-16 text-destructive mx-auto" />
        <h1 className="font-display text-3xl font-bold text-foreground">ACCESSO NEGATO</h1>
        <p className="text-muted-foreground font-mono text-sm">Non hai i permessi per accedere a questa pagina.</p>
      </div>
    </div>
  );

  // ─── Stats ───
  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0);
  const activeProducts = products.filter(p => p.is_active).length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "DASHBOARD", icon: <BarChart3 className="h-4 w-4" /> },
    { key: "products", label: "PRODOTTI", icon: <Package className="h-4 w-4" /> },
    { key: "orders", label: "ORDINI", icon: <ShoppingBag className="h-4 w-4" /> },
    { key: "customers", label: "CLIENTI", icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">ADMIN</h1>
          <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono mt-2">PANNELLO DI GESTIONE</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border border-border mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 text-[10px] tracking-[0.2em] font-mono font-bold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ═══════════════ OVERVIEW ═══════════════ */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "PRODOTTI ATTIVI", value: activeProducts, icon: <Package className="h-5 w-5" /> },
                { label: "ORDINI TOTALI", value: orders.length, icon: <ShoppingBag className="h-5 w-5" /> },
                { label: "IN ATTESA", value: pendingOrders, icon: <Loader2 className="h-5 w-5" /> },
                { label: "FATTURATO", value: `€${totalRevenue.toFixed(2)}`, icon: <BarChart3 className="h-5 w-5" /> },
              ].map((stat, i) => (
                <div key={i} className="border border-border bg-card p-5 space-y-2">
                  <div className="text-muted-foreground">{stat.icon}</div>
                  <p className="text-2xl md:text-3xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-[9px] tracking-[0.2em] font-mono text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-border bg-card p-5">
                <h3 className="text-xs tracking-[0.2em] font-mono font-bold text-foreground mb-4">CLIENTI REGISTRATI</h3>
                <p className="text-3xl font-display font-bold text-foreground">{profiles.length}</p>
                <button onClick={() => setActiveTab("customers")} className="text-[10px] tracking-[0.2em] font-mono text-primary mt-3 hover:underline">
                  VEDI TUTTI →
                </button>
              </div>
              <div className="border border-border bg-card p-5">
                <h3 className="text-xs tracking-[0.2em] font-mono font-bold text-foreground mb-4">ULTIMI ORDINI</h3>
                {orders.slice(0, 3).map((o) => (
                  <div key={o.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="text-xs font-mono text-muted-foreground">{o.email || "N/A"}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-foreground">€{Number(o.total).toFixed(2)}</span>
                      <Badge className={`${statusColors[o.status]} text-[8px] tracking-wider font-mono rounded-none border-0`}>
                        {o.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
                {orders.length > 3 && (
                  <button onClick={() => setActiveTab("orders")} className="text-[10px] tracking-[0.2em] font-mono text-primary mt-3 hover:underline">
                    VEDI TUTTI →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════ PRODUCTS ═══════════════ */}
        {activeTab === "products" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground text-xs font-mono tracking-[0.2em]">{products.length} PRODOTTI</p>
              <Button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs tracking-[0.2em] rounded-none gap-2"
              >
                <Plus className="h-4 w-4" /> NUOVO PRODOTTO
              </Button>
            </div>

            {productsLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="border border-border">
                <div className="hidden md:grid grid-cols-[1fr_120px_80px_80px_80px_100px] gap-4 px-6 py-3 bg-secondary text-muted-foreground text-[10px] tracking-[0.2em] font-mono border-b border-border">
                  <span>PRODOTTO</span><span>CATEGORIA</span><span>PREZZO</span><span>STOCK</span><span>STATO</span><span className="text-right">AZIONI</span>
                </div>
                {products.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground font-mono text-sm">Nessun prodotto. Crea il primo!</div>
                ) : products.map((product) => (
                  <div key={product.id} className="grid grid-cols-1 md:grid-cols-[1fr_120px_80px_80px_80px_100px] gap-4 px-6 py-4 border-b border-border items-center hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {product.image_url && <img src={product.image_url} alt="" className="w-10 h-10 object-cover border border-border hidden sm:block" />}
                      <div>
                        <p className="text-foreground text-sm font-display font-semibold">{product.name}</p>
                        {product.badge && <Badge className="bg-primary/20 text-primary text-[8px] tracking-wider font-mono rounded-none mt-1">{product.badge}</Badge>}
                      </div>
                    </div>
                    <span className="text-muted-foreground text-xs font-mono tracking-wider">{product.category.toUpperCase()}</span>
                    <span className="text-foreground font-mono text-sm font-bold">€{Number(product.price).toFixed(2)}</span>
                    <span className="text-muted-foreground font-mono text-sm">{product.stock}</span>
                    <span>
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${product.is_active ? "bg-primary" : "bg-destructive"}`} />
                      <span className="text-[10px] font-mono tracking-wider text-muted-foreground">{product.is_active ? "ON" : "OFF"}</span>
                    </span>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(product)} className="p-2 text-muted-foreground hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => { if (confirm("Eliminare questo prodotto?")) deleteMutation.mutate(product.id); }} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════ ORDERS ═══════════════ */}
        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-muted-foreground text-xs font-mono tracking-[0.2em] mb-6">{orders.length} ORDINI TOTALI</p>

            {ordersLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-mono text-sm">Nessun ordine ricevuto.</div>
            ) : (
              <div className="space-y-0 border border-border">
                <div className="hidden md:grid grid-cols-[1fr_140px_100px_120px_120px] gap-4 px-6 py-3 bg-secondary text-muted-foreground text-[10px] tracking-[0.2em] font-mono border-b border-border">
                  <span>CLIENTE</span><span>DATA</span><span>TOTALE</span><span>STATO</span><span className="text-right">AZIONI</span>
                </div>
                {orders.map((order) => {
                  const items = orderItems.filter((oi) => oi.order_id === order.id);
                  const isExpanded = expandedOrder === order.id;
                  return (
                    <div key={order.id} className="border-b border-border">
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_140px_100px_120px_120px] gap-4 px-6 py-4 items-center hover:bg-secondary/50 transition-colors">
                        <div>
                          <p className="text-foreground text-sm font-mono">{order.email || "N/A"}</p>
                          <p className="text-muted-foreground text-[10px] font-mono">{order.phone || ""}</p>
                        </div>
                        <span className="text-muted-foreground text-xs font-mono">
                          {new Date(order.created_at).toLocaleDateString("it-IT")}
                        </span>
                        <span className="text-foreground font-mono text-sm font-bold">€{Number(order.total).toFixed(2)}</span>
                        <div>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus.mutate({ id: order.id, status: e.target.value as OrderStatus })}
                            className="bg-background border border-border text-foreground text-[10px] font-mono tracking-wider px-2 py-1.5 w-full focus:outline-none focus:border-primary"
                          >
                            {orderStatuses.map((s) => (
                              <option key={s} value={s}>{s.toUpperCase()}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex justify-end">
                          <button onClick={() => setExpandedOrder(isExpanded ? null : order.id)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-secondary/30"
                          >
                            <div className="px-6 py-4 space-y-3">
                              <p className="text-[10px] font-mono tracking-[0.2em] text-muted-foreground">DETTAGLI ORDINE</p>
                              {order.shipping_address && (
                                <p className="text-xs font-mono text-muted-foreground">
                                  Indirizzo: {typeof order.shipping_address === "object" ? JSON.stringify(order.shipping_address) : String(order.shipping_address)}
                                </p>
                              )}
                              {items.length > 0 ? items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                                  <div className="flex-1">
                                    <p className="text-sm font-mono text-foreground">
                                      {(item as any).products?.name || item.product_id}
                                    </p>
                                    <p className="text-[10px] font-mono text-muted-foreground">
                                      {item.quantity}× €{Number(item.unit_price).toFixed(2)}
                                    </p>
                                  </div>
                                  <span className="text-sm font-mono font-bold text-foreground">
                                    €{(item.quantity * Number(item.unit_price)).toFixed(2)}
                                  </span>
                                </div>
                              )) : (
                                <p className="text-xs font-mono text-muted-foreground">Nessun articolo trovato.</p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════ CUSTOMERS ═══════════════ */}
        {activeTab === "customers" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-muted-foreground text-xs font-mono tracking-[0.2em] mb-6">{profiles.length} CLIENTI REGISTRATI</p>

            {profilesLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : profiles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-mono text-sm">Nessun cliente registrato.</div>
            ) : (
              <div className="border border-border">
                <div className="hidden md:grid grid-cols-[1fr_200px_120px] gap-4 px-6 py-3 bg-secondary text-muted-foreground text-[10px] tracking-[0.2em] font-mono border-b border-border">
                  <span>EMAIL</span><span>DATA REGISTRAZIONE</span><span>ORDINI</span>
                </div>
                {profiles.map((profile) => {
                  const customerOrders = orders.filter((o) => o.user_id === profile.user_id);
                  return (
                    <div key={profile.id} className="grid grid-cols-1 md:grid-cols-[1fr_200px_120px] gap-4 px-6 py-4 border-b border-border items-center hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-mono font-bold">
                          {(profile.email || "?")[0].toUpperCase()}
                        </div>
                        <span className="text-foreground text-sm font-mono">{profile.email || "N/A"}</span>
                      </div>
                      <span className="text-muted-foreground text-xs font-mono">
                        {new Date(profile.created_at).toLocaleDateString("it-IT")}
                      </span>
                      <span className="text-foreground font-mono text-sm font-bold">{customerOrders.length}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════ Product Form Modal ═══════════════ */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={resetForm}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold text-foreground">{editingId ? "MODIFICA PRODOTTO" : "NUOVO PRODOTTO"}</h2>
                  <button onClick={resetForm} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">NOME *</label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-background border-border font-mono text-sm" required />
                  </div>
                  <div>
                    <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">DESCRIZIONE</label>
                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-background border-border font-mono text-sm min-h-[80px] resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">PREZZO (€) *</label>
                      <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-background border-border font-mono text-sm" required />
                    </div>
                    <div>
                      <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">STOCK *</label>
                      <Input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="bg-background border-border font-mono text-sm" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">CATEGORIA *</label>
                      <div className="flex gap-2">
                        {categories.map((cat) => (
                          <button key={cat} type="button" onClick={() => setForm({ ...form, category: cat })}
                            className={`flex-1 text-[10px] tracking-[0.15em] font-mono py-2 border transition-all ${form.category === cat ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
                          >{cat.toUpperCase()}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">BADGE</label>
                      <Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="es. NEW, LIMITED" className="bg-background border-border font-mono text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">IMMAGINE</label>
                    <div className="flex items-center gap-4">
                      {form.image_url && <img src={form.image_url} alt="" className="w-16 h-16 object-cover border border-border" />}
                      <label className="flex-1 border border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary cursor-pointer flex items-center justify-center gap-2 py-4 transition-colors">
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                        <span className="text-xs font-mono tracking-wider">{uploading ? "CARICAMENTO..." : "CARICA IMMAGINE"}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                      </label>
                    </div>
                    {form.image_url && <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="bg-background border-border font-mono text-xs mt-2" placeholder="URL immagine" />}
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setForm({ ...form, is_active: !form.is_active })}
                      className={`w-10 h-5 rounded-full transition-colors relative ${form.is_active ? "bg-primary" : "bg-muted"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.is_active ? "left-5" : "left-0.5"}`} />
                    </button>
                    <span className="text-xs font-mono tracking-[0.2em] text-muted-foreground">{form.is_active ? "ATTIVO" : "DISATTIVATO"}</span>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={saveMutation.isPending}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs tracking-[0.2em] rounded-none py-5 gap-2">
                      {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {editingId ? "AGGIORNA" : "CREA PRODOTTO"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm} className="border-border font-mono text-xs tracking-[0.2em] rounded-none">ANNULLA</Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;
