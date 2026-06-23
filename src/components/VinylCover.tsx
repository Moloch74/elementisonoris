import { useEffect, useState } from "react";

type Props = {
  src?: string | null;
  name: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
  width?: number;
  height?: number;
  /** Which side of the vinyl to draw when no `src` is available. */
  side?: "front" | "back";
};

/**
 * Renders a product cover image with an automatic fallback:
 * if `src` is empty or fails to load, a generated SVG placeholder
 * showing the product name on a black background is shown instead.
 */
const VinylCover = ({
  src,
  name,
  alt,
  className,
  loading = "lazy",
  width = 512,
  height = 512,
  side = "front",
}: Props) => {
  const [errored, setErrored] = useState(false);

  // Reset error state when the src changes (e.g. after edit/cache-bust)
  useEffect(() => {
    setErrored(false);
  }, [src]);

  if (!src || errored) {
    return (
      <div
        className={className}
        style={{ width: "100%", height: "100%" }}
        role="img"
        aria-label={alt || name}
      >
        {side === "back" ? <FallbackVinylDisc name={name} /> : <FallbackCover name={name} />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || name}
      loading={loading}
      width={width}
      height={height}
      className={className}
      onError={() => setErrored(true)}
    />
  );
};

const FallbackCover = ({ name }: { name: string }) => {
  // Wrap text into up to 3 lines, ~14 chars per line
  const words = (name || "VINILE").trim().toUpperCase().split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length > 14 && current) {
      lines.push(current);
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
    if (lines.length === 2) break;
  }
  if (current) lines.push(current);
  if (words.join(" ").length > lines.join(" ").length) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = last.length > 13 ? last.slice(0, 12) + "…" : last;
  }
  const fontSize = lines.length === 1 ? 56 : lines.length === 2 ? 44 : 36;
  const startY = 256 - ((lines.length - 1) * fontSize * 0.55);

  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block", background: "#000" }}
    >
      <defs>
        <pattern id="grain" width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height="3" fill="#000" />
          <circle cx="1" cy="1" r="0.4" fill="#fff" opacity="0.05" />
        </pattern>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.7" />
        </radialGradient>
      </defs>

      {/* base */}
      <rect width="512" height="512" fill="#0a0a0a" />
      <rect width="512" height="512" fill="url(#grain)" />

      {/* concentric vinyl rings */}
      <g stroke="#1a1a1a" strokeWidth="1" fill="none">
        {Array.from({ length: 18 }).map((_, i) => (
          <circle key={i} cx="256" cy="256" r={60 + i * 12} />
        ))}
      </g>
      <circle cx="256" cy="256" r="36" fill="#111" stroke="#222" />
      <circle cx="256" cy="256" r="4" fill="#000" />

      {/* corner brackets */}
      <g stroke="#fff" strokeOpacity="0.35" strokeWidth="2" fill="none">
        <path d="M16 16 L48 16 M16 16 L16 48" />
        <path d="M496 16 L464 16 M496 16 L496 48" />
        <path d="M16 496 L48 496 M16 496 L16 464" />
        <path d="M496 496 L464 496 M496 496 L496 464" />
      </g>

      <rect width="512" height="512" fill="url(#vignette)" />

      {/* label */}
      <text
        x="256"
        y="40"
        textAnchor="middle"
        fill="#fff"
        opacity="0.5"
        style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: 4 }}
      >
        ELEMENTI SONORI
      </text>

      {/* title */}
      <g style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", fontWeight: 900 }}>
        {lines.map((line, i) => (
          <text
            key={i}
            x="256"
            y={startY + i * fontSize * 1.05}
            textAnchor="middle"
            fill="#fff"
            style={{ fontSize, letterSpacing: 2 }}
          >
            {line}
          </text>
        ))}
      </g>

      <text
        x="256"
        y="488"
        textAnchor="middle"
        fill="#fff"
        opacity="0.5"
        style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: 4 }}
      >
        UNDERGROUND VINYL
      </text>
    </svg>
  );
};

/** Vinyl disc with center label — used as the "back" fallback when no retro image is uploaded. */
const FallbackVinylDisc = ({ name }: { name: string }) => {
  const label = (name || "ELEMENTI SONORI").trim().toUpperCase().slice(0, 18);
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block", background: "#000" }}
    >
      <defs>
        <radialGradient id="discShine" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="60%" stopColor="#0a0a0a" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <radialGradient id="discVignette" cx="50%" cy="50%" r="70%">
          <stop offset="70%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.85" />
        </radialGradient>
      </defs>

      <rect width="512" height="512" fill="#050505" />

      {/* disc */}
      <circle cx="256" cy="256" r="240" fill="url(#discShine)" />

      {/* grooves */}
      <g stroke="#1a1a1a" strokeWidth="0.6" fill="none" opacity="0.9">
        {Array.from({ length: 60 }).map((_, i) => (
          <circle key={i} cx="256" cy="256" r={90 + i * 2.4} />
        ))}
      </g>
      <g stroke="#fff" strokeOpacity="0.04" strokeWidth="0.4" fill="none">
        {Array.from({ length: 30 }).map((_, i) => (
          <circle key={i} cx="256" cy="256" r={95 + i * 4.8} />
        ))}
      </g>

      {/* center label */}
      <circle cx="256" cy="256" r="84" fill="#0f0f0f" stroke="#1f1f1f" />
      <circle cx="256" cy="256" r="84" fill="none" stroke="#fff" strokeOpacity="0.15" />
      <text
        x="256"
        y="248"
        textAnchor="middle"
        fill="#fff"
        opacity="0.7"
        style={{ fontFamily: "ui-monospace, monospace", fontSize: 9, letterSpacing: 3 }}
      >
        ELEMENTI SONORI
      </text>
      <text
        x="256"
        y="270"
        textAnchor="middle"
        fill="#fff"
        style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", fontSize: 12, letterSpacing: 2, fontWeight: 700 }}
      >
        {label}
      </text>
      <circle cx="256" cy="256" r="4" fill="#000" />

      <rect width="512" height="512" fill="url(#discVignette)" />
    </svg>
  );
};

export default VinylCover;

