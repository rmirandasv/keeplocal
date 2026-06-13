import { FileImage, Monitor, ShieldCheck, Video } from "lucide-react";

interface ToolsPreviewProps {
  recordOnceLabel: string;
  recordingLabel: string;
  screenToGifLabel: string;
  gifReadyLabel: string;
  exifStripperLabel: string;
  metadataRemovedLabel: string;
}

export default function ToolsPreview({
  recordOnceLabel,
  recordingLabel,
  screenToGifLabel,
  gifReadyLabel,
  exifStripperLabel,
  metadataRemovedLabel,
}: ToolsPreviewProps) {
  return (
    <div className="relative w-full max-w-lg">
      <div
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-brand/8 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-6 -left-6 h-36 w-36 rounded-full bg-accent-emerald/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-4 top-12 h-28 w-28 rounded-full bg-accent-sky/8 blur-2xl"
        aria-hidden
      />

      <div className="relative flex flex-col gap-3">
        {/* Record Once mini preview */}
        <div className="overflow-hidden rounded-2xl border border-border-default bg-surface-1/80 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.6)] backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Video className="h-3.5 w-3.5 text-brand" aria-hidden />
              <span className="text-[11px] font-semibold text-foreground-primary">
                {recordOnceLabel}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-black/40 px-2 py-0.5 font-mono text-[9px] text-foreground-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-recording rec-pulse" />
              {recordingLabel}
            </span>
          </div>
          <div className="relative aspect-[16/7] overflow-hidden">
            <div className="spectrum-wash absolute inset-0" aria-hidden />
            <div className="absolute bottom-3 left-3 right-3 flex justify-between rounded-lg border border-border-default bg-black/50 px-2.5 py-1.5 font-mono text-[9px] text-foreground-secondary backdrop-blur-md">
              <span>
                Time: <b className="text-foreground-primary">00:42</b>
              </span>
              <span>
                Buffer: <b className="text-brand">12.6 MB</b>
              </span>
            </div>
          </div>
        </div>

        {/* Screen to GIF mini preview */}
        <div className="overflow-hidden rounded-2xl border border-border-default bg-surface-1/80 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.6)] backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Monitor className="h-3.5 w-3.5 text-accent-sky" aria-hidden />
              <span className="text-[11px] font-semibold text-foreground-primary">
                {screenToGifLabel}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-black/40 px-2 py-0.5 font-mono text-[9px] text-accent-emerald">
              <FileImage className="h-2.5 w-2.5" aria-hidden />
              GIF
            </span>
          </div>
          <div className="relative aspect-[16/7] overflow-hidden bg-viewfinder">
            <div
              className="absolute inset-0 opacity-80"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--accent-sky) / 0.12), hsl(var(--viewfinder)), hsl(var(--accent-emerald) / 0.08))",
              }}
              aria-hidden
            />
            {/* GIF frame strip mock */}
            <div className="absolute inset-x-4 bottom-3 flex gap-1">
              {[0.9, 0.7, 1, 0.8, 0.6, 0.85].map((opacity, i) => (
                <div
                  key={i}
                  className="h-8 flex-1 rounded border border-border-default bg-foreground-primary/[0.04]"
                  style={{ opacity }}
                  aria-hidden
                />
              ))}
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="rounded-full border border-border-default bg-black/30 px-3 py-1 font-mono text-[9px] text-foreground-tertiary backdrop-blur-sm">
                {gifReadyLabel}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border-subtle px-4 py-2 font-mono text-[9px] text-foreground-muted">
            <span>640px · 10 FPS</span>
            <span className="text-accent-emerald">150 frames max</span>
          </div>
        </div>

        {/* EXIF Stripper mini preview */}
        <div className="overflow-hidden rounded-2xl border border-border-default bg-surface-1/80 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.6)] backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-accent-emerald" aria-hidden />
              <span className="text-[11px] font-semibold text-foreground-primary">
                {exifStripperLabel}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-black/40 px-2 py-0.5 font-mono text-[9px] text-accent-emerald">
              <FileImage className="h-2.5 w-2.5" aria-hidden />
              EXIF
            </span>
          </div>
          <div className="relative aspect-[16/7] overflow-hidden bg-viewfinder p-4">
            <div className="flex h-full flex-col justify-center gap-2">
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 font-mono text-[9px] text-amber-300/80 line-through">
                GPS: 40.7128° N, 74.0060° W
              </div>
              <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 px-3 py-1.5 font-mono text-[9px] text-sky-300/80 line-through">
                Camera: Apple iPhone 15 Pro
              </div>
              <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-1.5 font-mono text-[9px] text-violet-300/80 line-through">
                Date: 2026-03-15 14:32:01
              </div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="rounded-full border border-border-default bg-black/30 px-3 py-1 font-mono text-[9px] text-foreground-tertiary backdrop-blur-sm">
                {metadataRemovedLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
