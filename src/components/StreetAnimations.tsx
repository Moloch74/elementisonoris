import logoSticker from "@/assets/logo-sticker.png";
import logoMain from "@/assets/logo-main.png";

/**
 * Decorative scattered logos. Uses pure CSS animations (composited by the
 * GPU) instead of framer-motion to avoid per-frame React work on every page.
 */
const items = [
  { x: "5%", y: "15%", size: 60, img: logoSticker, opacity: 0.06, anim: "es-spin 40s linear infinite" },
  { x: "90%", y: "30%", size: 90, img: logoMain, opacity: 0.04, anim: "es-float 12s ease-in-out infinite" },
  { x: "15%", y: "55%", size: 50, img: logoSticker, opacity: 0.05, anim: "es-spin 55s linear infinite reverse" },
  { x: "80%", y: "70%", size: 70, img: logoSticker, opacity: 0.07, anim: "es-float 16s ease-in-out infinite" },
];

const StreetAnimations = () => (
  <>
    <style>{`
      @keyframes es-spin { to { transform: rotate(360deg); } }
      @keyframes es-float {
        0%,100% { transform: translateY(0) rotate(0); }
        50% { transform: translateY(-18px) rotate(4deg); }
      }
    `}</style>
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {items.map((item, i) => (
        <img
          key={i}
          src={item.img}
          alt=""
          aria-hidden="true"
          className="absolute invert"
          style={{
            left: item.x,
            top: item.y,
            width: item.size,
            height: item.size,
            opacity: item.opacity,
            animation: item.anim,
            willChange: "transform",
          }}
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  </>
);

export default StreetAnimations;
