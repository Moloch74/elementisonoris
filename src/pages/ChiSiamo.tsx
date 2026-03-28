import { motion } from "framer-motion";
import vinylCrates from "@/assets/vinyl-crates.jpg";
import storeInterior from "@/assets/store-interior.jpg";
import murales from "@/assets/murales.jpg";
import logoSticker from "@/assets/logo-sticker.png";
import MarqueeStrip from "@/components/MarqueeStrip";
import FloatingSticker from "@/components/FloatingSticker";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ChiSiamo = () => {
  return (
    <div className="pt-16 relative">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={storeInterior} alt="" className="w-full h-full object-cover opacity-20" loading="lazy" width={1280} height={960} />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.h1 className="font-display text-6xl md:text-8xl font-bold" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            IL SUONO
          </motion.h1>
          <motion.h1 className="font-display text-6xl md:text-8xl font-bold text-neon" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            UNDERGROUND
          </motion.h1>
        </div>
        <FloatingSticker className="absolute top-10 right-20 hidden lg:block" size={120} spin />
      </section>

      <MarqueeStrip />

      {/* Content */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <p className="text-foreground text-sm leading-relaxed font-mono mb-6">
                Elementi Sonori nasce a Lecce, in Via Sozy Carafa 31B, come punto di riferimento per chi vive la musica come cultura, non come sottofondo. Un negozio di vinili e streetwear underground che è anche rifugio, archivio e punto di incontro per la scena del Salento.
              </p>
              <p className="text-foreground text-sm leading-relaxed font-mono mb-6">
                Dalla techno più oscura all'house più groovy, dall'acid al jungle, selezioniamo solo vinili che raccontano una storia. Ogni disco nelle nostre casse è stato scelto con cura da chi il dancefloor lo vive davvero.
              </p>
              <p className="text-foreground text-sm leading-relaxed font-mono mb-8">
                Non solo un negozio — un presidio culturale dove il vinile è ancora il re e lo streetwear è la nostra seconda pelle.
              </p>

              <div className="flex gap-10">
                <div>
                  <span className="font-display text-4xl font-bold">5K+</span>
                  <p className="text-muted-foreground text-[10px] tracking-[0.2em] mt-1">VINILI</p>
                </div>
                <div>
                  <span className="font-display text-4xl font-bold">10+</span>
                  <p className="text-muted-foreground text-[10px] tracking-[0.2em] mt-1">ANNI</p>
                </div>
                <div>
                  <span className="font-display text-4xl font-bold">∞</span>
                  <p className="text-muted-foreground text-[10px] tracking-[0.2em] mt-1">PASSIONE</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <img src={vinylCrates} alt="Vinili in negozio" className="w-full aspect-[3/4] object-cover" loading="lazy" width={1280} height={960} />
              <motion.img
                src={logoSticker}
                alt=""
                className="absolute -bottom-8 -left-8 w-32 h-32 invert opacity-80"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Murales */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">LA NOSTRA <span className="text-neon">ARTE</span></h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">I MURALES DEL NEGOZIO</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <img src={murales} alt="Murales Elementi Sonori" className="w-full max-w-4xl mx-auto object-cover" loading="lazy" width={1280} height={960} />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ChiSiamo;
