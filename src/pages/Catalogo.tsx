import { motion } from "framer-motion";
import { ArrowUpRight, Disc3, ExternalLink, Store, Search } from "lucide-react";
import djVinyl from "@/assets/dj-vinyl.jpg";
import vinylCrates from "@/assets/vinyl-crates.jpg";
import FloatingSticker from "@/components/FloatingSticker";
import MarqueeStrip from "@/components/MarqueeStrip";

const DISCOGS_BASE = "https://www.discogs.com/seller/Elementisonori_Shop/profile";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const genres = [
  { num: "01", name: "ELECTRONIC", desc: "Il cuore del catalogo: techno, acid, freetekno e tutte le sfumature della musica elettronica", count: "437 dischi", link: `${DISCOGS_BASE}?genre=Electronic` },
  { num: "02", name: "FUNK / SOUL", desc: "Groove e radici black music nella collezione", count: "1 disco", link: `${DISCOGS_BASE}?genre=Funk+%2F+Soul` },
  { num: "03", name: "HIP HOP", desc: "Beats e campionamenti dalla cultura hip hop", count: "1 disco", link: `${DISCOGS_BASE}?genre=Hip+Hop` },
];

const styles = [
  { num: "01", name: "FREETEKNO", desc: "Suoni liberi dalla scena free party e teknivals — il genere più rappresentato nel catalogo", count: "285 dischi", link: `${DISCOGS_BASE}?style=Freetekno` },
  { num: "02", name: "TECHNO", desc: "Dalla Detroit originale al suono europeo, pura potenza dal dancefloor", count: "156 dischi", link: `${DISCOGS_BASE}?style=Techno` },
  { num: "03", name: "ACID", desc: "Il suono inconfondibile della Roland TB-303 e le sue evoluzioni", count: "146 dischi", link: `${DISCOGS_BASE}?style=Acid` },
  { num: "04", name: "HARDCORE", desc: "Velocità e intensità senza limiti — gabber, industrial e oltre", count: "100 dischi", link: `${DISCOGS_BASE}?style=Hardcore` },
  { num: "05", name: "TRIBAL", desc: "Ritmi tribali, percussioni ipnotiche e groove primitivo", count: "98 dischi", link: `${DISCOGS_BASE}?style=Tribal` },
];

const priceRanges = [
  { range: "€5 – €10", count: 13, link: `${DISCOGS_BASE}?price=5to10` },
  { range: "€10 – €15", count: 283, link: `${DISCOGS_BASE}?price=10to15` },
  { range: "€15 – €20", count: 115, link: `${DISCOGS_BASE}?price=15to20` },
  { range: "€20 – €40", count: 26, link: `${DISCOGS_BASE}?price=20to40` },
];

