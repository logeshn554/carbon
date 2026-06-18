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

const STEPS = [
  { id: 'transport', label: 'Transport', sublabel: 'Car & flights' },
  { id: 'energy', label: 'Energy', sublabel: 'Home electricity' },
  { id: 'food', label: 'Food', sublabel: 'Diet & meals' },
  { id: 'shopping', label: 'Shopping', sublabel: 'Consumer goods' },
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
  const { user, registerUser, resetUser } = useUser();
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
      let activeUser = user;
      if (!user.isRegistered) {
        activeUser = await registerUser();
      }

      const result = await createAssessment({ ...formData, userId: activeUser.id });
      if (result?.id) {
        navigate(`/dashboard/${result.id}`);
      }
    } catch (err) {
      if (err.message?.includes('User not found')) {
        try {
          const newUser = resetUser();
          const registeredUser = await registerUser(newUser.id);
          const result = await createAssessment({ ...formData, userId: registeredUser.id });
          if (result?.id) {
            navigate(`/dashboard/${result.id}`);
            return;
          }
        } catch (retryErr) {
          setSubmitError(retryErr.message || 'Submission failed. Please try again.');
          return;
        }
      }
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
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="eco-badge inline-flex mb-5">
            Carbon Footprint Calculator
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Calculate Your Footprint
          </h1>
          <p style={{ color: '#555' }}>
            Answer 4 sections of questions to get your personalized carbon footprint analysis.
          </p>

          {/* Dynamic progress bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono" style={{ color: '#444' }}>
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <span className="text-xs font-mono" style={{ color: '#444' }}>
                {Math.round(progress)}% complete
              </span>
            </div>
            <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${progress}%`, background: '#fff' }}
              />
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* Form card */}
        <Card className="mb-6">
          <div className="mb-7">
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-mono px-2 py-1 rounded"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#888', border: '1px solid rgba(255,255,255,0.08)', letterSpacing: '0.1em' }}
              >
                {String(currentStep + 1).padStart(2, '0')}
              </span>
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  {STEPS[currentStep].label}
                </h2>
                <p className="text-xs" style={{ color: '#555' }}>
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
            className="rounded-xl p-4 mb-5"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)' }}
            role="alert"
          >
            <p className="text-sm" style={{ color: '#aaa' }}>{submitError}</p>
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
            Back
          </Button>

          {/* Step pills */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentStep ? 24 : 5,
                  height: 5,
                  background: i === currentStep
                    ? '#fff'
                    : i < currentStep
                    ? 'rgba(255,255,255,0.3)'
                    : 'rgba(255,255,255,0.1)',
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
          </Button>
        </div>
      </div>
    </div>
  );
}
