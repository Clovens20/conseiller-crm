import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, createOrUpdateProfile } from '@/services/marketingApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Save, Loader2, Building2, Palette, FileText } from 'lucide-react';
import {  useRouter } from 'next/navigation';

const ProfilePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    nom_compagnie: '',
    logo_url: '',
    couleur_primaire: '#1e293b',
    couleur_secondaire: '#0ea5e9',
    message_accueil: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      if (data) {
        setFormData({
          nom_compagnie: data.nom_compagnie || '',
          logo_url: data.logo_url || '',
          couleur_primaire: data.couleur_primaire || '#1e293b',
          couleur_secondaire: data.couleur_secondaire || '#0ea5e9',
          message_accueil: data.message_accueil || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    try {
      await createOrUpdateProfile(formData);
      toast.success('Profil enregistré avec succès!');
    } catch (error) {
      toast.error(`Erreur: ${error.message || 'Impossible d\'enregistrer le profil'}`);
      console.error(error);
    } finally {

      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-64 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          Mon Profil
        </h1>
        <p className="text-slate-400 mt-2">
          Configurez votre profil d'entreprise
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Info */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-slate-700 rounded-lg shrink-0">
                <Building2 className="h-5 w-5 text-slate-300" />
              </div>
              Informations de l'entreprise
            </h2>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="nom_compagnie" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nom de la compagnie</Label>
                <Input
                  id="nom_compagnie"
                  value={formData.nom_compagnie}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom_compagnie: e.target.value }))}
                  placeholder="Ma Compagnie d'Assurance"
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                  data-testid="nom-compagnie-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo_url" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">URL du logo (optionnel)</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                  data-testid="logo-url-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message_accueil" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Message d'accueil par défaut (optionnel)</Label>
                <Textarea
                  id="message_accueil"
                  value={formData.message_accueil}
                  onChange={(e) => setFormData(prev => ({ ...prev, message_accueil: e.target.value }))}
                  placeholder="Bienvenue! Je suis là pour vous aider à atteindre vos objectifs financiers..."
                  rows={4}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 resize-none p-4"
                  data-testid="message-accueil-input"
                />
              </div>
            </div>
          </div>

          {/* Formulaires Link */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-3">
                <div className="p-2 bg-slate-700 rounded-lg shrink-0">
                  <FileText className="h-5 w-5 text-slate-300" />
                </div>
                Mes Formulaires Marketing
              </h2>
              <p className="text-sm text-slate-400 pl-11">
                Créez et gérez vos formulaires de capture de leads
              </p>
            </div>
            <div className="space-y-6 flex-1 flex flex-col justify-center">
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-5 rounded-xl border border-slate-700">
                Vous pouvez maintenant créer plusieurs formulaires marketing personnalisés, 
                chacun avec son propre lien unique et ses propres options.
              </p>
              <button 
                type="button" 
                onClick={() => router.push('/admin/formulaires')}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm border border-slate-600 hover:border-slate-500 transition-all duration-150 active:scale-[0.98]"
                data-testid="go-to-formulaires-btn"
              >
                <FileText className="h-5 w-5" />
                Gérer mes formulaires
              </button>
            </div>
          </div>

          {/* Customization */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-3">
                <div className="p-2 bg-slate-700 rounded-lg shrink-0">
                  <Palette className="h-5 w-5 text-slate-300" />
                </div>
                Couleurs par défaut
              </h2>
              <p className="text-sm text-slate-400 pl-11">
                Ces couleurs seront utilisées par défaut lors de la création de nouveaux formulaires
              </p>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                <div className="space-y-3">
                  <Label htmlFor="couleur_primaire" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Couleur primaire</Label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-slate-700 shadow-inner shrink-0">
                      <input
                        type="color"
                        id="couleur_primaire"
                        value={formData.couleur_primaire}
                        onChange={(e) => setFormData(prev => ({ ...prev, couleur_primaire: e.target.value }))}
                        className="absolute inset-[-10px] w-16 h-16 cursor-pointer"
                      />
                    </div>
                    <Input
                      value={formData.couleur_primaire}
                      onChange={(e) => setFormData(prev => ({ ...prev, couleur_primaire: e.target.value }))}
                      className="flex-1 bg-slate-900 border-slate-700 text-white h-11"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="couleur_secondaire" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Couleur secondaire</Label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-slate-700 shadow-inner shrink-0">
                      <input
                        type="color"
                        id="couleur_secondaire"
                        value={formData.couleur_secondaire}
                        onChange={(e) => setFormData(prev => ({ ...prev, couleur_secondaire: e.target.value }))}
                        className="absolute inset-[-10px] w-16 h-16 cursor-pointer"
                      />
                    </div>
                    <Input
                      value={formData.couleur_secondaire}
                      onChange={(e) => setFormData(prev => ({ ...prev, couleur_secondaire: e.target.value }))}
                      className="flex-1 bg-slate-900 border-slate-700 text-white h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div>
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-3 block">Aperçu</Label>
                <div className="p-6 rounded-xl border border-slate-700 bg-slate-900" style={{ borderTopColor: formData.couleur_primaire, borderTopWidth: '4px' }}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {formData.logo_url ? (
                        <img src={formData.logo_url} alt="Logo" className="h-10 w-auto rounded" />
                      ) : (
                        <div 
                          className="w-10 h-10 rounded-full shadow-inner"
                          style={{ backgroundColor: formData.couleur_primaire }}
                        />
                      )}
                      <span className="font-bold text-lg" style={{ color: formData.couleur_primaire }}>
                        {formData.nom_compagnie || 'Votre Compagnie'}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-xl font-semibold text-white shadow-lg transition-transform active:scale-95 text-sm"
                      style={{ backgroundColor: formData.couleur_secondaire, boxShadow: `0 4px 14px 0 ${formData.couleur_secondaire}40` }}
                    >
                      Exemple de bouton
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all duration-150 active:scale-95 disabled:opacity-50"
            data-testid="save-profile-btn"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Enregistrer le profil
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
