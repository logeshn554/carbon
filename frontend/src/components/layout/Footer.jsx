import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                style={{ background: 'linear-gradient(135deg, #059669, #0891b2)' }}>
                🌿
              </div>
              <span className="font-display font-bold gradient-text">EcoGuide AI</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Helping individuals understand and reduce their carbon footprint through
              intelligent analysis and personalized recommendations.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-slate-300 font-semibold mb-4 text-sm uppercase tracking-wider">Features</h3>
            <ul className="space-y-2" role="list">
              {[
                { to: '/calculator', label: 'Carbon Calculator' },
                { to: '/history', label: 'Progress Tracking' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-500 hover:text-emerald-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="text-slate-300 font-semibold mb-4 text-sm uppercase tracking-wider">Data Sources</h3>
            <ul className="space-y-2 text-sm text-slate-500" role="list">
              <li>IPCC Emission Factors 2023</li>
              <li>UK BEIS Carbon Factors</li>
              <li>EPA GHG Equivalencies</li>
              <li>Paris Agreement Targets</li>
            </ul>
          </div>
        </div>

        <div className="section-divider" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} EcoGuide AI. Built for a sustainable future.
          </p>
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            Carbon neutral by 2050 🌍
          </div>
        </div>
      </div>
    </footer>
  );
}
