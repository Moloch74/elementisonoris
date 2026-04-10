import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Calendar, Users, Loader2 } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

const Eventi = () => {
  const { t } = useLang();

  const { data: allEvents = [], isLoading } = useQuery({
    queryKey: ["public-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const upcomingEvents = allEvents.filter((e) => e.is_upcoming);
  const pastEvents = allEvents.filter((e) => !e.is_upcoming);

  const stats = [
    { icon: Calendar, value: "50+", label: t("eventi.eventiAnno") },
    { icon: Users, value: "2K+", label: t("eventi.partecipanti") },
    { icon: MapPin, value: "10+", label: t("eventi.location") },
  ];

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
            {t("eventi.prossimiAppuntamenti")}
          </motion.p>
          <motion.h1 className="font-display text-6xl md:text-8xl font-bold" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {t("eventi.title")}
          </motion.h1>
          <motion.p className="text-muted-foreground text-sm font-mono mt-4 max-w-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {t("eventi.subtitle")}
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
              <motion.div key={i} className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.1 } } }}>
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
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <motion.div className="lg:col-span-2 relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <img src={dancefloor} alt="Evento" className="w-full aspect-[3/4] object-cover" loading="lazy" width={1280} height={960} />
                <img src={heroRave} alt="Rave" className="absolute -bottom-8 right-0 w-2/3 aspect-video object-cover border-4 border-background" loading="lazy" width={1920} height={1080} />
              </motion.div>
              <div className="lg:col-span-3">
                <h2 className="font-display text-3xl font-bold mb-2">{t("eventi.prossimi")} <span className="text-neon">{t("eventi.title")}</span></h2>
                <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono mb-8">2025 CALENDAR</p>
                {upcomingEvents.length === 0 ? (
                  <p className="text-muted-foreground font-mono text-sm py-8">{t("eventi.nessunEvento") || "Nessun evento in programma."}</p>
                ) : upcomingEvents.map((event, i) => (
                  <motion.div key={event.id} className="border-b border-border py-6 group hover:bg-secondary/30 transition-colors px-4 -mx-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.5, delay: i * 0.1 } } }}>
                    <div className="flex items-start gap-6">
                      <span className="text-primary font-display text-2xl font-bold min-w-[80px]">{event.date_label}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-display text-lg font-bold">{event.name}</h3>
                          <span className="border border-primary text-primary text-[10px] tracking-[0.15em] px-3 py-1 font-mono shrink-0 ml-4">{event.tag}</span>
                        </div>
                        <p className="text-muted-foreground text-xs font-mono mb-1">{event.location}</p>
                        {event.time_range && <p className="text-primary/70 text-[10px] font-mono mb-2">{event.time_range}</p>}
                        {event.description && <p className="text-muted-foreground text-xs font-mono leading-relaxed">{event.description}</p>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-2">{t("eventi.dalDancefloor")} <span className="text-neon">DANCEFLOOR</span></h2>
            <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">{t("eventi.momentiScena")}</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[dancefloor, heroRave, warehouseRave, storeInterior, warehouseRave, dancefloor, heroRave, storeInterior].map((img, i) => (
              <motion.div key={i} className="overflow-hidden" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { duration: 0.4, delay: i * 0.06 } } }}>
                <img src={img} alt="" className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past events */}
      {pastEvents.length > 0 && (
        <section className="py-24 border-t border-border">
          <div className="container mx-auto px-4 md:px-8 max-w-3xl">
            <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="font-display text-3xl font-bold mb-2 text-muted-foreground">{t("eventi.eventiPassati")}</h2>
              <p className="text-muted-foreground text-xs tracking-[0.3em] font-mono">{t("eventi.archivio")}</p>
            </motion.div>
            {pastEvents.map((event, i) => (
              <motion.div key={event.id} className="border-b border-border/50 py-4 opacity-60 hover:opacity-100 transition-opacity" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <div className="flex items-center gap-6">
                  <span className="text-muted-foreground font-display text-lg font-bold min-w-[80px]">{event.date_label}</span>
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
      )}

      {/* CTA */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{t("eventi.vuoiOrganizzare")} <span className="text-neon">{t("eventi.evento")}</span>?</h2>
            <p className="text-muted-foreground text-sm font-mono mb-8 max-w-md mx-auto">{t("eventi.collaboriamo")}</p>
            <Link to="/contatti" className="border border-primary text-primary px-10 py-3 text-xs tracking-[0.2em] font-mono hover:bg-primary hover:text-primary-foreground transition-all duration-300 inline-flex items-center gap-2">
              {t("index.contattaci")} <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      <FloatingSticker className="absolute bottom-20 left-10 hidden xl:block" size={90} />
    </div>
  );
};

export default Eventi;
