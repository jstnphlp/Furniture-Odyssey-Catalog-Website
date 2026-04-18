import type { Product, CustomizableTable } from '../types/catalog'
import { Badge } from './Badge'

interface MiniCardProps {
  product: Product | CustomizableTable
  badge?: string
  badgeTone?: 'teal' | 'warm' | 'dark'
  cta?: string
  showPrice?: boolean
  onOpenModal?: (product: Product | CustomizableTable) => void
}

export function MiniCard({
  product,
  badge,
  badgeTone = 'teal',
  cta = 'Quick Shop',
  showPrice = true,
  onOpenModal,
}: MiniCardProps) {
  const displayBadge = badge ?? product.badge
  const displayTone = badge ? badgeTone : product.badgeTone ?? badgeTone

  const handleClick = () => {
    if (onOpenModal) onOpenModal(product)
  }

  return (
    <article
      className={`warm-card group ${onOpenModal ? 'cursor-pointer' : ''}`}
      id={`card-${product.id}`}
      onClick={handleClick}
    >
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={product.image}
          alt={product.name}
          className="h-52 w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {displayBadge && (
          <div className="absolute left-3 top-3">
            <Badge label={displayBadge} tone={displayTone} />
          </div>
        )}
        {/* Customizable indicator */}
        {product.isCustomizable && (
          <div className="absolute right-3 top-3">
            <Badge label="CUSTOMIZABLE" tone="teal" />
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[16px] font-semibold leading-snug text-[var(--text-dark)]">
            {product.name}
          </h3>
          {showPrice && (
            <p className="whitespace-nowrap text-[14px] font-semibold text-[var(--text-dark)]">
              {product.isCustomizable ? 'From ' : ''}₱{product.basePrice.toLocaleString()}
            </p>
          )}
        </div>
        <button
          type="button"
          className="text-link mt-1"
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
        >
          {product.isCustomizable ? 'Configure →' : `${cta} →`}
        </button>
      </div>
    </article>
  )
}
