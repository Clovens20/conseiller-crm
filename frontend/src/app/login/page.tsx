'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Lock, LogIn, UserPlus, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nomComplet, setNomComplet] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Connexion réussie!');
        router.push('/admin');
      } else {
        if (!nomComplet.trim()) {
          toast.error('Le nom complet est requis');
          setLoading(false);
          return;
        }
        const result = await register(email, password, nomComplet);
        if (result?.status === 'pending') {
          toast.info(result.message);
          setIsLogin(true);
        } else {
          toast.success('Compte créé avec succès!');
          router.push('/admin');
        }
      }
    } catch (error: any) {
      const message = error.message || 'Une erreur est survenue';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-black text-white tracking-tight mb-3">
              Planify
            </h1>
            <p className="text-slate-400 text-lg">
              Votre CRM pour la gestion de clients en assurance
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? 'Connexion' : 'Créer un compte'}
              </h2>
              <p className="text-slate-400">
                {isLogin 
                  ? 'Entrez vos identifiants pour accéder à votre espace'
                  : 'Créez votre compte conseiller'
                }
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="nomComplet" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nom complet</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <Input
                      id="nomComplet"
                      type="text"
                      placeholder="Jean Tremblay"
                      value={nomComplet}
                      onChange={(e) => setNomComplet(e.target.value)}
                      className="pl-11 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-12"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Courriel</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="conseiller@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-12"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-12"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg shadow-lg shadow-blue-600/20 transition-all duration-150 active:scale-95 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Chargement...
                  </>
                ) : (
                  <>
                    {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                    {isLogin ? 'Se connecter' : 'Créer mon compte'}
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-slate-700 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setNomComplet('');
                }}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                {isLogin 
                  ? "Pas encore de compte? Créer un compte"
                  : "Déjà un compte? Se connecter"
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div 
        className="hidden lg:flex flex-1 bg-cover bg-center relative"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1721995432582-b0a486848fca?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBhcmNoaXRlY3R1cmUlMjBtaW5pbWFsaXN0JTIwYmx1ZSUyMGFic3RyYWN0fGVufDB8fHx8MTc3Mzg3NzAyOXww&ixlib=rb-4.1.0&q=85)'
        }}
      >
        <div className="absolute inset-0 bg-slate-900/20" />
      </div>
    </div>
  );
};

export default LoginPage;
