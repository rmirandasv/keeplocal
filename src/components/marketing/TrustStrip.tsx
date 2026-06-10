interface TrustStripProps {
  items: string[];
}

export default function TrustStrip({ items }: TrustStripProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
      {items.map((item, index) => (
        <span key={item} className="flex items-center gap-6">
          <span className="font-mono text-[11px] tracking-wide text-foreground-muted transition-colors hover:text-foreground-tertiary">
            {item}
          </span>
          {index < items.length - 1 && (
            <span
              className="hidden h-1 w-1 rounded-full bg-foreground-muted/40 sm:block"
              aria-hidden
            />
          )}
        </span>
      ))}
    </div>
  );
}
