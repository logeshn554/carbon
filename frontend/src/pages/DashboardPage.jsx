import { useEffect } from 'react';
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
import Icon from '../components/ui/Icons';

export default function DashboardPage() {
  const { assessmentId } = useParams();
  const { assessment, loading, error, fetchAssessment } = useAssessment();
  const { user } = useUser();
  const { assessments, fetchAssessments } = useUserAssessments(user?.id);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (assessmentId) fetchAssessment(assessmentId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user?.id) fetchAssessments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e' }}
          >
            <Icon name="info" size={28} />
          </div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: 'Syne, sans-serif', color: 'var(--color-text)' }}
          >
            Assessment Not Found
          </h2>
          <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>{error}</p>
          <Link to="/calculator"><Button>New Assessment</Button></Link>
        </div>
      </div>
    );
  }

  if (!assessment) return null;

  const scoreInfo = getScoreInfo(assessment.sustainabilityScore);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="eco-badge inline-flex mb-3">
              <Icon name="chart" size={13} />
              Dashboard
            </div>
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: 'Syne, sans-serif', color: 'var(--color-text)' }}
            >
              Your Carbon Footprint
            </h1>
            <p className="text-sm mt-1.5" style={{ color: 'var(--color-text-faint)' }}>
              Assessment from {formatDate(assessment.createdAt)}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to={`/simulator/${assessmentId}`}>
              <Button variant="secondary" id="btn-simulate">
                <Icon name="flask" size={15} />
                Simulate Changes
              </Button>
            </Link>
            <Link to="/calculator">
              <Button id="btn-new-assessment">
                <Icon name="plus" size={15} className="text-white" />
                New Assessment
              </Button>
            </Link>
          </div>
        </div>

        {/* Score banner */}
        <div
          className="glass-card p-5 mb-6 flex items-center gap-4 animate-slide-up"
          style={{ borderColor: `${scoreInfo.color}35` }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${scoreInfo.color}18` }}
          >
            <Icon
              name={assessment.sustainabilityScore >= 70 ? 'star' : assessment.sustainabilityScore >= 50 ? 'sprout' : 'globe'}
              size={22}
              style={{ color: scoreInfo.color }}
              className="text-current"
            />
          </div>
          <div>
            <p className="font-semibold" style={{ color: scoreInfo.color }}>
              {scoreInfo.label} — Score {assessment.sustainabilityScore}/100
            </p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {assessment.sustainabilityScore >= 90
                ? 'Outstanding! Your footprint is well below the Paris Agreement target.'
                : assessment.sustainabilityScore >= 70
                ? 'Great work! A few more changes could put you in the excellent category.'
                : assessment.sustainabilityScore >= 50
                ? "You're around the global average. The recommendations below can help you reduce further."
                : 'There are significant opportunities to reduce your impact. Start with the high-priority recommendations.'}
            </p>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          <div className="lg:col-span-2">
            <FootprintCard assessment={assessment} />
          </div>
          <div>
            <ScoreGauge score={assessment.sustainabilityScore} />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <EmissionPieChart assessment={assessment} />
          <TrendChart assessments={assessments} />
        </div>

        {/* Recommendations */}
        {assessment.recommendations && assessment.recommendations.length > 0 && (
          <section aria-labelledby="recommendations-heading">
            <div className="flex items-center justify-between mb-5">
              <h2
                id="recommendations-heading"
                className="text-xl font-bold flex items-center gap-2.5"
                style={{ fontFamily: 'Syne, sans-serif', color: 'var(--color-text)' }}
              >
                <Icon name="robot" size={20} style={{ color: '#4F8EF7' }} className="text-current" />
                AI Recommendations
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
          <section className="mt-10" aria-labelledby="history-heading">
            <div className="flex items-center justify-between mb-5">
              <h2
                id="history-heading"
                className="text-xl font-bold"
                style={{ fontFamily: 'Syne, sans-serif', color: 'var(--color-text)' }}
              >
                Recent Assessments
              </h2>
              <Link
                to="/history"
                className="text-sm font-medium flex items-center gap-1 transition-colors"
                style={{ color: '#00C27B' }}
              >
                View All <Icon name="arrow_right" size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {assessments.slice(0, 3).map((a) => (
                <Link key={a.id} to={`/dashboard/${a.id}`}>
                  <div className="glass-card-hover p-5">
                    <p className="text-xs mb-2" style={{ color: 'var(--color-text-faint)' }}>
                      {formatDate(a.createdAt)}
                    </p>
                    <p className="text-xl font-bold gradient-text" style={{ fontFamily: 'Syne, sans-serif' }}>
                      {(a.totalEmission / 1000).toFixed(2)}t
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-faint)' }}>
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
