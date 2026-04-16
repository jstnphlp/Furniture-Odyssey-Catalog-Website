import { describe, it, expect, beforeEach } from 'vitest'
import { useCatalogStore } from './useCatalogStore'

describe('useCatalogStore', () => {
  beforeEach(() => {
    // Reset products to a known state before each test
    // Assuming catalogData gives an initial populated array
    const originalProducts = useCatalogStore.getState().products
    useCatalogStore.setState({
      products: JSON.parse(JSON.stringify(originalProducts))
    })
  })

  it('updateProduct modifies a product', () => {
    const store = useCatalogStore.getState()
    const firstProduct = store.products[0]
    
    expect(firstProduct).toBeDefined()
    
    store.updateProduct(firstProduct.id, { 
      name: 'Updated Name', 
      basePrice: 9999 
    })
    
    const updatedProduct = useCatalogStore.getState().products.find(p => p.id === firstProduct.id)
    
    expect(updatedProduct?.name).toBe('Updated Name')
    expect(updatedProduct?.basePrice).toBe(9999)
  })

  it('updateTableOption modifies an option inside a customizable table', () => {
    const store = useCatalogStore.getState()
    // Find a customizable table
    const table = store.products.find(p => p.isCustomizable) as any
    if (!table) return
    
    const firstTopOption = table.options.Top[0]
    
    store.updateTableOption(table.id, 'Top', firstTopOption.id, {
      name: 'Supabase Wood',
      priceModifier: 150
    })
    
    const updatedTable = useCatalogStore.getState().products.find(p => p.id === table.id) as any
    const updatedOption = updatedTable.options.Top.find((opt: any) => opt.id === firstTopOption.id)
    
    expect(updatedOption.name).toBe('Supabase Wood')
    expect(updatedOption.priceModifier).toBe(150)
  })

  it('toggleOptionAvailability toggles the available state', () => {
    const store = useCatalogStore.getState()
    const table = store.products.find(p => p.isCustomizable) as any
    if (!table) return
    
    const firstLegOption = table.options.Legs[0]
    const initialStatus = firstLegOption.available ?? true
    
    store.toggleOptionAvailability(table.id, 'Legs', firstLegOption.id)
    
    const updatedTable = useCatalogStore.getState().products.find(p => p.id === table.id) as any
    const updatedOption = updatedTable.options.Legs.find((opt: any) => opt.id === firstLegOption.id)
    
    expect(updatedOption.available).toBe(!initialStatus)
  })
})
