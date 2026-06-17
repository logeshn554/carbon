import { Link } from 'react-router-dom';
import Icon from '../ui/Icons';

export default function Footer() {
  return (
    <footer
      className="mt-24"
      role="contentinfo"
      style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #00C27B, #059669)' }}
              >
                <Icon name="leaf" size={15} className="text-white" />
              </div>
              <span
                className="font-bold text-base gradient-text"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                EcoGuide AI
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Helping individuals understand and reduce their carbon footprint through
              intelligent analysis and personalized recommendations.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Features
            </h3>
            <ul className="space-y-3" role="list">
              {[
                { to: '/calculator', label: 'Carbon Calculator' },
                { to: '/history', label: 'Progress Tracking' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--color-text-faint)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#00C27B'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-faint)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Data Sources
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-faint)' }} role="list">
              <li>IPCC Emission Factors 2023</li>
              <li>UK BEIS Carbon Factors</li>
              <li>EPA GHG Equivalencies</li>
              <li>Paris Agreement Targets</li>
            </ul>
          </div>
        </div>

        <div className="section-divider" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: 'var(--color-text-faint)' }}>
            &copy; {new Date().getFullYear()} EcoGuide AI. Built for a sustainable future.
          </p>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-faint)' }}>
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: '#00C27B' }}
              aria-hidden="true"
            />
            Carbon neutral by 2050
          </div>
        </div>
      </div>
    </footer>
  );
}
