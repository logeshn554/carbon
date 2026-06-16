import { formatNumber } from '../../utils/formatters';

export default function ComparisonBar({ original, projected, label = '' }) {
  const max = Math.max(original, projected, 1);
  const originalPct = (original / max) * 100;
  const projectedPct = (projected / max) * 100;
  const isReduction = projected < original;

  return (
    <div className="space-y-3" role="img" aria-label={`${label}: Current ${formatNumber(original)}kg vs Projected ${formatNumber(projected)}kg`}>
      {label && <p className="text-sm text-slate-400 font-medium">{label}</p>}

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 w-20 text-right flex-shrink-0">Current</span>
          <div className="flex-1 h-4 rounded-full overflow-hidden bg-white/5">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${originalPct}%`,
                background: 'linear-gradient(90deg, #64748b, #94a3b8)',
              }}
              aria-hidden="true"
            />
          </div>
          <span className="text-xs text-slate-400 w-20 flex-shrink-0 font-mono">
            {formatNumber(original)} kg
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 w-20 text-right flex-shrink-0">Projected</span>
          <div className="flex-1 h-4 rounded-full overflow-hidden bg-white/5">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${projectedPct}%`,
                background: isReduction
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : 'linear-gradient(90deg, #ef4444, #f87171)',
              }}
              aria-hidden="true"
            />
          </div>
          <span className={`text-xs w-20 flex-shrink-0 font-mono font-semibold ${isReduction ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatNumber(projected)} kg
          </span>
        </div>
      </div>

      {/* Savings badge */}
      <div className="flex justify-end">
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
          isReduction ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
        }`}>
          {isReduction ? '−' : '+'}{formatNumber(Math.abs(original - projected))} kg
        </span>
      </div>
    </div>
  );
}
