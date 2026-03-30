import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { resolveClientByEmail } from '@/data/clients';
import { saveActiveClient } from '@/hooks/useClient';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const client = resolveClientByEmail(email);

    if (
      client &&
      email.toLowerCase() === client.credentials.email &&
      password === client.credentials.password
    ) {
      saveActiveClient(client.id);
      const link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
      if (link) link.href = client.favicon;
      toast({
        title: 'Acceso autorizado',
        description: 'Bienvenido al Cotizador Quirúrgico Wúru',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Error de acceso',
        description: 'Correo o contraseña incorrectos',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        {/* Login Card */}
        <Card>
          <CardHeader className="p-4 sm:p-6 pb-2 text-center">
            <div className="flex flex-col items-center gap-3">
              <img
                src="/logos/cotizador-logo.png"
                alt="Cotizador Quirúrgico"
                className="h-16 sm:h-20 object-contain"
              />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-primary-500 uppercase tracking-wide">
                  Cotizador Quirúrgico
                </h1>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Sistema inteligente de cotización
                </p>
              </div>
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
                  onChange={handleEmailChange}
                  className="bg-blue-300/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="bg-blue-300/20 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
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
              <p className="text-xs mt-1">SSO Credencializa</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
