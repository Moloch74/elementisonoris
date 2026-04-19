import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight, Disc3, ExternalLink, Store, Search, Tag, Loader2, Music2, Sparkles, X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/contexts/LangContext";
import djVinyl from "@/assets/dj-vinyl.jpg";
import vinylCrates from "@/assets/vinyl-crates.jpg";
import FloatingSticker from "@/components/FloatingSticker";
import MarqueeStrip from "@/components/MarqueeStrip";
import MarketplaceFilters, { applyFilters, defaultFilters, type MarketplaceFiltersValue } from "@/components/MarketplaceFilters";
import VinylCover from "@/components/VinylCover";

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
  updated_at: string;
};

// Cache-bust uploaded images so freshly replaced covers don't show stale browser cache
const withVersion = (url: string, updatedAt?: string) => {
  if (!url || !updatedAt) return url;
  const v = new Date(updatedAt).getTime();
  return url.includes("?") ? `${url}&v=${v}` : `${url}?v=${v}`;
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ─── SEO helper (no extra deps) ───
const useSeo = (opts: {
  title: string; description: string; canonical: string; jsonLd?: object;
}) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = opts.title;

    const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
      return el;
    };

    const desc = setMeta("description", opts.description);
    const ogTitle = setMeta("og:title", opts.title, "property");
    const ogDesc = setMeta("og:description", opts.description, "property");
    const twTitle = setMeta("twitter:title", opts.title);
    const twDesc = setMeta("twitter:description", opts.description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const created = !canonical;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = opts.canonical;

    let ld: HTMLScriptElement | null = null;
    if (opts.jsonLd) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.text = JSON.stringify(opts.jsonLd);
      ld.dataset.seo = "catalogo";
      document.head.appendChild(ld);
    }

    return () => {
      document.title = prevTitle;
      if (created && canonical?.parentNode) canonical.parentNode.removeChild(canonical);
      if (ld?.parentNode) ld.parentNode.removeChild(ld);
      // leave meta tags in place (harmless)
      void desc; void ogTitle; void ogDesc; void twTitle; void twDesc;
    };
  }, [opts.title, opts.description, opts.canonical, JSON.stringify(opts.jsonLd ?? {})]);
};

