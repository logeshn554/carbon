import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserAssessments } from '../hooks/useAssessment';
import { useUser } from '../hooks/useUser';
import { PageLoader } from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import { formatDate, formatRelativeTime, getScoreInfo, formatNumber } from '../utils/formatters';

const CATEGORY_ICONS = { transport: '🚗', energy: '⚡', food: '🍽️', shopping: '🛍️' };

export default function HistoryPage() {
  const { user } = useUser();
  const { assessments, loading, fetchAssessments } = useUserAssessments(user?.id);

  useEffect(() => {
    if (user?.id) fetchAssessments();
  }, [user?.id]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <span className="text-5xl block mb-4" aria-hidden="true">👤</span>
          <h1 className="text-2xl font-display font-bold text-slate-200 mb-3">Sign In to View History</h1>
          <p className="text-slate-400 mb-6">
            Start your first assessment to create an account and begin tracking your carbon footprint over time.
          </p>
          <Link to="/calculator"><Button>Start Assessment</Button></Link>
        </div>
      </div>
    );
  }

  if (loading) return <PageLoader />;

  if (!assessments.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <span className="text-5xl block mb-4" aria-hidden="true">📊</span>
          <h1 className="text-2xl font-display font-bold text-slate-200 mb-3">No Assessments Yet</h1>
          <p className="text-slate-400 mb-6">Complete your first carbon footprint assessment to start tracking your progress.</p>
          <Link to="/calculator"><Button>Start First Assessment</Button></Link>
        </div>
      </div>
    );
  }

  // Calculate trend
  const sorted = [...assessments].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const latest = sorted[sorted.length - 1];
  const earliest = sorted[0];
  const totalReduction = earliest.totalEmission - latest.totalEmission;
  const hasImproved = totalReduction > 0;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="eco-badge inline-flex mb-2">
              <span aria-hidden="true">📈</span>
              Progress Tracking
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-100">
              Assessment History
            </h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back, {user.name}</p>
          </div>
          <Link to="/calculator">
            <Button id="btn-new-assessment-history">
              <span aria-hidden="true">+</span> New Assessment
            </Button>
          </Link>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-5 text-center">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Total Assessments</p>
            <p className="text-3xl font-display font-bold gradient-text">{assessments.length}</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Latest Score</p>
            <p className={`text-3xl font-display font-bold ${getScoreInfo(latest.sustainabilityScore).textClass}`}>
              {latest.sustainabilityScore}/100
            </p>
            <p className="text-xs text-slate-600 mt-1">{getScoreInfo(latest.sustainabilityScore).label}</p>
          </div>
          {assessments.length > 1 && (
            <div className={`glass-card p-5 text-center border ${hasImproved ? 'border-emerald-500/20' : 'border-rose-500/20'}`}>
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">
                {hasImproved ? 'Total Reduction' : 'Change'}
              </p>
              <p className={`text-3xl font-display font-bold ${hasImproved ? 'text-emerald-400' : 'text-rose-400'}`}>
                {hasImproved ? '−' : '+'}{formatNumber(Math.abs(totalReduction))}
              </p>
              <p className="text-xs text-slate-500 mt-1">kg CO₂ since first assessment</p>
            </div>
          )}
        </div>

        {/* Assessment list */}
        <section aria-label="Assessment history">
          <h2 className="text-lg font-semibold text-slate-300 mb-4">
            All Assessments ({assessments.length})
          </h2>
          <div className="space-y-4">
            {assessments.map((a, i) => {
              const scoreInfo = getScoreInfo(a.sustainabilityScore);
              const isLatest = i === 0;
              return (
                <article
                  key={a.id}
                  className="glass-card-hover p-5 animate-slide-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  aria-label={`Assessment from ${formatDate(a.createdAt)}, score ${a.sustainabilityScore}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Score badge */}
                      <div
                        className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 border ${scoreInfo.borderClass} ${scoreInfo.bgClass}`}
                      >
                        <span className={`text-lg font-display font-bold ${scoreInfo.textClass}`}>
                          {a.sustainabilityScore}
                        </span>
                        <span className="text-[9px] text-slate-500">/100</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-slate-200">
                            {formatDate(a.createdAt)}
                          </p>
                          {isLatest && (
                            <span className="eco-badge text-[10px] px-2 py-0.5">Latest</span>
                          )}
                        </div>
                        <p className="text-slate-500 text-sm mt-0.5">
                          {formatRelativeTime(a.createdAt)} · {(a.totalEmission / 1000).toFixed(2)} tonnes CO₂/year
                        </p>

                        {/* Category breakdown mini */}
                        <div className="flex items-center gap-3 mt-2">
                          {[
                            { key: 'transport', val: a.transportEmission },
                            { key: 'energy', val: a.energyEmission },
                            { key: 'food', val: a.foodEmission },
                            { key: 'shopping', val: a.shoppingEmission },
                          ].map(({ key, val }) => (
                            <span key={key} className="flex items-center gap-1 text-xs text-slate-600">
                              <span aria-hidden="true">{CATEGORY_ICONS[key]}</span>
                              {formatNumber(val)}kg
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                      <Link to={`/simulator/${a.id}`}>
                        <Button variant="secondary" size="sm">
                          <span aria-hidden="true">🔬</span> Simulate
                        </Button>
                      </Link>
                      <Link to={`/dashboard/${a.id}`}>
                        <Button size="sm">
                          View →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
