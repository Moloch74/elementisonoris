import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-rave.jpg";
import logoMain from "@/assets/logo-white.png";
import vinylCrates from "@/assets/vinyl-crates.jpg";
import storeInterior from "@/assets/store-interior.jpg";
import dancefloor from "@/assets/dancefloor.jpg";
import djVinyl from "@/assets/dj-vinyl.jpg";
import murales from "@/assets/murales.jpg";
import logoSticker from "@/assets/logo-sticker.png";
import MarqueeStrip from "@/components/MarqueeStrip";
import FloatingSticker from "@/components/FloatingSticker";
import SocialLinks from "@/components/SocialLinks";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Index = () => {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Rave" className="w-full h-full object-cover opacity-40" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full">
          <motion.div
            className="w-[60vw] max-w-[600px] min-w-[240px] mb-8 mx-auto"
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <img
              src={logoMain}
              alt="Elementi Sonori"
              className="w-full h-auto object-contain drop-shadow-[0_0_30px_hsl(120_100%_40%/0.22)]"
            />
          </motion.div>
          <motion.p
            className="text-xs md:text-sm tracking-[0.4em] text-primary font-mono mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            UNDERGROUND VINYL & STREETWEAR — LECCE
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link
              to="/catalogo"
              className="border border-primary text-primary px-8 py-3 text-xs tracking-[0.2em] font-mono hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              ESPLORA IL CATALOGO
            </Link>
            <Link
              to="/chi-siamo"
              className="border border-foreground/30 text-foreground px-8 py-3 text-xs tracking-[0.2em] font-mono hover:border-foreground transition-all duration-300"
            >
              CHI SIAMO
            </Link>
          </motion.div>
        </div>

        <FloatingSticker className="absolute top-20 right-10 hidden lg:block" size={150} spin />
      </section>

      {/* Marquee */}
      <MarqueeStrip />

      {/* Social Links Strip */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <motion.p
            className="text-center text-muted-foreground text-xs tracking-[0.3em] font-mono mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            SEGUICI NELLA SCENA
          </motion.p>
          <SocialLinks />
        </div>
      </section>

      {/* Chi Siamo Preview */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <img src={vinylCrates} alt="Vinili" className="w-full aspect-[4/5] object-cover" loading="lazy" width={1280} height={960} />
              <motion.img
                src={logoSticker}
                alt=""
                className="absolute -bottom-6 -right-6 w-28 h-28 invert opacity-80"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                loading="lazy"
              />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="font-display text-5xl md:text-6xl font-bold mb-2">IL SUONO</h2>
              <h2 className="font-display text-5xl md:text-6xl font-bold text-neon mb-8">UNDERGROUND</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-mono">
                Elementi Sonori nasce a Lecce, in Via Sozy Carafa 31B, come punto di riferimento per chi vive la musica come cultura, non come sottofondo.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8 font-mono">
                Dalla techno più oscura all'house più groovy, dall'acid al jungle, selezioniamo solo vinili che raccontano una storia.
              </p>
              <div className="flex gap-8 mb-8">
                <div>
                  <span className="font-display text-3xl font-bold">5K+</span>
                  <p className="text-muted-foreground text-[10px] tracking-[0.2em] mt-1">VINILI</p>
                </div>
                <div>
                  <span className="font-display text-3xl font-bold">10+</span>
                  <p className="text-muted-foreground text-[10px] tracking-[0.2em] mt-1">ANNI</p>
                </div>
                <div>
                  <span className="font-display text-3xl font-bold">∞</span>
                  <p className="text-muted-foreground text-[10px] tracking-[0.2em] mt-1">PASSIONE</p>
                </div>
              </div>
              <Link to="/chi-siamo" className="inline-flex items-center gap-2 text-primary text-xs tracking-[0.2em] font-mono hover:gap-4 transition-all">
                SCOPRI DI PIÙ <ArrowRight size={14} />
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
            <h2 className="font-display text-5xl md:text-7xl font-bold">
              DAL <span className="text-neon">DANCEFLOOR</span>
            </h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] mt-4 font-mono">
              VINILI • STREETWEAR • RAVE CULTURE
            </p>
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
            <h2 className="font-display text-5xl md:text-7xl font-bold mb-4">CATALOGO</h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">
              SFOGLIA PER GENERE — SCOPRI IL TUO SUONO
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {[
              { num: "01", name: "TECHNO", desc: "Pura potenza dal dancefloor", count: "1.2K dischi" },
              { num: "02", name: "HOUSE", desc: "Groove senza compromessi", count: "800 dischi" },
              { num: "03", name: "ACID", desc: "Il suono della 303", count: "340 dischi" },
              { num: "04", name: "JUNGLE / DNB", desc: "Breakbeat a velocità folle", count: "420 dischi" },
              { num: "05", name: "ELECTRO", desc: "Electro funk futuristico", count: "280 dischi" },
              { num: "06", name: "AMBIENT / DUB", desc: "Paesaggi sonori profondi", count: "350 dischi" },
            ].map((genre, i) => (
              <motion.a
                key={genre.num}
                href="https://www.discogs.com/seller/Elementi_Sonori/profile"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background p-8 group hover:bg-secondary transition-colors duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.6, delay: i * 0.1 } } }}
              >
                <div className="flex justify-end mb-4">
                  <span className="text-muted-foreground text-[10px] tracking-wider font-mono">[{genre.num}]</span>
                </div>
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
            <Link
              to="/catalogo"
              className="border border-primary text-primary px-10 py-3 text-xs tracking-[0.2em] font-mono hover:bg-primary hover:text-primary-foreground transition-all duration-300 inline-block"
            >
              VEDI TUTTO IL CATALOGO
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
              <h2 className="font-display text-5xl md:text-7xl font-bold mb-2">EVENTI</h2>
              <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono mb-8">PROSSIMI APPUNTAMENTI</p>

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
                TUTTI GLI EVENTI <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
        <FloatingSticker className="absolute bottom-10 right-10 hidden xl:block" size={100} spin />
      </section>
    </div>
  );
};

export default Index;
