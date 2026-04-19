import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Disc3, Headphones, Music, Store } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import vinylCrates from "@/assets/vinyl-crates.jpg";
import storeInterior from "@/assets/store-interior.jpg";
import murales from "@/assets/murales.jpg";
import dancefloor from "@/assets/dancefloor.jpg";
import djVinyl from "@/assets/dj-vinyl.jpg";
import logoSticker from "@/assets/logo-sticker.png";
import MarqueeStrip from "@/components/MarqueeStrip";
import FloatingSticker from "@/components/FloatingSticker";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ChiSiamo = () => {
  const { t } = useLang();

  const values = [
    { icon: Disc3, title: t("chiSiamo.value1.title"), desc: t("chiSiamo.value1.desc") },
    { icon: Headphones, title: t("chiSiamo.value2.title"), desc: t("chiSiamo.value2.desc") },
    { icon: Music, title: t("chiSiamo.value3.title"), desc: t("chiSiamo.value3.desc") },
    { icon: Store, title: t("chiSiamo.value4.title"), desc: t("chiSiamo.value4.desc") },
  ];

  const timeline = [
    { year: "2014", text: t("chiSiamo.timeline1") },
    { year: "2015", text: t("chiSiamo.timeline2") },
    { year: "2017", text: t("chiSiamo.timeline3") },
    { year: "2019", text: t("chiSiamo.timeline4") },
    { year: "2022", text: t("chiSiamo.timeline5") },
    { year: "2024", text: t("chiSiamo.timeline6") },
  ];

  return (
    <div className="pt-16 relative">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={storeInterior} alt="" className="w-full h-full object-cover opacity-20" loading="lazy" width={1280} height={960} />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.p className="text-primary text-xs tracking-[0.4em] font-mono mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {t("chiSiamo.laNostraStoria")}
          </motion.p>
          <motion.h1 className="font-display text-6xl md:text-8xl font-bold" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {t("chiSiamo.ilSuono")}
          </motion.h1>
          <motion.h1 className="font-display text-6xl md:text-8xl font-bold text-neon" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            UNDERGROUND
          </motion.h1>
          <motion.p className="text-muted-foreground text-sm font-mono mt-6 max-w-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {t("chiSiamo.subtitle")}
          </motion.p>
        </div>
        <FloatingSticker className="absolute top-10 right-20 hidden lg:block" size={120} spin />
      </section>

      <MarqueeStrip />

      {/* Intro */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                {t("chiSiamo.nonUnNegozio")} <span className="text-neon">{t("chiSiamo.negozio")}</span>.<br />{t("chiSiamo.presidio")}
              </h2>
              <p className="text-foreground text-sm leading-relaxed font-mono mb-6">{t("chiSiamo.desc1")}</p>
              <p className="text-foreground text-sm leading-relaxed font-mono mb-6">{t("chiSiamo.desc2")}</p>
              <p className="text-foreground text-sm leading-relaxed font-mono mb-8">{t("chiSiamo.desc3")}</p>
              <div className="flex gap-10">
                <div><span className="font-display text-4xl font-bold">5K+</span><p className="text-muted-foreground text-[10px] tracking-[0.2em] mt-1">{t("index.vinili")}</p></div>
                <div><span className="font-display text-4xl font-bold">10+</span><p className="text-muted-foreground text-[10px] tracking-[0.2em] mt-1">{t("index.anni")}</p></div>
                <div><span className="font-display text-4xl font-bold">∞</span><p className="text-muted-foreground text-[10px] tracking-[0.2em] mt-1">{t("index.passione")}</p></div>
              </div>
            </motion.div>
            <motion.div className="relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <img src={vinylCrates} alt="Vinili in negozio" className="w-full aspect-[3/4] object-cover" loading="lazy" width={1280} height={960} />
              <motion.img src={logoSticker} alt="" className="absolute -bottom-8 -left-8 w-32 h-32 invert opacity-80" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} loading="lazy" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-2">{t("chiSiamo.iNostri")} <span className="text-neon">{t("chiSiamo.valori")}</span></h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">{t("chiSiamo.cosaCiMuove")}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {values.map((v, i) => (
              <motion.div key={i} className="bg-background p-8 text-center group hover:bg-secondary transition-colors" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.1 } } }}>
                <v.icon size={32} className="mx-auto mb-4 text-primary" />
                <h3 className="font-display text-lg font-bold mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-xs font-mono leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-2">{t("chiSiamo.ilNegozio")} <span className="text-neon">{t("chiSiamo.negozioWord")}</span></h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">VIA SOZY CARAFA 31B — LECCE</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[storeInterior, djVinyl, dancefloor, vinylCrates, murales, storeInterior].map((img, i) => (
              <motion.div key={i} className="overflow-hidden" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.08 } } }}>
                <img src={img} alt="" className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-2">{t("chiSiamo.la")} <span className="text-neon">{t("chiSiamo.timeline")}</span></h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">{t("chiSiamo.dalPrimoDisco")}</p>
          </motion.div>
          {timeline.map((item, i) => (
            <motion.div key={item.year} className="flex gap-6 md:gap-10 py-6 border-b border-border" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.1 } } }}>
              <span className="font-display text-3xl font-bold text-primary min-w-[80px]">{item.year}</span>
              <p className="text-foreground text-sm font-mono leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Murales */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">{t("chiSiamo.laNostraArte")} <span className="text-neon">{t("chiSiamo.arte")}</span></h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">{t("chiSiamo.muralesDelNegozio")}</p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <img src={murales} alt="Murales Elementi Sonori" className="w-full max-w-4xl mx-auto object-cover" loading="lazy" width={1280} height={960} />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">{t("chiSiamo.vieniA")} <span className="text-neon">{t("chiSiamo.trovarci")}</span></h2>
            <p className="text-muted-foreground text-sm font-mono mb-8 max-w-md mx-auto">{t("chiSiamo.ctaAddress")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contatti" className="border border-primary text-primary px-10 py-3 text-xs tracking-[0.2em] font-mono hover:bg-primary hover:text-primary-foreground transition-all duration-300 inline-flex items-center gap-2 justify-center">
                {t("nav.contatti")} <ArrowRight size={14} />
              </Link>
              <Link to="/catalogo" className="border border-foreground/30 text-foreground px-10 py-3 text-xs tracking-[0.2em] font-mono hover:border-foreground transition-all duration-300 inline-flex items-center gap-2 justify-center">
                {t("nav.catalogo")} <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ChiSiamo;
