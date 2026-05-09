'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DevenirRepresentantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasExperience, setHasExperience] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      type: 'representant',
      prenom: formData.get('prenom') as string,
      nom: formData.get('nom') as string,
      email: formData.get('email') as string,
      telephone: formData.get('telephone') as string,
      ville: formData.get('ville') as string,
      experience_assurance: formData.get('experience_assurance') === 'true',
      annees_experience: formData.get('annees_experience') ? parseInt(formData.get('annees_experience') as string) : 0,
      permis_amf: formData.get('permis_amf') as string,
      message: formData.get('message') as string,
      statut: 'nouveau',
    };

    try {
      const { error: supabaseError } = await supabase
        .from('prospects')
        .insert([data]);

      if (supabaseError) throw supabaseError;

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError('Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-xl">
          <div className="text-6xl mb-6">🚀</div>
          <h1 className="text-3xl font-black text-white mb-4">Candidature reçue!</h1>
          <p className="text-slate-400">
            Merci pour votre intérêt. Notre équipe de recrutement examinera votre profil et vous contactera rapidement.
            Redirection vers l'accueil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 text-center">
          <a href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition">
            ← Retour à l'accueil
          </a>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Devenir Représentant</h1>
          <p className="text-slate-400 text-lg">
            Rejoignez une équipe dynamique et développez votre carrière dans le domaine de l'assurance.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Prénom *</label>
              <input
                required
                name="prenom"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="Ex: Sophie"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Nom *</label>
              <input
                required
                name="nom"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="Ex: Roy"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Email *</label>
              <input
                required
                type="email"
                name="email"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="sophie.roy@email.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Téléphone *</label>
              <input
                required
                type="tel"
                name="telephone"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="(514) 000-0000"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Ville/Province *</label>
              <input
                required
                name="ville"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="Ex: Québec, QC"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Permis AMF? *</label>
              <select
                required
                name="permis_amf"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              >
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
                <option value="En cours">En cours</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Expérience en assurance? *</label>
              <div className="flex gap-4 p-1 bg-slate-800 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setHasExperience(true)}
                  className={`flex-1 py-2 rounded-lg font-bold transition ${hasExperience ? 'bg-purple-500 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                >
                  Oui
                </button>
                <button
                  type="button"
                  onClick={() => setHasExperience(false)}
                  className={`flex-1 py-2 rounded-lg font-bold transition ${!hasExperience ? 'bg-purple-500 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                >
                  Non
                </button>
                <input type="hidden" name="experience_assurance" value={hasExperience.toString()} />
              </div>
            </div>
            {hasExperience && (
              <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
                <label className="text-sm font-bold text-slate-300">Années d'expérience *</label>
                <input
                  required
                  type="number"
                  name="annees_experience"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  placeholder="0"
                  min="0"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">Message de motivation (optionnel)</label>
            <textarea
              name="message"
              rows={4}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="Parlez-nous de votre parcours et de vos ambitions..."
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-400 disabled:bg-purple-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            {loading ? 'Envoi en cours...' : 'Soumettre ma candidature →'}
          </button>
        </form>
      </div>
    </div>
  );
}
