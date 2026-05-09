import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getClient, createClient, updateClient } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';

const ClientFormPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id || (params.slug && params.slug[2] === 'edit' ? params.slug[1] : null);
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    courriel: '',
    adresse: '',
    conjoint: '',
    nb_enfants: 0,
    statut: 'prospect',
    date_rdv: '',
    date_suivi: '',
    notes: '',
    source: ''
  });

  useEffect(() => {
    if (isEdit) {
      loadClient();
    }
  }, [id]);

  const loadClient = async () => {
    try {
      const data = await getClient(id);
      setFormData({
        prenom: data.prenom || '',
        nom: data.nom || '',
        telephone: data.telephone || '',
        courriel: data.courriel || '',
        adresse: data.adresse || '',
        conjoint: data.conjoint || '',
        nb_enfants: data.nb_enfants || 0,
        statut: data.statut || 'prospect',
        date_rdv: data.date_rdv ? data.date_rdv.slice(0, 16) : '',
        date_suivi: data.date_suivi ? data.date_suivi.slice(0, 10) : '',
        notes: data.notes || '',
        source: data.source || ''
      });
    } catch (error) {
      toast.error('Client non trouvé');
      router.push('/admin/clients');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.prenom.trim() || !formData.nom.trim()) {
      toast.error('Le prénom et le nom sont requis');
      return;
    }
    if (!formData.telephone.trim()) {
      toast.error('Le téléphone est requis');
      return;
    }

    setSaving(true);
    
    try {
      const submitData = {
        ...formData,
        nb_enfants: parseInt(formData.nb_enfants) || 0,
        date_rdv: formData.date_rdv || null,
        date_suivi: formData.date_suivi || null,
        courriel: formData.courriel || null,
        adresse: formData.adresse || null,
        conjoint: formData.conjoint || null,
        notes: formData.notes || null,
        source: formData.source || null
      };

      if (isEdit) {
        await updateClient(id, submitData);
        toast.success('Client modifié avec succès');
      } else {
        await createClient(submitData);
        toast.success('Client créé avec succès');
      }
      router.push('/admin/clients');
    } catch (error) {
      const message = error.response?.data?.detail || 'Une erreur est survenue';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-slate-200 rounded mb-6" />
          <div className="h-96 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.push('/admin/clients')}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-150 border border-slate-700"
          data-testid="back-btn"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          {isEdit ? 'Modifier le client' : 'Nouveau client'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Informations personnelles</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleChange('prenom', e.target.value)}
                    required
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                    data-testid="prenom-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleChange('nom', e.target.value)}
                    required
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                    data-testid="nom-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Téléphone *</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  placeholder="(514) 555-1234"
                  required
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                  data-testid="telephone-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courriel" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Courriel</Label>
                <Input
                  id="courriel"
                  type="email"
                  value={formData.courriel}
                  onChange={(e) => handleChange('courriel', e.target.value)}
                  placeholder="client@exemple.com"
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                  data-testid="courriel-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresse" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Adresse</Label>
                <Input
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => handleChange('adresse', e.target.value)}
                  placeholder="123 Rue Principale, Montréal, QC"
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                  data-testid="adresse-input"
                />
              </div>
            </div>
          </div>

          {/* Family & Status */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Situation & Dossier</h2>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="conjoint" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nom du conjoint(e)</Label>
                <Input
                  id="conjoint"
                  value={formData.conjoint}
                  onChange={(e) => handleChange('conjoint', e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                  data-testid="conjoint-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nb_enfants" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nombre d'enfants</Label>
                <Input
                  id="nb_enfants"
                  type="number"
                  min="0"
                  value={formData.nb_enfants}
                  onChange={(e) => handleChange('nb_enfants', e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                  data-testid="nb-enfants-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statut" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Statut du dossier</Label>
                <select
                  id="statut"
                  value={formData.statut}
                  onChange={(e) => handleChange('statut', e.target.value)}
                  className="w-full h-11 px-3 py-2 border border-slate-700 rounded-md text-sm bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  data-testid="statut-select"
                >
                  <option value="prospect">Prospect</option>
                  <option value="actif">Client actif</option>
                  <option value="suivi">En suivi</option>
                  <option value="ferme">Dossier fermé</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Source du client</Label>
                <select
                  id="source"
                  value={formData.source || ''}
                  onChange={(e) => handleChange('source', e.target.value)}
                  className="w-full h-11 px-3 py-2 border border-slate-700 rounded-md text-sm bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  data-testid="source-select"
                >
                  <option value="" disabled>Sélectionner une source</option>
                  <option value="reference">Référence</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="reseautage">Réseautage</option>
                  <option value="famille">Famille</option>
                  <option value="publicite">Publicité</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Rendez-vous & Suivi</h2>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="date_rdv" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Date et heure du prochain RDV</Label>
                <Input
                  id="date_rdv"
                  type="datetime-local"
                  value={formData.date_rdv}
                  onChange={(e) => handleChange('date_rdv', e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                  style={{ colorScheme: 'dark' }}
                  data-testid="date-rdv-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_suivi" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Date du prochain suivi</Label>
                <Input
                  id="date_suivi"
                  type="date"
                  value={formData.date_suivi}
                  onChange={(e) => handleChange('date_suivi', e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                  style={{ colorScheme: 'dark' }}
                  data-testid="date-suivi-input"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Notes / Besoins financiers</h2>
            <div className="bg-slate-900/50 rounded-xl border border-slate-700 shadow-inner">
              <RichTextEditor
                content={formData.notes}
                onChange={(html) => handleChange('notes', html)}
                placeholder="Ajoutez des notes sur les besoins financiers du client..."
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin/clients')}
            className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium text-sm transition-all duration-150"
            data-testid="cancel-btn"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all duration-150 active:scale-95 disabled:opacity-50"
            data-testid="submit-btn"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEdit ? 'Enregistrer' : 'Créer le client'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientFormPage;
