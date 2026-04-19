import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, LogOut, User, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LangContext";
import ProductSearch from "@/components/ProductSearch";
import logoCircular from "@/assets/logo-circular.jpg";

const LangSwitch = () => {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-0 border border-border overflow-hidden">
      <button onClick={() => setLang("it")} className={`px-2 py-1 text-[9px] tracking-[0.15em] font-mono font-bold transition-all ${lang === "it" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>IT</button>
      <button onClick={() => setLang("en")} className={`px-2 py-1 text-[9px] tracking-[0.15em] font-mono font-bold transition-all ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>EN</button>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  const { t } = useLang();
  const { isAdmin } = useAdmin();

  const displayName = user?.email?.split("@")[0] || "";

  const navItems = [
    { label: t("nav.chiSiamo"), path: "/chi-siamo" },
    { label: t("nav.catalogo"), path: "/catalogo" },
    { label: t("nav.shop"), path: "/shop" },
    { label: t("nav.eventi"), path: "/eventi" },
    { label: t("nav.contatti"), path: "/contatti" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoCircular} alt="Elementi Sonori" className="h-12 w-12 object-contain rounded-full" />
        </Link>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center border border-border focus-within:border-primary transition-colors px-2 flex-1 max-w-xs mx-6">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder={t("nav.cercaVinili")}
            className="bg-transparent border-0 outline-none px-2 py-1.5 text-[11px] tracking-wider font-mono text-foreground placeholder:text-muted-foreground w-full"
          />
        </form>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xs tracking-[0.2em] font-mono transition-colors hover:text-primary ${
                location.pathname === item.path ? "text-primary" : "text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <LangSwitch />

          {/* Cart button */}
          <button
            onClick={() => navigate("/carrello")}
            className="relative border border-primary text-primary px-3 py-1.5 flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="text-[10px] font-mono font-bold tracking-wider">{itemCount}</span>
            )}
          </button>

          {/* User area */}
          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 text-[10px] tracking-[0.2em] font-mono font-bold transition-colors ${
                    location.pathname === "/admin" ? "text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> ADMIN
                </Link>
              )}
              <div className="flex items-center gap-2 text-foreground">
                <User className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-mono tracking-wider text-foreground">{displayName}</span>
              </div>
              <button
                onClick={signOut}
                className="text-muted-foreground hover:text-primary transition-colors"
                title={t("nav.esci")}
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="border border-foreground/30 text-foreground px-4 py-1.5 text-[10px] tracking-[0.2em] font-mono font-bold hover:border-primary hover:text-primary transition-all duration-300"
            >
              {t("nav.accedi")}
            </Link>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => navigate("/carrello")}
            className="relative border border-primary text-primary p-2 flex items-center gap-1"
          >
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="text-[9px] font-mono font-bold">{itemCount}</span>
            )}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-foreground p-2" aria-label="Menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-background border-b border-border overflow-hidden">
            <div className="flex flex-col px-4 py-6 gap-4">
              <form onSubmit={(e) => { handleSearch(e); setIsOpen(false); }} className="flex items-center border border-border focus-within:border-primary px-2">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder={t("nav.cercaVinili")}
                  className="bg-transparent border-0 outline-none px-2 py-2 text-xs tracking-wider font-mono text-foreground placeholder:text-muted-foreground w-full"
                />
              </form>
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={`text-sm tracking-[0.2em] font-mono transition-colors ${location.pathname === item.path ? "text-primary" : "text-foreground"}`}>
                  {item.label}
                </Link>
              ))}
              {user ? (
                <div className="border-t border-border pt-4 mt-2 space-y-3">
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-sm tracking-[0.2em] font-mono text-primary font-bold">
                      <ShieldCheck className="h-4 w-4" /> ADMIN
                    </Link>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-sm font-mono text-foreground">{displayName}</span>
                    </div>
                    <button onClick={() => { signOut(); setIsOpen(false); }} className="text-xs tracking-[0.2em] font-mono text-muted-foreground hover:text-primary">{t("nav.esci")}</button>
                  </div>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)} className="text-sm tracking-[0.2em] font-mono text-primary font-bold border-t border-border pt-4 mt-2">{t("nav.accedi")}</Link>
              )}
              <div className="border-t border-border pt-4 mt-2">
                <LangSwitch />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