const Catalogo = () => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<MarketplaceFiltersValue>(() => ({
    ...defaultFilters,
    q: searchParams.get("q") || "",
    genre: (searchParams.get("g") || "ALL").toUpperCase(),
  }));

  // Sync URL ←→ filters (only q & g for shareable links)
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (filters.q) next.set("q", filters.q); else next.delete("q");
    if (filters.genre !== "ALL") next.set("g", filters.genre); else next.delete("g");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.q, filters.genre]);

  // ─── Fetch vinyls (queryKey aligned with Admin invalidation) ───
  const { data: vinyls = [], isLoading } = useQuery({
    queryKey: ["products", "catalogo-vinili"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,description,price,stock,badge,image_url,is_featured,genre,created_at,updated_at")
        .eq("is_active", true)
        .eq("category", "vinili")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data || []) as Vinyl[];
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  // Listen for any "products" invalidation from admin and stay fresh
  // (queryKey starts with "products" so refetches happen automatically via React Query)

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

  const featured = useMemo(
    () => vinyls.filter((v) => v.is_featured && v.image_url).slice(0, 5),
    [vinyls]
  );

  const filtered = useMemo(() => applyFilters(vinyls, filters), [vinyls, filters]);

  const related = useMemo(() => {
    let pool = vinyls.filter((v) => !filtered.find((f) => f.id === v.id));
    if (filters.genre !== "ALL") {
      pool = pool.filter((v) => (v.genre || "").trim().toUpperCase() === filters.genre);
    } else {
      pool = pool.filter((v) => v.is_featured);
    }
    if (pool.length < 4) {
      const extra = vinyls.filter((v) => !pool.find((p) => p.id === v.id) && !filtered.find((f) => f.id === v.id));
      pool = pool.concat(extra);
    }
    return pool.slice(0, 8);
  }, [vinyls, filtered, filters.genre]);

  const goProduct = (id: string) => navigate(`/shop?p=${id}`);

  // ─── SEO ───
  const seoTitle = filters.genre !== "ALL"
    ? `Vinili ${filters.genre} — Catalogo Elementi Sonori Lecce`
    : "Catalogo Vinili Underground — Elementi Sonori Lecce";
  const seoDesc = filters.genre !== "ALL"
    ? `Sfoglia i nostri vinili ${filters.genre.toLowerCase()}: ${genres.find((g) => g.name === filters.genre)?.count ?? 0} dischi disponibili nello shop di Lecce di Elementi Sonori.`
    : `Catalogo completo di ${vinyls.length} vinili underground — techno, acid, hardcore, freetekno e oltre. Spedizioni dall'Italia, ritiro in negozio a Lecce.`;
  const canonical = typeof window !== "undefined"
    ? `${window.location.origin}/catalogo${filters.genre !== "ALL" ? `?g=${encodeURIComponent(filters.genre)}` : ""}`
    : "https://elementisonori.lovable.app/catalogo";

  useSeo({
    title: seoTitle,
    description: seoDesc,
    canonical,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": seoTitle,
      "description": seoDesc,
      "url": canonical,
      "numberOfItems": filtered.length,
      "isPartOf": {
        "@type": "WebSite",
        "name": "Elementi Sonori",
        "url": typeof window !== "undefined" ? window.location.origin : "https://elementisonori.lovable.app",
      },
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": filtered.length,
        "itemListElement": filtered.slice(0, 20).map((v, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "url": typeof window !== "undefined" ? `${window.location.origin}/shop?p=${v.id}` : undefined,
          "name": v.name,
        })),
      },
    },
  });

  return (
    <div className="pt-16 relative">
      {/* ─── Immersive Hero ─── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden border-b border-border">
        {/* Background: vinyl photo + featured grid collage */}
        <div className="absolute inset-0">
          <img src={djVinyl} alt="" className="w-full h-full object-cover opacity-25" loading="eager" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
        </div>

        {/* Featured covers floating in background */}
        {featured.length > 0 && (
          <div className="absolute inset-0 grid grid-cols-5 gap-2 p-4 opacity-20 pointer-events-none">
            {featured.slice(0, 5).map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                className={`hidden md:block aspect-square overflow-hidden border border-border ${i % 2 === 0 ? "translate-y-12" : "-translate-y-6"}`}
              >
                <VinylCover
                  src={withVersion(v.image_url!, v.updated_at)}
                  name={v.name}
                  alt=""
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        )}

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center py-20">
          <motion.p className="text-primary text-xs tracking-[0.4em] font-mono mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            UNDERGROUND VINYL CATALOG
          </motion.p>
          <motion.h1
            className="font-display text-6xl md:text-8xl lg:text-9xl font-bold leading-none mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            CATALOGO
          </motion.h1>
          <motion.p
            className="text-foreground/80 text-base md:text-lg font-mono max-w-2xl mx-auto mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Techno, acid, hardcore, freetekno. Vinili selezionati a mano nel nostro shop di Lecce.
            Sfoglia, ascolta l'anteprima e ordina online.
          </motion.p>

          {/* Live stats */}
          <motion.div
            className="flex justify-center gap-px bg-border max-w-xl mx-auto mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex-1 bg-background/80 backdrop-blur px-4 py-3 text-center">
              <p className="font-display text-2xl md:text-3xl font-bold text-primary">{vinyls.length}</p>
              <p className="text-[9px] tracking-[0.25em] font-mono text-muted-foreground mt-1">VINILI</p>
            </div>
            <div className="flex-1 bg-background/80 backdrop-blur px-4 py-3 text-center">
              <p className="font-display text-2xl md:text-3xl font-bold text-primary">{genres.length}</p>
              <p className="text-[9px] tracking-[0.25em] font-mono text-muted-foreground mt-1">GENERI</p>
            </div>
            <div className="flex-1 bg-background/80 backdrop-blur px-4 py-3 text-center">
              <p className="font-display text-2xl md:text-3xl font-bold text-primary">{vinyls.filter((v) => v.is_featured).length}</p>
              <p className="text-[9px] tracking-[0.25em] font-mono text-muted-foreground mt-1">IN EVIDENZA</p>
            </div>
          </motion.div>

          <motion.a
            href="#griglia"
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.4em] font-mono text-primary border-b border-primary/40 hover:border-primary pb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            ESPLORA IL CATALOGO ↓
          </motion.a>
        </div>

        <FloatingSticker className="absolute top-10 right-10 hidden lg:block" size={100} spin />
      </section>

      <MarqueeStrip />

      {/* ─── Featured strip ─── */}
      {featured.length > 0 && (
        <section className="py-10 border-b border-border bg-secondary/20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl md:text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> IN EVIDENZA
              </h2>
              <span className="text-[10px] tracking-[0.25em] font-mono text-muted-foreground">SCELTI DA NOI</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-border">
              {featured.map((v) => (
                <button
                  key={v.id}
                  onClick={() => goProduct(v.id)}
                  className="bg-background group relative overflow-hidden text-left"
                >
                  <div className="aspect-square overflow-hidden">
                    <VinylCover
                      src={withVersion(v.image_url!, v.updated_at)}
                      name={v.name}
                      alt={`${v.name} — vinile ${v.genre || ""}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-90 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="font-display text-sm font-bold uppercase truncate">{v.name}</p>
                    <div className="flex justify-between items-end mt-1">
                      <span className="text-[9px] tracking-[0.2em] font-mono text-muted-foreground uppercase truncate">{v.genre || "—"}</span>
                      <span className="text-sm font-mono font-bold text-primary">€{Number(v.price).toFixed(2)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Filters toolbar (sticky) ─── */}
      <div id="griglia" />
      <MarketplaceFilters
        value={filters}
        onChange={setFilters}
        genres={genres}
        totalCount={vinyls.length}
        allLabel="TUTTI"
      />

      {/* ─── Results grid ─── */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">
                {filtered.length} {filtered.length === 1 ? "RISULTATO" : "RISULTATI"}
              </h2>
              {(filters.genre !== "ALL" || filters.q) && (
                <p className="text-[10px] tracking-[0.2em] font-mono text-muted-foreground mt-1">
                  {filters.genre !== "ALL" && <>GENERE: <span className="text-primary">{filters.genre}</span> · </>}
                  {filters.q && <>RICERCA: <span className="text-primary">"{filters.q.toUpperCase()}"</span></>}
                </p>
              )}
            </div>
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
                  aria-label={`${v.name} — €${Number(v.price).toFixed(2)}`}
                >
                  <div className="aspect-square bg-secondary border border-border overflow-hidden flex items-center justify-center mb-3 relative">
                    <VinylCover
                      src={v.image_url ? withVersion(v.image_url, v.updated_at) : null}
                      name={v.name}
                      alt={`${v.name}${v.genre ? ` — vinile ${v.genre.toLowerCase()}` : ""}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
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
                  {filters.genre !== "ALL" ? `ALTRI ${filters.genre}` : "POTREBBERO PIACERTI"}
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
              <img src={vinylCrates} alt="Casse vinili Elementi Sonori Lecce" className="w-full aspect-[4/5] object-cover" loading="lazy" />
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
