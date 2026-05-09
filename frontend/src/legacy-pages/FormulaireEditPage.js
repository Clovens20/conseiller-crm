import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getFormulaire, createFormulaire, updateFormulaire, checkFormulaireSlugAvailable } from '@/services/marketingApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2, Plus, Trash2, GripVertical, Copy, Check, ImageOff } from 'lucide-react';
import { languageNames } from '@/utils/translations';
import RichTextEditor from '@/components/RichTextEditor';

const defaultBesoins = [
  { id: '1', label_fr: "Besoin d'une analyse financière", label_en: "Need a financial analysis", label_es: "Necesito un análisis financiero", label_ht: "Bezwen yon analiz finansye" },
  { id: '2', label_fr: "Besoin de savoir comment épargner", label_en: "Need to know how to save", label_es: "Necesito saber cómo ahorrar", label_ht: "Bezwen konnen kijan pou m ekonomize" },
  { id: '3', label_fr: "Besoin d'assurance vie", label_en: "Need life insurance", label_es: "Necesito seguro de vida", label_ht: "Bezwen asirans vi" },
  { id: '4', label_fr: "Besoin d'une méthode pour la liberté financière", label_en: "Need a method for financial freedom", label_es: "Necesito un método para la libertad financiera", label_ht: "Bezwen yon metòd pou libète finansye" },
  { id: '5', label_fr: "Besoin d'un compte REE pour mes enfants", label_en: "Need an RESP for my children", label_es: "Necesito una cuenta RESP para mis hijos", label_ht: "Bezwen yon kont REE pou timoun mwen yo" },
  { id: '6', label_fr: "Veux maximiser mon retour d'impôt", label_en: "Want to maximize my tax return", label_es: "Quiero maximizar mi devolución de impuestos", label_ht: "Vle maksimize ranbousman taks mwen" },
  { id: '7', label_fr: "Autre", label_en: "Other", label_es: "Otro", label_ht: "Lòt" },
];

const FormulaireEditPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(true);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!formData.slug) return;
    const fullUrl = `${window.location.origin}/f/${formData.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success('Lien copié !');
    setTimeout(() => setCopied(false), 2000);
  };

  const [logoError, setLogoError] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    slug: '',
    titre: '',
    titre_en: '',
    titre_es: '',
    titre_ht: '',
    message_accueil: '',
    message_accueil_en: '',
    message_accueil_es: '',
    message_accueil_ht: '',
    couleur_primaire: '#1e293b',
    couleur_secondaire: '#0ea5e9',
    logo_url: '',
    logo_url: '',
    langues: ['fr'],
    besoins_personnalises: defaultBesoins,
    actif: true
  });

  const [activeTab, setActiveTab] = useState('fr');

  useEffect(() => {
    if (isEdit) loadFormulaire();
  }, [id]);

  const loadFormulaire = async () => {
    try {
      const data = await getFormulaire(id);
      setFormData({
        nom: data.nom || '',
        slug: data.slug || '',
        titre: data.titre || '',
        titre_en: data.titre_en || '',
        titre_es: data.titre_es || '',
        titre_ht: data.titre_ht || '',
        message_accueil: data.message_accueil || '',
        message_accueil_en: data.message_accueil_en || '',
        message_accueil_es: data.message_accueil_es || '',
        message_accueil_ht: data.message_accueil_ht || '',
        couleur_primaire: data.couleur_primaire || '#1e293b',
        couleur_secondaire: data.couleur_secondaire || '#0ea5e9',
        logo_url: data.logo_url || '',
        langues: data.langues || ['fr'],
        besoins_personnalises: data.besoins_personnalises?.length > 0 ? data.besoins_personnalises : defaultBesoins,
        actif: data.actif !== false
      });
    } catch (error) {
      toast.error('Formulaire non trouvé');
      router.push('/formulaires');
    } finally {
      setLoading(false);
    }
  };

  const handleSlugChange = async (value) => {
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^a-z0-9-]/g, '')     // Remove non-alphanumeric except -
      .replace(/-+/g, '-');           // Replace multiple - with single -
    setFormData(prev => ({ ...prev, slug }));
    
    if (slug.length >= 3) {
      setCheckingSlug(true);
      try {
        const available = await checkFormulaireSlugAvailable(slug, isEdit ? id : null);
        setSlugAvailable(available);
      } catch (error) {
        console.error('Error checking slug:', error);
      } finally {
        setCheckingSlug(false);
      }
    }
  };

  const handleLangueChange = (lang, checked) => {
    setFormData(prev => {
      const newLangues = checked 
        ? [...prev.langues, lang]
        : prev.langues.filter(l => l !== lang);
      if (!newLangues.includes(activeTab) && newLangues.length > 0) {
        setActiveTab(newLangues[0]);
      }
      return { ...prev, langues: newLangues };
    });
  };

  const handleBesoinChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      besoins_personnalises: prev.besoins_personnalises.map((b, i) => 
        i === index ? { ...b, [field]: value } : b
      )
    }));
  };

  const addBesoin = () => {
    const newId = Date.now().toString();
    setFormData(prev => ({
      ...prev,
      besoins_personnalises: [
        ...prev.besoins_personnalises,
        { id: newId, label_fr: '', label_en: '', label_es: '', label_ht: '' }
      ]
    }));
  };

  const removeBesoin = (index) => {
    setFormData(prev => ({
      ...prev,
      besoins_personnalises: prev.besoins_personnalises.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nom.trim()) {
      toast.error('Le nom du formulaire est requis');
      return;
    }
    if (!formData.slug || formData.slug.length < 3) {
      toast.error('Le lien doit contenir au moins 3 caractères');
      return;
    }
    if (!slugAvailable) {
      toast.error('Ce lien est déjà pris');
      return;
    }
    if (formData.langues.length === 0) {
      toast.error('Sélectionnez au moins une langue');
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await updateFormulaire(id, formData);
        toast.success('Formulaire modifié!');
      } else {
        await createFormulaire(formData);
        toast.success('Formulaire créé!');
      }
      router.push('/formulaires');
    } catch (error) {
      console.error('Erreur enregistrement formulaire:', error);
      toast.error(error.message || 'Erreur lors de l’enregistrement');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-96 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => router.push('/admin/formulaires')}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-150 border border-slate-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          {isEdit ? 'Modifier le formulaire' : 'Nouveau formulaire'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations de base */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Informations générales</h2>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="nom" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nom du formulaire *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => {
                    const newNom = e.target.value;
                    setFormData(prev => ({ ...prev, nom: newNom }));
                    if (!isEdit && (!formData.slug || formData.slug === formData.nom.toLowerCase().replace(/[^a-z0-9-]/g, ''))) {
                      handleSlugChange(newNom);
                    }
                  }}
                  placeholder="Ex: Formulaire Assurance Vie"
                  required
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                  data-testid="formulaire-nom-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Lien unique *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-500">/f/</span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="mon-formulaire"
                    className={`bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11 ${!slugAvailable ? 'border-red-500' : ''}`}
                    data-testid="formulaire-slug-input"
                  />
                  {formData.slug && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="h-11 w-11 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center shrink-0 transition-colors"
                      title="Copier le lien complet"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  )}
                </div>
                {checkingSlug && <p className="text-sm text-slate-400 ml-1">Vérification...</p>}
                {!checkingSlug && formData.slug && !slugAvailable && (
                  <p className="text-sm text-red-400 ml-1">Ce lien est déjà pris</p>
                )}
                {!checkingSlug && formData.slug && slugAvailable && formData.slug.length >= 3 && (
                  <p className="text-sm text-emerald-400 ml-1">Lien disponible!</p>
                )}
              </div>
              
              {/* Configuration du message par langue */}
              <div className="space-y-5 pt-6 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Contenu par langue</h3>
                  <p className="text-xs text-slate-400">Activez d'autres langues en bas</p>
                </div>
                
                <div className="w-full">
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {formData.langues.map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setActiveTab(lang)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                          activeTab === lang 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                            : 'bg-slate-900 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
                        }`}
                      >
                        {languageNames[lang] || lang}
                      </button>
                    ))}
                  </div>
                  
                  {formData.langues.map(lang => {
                    if (activeTab !== lang) return null;
                    const suffix = lang === 'fr' ? '' : `_${lang}`;
                    const titreField = `titre${suffix}`;
                    const messageField = `message_accueil${suffix}`;
                    
                    return (
                      <div key={lang} className="space-y-5 animate-fade-in">
                        <div className="space-y-2">
                          <Label htmlFor={titreField} className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Titre ({languageNames[lang]})</Label>
                          <Input
                            id={titreField}
                            value={formData[titreField] || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, [titreField]: e.target.value }))}
                            placeholder={`Titre en ${languageNames[lang]}...`}
                            className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={messageField} className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Message d'accueil ({languageNames[lang]})</Label>
                          <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                            <RichTextEditor
                              content={formData[messageField] || ''}
                              onChange={(html) => setFormData(prev => ({ ...prev, [messageField]: html }))}
                              placeholder={`Décrivez votre service en ${languageNames[lang]}...`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-700">
                <Label htmlFor="actif" className="text-sm font-bold text-white">Formulaire actif</Label>
                <Switch
                  id="actif"
                  checked={formData.actif}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, actif: checked }))}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Langues et Apparence */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Langues et Apparence</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Langues disponibles *</Label>
                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-900 border border-slate-700 rounded-xl">
                  {Object.entries(languageNames).map(([code, name]) => (
                    <div key={code} className="flex items-center space-x-3">
                      <Checkbox
                        id={`lang-${code}`}
                        checked={formData.langues.includes(code)}
                        onCheckedChange={(checked) => handleLangueChange(code, checked)}
                        className="border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <label htmlFor={`lang-${code}`} className="text-sm font-medium text-slate-300 cursor-pointer hover:text-white transition-colors">
                        {name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="logo" className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">URL du logo</Label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      id="logo"
                      value={formData.logo_url}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, logo_url: e.target.value }));
                        setLogoError(false);
                      }}
                      placeholder="https://exemple.com/logo.png"
                      className={`bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11 ${logoError ? 'border-amber-500 focus-visible:ring-amber-500' : ''}`}
                    />
                    {logoError && (
                      <p className="text-[11px] font-medium text-amber-500 leading-tight">
                        L'URL ne semble pas être une image valide (doit se terminer par .jpg, .png...)
                      </p>
                    )}
                  </div>
                  {formData.logo_url && (
                    <div className={`w-14 h-14 rounded-xl border overflow-hidden flex items-center justify-center shrink-0 ${logoError ? 'border-amber-500/30 bg-amber-500/10' : 'border-slate-700 bg-slate-900'}`}>
                      {logoError ? (
                        <ImageOff className="h-5 w-5 text-amber-500" />
                      ) : (
                        <img 
                          src={formData.logo_url} 
                          alt="Logo preview" 
                          className="max-w-full max-h-full object-contain p-1"
                          onError={() => setLogoError(true)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Couleur primaire</Label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-slate-700 shadow-inner shrink-0">
                      <input
                        type="color"
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
                  <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Couleur secondaire</Label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-slate-700 shadow-inner shrink-0">
                      <input
                        type="color"
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
            </div>
          </div>

          {/* Besoins personnalisés */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-white mb-2">Besoins / Options</h2>
            <p className="text-sm text-slate-400 mb-6">
              Personnalisez les options que les prospects peuvent sélectionner
            </p>
            <div className="space-y-4">
              {formData.besoins_personnalises.map((besoin, index) => (
                <div key={besoin.id} className="p-5 border border-slate-700 bg-slate-900/50 rounded-xl hover:border-slate-600 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-800 rounded cursor-move">
                        <GripVertical className="h-4 w-4 text-slate-500" />
                      </div>
                      <span className="font-bold text-sm text-white">Option {index + 1}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBesoin(index)}
                      className="p-2 rounded-lg text-red-400 hover:text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Français</Label>
                      <Input
                        value={besoin.label_fr || ''}
                        onChange={(e) => handleBesoinChange(index, 'label_fr', e.target.value)}
                        placeholder="Texte en français"
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 h-11 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">English</Label>
                      <Input
                        value={besoin.label_en || ''}
                        onChange={(e) => handleBesoinChange(index, 'label_en', e.target.value)}
                        placeholder="English text"
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 h-11 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Español</Label>
                      <Input
                        value={besoin.label_es || ''}
                        onChange={(e) => handleBesoinChange(index, 'label_es', e.target.value)}
                        placeholder="Texto en español"
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 h-11 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Kreyòl</Label>
                      <Input
                        value={besoin.label_ht || ''}
                        onChange={(e) => handleBesoinChange(index, 'label_ht', e.target.value)}
                        placeholder="Tèks kreyòl"
                        className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 h-11 mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addBesoin}
                className="w-full py-4 border border-dashed border-slate-600 hover:border-blue-500 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-blue-400 font-semibold transition-colors bg-slate-900/30 hover:bg-slate-900/50"
              >
                <Plus className="h-5 w-5" />
                Ajouter une option
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button 
            type="button" 
            onClick={() => router.push('/admin/formulaires')}
            className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium text-sm transition-all duration-150"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            disabled={saving} 
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all duration-150 active:scale-95 disabled:opacity-50" 
            data-testid="formulaire-submit-btn"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEdit ? 'Enregistrer' : 'Créer le formulaire'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormulaireEditPage;
