import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import djVinyl from "@/assets/dj-vinyl.jpg";
import FloatingSticker from "@/components/FloatingSticker";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const genres = [
  { num: "01", name: "TECHNO", desc: "Pura potenza dal dancefloor", count: "1.2K dischi", highlight: false },
  { num: "02", name: "HOUSE", desc: "Groove senza compromessi", count: "800 dischi", highlight: false },
  { num: "03", name: "ACID", desc: "Il suono della 303", count: "340 dischi", highlight: false },
  { num: "04", name: "JUNGLE / DNB", desc: "Breakbeat a velocità folle", count: "420 dischi", highlight: false },
  { num: "05", name: "ELECTRO", desc: "Electro funk futuristico", count: "280 dischi", highlight: true },
  { num: "06", name: "AMBIENT / DUB", desc: "Paesaggi sonori profondi", count: "350 dischi", highlight: false },
  { num: "07", name: "BREAKBEAT", desc: "Ritmi spezzati e creativi", count: "190 dischi", highlight: false },
  { num: "08", name: "MINIMAL", desc: "Meno è più", count: "220 dischi", highlight: false },
  { num: "09", name: "INDUSTRIAL", desc: "Suoni dalla fabbrica", count: "150 dischi", highlight: false },
];

const Catalogo = () => {
  return (
    <div className="pt-16 relative">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={djVinyl} alt="" className="w-full h-full object-cover opacity-15" loading="lazy" width={1280} height={960} />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.h1 className="font-display text-6xl md:text-8xl font-bold" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            CATALOGO
          </motion.h1>
          <motion.p className="text-muted-foreground text-xs tracking-[0.3em] font-mono mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            SFOGLIA PER GENERE — SCOPRI IL TUO SUONO
          </motion.p>
        </div>
        <FloatingSticker className="absolute top-10 right-10 hidden lg:block" size={100} spin />
      </section>

      {/* Genres Grid */}
      <section className="pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {genres.map((genre, i) => (
              <motion.a
                key={genre.num}
                href="https://www.discogs.com/it/"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-8 group transition-colors duration-300 ${
                  genre.highlight ? "bg-secondary" : "bg-background hover:bg-secondary"
                }`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.05 } } }}
              >
                <div className="flex justify-end mb-4">
                  <span className="text-muted-foreground text-[10px] tracking-wider font-mono">[{genre.num}]</span>
                </div>
                <h3 className={`font-display text-2xl font-bold mb-2 transition-colors ${
                  genre.highlight ? "text-primary" : "group-hover:text-primary"
                }`}>
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

          {/* Discogs CTA */}
          <motion.div
            className="mt-16 text-center border border-border p-12 relative noise-overlay"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h3 className="font-display text-3xl font-bold mb-4">TROVA IL TUO <span className="text-neon">DISCO</span></h3>
            <p className="text-muted-foreground text-sm font-mono mb-8 max-w-lg mx-auto">
              Esplora il nostro catalogo completo su Discogs. Oltre 5000 vinili selezionati dalla scena underground.
            </p>
            <a
              href="https://www.discogs.com/it/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-primary text-primary px-10 py-4 text-xs tracking-[0.2em] font-mono hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              VAI SU DISCOGS <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Catalogo;
