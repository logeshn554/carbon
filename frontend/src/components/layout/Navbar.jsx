import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import Button from '../ui/Button';
import Modal from './Modal';

export default function Navbar() {
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/calculator', label: 'Calculator', icon: '🧮' },
    { to: '/history', label: 'History', icon: '📊' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowLogout(false);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(10, 15, 26, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group"
              aria-label="EcoGuide AI - Home"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'linear-gradient(135deg, #059669, #0891b2)' }}>
                  🌿
                </div>
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ boxShadow: '0 0 15px rgba(16,185,129,0.5)' }} />
              </div>
              <div>
                <span className="font-display font-bold text-lg gradient-text">EcoGuide</span>
                <span className="font-display font-bold text-lg text-slate-100"> AI</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1" role="list">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  role="listitem"
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive(link.to)
                      ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
                  `}
                  aria-current={isActive(link.to) ? 'page' : undefined}
                >
                  <span aria-hidden="true">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* User section */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-200">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[140px]">{user.email}</p>
                  </div>
                  <button
                    onClick={() => setShowLogout(true)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
                    aria-label="Account options"
                  >
                    <span aria-hidden="true">👤</span>
                  </button>
                </div>
              ) : (
                <Link to="/calculator">
                  <Button size="sm">Get Started</Button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-white/5 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <span aria-hidden="true">{mobileOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden border-t border-white/5 animate-fade-in"
            style={{ background: 'rgba(10, 15, 26, 0.95)' }}
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive(link.to)
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
                  `}
                >
                  <span aria-hidden="true">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              {user ? (
                <div className="pt-2 border-t border-white/5 mt-2">
                  <p className="px-4 py-1 text-sm text-slate-400">{user.name}</p>
                  <button
                    onClick={() => { setShowLogout(true); setMobileOpen(false); }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link to="/calculator" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-center btn-primary rounded-xl text-sm font-semibold mt-2">
                  Get Started
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Logout confirmation modal */}
      {showLogout && (
        <Modal onClose={() => setShowLogout(false)} title="Sign Out">
          <p className="text-slate-400 mb-6">Are you sure you want to sign out? Your assessments are saved and will be available when you sign back in.</p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowLogout(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleLogout}>Sign Out</Button>
          </div>
        </Modal>
      )}
    </>
  );
}
