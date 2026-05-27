import type { CatalogueTag } from "../types/catalog";

interface FilterBarProps {
  tags: CatalogueTag[];
  selectedTagIds: string[];
  onToggleTag: (tagId: string) => void;
  onClearTags: () => void;
}

export function FilterBar({ tags, selectedTagIds, onToggleTag, onClearTags }: FilterBarProps) {
  if (tags.length === 0) return null;

  const selectedTagIdSet = new Set(selectedTagIds);

  return (
    <div className="flex max-w-full flex-wrap gap-2">
      {/* "All" button */}
      <button
        type="button"
        onClick={onClearTags}
        className={`pill-filter ${selectedTagIds.length === 0 ? "pill-filter-active" : ""}`}
      >
        All
      </button>
      {tags.map((tag) => {
        const isActive = selectedTagIdSet.has(tag.id);

        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => onToggleTag(tag.id)}
            className={`pill-filter max-w-full break-words text-left leading-tight ${
              isActive ? "pill-filter-active" : ""
            }`}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}
