interface KeeplocalLogoProps {
  size?: number;
  className?: string;
}

/**
 * Keeplocal mark — studio module frame, local signal rings,
 * and an inward loop suggesting data never leaves the device.
 */
export default function KeeplocalLogo({ size = 28, className }: KeeplocalLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect
        x="2.5"
        y="2.5"
        width="27"
        height="27"
        rx="6.5"
        className="stroke-foreground-primary/20"
        strokeWidth="1"
      />
      <circle cx="16" cy="15" r="9.5" className="stroke-brand/25" strokeWidth="0.75" />
      <circle cx="16" cy="15" r="6" className="stroke-brand/50" strokeWidth="1" />
      <circle cx="16" cy="15" r="2.25" className="fill-brand" />
      <path
        d="M21.5 19.5C20.5 22 18.5 23.5 16 23.5C12 23.5 9.5 21 9.5 17"
        className="stroke-brand/70"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M9.5 17V19.5H7.25"
        className="stroke-brand/70"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
