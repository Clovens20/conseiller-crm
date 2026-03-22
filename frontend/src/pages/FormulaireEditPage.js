import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFormulaire, createFormulaire, updateFormulaire, checkFormulaireSlugAvailable } from '../services/marketingApi';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2, Plus, Trash2, GripVertical, Copy, Check, ImageOff } from 'lucide-react';
import { languageNames } from '../utils/translations';
import RichTextEditor from '../components/RichTextEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

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
  const navigate = useNavigate();
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
    langues: ['fr'],
    besoins_personnalises: defaultBesoins,
    actif: true
  });

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
      navigate('/formulaires');
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
    setFormData(prev => ({
      ...prev,
      langues: checked 
        ? [...prev.langues, lang]
        : prev.langues.filter(l => l !== lang)
    }));
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
      navigate('/formulaires');
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
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/formulaires')} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          {isEdit ? 'Modifier le formulaire' : 'Nouveau formulaire'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations de base */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du formulaire *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => {
                    const newNom = e.target.value;
                    setFormData(prev => ({ ...prev, nom: newNom }));
                    // Auto-slug only if slug is empty or we're in create mode and it looks like it was auto-generated
                    if (!isEdit && (!formData.slug || formData.slug === formData.nom.toLowerCase().replace(/[^a-z0-9-]/g, ''))) {
                      handleSlugChange(newNom);
                    }
                  }}
                  placeholder="Ex: Formulaire Assurance Vie"
                  required
                  data-testid="formulaire-nom-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Lien unique *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">/f/</span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="mon-formulaire"
                    className={!slugAvailable ? 'border-red-500' : ''}
                    data-testid="formulaire-slug-input"
                  />
                  {formData.slug && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleCopy}
                      className="h-10 w-10 shrink-0"
                      title="Copier le lien complet"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
                {checkingSlug && <p className="text-sm text-slate-500">Vérification...</p>}
                {!checkingSlug && formData.slug && !slugAvailable && (
                  <p className="text-sm text-red-500">Ce lien est déjà pris</p>
                )}
                {!checkingSlug && formData.slug && slugAvailable && formData.slug.length >= 3 && (
                  <p className="text-sm text-green-600">Lien disponible!</p>
                )}
              </div>
              {/* Configuration du message par langue */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Contenu par langue</h3>
                  <p className="text-xs text-slate-500">Activez d'autres langues en bas pour traduire</p>
                </div>
                
                <Tabs defaultValue="fr" className="w-full">
                  <TabsList className="mb-4">
                    {formData.langues.map(lang => (
                      <TabsTrigger key={lang} value={lang} className="text-xs px-4">
                        {languageNames[lang] || lang}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {formData.langues.map(lang => {
                    const suffix = lang === 'fr' ? '' : `_${lang}`;
                    const titreField = `titre${suffix}`;
                    const messageField = `message_accueil${suffix}`;
                    
                    return (
                      <TabsContent key={lang} value={lang} className="space-y-6 animate-fade-in outline-none">
                        <div className="space-y-2">
                          <Label htmlFor={titreField}>Titre ({languageNames[lang]})</Label>
                          <Input
                            id={titreField}
                            value={formData[titreField] || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, [titreField]: e.target.value }))}
                            placeholder={`Titre en ${languageNames[lang]}...`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={messageField}>Message d'accueil ({languageNames[lang]})</Label>
                          <RichTextEditor
                            content={formData[messageField] || ''}
                            onChange={(html) => setFormData(prev => ({ ...prev, [messageField]: html }))}
                            placeholder={`Décrivez votre service en ${languageNames[lang]}...`}
                          />
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="actif">Formulaire actif</Label>
                <Switch
                  id="actif"
                  checked={formData.actif}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, actif: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Langues et Apparence */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Langues et Apparence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Langues disponibles *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(languageNames).map(([code, name]) => (
                    <div key={code} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lang-${code}`}
                        checked={formData.langues.includes(code)}
                        onCheckedChange={(checked) => handleLangueChange(code, checked)}
                      />
                      <label htmlFor={`lang-${code}`} className="text-sm cursor-pointer">
                        {name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">URL du logo</Label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1 space-y-1">
                    <Input
                      id="logo"
                      value={formData.logo_url}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, logo_url: e.target.value }));
                        setLogoError(false);
                      }}
                      placeholder="https://exemple.com/logo.png"
                      className={logoError ? 'border-amber-500' : ''}
                    />
                    {logoError && (
                      <p className="text-[10px] text-amber-600 leading-tight">
                        L'URL ne semble pas être une image directe. Assurez-vous qu'elle se termine par .jpg, .png...
                      </p>
                    )}
                  </div>
                  {formData.logo_url && (
                    <div className={`w-10 h-10 border rounded overflow-hidden flex items-center justify-center shrink-0 ${logoError ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}>
                      {logoError ? (
                        <ImageOff className="h-4 w-4 text-amber-500" />
                      ) : (
                        <img 
                          src={formData.logo_url} 
                          alt="Logo preview" 
                          className="max-w-full max-h-full object-contain"
                          onError={() => setLogoError(true)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Couleur primaire</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.couleur_primaire}
                      onChange={(e) => setFormData(prev => ({ ...prev, couleur_primaire: e.target.value }))}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={formData.couleur_primaire}
                      onChange={(e) => setFormData(prev => ({ ...prev, couleur_primaire: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Couleur secondaire</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.couleur_secondaire}
                      onChange={(e) => setFormData(prev => ({ ...prev, couleur_secondaire: e.target.value }))}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={formData.couleur_secondaire}
                      onChange={(e) => setFormData(prev => ({ ...prev, couleur_secondaire: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Besoins personnalisés */}
          <Card className="border-slate-200 lg:col-span-2">
            <CardHeader>
              <CardTitle>Besoins / Options</CardTitle>
              <CardDescription>
                Personnalisez les options que les prospects peuvent sélectionner
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.besoins_personnalises.map((besoin, index) => (
                  <div key={besoin.id} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-sm text-slate-700">Option {index + 1}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBesoin(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <Label className="text-xs">Français</Label>
                        <Input
                          value={besoin.label_fr || ''}
                          onChange={(e) => handleBesoinChange(index, 'label_fr', e.target.value)}
                          placeholder="Texte en français"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">English</Label>
                        <Input
                          value={besoin.label_en || ''}
                          onChange={(e) => handleBesoinChange(index, 'label_en', e.target.value)}
                          placeholder="English text"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Español</Label>
                        <Input
                          value={besoin.label_es || ''}
                          onChange={(e) => handleBesoinChange(index, 'label_es', e.target.value)}
                          placeholder="Texto en español"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Kreyòl</Label>
                        <Input
                          value={besoin.label_ht || ''}
                          onChange={(e) => handleBesoinChange(index, 'label_ht', e.target.value)}
                          placeholder="Tèks kreyòl"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addBesoin}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une option
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/formulaires')}>
            Annuler
          </Button>
          <Button type="submit" disabled={saving} className="bg-slate-900 hover:bg-slate-800" data-testid="formulaire-submit-btn">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? 'Enregistrer' : 'Créer le formulaire'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormulaireEditPage;
