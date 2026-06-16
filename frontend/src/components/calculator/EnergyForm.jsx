import Input from '../ui/Input';

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
              Renewable Energy <span className="text-emerald-400">(%)</span>
            </label>
            <input
              id="renewablePercentage"
              type="range"
              min="0"
              max="100"
              step="5"
              value={data.renewablePercentage || 0}
              onChange={(e) => handleChange('renewablePercentage', parseInt(e.target.value))}
              className="w-full mt-2 accent-emerald-500"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={data.renewablePercentage || 0}
              aria-label="Renewable energy percentage"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0% (Grid)</span>
              <span className="text-emerald-400 font-semibold">{data.renewablePercentage || 0}%</span>
              <span>100% (Renewable)</span>
            </div>
          </div>
        </div>

        {/* Energy facts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: '🔌', label: 'Grid Average', value: '0.233 kg CO₂/kWh', color: 'text-amber-400' },
            { icon: '☀️', label: 'Solar', value: '~0.04 kg CO₂/kWh', color: 'text-yellow-400' },
            { icon: '🌬️', label: 'Wind Power', value: '~0.01 kg CO₂/kWh', color: 'text-cyan-400' },
          ].map((fact) => (
            <div key={fact.label} className="rounded-xl p-3 border border-white/5 bg-white/3 text-center">
              <span aria-hidden="true" className="text-lg block mb-1">{fact.icon}</span>
              <p className="text-xs text-slate-500">{fact.label}</p>
              <p className={`text-xs font-semibold ${fact.color}`}>{fact.value}</p>
            </div>
          ))}
        </div>

        {/* Live estimate */}
        {data.monthlyElectricityKwh > 0 && (
          <div className="rounded-xl p-4 border border-blue-500/20 bg-blue-500/5 animate-fade-in">
            <p className="text-sm text-blue-400 font-medium flex items-center gap-2">
              <span aria-hidden="true">💡</span>
              Your energy emissions: ~{nonRenewableEmission.toLocaleString()} kg CO₂/year
              {data.renewablePercentage > 0 && (
                <span className="text-emerald-400">
                  ({data.renewablePercentage}% renewable saves {Math.round(data.monthlyElectricityKwh * 12 * 0.233 * (data.renewablePercentage / 100)).toLocaleString()} kg)
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </fieldset>
  );
}
