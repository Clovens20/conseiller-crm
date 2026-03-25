import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFormulaireBySlug, createLead, incrementFormVisits } from '../services/marketingApi';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { toast } from 'sonner';
import { Loader2, CheckCircle, Send, Globe } from 'lucide-react';
import { getTranslation, languageNames } from '../utils/translations';

const PublicFormPage = () => {
  const { slug } = useParams();
  const [formulaire, setFormulaire] = useState(null);
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
    details: '',
    veut_devenir_conseiller: false
  });

  useEffect(() => {
    loadFormulaire();
    
    // Analytics gathering
    const searchParams = new URLSearchParams(window.location.search);
    const analyticsData = {
      referrer: document.referrer,
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
      device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
    };
    
    incrementFormVisits(slug, analyticsData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);



  useEffect(() => {
    setT(getTranslation(langue));
    setFormData(prev => ({ ...prev, besoins: [] }));
  }, [langue]);

  const loadFormulaire = async () => {
    try {
      const data = await getFormulaireBySlug(slug);
      setFormulaire(data);
      const defaultLang = data.langues?.[0] || 'fr';
      setLangue(defaultLang);
      setT(getTranslation(defaultLang));
    } catch (err) {
      setError('Formulaire non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const handlePartialCapture = async () => {
    if (!formData.email && !formData.nom_complet) return;
    
    // Only capture if email looks valid or name is present
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) return;

    const searchParams = new URLSearchParams(window.location.search);
    try {
      await createLead({
        nom_complet: formData.nom_complet || 'Capturé partiellement',
        email: formData.email || null,
        telephone: formData.telephone || null,
        langue: langue,
        veut_devenir_conseiller: formData.veut_devenir_conseiller,
        utm_source: searchParams.get('utm_source'),
        referrer: document.referrer
      }, slug, true);
    } catch (err) {
      // Don't toast for partial capture errors to avoid annoying user
      console.error('Erreur partial capture:', err);
    }
  };

  const handleBesoinChange = (besoin, checked) => {
    setFormData(prev => ({
      ...prev,
      besoins: checked 
        ? [...prev.besoins, besoin]
        : prev.besoins.filter(b => b !== besoin)
    }));
  };

  const getBesoinLabel = (besoin) => {
    const langKey = `label_${langue}`;
    return besoin[langKey] || besoin.label_fr || '';
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
    const searchParams = new URLSearchParams(window.location.search);
    try {
      await createLead({
        nom_complet: formData.nom_complet,
        email: formData.email || null,
        telephone: formData.telephone,
        besoins: formData.besoins,
        details: formData.details || null,
        langue: langue,
        veut_devenir_conseiller: formData.veut_devenir_conseiller,
        utm_source: searchParams.get('utm_source'),
        referrer: document.referrer
      }, slug, false); // isPartial = false for final submission
      
      setSubmitted(true);
    } catch (err) {
      console.error('Erreur submission lead:', err);
      toast.error(err.message || t.error_message);
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
            <p className="text-slate-500">Ce lien de formulaire n'existe pas ou a été désactivé.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: formulaire?.couleur_primaire + '10' }}
      >
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: formulaire?.couleur_secondaire + '20' }}
            >
              <CheckCircle 
                className="h-8 w-8" 
                style={{ color: formulaire?.couleur_secondaire }}
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

  const availableLanguages = formulaire?.langues || ['fr'];
  const besoins = formulaire?.besoins_personnalises || [];
  const companyName = formulaire?.conseiller_profiles?.nom_compagnie || formulaire?.titre || 'Conseiller Financier';
  const logoUrl = formulaire?.logo_url || formulaire?.conseiller_profiles?.logo_url;

  return (
    <div 
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: formulaire?.couleur_primaire + '08' }}
    >
      <div className="max-w-xl mx-auto">
        {/* Language selector - only show if multiple languages */}
        {availableLanguages.length > 1 && (
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
              <Globe className="h-4 w-4 text-slate-400 ml-2" />
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLangue(lang)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    langue === lang 
                      ? 'bg-slate-900 text-white' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {languageNames[lang] || lang}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt={companyName}
              className="h-16 mx-auto mb-4 object-contain"
            />
          )}
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: formulaire?.couleur_primaire }}
          >
            {(langue === 'fr' ? formulaire?.titre : (formulaire?.[`titre_${langue}`] || formulaire?.titre)) || companyName}
          </h1>
          {(() => {
            const msg = langue === 'fr' ? formulaire?.message_accueil : (formulaire?.[`message_accueil_${langue}`] || formulaire?.message_accueil);
            if (!msg) return null;
            return (
              <div 
                className="mt-4 text-slate-600 max-w-md mx-auto prose prose-sm text-center"
                dangerouslySetInnerHTML={{ __html: msg }}
              />
            );
          })()}
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader style={{ borderBottom: `3px solid ${formulaire?.couleur_secondaire}` }}>
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
                  onBlur={handlePartialCapture}
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

              {/* Besoins - Custom from formulaire */}
              {besoins.length > 0 && (
                <div className="space-y-3">
                  <Label>{t.besoins}</Label>
                  <p className="text-sm text-slate-500">{t.besoins_subtitle}</p>
                  <div className="space-y-3">
                    {besoins.map((besoin, index) => {
                      const label = getBesoinLabel(besoin);
                      if (!label) return null;
                      return (
                        <div key={besoin.id || index} className="flex items-center space-x-3">
                          <Checkbox
                            id={`besoin-${besoin.id || index}`}
                            checked={formData.besoins.includes(label)}
                            onCheckedChange={(checked) => handleBesoinChange(label, checked)}
                            data-testid={`besoin-${index}`}
                          />
                          <label
                            htmlFor={`besoin-${besoin.id || index}`}
                            className="text-sm text-slate-700 cursor-pointer"
                          >
                            {label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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

              {/* Devenir Conseiller */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="devenir-conseiller"
                    checked={formData.veut_devenir_conseiller}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, veut_devenir_conseiller: checked }))}
                    className="mt-1"
                    data-testid="devenir-conseiller-checkbox"
                  />
                  <div>
                    <label
                      htmlFor="devenir-conseiller"
                      className="text-sm font-medium text-amber-900 cursor-pointer"
                    >
                      {t.devenir_conseiller}
                    </label>
                    <p className="text-xs text-amber-700 mt-1">
                      {t.devenir_conseiller_description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full"
                style={{ backgroundColor: formulaire?.couleur_secondaire }}
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
