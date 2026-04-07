import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WhatsAppButton = () => (
  <motion.a
    href="https://wa.me/393714999328"
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 1.2, duration: 0.5 }}
    className="fixed bottom-6 right-24 z-50 w-11 h-11 bg-[hsl(142_70%_45%)] hover:bg-[hsl(142_70%_38%)] text-white flex items-center justify-center transition-colors duration-300 shadow-lg"
    aria-label="WhatsApp"
  >
    <MessageCircle size={20} />
  </motion.a>
);

export default WhatsAppButton;
