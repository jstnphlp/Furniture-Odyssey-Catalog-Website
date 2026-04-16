import { describe, it, expect } from 'vitest'
import { isCustomizableTable, Product, CustomizableTable } from './catalog'

describe('catalog > isCustomizableTable', () => {
  it('returns true for a customizable table', () => {
    const customizableTable: CustomizableTable = {
      id: 'table-001',
      name: 'Custom Table',
      category: 'Tables',
      basePrice: 1000,
      image: '/image.png',
      isCustomizable: true,
      options: {
        Top: [],
        Legs: [],
        Base: []
      }
    }

    expect(isCustomizableTable(customizableTable)).toBe(true)
  })

  it('returns false for a non-customizable product', () => {
    const regularChair: Product = {
      id: 'chair-001',
      name: 'Regular Chair',
      category: 'Chairs',
      basePrice: 100,
      image: '/image.png',
      isCustomizable: false
    }

    expect(isCustomizableTable(regularChair)).toBe(false)
  })
})
