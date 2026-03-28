import { useState } from "react";

const genres = [
  "VINYL", "TECHNO", "HOUSE", "ACID", "JUNGLE",
  "BREAKBEAT", "DUB", "AMBIENT", "ELECTRO"
];

const MarqueeStrip = () => {
  const [pressing, setPressing] = useState(false);
  const text = genres.join(" • ") + " • ";
  
  return (
    <div
      className={`w-full overflow-hidden bg-primary py-4 relative transition-transform duration-150 ${pressing ? "scale-y-110" : ""}`}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
      onMouseLeave={() => setPressing(false)}
    >
      <div className="marquee-track whitespace-nowrap">
        <span className="text-primary-foreground text-sm tracking-[0.3em] font-mono font-bold">
          {text}{text}{text}{text}
        </span>
      </div>
    </div>
  );
};

export default MarqueeStrip;
