import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight, Disc3, ExternalLink, Store, Search, X,
  SlidersHorizontal, Loader2, ArrowDownAZ, ArrowUpAZ, ArrowDown01, ArrowUp10, Sparkles, Tag,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/contexts/LangContext";
import djVinyl from "@/assets/dj-vinyl.jpg";
import vinylCrates from "@/assets/vinyl-crates.jpg";
import FloatingSticker from "@/components/FloatingSticker";
import MarqueeStrip from "@/components/MarqueeStrip";

const DISCOGS_BASE = "https://www.discogs.com/seller/Elementisonori_Shop/profile";

type Vinyl = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  badge: string | null;
  image_url: string | null;
  is_featured: boolean;
  genre: string | null;
  created_at: string;
};

type SortKey = "newest" | "az" | "za" | "price-asc" | "price-desc" | "featured";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Catalogo = () => {
  const { t } = useLang();
  const navigate = useNavigate();

  // ─── State ───
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [genre, setGenre] = useState<string>("ALL");
  const [sort, setSort] = useState<SortKey>("newest");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [withImageOnly, setWithImageOnly] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(q.trim().toLowerCase()), 200);
    return () => window.clearTimeout(id);
  }, [q]);

  // ─── Fetch all active vinyls (single query, client-side filter for snappy UX) ───
  const { data: vinyls = [], isLoading } = useQuery({
    queryKey: ["catalogo-vinyls"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,description,price,stock,badge,image_url,is_featured,genre,created_at")
        .eq("is_active", true)
        .eq("category", "vinili")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data || []) as Vinyl[];
    },
    staleTime: 60_000,
  });

  // ─── Genres auto-discovered from DB ───
  const genres = useMemo(() => {
    const map = new Map<string, number>();
    vinyls.forEach((v) => {
      const g = (v.genre || "").trim().toUpperCase();
      if (g) map.set(g, (map.get(g) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [vinyls]);

  // ─── Filtered & sorted ───
  const filtered = useMemo(() => {
    let list = vinyls.slice();
    if (debounced.length >= 1) {
      list = list.filter((v) => {
        const hay = `${v.name} ${v.description || ""} ${v.genre || ""} ${v.badge || ""}`.toLowerCase();
        return hay.includes(debounced);
      });
    }
    if (genre !== "ALL") list = list.filter((v) => (v.genre || "").trim().toUpperCase() === genre);
    if (inStockOnly) list = list.filter((v) => v.stock > 0);
    if (featuredOnly) list = list.filter((v) => v.is_featured);
    if (withImageOnly) list = list.filter((v) => !!v.image_url);
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min)) list = list.filter((v) => Number(v.price) >= min);
    if (!isNaN(max)) list = list.filter((v) => Number(v.price) <= max);
    switch (sort) {
      case "az": list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "za": list.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "price-asc": list.sort((a, b) => Number(a.price) - Number(b.price)); break;
      case "price-desc": list.sort((a, b) => Number(b.price) - Number(a.price)); break;
      case "featured": list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured)); break;
      default: break; // newest already from query
    }
    return list;
  }, [vinyls, debounced, genre, sort, minPrice, maxPrice, inStockOnly, featuredOnly, withImageOnly]);

  // ─── Related: by selected genre, otherwise featured ───
  const related = useMemo(() => {
    let pool = vinyls.filter((v) => !filtered.find((f) => f.id === v.id));
    if (genre !== "ALL") {
      pool = pool.filter((v) => (v.genre || "").trim().toUpperCase() === genre);
    } else {
      pool = pool.filter((v) => v.is_featured);
    }
    if (pool.length < 4) {
      const extra = vinyls.filter((v) => !pool.find((p) => p.id === v.id) && !filtered.find((f) => f.id === v.id));
      pool = pool.concat(extra);
    }
    return pool.slice(0, 8);
  }, [vinyls, filtered, genre]);

  const resetAll = () => {
    setQ(""); setGenre("ALL"); setSort("newest");
    setMinPrice(""); setMaxPrice("");
    setInStockOnly(false); setFeaturedOnly(false); setWithImageOnly(false);
  };

  const activeFiltersCount =
    (debounced ? 1 : 0) + (genre !== "ALL" ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) +
    (inStockOnly ? 1 : 0) + (featuredOnly ? 1 : 0) + (withImageOnly ? 1 : 0);

  const goProduct = (id: string) => navigate(`/shop?p=${id}`);

  return (
    <div className="pt-16 relative">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={djVinyl} alt="" className="w-full h-full object-cover opacity-15" loading="lazy" width={1280} height={960} />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.p className="text-primary text-xs tracking-[0.4em] font-mono mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {t("catalogo.heroSubtitle") || "MARKETPLACE UNDERGROUND"}
          </motion.p>
          <motion.h1 className="font-display text-6xl md:text-8xl font-bold" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {t("catalogo.title") || "CATALOGO"}
          </motion.h1>
          <motion.p className="text-muted-foreground text-xs tracking-[0.3em] font-mono mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {vinyls.length} VINILI · {genres.length} GENERI
          </motion.p>
        </div>
        <FloatingSticker className="absolute top-10 right-10 hidden lg:block" size={100} spin />
      </section>

      <MarqueeStrip />

      {/* ─── Marketplace toolbar ─── */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 md:px-8 py-4 space-y-3">
          {/* Search bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center border border-border focus-within:border-primary transition-colors px-3 bg-background">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="CERCA PER ARTISTA, TITOLO, ETICHETTA, GENERE..."
                className="bg-transparent border-0 outline-none px-3 py-2.5 text-xs tracking-wider font-mono text-foreground placeholder:text-muted-foreground w-full uppercase"
              />
              {q && (
                <button type="button" onClick={() => setQ("")} className="text-muted-foreground hover:text-foreground" aria-label="Pulisci">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setAdvancedOpen((v) => !v)}
              className={`flex items-center gap-2 px-3 py-2.5 border text-[10px] tracking-[0.2em] font-mono transition-colors ${
                advancedOpen || activeFiltersCount > 0
                  ? "border-primary text-primary bg-primary/5"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">RICERCA AVANZATA</span>
              {activeFiltersCount > 0 && (
                <span className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0.5 font-bold">{activeFiltersCount}</span>
              )}
            </button>
          </div>

          {/* Genre chips (auto-discovered) + Sort */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setGenre("ALL")}
              className={`text-[10px] tracking-[0.15em] font-mono px-3 py-1.5 border transition-all ${
                genre === "ALL" ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              TUTTI ({vinyls.length})
            </button>
            {genres.map((g) => (
              <button
                key={g.name}
                onClick={() => setGenre(g.name)}
                className={`text-[10px] tracking-[0.15em] font-mono px-3 py-1.5 border transition-all ${
                  genre === g.name ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {g.name} ({g.count})
              </button>
            ))}
            {genres.length === 0 && !isLoading && (
              <span className="text-[10px] font-mono text-muted-foreground italic">
                Nessun genere ancora — aggiungi il campo "GENERE" ai vinili dal pannello admin.
              </span>
            )}

            <div className="ml-auto flex items-center gap-2">
              <span className="text-[10px] tracking-[0.2em] font-mono text-muted-foreground hidden md:inline">ORDINA</span>
              <div className="flex border border-border">
                {([
                  { k: "newest" as SortKey, icon: Sparkles, label: "NUOVI" },
                  { k: "az" as SortKey, icon: ArrowDownAZ, label: "A-Z" },
                  { k: "za" as SortKey, icon: ArrowUpAZ, label: "Z-A" },
                  { k: "price-asc" as SortKey, icon: ArrowDown01, label: "€↑" },
                  { k: "price-desc" as SortKey, icon: ArrowUp10, label: "€↓" },
                ]).map(({ k, icon: Icon, label }) => (
                  <button
                    key={k}
                    onClick={() => setSort(k)}
                    title={label}
                    className={`flex items-center gap-1 px-2 py-1.5 text-[9px] tracking-wider font-mono border-r border-border last:border-r-0 transition-colors ${
                      sort === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    <span className="hidden lg:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced search panel */}
          {advancedOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="border border-border bg-secondary/30 p-4 grid grid-cols-2 md:grid-cols-5 gap-3"
            >
              <div>
                <label className="text-[10px] tracking-[0.2em] font-mono text-muted-foreground block mb-1">PREZZO MIN €</label>
                <input
                  type="number" min="0" step="0.5" value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-background border border-border px-2 py-1.5 text-xs font-mono outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.2em] font-mono text-muted-foreground block mb-1">PREZZO MAX €</label>
                <input
                  type="number" min="0" step="0.5" value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-background border border-border px-2 py-1.5 text-xs font-mono outline-none focus:border-primary"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-[10px] tracking-[0.2em] font-mono text-foreground">
                <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-primary" />
                SOLO DISPONIBILI
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[10px] tracking-[0.2em] font-mono text-foreground">
                <input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} className="accent-primary" />
                IN EVIDENZA
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[10px] tracking-[0.2em] font-mono text-foreground">
                <input type="checkbox" checked={withImageOnly} onChange={(e) => setWithImageOnly(e.target.checked)} className="accent-primary" />
                CON FOTO
              </label>
              <button
                onClick={resetAll}
                className="md:col-span-5 text-[10px] tracking-[0.25em] font-mono text-primary hover:underline justify-self-start"
              >
                AZZERA TUTTI I FILTRI
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── Results grid ─── */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">
                {filtered.length} {filtered.length === 1 ? "RISULTATO" : "RISULTATI"}
              </h2>
              {(genre !== "ALL" || debounced) && (
                <p className="text-[10px] tracking-[0.2em] font-mono text-muted-foreground mt-1">
                  {genre !== "ALL" && <>GENERE: <span className="text-primary">{genre}</span> · </>}
                  {debounced && <>RICERCA: <span className="text-primary">"{debounced.toUpperCase()}"</span></>}
                </p>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <button onClick={resetAll} className="text-[10px] tracking-[0.25em] font-mono text-muted-foreground hover:text-primary flex items-center gap-1">
                <X className="h-3 w-3" /> AZZERA
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="border border-dashed border-border py-20 text-center">
              <Disc3 className="h-10 w-10 mx-auto text-muted-foreground mb-3" strokeWidth={1.5} />
              <p className="text-xs tracking-[0.25em] font-mono text-muted-foreground mb-1">NESSUN VINILE TROVATO</p>
              <p className="text-[10px] font-mono text-muted-foreground">Prova ad azzerare i filtri o cercare su Discogs in fondo alla pagina.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border">
              {filtered.map((v, i) => (
                <motion.button
                  key={v.id}
                  type="button"
                  onClick={() => goProduct(v.id)}
                  className="bg-background p-4 text-left group hover:bg-secondary/40 transition-colors flex flex-col"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "100px" }}
                  variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.35, delay: Math.min(i * 0.02, 0.3) } } }}
                >
                  <div className="aspect-square bg-secondary border border-border overflow-hidden flex items-center justify-center mb-3 relative">
                    {v.image_url ? (
                      <img src={v.image_url} alt={v.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <Disc3 className="h-12 w-12 text-muted-foreground" strokeWidth={1.2} />
                    )}
                    {v.is_featured && (
                      <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[8px] tracking-[0.2em] font-mono px-1.5 py-0.5">★</span>
                    )}
                    {v.badge && (
                      <span className="absolute top-2 right-2 bg-background/90 border border-border text-foreground text-[8px] tracking-[0.2em] font-mono px-1.5 py-0.5">{v.badge}</span>
                    )}
                    {v.stock === 0 && (
                      <span className="absolute bottom-2 left-2 bg-destructive/90 text-destructive-foreground text-[8px] tracking-[0.2em] font-mono px-1.5 py-0.5">SOLD OUT</span>
                    )}
                  </div>
                  <h3 className="font-display text-sm font-bold uppercase truncate group-hover:text-primary transition-colors">{v.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] tracking-[0.2em] font-mono text-muted-foreground uppercase truncate">
                      {v.genre || "—"}
                    </span>
                    <span className="text-sm font-mono font-bold text-primary shrink-0 ml-2">€{Number(v.price).toFixed(2)}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Related ─── */}
      {related.length > 0 && (
        <section className="py-16 border-t border-border bg-secondary/20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-primary text-[10px] tracking-[0.4em] font-mono mb-1 flex items-center gap-2">
                  <Tag className="h-3 w-3" /> CORRELATI
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-bold">
                  {genre !== "ALL" ? `ALTRI ${genre}` : "POTREBBERO PIACERTI"}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-px bg-border">
              {related.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => goProduct(v.id)}
                  className="bg-background p-3 text-left group hover:bg-secondary/40 transition-colors"
                >
                  <div className="aspect-square bg-secondary border border-border overflow-hidden flex items-center justify-center mb-2">
                    {v.image_url ? (
                      <img src={v.image_url} alt={v.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <Disc3 className="h-8 w-8 text-muted-foreground" strokeWidth={1.2} />
                    )}
                  </div>
                  <p className="text-[10px] font-mono font-bold uppercase truncate group-hover:text-primary">{v.name}</p>
                  <p className="text-[9px] font-mono text-primary">€{Number(v.price).toFixed(2)}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Discogs fallback ─── */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <p className="text-primary text-[10px] tracking-[0.4em] font-mono mb-2">CERCA ANCHE SU</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                IL NOSTRO CATALOGO <span className="text-gradient-neon">DISCOGS</span>
              </h2>
              <p className="text-muted-foreground text-sm font-mono mb-6 leading-relaxed">
                Oltre ai vinili in negozio puoi sfogliare la nostra selezione completa su Discogs:
                centinaia di titoli underground già catalogati con condizione, etichetta e numero catalogo.
              </p>
              <div className="grid grid-cols-3 gap-px bg-border mb-6">
                {[
                  { num: "01", title: "IN NEGOZIO", desc: "Vieni a Lecce, ascolta prima di acquistare", icon: Store },
                  { num: "02", title: "SU DISCOGS", desc: "Spedizioni in tutta Italia ed Europa", icon: Search },
                  { num: "03", title: "WHATSAPP", desc: "Riserve e richieste personalizzate", icon: ExternalLink },
                ].map((s) => (
                  <div key={s.num} className="bg-background p-4 text-center">
                    <s.icon size={20} className="mx-auto mb-2 text-primary" />
                    <p className="font-display text-xs font-bold mb-1">{s.title}</p>
                    <p className="text-[9px] font-mono text-muted-foreground leading-tight">{s.desc}</p>
                  </div>
                ))}
              </div>
              <a
                href={DISCOGS_BASE}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-primary text-primary px-8 py-3 text-xs tracking-[0.2em] font-mono hover:bg-primary hover:text-primary-foreground transition-all"
              >
                APRI SHOP DISCOGS <ArrowUpRight size={16} />
              </a>
            </motion.div>
            <motion.div className="relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <img src={vinylCrates} alt="Casse vinili" className="w-full aspect-[4/5] object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-primary text-[10px] tracking-[0.3em] font-mono mb-2">AGGIORNATO QUOTIDIANAMENTE</p>
                <p className="text-foreground text-sm font-mono">Catalogo reale dal nostro shop di Lecce.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FloatingSticker className="absolute bottom-40 left-5 hidden xl:block" size={80} />
    </div>
  );
};

export default Catalogo;
