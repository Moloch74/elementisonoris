const genres = [
  "VINYL", "TECHNO", "HOUSE", "ACID", "JUNGLE",
  "BREAKBEAT", "DUB", "AMBIENT", "ELECTRO"
];

const MarqueeStrip = () => {
  const text = genres.join(" • ") + " • ";
  
  return (
    <div className="w-full overflow-hidden bg-primary py-2 relative">
      <div className="marquee-track whitespace-nowrap">
        <span className="text-primary-foreground text-xs tracking-[0.3em] font-mono font-bold">
          {text}{text}{text}{text}
        </span>
      </div>
    </div>
  );
};

export default MarqueeStrip;
