import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Filter, Loader2, X, Package, Truck, Star, RotateCw, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LangContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import vinyl1 from "@/assets/shop/vinyl-placeholder-1.jpg";
import vinyl2 from "@/assets/shop/vinyl-placeholder-2.jpg";
import vinyl3 from "@/assets/shop/vinyl-placeholder-3.jpg";
import vinyl4 from "@/assets/shop/vinyl-placeholder-4.jpg";
import streetwear1 from "@/assets/shop/streetwear-placeholder-1.jpg";
import streetwear2 from "@/assets/shop/streetwear-placeholder-2.jpg";
import streetwear3 from "@/assets/shop/streetwear-placeholder-3.jpg";
import streetwear4 from "@/assets/shop/streetwear-placeholder-4.jpg";
import gadget1 from "@/assets/shop/gadget-placeholder-1.jpg";
import gadget2 from "@/assets/shop/gadget-placeholder-2.jpg";
import gadget3 from "@/assets/shop/gadget-placeholder-3.jpg";
import gadget4 from "@/assets/shop/gadget-placeholder-4.jpg";

type Category = "tutti" | "vinili" | "streetwear" | "gadgets";

const fallbackImages: Record<string, string> = {
  "/shop/vinyl-placeholder-1.jpg": vinyl1,
  "/shop/vinyl-placeholder-2.jpg": vinyl2,
  "/shop/vinyl-placeholder-3.jpg": vinyl3,
  "/shop/vinyl-placeholder-4.jpg": vinyl4,
  "/shop/streetwear-placeholder-1.jpg": streetwear1,
  "/shop/streetwear-placeholder-2.jpg": streetwear2,
  "/shop/streetwear-placeholder-3.jpg": streetwear3,
  "/shop/streetwear-placeholder-4.jpg": streetwear4,
  "/shop/gadget-placeholder-1.jpg": gadget1,
  "/shop/gadget-placeholder-2.jpg": gadget2,
  "/shop/gadget-placeholder-3.jpg": gadget3,
  "/shop/gadget-placeholder-4.jpg": gadget4,
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
  badge: string | null;
  is_active: boolean;
  is_featured: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

const getMeta = (p: Product | null) => {
  const m = (p?.metadata ?? {}) as Record<string, unknown>;
  return {
    backUrl: (m.image_back_url as string) || "",
    audioUrl: (m.audio_preview_url as string) || "",
    hasBack: !!(m.has_back as boolean) && !!(m.image_back_url as string),
  };
};

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("tutti");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [flipped, setFlipped] = useState(false);
  const { addItem, itemCount } = useCart();
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTerm = (searchParams.get("q") || "").trim().toLowerCase();
  const productIdParam = searchParams.get("p");

  const openProduct = (p: Product) => {
    setFlipped(false);
    setSelectedProduct(p);
  };

  const categories: { value: Category; label: string }[] = [
    { value: "tutti", label: t("shop.tutti") },
    { value: "vinili", label: t("index.vinili") },
    { value: "streetwear", label: "STREETWEAR" },
    { value: "gadgets", label: "GADGETS" },
  ];

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });

  const featuredProducts = products.filter((p) => p.is_featured);
  const byCategory =
    activeCategory === "tutti"
      ? products
      : products.filter((p) => p.category === activeCategory);
  const filtered = queryTerm
    ? byCategory.filter((p) => {
        const hay = `${p.name} ${p.description ?? ""}`.toLowerCase();
        return hay.includes(queryTerm);
      })
    : byCategory;

  // Apri automaticamente il prodotto se arriviamo con ?p=<id>
  useEffect(() => {
    if (!productIdParam || !products.length) return;
    const found = products.find((p) => p.id === productIdParam);
    if (found) {
      setFlipped(false);
      setSelectedProduct(found);
    }
    // Pulisci il param senza ricaricare
    const next = new URLSearchParams(searchParams);
    next.delete("p");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIdParam, products]);

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next, { replace: true });
  };

  const handleAddToCart = (id: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    addItem(id);
  };

  const getImage = (imageUrl: string | null) => {
    if (!imageUrl) return vinyl1;
    return fallbackImages[imageUrl] || imageUrl;
  };

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      vinili: t("index.vinili"),
      streetwear: "STREETWEAR",
      gadgets: "GADGETS",
    };
    return map[cat] || cat.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="container mx-auto px-4 md:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-foreground">
              {t("shop.title")}
            </h1>
            <p className="text-muted-foreground text-sm tracking-[0.2em] mt-2 font-mono">
              {t("shop.subtitle")}
            </p>
          </div>
          <Button variant="outline" className="relative border-border text-foreground hover:bg-secondary">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-mono">{itemCount}</span>
            )}
          </Button>
        </motion.div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`text-xs tracking-[0.2em] font-mono px-4 py-2 border transition-all ${
                activeCategory === cat.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured Section */}
        {!isLoading && featuredProducts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Star className="h-5 w-5 text-primary fill-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground tracking-wide">{t("shop.inEvidenza") || "IN EVIDENZA"}</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="group bg-card border-2 border-primary/30 overflow-hidden hover:border-primary transition-colors cursor-pointer relative"
                  onClick={() => openProduct(product)}
                >
                  <div className="absolute top-3 right-3 z-10">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                  </div>
                  <div className="relative aspect-square overflow-hidden">
                    <img src={getImage(product.image_url)} alt={product.name} loading="lazy" width={512} height={512} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.badge && (
                      <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] tracking-[0.15em] font-mono rounded-none">{product.badge}</Badge>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-muted-foreground text-[10px] tracking-[0.2em] font-mono mb-1">{getCategoryLabel(product.category)}</p>
                      <h3 className="text-sm font-display font-semibold text-foreground tracking-wide uppercase">{product.name}</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground font-mono text-lg font-bold">€{Number(product.price).toFixed(2)}</span>
                      <Button
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product.id); }}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] tracking-[0.15em] font-mono rounded-none px-4"
                      >
                        {t("shop.aggiungi")}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group bg-card border border-border overflow-hidden hover:border-muted-foreground transition-colors cursor-pointer"
                onClick={() => openProduct(product)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img src={getImage(product.image_url)} alt={product.name} loading="lazy" width={512} height={512} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {product.badge && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] tracking-[0.15em] font-mono rounded-none">{product.badge}</Badge>
                  )}
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-foreground text-xs font-mono tracking-[0.2em] bg-background/80 px-4 py-2 border border-border">{t("shop.dettagli")}</span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-muted-foreground text-[10px] tracking-[0.2em] font-mono mb-1">{getCategoryLabel(product.category)}</p>
                    <h3 className="text-sm font-display font-semibold text-foreground tracking-wide uppercase">{product.name}</h3>
                    <p className="text-muted-foreground text-[11px] tracking-wider mt-1 font-mono line-clamp-1">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-mono text-lg font-bold">€{Number(product.price).toFixed(2)}</span>
                    <Button
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product.id); }}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] tracking-[0.15em] font-mono rounded-none px-4"
                    >
                      {t("shop.aggiungi")}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Coming soon banner */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-16 border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">{t("shop.stripeComing")}</p>
          <p className="text-muted-foreground text-[11px] mt-2 font-mono">
            {t("shop.perAcquistare")}{" "}
            <a href="https://wa.me/393714999328" target="_blank" rel="noopener noreferrer" className="text-foreground underline hover:text-primary transition-colors">WhatsApp</a>
            {" o "}
            <a href="https://www.instagram.com/elementi_sonori/" target="_blank" rel="noopener noreferrer" className="text-foreground underline hover:text-primary transition-colors">Instagram</a>
          </p>
        </motion.div>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3 }} className="bg-card border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground transition-colors bg-card/80 p-2">
                <X className="h-5 w-5" />
              </button>
              {(() => {
                const meta = getMeta(selectedProduct);
                const frontImg = getImage(selectedProduct.image_url);
                const backImg = meta.backUrl || frontImg;
                return (
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image side with flip */}
                <div className="relative aspect-square overflow-hidden bg-secondary/40" style={{ perspective: "1200px" }}>
                  <motion.div
                    className="relative w-full h-full"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  >
                    <img
                      src={frontImg}
                      alt={`${selectedProduct.name} — fronte`}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ backfaceVisibility: "hidden" }}
                    />
                    <img
                      src={backImg}
                      alt={`${selectedProduct.name} — retro`}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    />
                  </motion.div>

                  {meta.hasBack && (
                    <button
                      type="button"
                      onClick={() => setFlipped((v) => !v)}
                      className="absolute bottom-3 right-3 z-20 flex items-center gap-2 bg-background/90 border border-border hover:border-primary text-foreground hover:text-primary px-3 py-2 text-[10px] tracking-[0.2em] font-mono transition-colors backdrop-blur-sm"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                      {flipped ? "FRONTE" : "RETRO"}
                    </button>
                  )}

                  {meta.hasBack && (
                    <span className="absolute top-3 left-3 z-20 bg-background/90 border border-border px-2 py-1 text-[9px] tracking-[0.2em] font-mono text-muted-foreground backdrop-blur-sm">
                      {flipped ? "B-SIDE" : "A-SIDE"}
                    </span>
                  )}
                </div>

                <div className="p-6 md:p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <p className="text-muted-foreground text-[10px] tracking-[0.3em] font-mono mb-2">{getCategoryLabel(selectedProduct.category)}</p>
                      {selectedProduct.badge && (
                        <Badge className="bg-primary text-primary-foreground text-[10px] tracking-[0.15em] font-mono rounded-none mb-3">{selectedProduct.badge}</Badge>
                      )}
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-wide uppercase">{selectedProduct.name}</h2>
                    </div>
                    <p className="text-muted-foreground text-sm font-mono tracking-wider leading-relaxed">{selectedProduct.description}</p>

                    {/* Audio preview */}
                    {meta.audioUrl && (
                      <div className="border border-border bg-secondary/40 p-3 space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                          <Music2 className="h-3.5 w-3.5" />
                          <span className="text-[10px] tracking-[0.25em] font-mono font-bold">AUDIO PREVIEW</span>
                        </div>
                        <audio src={meta.audioUrl} controls preload="none" className="w-full h-9" />
                      </div>
                    )}

                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span className="text-xs font-mono tracking-wider">
                          {selectedProduct.stock > 0
                            ? `${selectedProduct.stock} ${selectedProduct.stock === 1 ? t("shop.disponibile") : t("shop.disponibili")}`
                            : t("shop.esaurito")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Truck className="h-4 w-4" />
                        <span className="text-xs font-mono tracking-wider">{t("shop.spedizioneItalia")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 space-y-4">
                    <div className="flex items-end justify-between">
                      <span className="text-foreground font-mono text-3xl font-bold">€{Number(selectedProduct.price).toFixed(2)}</span>
                    </div>
                    <Button
                      onClick={() => { handleAddToCart(selectedProduct.id); setSelectedProduct(null); }}
                      disabled={selectedProduct.stock === 0}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs tracking-[0.2em] font-mono rounded-none py-6"
                    >
                      {selectedProduct.stock > 0 ? t("shop.aggiungiAlCarrello") : t("shop.esaurito")}
                    </Button>
                    <p className="text-muted-foreground text-[10px] font-mono tracking-wider text-center">
                      {t("shop.contattaciProdotto")}{" "}
                      <a href="https://wa.me/393714999328" target="_blank" rel="noopener noreferrer" className="text-foreground underline hover:text-primary">WhatsApp</a>
                      {" "}{t("shop.perInfoProdotto")}
                    </p>
                  </div>
                </div>
              </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
