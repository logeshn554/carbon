import { formatEmissionTonnes, formatNumber } from '../../utils/formatters';
import { GLOBAL_AVERAGE_EMISSION, TARGET_EMISSION } from '../../utils/constants';

export default function FootprintCard({ assessment }) {
  const { totalEmission, transportEmission, energyEmission, foodEmission, shoppingEmission } = assessment;
  const vsGlobal = ((totalEmission - GLOBAL_AVERAGE_EMISSION) / GLOBAL_AVERAGE_EMISSION * 100).toFixed(0);
  const vsTarget = ((totalEmission - TARGET_EMISSION) / TARGET_EMISSION * 100).toFixed(0);

  const categories = [
    { label: 'Transport', value: transportEmission, color: '#34d399', icon: '🚗' },
    { label: 'Energy', value: energyEmission, color: '#60a5fa', icon: '⚡' },
    { label: 'Food', value: foodEmission, color: '#f472b6', icon: '🍽️' },
    { label: 'Shopping', value: shoppingEmission, color: '#fb923c', icon: '🛍️' },
  ];

  return (
    <div className="glass-card p-6 animate-slide-up">
      {/* Main stat */}
      <div className="text-center mb-6">
        <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Annual Carbon Footprint</p>
        <p className="text-5xl font-display font-bold gradient-text mb-1">
          {(totalEmission / 1000).toFixed(2)}
        </p>
        <p className="text-slate-400 text-lg">tonnes CO₂e / year</p>

        {/* vs benchmarks */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <p className={`text-sm font-semibold ${vsGlobal < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {vsGlobal < 0 ? '▼' : '▲'} {Math.abs(vsGlobal)}%
            </p>
            <p className="text-xs text-slate-600">vs global avg</p>
          </div>
          <div className="w-px bg-white/10" aria-hidden="true" />
          <div className="text-center">
            <p className={`text-sm font-semibold ${vsTarget < 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {vsTarget < 0 ? '▼' : '▲'} {Math.abs(vsTarget)}%
            </p>
            <p className="text-xs text-slate-600">vs Paris target</p>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="section-divider" />
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => {
          const pct = ((cat.value / totalEmission) * 100).toFixed(0);
          return (
            <div key={cat.label} className="rounded-xl p-3 bg-white/3 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5">
                  <span className="text-sm" aria-hidden="true">{cat.icon}</span>
                  <span className="text-xs text-slate-400">{cat.label}</span>
                </span>
                <span className="text-xs text-slate-500">{pct}%</span>
              </div>
              <p className="text-sm font-semibold text-slate-200">{formatNumber(cat.value)} kg</p>
              <div className="mt-2 h-1 rounded-full bg-white/5">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: cat.color }}
                  role="img"
                  aria-label={`${cat.label}: ${pct}%`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
