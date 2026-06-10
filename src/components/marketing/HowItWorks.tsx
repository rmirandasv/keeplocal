interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

interface HowItWorksProps {
  title: string;
  steps: HowItWorksStep[];
}

const stepTints = [
  "from-brand/10 to-transparent",
  "from-accent-emerald/8 to-transparent",
  "from-accent-sky/8 to-transparent",
];

export default function HowItWorks({ title, steps }: HowItWorksProps) {
  return (
    <section className="w-full">
      <h2 className="mb-10 text-center text-2xl font-semibold tracking-[-0.02em] text-foreground-primary">
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="group relative overflow-hidden rounded-2xl bento-card p-6 md:p-7"
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${stepTints[index]} opacity-60`}
              aria-hidden
            />

            <span className="relative mb-4 inline-block font-mono text-xl font-medium text-brand/70">
              {step.number}
            </span>
            <h3 className="relative mb-2 text-[15px] font-semibold text-foreground-primary">
              {step.title}
            </h3>
            <p className="relative text-sm leading-relaxed text-foreground-secondary">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
