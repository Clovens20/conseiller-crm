import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, createOrUpdateProfile } from '@/services/marketingApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Save, Loader2, Building2, Palette, FileText, Download, Mail, Phone, User, Calendar, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getSiteVisits } from '@/services/marketingApi';
import {  useRouter } from 'next/navigation';

const GuideLeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .like('message', 'GUIDE_DOWNLOAD%')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error('Error fetching guide leads:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500 text-sm italic">
        Aucun téléchargement enregistré pour le moment.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-800/50 border-b border-slate-700">
            <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Visiteur</th>
            <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
            <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 text-xs font-bold">
                    {lead.prenom[0]}{lead.nom[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white leading-tight">{lead.prenom} {lead.nom}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-medium">{lead.ville || 'Québec'}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Mail className="h-3 w-3 opacity-50" /> {lead.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Phone className="h-3 w-3 opacity-50" /> {lead.telephone || 'Non fourni'}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="h-3 w-3 opacity-50" /> 
                  {new Date(lead.created_at).toLocaleDateString('fr-CA')}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ProfilePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [siteVisits, setSiteVisits] = useState(0);
  
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
      const [profileData, visits] = await Promise.all([
        getProfile(),
        getSiteVisits()
      ]);
      
      if (profileData) {
        setFormData({
          nom_compagnie: profileData.nom_compagnie || '',
          logo_url: profileData.logo_url || '',
          couleur_primaire: profileData.couleur_primaire || '#1e293b',
          couleur_secondaire: profileData.couleur_secondaire || '#0ea5e9',
          message_accueil: profileData.message_accueil || ''
        });
      }
      setSiteVisits(visits);
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
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Mon Profil
          </h1>
          <p className="text-slate-400 mt-2">
            Configurez votre profil d'entreprise et suivez vos statistiques
          </p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-lg shadow-blue-500/5">
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <Eye className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Visites Totales</p>
            <p className="text-2xl font-black text-white">{siteVisits.toLocaleString()}</p>
          </div>
        </div>
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

          {/* Export Guide Leads Section */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-3">
                  <div className="p-2 bg-slate-700 rounded-lg shrink-0">
                    <Download className="h-5 w-5 text-slate-300" />
                  </div>
                  Visiteurs du Guide
                </h2>
                <p className="text-sm text-slate-400 pl-11">
                  Liste des personnes ayant débloqué votre guide financier
                </p>
              </div>
              <Button 
                type="button"
                variant="outline"
                size="sm"
                onClick={async () => {
                  const { supabase } = await import('@/lib/supabase');
                  const { data, error } = await supabase
                    .from('prospects')
                    .select('prenom, nom, email, telephone, created_at, message')
                    .like('message', 'GUIDE_DOWNLOAD%');
                  
                  if (error || !data) return;
                  
                  const headers = ['Prénom', 'Nom', 'Email', 'Téléphone', 'Date'];
                  const rows = data.map(p => [p.prenom, p.nom, p.email, p.telephone, new Date(p.created_at).toLocaleDateString('fr-CA')]);
                  const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `leads_guide_${new Date().toISOString().split('T')[0]}.csv`;
                  link.click();
                }}
                className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                <Download className="h-4 w-4 mr-2" /> .CSV
              </Button>
            </div>
            
            <div className="bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden">
              <GuideLeadsList />
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
