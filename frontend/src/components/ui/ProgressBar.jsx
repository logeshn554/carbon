export default function ProgressBar({ value = 0, max = 100, label, showLabel = true, color = 'eco', className = '' }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = {
    eco: 'linear-gradient(90deg, #10b981, #06b6d4)',
    amber: 'linear-gradient(90deg, #f59e0b, #ef4444)',
    cyan: 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
    rose: 'linear-gradient(90deg, #ef4444, #f97316)',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showLabel) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-sm text-slate-400">{label}</span>}
          {showLabel && (
            <span className="text-sm font-medium text-slate-300">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="progress-bar"
      >
        <div
          className="progress-bar-fill"
          style={{
            width: `${percentage}%`,
            background: colors[color] || colors.eco,
          }}
        />
      </div>
    </div>
  );
}
