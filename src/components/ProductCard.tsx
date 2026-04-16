import type { Product, CustomizableTable, TableOption } from '../types/catalog'
import { isCustomizableTable } from '../types/catalog'
import { useConfiguratorStore } from '../stores/useConfiguratorStore'
import { Badge } from './Badge'
import { LayeredPreview } from './LayeredPreview'

interface ProductCardProps {
  product: Product | CustomizableTable
  size?: 'large' | 'default'
}

function OptionRow({
  title,
  options,
  selectedId,
  onSelect,
  product,
}: {
  title: 'Top' | 'Legs' | 'Base'
  options: TableOption[]
  selectedId: string | null
  onSelect: (optionId: string) => void
  product: CustomizableTable
}) {
  const isOptionIncompatible = useConfiguratorStore((s) => s.isOptionIncompatible)

  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-mid)]">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = selectedId === option.id
          const isUnavailable = option.available === false
          const isIncompat = isOptionIncompatible(product, title, option.id)
          const isDisabled = isUnavailable || isIncompat

          return (
            <button
              key={option.id}
              type="button"
              disabled={isDisabled}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                isDisabled
                  ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through'
                  : isActive
                    ? 'border-[var(--text-dark)] bg-[var(--text-dark)] text-white'
                    : 'border-[var(--border-card)] bg-white text-[var(--text-mid)] hover:border-[var(--text-dark)]'
              }`}
              onClick={() => onSelect(option.id)}
              title={
                isUnavailable
                  ? 'This option is currently unavailable'
                  : isIncompat
                    ? 'Incompatible with current selection'
                    : option.name
              }
            >
              {option.name}
              {option.priceModifier > 0 ? ` (+₱${option.priceModifier.toLocaleString()})` : ''}
              {isUnavailable && ' ✕'}
              {isIncompat && !isUnavailable && ' ⚠'}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ProductCard({ product, size = 'default' }: ProductCardProps) {
  const activeProductId = useConfiguratorStore(
    (state) => state.activeProductId,
  )
  const selectedTopId = useConfiguratorStore((state) => state.selectedTopId)
  const selectedLegsId = useConfiguratorStore((state) => state.selectedLegsId)
  const selectedBaseId = useConfiguratorStore((state) => state.selectedBaseId)
  const setActiveProduct = useConfiguratorStore(
    (state) => state.setActiveProduct,
  )
  const setSelection = useConfiguratorStore((state) => state.setSelection)

  const imgHeight = size === 'large' ? 'h-72' : 'h-56'

  if (!isCustomizableTable(product)) {
    return (
      <article className="warm-card group" id={`product-${product.id}`}>
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={product.image}
            alt={product.name}
            className={`${imgHeight} w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105`}
          />
          {product.badge && (
            <div className="absolute left-3 top-3">
              <Badge
                label={product.badge}
                tone={product.badgeTone ?? 'teal'}
              />
            </div>
          )}
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-mid)]">
              {product.category}
            </p>
            <h2 className="mt-1 text-[17px] font-semibold leading-snug text-[var(--text-dark)]">
              {product.name}
            </h2>
            {product.description && (
              <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-[var(--text-mid)]">
                {product.description}
              </p>
            )}
            <p className="mt-2 text-[15px] font-semibold text-[var(--text-dark)]">
              ₱{product.basePrice.toLocaleString()}
            </p>
          </div>
          <button type="button" className="text-link shrink-0">
            View Details →
          </button>
        </div>
      </article>
    )
  }

  // Customizable table card
  const isActive = activeProductId === product.id

  const top = product.options.Top.find(
    (option) => option.id === selectedTopId,
  )
  const legs = product.options.Legs.find(
    (option) => option.id === selectedLegsId,
  )
  const base = product.options.Base.find(
    (option) => option.id === selectedBaseId,
  )

  const activeTotal =
    product.basePrice +
    (top?.priceModifier ?? 0) +
    (legs?.priceModifier ?? 0) +
    (base?.priceModifier ?? 0)

  return (
    <article className="warm-card group" id={`product-${product.id}`}>
      <div className="mb-3 flex items-center gap-2">
        <Badge label="CUSTOMIZABLE" tone="teal" />
        {product.badge && product.badge !== 'GATHERABLE' && product.badge !== 'CUSTOMIZABLE' && (
          <Badge label={product.badge} tone={product.badgeTone ?? 'warm'} />
        )}
      </div>

      {/* Show layered preview when configurator is active, otherwise show static image */}
      {isActive ? (
        <LayeredPreview table={product} />
      ) : (
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={product.image}
            alt={product.name}
            className={`${imgHeight} w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105`}
          />
        </div>
      )}

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-mid)]">
            {product.category}
          </p>
          <h2 className="mt-1 text-[18px] font-semibold text-[var(--text-dark)]">
            {product.name}
          </h2>
          {product.description && (
            <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-[var(--text-mid)]">
              {product.description}
            </p>
          )}
          <p className="mt-2 text-[14px] font-semibold text-[var(--text-mid)]">
            Starting at ₱{product.basePrice.toLocaleString()}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveProduct(product)}
          className="primary-btn shrink-0"
        >
          {isActive ? 'Close' : 'Configure'}
        </button>
      </div>

      {isActive && (
        <div className="mt-4 space-y-4 rounded-xl border border-[var(--border-card)] bg-[#fff7ed] p-4">
          <OptionRow
            title="Top"
            options={product.options.Top}
            selectedId={selectedTopId}
            onSelect={(optionId) => setSelection('Top', optionId)}
            product={product}
          />
          <OptionRow
            title="Legs"
            options={product.options.Legs}
            selectedId={selectedLegsId}
            onSelect={(optionId) => setSelection('Legs', optionId)}
            product={product}
          />
          <OptionRow
            title="Base"
            options={product.options.Base}
            selectedId={selectedBaseId}
            onSelect={(optionId) => setSelection('Base', optionId)}
            product={product}
          />

          {/* Price breakdown */}
          <div className="space-y-1 rounded-lg bg-white p-3">
            <div className="flex justify-between text-[12px] text-[var(--text-mid)]">
              <span>Base price</span>
              <span>₱{product.basePrice.toLocaleString()}</span>
            </div>
            {top && top.priceModifier > 0 && (
              <div className="flex justify-between text-[12px] text-[var(--text-mid)]">
                <span>+ {top.name}</span>
                <span>+₱{top.priceModifier.toLocaleString()}</span>
              </div>
            )}
            {legs && legs.priceModifier > 0 && (
              <div className="flex justify-between text-[12px] text-[var(--text-mid)]">
                <span>+ {legs.name}</span>
                <span>+₱{legs.priceModifier.toLocaleString()}</span>
              </div>
            )}
            {base && base.priceModifier > 0 && (
              <div className="flex justify-between text-[12px] text-[var(--text-mid)]">
                <span>+ {base.name}</span>
                <span>+₱{base.priceModifier.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-[var(--border-warm)] pt-1">
              <div className="flex justify-between text-[14px] font-semibold text-[var(--text-dark)]">
                <span>Total</span>
                <span>₱{activeTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
