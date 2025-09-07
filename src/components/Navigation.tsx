import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calculator, History, LogOut } from 'lucide-react';
import wuruLogo from '@/assets/wuru-logo.png';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Nueva Cotización',
      path: '/dashboard',
      icon: Calculator,
    },
    {
      label: 'Historial',
      path: '/history', 
      icon: History,
    }
  ];

  return (
    <nav className="bg-gradient-card border-b border-border/50 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo and brand */}
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-center">
              <img 
                src="/lovable-uploads/2857fddf-784a-4c63-b49e-7205c6dd014c.png" 
                alt="Hospital Angeles Logo" 
                className="h-8 w-8 object-contain"
              />
              <p className="text-xs text-muted-foreground">Powered by Wúru</p>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                Cotizador Quirúrgico
              </h1>
            </div>
          </div>

          {/* Navigation items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "medical" : "ghost"}
                  onClick={() => navigate(item.path)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}
            
            {/* Logout button */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center space-x-2 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;