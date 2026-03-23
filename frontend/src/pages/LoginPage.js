import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { Mail, Lock, LogIn, UserPlus, User } from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomComplet, setNomComplet] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Connexion réussie!');
      } else {
        if (!nomComplet.trim()) {
          toast.error('Le nom complet est requis');
          setLoading(false);
          return;
        }
        const result = await register(email, password, nomComplet);
        if (result?.status === 'pending') {
          toast.info(result.message);
          setIsLogin(true); // Switch back to login for them to sign in after confirmation
        } else {
          toast.success('Compte créé avec succès!');
        }
      }
    } catch (error) {
      const message = error.message || 'Une erreur est survenue';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Planify
            </h1>
            <p className="text-slate-500">
              Votre CRM pour la gestion de clients en assurance
            </p>
          </div>

          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold">
                {isLogin ? 'Connexion' : 'Créer un compte'}
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? 'Entrez vos identifiants pour accéder à votre espace'
                  : 'Créez votre compte conseiller'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="nomComplet" className="text-slate-700">Nom complet</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="nomComplet"
                        type="text"
                        placeholder="Jean Tremblay"
                        value={nomComplet}
                        onChange={(e) => setNomComplet(e.target.value)}
                        className="pl-10"
                        required={!isLogin}
                        data-testid="register-name-input"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">Courriel</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="conseiller@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      data-testid="login-email-input"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                      data-testid="login-password-input"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-slate-900 hover:bg-slate-800"
                  disabled={loading}
                  data-testid="login-submit-btn"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Chargement...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {isLogin ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                      {isLogin ? 'Se connecter' : 'Créer mon compte'}
                    </span>
                  )}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setNomComplet('');
                  }}
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  data-testid="toggle-auth-mode-btn"
                >
                  {isLogin 
                    ? "Pas encore de compte? Créer un compte"
                    : "Déjà un compte? Se connecter"
                  }
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Image */}
      <div 
        className="hidden lg:flex flex-1 bg-cover bg-center relative"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1721995432582-b0a486848fca?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBhcmNoaXRlY3R1cmUlMjBtaW5pbWFsaXN0JTIwYmx1ZSUyMGFic3RyYWN0fGVufDB8fHx8MTc3Mzg3NzAyOXww&ixlib=rb-4.1.0&q=85)'
        }}
      >
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Gérez vos clients efficacement
          </h2>
          <p className="text-xl text-white/80 max-w-md">
            Suivez vos rendez-vous, gérez vos prospects et développez votre portefeuille client.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
