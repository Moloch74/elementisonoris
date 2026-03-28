import { motion } from "framer-motion";
import { ArrowUpRight, Disc3, Search, ExternalLink } from "lucide-react";
import djVinyl from "@/assets/dj-vinyl.jpg";
import vinylCrates from "@/assets/vinyl-crates.jpg";
import storeInterior from "@/assets/store-interior.jpg";
import FloatingSticker from "@/components/FloatingSticker";
import MarqueeStrip from "@/components/MarqueeStrip";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const genres = [
  { num: "01", name: "TECHNO", desc: "Pura potenza dal dancefloor", count: "1.2K dischi" },
  { num: "02", name: "HOUSE", desc: "Groove senza compromessi", count: "800 dischi" },
  { num: "03", name: "ACID", desc: "Il suono della 303", count: "340 dischi" },
  { num: "04", name: "JUNGLE / DNB", desc: "Breakbeat a velocità folle", count: "420 dischi" },
  { num: "05", name: "ELECTRO", desc: "Electro funk futuristico", count: "280 dischi" },
  { num: "06", name: "AMBIENT / DUB", desc: "Paesaggi sonori profondi", count: "350 dischi" },
  { num: "07", name: "BREAKBEAT", desc: "Ritmi spezzati e creativi", count: "190 dischi" },
  { num: "08", name: "MINIMAL", desc: "Meno è più", count: "220 dischi" },
  { num: "09", name: "INDUSTRIAL", desc: "Suoni dalla fabbrica", count: "150 dischi" },
];

const newArrivals = [
  { artist: "Surgeon", title: "Raw Trax Vol. 3", label: "Dynamic Tension", genre: "Techno" },
  { artist: "DJ Stingray", title: "F.T.N.W.O.", label: "WeMe Records", genre: "Electro" },
  { artist: "Basic Channel", title: "BCD-2", label: "Basic Channel", genre: "Dub Techno" },
  { artist: "Aphex Twin", title: "Collapse EP", label: "Warp", genre: "IDM" },
  { artist: "Blawan", title: "Wet Will Always Dry", label: "Ternesc", genre: "Techno" },
  { artist: "Omar S", title: "Simply (Fuck Resident Advisor)", label: "FXHE", genre: "House" },
];

const Catalogo = () => {
  return (
    <div className="pt-16 relative">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={djVinyl} alt="" className="w-full h-full object-cover opacity-15" loading="lazy" width={1280} height={960} />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.p className="text-primary text-xs tracking-[0.4em] font-mono mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            [5000+ VINILI SELEZIONATI]
          </motion.p>
          <motion.h1 className="font-display text-6xl md:text-8xl font-bold" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            CATALOGO
          </motion.h1>
          <motion.p className="text-muted-foreground text-xs tracking-[0.3em] font-mono mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            SFOGLIA PER GENERE — SCOPRI IL TUO SUONO
          </motion.p>
        </div>
        <FloatingSticker className="absolute top-10 right-10 hidden lg:block" size={100} spin />
      </section>

      <MarqueeStrip />

      {/* Genres Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-2">GENERI</h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">CLICCA PER ESPLORARE SU DISCOGS</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {genres.map((genre, i) => (
              <motion.a
                key={genre.num}
                href="https://www.discogs.com/seller/Elementi_Sonori/profile"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background p-8 group hover:bg-secondary transition-colors duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.05 } } }}
              >
                <div className="flex justify-end mb-4">
                  <span className="text-muted-foreground text-[10px] tracking-wider font-mono">[{genre.num}]</span>
                </div>
                <h3 className="font-display text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {genre.name}
                </h3>
                <p className="text-muted-foreground text-xs font-mono mb-4">{genre.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary text-xs font-mono">{genre.count}</span>
                  <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-primary transition-all" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-2">NUOVI <span className="text-neon">ARRIVI</span></h2>
              <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono mb-8">ULTIMI INGRESSI NELLE CASSE</p>

              {newArrivals.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 py-4 border-b border-border group"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.4, delay: i * 0.08 } } }}
                >
                  <Disc3 size={20} className="text-primary shrink-0 group-hover:animate-spin" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-sm font-bold truncate">{item.artist} — {item.title}</h4>
                    <p className="text-muted-foreground text-[11px] font-mono">{item.label}</p>
                  </div>
                  <span className="text-primary text-[10px] tracking-[0.15em] font-mono shrink-0">{item.genre}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <img src={vinylCrates} alt="Casse vinili" className="w-full aspect-[4/5] object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-primary text-[10px] tracking-[0.3em] font-mono mb-2">AGGIORNAMENTO SETTIMANALE</p>
                <p className="text-foreground text-sm font-mono">Ogni settimana nuovi vinili selezionati dalla scena underground internazionale.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to buy */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-2">COME <span className="text-neon">ACQUISTARE</span></h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">TRE MODI PER AVERE IL TUO DISCO</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {[
              { num: "01", title: "IN NEGOZIO", desc: "Vieni a trovarci in Via Sozy Carafa 31B, Lecce. Sfoglia le casse, ascolta e scegli.", icon: Store },
              { num: "02", title: "SU DISCOGS", desc: "Esplora il catalogo online su Discogs. Spedizione in tutta Italia e in Europa.", icon: Search },
              { num: "03", title: "SU WHATSAPP", desc: "Scrivici su WhatsApp per richieste specifiche, pre-order e dischi rari.", icon: ExternalLink },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                className="bg-background p-10 text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.15 } } }}
              >
                <span className="text-primary text-[10px] tracking-wider font-mono">[{step.num}]</span>
                <step.icon size={28} className="mx-auto my-4 text-primary" />
                <h3 className="font-display text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-xs font-mono leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Discogs CTA */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="text-center border border-border p-12 md:p-16 relative noise-overlay"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h3 className="font-display text-4xl md:text-5xl font-bold mb-4">TROVA IL TUO <span className="text-neon">DISCO</span></h3>
            <p className="text-muted-foreground text-sm font-mono mb-8 max-w-lg mx-auto">
              Esplora il nostro catalogo completo su Discogs. Oltre 5000 vinili selezionati dalla scena underground.
            </p>
            <a
              href="https://www.discogs.com/seller/Elementi_Sonori/profile"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-primary text-primary px-10 py-4 text-xs tracking-[0.2em] font-mono hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              VAI SU DISCOGS <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      <FloatingSticker className="absolute bottom-40 left-5 hidden xl:block" size={80} />
    </div>
  );
};

export default Catalogo;
