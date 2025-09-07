import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import wuruLogo from '@/assets/wuru-logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      toast({
        title: "Acceso autorizado",
        description: "Bienvenido al Cotizador Quirúrgico Wúru",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Error de acceso",
        description: "Por favor ingrese credenciales válidas",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wuru-bg-primary to-wuru-bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and branding */}
        <div className="text-center space-y-4">
          <img 
            src="/lovable-uploads/2857fddf-784a-4c63-b49e-7205c6dd014c.png" 
            alt="Hospital Angeles Logo" 
            className="h-20 mx-auto object-contain"
          />
          <p className="text-xs text-muted-foreground mt-2">Powered by Wúru</p>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Cotizador Quirúrgico
            </h1>
            <p className="text-muted-foreground mt-2">
              Sistema inteligente de cotización
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-gradient-card border-border/50 shadow-card backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">
              Iniciar Sesión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="medico@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-wuru-bg-tertiary border-border/50 focus:ring-wuru-purple"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-wuru-bg-tertiary border-border/50 focus:ring-wuru-purple"
                  required
                />
              </div>

              <Button 
                type="submit" 
                variant="hero"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Accediendo...' : 'Ingresar'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p className="text-xs mt-1">Credencializa • Sistema Wúru</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;