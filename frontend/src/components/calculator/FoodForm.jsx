const dietOptions = [
  {
    value: 'vegan',
    label: 'Vegan',
    description: 'Entirely plant-based diet',
    emission: '1,500 kg/year',
    icon: '🌱',
    color: 'emerald',
  },
  {
    value: 'vegetarian',
    label: 'Vegetarian',
    description: 'Plant-based with dairy & eggs',
    emission: '1,700 kg/year',
    icon: '🥦',
    color: 'green',
  },
  {
    value: 'mixed',
    label: 'Mixed Diet',
    description: 'Occasional meat & fish',
    emission: '2,500 kg/year',
    icon: '🍽️',
    color: 'amber',
  },
  {
    value: 'heavy_meat',
    label: 'Heavy Meat',
    description: 'Meat at most meals',
    emission: '3,300 kg/year',
    icon: '🥩',
    color: 'rose',
  },
];

const colorMap = {
  emerald: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
  green: 'border-green-500/50 bg-green-500/10 text-green-400',
  amber: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
  rose: 'border-rose-500/50 bg-rose-500/10 text-rose-400',
  inactive: 'border-white/8 bg-white/3 text-slate-400',
};

export default function FoodForm({ data, onChange }) {
  const handleDietChange = (value) => {
    onChange({ ...data, dietType: value });
  };

  return (
    <fieldset>
      <legend className="sr-only">Food and Diet Information</legend>
      <div className="space-y-6">
        <div>
          <p className="text-slate-400 text-sm mb-5 leading-relaxed">
            Food production accounts for around 25% of global greenhouse gas emissions.
            Your diet choice significantly impacts your personal carbon footprint.
          </p>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            role="radiogroup"
            aria-label="Select your diet type"
          >
            {dietOptions.map((option) => {
              const isSelected = data.dietType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleDietChange(option.value)}
                  className={`
                    text-left p-4 rounded-xl border transition-all duration-200
                    ${isSelected ? colorMap[option.color] : colorMap.inactive}
                    ${isSelected ? 'scale-[1.02] shadow-lg' : 'hover:border-white/15 hover:bg-white/5'}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0" aria-hidden="true">{option.icon}</span>
                    <div>
                      <p className={`font-semibold ${isSelected ? '' : 'text-slate-200'}`}>
                        {option.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{option.description}</p>
                      <p className={`text-xs font-mono mt-2 ${isSelected ? 'opacity-100' : 'text-slate-600'}`}>
                        ~{option.emission} CO₂
                      </p>
                    </div>
                    {isSelected && (
                      <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                        <span className="text-white text-xs" aria-hidden="true">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Diet comparison chart */}
        <div className="rounded-xl p-4 border border-white/5 bg-white/2">
          <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-medium">Annual CO₂ Comparison</p>
          {dietOptions.map((option) => {
            const emission = parseInt(option.emission.replace(/[^0-9]/g, ''));
            const maxEmission = 3300;
            const percentage = (emission / maxEmission) * 100;
            const isSelected = data.dietType === option.value;
            return (
              <div key={option.value} className="flex items-center gap-3 mb-2">
                <span className="text-sm w-24 text-slate-500 text-right flex-shrink-0">{option.label}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden bg-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isSelected ? 'opacity-100' : 'opacity-30'}`}
                    style={{
                      width: `${percentage}%`,
                      background: option.color === 'emerald' ? '#10b981' :
                        option.color === 'green' ? '#22c55e' :
                        option.color === 'amber' ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
                <span className="text-xs text-slate-600 w-20 flex-shrink-0">{option.emission}</span>
              </div>
            );
          })}
        </div>
      </div>
    </fieldset>
  );
}
