import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search, X, SlidersHorizontal, ArrowDownAZ, ArrowUpAZ, ArrowDown01, ArrowUp10, Sparkles,
} from "lucide-react";

export type SortKey = "newest" | "az" | "za" | "price-asc" | "price-desc" | "featured";

export type MarketplaceFiltersValue = {
  q: string;
  genre: string; // "ALL" or genre name
  sort: SortKey;
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
  featuredOnly: boolean;
  withImageOnly: boolean;
};

export const defaultFilters: MarketplaceFiltersValue = {
  q: "", genre: "ALL", sort: "newest",
  minPrice: "", maxPrice: "",
  inStockOnly: false, featuredOnly: false, withImageOnly: false,
};

type Props = {
  value: MarketplaceFiltersValue;
  onChange: (next: MarketplaceFiltersValue) => void;
  genres: { name: string; count: number }[];
  totalCount: number;
  /** label for the "all" pill, e.g. "TUTTI" or "TUTTI I VINILI" */
  allLabel?: string;
  /** Sticky offset top class, default top-16 (under navbar) */
  stickyTopClass?: string;
  showGenres?: boolean;
};

const MarketplaceFilters = ({
  value, onChange, genres, totalCount,
  allLabel = "TUTTI",
  stickyTopClass = "top-16",
  showGenres = true,
}: Props) => {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [localQ, setLocalQ] = useState(value.q);

  // keep external value in sync (e.g. cleared from outside)
  useEffect(() => { setLocalQ(value.q); }, [value.q]);

  // Debounce text input → propagate
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (localQ !== value.q) onChange({ ...value, q: localQ });
    }, 200);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localQ]);

  const set = <K extends keyof MarketplaceFiltersValue>(k: K, v: MarketplaceFiltersValue[K]) =>
    onChange({ ...value, [k]: v });

  const activeFiltersCount =
    (value.q ? 1 : 0) + (value.genre !== "ALL" ? 1 : 0) + (value.minPrice ? 1 : 0) + (value.maxPrice ? 1 : 0) +
    (value.inStockOnly ? 1 : 0) + (value.featuredOnly ? 1 : 0) + (value.withImageOnly ? 1 : 0);

  const reset = () => { setLocalQ(""); onChange(defaultFilters); };

  return (
    <section className={`sticky ${stickyTopClass} z-30 bg-background/95 backdrop-blur border-b border-border`}>
      <div className="container mx-auto px-4 md:px-8 py-4 space-y-3">
        {/* Search bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center border border-border focus-within:border-primary transition-colors px-3 bg-background">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={localQ}
              onChange={(e) => setLocalQ(e.target.value)}
              placeholder="CERCA PER ARTISTA, TITOLO, ETICHETTA, GENERE..."
              className="bg-transparent border-0 outline-none px-3 py-2.5 text-xs tracking-wider font-mono text-foreground placeholder:text-muted-foreground w-full uppercase"
              aria-label="Cerca nel catalogo"
            />
            {localQ && (
              <button type="button" onClick={() => setLocalQ("")} className="text-muted-foreground hover:text-foreground" aria-label="Pulisci ricerca">
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

        {/* Genre chips + sort */}
        <div className="flex flex-wrap items-center gap-2">
          {showGenres && (
            <>
              <button
                onClick={() => set("genre", "ALL")}
                className={`text-[10px] tracking-[0.15em] font-mono px-3 py-1.5 border transition-all ${
                  value.genre === "ALL" ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {allLabel} ({totalCount})
              </button>
              {genres.map((g) => (
                <button
                  key={g.name}
                  onClick={() => set("genre", g.name)}
                  className={`text-[10px] tracking-[0.15em] font-mono px-3 py-1.5 border transition-all ${
                    value.genre === g.name ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {g.name} ({g.count})
                </button>
              ))}
            </>
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
                  onClick={() => set("sort", k)}
                  title={label}
                  aria-label={`Ordina ${label}`}
                  className={`flex items-center gap-1 px-2 py-1.5 text-[9px] tracking-wider font-mono border-r border-border last:border-r-0 transition-colors ${
                    value.sort === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span className="hidden lg:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced */}
        {advancedOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="border border-border bg-secondary/30 p-4 grid grid-cols-2 md:grid-cols-5 gap-3"
          >
            <div>
              <label className="text-[10px] tracking-[0.2em] font-mono text-muted-foreground block mb-1">PREZZO MIN €</label>
              <input
                type="number" min="0" step="0.5" value={value.minPrice}
                onChange={(e) => set("minPrice", e.target.value)}
                className="w-full bg-background border border-border px-2 py-1.5 text-xs font-mono outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.2em] font-mono text-muted-foreground block mb-1">PREZZO MAX €</label>
              <input
                type="number" min="0" step="0.5" value={value.maxPrice}
                onChange={(e) => set("maxPrice", e.target.value)}
                className="w-full bg-background border border-border px-2 py-1.5 text-xs font-mono outline-none focus:border-primary"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-[10px] tracking-[0.2em] font-mono text-foreground">
              <input type="checkbox" checked={value.inStockOnly} onChange={(e) => set("inStockOnly", e.target.checked)} className="accent-primary" />
              SOLO DISPONIBILI
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[10px] tracking-[0.2em] font-mono text-foreground">
              <input type="checkbox" checked={value.featuredOnly} onChange={(e) => set("featuredOnly", e.target.checked)} className="accent-primary" />
              IN EVIDENZA
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[10px] tracking-[0.2em] font-mono text-foreground">
              <input type="checkbox" checked={value.withImageOnly} onChange={(e) => set("withImageOnly", e.target.checked)} className="accent-primary" />
              CON FOTO
            </label>
            <button
              onClick={reset}
              className="md:col-span-5 text-[10px] tracking-[0.25em] font-mono text-primary hover:underline justify-self-start"
            >
              AZZERA TUTTI I FILTRI
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MarketplaceFilters;

/** Apply filters & sorting to a generic product list */
export function applyFilters<T extends {
  name: string; description?: string | null; price: number | string; stock: number;
  badge?: string | null; image_url?: string | null; is_featured?: boolean | null;
  genre?: string | null; created_at?: string;
}>(items: T[], v: MarketplaceFiltersValue): T[] {
  let list = items.slice();
  const q = v.q.trim().toLowerCase();
  if (q) {
    list = list.filter((p) => {
      const hay = `${p.name} ${p.description ?? ""} ${p.genre ?? ""} ${p.badge ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }
  if (v.genre !== "ALL") list = list.filter((p) => (p.genre || "").trim().toUpperCase() === v.genre);
  if (v.inStockOnly) list = list.filter((p) => p.stock > 0);
  if (v.featuredOnly) list = list.filter((p) => !!p.is_featured);
  if (v.withImageOnly) list = list.filter((p) => !!p.image_url);
  const min = parseFloat(v.minPrice);
  const max = parseFloat(v.maxPrice);
  if (!isNaN(min)) list = list.filter((p) => Number(p.price) >= min);
  if (!isNaN(max)) list = list.filter((p) => Number(p.price) <= max);
  switch (v.sort) {
    case "az": list.sort((a, b) => a.name.localeCompare(b.name)); break;
    case "za": list.sort((a, b) => b.name.localeCompare(a.name)); break;
    case "price-asc": list.sort((a, b) => Number(a.price) - Number(b.price)); break;
    case "price-desc": list.sort((a, b) => Number(b.price) - Number(a.price)); break;
    case "featured": list.sort((a, b) => Number(b.is_featured ?? 0) - Number(a.is_featured ?? 0)); break;
    default: break;
  }
  return list;
}
