import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Clock, Phone, ArrowRight, Navigation } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import storeInterior from "@/assets/store-interior.jpg";
import logoSticker from "@/assets/logo-sticker.png";
import FloatingSticker from "@/components/FloatingSticker";
import SocialLinks from "@/components/SocialLinks";
import ContactForm from "@/components/ContactForm";
import MarqueeStrip from "@/components/MarqueeStrip";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Contatti = () => {
  const { t } = useLang();

  const faqs = [
    { q: t("contatti.faq1.q"), a: t("contatti.faq1.a") },
    { q: t("contatti.faq2.q"), a: t("contatti.faq2.a") },
    { q: t("contatti.faq3.q"), a: t("contatti.faq3.a") },
    { q: t("contatti.faq4.q"), a: t("contatti.faq4.a") },
  ];

  return (
    <div className="pt-16 relative">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={storeInterior} alt="" className="w-full h-full object-cover opacity-15" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.p className="text-primary text-xs tracking-[0.4em] font-mono mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {t("contatti.heroSubtitle")}
          </motion.p>
          <motion.h1 className="font-display text-6xl md:text-8xl font-bold" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {t("contatti.vieniA")}
          </motion.h1>
          <motion.h1 className="font-display text-6xl md:text-8xl font-bold text-neon" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {t("contatti.trovarci")}
          </motion.h1>
        </div>
        <FloatingSticker className="absolute top-10 right-20 hidden lg:block" size={100} spin />
      </section>

      <MarqueeStrip />

      {/* Info + Map */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="mb-8">
                <h3 className="text-primary text-xs tracking-[0.2em] font-mono mb-3 flex items-center gap-2">
                  <MapPin size={14} /> {t("contatti.indirizzo")}
                </h3>
                <p className="text-foreground text-sm font-mono">Via Alfonso Sozy Carafa, 31B</p>
                <p className="text-foreground text-sm font-mono">73100 Lecce (LE), Italia</p>
                <a href="https://maps.google.com/?q=Via+Alfonso+Sozy+Carafa+31B+Lecce" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary text-xs font-mono mt-2 hover:gap-3 transition-all">
                  <Navigation size={12} /> {t("contatti.apriMaps")}
                </a>
              </div>
              <div className="mb-8">
                <h3 className="text-primary text-xs tracking-[0.2em] font-mono mb-3 flex items-center gap-2">
                  <Clock size={14} /> {t("contatti.orari")}
                </h3>
                <div className="space-y-1">
                  <p className="text-foreground text-sm font-mono">Lun: 17:00 – 21:30</p>
                  <p className="text-foreground text-sm font-mono">Mar – Sab: 11:00 – 13:30 / 17:00 – 21:30</p>
                  <p className="text-muted-foreground text-sm font-mono">{t("index.dom")}</p>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-primary text-xs tracking-[0.2em] font-mono mb-3 flex items-center gap-2">
                  <Phone size={14} /> {t("contatti.contatti")}
                </h3>
                <a href="tel:+393714999328" className="text-foreground text-sm font-mono hover:text-primary transition-colors block">+39 371 499 9328</a>
                <a href="mailto:elementisonori23@gmail.com" className="text-foreground text-sm font-mono hover:text-primary transition-colors block mt-1">elementisonori23@gmail.com</a>
              </div>
              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-muted-foreground text-xs tracking-[0.2em] font-mono mb-4">{t("contatti.seguici")}</p>
                <SocialLinks />
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="relative w-full aspect-square bg-secondary overflow-hidden">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3044.5!2d18.1714!3d40.3515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDIxJzA1LjQiTiAxOMKwMTAnMTcuMCJF!5e0!3m2!1sit!2sit!4v1" width="100%" height="100%" style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg) saturate(0.3)" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Elementi Sonori - Mappa" />
                <motion.img src={logoSticker} alt="" className="absolute top-4 left-4 w-16 h-16 invert opacity-70" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} loading="lazy" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-xl">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <a href="mailto:elementisonori23@gmail.com" className="font-display text-4xl md:text-5xl font-bold mb-2 block hover:text-primary transition-colors">{t("contatti.scrivici")}</a>
            <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">{t("contatti.viaEmail")}</p>
          </motion.div>
          <ContactForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-2">FAQ</h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">{t("contatti.faq")}</p>
          </motion.div>
          {faqs.map((faq, i) => (
            <motion.div key={i} className="border-b border-border py-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.1 } } }}>
              <h3 className="font-display text-lg font-bold mb-2">{faq.q}</h3>
              <p className="text-muted-foreground text-sm font-mono">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">{t("contatti.esploraIl")} <span className="text-neon">{t("nav.catalogo")}</span></h2>
            <Link to="/marketplace" className="border border-primary text-primary px-10 py-3 text-xs tracking-[0.2em] font-mono hover:bg-primary hover:text-primary-foreground transition-all duration-300 inline-flex items-center gap-2">
              {t("contatti.vediVinili")} <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      <FloatingSticker className="absolute bottom-20 right-20 hidden xl:block" size={80} spin />
    </div>
  );
};

export default Contatti;
