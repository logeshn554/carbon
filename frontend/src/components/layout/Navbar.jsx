import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Icon from '../ui/Icons';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/calculator', label: 'Calculator', icon: 'calculator' },
    { to: '/history', label: 'History', icon: 'history' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(6, 11, 20, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            aria-label="EcoGuide AI — Home"
          >
            <div className="relative">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg, #00C27B, #059669)' }}
              >
                <Icon name="leaf" size={18} className="text-white" />
              </div>
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: '0 0 20px rgba(0,194,123,0.5)' }}
              />
            </div>
            <div className="leading-none">
              <span className="font-display font-bold text-lg gradient-text">EcoGuide</span>
              <span
                className="font-bold text-lg"
                style={{ color: 'var(--color-text)', fontFamily: 'Syne, sans-serif' }}
              >
                {' '}AI
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1" role="list">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                role="listitem"
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive(link.to) ? 'nav-link-active' : 'nav-link'}
                `}
                aria-current={isActive(link.to) ? 'page' : undefined}
              >
                <Icon name={link.icon} size={15} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center">
            <Link to="/calculator">
              <button className="btn-primary !px-5 !py-2 !text-sm">
                Start Assessment
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-all"
            style={{ color: 'var(--color-text-muted)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen
              ? <Icon name="close" size={18} />
              : <Icon name="menu" size={18} />
            }
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t animate-fade-in"
          style={{
            background: 'rgba(6, 11, 20, 0.97)',
            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive(link.to) ? 'nav-link-active' : 'nav-link'}
                `}
              >
                <Icon name={link.icon} size={16} />
                {link.label}
              </Link>
            ))}
            <Link
              to="/calculator"
              onClick={() => setMobileOpen(false)}
              className="block mt-3"
            >
              <button className="btn-primary w-full !py-2.5 !text-sm">
                Start Assessment
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
