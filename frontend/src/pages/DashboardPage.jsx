import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAssessment, useUserAssessments } from '../hooks/useAssessment';
import { useUser } from '../hooks/useUser';
import FootprintCard from '../components/dashboard/FootprintCard';
import ScoreGauge from '../components/dashboard/ScoreGauge';
import EmissionPieChart from '../components/dashboard/EmissionPieChart';
import TrendChart from '../components/dashboard/TrendChart';
import RecommendationCard from '../components/dashboard/RecommendationCard';
import { PageLoader } from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import { formatDate, getScoreInfo } from '../utils/formatters';

export default function DashboardPage() {
  const { assessmentId } = useParams();
  const { assessment, loading, error, fetchAssessment } = useAssessment();
  const { user } = useUser();
  const { assessments, fetchAssessments } = useUserAssessments(user?.id);

  useEffect(() => {
    if (assessmentId) fetchAssessment(assessmentId);
  }, [assessmentId]);

  useEffect(() => {
    if (user?.id) fetchAssessments();
  }, [user?.id]);

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <h2 className="text-2xl font-display font-bold text-slate-200 mb-2">Assessment Not Found</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link to="/calculator"><Button>New Assessment</Button></Link>
        </div>
      </div>
    );
  }

  if (!assessment) return null;

  const scoreInfo = getScoreInfo(assessment.sustainabilityScore);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="eco-badge inline-flex mb-2">
              <span aria-hidden="true">📊</span>
              Dashboard
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-100">
              Your Carbon Footprint
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Assessment from {formatDate(assessment.createdAt)}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to={`/simulator/${assessmentId}`}>
              <Button variant="secondary" id="btn-simulate">
                <span aria-hidden="true">🔬</span> Simulate Changes
              </Button>
            </Link>
            <Link to="/calculator">
              <Button id="btn-new-assessment">
                <span aria-hidden="true">🔄</span> New Assessment
              </Button>
            </Link>
          </div>
        </div>

        {/* Score banner */}
        <div
          className="glass-card p-4 mb-6 border flex items-center gap-4 animate-slide-up"
          style={{ borderColor: `${scoreInfo.color}40` }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: `${scoreInfo.color}20` }}
            aria-hidden="true"
          >
            {assessment.sustainabilityScore >= 70 ? '🌟' : assessment.sustainabilityScore >= 50 ? '🌱' : '🌍'}
          </div>
          <div>
            <p className={`font-semibold ${scoreInfo.textClass}`}>
              {scoreInfo.label} — Score {assessment.sustainabilityScore}/100
            </p>
            <p className="text-slate-500 text-sm mt-0.5">
              {assessment.sustainabilityScore >= 90 ? 'Outstanding! Your footprint is well below the Paris Agreement target.' :
               assessment.sustainabilityScore >= 70 ? 'Great work! A few more changes could put you in the excellent category.' :
               assessment.sustainabilityScore >= 50 ? 'You\'re around the global average. The recommendations below can help you reduce further.' :
               'There are significant opportunities to reduce your impact. Start with the high-priority recommendations.'}
            </p>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* Left: Footprint card */}
          <div className="lg:col-span-2">
            <FootprintCard assessment={assessment} />
          </div>
          {/* Right: Score gauge */}
          <div>
            <ScoreGauge score={assessment.sustainabilityScore} />
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <EmissionPieChart assessment={assessment} />
          <TrendChart assessments={assessments} />
        </div>

        {/* Recommendations */}
        {assessment.recommendations && assessment.recommendations.length > 0 && (
          <section aria-labelledby="recommendations-heading">
            <div className="flex items-center justify-between mb-4">
              <h2 id="recommendations-heading" className="text-xl font-display font-semibold text-slate-100">
                🤖 AI Recommendations
              </h2>
              <span className="eco-badge">
                {assessment.recommendations.length} actions
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessment.recommendations.map((rec, i) => (
                <RecommendationCard key={rec.id} recommendation={rec} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Recent assessments */}
        {assessments.length > 1 && (
          <section className="mt-8" aria-labelledby="history-heading">
            <div className="flex items-center justify-between mb-4">
              <h2 id="history-heading" className="text-xl font-display font-semibold text-slate-100">
                Recent Assessments
              </h2>
              <Link to="/history" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {assessments.slice(0, 3).map((a) => (
                <Link key={a.id} to={`/dashboard/${a.id}`}>
                  <div className="glass-card-hover p-4">
                    <p className="text-xs text-slate-500 mb-2">{formatDate(a.createdAt)}</p>
                    <p className="text-xl font-display font-bold gradient-text">
                      {(a.totalEmission / 1000).toFixed(2)}t
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Score: {a.sustainabilityScore}/100
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
