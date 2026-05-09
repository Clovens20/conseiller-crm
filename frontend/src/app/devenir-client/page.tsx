'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DevenirClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      type: 'client',
      prenom: formData.get('prenom') as string,
      nom: formData.get('nom') as string,
      email: formData.get('email') as string,
      telephone: formData.get('telephone') as string,
      ville: formData.get('ville') as string,
      type_assurance: formData.get('type_assurance') as string,
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
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-black text-white mb-4">Demande envoyée!</h1>
          <p className="text-slate-400">
            Merci pour votre intérêt. Un conseiller vous contactera sous peu.
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
          <h1 className="text-4xl md:text-5xl font-black mb-4">Devenir Client</h1>
          <p className="text-slate-400 text-lg">
            Remplissez ce formulaire et l'un de nos experts vous contactera pour analyser vos besoins.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Prénom *</label>
              <input
                required
                name="prenom"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Ex: Jean"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Nom *</label>
              <input
                required
                name="nom"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Ex: Tremblay"
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
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="jean.tremblay@email.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Téléphone *</label>
              <input
                required
                type="tel"
                name="telephone"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Ex: Montréal, QC"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Type d'assurance souhaité</label>
              <select
                name="type_assurance"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="Vie">Vie</option>
                <option value="Auto">Auto</option>
                <option value="Habitation">Habitation</option>
                <option value="Santé">Santé</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-300">Message (optionnel)</label>
            <textarea
              name="message"
              rows={4}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Dites-nous en plus sur vos besoins..."
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
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-800 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-95"
          >
            {loading ? 'Envoi en cours...' : 'Soumettre ma demande →'}
          </button>
        </form>
      </div>
    </div>
  );
}
