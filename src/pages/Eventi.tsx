import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Calendar, Users } from "lucide-react";
import heroRave from "@/assets/hero-rave.jpg";
import warehouseRave from "@/assets/warehouse-rave.jpg";
import dancefloor from "@/assets/dancefloor.jpg";
import storeInterior from "@/assets/store-interior.jpg";
import FloatingSticker from "@/components/FloatingSticker";
import MarqueeStrip from "@/components/MarqueeStrip";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const events = [
  { date: "12 APR", name: "VINYL ONLY NIGHT", location: "Elementi Sonori — Lecce", tag: "IN-STORE", desc: "Una serata dedicata al vinile puro. Solo giradischi, solo wax. Selezione techno, house e acid.", time: "21:00 — 02:00" },
  { date: "26 APR", name: "ACID TEKNO SESSION", location: "Warehouse District — Lecce", tag: "RAVE", desc: "Warehouse party con i migliori selectors della scena acid tekno pugliese. Sound system da 10K watts.", time: "23:00 — 06:00" },
  { date: "10 MAG", name: "DIGGING DAY", location: "Elementi Sonori — Lecce", tag: "IN-STORE", desc: "Giornata di scavo nelle casse. Nuovi arrivi, rarità e chicche da collezionisti.", time: "11:00 — 21:00" },
  { date: "24 MAG", name: "JUNGLE MASSIVE", location: "Ex Convento — Lecce", tag: "RAVE", desc: "Jungle, drum & bass e breakbeat in un'atmosfera unica. MC live e vinyl only set.", time: "23:00 — 05:00" },
  { date: "7 GIU", name: "SUMMER OPENING", location: "Location TBA", tag: "OPEN AIR", desc: "L'inaugurazione dell'estate con un evento all'aperto. Dettagli in arrivo.", time: "TBA" },
];

const pastEvents = [
  { date: "15 MAR", name: "DEEP HOUSE SELECTION", location: "Elementi Sonori — Lecce", tag: "IN-STORE" },
  { date: "1 MAR", name: "TECHNO RESISTANCE", location: "Bunker — Lecce", tag: "RAVE" },
  { date: "14 FEB", name: "LOVE IS A GROOVE", location: "Elementi Sonori — Lecce", tag: "IN-STORE" },
  { date: "25 GEN", name: "WINTER WAREHOUSE", location: "Zona Industriale — Lecce", tag: "RAVE" },
  { date: "31 DIC", name: "NYE ACID MARATHON", location: "Elementi Sonori — Lecce", tag: "IN-STORE" },
  { date: "14 DIC", name: "ELECTRO XMAS", location: "Elementi Sonori — Lecce", tag: "IN-STORE" },
];

const stats = [
  { icon: Calendar, value: "50+", label: "EVENTI ALL'ANNO" },
  { icon: Users, value: "2K+", label: "PARTECIPANTI" },
  { icon: MapPin, value: "10+", label: "LOCATION" },
];

const Eventi = () => {
  return (
    <div className="pt-16 relative">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={warehouseRave} alt="" className="w-full h-full object-cover opacity-20" loading="lazy" width={1280} height={960} />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.p className="text-primary text-xs tracking-[0.4em] font-mono mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            [PROSSIMI APPUNTAMENTI]
          </motion.p>
          <motion.h1 className="font-display text-6xl md:text-8xl font-bold" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            EVENTI
          </motion.h1>
          <motion.p className="text-muted-foreground text-sm font-mono mt-4 max-w-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            Dal negozio al warehouse. In-store sessions, rave e digging days.
          </motion.p>
        </div>
        <FloatingSticker className="absolute top-10 right-20 hidden lg:block" size={100} spin />
      </section>

      <MarqueeStrip />

      {/* Stats */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.1 } } }}
              >
                <s.icon size={24} className="mx-auto mb-2 text-primary" />
                <span className="font-display text-3xl md:text-4xl font-bold">{s.value}</span>
                <p className="text-muted-foreground text-[10px] tracking-[0.2em] mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Images */}
            <motion.div className="lg:col-span-2 relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <img src={dancefloor} alt="Evento" className="w-full aspect-[3/4] object-cover" loading="lazy" width={1280} height={960} />
              <img src={heroRave} alt="Rave" className="absolute -bottom-8 right-0 w-2/3 aspect-video object-cover border-4 border-background" loading="lazy" width={1920} height={1080} />
            </motion.div>

            {/* Events List */}
            <div className="lg:col-span-3">
              <h2 className="font-display text-3xl font-bold mb-2">PROSSIMI <span className="text-neon">EVENTI</span></h2>
              <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono mb-8">2025 CALENDAR</p>

              {events.map((event, i) => (
                <motion.div
                  key={i}
                  className="border-b border-border py-6 group hover:bg-secondary/30 transition-colors px-4 -mx-4"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.1 } } }}
                >
                  <div className="flex items-start gap-6">
                    <span className="text-primary font-display text-2xl font-bold min-w-[80px]">{event.date}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-display text-lg font-bold">{event.name}</h3>
                        <span className="border border-primary text-primary text-[10px] tracking-[0.15em] px-3 py-1 font-mono shrink-0 ml-4">{event.tag}</span>
                      </div>
                      <p className="text-muted-foreground text-xs font-mono mb-1">{event.location}</p>
                      <p className="text-primary/70 text-[10px] font-mono mb-2">{event.time}</p>
                      <p className="text-muted-foreground text-xs font-mono leading-relaxed">{event.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-2">DAL <span className="text-neon">DANCEFLOOR</span></h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">MOMENTI DALLA SCENA</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[dancefloor, heroRave, warehouseRave, storeInterior, warehouseRave, dancefloor, heroRave, storeInterior].map((img, i) => (
              <motion.div
                key={i}
                className="overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.4, delay: i * 0.06 } } }}
              >
                <img src={img} alt="" className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past events */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-3xl font-bold mb-2 text-muted-foreground">EVENTI PASSATI</h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">ARCHIVIO</p>
          </motion.div>
          {pastEvents.map((event, i) => (
            <motion.div
              key={i}
              className="border-b border-border/50 py-4 opacity-60 hover:opacity-100 transition-opacity"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="flex items-center gap-6">
                <span className="text-muted-foreground font-display text-lg font-bold min-w-[80px]">{event.date}</span>
                <div className="flex-1">
                  <h3 className="font-display text-sm font-bold">{event.name}</h3>
                  <p className="text-muted-foreground text-xs font-mono">{event.location}</p>
                </div>
                <span className="border border-border text-muted-foreground text-[10px] tracking-[0.15em] px-3 py-1 font-mono">{event.tag}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">VUOI ORGANIZZARE UN <span className="text-neon">EVENTO</span>?</h2>
            <p className="text-muted-foreground text-sm font-mono mb-8 max-w-md mx-auto">
              Collaboriamo con DJ, collettivi e organizzatori. Scrivici per proposte e collaborazioni.
            </p>
            <Link
              to="/contatti"
              className="border border-primary text-primary px-10 py-3 text-xs tracking-[0.2em] font-mono hover:bg-primary hover:text-primary-foreground transition-all duration-300 inline-flex items-center gap-2"
            >
              CONTATTACI <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      <FloatingSticker className="absolute bottom-20 left-10 hidden xl:block" size={90} />
    </div>
  );
};

export default Eventi;
