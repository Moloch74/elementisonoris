import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, Loader2, X, Save, ShieldAlert,
  Image as ImageIcon, Package, Users, ShoppingBag, BarChart3,
  Eye, ChevronDown, ChevronUp, Star, StarOff, Tag, Mail, Send,
  Percent, DollarSign, Copy, Check, CalendarDays, MapPin, Clock,
  UserSquare2, Images,
} from "lucide-react";
import TeamManager from "@/components/admin/TeamManager";
import GalleryManager from "@/components/admin/GalleryManager";
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
type DiscountType = Database["public"]["Enums"]["discount_type"];

type ProductForm = {
  name: string;
  description: string;
  price: string;
  category: ProductCategory;
  genre: string;
  stock: string;
  badge: string;
  image_url: string;
  image_back_url: string;
  audio_preview_url: string;
  has_back: boolean;
  is_active: boolean;
  is_featured: boolean;
};

const emptyForm: ProductForm = {
  name: "", description: "", price: "", category: "vinili", genre: "",
  stock: "0", badge: "", image_url: "",
  image_back_url: "", audio_preview_url: "", has_back: false,
  is_active: true, is_featured: false,
};

type CouponForm = {
  code: string;
  discount_type: DiscountType;
  discount_value: string;
  min_order: string;
  max_uses: string;
  is_active: boolean;
  expires_at: string;
};

