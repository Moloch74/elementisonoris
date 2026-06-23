import stickerImg from "@/assets/logo-sticker.png";

interface FloatingStickerProps {
  className?: string;
  size?: number;
  spin?: boolean;
}

/**
 * Lightweight floating sticker — uses CSS keyframes (composited) instead of
 * framer-motion to avoid React work on every animation frame.
 */
const FloatingSticker = ({ className = "", size = 120, spin = false }: FloatingStickerProps) => {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={{
        animation: spin ? "es-fs-spin 20s linear infinite" : "es-fs-float 6s ease-in-out infinite",
        willChange: "transform",
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes es-fs-spin { to { transform: rotate(360deg); } }
        @keyframes es-fs-float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
      <img
        src={stickerImg}
        alt=""
        className="invert opacity-10"
        style={{ width: size, height: size }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

export default FloatingSticker;
