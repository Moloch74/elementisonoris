import { motion } from "framer-motion";
import stickerImg from "@/assets/logo-sticker.png";

interface FloatingStickerProps {
  className?: string;
  size?: number;
  spin?: boolean;
}

const FloatingSticker = ({ className = "", size = 120, spin = false }: FloatingStickerProps) => {
  return (
    <motion.div
      className={`pointer-events-none select-none ${className}`}
      animate={spin ? { rotate: 360 } : { y: [0, -15, -5, -20, 0] }}
      transition={spin ? { duration: 20, repeat: Infinity, ease: "linear" } : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <img
        src={stickerImg}
        alt=""
        className="invert opacity-10"
        style={{ width: size, height: size }}
        loading="lazy"
      />
    </motion.div>
  );
};

export default FloatingSticker;
