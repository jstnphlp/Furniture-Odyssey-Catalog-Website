import { useConfiguratorStore } from './store/useConfiguratorStore';
import { usePriceCalculator } from './hooks/usePriceCalculator';
import { getImageForCombination } from './utils/imageSwapper';

const MOCK_TOPS = [
  { id: 'top-glass', name: 'Glass Top', priceModifier: 150 },
  { id: 'top-wood', name: 'Wood Top', priceModifier: 100 },
];

const MOCK_LEGS = [
  { id: 'leg-metal', name: 'Metal Legs', priceModifier: 80 },
  { id: 'leg-wood', name: 'Wood Legs', priceModifier: 50 },
];

const MOCK_BASES = [
  { id: 'base-wood', name: 'Wooden Base', priceModifier: 60 },
  { id: 'base-metal', name: 'Metal Base', priceModifier: 90 },
];

function App() {
  const { selectedTop, selectedLegs, selectedBase, setSelectedTop, setSelectedLegs, setSelectedBase } = useConfiguratorStore();
  const totalPrice = usePriceCalculator();
  
  const combinationDetails = getImageForCombination(selectedTop?.id, selectedLegs?.id, selectedBase?.id);

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans text-gray-900 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Table Configurator Data Flow Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Selections</h2>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">Tops</h3>
            <div className="flex gap-2">
              {MOCK_TOPS.map(top => (
                <button 
                  key={top.id}
                  onClick={() => setSelectedTop(top)}
                  className={`px-4 py-2 border rounded ${selectedTop?.id === top.id ? 'bg-blue-500 text-white' : 'bg-gray-100 object-none text-black border-black'}`}
                >
                  {top.name} (+${top.priceModifier})
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Legs</h3>
            <div className="flex gap-2">
              {MOCK_LEGS.map(leg => (
                <button 
                  key={leg.id}
                  onClick={() => setSelectedLegs(leg)}
                  className={`px-4 py-2 border rounded ${selectedLegs?.id === leg.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black border-black border-2'}`}
                >
                  {leg.name} (+${leg.priceModifier})
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Bases</h3>
            <div className="flex gap-2">
              {MOCK_BASES.map(base => (
                <button 
                  key={base.id}
                  onClick={() => setSelectedBase(base)}
                  className={`px-4 py-2 border rounded ${selectedBase?.id === base.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black border-black border-2'}`}
                >
                  {base.name} (+${base.priceModifier})
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg text-black">
          <h2 className="text-xl font-semibold mb-4">Live Result</h2>
          
          <div className="mb-4">
            <img 
              src={combinationDetails.imageUrl} 
              alt="Table combination preview" 
              className="w-full h-auto rounded shadow-sm mb-4 max-h-64 object-cover"
            />
            {combinationDetails.isAvailable ? (
              <p className="text-green-600 font-medium tracking-wide">Available</p>
            ) : (
              <p className="text-red-500 font-medium tracking-wide">Not Available</p>
            )}
            <p className="text-gray-700 mt-2">{combinationDetails.summaryText}</p>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-2xl font-bold">Total Price: ${totalPrice}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
