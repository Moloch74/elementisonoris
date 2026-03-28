import { motion } from "framer-motion";
import logoSticker from "@/assets/logo-sticker.png";
import logoMain from "@/assets/logo-main.png";

/** Scattered rotating/floating logos across the page — purely decorative */
const StreetAnimations = () => {
  const items = [
    { x: "5%", y: "15%", size: 60, rotate: true, img: logoSticker, opacity: 0.06 },
    { x: "90%", y: "30%", size: 90, rotate: false, img: logoMain, opacity: 0.04 },
    { x: "15%", y: "55%", size: 50, rotate: true, img: logoSticker, opacity: 0.05 },
    { x: "80%", y: "70%", size: 70, rotate: false, img: logoSticker, opacity: 0.07 },
    { x: "50%", y: "85%", size: 45, rotate: true, img: logoMain, opacity: 0.03 },
    { x: "3%", y: "90%", size: 80, rotate: false, img: logoSticker, opacity: 0.05 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {items.map((item, i) => (
        <motion.img
          key={i}
          src={item.img}
          alt=""
          className="absolute invert"
          style={{
            left: item.x,
            top: item.y,
            width: item.size,
            height: item.size,
            opacity: item.opacity,
          }}
          animate={
            item.rotate
              ? { rotate: 360 }
              : { y: [0, -20, -5, -25, 0], rotate: [0, 5, -3, 4, 0] }
          }
          transition={
            item.rotate
              ? { duration: 30 + i * 5, repeat: Infinity, ease: "linear" }
              : { duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut" }
          }
          loading="lazy"
        />
      ))}
    </div>
  );
};

export default StreetAnimations;
