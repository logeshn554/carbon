import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useUser } from '../hooks/useUser';

const stats = [
  { value: '4.7t', label: 'Global average CO₂/year', icon: '🌍' },
  { value: '2.0t', label: 'Paris Agreement target', icon: '🎯' },
  { value: '25%', label: 'From food production', icon: '🌾' },
  { value: '16%', label: 'From personal transport', icon: '🚗' },
];

const features = [
  {
    icon: '🧮',
    title: 'Carbon Calculator',
    description: 'Measure your annual CO₂ footprint across transport, energy, food, and shopping with real IPCC emission factors.',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/20',
  },
  {
    icon: '🤖',
    title: 'AI Recommendations',
    description: 'Get personalized, prioritized recommendations based on your largest emission sources — not generic advice.',
    color: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/20',
  },
  {
    icon: '🔬',
    title: 'Impact Simulator',
    description: 'Simulate future scenarios — switch to an EV, install solar panels, go vegetarian — and see the real projected savings.',
    color: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/20',
  },
  {
    icon: '📈',
    title: 'Progress Tracking',
    description: 'Track your footprint over time, compare assessments, and celebrate your reductions with visual trends.',
    color: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/20',
  },
];

export default function HomePage() {
  const { user } = useUser();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-24 px-4"
        aria-labelledby="hero-heading"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse-slow"
            style={{ background: 'rgba(16, 185, 129, 0.06)' }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse-slow"
            style={{ background: 'rgba(6, 182, 212, 0.04)', animationDelay: '1s' }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="eco-badge inline-flex mb-6 animate-fade-in">
            <span aria-hidden="true">🌿</span>
            AI-Powered Carbon Footprint Analysis
          </div>

          <h1
            id="hero-heading"
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 animate-slide-up"
          >
            Understand Your
            <br />
            <span className="gradient-text">Carbon Impact</span>
          </h1>

          <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10 animate-slide-up"
            style={{ animationDelay: '0.1s' }}>
            Measure your annual CO₂ footprint, receive personalized AI recommendations,
            and simulate the impact of lifestyle changes — all backed by real emission science.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to={user ? '/calculator' : '/calculator'} id="hero-cta">
              <Button size="lg" className="glow-eco">
                <span aria-hidden="true">🧮</span>
                Start Your Assessment
              </Button>
            </Link>
            {user && (
              <Link to="/history">
                <Button variant="secondary" size="lg">
                  <span aria-hidden="true">📊</span>
                  View My History
                </Button>
              </Link>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-card p-4 text-center"
                role="figure"
                aria-label={`${stat.value} — ${stat.label}`}
              >
                <span className="text-2xl block mb-2" aria-hidden="true">{stat.icon}</span>
                <p className="text-2xl font-display font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1 leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 id="features-heading" className="text-3xl sm:text-4xl font-display font-bold text-slate-100 mb-4">
              Everything You Need to Go Green
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A complete platform for measuring and reducing your environmental impact, powered by real-world data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`
                  glass-card-hover p-6 border ${feature.border}
                  animate-slide-up
                `}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4`}
                  aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-display font-semibold text-slate-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="glass-card p-10 border border-emerald-500/20 glow-eco"
            style={{ background: 'linear-gradient(145deg, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.05) 100%)' }}
          >
            <span className="text-4xl block mb-4" aria-hidden="true">🌍</span>
            <h2 className="text-3xl font-display font-bold text-slate-100 mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-slate-400 mb-8">
              It takes less than 5 minutes to calculate your carbon footprint.
              The first step to reducing it is knowing it.
            </p>
            <Link to="/calculator" id="footer-cta">
              <Button size="lg">
                Calculate My Footprint <span aria-hidden="true">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
