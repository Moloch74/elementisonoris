import { useLang } from "@/contexts/LangContext";
import { motion } from "framer-motion";

const LanguageToggle = () => {
  const { lang, setLang } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-0 border border-border bg-card/90 backdrop-blur-sm overflow-hidden"
    >
      <button
        onClick={() => setLang("it")}
        className={`px-3 py-2 text-[10px] tracking-[0.2em] font-mono font-bold transition-all ${
          lang === "it"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        IT
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-2 text-[10px] tracking-[0.2em] font-mono font-bold transition-all ${
          lang === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
    </motion.div>
  );
};

export default LanguageToggle;
