import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/calculator/StepIndicator';
import TransportForm from '../components/calculator/TransportForm';
import EnergyForm from '../components/calculator/EnergyForm';
import FoodForm from '../components/calculator/FoodForm';
import ShoppingForm from '../components/calculator/ShoppingForm';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAssessment } from '../hooks/useAssessment';
import { useUser } from '../hooks/useUser';
import Icon from '../components/ui/Icons';

const STEPS = [
  { id: 'transport', label: 'Transport', sublabel: 'Car & flights', icon: 'transport' },
  { id: 'energy', label: 'Energy', sublabel: 'Home electricity', icon: 'energy' },
  { id: 'food', label: 'Food', sublabel: 'Diet & meals', icon: 'food' },
  { id: 'shopping', label: 'Shopping', sublabel: 'Consumer goods', icon: 'shopping' },
];

const DEFAULT_DATA = {
  dailyCarKm: 0,
  carFuelType: 'none',
  publicTransportKmPerWeek: 0,
  cyclingKmPerWeek: 0,
  shortFlightsPerYear: 0,
  longFlightsPerYear: 0,
  monthlyElectricityKwh: 0,
  renewablePercentage: 0,
  dietType: 'mixed',
  clothingItemsPerYear: 0,
  electronicsItemsPerYear: 0,
};

export default function CalculatorPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(DEFAULT_DATA);
  const [submitError, setSubmitError] = useState('');

  const { createAssessment, loading } = useAssessment();
  const { user } = useUser();
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    setSubmitError('');
    try {
      const result = await createAssessment({
        ...formData,
        userId: user.id,
      });
      if (result?.id) {
        navigate(`/dashboard/${result.id}`);
      } else {
        console.error('Assessment created but no ID returned:', result);
      }
    } catch (err) {
      console.error('Assessment failed:', err);
      setSubmitError(err.message || 'Submission failed. Please check your connection and try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <TransportForm data={formData} onChange={setFormData} />;
      case 1: return <EnergyForm data={formData} onChange={setFormData} />;
      case 2: return <FoodForm data={formData} onChange={setFormData} />;
      case 3: return <ShoppingForm data={formData} onChange={setFormData} />;
      default: return null;
    }
  };

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Page header */}
        <div className="text-center mb-10">
          <div className="eco-badge inline-flex mb-5">
            <Icon name="calculator" size={13} />
            Carbon Footprint Calculator
          </div>
          <h1
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: 'Syne, sans-serif', color: 'var(--color-text)' }}
          >
            Calculate Your Footprint
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Answer 4 sections of questions to get your personalized carbon footprint analysis.
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* Form card */}
        <Card className="mb-6">
          <div className="mb-7">
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,194,123,0.12)', color: '#00C27B' }}
              >
                <Icon name={STEPS[currentStep].icon} size={18} />
              </div>
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{ fontFamily: 'Syne, sans-serif', color: 'var(--color-text)' }}
                >
                  {STEPS[currentStep].label}
                </h2>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {STEPS[currentStep].sublabel}
                </p>
              </div>
            </div>
          </div>

          <div className="animate-fade-in" key={currentStep}>
            {renderStep()}
          </div>
        </Card>

        {/* Error */}
        {submitError && (
          <div
            className="rounded-xl p-4 mb-5 flex items-start gap-3"
            style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}
            role="alert"
          >
            <Icon name="info" size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#f43f5e' }} />
            <p className="text-sm" style={{ color: '#fb7185' }}>{submitError}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={currentStep === 0}
            id="btn-back"
            aria-label="Go to previous step"
          >
            <Icon name="arrow_left" size={16} />
            Back
          </Button>

          {/* Progress dots */}
          <div className="flex items-center gap-2" aria-hidden="true">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentStep ? 20 : 6,
                  height: 6,
                  background: i === currentStep
                    ? '#00C27B'
                    : i < currentStep
                    ? 'rgba(0,194,123,0.5)'
                    : 'rgba(255,255,255,0.12)',
                }}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            loading={isLastStep && loading}
            id="btn-next"
            aria-label={isLastStep ? 'Calculate my carbon footprint' : 'Go to next step'}
          >
            {isLastStep ? 'Calculate' : 'Next'}
            {!loading && (isLastStep
              ? <Icon name="chart" size={16} className="text-white" />
              : <Icon name="arrow_right" size={16} className="text-white" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
