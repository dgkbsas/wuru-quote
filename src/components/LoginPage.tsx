import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import haLogo from '@/assets/ha-logo.png';
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
        title: 'Acceso autorizado',
        description: 'Bienvenido al Cotizador Quirúrgico Wúru',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Error de acceso',
        description: 'Por favor ingrese credenciales válidas',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        {/* Logo */}
        <div className="text-center">
          <img
            src={haLogo}
            alt="Hospital Angeles Health System"
            className="h-12 sm:h-16 mx-auto object-contain"
          />
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="space-y-2 p-4 sm:p-6 pb-2 text-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-500">
                Cotizador Quirúrgico
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Sistema inteligente de cotización
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-4">
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="medico@hospital.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-blue-300/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-blue-300/20"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                className="w-full py-3 sm:py-4 text-base sm:text-lg min-h-[48px] touch-manipulation"
                disabled={isLoading}
              >
                {isLoading ? 'Accediendo...' : 'Ingresar'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p className="text-xs mt-1">SSO Credencializa</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default LoginPage;