const emptyCouponForm: CouponForm = {
  code: "", discount_type: "percentage", discount_value: "",
  min_order: "0", max_uses: "", is_active: true, expires_at: "",
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

type EventForm = {
  name: string;
  date_label: string;
  location: string;
  tag: string;
  description: string;
  time_range: string;
  is_upcoming: boolean;
  is_active: boolean;
  sort_order: string;
};

const emptyEventForm: EventForm = {
  name: "", date_label: "", location: "", tag: "IN-STORE",
  description: "", time_range: "", is_upcoming: true, is_active: true, sort_order: "0",
};

type Tab = "overview" | "products" | "orders" | "customers" | "ecommerce" | "events" | "team" | "gallery";

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
  const [uploadingBack, setUploadingBack] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Coupon state
  const [couponForm, setCouponForm] = useState<CouponForm>(emptyCouponForm);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Event state
  const [eventForm, setEventForm] = useState<EventForm>(emptyEventForm);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);

  // Ecommerce sub-tab
  const [ecommerceTab, setEcommerceTab] = useState<"featured" | "coupons" | "email">("featured");

  // Email state
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailRecipients, setEmailRecipients] = useState<string[]>([]);
  const [sendingEmail, setSendingEmail] = useState(false);

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

  const { data: coupons = [], isLoading: couponsLoading } = useQuery({
    queryKey: ["admin-coupons"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["admin-events"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // ─── Product Mutations ───
  const saveMutation = useMutation({
    mutationFn: async () => {
      const metadata = {
        image_back_url: form.has_back && form.image_back_url ? form.image_back_url : null,
        audio_preview_url: form.audio_preview_url || null,
        has_back: form.has_back && !!form.image_back_url,
      } as unknown as Database["public"]["Tables"]["products"]["Row"]["metadata"];
      const payload = {
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        category: form.category,
        stock: parseInt(form.stock),
        badge: form.badge || null,
        image_url: form.image_url || null,
        is_active: form.is_active,
        is_featured: form.is_featured,
        metadata,
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

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, featured }: { id: string; featured: boolean }) => {
      const { error } = await supabase.from("products").update({ is_featured: featured }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Prodotto aggiornato!");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ─── Order Mutations ───
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

  // ─── Coupon Mutations ───
  const saveCouponMutation = useMutation({
    mutationFn: async () => {
      const payload: any = {
        code: couponForm.code.toUpperCase().trim(),
        discount_type: couponForm.discount_type,
        discount_value: parseFloat(couponForm.discount_value),
        min_order: parseFloat(couponForm.min_order) || 0,
        max_uses: couponForm.max_uses ? parseInt(couponForm.max_uses) : null,
        is_active: couponForm.is_active,
        expires_at: couponForm.expires_at || null,
      };
      if (editingCouponId) {
        const { error } = await supabase.from("coupons").update(payload).eq("id", editingCouponId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("coupons").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingCouponId ? "Coupon aggiornato!" : "Coupon creato!");
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      resetCouponForm();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteCouponMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Coupon eliminato!");
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ─── Event Mutations ───
  const saveEventMutation = useMutation({
    mutationFn: async () => {
      const payload: any = {
        name: eventForm.name,
        date_label: eventForm.date_label,
        location: eventForm.location,
        tag: eventForm.tag,
        description: eventForm.description || "",
        time_range: eventForm.time_range || "",
        is_upcoming: eventForm.is_upcoming,
        is_active: eventForm.is_active,
        sort_order: parseInt(eventForm.sort_order) || 0,
      };
      if (editingEventId) {
        const { error } = await supabase.from("events").update(payload).eq("id", editingEventId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("events").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingEventId ? "Evento aggiornato!" : "Evento creato!");
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["public-events"] });
      resetEventForm();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Evento eliminato!");
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["public-events"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // ─── Helpers ───
  const uploadToBucket = async (file: File, bucket: string) => {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return urlData.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToBucket(file, "product-images");
      setForm((f) => ({ ...f, image_url: url }));
      toast.success("Foto fronte caricata!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Errore upload");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleBackImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBack(true);
    try {
      const url = await uploadToBucket(file, "product-images");
      setForm((f) => ({ ...f, image_back_url: url, has_back: true }));
      toast.success("Foto retro caricata!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Errore upload");
    } finally {
      setUploadingBack(false);
      e.target.value = "";
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File audio troppo grande (max 5MB).");
      e.target.value = "";
      return;
    }
    setUploadingAudio(true);
    try {
      const url = await uploadToBucket(file, "product-audio");
      setForm((f) => ({ ...f, audio_preview_url: url }));
      toast.success("Audio preview caricato!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Errore upload audio");
    } finally {
      setUploadingAudio(false);
      e.target.value = "";
    }
  };

  const startEdit = (product: typeof products[0]) => {
    setEditingId(product.id);
    const meta = (product.metadata ?? {}) as Record<string, unknown>;
    const backUrl = (meta.image_back_url as string) || "";
    const audioUrl = (meta.audio_preview_url as string) || "";
    setForm({
      name: product.name, description: product.description || "",
      price: String(product.price), category: product.category,
      genre: (product as any).genre || "",
      stock: String(product.stock), badge: product.badge || "",
      image_url: product.image_url || "",
      image_back_url: backUrl,
      audio_preview_url: audioUrl,
      has_back: !!(meta.has_back as boolean) || !!backUrl,
      is_active: product.is_active,
      is_featured: (product as any).is_featured ?? false,
    });
    setShowForm(true);
  };

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(false); };

  const startEditCoupon = (coupon: typeof coupons[0]) => {
    setEditingCouponId(coupon.id);
    setCouponForm({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: String(coupon.discount_value),
      min_order: String(coupon.min_order),
      max_uses: coupon.max_uses ? String(coupon.max_uses) : "",
      is_active: coupon.is_active,
      expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 16) : "",
    });
    setShowCouponForm(true);
  };

  const resetCouponForm = () => { setCouponForm(emptyCouponForm); setEditingCouponId(null); setShowCouponForm(false); };

  const startEditEvent = (event: typeof events[0]) => {
    setEditingEventId(event.id);
    setEventForm({
      name: event.name, date_label: event.date_label,
      location: event.location, tag: event.tag,
      description: event.description || "", time_range: event.time_range || "",
      is_upcoming: event.is_upcoming, is_active: event.is_active,
      sort_order: String(event.sort_order),
    });
    setShowEventForm(true);
  };

  const resetEventForm = () => { setEventForm(emptyEventForm); setEditingEventId(null); setShowEventForm(false); };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailBody.trim() || emailRecipients.length === 0) {
      toast.error("Compila tutti i campi e seleziona almeno un destinatario.");
      return;
    }
    setSendingEmail(true);
    try {
      // For now, open mailto with selected recipients
      const mailto = `mailto:${emailRecipients.join(",")}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.open(mailto, "_blank");
      toast.success(`Email preparata per ${emailRecipients.length} destinatari!`);
      setEmailSubject("");
      setEmailBody("");
      setEmailRecipients([]);
    } catch {
      toast.error("Errore nell'invio email.");
    } finally {
      setSendingEmail(false);
    }
  };

  const toggleRecipient = (email: string) => {
    setEmailRecipients((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const selectAllRecipients = () => {
    const allEmails = profiles.filter((p) => p.email).map((p) => p.email!);
    setEmailRecipients((prev) => prev.length === allEmails.length ? [] : allEmails);
  };

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
  const featuredProducts = products.filter(p => (p as any).is_featured);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "DASHBOARD", icon: <BarChart3 className="h-4 w-4" /> },
    { key: "products", label: "PRODOTTI", icon: <Package className="h-4 w-4" /> },
    { key: "orders", label: "ORDINI", icon: <ShoppingBag className="h-4 w-4" /> },
    { key: "customers", label: "CLIENTI", icon: <Users className="h-4 w-4" /> },
    { key: "ecommerce", label: "E-COMMERCE", icon: <Tag className="h-4 w-4" /> },
    { key: "events", label: "EVENTI", icon: <CalendarDays className="h-4 w-4" /> },
    { key: "team", label: "TEAM", icon: <UserSquare2 className="h-4 w-4" /> },
    { key: "gallery", label: "GALLERIA", icon: <Images className="h-4 w-4" /> },
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
              className={`flex items-center gap-2 px-4 py-3 text-[10px] tracking-[0.15em] font-mono font-bold transition-all whitespace-nowrap ${
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-border bg-card p-5">
                <h3 className="text-xs tracking-[0.2em] font-mono font-bold text-foreground mb-4">CLIENTI</h3>
                <p className="text-3xl font-display font-bold text-foreground">{profiles.length}</p>
                <button onClick={() => setActiveTab("customers")} className="text-[10px] tracking-[0.2em] font-mono text-primary mt-3 hover:underline">VEDI TUTTI →</button>
              </div>
              <div className="border border-border bg-card p-5">
                <h3 className="text-xs tracking-[0.2em] font-mono font-bold text-foreground mb-4">IN EVIDENZA</h3>
                <p className="text-3xl font-display font-bold text-foreground">{featuredProducts.length}</p>
                <button onClick={() => { setActiveTab("ecommerce"); setEcommerceTab("featured"); }} className="text-[10px] tracking-[0.2em] font-mono text-primary mt-3 hover:underline">GESTISCI →</button>
              </div>
              <div className="border border-border bg-card p-5">
                <h3 className="text-xs tracking-[0.2em] font-mono font-bold text-foreground mb-4">COUPON ATTIVI</h3>
                <p className="text-3xl font-display font-bold text-foreground">{coupons.filter(c => c.is_active).length}</p>
                <button onClick={() => { setActiveTab("ecommerce"); setEcommerceTab("coupons"); }} className="text-[10px] tracking-[0.2em] font-mono text-primary mt-3 hover:underline">GESTISCI →</button>
              </div>
            </div>

            <div className="border border-border bg-card p-5">
              <h3 className="text-xs tracking-[0.2em] font-mono font-bold text-foreground mb-4">ULTIMI ORDINI</h3>
              {orders.slice(0, 5).map((o) => (
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
            </div>
          </motion.div>
        )}

        {/* ═══════════════ PRODUCTS ═══════════════ */}
        {activeTab === "products" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground text-xs font-mono tracking-[0.2em]">{products.length} PRODOTTI</p>
              <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs tracking-[0.2em] rounded-none gap-2">
                <Plus className="h-4 w-4" /> NUOVO PRODOTTO
              </Button>
            </div>

            {productsLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="border border-border">
                <div className="hidden md:grid grid-cols-[1fr_100px_80px_60px_60px_40px_100px] gap-4 px-6 py-3 bg-secondary text-muted-foreground text-[10px] tracking-[0.2em] font-mono border-b border-border">
                  <span>PRODOTTO</span><span>CATEGORIA</span><span>PREZZO</span><span>STOCK</span><span>STATO</span><span>★</span><span className="text-right">AZIONI</span>
                </div>
                {products.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground font-mono text-sm">Nessun prodotto.</div>
                ) : products.map((product) => (
                  <div key={product.id} className="grid grid-cols-1 md:grid-cols-[1fr_100px_80px_60px_60px_40px_100px] gap-4 px-6 py-4 border-b border-border items-center hover:bg-secondary/50 transition-colors">
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
                      <span className={`inline-block w-2 h-2 rounded-full mr-1 ${product.is_active ? "bg-primary" : "bg-destructive"}`} />
                      <span className="text-[10px] font-mono text-muted-foreground">{product.is_active ? "ON" : "OFF"}</span>
                    </span>
                    <button
                      onClick={() => toggleFeatured.mutate({ id: product.id, featured: !(product as any).is_featured })}
                      className={`p-1 transition-colors ${(product as any).is_featured ? "text-yellow-400" : "text-muted-foreground hover:text-yellow-400"}`}
                      title="In evidenza"
                    >
                      {(product as any).is_featured ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                    </button>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(product)} className="p-2 text-muted-foreground hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => { if (confirm("Eliminare?")) deleteMutation.mutate(product.id); }} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
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
                        <span className="text-muted-foreground text-xs font-mono">{new Date(order.created_at).toLocaleDateString("it-IT")}</span>
                        <span className="text-foreground font-mono text-sm font-bold">€{Number(order.total).toFixed(2)}</span>
                        <div>
                          <select value={order.status} onChange={(e) => updateOrderStatus.mutate({ id: order.id, status: e.target.value as OrderStatus })}
                            className="bg-background border border-border text-foreground text-[10px] font-mono tracking-wider px-2 py-1.5 w-full focus:outline-none focus:border-primary">
                            {orderStatuses.map((s) => <option key={s} value={s}>{s.toUpperCase()}</option>)}
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
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-secondary/30">
                            <div className="px-6 py-4 space-y-3">
                              <p className="text-[10px] font-mono tracking-[0.2em] text-muted-foreground">DETTAGLI ORDINE</p>
                              {order.shipping_address && (
                                <p className="text-xs font-mono text-muted-foreground">Indirizzo: {typeof order.shipping_address === "object" ? JSON.stringify(order.shipping_address) : String(order.shipping_address)}</p>
                              )}
                              {items.length > 0 ? items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                                  <div className="flex-1">
                                    <p className="text-sm font-mono text-foreground">{(item as any).products?.name || item.product_id}</p>
                                    <p className="text-[10px] font-mono text-muted-foreground">{item.quantity}× €{Number(item.unit_price).toFixed(2)}</p>
                                  </div>
                                  <span className="text-sm font-mono font-bold text-foreground">€{(item.quantity * Number(item.unit_price)).toFixed(2)}</span>
                                </div>
                              )) : <p className="text-xs font-mono text-muted-foreground">Nessun articolo trovato.</p>}
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
                      <span className="text-muted-foreground text-xs font-mono">{new Date(profile.created_at).toLocaleDateString("it-IT")}</span>
                      <span className="text-foreground font-mono text-sm font-bold">{customerOrders.length}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════ ECOMMERCE ═══════════════ */}
        {activeTab === "ecommerce" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Sub-tabs */}
            <div className="flex gap-0 border border-border mb-6">
              {([
                { key: "featured" as const, label: "IN EVIDENZA", icon: <Star className="h-3.5 w-3.5" /> },
                { key: "coupons" as const, label: "COUPON", icon: <Tag className="h-3.5 w-3.5" /> },
                { key: "email" as const, label: "EMAIL CLIENTI", icon: <Mail className="h-3.5 w-3.5" /> },
              ]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setEcommerceTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-[10px] tracking-[0.15em] font-mono font-bold transition-all whitespace-nowrap ${
                    ecommerceTab === tab.key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* ── FEATURED ── */}
            {ecommerceTab === "featured" && (
              <div className="space-y-6">
                <div className="border border-border bg-card p-5">
                  <h3 className="text-xs tracking-[0.2em] font-mono font-bold text-foreground mb-2">PRODOTTI IN EVIDENZA</h3>
                  <p className="text-muted-foreground text-[10px] font-mono tracking-wider mb-4">
                    Seleziona i prodotti da mettere in evidenza nello shop. Clicca la stella ★ per aggiungere/rimuovere.
                  </p>
                </div>

                {featuredProducts.length > 0 && (
                  <div className="border border-primary/30 bg-primary/5 p-4">
                    <p className="text-[10px] font-mono tracking-[0.2em] text-primary mb-3 font-bold">★ {featuredProducts.length} PRODOTTI IN EVIDENZA</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {featuredProducts.map((p) => (
                        <div key={p.id} className="flex items-center gap-3 border border-border bg-card p-3">
                          {p.image_url && <img src={p.image_url} alt="" className="w-12 h-12 object-cover border border-border" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-display font-semibold text-foreground truncate">{p.name}</p>
                            <p className="text-xs font-mono text-muted-foreground">€{Number(p.price).toFixed(2)}</p>
                          </div>
                          <button onClick={() => toggleFeatured.mutate({ id: p.id, featured: false })} className="text-yellow-400 hover:text-muted-foreground transition-colors">
                            <Star className="h-4 w-4 fill-current" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border border-border">
                  <div className="hidden md:grid grid-cols-[1fr_100px_80px_60px] gap-4 px-6 py-3 bg-secondary text-muted-foreground text-[10px] tracking-[0.2em] font-mono border-b border-border">
                    <span>PRODOTTO</span><span>CATEGORIA</span><span>PREZZO</span><span>★</span>
                  </div>
                  {products.map((p) => (
                    <div key={p.id} className="grid grid-cols-1 md:grid-cols-[1fr_100px_80px_60px] gap-4 px-6 py-3 border-b border-border items-center hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        {p.image_url && <img src={p.image_url} alt="" className="w-8 h-8 object-cover border border-border hidden sm:block" />}
                        <span className="text-foreground text-sm font-display font-semibold">{p.name}</span>
                      </div>
                      <span className="text-muted-foreground text-xs font-mono">{p.category.toUpperCase()}</span>
                      <span className="text-foreground font-mono text-sm font-bold">€{Number(p.price).toFixed(2)}</span>
                      <button
                        onClick={() => toggleFeatured.mutate({ id: p.id, featured: !(p as any).is_featured })}
                        className={`p-1 transition-colors ${(p as any).is_featured ? "text-yellow-400" : "text-muted-foreground hover:text-yellow-400"}`}
                      >
                        {(p as any).is_featured ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── COUPONS ── */}
            {ecommerceTab === "coupons" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-xs font-mono tracking-[0.2em]">{coupons.length} COUPON</p>
                  <Button onClick={() => { resetCouponForm(); setShowCouponForm(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs tracking-[0.2em] rounded-none gap-2">
                    <Plus className="h-4 w-4" /> NUOVO COUPON
                  </Button>
                </div>

                {couponsLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
                ) : coupons.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground font-mono text-sm">Nessun coupon creato.</div>
                ) : (
                  <div className="border border-border">
                    <div className="hidden md:grid grid-cols-[1fr_120px_100px_80px_80px_80px_100px] gap-4 px-6 py-3 bg-secondary text-muted-foreground text-[10px] tracking-[0.2em] font-mono border-b border-border">
                      <span>CODICE</span><span>SCONTO</span><span>MIN. ORDINE</span><span>USI</span><span>SCADENZA</span><span>STATO</span><span className="text-right">AZIONI</span>
                    </div>
                    {coupons.map((coupon) => (
                      <div key={coupon.id} className="grid grid-cols-1 md:grid-cols-[1fr_120px_100px_80px_80px_80px_100px] gap-4 px-6 py-4 border-b border-border items-center hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <code className="text-foreground text-sm font-mono font-bold bg-secondary px-2 py-1">{coupon.code}</code>
                          <button onClick={() => copyCode(coupon.code)} className="text-muted-foreground hover:text-primary transition-colors">
                            {copiedCode === coupon.code ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        <span className="text-foreground font-mono text-sm font-bold flex items-center gap-1">
                          {coupon.discount_type === "percentage" ? <Percent className="h-3 w-3" /> : <DollarSign className="h-3 w-3" />}
                          {coupon.discount_type === "percentage" ? `${coupon.discount_value}%` : `€${Number(coupon.discount_value).toFixed(2)}`}
                        </span>
                        <span className="text-muted-foreground text-xs font-mono">€{Number(coupon.min_order).toFixed(2)}</span>
                        <span className="text-muted-foreground text-xs font-mono">{coupon.used_count}{coupon.max_uses ? `/${coupon.max_uses}` : ""}</span>
                        <span className="text-muted-foreground text-[10px] font-mono">
                          {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString("it-IT") : "—"}
                        </span>
                        <span>
                          <span className={`inline-block w-2 h-2 rounded-full mr-1 ${coupon.is_active ? "bg-primary" : "bg-destructive"}`} />
                          <span className="text-[10px] font-mono text-muted-foreground">{coupon.is_active ? "ON" : "OFF"}</span>
                        </span>
                        <div className="flex justify-end gap-2">
                          <button onClick={() => startEditCoupon(coupon)} className="p-2 text-muted-foreground hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => { if (confirm("Eliminare questo coupon?")) deleteCouponMutation.mutate(coupon.id); }} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── EMAIL ── */}
            {ecommerceTab === "email" && (
              <div className="space-y-6">
                <div className="border border-border bg-card p-5">
                  <h3 className="text-xs tracking-[0.2em] font-mono font-bold text-foreground mb-2">INVIA EMAIL AI CLIENTI</h3>
                  <p className="text-muted-foreground text-[10px] font-mono tracking-wider">
                    Seleziona i destinatari, compila oggetto e messaggio, poi invia.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recipients */}
                  <div className="border border-border bg-card p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-mono tracking-[0.2em] text-muted-foreground font-bold">DESTINATARI</h4>
                      <button onClick={selectAllRecipients} className="text-[10px] font-mono tracking-wider text-primary hover:underline">
                        {emailRecipients.length === profiles.filter(p => p.email).length ? "DESELEZIONA" : "SELEZIONA TUTTI"}
                      </button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                      {profiles.filter(p => p.email).map((p) => (
                        <label key={p.id} className="flex items-center gap-3 py-1.5 px-2 hover:bg-secondary/50 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={emailRecipients.includes(p.email!)}
                            onChange={() => toggleRecipient(p.email!)}
                            className="accent-primary"
                          />
                          <span className="text-xs font-mono text-foreground truncate">{p.email}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-[10px] font-mono text-primary tracking-wider">{emailRecipients.length} selezionati</p>
                  </div>

                  {/* Compose */}
                  <div className="lg:col-span-2 border border-border bg-card p-5 space-y-4">
                    <div>
                      <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">OGGETTO *</label>
                      <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className="bg-background border-border font-mono text-sm" placeholder="es. Nuovi arrivi nel nostro shop!" />
                    </div>
                    <div>
                      <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">MESSAGGIO *</label>
                      <Textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} className="bg-background border-border font-mono text-sm min-h-[180px] resize-none" placeholder="Scrivi il tuo messaggio qui..." />
                    </div>
                    <Button onClick={handleSendEmail} disabled={sendingEmail || !emailSubject || !emailBody || emailRecipients.length === 0}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs tracking-[0.2em] rounded-none gap-2 w-full py-5">
                      {sendingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      INVIA EMAIL ({emailRecipients.length})
                    </Button>
                    <p className="text-[10px] font-mono text-muted-foreground tracking-wider text-center">
                      L'email verrà aperta nel tuo client di posta predefinito.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════ EVENTS ═══════════════ */}
        {activeTab === "events" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground text-xs font-mono tracking-[0.2em]">{events.length} EVENTI</p>
              <Button onClick={() => { resetEventForm(); setShowEventForm(true); }} className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs tracking-[0.2em] rounded-none gap-2">
                <Plus className="h-4 w-4" /> NUOVO EVENTO
              </Button>
            </div>

            {eventsLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-mono text-sm">Nessun evento creato.</div>
            ) : (
              <div className="space-y-0 border border-border">
                <div className="hidden md:grid grid-cols-[80px_1fr_150px_100px_100px_60px_60px_100px] gap-4 px-6 py-3 bg-secondary text-muted-foreground text-[10px] tracking-[0.2em] font-mono border-b border-border">
                  <span>DATA</span><span>NOME</span><span>LOCATION</span><span>TAG</span><span>ORARIO</span><span>TIPO</span><span>STATO</span><span className="text-right">AZIONI</span>
                </div>
                {events.map((event) => (
                  <div key={event.id} className="grid grid-cols-1 md:grid-cols-[80px_1fr_150px_100px_100px_60px_60px_100px] gap-4 px-6 py-4 border-b border-border items-center hover:bg-secondary/50 transition-colors">
                    <span className="text-primary font-display text-lg font-bold">{event.date_label}</span>
                    <div>
                      <p className="text-foreground text-sm font-display font-semibold">{event.name}</p>
                      {event.description && <p className="text-muted-foreground text-[10px] font-mono truncate max-w-[200px]">{event.description}</p>}
                    </div>
                    <span className="text-muted-foreground text-xs font-mono flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                    <span className="border border-primary text-primary text-[10px] tracking-[0.15em] px-2 py-0.5 font-mono text-center">{event.tag}</span>
                    <span className="text-muted-foreground text-xs font-mono flex items-center gap-1"><Clock className="h-3 w-3" /> {event.time_range || "—"}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{event.is_upcoming ? "PROS." : "PASS."}</span>
                    <span>
                      <span className={`inline-block w-2 h-2 rounded-full mr-1 ${event.is_active ? "bg-primary" : "bg-destructive"}`} />
                      <span className="text-[10px] font-mono text-muted-foreground">{event.is_active ? "ON" : "OFF"}</span>
                    </span>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEditEvent(event)} className="p-2 text-muted-foreground hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => { if (confirm("Eliminare questo evento?")) deleteEventMutation.mutate(event.id); }} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════ Event Form Modal ═══════════════ */}
        <AnimatePresence>
          {showEventForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={resetEventForm}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold text-foreground">{editingEventId ? "MODIFICA EVENTO" : "NUOVO EVENTO"}</h2>
                  <button onClick={resetEventForm} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); saveEventMutation.mutate(); }} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">NOME EVENTO *</label>
                    <Input value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })} className="bg-background border-border font-mono text-sm" placeholder="es. VINYL ONLY NIGHT" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">DATA *</label>
                      <Input value={eventForm.date_label} onChange={(e) => setEventForm({ ...eventForm, date_label: e.target.value })} className="bg-background border-border font-mono text-sm" placeholder="es. 12 APR" required />
                    </div>
                    <div>
                      <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">TAG *</label>
                      <Input value={eventForm.tag} onChange={(e) => setEventForm({ ...eventForm, tag: e.target.value.toUpperCase() })} className="bg-background border-border font-mono text-sm" placeholder="es. IN-STORE, RAVE" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">LOCATION *</label>
                    <Input value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} className="bg-background border-border font-mono text-sm" placeholder="es. Elementi Sonori — Lecce" required />
                  </div>
                  <div>
                    <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">ORARIO</label>
                    <Input value={eventForm.time_range} onChange={(e) => setEventForm({ ...eventForm, time_range: e.target.value })} className="bg-background border-border font-mono text-sm" placeholder="es. 21:00 — 02:00" />
                  </div>
                  <div>
                    <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">DESCRIZIONE</label>
                    <Textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="bg-background border-border font-mono text-sm min-h-[80px] resize-none" placeholder="Descrizione evento..." />
                  </div>
                  <div>
                    <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">ORDINE</label>
                    <Input type="number" min="0" value={eventForm.sort_order} onChange={(e) => setEventForm({ ...eventForm, sort_order: e.target.value })} className="bg-background border-border font-mono text-sm" />
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setEventForm({ ...eventForm, is_upcoming: !eventForm.is_upcoming })}
                        className={`w-10 h-5 rounded-full transition-colors relative ${eventForm.is_upcoming ? "bg-primary" : "bg-muted"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${eventForm.is_upcoming ? "left-5" : "left-0.5"}`} />
                      </button>
                      <span className="text-xs font-mono tracking-[0.2em] text-muted-foreground">{eventForm.is_upcoming ? "PROSSIMO" : "PASSATO"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setEventForm({ ...eventForm, is_active: !eventForm.is_active })}
                        className={`w-10 h-5 rounded-full transition-colors relative ${eventForm.is_active ? "bg-primary" : "bg-muted"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${eventForm.is_active ? "left-5" : "left-0.5"}`} />
                      </button>
                      <span className="text-xs font-mono tracking-[0.2em] text-muted-foreground">{eventForm.is_active ? "VISIBILE" : "NASCOSTO"}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={saveEventMutation.isPending}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs tracking-[0.2em] rounded-none py-5 gap-2">
                      {saveEventMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {editingEventId ? "AGGIORNA" : "CREA EVENTO"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetEventForm} className="border-border font-mono text-xs tracking-[0.2em] rounded-none">ANNULLA</Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════ Product Form Modal ═══════════════ */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={resetForm}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
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
                  {/* Foto fronte */}
                  <div>
                    <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">FOTO FRONTE *</label>
                    <div className="flex items-center gap-4">
                      {form.image_url && <img src={form.image_url} alt="Fronte" className="w-16 h-16 object-cover border border-border" />}
                      <label className="flex-1 border border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary cursor-pointer flex items-center justify-center gap-2 py-4 transition-colors">
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                        <span className="text-xs font-mono tracking-wider">{uploading ? "CARICAMENTO..." : (form.image_url ? "SOSTITUISCI FRONTE" : "CARICA FRONTE")}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                      </label>
                    </div>
                  </div>

                  {/* Modalità foto */}
                  <div>
                    <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-2 block">MODALITÀ FOTO</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, has_back: false })}
                        className={`flex-1 text-[10px] tracking-[0.15em] font-mono py-2 border transition-all ${!form.has_back ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
                      >
                        SOLO FRONTE
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, has_back: true })}
                        className={`flex-1 text-[10px] tracking-[0.15em] font-mono py-2 border transition-all ${form.has_back ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-foreground"}`}
                      >
                        FRONTE + RETRO
                      </button>
                    </div>
                  </div>

                  {/* Foto retro */}
                  {form.has_back && (
                    <div>
                      <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">FOTO RETRO</label>
                      <div className="flex items-center gap-4">
                        {form.image_back_url && <img src={form.image_back_url} alt="Retro" className="w-16 h-16 object-cover border border-border" />}
                        <label className="flex-1 border border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary cursor-pointer flex items-center justify-center gap-2 py-4 transition-colors">
                          {uploadingBack ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                          <span className="text-xs font-mono tracking-wider">{uploadingBack ? "CARICAMENTO..." : (form.image_back_url ? "SOSTITUISCI RETRO" : "CARICA RETRO")}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleBackImageUpload} disabled={uploadingBack} />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Audio preview */}
                  <div>
                    <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">AUDIO PREVIEW (consigliato 30 sec, max 5MB)</label>
                    <div className="flex items-center gap-4 flex-wrap">
                      {form.audio_preview_url && (
                        <audio src={form.audio_preview_url} controls className="h-10 w-44" preload="none" />
                      )}
                      <label className="flex-1 min-w-[180px] border border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary cursor-pointer flex items-center justify-center gap-2 py-4 transition-colors">
                        {uploadingAudio ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-base">🎵</span>}
                        <span className="text-xs font-mono tracking-wider">{uploadingAudio ? "CARICAMENTO..." : (form.audio_preview_url ? "SOSTITUISCI AUDIO" : "CARICA AUDIO")}</span>
                        <input type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} disabled={uploadingAudio} />
                      </label>
                      {form.audio_preview_url && (
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, audio_preview_url: "" })}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          title="Rimuovi audio"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setForm({ ...form, is_active: !form.is_active })}
                        className={`w-10 h-5 rounded-full transition-colors relative ${form.is_active ? "bg-primary" : "bg-muted"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.is_active ? "left-5" : "left-0.5"}`} />
                      </button>
                      <span className="text-xs font-mono tracking-[0.2em] text-muted-foreground">{form.is_active ? "ATTIVO" : "OFF"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
                        className={`w-10 h-5 rounded-full transition-colors relative ${form.is_featured ? "bg-yellow-500" : "bg-muted"}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.is_featured ? "left-5" : "left-0.5"}`} />
                      </button>
                      <span className="text-xs font-mono tracking-[0.2em] text-muted-foreground">★ IN EVIDENZA</span>
                    </div>
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

        {/* ═══════════════ Coupon Form Modal ═══════════════ */}
        <AnimatePresence>
          {showCouponForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={resetCouponForm}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold text-foreground">{editingCouponId ? "MODIFICA COUPON" : "NUOVO COUPON"}</h2>
                  <button onClick={resetCouponForm} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); saveCouponMutation.mutate(); }} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">CODICE *</label>
                    <Input value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} className="bg-background border-border font-mono text-sm uppercase" placeholder="es. WELCOME20" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">TIPO SCONTO</label>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setCouponForm({ ...couponForm, discount_type: "percentage" })}
                          className={`flex-1 text-[10px] tracking-[0.15em] font-mono py-2 border transition-all flex items-center justify-center gap-1 ${couponForm.discount_type === "percentage" ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>
                          <Percent className="h-3 w-3" /> %
                        </button>
                        <button type="button" onClick={() => setCouponForm({ ...couponForm, discount_type: "fixed" })}
                          className={`flex-1 text-[10px] tracking-[0.15em] font-mono py-2 border transition-all flex items-center justify-center gap-1 ${couponForm.discount_type === "fixed" ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>
                          € FISSO
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">VALORE *</label>
                      <Input type="number" step="0.01" min="0" value={couponForm.discount_value} onChange={(e) => setCouponForm({ ...couponForm, discount_value: e.target.value })} className="bg-background border-border font-mono text-sm" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">ORDINE MINIMO (€)</label>
                      <Input type="number" step="0.01" min="0" value={couponForm.min_order} onChange={(e) => setCouponForm({ ...couponForm, min_order: e.target.value })} className="bg-background border-border font-mono text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">MAX UTILIZZI</label>
                      <Input type="number" min="1" value={couponForm.max_uses} onChange={(e) => setCouponForm({ ...couponForm, max_uses: e.target.value })} className="bg-background border-border font-mono text-sm" placeholder="Illimitati" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-1 block">DATA SCADENZA</label>
                    <Input type="datetime-local" value={couponForm.expires_at} onChange={(e) => setCouponForm({ ...couponForm, expires_at: e.target.value })} className="bg-background border-border font-mono text-sm" />
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setCouponForm({ ...couponForm, is_active: !couponForm.is_active })}
                      className={`w-10 h-5 rounded-full transition-colors relative ${couponForm.is_active ? "bg-primary" : "bg-muted"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${couponForm.is_active ? "left-5" : "left-0.5"}`} />
                    </button>
                    <span className="text-xs font-mono tracking-[0.2em] text-muted-foreground">{couponForm.is_active ? "ATTIVO" : "DISATTIVATO"}</span>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={saveCouponMutation.isPending}
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs tracking-[0.2em] rounded-none py-5 gap-2">
                      {saveCouponMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {editingCouponId ? "AGGIORNA" : "CREA COUPON"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetCouponForm} className="border-border font-mono text-xs tracking-[0.2em] rounded-none">ANNULLA</Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════ TEAM ═══════════════ */}
        {activeTab === "team" && <TeamManager />}

        {/* ═══════════════ GALLERY ═══════════════ */}
        {activeTab === "gallery" && <GalleryManager />}
      </div>
    </div>
  );
};

export default Admin;
