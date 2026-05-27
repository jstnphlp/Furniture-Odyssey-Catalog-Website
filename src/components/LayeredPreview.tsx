import type { CustomizableTable } from '../types/catalog'
import { useConfiguratorStore } from '../stores/useConfiguratorStore'

interface LayeredPreviewProps {
  table: CustomizableTable
}

export function LayeredPreview({ table }: LayeredPreviewProps) {
  const selectedTopId = useConfiguratorStore((state) => state.selectedTopId)
  const selectedLegsId = useConfiguratorStore((state) => state.selectedLegsId)
  const selectedBaseId = useConfiguratorStore((state) => state.selectedBaseId)

  const selectedTop =
    table.options.Top.find((option) => option.id === selectedTopId) ??
    table.options.Top[0]
  const selectedLegs =
    table.options.Legs.find((option) => option.id === selectedLegsId) ??
    table.options.Legs[0]
  const selectedBase =
    table.options.Base.find((option) => option.id === selectedBaseId) ??
    table.options.Base[0]

  const fadeKey = [selectedTop?.id, selectedLegs?.id, selectedBase?.id].join('-')

  return (
    <div className="relative h-72 overflow-hidden rounded-xl border border-[#e4d5c8] bg-[#f7efe6]">
      {/* Contact shadow layer */}
      <img
        src="/layers/table/shadow.png"
        alt="Contact shadow"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        style={{ zIndex: 0 }}
      />
      {/* Frame / fallback */}
      <img
        src={table.image}
        alt={`${table.name} frame`}
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        style={{ zIndex: 1 }}
      />
      {/* Base layer */}
      <img
        key={`base-${fadeKey}`}
        src={selectedBase.layerUrl}
        alt={selectedBase.name}
        className="absolute inset-0 h-full w-full object-cover animate-fade-in-up"
        style={{ zIndex: 2, animationDuration: '0.35s' }}
      />
      {/* Legs layer */}
      <img
        key={`legs-${fadeKey}`}
        src={selectedLegs.layerUrl}
        alt={selectedLegs.name}
        className="absolute inset-0 h-full w-full object-cover animate-fade-in-up"
        style={{ zIndex: 3, animationDuration: '0.35s' }}
      />
      {/* Top layer */}
      <img
        key={`top-${fadeKey}`}
        src={selectedTop.layerUrl}
        alt={selectedTop.name}
        className="absolute inset-0 h-full w-full object-cover animate-fade-in-up"
        style={{ zIndex: 4, animationDuration: '0.35s' }}
      />
      {/* Gradient overlay for depth */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#2c22181a] to-transparent"
        style={{ zIndex: 5 }}
      />
      {/* Component label */}
      <div
        className="absolute left-3 bottom-3 rounded-lg bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-[var(--text-dark)] shadow-sm backdrop-blur-sm"
        style={{ zIndex: 6 }}
      >
        {selectedTop.name} · {selectedLegs.name} · {selectedBase.name}
      </div>
    </div>
  )
}
