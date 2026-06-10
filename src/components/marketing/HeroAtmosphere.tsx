interface HeroAtmosphereProps {
  className?: string;
}

/** Decorative mesh orbs — studio signal spectrum, CSS-only */
export default function HeroAtmosphere({ className = "" }: HeroAtmosphereProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {/* Primary brand orb */}
      <div className="orb-drift absolute -right-16 top-8 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
      {/* Emerald wash */}
      <div
        className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-accent-emerald/8 blur-3xl"
        style={{ animation: "orb-drift 10s ease-in-out infinite reverse" }}
      />
      {/* Sky accent */}
      <div className="absolute right-1/3 top-1/2 h-40 w-40 rounded-full bg-accent-sky/6 blur-2xl" />
    </div>
  );
}
