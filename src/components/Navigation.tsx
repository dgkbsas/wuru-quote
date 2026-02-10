import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
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

  const activeIndex = navItems.findIndex(
    item => item.path === location.pathname
  );

  const updatePill = useCallback(() => {
    const idx = activeIndex >= 0 ? activeIndex : 0;
    const el = tabsRef.current[idx];
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

  return (
    <nav className="w-full px-4 py-4">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        {/* Logo - Hospital Angeles */}
        <div className="shrink-0">
          <img
            src={haLogo}
            alt="Hospital Angeles Health System"
            className="h-8 object-contain"
          />
        </div>

        {/* Right section: tabs + icons */}
        <div className="flex items-center gap-4">
          {/* Pill Tab Navigation with sliding indicator */}
          <div className="relative flex items-center bg-blue-300/20 border border-blue-100/30 rounded-full">
            {/* Sliding pill */}
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

          {/* Notification icon */}
          <button className="relative flex items-center justify-center w-8 h-8 rounded-full bg-blue-300/20 border border-blue-100/30 hover:bg-blue-300/30 transition-colors">
            <Bell className="w-4 h-4 text-primary-500" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          {/* User icon */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-300/20 border border-blue-100/30 hover:bg-blue-300/30 transition-colors"
          >
            <User className="w-4 h-4 text-primary-500" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
