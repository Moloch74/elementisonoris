import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ContactForm = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Compila tutti i campi", variant: "destructive" });
      return;
    }
    setSending(true);

    // Open mailto
    const subject = encodeURIComponent(`Contatto da ${form.name}`);
    const body = encodeURIComponent(
      `Nome: ${form.name}\nEmail: ${form.email}\n\nMessaggio:\n${form.message}`
    );
    window.open(
      `mailto:elementisonori23@gmail.com?subject=${subject}&body=${body}`,
      "_blank"
    );

    setSending(false);
    toast({ title: "Email pronta per l'invio!" });
    setForm({ name: "", email: "", message: "" });
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Ciao! Mi chiamo ${form.name || ""}. ${form.message || "Vorrei informazioni."}`
    );
    window.open(`https://wa.me/393714999328?text=${text}`, "_blank");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-primary text-xs tracking-[0.2em] font-mono mb-4">
        SCRIVICI
      </h3>

      <Input
        placeholder="NOME"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="bg-secondary border-border text-foreground font-mono text-xs tracking-wider placeholder:text-muted-foreground focus:border-primary"
      />
      <Input
        type="email"
        placeholder="EMAIL"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="bg-secondary border-border text-foreground font-mono text-xs tracking-wider placeholder:text-muted-foreground focus:border-primary"
      />
      <Textarea
        placeholder="IL TUO MESSAGGIO..."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="bg-secondary border-border text-foreground font-mono text-xs tracking-wider placeholder:text-muted-foreground focus:border-primary min-h-[120px] resize-none"
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          type="submit"
          disabled={sending}
          className="flex-1 border border-primary bg-primary text-primary-foreground px-6 py-3 text-xs tracking-[0.2em] font-mono font-bold flex items-center justify-center gap-2 hover:glow-neon transition-all duration-300 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Send size={14} />
          INVIA EMAIL
        </motion.button>

        <motion.button
          type="button"
          onClick={handleWhatsApp}
          className="flex-1 border border-primary text-primary px-6 py-3 text-xs tracking-[0.2em] font-mono font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageCircle size={14} />
          WHATSAPP
        </motion.button>
      </div>
    </motion.form>
  );
};

export default ContactForm;
