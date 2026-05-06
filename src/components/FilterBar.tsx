interface FilterBarProps {
  labels: string[];
  activeLabel: string | null;
  onFilterChange: (label: string | null) => void;
}

export function FilterBar({ labels, activeLabel, onFilterChange }: FilterBarProps) {
  if (labels.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {/* "All" button */}
      <button
        type="button"
        onClick={() => onFilterChange(null)}
        className={`pill-filter ${activeLabel === null ? "pill-filter-active" : ""}`}
      >
        All
      </button>
      {labels.map((label) => (
        <button
          key={label}
          type="button"
          onClick={() => onFilterChange(label)}
          className={`pill-filter ${label === activeLabel ? "pill-filter-active" : ""}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
