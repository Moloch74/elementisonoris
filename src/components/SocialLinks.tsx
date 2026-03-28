import { motion } from "framer-motion";
import { Instagram, Facebook, Disc3, MessageCircle } from "lucide-react";

const socials = [
  {
    label: "INSTAGRAM",
    icon: Instagram,
    href: "https://www.instagram.com/elementi_sonori/",
  },
  {
    label: "FACEBOOK",
    icon: Facebook,
    href: "https://www.facebook.com/elementisonori",
  },
  {
    label: "DISCOGS",
    icon: Disc3,
    href: "https://www.discogs.com/seller/Elementi_Sonori/profile",
  },
  {
    label: "WHATSAPP",
    icon: MessageCircle,
    href: "https://wa.me/393714999328",
  },
];

const SocialLinks = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {socials.map((s, i) => (
        <motion.a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative border border-primary/40 px-6 py-3 flex items-center gap-3 hover:bg-primary hover:border-primary transition-all duration-300 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glitch line on hover */}
          <motion.div
            className="absolute inset-0 bg-primary/10"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.4 }}
          />
          <s.icon
            size={18}
            className="text-primary group-hover:text-primary-foreground transition-colors relative z-10"
          />
          <span className="text-primary text-xs tracking-[0.2em] font-mono group-hover:text-primary-foreground transition-colors relative z-10">
            {s.label}
          </span>
        </motion.a>
      ))}
    </div>
  );
};

export default SocialLinks;
