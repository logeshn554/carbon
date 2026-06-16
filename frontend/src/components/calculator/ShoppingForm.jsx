import Input from '../ui/Input';

export default function ShoppingForm({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const clothingEmission = (data.clothingItemsPerYear || 0) * 33;
  const electronicsEmission = (data.electronicsItemsPerYear || 0) * 300;
  const totalShoppingEmission = clothingEmission + electronicsEmission;

  return (
    <fieldset>
      <legend className="sr-only">Shopping and Consumer Goods Information</legend>
      <div className="space-y-6">
        <p className="text-slate-400 text-sm leading-relaxed">
          Manufacturing and shipping consumer goods accounts for a significant portion of personal carbon footprints.
          This includes production emissions, not just delivery.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Input
              id="clothingItemsPerYear"
              label="New Clothing Items per Year"
              type="number"
              min="0"
              max="500"
              placeholder="0"
              value={data.clothingItemsPerYear || ''}
              onChange={(e) => handleChange('clothingItemsPerYear', parseInt(e.target.value) || 0)}
              hint="Include shoes, accessories, etc. ~33 kg CO₂ per item"
            />
            {data.clothingItemsPerYear > 0 && (
              <p className="mt-1.5 text-xs text-amber-400">
                ≈ {clothingEmission.toLocaleString()} kg CO₂/year from clothing
              </p>
            )}
          </div>

          <div>
            <Input
              id="electronicsItemsPerYear"
              label="New Electronic Devices per Year"
              type="number"
              min="0"
              max="50"
              placeholder="0"
              value={data.electronicsItemsPerYear || ''}
              onChange={(e) => handleChange('electronicsItemsPerYear', parseInt(e.target.value) || 0)}
              hint="Smartphones, laptops, tablets, etc. ~300 kg CO₂ per device"
            />
            {data.electronicsItemsPerYear > 0 && (
              <p className="mt-1.5 text-xs text-amber-400">
                ≈ {electronicsEmission.toLocaleString()} kg CO₂/year from electronics
              </p>
            )}
          </div>
        </div>

        {/* Shopping tips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: '♻️', title: 'Second-Hand', desc: 'Buying second-hand reduces emissions by 60-80%' },
            { icon: '🔧', title: 'Repair First', desc: 'Extending device life by 1 year saves ~150 kg CO₂' },
            { icon: '🛍️', title: 'Buy Less', desc: 'The most sustainable product is one not made' },
          ].map((tip) => (
            <div key={tip.title} className="rounded-xl p-3 border border-white/5 bg-white/2">
              <span className="text-xl block mb-2" aria-hidden="true">{tip.icon}</span>
              <p className="text-sm font-semibold text-slate-300">{tip.title}</p>
              <p className="text-xs text-slate-500 mt-1">{tip.desc}</p>
            </div>
          ))}
        </div>

        {totalShoppingEmission > 0 && (
          <div className="rounded-xl p-4 border border-amber-500/20 bg-amber-500/5 animate-fade-in">
            <p className="text-sm text-amber-400 font-medium flex items-center gap-2">
              <span aria-hidden="true">🛒</span>
              Total shopping emissions: ~{totalShoppingEmission.toLocaleString()} kg CO₂/year
            </p>
          </div>
        )}
      </div>
    </fieldset>
  );
}
