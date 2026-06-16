import { formatNumber } from '../../utils/formatters';
import { getPriorityInfo } from '../../utils/formatters';

const categoryIcons = {
  transport: '🚗',
  energy: '⚡',
  food: '🍽️',
  shopping: '🛍️',
};

export default function RecommendationCard({ recommendation, index }) {
  const priorityInfo = getPriorityInfo(recommendation.priority);

  return (
    <div
      className="glass-card-hover p-5 animate-slide-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex items-start gap-4">
        {/* Category icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{
            background: recommendation.priority === 'HIGH'
              ? 'rgba(239,68,68,0.15)'
              : recommendation.priority === 'MEDIUM'
              ? 'rgba(245,158,11,0.15)'
              : 'rgba(6,182,212,0.15)',
          }}
          aria-hidden="true"
        >
          {categoryIcons[recommendation.category] || '💡'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="text-slate-200 font-semibold text-sm leading-snug">
              {recommendation.title}
            </h4>
            <span
              className={`
                flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
                ${priorityInfo.bgClass} ${priorityInfo.textClass} border ${priorityInfo.borderClass}
              `}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
              {recommendation.priority}
            </span>
          </div>

          <p className="text-slate-500 text-xs leading-relaxed mb-3">
            {recommendation.description}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-mono font-semibold text-sm">
              −{formatNumber(recommendation.estimatedSavings)} kg
            </span>
            <span className="text-slate-600 text-xs">CO₂ savings/year</span>
          </div>
        </div>
      </div>
    </div>
  );
}
