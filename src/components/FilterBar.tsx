import { useState } from "react";

interface FilterBarProps {
  labels: string[];
  defaultActive?: number;
}

export function FilterBar({ labels, defaultActive = 0 }: FilterBarProps) {
  const [active, setActive] = useState(defaultActive);

  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((label, index) => (
        <button
          key={label}
          type="button"
          onClick={() => setActive(index)}
          className={`pill-filter ${index === active ? "pill-filter-active" : ""}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
