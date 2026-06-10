import KeeplocalLogo from "./KeeplocalLogo";

interface LogoBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

const sizes = {
  sm: { box: "h-6 w-6 rounded-md", logo: 16 },
  md: { box: "h-7 w-7 rounded-lg", logo: 18 },
} as const;

export default function LogoBadge({ size = "md", className = "" }: LogoBadgeProps) {
  const { box, logo } = sizes[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center border border-border-default bg-foreground-primary/[0.04] ${box} ${className}`}
    >
      <KeeplocalLogo size={logo} className="text-foreground-primary" />
    </div>
  );
}
