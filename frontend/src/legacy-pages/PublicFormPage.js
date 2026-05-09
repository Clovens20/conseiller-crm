import React, { useState, useEffect } from 'react';
import {  useParams } from 'next/navigation';
import { getFormulaireBySlug, createLead, incrementFormVisits } from '@/services/marketingApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, CheckCircle, Send, Globe } from 'lucide-react';
import { getTranslation, languageNames } from '@/utils/translations';

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
        <div className="max-w-md w-full mx-4 bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Formulaire introuvable</h2>
          <p className="text-slate-500">Ce lien de formulaire n'existe pas ou a été désactivé par le conseiller.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0" style={{ backgroundColor: formulaire?.couleur_primaire || '#0f172a', opacity: 0.03 }} />
        <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 text-center relative z-10 animate-fade-in">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            style={{ backgroundColor: formulaire?.couleur_secondaire, boxShadow: `0 10px 25px -5px ${formulaire?.couleur_secondaire}60` }}
          >
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
            {t.success_title}
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            {t.success_message}
          </p>
        </div>
      </div>
    );
  }

  const availableLanguages = formulaire?.langues || ['fr'];
  const besoins = formulaire?.besoins_personnalises || [];
  const companyName = formulaire?.profils?.nom_compagnie || formulaire?.titre || 'Conseiller Financier';
  const logoUrl = formulaire?.logo_url || formulaire?.profils?.logo_url;

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 z-0" style={{ backgroundColor: formulaire?.couleur_primaire || '#0f172a', opacity: 0.05 }} />
      <div className="absolute top-0 w-full h-96 bg-gradient-to-b from-white/60 to-transparent z-0" />
      
      <div className="max-w-2xl w-full mx-auto relative z-10">
        {/* Language selector - only show if multiple languages */}
        {availableLanguages.length > 1 && (
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md rounded-xl p-1.5 shadow-sm border border-white/50">
              <Globe className="h-4 w-4 text-slate-400 ml-2 mr-1" />
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLangue(lang)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                    langue === lang 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {languageNames[lang] || lang}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-10">
          {logoUrl && (
            <div className="inline-block p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 mb-6">
              <img 
                src={logoUrl} 
                alt={companyName}
                className="h-16 object-contain"
              />
            </div>
          )}
          <h1 
            className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
            style={{ color: formulaire?.couleur_primaire || '#0f172a' }}
          >
            {(langue === 'fr' ? formulaire?.titre : (formulaire?.[`titre_${langue}`] || formulaire?.titre)) || companyName}
          </h1>
          {(() => {
            const msg = langue === 'fr' ? formulaire?.message_accueil : (formulaire?.[`message_accueil_${langue}`] || formulaire?.message_accueil);
            if (!msg) return null;
            return (
              <div 
                className="mt-6 text-slate-600 text-lg leading-relaxed max-w-lg mx-auto prose prose-slate text-center"
                dangerouslySetInnerHTML={{ __html: msg }}
              />
            );
          })()}
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/60 mb-8">
          <div className="px-8 py-6 bg-white/50 border-b border-slate-100" style={{ borderTop: `4px solid ${formulaire?.couleur_secondaire || '#3b82f6'}` }}>
            <h2 className="text-2xl font-bold text-slate-900">{t.form_title}</h2>
            <p className="text-slate-500 mt-1">{t.form_subtitle}</p>
          </div>
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Nom complet */}
              <div className="space-y-2">
                <Label htmlFor="nom_complet" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.nom_complet} *</Label>
                <Input
                  id="nom_complet"
                  value={formData.nom_complet}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom_complet: e.target.value }))}
                  placeholder={t.nom_complet_placeholder}
                  required
                  className="bg-white/80 border-slate-200 h-12 text-lg focus-visible:ring-2 transition-shadow"
                  style={{ '--tw-ring-color': formulaire?.couleur_secondaire }}
                  data-testid="form-nom-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    onBlur={handlePartialCapture}
                    placeholder={t.email_placeholder}
                    className="bg-white/80 border-slate-200 h-12 text-lg focus-visible:ring-2 transition-shadow"
                    style={{ '--tw-ring-color': formulaire?.couleur_secondaire }}
                    data-testid="form-email-input"
                  />
                </div>

                {/* Telephone */}
                <div className="space-y-2">
                  <Label htmlFor="telephone" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.telephone} *</Label>
                  <Input
                    id="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                    placeholder={t.telephone_placeholder}
                    required
                    className="bg-white/80 border-slate-200 h-12 text-lg focus-visible:ring-2 transition-shadow"
                    style={{ '--tw-ring-color': formulaire?.couleur_secondaire }}
                    data-testid="form-telephone-input"
                  />
                </div>
              </div>

              {/* Besoins - Custom from formulaire */}
              {besoins.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div>
                    <Label className="text-sm font-bold text-slate-800">{t.besoins}</Label>
                    <p className="text-sm text-slate-500">{t.besoins_subtitle}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {besoins.map((besoin, index) => {
                      const label = getBesoinLabel(besoin);
                      if (!label) return null;
                      const isChecked = formData.besoins.includes(label);
                      return (
                        <div 
                          key={besoin.id || index} 
                          className={`flex items-start space-x-3 p-4 rounded-xl border transition-colors cursor-pointer ${isChecked ? 'bg-blue-50/50 border-blue-200' : 'bg-white/60 border-slate-200 hover:bg-white/80'}`}
                          style={isChecked ? { backgroundColor: `${formulaire?.couleur_secondaire}15`, borderColor: `${formulaire?.couleur_secondaire}50` } : {}}
                          onClick={() => handleBesoinChange(label, !isChecked)}
                        >
                          <Checkbox
                            id={`besoin-${besoin.id || index}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => handleBesoinChange(label, checked)}
                            className="mt-0.5"
                            style={isChecked ? { backgroundColor: formulaire?.couleur_secondaire, borderColor: formulaire?.couleur_secondaire } : {}}
                            data-testid={`besoin-${index}`}
                          />
                          <label
                            htmlFor={`besoin-${besoin.id || index}`}
                            className={`text-sm font-medium leading-tight cursor-pointer ${isChecked ? 'text-slate-900' : 'text-slate-600'}`}
                            onClick={(e) => e.preventDefault()}
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
              <div className="space-y-2 pt-2">
                <Label htmlFor="details" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t.details}</Label>
                <Textarea
                  id="details"
                  value={formData.details}
                  onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                  placeholder={t.details_placeholder}
                  rows={4}
                  className="bg-white/80 border-slate-200 resize-none p-4 text-base focus-visible:ring-2 transition-shadow"
                  style={{ '--tw-ring-color': formulaire?.couleur_secondaire }}
                  data-testid="form-details-input"
                />
              </div>

              {/* Devenir Conseiller */}
              <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/60 shadow-inner">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    id="devenir-conseiller"
                    checked={formData.veut_devenir_conseiller}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, veut_devenir_conseiller: checked }))}
                    className="mt-1 border-amber-400 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 w-5 h-5"
                    data-testid="devenir-conseiller-checkbox"
                  />
                  <div>
                    <label
                      htmlFor="devenir-conseiller"
                      className="text-base font-bold text-amber-900 cursor-pointer block mb-1"
                    >
                      {t.devenir_conseiller}
                    </label>
                    <p className="text-sm text-amber-800/80 leading-relaxed">
                      {t.devenir_conseiller_description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-lg shadow-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-70 mt-4"
                style={{ 
                  backgroundColor: formulaire?.couleur_secondaire || '#3b82f6',
                  boxShadow: `0 10px 25px -5px ${formulaire?.couleur_secondaire || '#3b82f6'}60`
                }}
                data-testid="form-submit-btn"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-6 w-6" />
                    {t.submit}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm font-medium text-slate-400/80 mb-8">
          Propulsé par <span className="font-bold text-slate-400">Planify CRM</span>
        </p>
      </div>
    </div>
  );
};

export default PublicFormPage;
