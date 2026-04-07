import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import vinyl1 from "@/assets/shop/vinyl-placeholder-1.jpg";
import vinyl2 from "@/assets/shop/vinyl-placeholder-2.jpg";
import vinyl3 from "@/assets/shop/vinyl-placeholder-3.jpg";
import vinyl4 from "@/assets/shop/vinyl-placeholder-4.jpg";
import streetwear1 from "@/assets/shop/streetwear-placeholder-1.jpg";
import streetwear2 from "@/assets/shop/streetwear-placeholder-2.jpg";
import streetwear3 from "@/assets/shop/streetwear-placeholder-3.jpg";
import streetwear4 from "@/assets/shop/streetwear-placeholder-4.jpg";

type Category = "tutti" | "vinili" | "streetwear";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "vinili" | "streetwear";
  badge?: string;
  description: string;
}

const products: Product[] = [
  {
    id: "v1",
    name: "Neon Circuit EP",
    price: 18.0,
    image: vinyl1,
    category: "vinili",
    badge: "NUOVO",
    description: "Techno / Industrial — 12\" Vinyl",
  },
  {
    id: "v2",
    name: "Acid Terrain Vol. 3",
    price: 15.0,
    image: vinyl2,
    category: "vinili",
    description: "Acid Techno — 12\" Vinyl",
  },
  {
    id: "v3",
    name: "Ultimate Core",
    price: 22.0,
    image: vinyl3,
    category: "vinili",
    badge: "RARO",
    description: "Hardcore — 12\" Vinyl",
  },
  {
    id: "v4",
    name: "Tribal Mandala",
    price: 16.0,
    image: vinyl4,
    category: "vinili",
    description: "Tribal Techno — 12\" Vinyl",
  },
  {
    id: "s1",
    name: "Hoodie Essential Black",
    price: 55.0,
    image: streetwear1,
    category: "streetwear",
    badge: "BESTSELLER",
    description: "Felpa con cappuccio — 100% Cotone",
  },
  {
    id: "s2",
    name: "Rave Culture Tee",
    price: 35.0,
    image: streetwear2,
    category: "streetwear",
    description: "T-shirt grafica — Underground Print",
  },
  {
    id: "s3",
    name: "Snapback Underground",
    price: 28.0,
    image: streetwear3,
    category: "streetwear",
    description: "Cappello snapback — Logo ricamato",
  },
  {
    id: "s4",
    name: "Tote Bag Music Culture",
    price: 20.0,
    image: streetwear4,
    category: "streetwear",
    badge: "NUOVO",
    description: "Borsa in tela — Stampa serigrafica",
  },
];

const categories: { value: Category; label: string }[] = [
  { value: "tutti", label: "TUTTI" },
  { value: "vinili", label: "VINILI" },
  { value: "streetwear", label: "STREETWEAR" },
];

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("tutti");
  const [cart, setCart] = useState<string[]>([]);

  const filtered =
    activeCategory === "tutti"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const addToCart = (id: string) => {
    setCart((prev) => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
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
              VINILI & STREETWEAR — UNDERGROUND SELECTION
            </p>
          </div>
          <Button
            variant="outline"
            className="relative border-border text-foreground hover:bg-secondary"
          >
            <ShoppingCart className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-mono">
                {cart.length}
              </span>
            )}
          </Button>
        </motion.div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-10">
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group bg-card border border-border overflow-hidden hover:border-muted-foreground transition-colors"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
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
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-sm font-display font-semibold text-foreground tracking-wide uppercase">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-[11px] tracking-wider mt-1 font-mono">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground font-mono text-lg font-bold">
                    €{product.price.toFixed(2)}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => addToCart(product.id)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 text-[10px] tracking-[0.15em] font-mono rounded-none px-4"
                  >
                    AGGIUNGI
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
    </div>
  );
};

export default Shop;
