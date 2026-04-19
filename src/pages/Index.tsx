import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock, Phone, Image as ImageIcon, User } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import heroImg from "@/assets/hero-rave.jpg";
import undergroundShop from "@/assets/underground-shop.jpg";
import logoMain from "@/assets/logo-white-new.png";
import vinylCrates from "@/assets/vinyl-crates.jpg";
import storeInterior from "@/assets/store-interior.jpg";
import dancefloor from "@/assets/dancefloor.jpg";
import djVinyl from "@/assets/dj-vinyl.jpg";
import murales from "@/assets/murales.jpg";
import logoSticker from "@/assets/logo-sticker.png";
import streetwearDisplay from "@/assets/streetwear-display.jpg";
import communityStore from "@/assets/community-store.jpg";
import ominiBg from "@/assets/omini-bg.jpg";
import MarqueeStrip from "@/components/MarqueeStrip";
import FloatingSticker from "@/components/FloatingSticker";
import SocialLinks from "@/components/SocialLinks";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Index = () => {
  const { t } = useLang();

  const genres = [
    { num: "01", name: "TECHNO", desc: t("index.genre.techno.desc"), count: `1.2K ${t("index.dischi")}` },
    { num: "02", name: "HOUSE", desc: t("index.genre.house.desc"), count: `800 ${t("index.dischi")}` },
    { num: "03", name: "ACID", desc: t("index.genre.acid.desc"), count: `340 ${t("index.dischi")}` },
    { num: "04", name: "JUNGLE / DNB", desc: t("index.genre.jungle.desc"), count: `420 ${t("index.dischi")}` },
    { num: "05", name: "ELECTRO", desc: t("index.genre.electro.desc"), count: `280 ${t("index.dischi")}` },
    { num: "06", name: "AMBIENT / DUB", desc: t("index.genre.ambient.desc"), count: `350 ${t("index.dischi")}` },
  ];

  const testimonials = [
    { quote: t("index.quote1"), author: "Marco D.", role: t("index.role.dj") },
    { quote: t("index.quote2"), author: "Giulia R.", role: t("index.role.collector") },
    { quote: t("index.quote3"), author: "Luca P.", role: t("index.role.organizer") },
  ];

  const teamMembers = [
    { name: "NOME COGNOME", role: "FOUNDER / SELECTOR" },
    { name: "NOME COGNOME", role: "BUYER VINYL" },
    { name: "NOME COGNOME", role: "STREETWEAR / DESIGN" },
    { name: "NOME COGNOME", role: "EVENTS / COMMUNITY" },
  ];

  return (
    <div className="relative">
      {/* Fixed background — omini characters */}
      <div
        className="fixed inset-0 -z-10 bg-fixed bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${ominiBg})` }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 -z-10 bg-background/85" aria-hidden="true" />

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={undergroundShop} alt="Underground Records Shop" className="w-full h-full object-cover opacity-60" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full">
          <motion.div className="w-[75vw] max-w-[800px] min-w-[280px] mb-8 mx-auto" initial={{ opacity: 0, scale: 0.92, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.9, ease: "easeOut" }}>
            <img src={logoMain} alt="Elementi Sonori" className="w-full h-auto object-contain drop-shadow-[0_0_30px_hsl(120_100%_40%/0.22)]" />
          </motion.div>
          <motion.p className="text-xs md:text-sm tracking-[0.4em] text-primary font-mono mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}>
            {t("hero.subtitle")}
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}>
            <Link to="/catalogo" className="border border-primary text-primary px-8 py-3 text-xs tracking-[0.2em] font-mono hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              {t("hero.cta1")}
            </Link>
            <Link to="/chi-siamo" className="border border-foreground/30 text-foreground px-8 py-3 text-xs tracking-[0.2em] font-mono hover:border-foreground transition-all duration-300">
              {t("hero.cta2")}
            </Link>
          </motion.div>
        </div>
        <FloatingSticker className="absolute top-20 right-10 hidden lg:block" size={150} spin />
      </section>

      <MarqueeStrip />

      {/* Social Links Strip */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <motion.p className="text-center text-muted-foreground text-xs tracking-[0.3em] font-mono mb-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {t("index.followScene")}
          </motion.p>
          <SocialLinks />
        </div>
      </section>

      {/* Chi Siamo Preview */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div className="relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <img src={vinylCrates} alt="Vinili" className="w-full aspect-[4/5] object-cover" loading="lazy" width={1280} height={960} />
              <motion.img src={logoSticker} alt="" className="absolute -bottom-6 -right-6 w-28 h-28 invert opacity-80" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }} loading="lazy" />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="font-display text-5xl md:text-6xl font-bold mb-2">{t("index.sound")}</h2>
              <h2 className="font-display text-5xl md:text-6xl font-bold text-neon mb-8">{t("index.underground")}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-mono">{t("index.chiSiamoDesc1")}</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 font-mono">{t("index.chiSiamoDesc2")}</p>
              <div className="flex gap-8 mb-8">
                <div><span className="font-display text-3xl font-bold">5K+</span><p className="text-muted-foreground text-[10px] tracking-[0.2em] mt-1">{t("index.vinili")}</p></div>
                <div><span className="font-display text-3xl font-bold">10+</span><p className="text-muted-foreground text-[10px] tracking-[0.2em] mt-1">{t("index.anni")}</p></div>
                <div><span className="font-display text-3xl font-bold">∞</span><p className="text-muted-foreground text-[10px] tracking-[0.2em] mt-1">{t("index.passione")}</p></div>
              </div>
              <Link to="/chi-siamo" className="inline-flex items-center gap-2 text-primary text-xs tracking-[0.2em] font-mono hover:gap-4 transition-all">
                {t("index.scopriDiPiu")} <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
        <FloatingSticker className="absolute top-10 left-5 hidden xl:block" size={80} />
      </section>

      {/* Gallery Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-5xl md:text-7xl font-bold">{t("index.dal")} <span className="text-neon">{t("index.dancefloor")}</span></h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] mt-4 font-mono">{t("index.gallerySubtitle")}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div className="md:row-span-2" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <img src={storeInterior} alt="Negozio" className="w-full h-full object-cover" loading="lazy" width={1280} height={960} />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
              <img src={dancefloor} alt="Dancefloor" className="w-full aspect-square object-cover" loading="lazy" width={1280} height={960} />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}>
              <img src={djVinyl} alt="DJ" className="w-full aspect-square object-cover" loading="lazy" width={1280} height={960} />
            </motion.div>
            <motion.div className="md:col-span-2" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <img src={murales} alt="Murales" className="w-full aspect-[2/1] object-cover" loading="lazy" width={1280} height={960} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Catalogo Preview */}
      <section className="py-24 border-t border-border relative">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-5xl md:text-7xl font-bold mb-4">{t("index.catalogoTitle")}</h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">{t("index.catalogoSubtitle")}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {genres.map((genre, i) => (
              <motion.a key={genre.num} href="https://www.discogs.com/seller/Elementisonori_Shop/profile" target="_blank" rel="noopener noreferrer" className="bg-background p-8 group hover:bg-secondary transition-colors duration-300" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.6, delay: i * 0.1 } } }}>
                <div className="flex justify-end mb-4"><span className="text-muted-foreground text-[10px] tracking-wider font-mono">[{genre.num}]</span></div>
                <h3 className="font-display text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{genre.name}</h3>
                <p className="text-muted-foreground text-xs font-mono mb-4">{genre.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary text-xs font-mono">{genre.count}</span>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </motion.a>
            ))}
          </div>
          <motion.div className="text-center mt-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Link to="/catalogo" className="border border-primary text-primary px-10 py-3 text-xs tracking-[0.2em] font-mono hover:bg-primary hover:text-primary-foreground transition-all duration-300 inline-block">
              {t("index.vediTuttoCatalogo")}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Eventi Preview */}
      <section className="py-24 border-t border-border relative scanline">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div className="relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <img src={dancefloor} alt="Eventi" className="w-full aspect-[4/3] object-cover" loading="lazy" width={1280} height={960} />
              <img src={heroImg} alt="Rave" className="absolute -bottom-8 left-1/4 w-2/3 aspect-video object-cover border-4 border-background" loading="lazy" width={1920} height={1080} />
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="font-display text-5xl md:text-7xl font-bold mb-2">{t("index.eventiTitle")}</h2>
              <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono mb-8">{t("index.prossimiAppuntamenti")}</p>
              {[
                { date: "12 APR", name: "VINYL ONLY NIGHT", location: "Elementi Sonori — Lecce", tag: "IN-STORE" },
                { date: "26 APR", name: "ACID TEKNO SESSION", location: "Warehouse District — Lecce", tag: "RAVE" },
                { date: "10 MAG", name: "DIGGING DAY", location: "Elementi Sonori — Lecce", tag: "IN-STORE" },
              ].map((event, i) => (
                <div key={i} className="flex items-center gap-6 py-6 border-b border-border">
                  <span className="text-primary font-display text-2xl font-bold min-w-[80px]">{event.date}</span>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold">{event.name}</h3>
                    <p className="text-muted-foreground text-xs font-mono">{event.location}</p>
                  </div>
                  <span className="border border-primary text-primary text-[10px] tracking-[0.15em] px-3 py-1 font-mono">{event.tag}</span>
                </div>
              ))}
              <Link to="/eventi" className="inline-flex items-center gap-2 text-primary text-xs tracking-[0.2em] font-mono mt-8 hover:gap-4 transition-all">
                {t("index.tuttiGliEventi")} <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
        <FloatingSticker className="absolute bottom-10 right-10 hidden xl:block" size={100} spin />
      </section>

      {/* Streetwear */}
      <section className="py-24 border-t border-border relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <p className="text-primary text-xs tracking-[0.4em] font-mono mb-4">{t("index.abbigliamento")}</p>
              <h2 className="font-display text-5xl md:text-7xl font-bold mb-2">STREET</h2>
              <h2 className="font-display text-5xl md:text-7xl font-bold text-neon mb-8">WEAR</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-mono">{t("index.streetwearDesc1")}</p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 font-mono">{t("index.streetwearDesc2")}</p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div><span className="font-display text-2xl font-bold">HOODIE</span><p className="text-muted-foreground text-[10px] tracking-[0.2em] mt-1">OVERSIZE</p></div>
                <div><span className="font-display text-2xl font-bold">TEE</span><p className="text-muted-foreground text-[10px] tracking-[0.2em] mt-1">GRAPHIC</p></div>
                <div><span className="font-display text-2xl font-bold">ACC</span><p className="text-muted-foreground text-[10px] tracking-[0.2em] mt-1">{t("index.accessori")}</p></div>
              </div>
              <Link to="/contatti" className="inline-flex items-center gap-2 text-primary text-xs tracking-[0.2em] font-mono hover:gap-4 transition-all">
                {t("index.scopriCollezione")} <ArrowRight size={14} />
              </Link>
            </motion.div>
            <motion.div className="relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <img src={streetwearDisplay} alt="Streetwear" className="w-full aspect-[4/3] object-cover" loading="lazy" width={1280} height={960} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="py-24 border-t border-border relative noise-overlay">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-5xl md:text-7xl font-bold">{t("chiSiamo.la")} <span className="text-neon">{t("index.community")}</span></h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] mt-4 font-mono">{t("index.communitySubtitle")}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border mb-16">
            {testimonials.map((te, i) => (
              <motion.div key={i} className="bg-background p-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.6, delay: i * 0.15 } } }}>
                <p className="text-foreground text-sm font-mono leading-relaxed mb-6">"{te.quote}"</p>
                <p className="font-display text-sm font-bold">{te.author}</p>
                <p className="text-primary text-[10px] tracking-[0.2em] font-mono">{te.role}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <img src={communityStore} alt="Community" className="w-full aspect-[21/9] object-cover" loading="lazy" width={1280} height={960} />
          </motion.div>
        </div>
      </section>

      {/* Dove Siamo */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="font-display text-5xl md:text-7xl font-bold mb-2">{t("index.dove")}</h2>
              <h2 className="font-display text-5xl md:text-7xl font-bold text-neon mb-8">{t("index.siamo")}</h2>
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <MapPin size={18} className="text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-foreground text-sm font-mono">Via Alfonso Sozy Carafa, 31B</p>
                    <p className="text-foreground text-sm font-mono">73100 Lecce (LE), Italia</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock size={18} className="text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-foreground text-sm font-mono">Lun: 17:00 – 21:30</p>
                    <p className="text-foreground text-sm font-mono">Mar – Sab: 11:00 – 13:30 / 17:00 – 21:30</p>
                    <p className="text-muted-foreground text-sm font-mono">{t("index.dom")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone size={18} className="text-primary shrink-0 mt-1" />
                  <a href="tel:+393714999328" className="text-foreground text-sm font-mono hover:text-primary transition-colors">+39 371 499 9328</a>
                </div>
              </div>
              <Link to="/contatti" className="inline-flex items-center gap-2 text-primary text-xs tracking-[0.2em] font-mono hover:gap-4 transition-all">
                {t("index.contattaci")} <ArrowRight size={14} />
              </Link>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="relative w-full aspect-square bg-secondary overflow-hidden">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3044.5!2d18.1714!3d40.3515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDIxJzA1LjQiTiAxOMKwMTAnMTcuMCJF!5e0!3m2!1sit!2sit!4v1" width="100%" height="100%" style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg) saturate(0.3)" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Elementi Sonori - Mappa" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
