import { Mic, Monitor, Video } from "lucide-react";

interface ProductPreviewProps {
  idleLabel: string;
  recordingLabel: string;
}

export default function ProductPreview({ idleLabel, recordingLabel }: ProductPreviewProps) {
  return (
    <div className="relative w-full max-w-lg">
      {/* Layered ambient glow */}
      <div
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-brand/8 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-accent-emerald/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-2 top-8 h-24 w-24 rounded-full bg-accent-sky/8 blur-2xl"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-2xl border border-border-default bg-surface-1/80 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.7),0_0_0_1px_hsl(0_0%_100%/0.04)_inset] backdrop-blur-sm">
        {/* Viewfinder screen */}
        <div className="relative aspect-video overflow-hidden">
          <div className="spectrum-wash absolute inset-0" aria-hidden />

          {/* Scan lines overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 3px)",
            }}
            aria-hidden
          />

          {/* Delicate signal rings */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden
          >
            <div className="h-40 w-40 rounded-full border border-brand/10" />
            <div className="absolute h-28 w-28 rounded-full border border-accent-sky/10" />
            <div className="absolute h-16 w-16 rounded-full border border-accent-emerald/15" />
          </div>

          {/* Status badge */}
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-border-default bg-black/50 px-3 py-1 font-mono text-[11px] backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-recording rec-pulse shadow-[0_0_8px_hsl(var(--recording)/0.6)]" />
            <span className="text-foreground-secondary">{recordingLabel}</span>
          </div>

          {/* Telemetry bar */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-border-default bg-black/50 p-3 font-mono text-[11px] text-foreground-secondary backdrop-blur-md">
            <span>
              Time: <b className="text-foreground-primary">00:42</b> / 05:00
            </span>
            <span className="hidden sm:inline">
              Buffer: <b className="text-brand">12.6 MB</b>
            </span>
          </div>

          {/* Center idle indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full border border-border-default bg-black/30 px-4 py-1.5 font-mono text-[11px] text-foreground-tertiary backdrop-blur-sm">
              {idleLabel}
            </span>
          </div>
        </div>

        {/* VU meter */}
        <div className="flex items-center gap-3 border-t border-border-subtle bg-foreground-primary/[0.02] p-4">
          <Mic className="h-4 w-4 shrink-0 text-foreground-tertiary" aria-hidden />
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground-primary/[0.06]">
            <div
              className="vu-bar-animate h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, hsl(var(--brand)), hsl(var(--accent-emerald)), hsl(var(--accent-sky)))",
              }}
            />
          </div>
          <span className="w-8 text-right font-mono text-[10px] text-foreground-muted">62%</span>
        </div>

        {/* Source selectors mock */}
        <div className="grid grid-cols-3 gap-1 border-t border-border-subtle p-2">
          {[
            { icon: Video, label: "Camera", active: true, tint: "brand" },
            { icon: Monitor, label: "Screen", active: false, tint: "sky" },
            { icon: Mic, label: "Mic", active: false, tint: "emerald" },
          ].map(({ icon: Icon, label, active, tint }) => (
            <div
              key={label}
              className={`flex flex-col items-center justify-center rounded-xl py-2.5 text-[10px] font-medium transition-colors ${
                active
                  ? "border border-border-default bg-foreground-primary/[0.05] text-foreground-primary"
                  : "text-foreground-muted"
              }`}
            >
              <Icon
                className={`mb-1 h-3.5 w-3.5 ${
                  active
                    ? "text-brand"
                    : tint === "sky"
                      ? "text-accent-sky/60"
                      : "text-accent-emerald/60"
                }`}
                aria-hidden
              />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
