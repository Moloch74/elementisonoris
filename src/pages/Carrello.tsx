import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LangContext";
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

const getImage = (url: string | null) => {
  if (!url) return vinyl1;
  return fallbackImages[url] || url;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Carrello = () => {
  const { items, loading, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  // Fetch product details for all cart items
  const productIds = items.map((i) => i.product_id);
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["cart-products", productIds],
    enabled: productIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", productIds);
      if (error) throw error;
      return data;
    },
  });

  const cartWithProducts = items.map((item) => {
    const product = products.find((p) => p.id === item.product_id);
    return { ...item, product };
  });

  const total = cartWithProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <motion.div className="text-center space-y-6" initial="hidden" animate="visible" variants={fadeUp}>
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
          <h1 className="font-display text-3xl font-bold text-foreground">{t("cart.accediPrima")}</h1>
          <p className="text-muted-foreground font-mono text-sm">{t("cart.accediDesc")}</p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-3 text-xs tracking-[0.2em] font-mono hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            {t("nav.accedi")} <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    );
  }

  const isLoading = loading || productsLoading;

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground">{t("cart.title")}</h1>
          <p className="text-muted-foreground text-sm tracking-[0.2em] mt-2 font-mono">
            {items.length} {items.length === 1 ? t("cart.articolo") : t("cart.articoli")}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <motion.div className="text-center py-20 space-y-6" initial="hidden" animate="visible" variants={fadeUp}>
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
            <h2 className="font-display text-2xl font-bold text-foreground">{t("cart.vuoto")}</h2>
            <p className="text-muted-foreground font-mono text-sm">{t("cart.vuotoDesc")}</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-3 text-xs tracking-[0.2em] font-mono hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              {t("cart.vaiAlloShop")} <ArrowRight size={14} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-0">
              {/* Header */}
              <div className="hidden md:grid grid-cols-[1fr_120px_120px_40px] gap-4 px-4 py-3 bg-secondary text-muted-foreground text-[10px] tracking-[0.2em] font-mono border border-border">
                <span>{t("cart.prodotto")}</span>
                <span className="text-center">{t("cart.quantita")}</span>
                <span className="text-right">{t("cart.subtotale")}</span>
                <span />
              </div>

              {cartWithProducts.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial="hidden"
                  animate="visible"
                  variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.4, delay: i * 0.05 } } }}
                  className="grid grid-cols-1 md:grid-cols-[1fr_120px_120px_40px] gap-4 px-4 py-4 border border-t-0 border-border items-center"
                >
                  {/* Product info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={getImage(item.product?.image_url ?? null)}
                      alt={item.product?.name || ""}
                      className="w-16 h-16 object-cover border border-border shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-foreground text-sm font-display font-semibold truncate">{item.product?.name || "..."}</p>
                      <p className="text-muted-foreground text-[10px] tracking-[0.2em] font-mono mt-0.5">
                        {item.product?.category?.toUpperCase()}
                      </p>
                      <p className="text-foreground font-mono text-sm font-bold md:hidden mt-1">
                        €{item.product ? (Number(item.product.price) * item.quantity).toFixed(2) : "0.00"}
                      </p>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center justify-center gap-0">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="border border-border p-2 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="border-y border-border px-4 py-2 text-sm font-mono text-foreground min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="border border-border p-2 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="hidden md:block text-right">
                    <span className="text-foreground font-mono text-sm font-bold">
                      €{item.product ? (Number(item.product.price) * item.quantity).toFixed(2) : "0.00"}
                    </span>
                    <p className="text-muted-foreground text-[10px] font-mono">
                      €{item.product ? Number(item.product.price).toFixed(2) : "0.00"} {t("cart.cadauno")}
                    </p>
                  </div>

                  {/* Remove */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      title={t("cart.rimuovi")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}

              <div className="flex justify-between items-center pt-4">
                <Link to="/shop" className="text-muted-foreground text-xs font-mono tracking-[0.2em] hover:text-primary transition-colors inline-flex items-center gap-2">
                  ← {t("cart.continuaShopping")}
                </Link>
                <button
                  onClick={() => { if (confirm(t("cart.svuotaConferma"))) clearCart(); }}
                  className="text-muted-foreground text-xs font-mono tracking-[0.2em] hover:text-destructive transition-colors"
                >
                  {t("cart.svuota")}
                </button>
              </div>
            </div>

            {/* Order summary */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="lg:sticky lg:top-24 h-fit">
              <div className="border border-border bg-card p-6 space-y-6">
                <h3 className="font-display text-xl font-bold text-foreground">{t("cart.riepilogo")}</h3>

                <div className="space-y-3 border-b border-border pb-4">
                  {cartWithProducts.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs font-mono">
                      <span className="text-muted-foreground truncate max-w-[60%]">{item.product?.name} × {item.quantity}</span>
                      <span className="text-foreground">€{item.product ? (Number(item.product.price) * item.quantity).toFixed(2) : "0.00"}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-mono tracking-[0.2em] text-muted-foreground">{t("cart.totale")}</span>
                  <span className="text-2xl font-display font-bold text-foreground">€{total.toFixed(2)}</span>
                </div>

                <div className="space-y-3">
                  <Button
                    disabled
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs tracking-[0.2em] rounded-none py-6 gap-2"
                  >
                    {t("cart.checkout")}
                  </Button>
                  <p className="text-muted-foreground text-[10px] font-mono tracking-wider text-center">
                    {t("shop.stripeComing")}
                  </p>
                  <p className="text-muted-foreground text-[10px] font-mono tracking-wider text-center">
                    {t("shop.perAcquistare")}{" "}
                    <a href="https://wa.me/393714999328" target="_blank" rel="noopener noreferrer" className="text-foreground underline hover:text-primary">WhatsApp</a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrello;
