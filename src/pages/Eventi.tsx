import { motion } from "framer-motion";
import heroRave from "@/assets/hero-rave.jpg";
import warehouseRave from "@/assets/warehouse-rave.jpg";
import dancefloor from "@/assets/dancefloor.jpg";
import FloatingSticker from "@/components/FloatingSticker";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const events = [
  { date: "12 APR", name: "VINYL ONLY NIGHT", location: "Elementi Sonori — Lecce", tag: "IN-STORE", desc: "Una serata dedicata al vinile puro. Solo giradischi, solo wax. Selezione techno, house e acid." },
  { date: "26 APR", name: "ACID TEKNO SESSION", location: "Warehouse District — Lecce", tag: "RAVE", desc: "Warehouse party con i migliori selectors della scena acid tekno pugliese. Sound system da 10K watts." },
  { date: "10 MAG", name: "DIGGING DAY", location: "Elementi Sonori — Lecce", tag: "IN-STORE", desc: "Giornata di scavo nelle casse. Nuovi arrivi, rarità e chicche da collezionisti." },
  { date: "24 MAG", name: "JUNGLE MASSIVE", location: "Ex Convento — Lecce", tag: "RAVE", desc: "Jungle, drum & bass e breakbeat in un'atmosfera unica. MC live e vinyl only set." },
  { date: "7 GIU", name: "SUMMER OPENING", location: "Location TBA", tag: "OPEN AIR", desc: "L'inaugurazione dell'estate con un evento all'aperto. Dettagli in arrivo." },
];

const pastEvents = [
  { date: "15 MAR", name: "DEEP HOUSE SELECTION", location: "Elementi Sonori — Lecce", tag: "IN-STORE" },
  { date: "1 MAR", name: "TECHNO RESISTANCE", location: "Bunker — Lecce", tag: "RAVE" },
  { date: "14 FEB", name: "LOVE IS A GROOVE", location: "Elementi Sonori — Lecce", tag: "IN-STORE" },
];

const Eventi = () => {
  return (
    <div className="pt-16 relative">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={warehouseRave} alt="" className="w-full h-full object-cover opacity-20" loading="lazy" width={1280} height={960} />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.h1 className="font-display text-6xl md:text-8xl font-bold" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            EVENTI
          </motion.h1>
          <motion.p className="text-muted-foreground text-xs tracking-[0.3em] font-mono mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            PROSSIMI APPUNTAMENTI
          </motion.p>
        </div>
      </section>

      {/* Main content */}
      <section className="pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Images */}
            <motion.div className="lg:col-span-2 relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <img src={dancefloor} alt="Evento" className="w-full aspect-[3/4] object-cover" loading="lazy" width={1280} height={960} />
              <img src={heroRave} alt="Rave" className="absolute -bottom-8 right-0 w-2/3 aspect-video object-cover border-4 border-background" loading="lazy" width={1920} height={1080} />
            </motion.div>

            {/* Events List */}
            <div className="lg:col-span-3">
              <h2 className="font-display text-3xl font-bold mb-8">PROSSIMI <span className="text-neon">EVENTI</span></h2>
              {events.map((event, i) => (
                <motion.div
                  key={i}
                  className="border-b border-border py-6 group"
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
                      <p className="text-muted-foreground text-xs font-mono mb-2">{event.location}</p>
                      <p className="text-muted-foreground text-xs font-mono leading-relaxed">{event.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Past events */}
              <h3 className="font-display text-xl font-bold mt-16 mb-6 text-muted-foreground">EVENTI PASSATI</h3>
              {pastEvents.map((event, i) => (
                <motion.div
                  key={i}
                  className="border-b border-border/50 py-4 opacity-50"
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
          </div>
        </div>
      </section>

      <FloatingSticker className="absolute bottom-20 left-10 hidden xl:block" size={90} />
    </div>
  );
};

export default Eventi;
