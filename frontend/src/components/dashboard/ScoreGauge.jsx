import { getScoreInfo } from '../../utils/formatters';

export default function ScoreGauge({ score }) {
  const info = getScoreInfo(score);

  // Calculate the arc position for SVG gauge
  const radius = 80;
  const circumference = Math.PI * radius; // Half circle
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  return (
    <div className="glass-card p-6 flex flex-col items-center animate-slide-up">
      <p className="text-slate-400 text-sm uppercase tracking-wider mb-4">Sustainability Score</p>

      {/* SVG Gauge */}
      <div className="relative" style={{ width: 200, height: 110 }}>
        <svg width="200" height="110" viewBox="0 0 200 110" aria-label={`Sustainability score: ${score} out of 100`} role="img">
          {/* Background arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Colored arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke={info.color}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={`${circumference - progress}`}
            style={{
              transition: 'stroke-dashoffset 1.5s ease-out',
              filter: `drop-shadow(0 0 8px ${info.color}60)`,
            }}
          />
          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((pct) => {
            const angle = (pct / 100) * Math.PI;
            const x1 = 100 - Math.cos(angle) * 76;
            const y1 = 100 - Math.sin(angle) * 76;
            const x2 = 100 - Math.cos(angle) * 88;
            const y2 = 100 - Math.sin(angle) * 88;
            return (
              <line
                key={pct}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
                aria-hidden="true"
              />
            );
          })}
        </svg>

        {/* Score number overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className="text-4xl font-display font-bold" style={{ color: info.color }}>
            {score}
          </span>
          <span className="text-xs text-slate-500 mt-0.5">/ 100</span>
        </div>
      </div>

      {/* Label */}
      <div className={`mt-3 px-4 py-1.5 rounded-full text-sm font-semibold ${info.bgClass} ${info.textClass} border ${info.borderClass}`}>
        {info.label}
      </div>

      {/* Score ranges legend */}
      <div className="mt-4 w-full grid grid-cols-4 gap-1 text-center">
        {[
          { range: '90-100', label: 'Excellent', color: '#10b981' },
          { range: '70-89', label: 'Good', color: '#06b6d4' },
          { range: '50-69', label: 'Moderate', color: '#f59e0b' },
          { range: '<50', label: 'Improve', color: '#ef4444' },
        ].map((tier) => (
          <div key={tier.label} className="text-center">
            <div className="h-1 rounded-full mb-1" style={{ background: tier.color }} aria-hidden="true" />
            <p className="text-[10px] text-slate-600">{tier.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
