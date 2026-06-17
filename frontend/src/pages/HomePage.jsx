import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icons';

const stats = [
  { value: '4.7t', label: 'Global average CO₂/year', icon: 'globe' },
  { value: '2.0t', label: 'Paris Agreement target', icon: 'target' },
  { value: '25%', label: 'From food production', icon: 'food' },
  { value: '16%', label: 'From personal transport', icon: 'transport' },
];

const features = [
  {
    icon: 'calculator',
    title: 'Carbon Calculator',
    description: 'Measure your annual CO₂ footprint across transport, energy, food, and shopping with real IPCC emission factors.',
    gradient: 'from-eco to-teal',
    glow: 'rgba(0,194,123,0.15)',
    border: 'rgba(0,194,123,0.18)',
  },
  {
    icon: 'robot',
    title: 'AI Recommendations',
    description: 'Get personalized, prioritized recommendations based on your largest emission sources — not generic advice.',
    gradient: 'from-blue to-violet',
    glow: 'rgba(79,142,247,0.15)',
    border: 'rgba(79,142,247,0.18)',
  },
  {
    icon: 'flask',
    title: 'Impact Simulator',
    description: 'Simulate future scenarios — switch to an EV, install solar panels, go vegetarian — and see real projected savings.',
    gradient: 'from-violet to-pink',
    glow: 'rgba(139,92,246,0.15)',
    border: 'rgba(139,92,246,0.18)',
  },
  {
    icon: 'trending_down',
    title: 'Progress Tracking',
    description: 'Track your footprint over time, compare assessments, and celebrate your reductions with visual trends.',
    gradient: 'from-amber to-orange',
    glow: 'rgba(245,158,11,0.15)',
    border: 'rgba(245,158,11,0.18)',
  },
];

const steps = [
  { num: '01', title: 'Answer 4 sections', desc: 'Transport, energy, food, and shopping — takes less than 5 minutes.' },
  { num: '02', title: 'See your footprint', desc: 'Get a detailed breakdown of your annual CO₂ with a sustainability score.' },
  { num: '03', title: 'Get AI recommendations', desc: 'Personalized actions ranked by impact, tailored to your lifestyle.' },
  { num: '04', title: 'Simulate & track', desc: 'Model changes, retake the assessment, and watch your footprint shrink.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden py-28 px-4"
        aria-labelledby="hero-heading"
      >
        {/* Background mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl animate-pulse-slow"
            style={{ background: 'rgba(0,194,123,0.06)' }}
          />
          <div
            className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse-slow"
            style={{ background: 'rgba(79,142,247,0.04)', animationDelay: '1.5s' }}
          />
          <div
            className="absolute bottom-10 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse-slow"
            style={{ background: 'rgba(139,92,246,0.03)', animationDelay: '3s' }}
          />
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="eco-badge inline-flex mb-8 animate-fade-in">
            <Icon name="leaf" size={13} />
            AI-Powered Carbon Footprint Analysis
          </div>

          <h1
            id="hero-heading"
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-7 animate-slide-up"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Understand Your
            <br />
            <span className="gradient-text">Carbon Impact</span>
          </h1>

          <p
            className="text-xl leading-relaxed max-w-2xl mx-auto mb-12 animate-slide-up"
            style={{ color: 'var(--color-text-muted)', animationDelay: '0.1s' }}
          >
            Measure your annual CO₂ footprint, receive personalized AI recommendations,
            and simulate the impact of lifestyle changes — all backed by real emission science.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <Link to="/calculator" id="hero-cta">
              <button className="btn-primary glow-eco !px-8 !py-4 !text-base">
                <Icon name="calculator" size={18} className="text-white" />
                Start Your Assessment
              </button>
            </Link>
            <Link to="/history">
              <button className="btn-secondary !px-8 !py-4 !text-base">
                <Icon name="history" size={18} />
                View History
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-card p-5 text-center animated-border"
                role="figure"
                aria-label={`${stat.value} — ${stat.label}`}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(0,194,123,0.1)', color: '#00C27B' }}
                >
                  <Icon name={stat.icon} size={17} />
                </div>
                <p className="text-2xl font-bold gradient-text mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {stat.value}
                </p>
                <p className="text-xs leading-tight" style={{ color: 'var(--color-text-faint)' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-4" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2
              id="features-heading"
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: 'Syne, sans-serif', color: 'var(--color-text)' }}
            >
              Everything You Need to Go Green
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
              A complete platform for measuring and reducing your environmental impact,
              powered by real-world data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="glass-card-hover p-7 animate-slide-up"
                style={{
                  animationDelay: `${i * 0.08}s`,
                  borderColor: feature.border,
                }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: feature.glow }}
                >
                  <Icon
                    name={feature.icon}
                    size={22}
                    style={{ color: feature.border.replace('0.18', '1') }}
                    className="text-current"
                  />
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: 'Syne, sans-serif', color: 'var(--color-text)' }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-4" aria-labelledby="how-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2
              id="how-heading"
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: 'Syne, sans-serif', color: 'var(--color-text)' }}
            >
              How It Works
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              From first click to meaningful reduction in four steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="glass-card p-6 flex gap-5 animate-slide-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div
                  className="text-3xl font-bold flex-shrink-0 leading-none mt-0.5"
                  style={{ fontFamily: 'Syne, sans-serif', color: 'rgba(0,194,123,0.25)' }}
                >
                  {step.num}
                </div>
                <div>
                  <p
                    className="font-semibold mb-1.5"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {step.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="glass-card p-12"
            style={{
              background: 'linear-gradient(145deg, rgba(0,194,123,0.07) 0%, rgba(79,142,247,0.04) 100%)',
              borderColor: 'rgba(0,194,123,0.2)',
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 glow-eco"
              style={{ background: 'linear-gradient(135deg, #00C27B, #059669)' }}
            >
              <Icon name="globe" size={28} className="text-white" />
            </div>
            <h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: 'Syne, sans-serif', color: 'var(--color-text)' }}
            >
              Ready to Make a Difference?
            </h2>
            <p className="mb-10" style={{ color: 'var(--color-text-muted)' }}>
              It takes less than 5 minutes to calculate your carbon footprint.
              The first step to reducing it is knowing it.
            </p>
            <Link to="/calculator" id="footer-cta">
              <button className="btn-primary glow-eco !px-10 !py-4 !text-base">
                Calculate My Footprint
                <Icon name="arrow_right" size={18} className="text-white" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
