import Input from '../ui/Input';
import Icon from '../ui/Icons';

const energyFacts = [
  { icon: 'plug', label: 'Grid Average', value: '0.233 kg CO₂/kWh', color: '#F59E0B' },
  { icon: 'sun', label: 'Solar', value: '~0.04 kg CO₂/kWh', color: '#FDE047' },
  { icon: 'wind', label: 'Wind Power', value: '~0.01 kg CO₂/kWh', color: '#7aadfa' },
];

export default function EnergyForm({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const nonRenewableEmission = data.monthlyElectricityKwh
    ? Math.round(data.monthlyElectricityKwh * 12 * 0.233 * (1 - (data.renewablePercentage || 0) / 100))
    : 0;

  return (
    <fieldset>
      <legend className="sr-only">Home Energy Information</legend>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            id="monthlyElectricityKwh"
            label="Monthly Electricity Usage (kWh)"
            type="number"
            min="0"
            max="10000"
            placeholder="200"
            value={data.monthlyElectricityKwh || ''}
            onChange={(e) => handleChange('monthlyElectricityKwh', parseFloat(e.target.value) || 0)}
            hint="Check your electricity bill for kWh usage. UK avg: ~280 kWh/month"
          />
          <div>
            <label htmlFor="renewablePercentage" className="form-label">
              Renewable Energy <span style={{ color: '#00C27B' }}>(%)</span>
            </label>
            <input
              id="renewablePercentage"
              type="range"
              min="0"
              max="100"
              step="5"
              value={data.renewablePercentage || 0}
              onChange={(e) => handleChange('renewablePercentage', parseInt(e.target.value))}
              className="w-full mt-2"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={data.renewablePercentage || 0}
              aria-label="Renewable energy percentage"
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--color-text-faint)' }}>
              <span>0% (Grid)</span>
              <span className="font-semibold" style={{ color: '#00C27B' }}>
                {data.renewablePercentage || 0}%
              </span>
              <span>100% (Renewable)</span>
            </div>
          </div>
        </div>

        {/* Energy facts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {energyFacts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-xl p-3 text-center"
              style={{
                border: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(255,255,255,0.025)',
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                style={{ background: `${fact.color}15` }}
              >
                <Icon name={fact.icon} size={15} style={{ color: fact.color }} className="text-current" />
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-faint)' }}>{fact.label}</p>
              <p className="text-xs font-semibold mt-0.5" style={{ color: fact.color }}>{fact.value}</p>
            </div>
          ))}
        </div>

        {/* Live estimate */}
        {data.monthlyElectricityKwh > 0 && (
          <div
            className="rounded-xl p-4 flex items-start gap-3 animate-fade-in"
            style={{ border: '1px solid rgba(79,142,247,0.18)', background: 'rgba(79,142,247,0.05)' }}
          >
            <Icon name="info" size={15} style={{ color: '#4F8EF7' }} className="flex-shrink-0 mt-0.5 text-current" />
            <p className="text-sm font-medium" style={{ color: '#7aadfa' }}>
              Your energy emissions: ~{nonRenewableEmission.toLocaleString()} kg CO₂/year
              {data.renewablePercentage > 0 && (
                <span style={{ color: '#00C27B' }}>
                  {' '}({data.renewablePercentage}% renewable saves{' '}
                  {Math.round(data.monthlyElectricityKwh * 12 * 0.233 * (data.renewablePercentage / 100)).toLocaleString()} kg)
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </fieldset>
  );
}
