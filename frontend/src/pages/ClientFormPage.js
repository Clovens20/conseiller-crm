import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClient, createClient, updateClient } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';

const ClientFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      navigate('/clients');
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
      navigate('/clients');
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
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/clients')}
          className="p-2"
          data-testid="back-btn"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          {isEdit ? 'Modifier le client' : 'Nouveau client'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Info */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom}
                    onChange={(e) => handleChange('prenom', e.target.value)}
                    required
                    data-testid="prenom-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleChange('nom', e.target.value)}
                    required
                    data-testid="nom-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone *</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  placeholder="(514) 555-1234"
                  required
                  data-testid="telephone-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courriel">Courriel</Label>
                <Input
                  id="courriel"
                  type="email"
                  value={formData.courriel}
                  onChange={(e) => handleChange('courriel', e.target.value)}
                  placeholder="client@exemple.com"
                  data-testid="courriel-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input
                  id="adresse"
                  value={formData.adresse}
                  onChange={(e) => handleChange('adresse', e.target.value)}
                  placeholder="123 Rue Principale, Montréal, QC"
                  data-testid="adresse-input"
                />
              </div>
            </CardContent>
          </Card>

          {/* Family & Status */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Situation & Dossier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="conjoint">Nom du conjoint(e)</Label>
                <Input
                  id="conjoint"
                  value={formData.conjoint}
                  onChange={(e) => handleChange('conjoint', e.target.value)}
                  data-testid="conjoint-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nb_enfants">Nombre d'enfants</Label>
                <Input
                  id="nb_enfants"
                  type="number"
                  min="0"
                  value={formData.nb_enfants}
                  onChange={(e) => handleChange('nb_enfants', e.target.value)}
                  data-testid="nb-enfants-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statut">Statut du dossier</Label>
                <Select value={formData.statut} onValueChange={(v) => handleChange('statut', v)}>
                  <SelectTrigger data-testid="statut-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="actif">Client actif</SelectItem>
                    <SelectItem value="suivi">En suivi</SelectItem>
                    <SelectItem value="ferme">Dossier fermé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source du client</Label>
                <Select value={formData.source || ''} onValueChange={(v) => handleChange('source', v)}>
                  <SelectTrigger data-testid="source-select">
                    <SelectValue placeholder="Sélectionner une source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reference">Référence</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="reseautage">Réseautage</SelectItem>
                    <SelectItem value="famille">Famille</SelectItem>
                    <SelectItem value="publicite">Publicité</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Rendez-vous & Suivi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date_rdv">Date et heure du prochain RDV</Label>
                <Input
                  id="date_rdv"
                  type="datetime-local"
                  value={formData.date_rdv}
                  onChange={(e) => handleChange('date_rdv', e.target.value)}
                  data-testid="date-rdv-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_suivi">Date du prochain suivi</Label>
                <Input
                  id="date_suivi"
                  type="date"
                  value={formData.date_suivi}
                  onChange={(e) => handleChange('date_suivi', e.target.value)}
                  data-testid="date-suivi-input"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Notes / Besoins financiers</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                content={formData.notes}
                onChange={(html) => handleChange('notes', html)}
                placeholder="Ajoutez des notes sur les besoins financiers du client..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Submit */}
        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/clients')}
            data-testid="cancel-btn"
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={saving}
            className="bg-slate-900 hover:bg-slate-800"
            data-testid="submit-btn"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? 'Enregistrer' : 'Créer le client'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClientFormPage;
