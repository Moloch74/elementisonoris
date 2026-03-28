import { motion } from "framer-motion";
import { MapPin, Clock, Phone } from "lucide-react";
import logoSticker from "@/assets/logo-sticker.png";
import FloatingSticker from "@/components/FloatingSticker";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Contatti = () => {
  return (
    <div className="pt-16 relative">
      {/* Hero */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.h1 className="font-display text-6xl md:text-8xl font-bold" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            VIENI A
          </motion.h1>
          <motion.h1 className="font-display text-6xl md:text-8xl font-bold text-neon" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            TROVARCI
          </motion.h1>
          <motion.p className="text-muted-foreground text-sm font-mono mt-4 border-b border-border pb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            IL VINILE SI TOCCA, SI ANNUSA, SI VIVE
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="mb-8">
                <h3 className="text-primary text-xs tracking-[0.2em] font-mono mb-3 flex items-center gap-2">
                  <MapPin size={14} /> INDIRIZZO
                </h3>
                <p className="text-foreground text-sm font-mono">Via Alfonso Sozy Carafa, 31B</p>
                <p className="text-foreground text-sm font-mono">73100 Lecce (LE), Italia</p>
              </div>

              <div className="mb-8">
                <h3 className="text-primary text-xs tracking-[0.2em] font-mono mb-3 flex items-center gap-2">
                  <Clock size={14} /> ORARI
                </h3>
                <p className="text-foreground text-sm font-mono">Mar – Sab: 11:00 – 13:30 / 17:00 – 21:30</p>
                <p className="text-foreground text-sm font-mono">Lun: 17:00 – 21:30</p>
                <p className="text-muted-foreground text-sm font-mono">Dom: Chiuso</p>
              </div>

              <div className="mb-8">
                <h3 className="text-primary text-xs tracking-[0.2em] font-mono mb-3 flex items-center gap-2">
                  <Phone size={14} /> CONTATTI
                </h3>
                <a href="tel:+393714999328" className="text-foreground text-sm font-mono hover:text-primary transition-colors">
                  +39 371 499 9328
                </a>
              </div>

              <div className="flex gap-6 mt-8">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs tracking-[0.15em] font-mono hover:text-foreground transition-colors">INSTAGRAM</a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs tracking-[0.15em] font-mono hover:text-foreground transition-colors">FACEBOOK</a>
                <a href="https://www.discogs.com/it/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs tracking-[0.15em] font-mono hover:text-foreground transition-colors">DISCOGS</a>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="relative w-full aspect-square bg-secondary overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3044.5!2d18.1714!3d40.3515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDIxJzA1LjQiTiAxOMKwMTAnMTcuMCJF!5e0!3m2!1sit!2sit!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg) saturate(0.3)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Elementi Sonori - Mappa"
                />
                <motion.img
                  src={logoSticker}
                  alt=""
                  className="absolute top-4 left-4 w-16 h-16 invert opacity-70"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FloatingSticker className="absolute bottom-20 right-20 hidden xl:block" size={80} spin />
    </div>
  );
};

export default Contatti;
