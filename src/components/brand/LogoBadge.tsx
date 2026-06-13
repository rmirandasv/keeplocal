import KeeplocalLogo from "./KeeplocalLogo";

interface LogoBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { box: "h-9 w-9 rounded-lg", logo: 22, padding: "p-1" },
  md: { box: "h-10 w-10 rounded-lg", logo: 26, padding: "p-1" },
  lg: { box: "h-11 w-11 rounded-xl", logo: 28, padding: "p-1.5" },
} as const;

export default function LogoBadge({ size = "md", className = "" }: LogoBadgeProps) {
  const { box, logo, padding } = sizes[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center border border-brand/25 bg-brand/[0.08] shadow-[0_0_12px_hsl(var(--brand)/0.12)] ${box} ${padding} ${className}`}
    >
      <KeeplocalLogo size={logo} />
    </div>
  );
}
