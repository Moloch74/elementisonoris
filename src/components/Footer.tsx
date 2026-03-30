import { Link } from "react-router-dom";
import logoWhiteNew from "@/assets/logo-white-new.png";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-12 relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img src={logoWhiteNew} alt="Elementi Sonori" className="w-48 mb-4" />
            <p className="text-muted-foreground text-xs tracking-wider leading-relaxed">
              UNDERGROUND VINYL & STREETWEAR
              <br />
              LECCE — SALENTO
            </p>
          </div>

          <div>
            <h4 className="text-primary text-xs tracking-[0.2em] mb-4 font-mono">NAVIGAZIONE</h4>
            <div className="flex flex-col gap-2">
              <Link to="/chi-siamo" className="text-muted-foreground text-xs tracking-wider hover:text-foreground transition-colors">CHI SIAMO</Link>
              <Link to="/catalogo" className="text-muted-foreground text-xs tracking-wider hover:text-foreground transition-colors">CATALOGO</Link>
              <Link to="/eventi" className="text-muted-foreground text-xs tracking-wider hover:text-foreground transition-colors">EVENTI</Link>
              <Link to="/contatti" className="text-muted-foreground text-xs tracking-wider hover:text-foreground transition-colors">CONTATTI</Link>
            </div>
          </div>

          <div>
            <h4 className="text-primary text-xs tracking-[0.2em] mb-4 font-mono">SOCIAL</h4>
            <div className="flex flex-col gap-2">
              <a href="https://www.instagram.com/elementi_sonori/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs tracking-wider hover:text-primary transition-colors">INSTAGRAM</a>
              <a href="https://www.facebook.com/elementisonori" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs tracking-wider hover:text-primary transition-colors">FACEBOOK</a>
              <a href="https://www.discogs.com/seller/Elementisonori_Shop/profile" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs tracking-wider hover:text-primary transition-colors">DISCOGS</a>
              <a href="https://wa.me/393714999328" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs tracking-wider hover:text-primary transition-colors">WHATSAPP</a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-[10px] tracking-[0.3em]">
            © {new Date().getFullYear()} ELEMENTI SONORI — UNDERGROUND RECORDS SHOP
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
