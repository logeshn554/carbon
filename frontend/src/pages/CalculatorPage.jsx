import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/calculator/StepIndicator';
import TransportForm from '../components/calculator/TransportForm';
import EnergyForm from '../components/calculator/EnergyForm';
import FoodForm from '../components/calculator/FoodForm';
import ShoppingForm from '../components/calculator/ShoppingForm';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/layout/Modal';
import Input from '../components/ui/Input';
import { useAssessment } from '../hooks/useAssessment';
import { useUser } from '../hooks/useUser';

const STEPS = [
  { id: 'transport', label: 'Transport', sublabel: 'Car & flights', icon: '🚗' },
  { id: 'energy', label: 'Energy', sublabel: 'Home electricity', icon: '⚡' },
  { id: 'food', label: 'Food', sublabel: 'Diet & meals', icon: '🍽️' },
  { id: 'shopping', label: 'Shopping', sublabel: 'Consumer goods', icon: '🛍️' },
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
  const [showUserModal, setShowUserModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [errors, setErrors] = useState({});

  const { createAssessment, loading } = useAssessment();
  const { user, login } = useUser();
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final step — need user info
      if (!user) {
        setShowUserModal(true);
      } else {
        handleSubmit(user);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (currentUser) => {
    try {
      const result = await createAssessment({
        ...formData,
        userId: currentUser.id,
      });
      navigate(`/dashboard/${result.id}`);
    } catch (err) {
      console.error('Assessment failed:', err);
    }
  };

  const handleUserSubmit = async () => {
    const newErrors = {};
    if (!userName.trim() || userName.length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!userEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) newErrors.email = 'Please enter a valid email';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const newUser = await login(userName, userEmail);
      setShowUserModal(false);
      handleSubmit(newUser);
    } catch (err) {
      setErrors({ general: err.message });
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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="text-center mb-8">
          <div className="eco-badge inline-flex mb-4">
            <span aria-hidden="true">🧮</span>
            Carbon Footprint Calculator
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-100 mb-2">
            Calculate Your Footprint
          </h1>
          <p className="text-slate-400">
            Answer 4 sections of questions to get your personalized carbon footprint analysis.
          </p>
        </div>

        {/* Step indicator */}
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* Form card */}
        <Card className="mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-display font-semibold text-slate-100 flex items-center gap-2">
              <span aria-hidden="true">{STEPS[currentStep].icon}</span>
              {STEPS[currentStep].label}
            </h2>
            <p className="text-slate-500 text-sm mt-1">{STEPS[currentStep].sublabel}</p>
          </div>

          <div className="animate-fade-in" key={currentStep}>
            {renderStep()}
          </div>
        </Card>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={currentStep === 0}
            id="btn-back"
            aria-label="Go to previous step"
          >
            ← Back
          </Button>

          <div className="flex items-center gap-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentStep ? 'bg-emerald-400 scale-125' :
                  i < currentStep ? 'bg-emerald-600' : 'bg-white/15'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            loading={isLastStep && loading}
            id="btn-next"
            aria-label={isLastStep ? 'Calculate my carbon footprint' : 'Go to next step'}
          >
            {isLastStep ? '🧮 Calculate' : 'Next →'}
          </Button>
        </div>
      </div>

      {/* User info modal */}
      {showUserModal && (
        <Modal
          title="Almost there! 🌿"
          onClose={() => setShowUserModal(false)}
        >
          <p className="text-slate-400 text-sm mb-6">
            Enter your name and email to save your assessment and track your progress over time.
            No password needed — just your email for identification.
          </p>
          <div className="space-y-4">
            <Input
              id="user-name"
              label="Your Name"
              type="text"
              placeholder="Alice Green"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              error={errors.name}
              required
              autoFocus
            />
            <Input
              id="user-email"
              label="Email Address"
              type="email"
              placeholder="alice@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              error={errors.email}
              required
            />
            {errors.general && (
              <p className="text-rose-400 text-sm" role="alert">{errors.general}</p>
            )}
            <Button
              onClick={handleUserSubmit}
              loading={loading}
              className="w-full"
              id="btn-calculate"
            >
              🌍 Calculate My Footprint
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
