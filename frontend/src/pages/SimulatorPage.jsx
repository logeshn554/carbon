import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAssessment } from '../hooks/useAssessment';
import { useSimulation } from '../hooks/useSimulation';
import ScenarioSelector from '../components/simulator/ScenarioSelector';
import ImpactDisplay from '../components/simulator/ImpactDisplay';
import ComparisonBar from '../components/simulator/ComparisonBar';
import { PageLoader } from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { formatEmissionTonnes } from '../utils/formatters';

export default function SimulatorPage() {
  const { assessmentId } = useParams();
  const { assessment, loading, fetchAssessment } = useAssessment();
  const { simulation, loading: simLoading, error: simError, runSimulation } = useSimulation();
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (assessmentId) fetchAssessment(assessmentId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentId]);

  const handleRun = async () => {
    if (!selectedScenario || !assessmentId) return;
    try {
      const result = await runSimulation(
        assessmentId,
        selectedScenario.name,
        selectedScenario.params
      );
      setHistory((prev) => [result, ...prev.slice(0, 4)]);
    } catch (err) {
      console.error('Simulation error:', err);
    }
  };

  if (loading) return <PageLoader />;
  if (!assessment) return null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="eco-badge inline-flex mb-2">
              <span aria-hidden="true">🔬</span>
              Impact Simulator
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-100">
              Simulate Lifestyle Changes
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              See the projected impact before making a change
            </p>
          </div>
          <div className="flex gap-3">
            <Link to={`/dashboard/${assessmentId}`}>
              <Button variant="secondary">← Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Current footprint banner */}
        <div className="glass-card p-4 mb-6 border border-white/8 flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Your Current Footprint</p>
            <p className="text-2xl font-display font-bold gradient-text">
              {(assessment.totalEmission / 1000).toFixed(2)} tonnes CO₂/year
            </p>
          </div>
          <div className="h-8 w-px bg-white/10 hidden sm:block" aria-hidden="true" />
          <div>
            <p className="text-xs text-slate-500">Sustainability Score</p>
            <p className="text-xl font-bold text-slate-200">{assessment.sustainabilityScore}/100</p>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Scenario selector */}
          <Card>
            <h2 className="text-lg font-display font-semibold text-slate-100 mb-5">
              Choose a Scenario
            </h2>
            <ScenarioSelector
              selectedScenario={selectedScenario}
              onSelect={setSelectedScenario}
              onRun={handleRun}
              loading={simLoading}
            />
            {simError && (
              <p className="mt-4 text-rose-400 text-sm" role="alert">{simError}</p>
            )}
          </Card>

          {/* Results column */}
          <div className="space-y-5">
            {simulation ? (
              <>
                <ImpactDisplay simulation={simulation} />
                <Card>
                  <h3 className="text-slate-200 font-semibold mb-4">Detailed Comparison</h3>
                  <ComparisonBar
                    original={simulation.originalEmission}
                    projected={simulation.projectedEmission}
                    label="Total Annual Emissions"
                  />
                  {simulation.categoryBreakdown && (
                    <div className="mt-5 space-y-4">
                      {[
                        { key: 'transport', label: '🚗 Transport' },
                        { key: 'energy', label: '⚡ Energy' },
                        { key: 'food', label: '🍽️ Food' },
                        { key: 'shopping', label: '🛍️ Shopping' },
                      ].map(({ key, label }) => {
                        const orig = simulation.categoryBreakdown.original[key];
                        const proj = simulation.categoryBreakdown.projected[key];
                        if (orig === proj) return null;
                        return (
                          <ComparisonBar
                            key={key}
                            original={orig}
                            projected={proj}
                            label={label}
                          />
                        );
                      })}
                    </div>
                  )}
                </Card>
              </>
            ) : (
              <div className="glass-card p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
                <span className="text-5xl mb-4" aria-hidden="true">🔬</span>
                <h3 className="text-slate-300 font-semibold mb-2">Choose a Scenario to Simulate</h3>
                <p className="text-slate-500 text-sm">
                  Select a lifestyle change from the left panel and click Run Simulation to see projected impact.
                </p>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <Card>
                <h3 className="text-slate-200 font-semibold mb-4">Simulation History</h3>
                <div className="space-y-3">
                  {history.map((sim, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                      <span className="text-sm text-slate-300 truncate">{sim.scenarioName}</span>
                      <span className={`text-sm font-mono font-semibold flex-shrink-0 ml-3 ${
                        sim.annualSavingsKg > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {sim.annualSavingsKg > 0 ? '−' : '+'}{Math.abs(sim.annualSavingsKg).toLocaleString()} kg
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
