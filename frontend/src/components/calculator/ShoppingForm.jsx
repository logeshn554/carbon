import Input from '../ui/Input';
import Icon from '../ui/Icons';

const tips = [
  { icon: 'recycle', title: 'Second-Hand', desc: 'Buying second-hand reduces emissions by 60–80%' },
  { icon: 'wrench', title: 'Repair First', desc: 'Extending device life by 1 year saves ~150 kg CO₂' },
  { icon: 'minus_circle', title: 'Buy Less', desc: 'The most sustainable product is one not made' },
];

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
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
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
              <p className="mt-1.5 text-xs" style={{ color: '#fbbf24' }}>
                &asymp; {clothingEmission.toLocaleString()} kg CO₂/year from clothing
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
              <p className="mt-1.5 text-xs" style={{ color: '#fbbf24' }}>
                &asymp; {electronicsEmission.toLocaleString()} kg CO₂/year from electronics
              </p>
            )}
          </div>
        </div>

        {/* Shopping tips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tips.map((tip) => (
            <div
              key={tip.title}
              className="rounded-xl p-4"
              style={{
                border: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.025)',
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ background: 'rgba(0,194,123,0.1)', color: '#00C27B' }}
              >
                <Icon name={tip.icon} size={15} className="text-current" />
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                {tip.title}
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {tip.desc}
              </p>
            </div>
          ))}
        </div>

        {totalShoppingEmission > 0 && (
          <div
            className="rounded-xl p-4 flex items-start gap-3 animate-fade-in"
            style={{ border: '1px solid rgba(245,158,11,0.18)', background: 'rgba(245,158,11,0.05)' }}
          >
            <Icon name="shopping" size={15} style={{ color: '#fbbf24' }} className="flex-shrink-0 mt-0.5 text-current" />
            <p className="text-sm font-medium" style={{ color: '#fbbf24' }}>
              Total shopping emissions: ~{totalShoppingEmission.toLocaleString()} kg CO₂/year
            </p>
          </div>
        )}
      </div>
    </fieldset>
  );
}
