interface BadgeProps {
  label: string;
  tone?: "teal" | "warm" | "dark";
}

const toneClasses: Record<string, string> = {
  teal: "bg-[var(--tertiary)] text-white",
  warm: "bg-[var(--primary)] text-white",
  dark: "bg-[var(--text-dark)] text-white",
};

export function Badge({ label, tone = "teal" }: BadgeProps) {
  return (
    <span className={`pill-label ${toneClasses[tone] ?? toneClasses.teal}`}>
      {label}
    </span>
  );
}
