import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useLang } from "@/contexts/LangContext";
import logoWhite from "@/assets/logo-white-new.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  const { t } = useLang();

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
        <Link to="/" className="flex items-center">
          <img src={logoWhite} alt="Elementi Sonori" className="h-12" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
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
          <button onClick={() => navigate("/shop")} className="relative text-foreground hover:text-primary transition-colors">
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-mono">{itemCount}</span>
            )}
          </button>
          {user ? (
            <button onClick={signOut} className="text-foreground hover:text-primary transition-colors" title={t("nav.esci")}>
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <Link to="/auth" className="text-xs tracking-[0.2em] font-mono text-foreground hover:text-primary transition-colors">
              <User className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center gap-3">
          <button onClick={() => navigate("/shop")} className="relative text-foreground p-2">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-mono">{itemCount}</span>
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
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={`text-sm tracking-[0.2em] font-mono transition-colors ${location.pathname === item.path ? "text-primary" : "text-foreground"}`}>
                  {item.label}
                </Link>
              ))}
              {user ? (
                <button onClick={() => { signOut(); setIsOpen(false); }} className="text-sm tracking-[0.2em] font-mono text-foreground text-left">{t("nav.esci")}</button>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)} className="text-sm tracking-[0.2em] font-mono text-foreground">{t("nav.accedi")}</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
