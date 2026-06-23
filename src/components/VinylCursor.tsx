import { useEffect, useRef } from "react";

const CURSOR_SIZE = 32;

/**
 * Custom cursor — positions itself via direct DOM mutation inside a
 * requestAnimationFrame loop instead of React state, so mousemove never
 * triggers re-renders (was a major cause of jank on the home page).
 */
const VinylCursor = () => {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100, hovering: false, clicking: false, visible: false });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const el = ref.current;
      if (el) {
        const { x, y, visible, hovering, clicking } = target.current;
        el.style.transform = `translate3d(${x - CURSOR_SIZE / 2}px, ${y - CURSOR_SIZE / 2}px, 0)`;
        el.style.opacity = visible ? "1" : "0";
        if (imgRef.current) {
          imgRef.current.style.transform = clicking ? "scale(1.3)" : "scale(1)";
          imgRef.current.src = clicking ? "/vinyl-cursor-broken.png" : "/vinyl-cursor-src.png";
        }
        if (glowRef.current) {
          glowRef.current.style.opacity = hovering && !clicking ? "1" : "0";
        }
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      target.current.visible = true;
      const el = e.target as HTMLElement | null;
      target.current.hovering = !!el?.closest("a, button, [role='button'], input[type='submit'], label, [data-clickable]");
    };
    const onDown = () => { target.current.clicking = true; };
    const onUp = () => { setTimeout(() => { target.current.clicking = false; }, 200); };
    const onLeave = () => { target.current.visible = false; };
    const onEnter = () => { target.current.visible = true; };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ width: CURSOR_SIZE, height: CURSOR_SIZE, opacity: 0, willChange: "transform, opacity" }}
      aria-hidden="true"
    >
      <div
        ref={glowRef}
        className="absolute inset-[-6px] rounded-full transition-opacity duration-150"
        style={{
          background: "radial-gradient(circle, hsl(0 0% 100% / 0.3) 0%, transparent 70%)",
          filter: "blur(4px)",
          opacity: 0,
        }}
      />
      <img
        ref={imgRef}
        src="/vinyl-cursor-src.png"
        alt=""
        width={CURSOR_SIZE}
        height={CURSOR_SIZE}
        className="w-full h-full relative z-10 transition-transform duration-100"
        draggable={false}
      />
    </div>
  );
};

export default VinylCursor;
