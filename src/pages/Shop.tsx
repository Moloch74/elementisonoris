import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Filter, Loader2, X, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LangContext";
import { useNavigate } from "react-router-dom";
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

const categories: { value: Category; label: string }[] = [
  { value: "tutti", label: "TUTTI" },
  { value: "vinili", label: "VINILI" },
  { value: "streetwear", label: "STREETWEAR" },
  { value: "gadgets", label: "GADGETS" },
];

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
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("tutti");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addItem, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const filtered =
    activeCategory === "tutti"
      ? products
      : products.filter((p) => p.category === activeCategory);

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
      vinili: "VINILI",
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
              SHOP
            </h1>
            <p className="text-muted-foreground text-sm tracking-[0.2em] mt-2 font-mono">
              VINILI · STREETWEAR · GADGETS — UNDERGROUND SELECTION
            </p>
          </div>
          <Button
            variant="outline"
            className="relative border-border text-foreground hover:bg-secondary"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-mono">
                {itemCount}
              </span>
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

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group bg-card border border-border overflow-hidden hover:border-muted-foreground transition-colors cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={getImage(product.image_url)}
                    alt={product.name}
                    loading="lazy"
                    width={512}
                    height={512}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] tracking-[0.15em] font-mono rounded-none">
                      {product.badge}
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="text-foreground text-xs font-mono tracking-[0.2em] bg-background/80 px-4 py-2 border border-border">
                      DETTAGLI
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-muted-foreground text-[10px] tracking-[0.2em] font-mono mb-1">
                      {getCategoryLabel(product.category)}
                    </p>
                    <h3 className="text-sm font-display font-semibold text-foreground tracking-wide uppercase">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-[11px] tracking-wider mt-1 font-mono line-clamp-1">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-mono text-lg font-bold">
                      €{Number(product.price).toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product.id);
                      }}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] tracking-[0.15em] font-mono rounded-none px-4"
                    >
                      AGGIUNGI
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Coming soon banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 border border-border bg-card p-8 text-center"
        >
          <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">
            PAGAMENTO ONLINE IN ARRIVO — STRIPE INTEGRATION COMING SOON
          </p>
          <p className="text-muted-foreground text-[11px] mt-2 font-mono">
            Per acquistare contattaci via{" "}
            <a
              href="https://wa.me/393714999328"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline hover:text-primary transition-colors"
            >
              WhatsApp
            </a>{" "}
            o{" "}
            <a
              href="https://www.instagram.com/elementi_sonori/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline hover:text-primary transition-colors"
            >
              Instagram
            </a>
          </p>
        </motion.div>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-card border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground transition-colors bg-card/80 p-2"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image */}
                <div className="aspect-square overflow-hidden">
                  <img
                    src={getImage(selectedProduct.image_url)}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="p-6 md:p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <p className="text-muted-foreground text-[10px] tracking-[0.3em] font-mono mb-2">
                        {getCategoryLabel(selectedProduct.category)}
                      </p>
                      {selectedProduct.badge && (
                        <Badge className="bg-primary text-primary-foreground text-[10px] tracking-[0.15em] font-mono rounded-none mb-3">
                          {selectedProduct.badge}
                        </Badge>
                      )}
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground tracking-wide uppercase">
                        {selectedProduct.name}
                      </h2>
                    </div>

                    <p className="text-muted-foreground text-sm font-mono tracking-wider leading-relaxed">
                      {selectedProduct.description}
                    </p>

                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span className="text-xs font-mono tracking-wider">
                          {selectedProduct.stock > 0
                            ? `${selectedProduct.stock} disponibil${selectedProduct.stock === 1 ? "e" : "i"}`
                            : "ESAURITO"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Truck className="h-4 w-4" />
                        <span className="text-xs font-mono tracking-wider">
                          Spedizione in tutta Italia
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-end justify-between">
                      <span className="text-foreground font-mono text-3xl font-bold">
                        €{Number(selectedProduct.price).toFixed(2)}
                      </span>
                    </div>

                    <Button
                      onClick={() => {
                        handleAddToCart(selectedProduct.id);
                        setSelectedProduct(null);
                      }}
                      disabled={selectedProduct.stock === 0}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs tracking-[0.2em] font-mono rounded-none py-6"
                    >
                      {selectedProduct.stock > 0 ? "AGGIUNGI AL CARRELLO" : "ESAURITO"}
                    </Button>

                    <p className="text-muted-foreground text-[10px] font-mono tracking-wider text-center">
                      Contattaci su{" "}
                      <a
                        href="https://wa.me/393714999328"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground underline hover:text-primary"
                      >
                        WhatsApp
                      </a>{" "}
                      per info su questo prodotto
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
