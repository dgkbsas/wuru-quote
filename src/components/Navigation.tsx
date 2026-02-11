import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import { Bell } from 'lucide-react'; // TODO: Notificaciones
import { User, UserCircle, LogOut, Menu, X } from 'lucide-react';
import haLogo from '@/assets/ha-logo.png';

const navItems = [
  { label: 'Nueva cotización', path: '/dashboard' },
  { label: 'Historial', path: '/history' },
];

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const activeIndex = navItems.findIndex(
    item => item.path === location.pathname
  );

  const updatePill = useCallback(() => {
    if (activeIndex < 0) {
      setPillStyle({ left: 0, width: 0 });
      return;
    }
    const el = tabsRef.current[activeIndex];
    if (el) {
      setPillStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [activeIndex]);

  useEffect(() => {
    updatePill();
  }, [updatePill]);

  useEffect(() => {
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [updatePill]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <nav className="w-full px-3 md:px-4 py-3 md:py-4">
      <div className="max-w-[1200px] mx-auto relative">
        {/* ── Mobile header ── */}
        <div className="flex items-center justify-between md:hidden relative z-50">
          <img
            src={haLogo}
            alt="Hospital Angeles"
            className="h-8 object-contain"
          />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-300/20 border border-blue-100/30 hover:bg-blue-300/30 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 text-primary-500" />
            ) : (
              <Menu className="w-4 h-4 text-primary-500" />
            )}
          </button>
        </div>

        {/* ── Mobile backdrop + menu panel ── */}
        {mobileMenuOpen && (
          <>
          <div
            className="md:hidden fixed inset-0 bg-black/30 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="md:hidden absolute left-0 right-0 mt-3 mx-3 rounded-xl border border-blue-100/40 bg-white shadow-lg overflow-hidden z-50">
            {/* Nav links */}
            <div className="p-2">
              {navItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors
                      ${
                        isActive
                          ? 'bg-primary-500 text-white'
                          : 'text-foreground hover:bg-blue-50'
                      }
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="h-px bg-blue-100/40" />

            {/* TODO: Notificaciones mobile */}

            {/* User actions */}
            <button
              onClick={() => handleNavigate('/profile')}
              className="flex items-center gap-3 w-full px-6 py-3 text-sm text-foreground hover:bg-blue-50 transition-colors"
            >
              <UserCircle className="w-4 h-4 text-primary-500" />
              Mi perfil
            </button>
            <button
              onClick={() => handleNavigate('/login')}
              className="flex items-center gap-3 w-full px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
          </>
        )}

        {/* ── Desktop header ── */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
          <div className="shrink-0">
            <img
              src={haLogo}
              alt="Hospital Angeles Health System"
              className="h-12 object-contain"
            />
          </div>

          {/* Right section: tabs + icons */}
          <div className="flex items-center gap-4">
            {/* Pill Tab Navigation with sliding indicator */}
            <div className="relative flex items-center bg-blue-300/20 border border-blue-100/30 rounded-full">
              <div
                className="absolute top-0 bottom-0 rounded-full bg-primary-500 transition-all duration-300 ease-in-out"
                style={{
                  left: pillStyle.left,
                  width: pillStyle.width,
                }}
              />
              {navItems.map((item, i) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    ref={el => {
                      tabsRef.current[i] = el;
                    }}
                    onClick={() => navigate(item.path)}
                    className={`
                      relative z-10 px-5 py-1.5 text-sm font-bold rounded-full transition-colors duration-300 whitespace-nowrap
                      ${isActive ? 'text-blue-100' : 'text-primary-500'}
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* TODO: Notification icon */}

            {/* User icon + dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-300/20 border border-blue-100/30 hover:bg-blue-300/30 transition-colors"
              >
                <User className="w-4 h-4 text-primary-500" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-blue-100/40 bg-white shadow-lg overflow-hidden z-50">
                  <button
                    onClick={() => handleNavigate('/profile')}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground hover:bg-blue-50 transition-colors"
                  >
                    <UserCircle className="w-4 h-4 text-primary-500" />
                    Mi perfil
                  </button>
                  <div className="h-px bg-blue-100/40" />
                  <button
                    onClick={() => handleNavigate('/login')}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Salir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
