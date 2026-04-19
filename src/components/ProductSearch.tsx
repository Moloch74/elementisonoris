import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, Disc3, X, Clock, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/contexts/LangContext";

type SearchHit = {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
  badge: string | null;
};

type Props = {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
};

const STORAGE_KEY = "es:recent-searches";
const MAX_RECENT = 6;

const loadRecent = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string").slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
};

const saveRecent = (list: string[]) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_RECENT))); } catch { /* ignore */ }
};

const ProductSearch = ({ variant = "desktop", onNavigate }: Props) => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>(() => loadRecent());
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounce 200ms
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(q.trim()), 200);
    return () => window.clearTimeout(id);
  }, [q]);

  // Click outside → close
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const { data: hits = [], isFetching } = useQuery({
    queryKey: ["product-search", debounced],
    enabled: debounced.length >= 2,
    queryFn: async () => {
      const term = `%${debounced}%`;
      const { data, error } = await supabase
        .from("products")
        .select("id,name,price,category,image_url,badge,description")
        .eq("is_active", true)
        .or(`name.ilike.${term},description.ilike.${term}`)
        .limit(8);
      if (error) throw error;
      return (data || []) as SearchHit[];
    },
    staleTime: 30_000,
  });

  const pushRecent = (term: string) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, MAX_RECENT);
    setRecent(next);
    saveRecent(next);
  };

  const removeRecent = (term: string) => {
    const next = recent.filter((r) => r !== term);
    setRecent(next);
    saveRecent(next);
  };

  const clearRecent = () => {
    setRecent([]);
    saveRecent([]);
  };

  const goTo = (id: string, term?: string) => {
    if (term) pushRecent(term);
    setOpen(false);
    setQ("");
    onNavigate?.();
    navigate(`/shop?p=${id}`);
  };

  const submitAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debounced) return;
    pushRecent(debounced);
    setOpen(false);
    onNavigate?.();
    navigate(`/shop?q=${encodeURIComponent(debounced)}`);
  };

  const runRecent = (term: string) => {
    pushRecent(term);
    setQ(term);
    setOpen(false);
    onNavigate?.();
    navigate(`/shop?q=${encodeURIComponent(term)}`);
  };

  const showResults = open && debounced.length >= 2;
  const showRecent = open && debounced.length < 2 && recent.length > 0;

  const wrapperCls = variant === "desktop"
    ? "hidden lg:flex relative flex-1 max-w-xs mx-6"
    : "relative w-full";

  return (
    <div ref={wrapperRef} className={wrapperCls}>
      <form onSubmit={submitAll} className="flex items-center border border-border focus-within:border-primary transition-colors px-2 w-full bg-background">
        <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={t("nav.cercaVinili")}
          className="bg-transparent border-0 outline-none px-2 py-1.5 text-[11px] tracking-wider font-mono text-foreground placeholder:text-muted-foreground w-full"
        />
        {q && (
          <button type="button" onClick={() => { setQ(""); setOpen(true); }} className="text-muted-foreground hover:text-foreground shrink-0" aria-label="Pulisci ricerca">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {isFetching && <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin shrink-0 ml-1" />}
      </form>

      {/* Recent searches */}
      {showRecent && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-background border border-border shadow-lg max-h-[70vh] overflow-y-auto z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <span className="text-[9px] tracking-[0.25em] font-mono text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3 w-3" /> {t("search.recent") || "RICERCHE RECENTI"}
            </span>
            <button
              type="button"
              onClick={clearRecent}
              className="text-[9px] tracking-[0.2em] font-mono text-muted-foreground hover:text-primary flex items-center gap-1"
              aria-label="Cancella tutte"
            >
              <Trash2 className="h-3 w-3" /> {t("search.clearAll") || "CANCELLA TUTTE"}
            </button>
          </div>
          {recent.map((term) => (
            <div key={term} className="flex items-center border-b border-border last:border-b-0 hover:bg-secondary/60 transition-colors group">
              <button
                type="button"
                onClick={() => runRecent(term)}
                className="flex-1 flex items-center gap-2 px-3 py-2 text-left"
              >
                <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-xs font-mono text-foreground truncate">{term}</span>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeRecent(term); }}
                className="px-2.5 py-2 text-muted-foreground hover:text-destructive opacity-60 group-hover:opacity-100 transition-opacity"
                aria-label={`Rimuovi "${term}"`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Live results */}
      {showResults && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-background border border-border shadow-lg max-h-[70vh] overflow-y-auto z-50">
          {hits.length === 0 && !isFetching && (
            <div className="px-3 py-6 text-center">
              <p className="text-[10px] tracking-[0.2em] font-mono text-muted-foreground">
                {t("search.noResults")}
              </p>
            </div>
          )}
          {hits.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => goTo(h.id, debounced)}
              className="w-full flex items-center gap-3 px-3 py-2 border-b border-border last:border-b-0 hover:bg-secondary/60 transition-colors text-left"
            >
              <div className="w-10 h-10 shrink-0 bg-secondary border border-border overflow-hidden flex items-center justify-center">
                {h.image_url
                  ? <img src={h.image_url} alt="" loading="lazy" className="w-full h-full object-cover" />
                  : <Disc3 className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono font-bold text-foreground truncate uppercase">{h.name}</p>
                <p className="text-[9px] tracking-[0.2em] font-mono text-muted-foreground uppercase">{h.category}{h.badge ? ` · ${h.badge}` : ""}</p>
              </div>
              <span className="text-xs font-mono font-bold text-primary shrink-0">€{Number(h.price).toFixed(2)}</span>
            </button>
          ))}
          {hits.length > 0 && (
            <button
              type="button"
              onClick={(e) => submitAll(e)}
              className="w-full text-center text-[10px] tracking-[0.25em] font-mono font-bold text-primary hover:bg-secondary/60 py-2.5 border-t border-border"
            >
              {t("search.viewAll")} →
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