const realItems = [
  { artist: "Various", title: "Untitled", label: "Kubizm Records", cat: "KBZM 001", price: "€16.50", condition: "Mint (M)", link: "https://www.discogs.com/sell/item/4093516527" },
  { artist: "Cyl", title: "Crypt", label: "Haknam", cat: "HKNM 05", price: "€9.00", condition: "VG+", link: "https://www.discogs.com/sell/item/4091756203" },
  { artist: "Crystal Distortion / Ixindamix", title: "Studio 23 Reloaded 3", label: "SP 23", cat: "STR23-3", price: "€24.50", condition: "Mint (M)", link: "https://www.discogs.com/sell/item/4050232996" },
  { artist: "Don't Panik!", title: "Automation Devastation", label: "Don't Panik Ind. Rec.", cat: "DP7", price: "€10.00", condition: "VG+", link: "https://www.discogs.com/sell/item/4058874892" },
  { artist: "Somatic Responses", title: "Abred Hanesyddol EP", label: "Aneurysm Recordings", cat: "ANEURYSM 05", price: "€18.00", condition: "Mint (M)", link: "https://www.discogs.com/sell/item/4082059186" },
  { artist: "FKY", title: "RPS 19", label: "Repress & Unreleased 97-00", cat: "RPS 19", price: "€15.00", condition: "Mint (M)", link: "https://www.discogs.com/sell/item/4070922328" },
  { artist: "Various", title: "Alarma 005", label: "No Pizza Records", cat: "ALR-005", price: "€18.00", condition: "Mint (M)", link: "https://www.discogs.com/sell/item/4070966500" },
  { artist: "Various", title: "MKN 02", label: "MKN Brigade Productions", cat: "MKN 02", price: "€15.00", condition: "Mint (M)", link: "https://www.discogs.com/sell/item/4070964229" },
  { artist: "Pociashanty", title: "Project 002", label: "PCH", cat: "PCH002", price: "€12.00", condition: "Mint (M)", link: "https://www.discogs.com/sell/item/4070984725" },
  { artist: "Pociashanty", title: "Bass Mad Factory", label: "PCH", cat: "PCH004", price: "€12.00", condition: "Mint (M)", link: "https://www.discogs.com/sell/item/4070983606" },
  { artist: "Shrui-Khan, Al Core", title: "The Big Payback Ep", label: "Ice Records", cat: "001", price: "€16.00", condition: "Mint (M)", link: "https://www.discogs.com/sell/item/4070960914" },
  { artist: "Orion", title: "Rooster / The Source", label: "Symbiosis Records", cat: "symb 22", price: "€22.00", condition: "VG", link: "https://www.discogs.com/sell/item/4091721673" },
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
            [437+ VINILI IN VENDITA SU DISCOGS — 5 STILI · 3 GENERI]
58:           </motion.p>
          <motion.h1 className="font-display text-6xl md:text-8xl font-bold" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            CATALOGO
          </motion.h1>
          <motion.p className="text-muted-foreground text-xs tracking-[0.3em] font-mono mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            SFOGLIA PER STILE — ACQUISTA SU DISCOGS
          </motion.p>
        </div>
        <FloatingSticker className="absolute top-10 right-10 hidden lg:block" size={100} spin />
      </section>

      <MarqueeStrip />

      {/* Styles Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-2">STILI</h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">CLICCA PER FILTRARE SU DISCOGS</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {styles.map((style, i) => (
              <motion.a
                key={style.num}
                href={style.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background p-8 group hover:bg-secondary transition-colors duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.05 } } }}
              >
                <div className="flex justify-end mb-4">
                  <span className="text-muted-foreground text-[10px] tracking-wider font-mono">[{style.num}]</span>
                </div>
                <h3 className="font-display text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {style.name}
                </h3>
                <p className="text-muted-foreground text-xs font-mono mb-4">{style.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary text-xs font-mono">{style.count}</span>
                  <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-primary transition-all" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Price Ranges */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">PER PREZZO</h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">FILTRA PER FASCIA DI PREZZO</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
            {priceRanges.map((pr, i) => (
              <motion.a
                key={pr.range}
                href={pr.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background p-6 text-center group hover:bg-secondary transition-colors"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.4, delay: i * 0.08 } } }}
              >
                <h3 className="font-display text-xl font-bold mb-1 group-hover:text-primary transition-colors">{pr.range}</h3>
                <p className="text-muted-foreground text-xs font-mono">{pr.count} dischi</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Real Items from Discogs */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-2">DISCHI IN <span className="text-gradient-neon">VENDITA</span></h2>
              <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono mb-8">SELEZIONE DAL CATALOGO DISCOGS</p>

              {realItems.map((item, i) => (
                <motion.a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 py-4 border-b border-border group hover:bg-secondary/30 transition-colors px-2 -mx-2"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.4, delay: i * 0.05 } } }}
                >
                  <Disc3 size={18} className="text-primary shrink-0 group-hover:animate-spin" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-sm font-bold truncate">{item.artist} — {item.title}</h4>
                    <p className="text-muted-foreground text-[11px] font-mono">{item.label} · {item.cat}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-primary text-sm font-mono font-bold">{item.price}</span>
                    <p className="text-muted-foreground text-[10px] font-mono">{item.condition}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>

            <motion.div className="relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <img src={vinylCrates} alt="Casse vinili" className="w-full aspect-[4/5] object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-primary text-[10px] tracking-[0.3em] font-mono mb-2">AGGIORNAMENTO CONTINUO</p>
                <p className="text-foreground text-sm font-mono">Catalogo reale da Discogs. Clicca su ogni disco per acquistare direttamente.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to buy */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-2">COME <span className="text-gradient-neon">ACQUISTARE</span></h2>
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
            <h3 className="font-display text-4xl md:text-5xl font-bold mb-4">TROVA IL TUO <span className="text-gradient-neon">DISCO</span></h3>
            <p className="text-muted-foreground text-sm font-mono mb-8 max-w-lg mx-auto">
              Esplora il catalogo completo su Discogs. Oltre 437 vinili selezionati dalla scena underground.
            </p>
            <a
              href={DISCOGS_BASE}
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
