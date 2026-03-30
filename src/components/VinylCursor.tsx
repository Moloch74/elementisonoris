import { useEffect, useState, useCallback } from "react";

const CURSOR_SIZE = 32;

const VinylCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleMove = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
    if (!visible) setVisible(true);

    const target = e.target as HTMLElement;
    const isLink = target.closest("a, button, [role='button'], input[type='submit'], label, [data-clickable]");
    setHovering(!!isLink);
  }, [visible]);

  const handleDown = useCallback(() => {
    setClicking(true);
  }, []);

  const handleUp = useCallback(() => {
    setTimeout(() => setClicking(false), 200);
  }, []);

  const handleLeave = useCallback(() => {
    setVisible(false);
  }, []);

  const handleEnter = useCallback(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    document.documentElement.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      document.documentElement.removeEventListener("mouseenter", handleEnter);
    };
  }, [handleMove, handleDown, handleUp, handleLeave, handleEnter]);

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: pos.x - CURSOR_SIZE / 2,
        top: pos.y - CURSOR_SIZE / 2,
        width: CURSOR_SIZE,
        height: CURSOR_SIZE,
      }}
    >
      {/* Glow behind on hover */}
      {hovering && !clicking && (
        <div
          className="absolute inset-[-6px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(0 0% 100% / 0.3) 0%, transparent 70%)",
            filter: "blur(4px)",
          }}
        />
      )}

      {/* Vinyl image */}
      <img
        src={clicking ? "/vinyl-cursor-broken.png" : "/vinyl-cursor-src.png"}
        alt=""
        width={CURSOR_SIZE}
        height={CURSOR_SIZE}
        className="w-full h-full relative z-10 transition-transform duration-100"
        style={{
          transform: clicking ? "scale(1.3)" : "scale(1)",
        }}
        draggable={false}
      />
    </div>
  );
};

export default VinylCursor;
