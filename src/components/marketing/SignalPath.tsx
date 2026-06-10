interface SignalPathProps {
  steps: [string, string, string];
}

export default function SignalPath({ steps }: SignalPathProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
      {steps.map((label, index) => (
        <span key={label} className="flex items-center gap-2 sm:gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-full border border-border-default bg-foreground-primary/[0.03] px-3 py-1.5 font-mono text-[11px] text-foreground-secondary backdrop-blur-sm sm:text-xs">
            <span className="text-brand/70">{String(index + 1).padStart(2, "0")}</span>
            {label}
          </span>
          {index < steps.length - 1 && (
            <svg
              className="hidden h-3 w-6 shrink-0 sm:block"
              viewBox="0 0 24 12"
              fill="none"
              aria-hidden
            >
              <path
                d="M0 6h16M16 6l-3-3M16 6l-3 3"
                stroke="hsl(var(--brand) / 0.35)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="signal-flow"
              />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}
