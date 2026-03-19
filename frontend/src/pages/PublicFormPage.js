import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProfileBySlug, createLead } from '../services/marketingApi';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { toast } from 'sonner';
import { Loader2, CheckCircle, Send } from 'lucide-react';
import { getTranslation } from '../utils/translations';

const PublicFormPage = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [langue, setLangue] = useState('fr');
  const [t, setT] = useState(getTranslation('fr'));
  
  const [formData, setFormData] = useState({
    nom_complet: '',
    email: '',
    telephone: '',
    besoins: [],
    details: ''
  });

  const besoinKeys = [
    'analyse_financiere',
    'epargne',
    'assurance_vie',
    'liberte_financiere',
    'ree_enfants',
    'retour_impot',
    'autre'
  ];

  useEffect(() => {
    loadProfile();
  }, [slug]);

  useEffect(() => {
    // Update translations when language changes
    setT(getTranslation(langue));
    // Reset besoins when language changes to avoid mismatched labels
    setFormData(prev => ({ ...prev, besoins: [] }));
  }, [langue]);

  const loadProfile = async () => {
    try {
      const data = await getProfileBySlug(slug);
      setProfile(data);
      const profileLangue = data.langue_defaut || 'fr';
      setLangue(profileLangue);
      setT(getTranslation(profileLangue));
    } catch (err) {
      setError('Formulaire non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const handleBesoinChange = (besoinKey, checked) => {
    const besoinLabel = t.besoins_options[besoinKey];
    setFormData(prev => ({
      ...prev,
      besoins: checked 
        ? [...prev.besoins, besoinLabel]
        : prev.besoins.filter(b => b !== besoinLabel)
    }));
  };

  const isBesoinChecked = (besoinKey) => {
    return formData.besoins.includes(t.besoins_options[besoinKey]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nom_complet.trim()) {
      toast.error(t.required);
      return;
    }
    if (!formData.telephone.trim()) {
      toast.error(t.required);
      return;
    }

    setSubmitting(true);
    try {
      await createLead({
        nom_complet: formData.nom_complet,
        email: formData.email || null,
        telephone: formData.telephone,
        besoins: formData.besoins,
        details: formData.details || null,
        langue: langue
      }, slug);
      
      setSubmitted(true);
    } catch (err) {
      toast.error(t.error_message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Formulaire non trouvé</h2>
            <p className="text-slate-500">Ce lien de formulaire n'existe pas ou a été supprimé.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: profile?.couleur_primaire + '10' }}
      >
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: profile?.couleur_secondaire + '20' }}
            >
              <CheckCircle 
                className="h-8 w-8" 
                style={{ color: profile?.couleur_secondaire }}
              />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {t.success_title}
            </h2>
            <p className="text-slate-600">
              {t.success_message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: profile?.couleur_primaire + '08' }}
    >
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {profile?.logo_url && (
            <img 
              src={profile.logo_url} 
              alt={profile.nom_compagnie}
              className="h-16 mx-auto mb-4 object-contain"
            />
          )}
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: profile?.couleur_primaire }}
          >
            {profile?.nom_compagnie || 'Conseiller Financier'}
          </h1>
          {profile?.message_accueil && (
            <p className="text-slate-600 max-w-md mx-auto">
              {profile.message_accueil}
            </p>
          )}
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader style={{ borderBottom: `3px solid ${profile?.couleur_secondaire}` }}>
            <CardTitle>{t.form_title}</CardTitle>
            <CardDescription>{t.form_subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom complet */}
              <div className="space-y-2">
                <Label htmlFor="nom_complet">{t.nom_complet} *</Label>
                <Input
                  id="nom_complet"
                  value={formData.nom_complet}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom_complet: e.target.value }))}
                  placeholder={t.nom_complet_placeholder}
                  required
                  data-testid="form-nom-input"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder={t.email_placeholder}
                  data-testid="form-email-input"
                />
              </div>

              {/* Telephone */}
              <div className="space-y-2">
                <Label htmlFor="telephone">{t.telephone} *</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                  placeholder={t.telephone_placeholder}
                  required
                  data-testid="form-telephone-input"
                />
              </div>

              {/* Besoins */}
              <div className="space-y-3">
                <Label>{t.besoins}</Label>
                <p className="text-sm text-slate-500">{t.besoins_subtitle}</p>
                <div className="space-y-3">
                  {besoinKeys.map((key) => (
                    <div key={key} className="flex items-center space-x-3">
                      <Checkbox
                        id={`besoin-${key}`}
                        checked={isBesoinChecked(key)}
                        onCheckedChange={(checked) => handleBesoinChange(key, checked)}
                        data-testid={`besoin-${key}`}
                      />
                      <label
                        htmlFor={`besoin-${key}`}
                        className="text-sm text-slate-700 cursor-pointer"
                      >
                        {t.besoins_options[key]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <Label htmlFor="details">{t.details}</Label>
                <Textarea
                  id="details"
                  value={formData.details}
                  onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                  placeholder={t.details_placeholder}
                  rows={4}
                  data-testid="form-details-input"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full"
                style={{ backgroundColor: profile?.couleur_secondaire }}
                data-testid="form-submit-btn"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Envoi...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    {t.submit}
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Propulsé par Planify
        </p>
      </div>
    </div>
  );
};

export default PublicFormPage;
