import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, createOrUpdateProfile, checkSlugAvailable } from '../services/marketingApi';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';
import { Save, Loader2, Copy, ExternalLink, Building2, Palette, Globe, Link } from 'lucide-react';
import { languageNames } from '../utils/translations';

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(true);
  const [checkingSlug, setCheckingSlug] = useState(false);
  
  const [formData, setFormData] = useState({
    nom_compagnie: '',
    slug: '',
    logo_url: '',
    couleur_primaire: '#1e293b',
    couleur_secondaire: '#0ea5e9',
    message_accueil: '',
    langue_defaut: 'fr'
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
          slug: data.slug || '',
          logo_url: data.logo_url || '',
          couleur_primaire: data.couleur_primaire || '#1e293b',
          couleur_secondaire: data.couleur_secondaire || '#0ea5e9',
          message_accueil: data.message_accueil || '',
          langue_defaut: data.langue_defaut || 'fr'
        });
      } else {
        // Generate default slug from email
        const emailSlug = user?.email?.split('@')[0]?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || '';
        setFormData(prev => ({ ...prev, slug: emailSlug }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlugChange = async (value) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, slug }));
    
    if (slug.length >= 3) {
      setCheckingSlug(true);
      try {
        const available = await checkSlugAvailable(slug, user?.id);
        setSlugAvailable(available);
      } catch (error) {
        console.error('Error checking slug:', error);
      } finally {
        setCheckingSlug(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.slug || formData.slug.length < 3) {
      toast.error('Le lien unique doit contenir au moins 3 caractères');
      return;
    }

    if (!slugAvailable) {
      toast.error('Ce lien unique est déjà pris');
      return;
    }

    setSaving(true);
    try {
      await createOrUpdateProfile(formData);
      toast.success('Profil enregistré avec succès!');
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const formUrl = formData.slug ? `${window.location.origin}/f/${formData.slug}` : '';

  const copyFormUrl = () => {
    navigator.clipboard.writeText(formUrl);
    toast.success('Lien copié!');
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
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Mon Profil
        </h1>
        <p className="text-slate-500 mt-1">
          Configurez votre profil et votre formulaire marketing
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Info */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations de l'entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom_compagnie">Nom de la compagnie</Label>
                <Input
                  id="nom_compagnie"
                  value={formData.nom_compagnie}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom_compagnie: e.target.value }))}
                  placeholder="Ma Compagnie d'Assurance"
                  data-testid="nom-compagnie-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo_url">URL du logo (optionnel)</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                  data-testid="logo-url-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message_accueil">Message d'accueil (optionnel)</Label>
                <Textarea
                  id="message_accueil"
                  value={formData.message_accueil}
                  onChange={(e) => setFormData(prev => ({ ...prev, message_accueil: e.target.value }))}
                  placeholder="Bienvenue! Je suis là pour vous aider à atteindre vos objectifs financiers..."
                  rows={3}
                  data-testid="message-accueil-input"
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Link */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Lien du formulaire
              </CardTitle>
              <CardDescription>
                Ce lien unique sera utilisé pour votre formulaire marketing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Lien unique</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">/f/</span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="mon-nom"
                    className={!slugAvailable ? 'border-red-500' : ''}
                    data-testid="slug-input"
                  />
                </div>
                {checkingSlug && (
                  <p className="text-sm text-slate-500">Vérification...</p>
                )}
                {!checkingSlug && formData.slug && !slugAvailable && (
                  <p className="text-sm text-red-500">Ce lien est déjà pris</p>
                )}
                {!checkingSlug && formData.slug && slugAvailable && (
                  <p className="text-sm text-green-600">Lien disponible!</p>
                )}
              </div>

              {formData.slug && slugAvailable && (
                <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                  <p className="text-sm font-medium text-slate-700">Votre lien de formulaire:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-white rounded border text-sm truncate">
                      {formUrl}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={copyFormUrl}
                      data-testid="copy-url-btn"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(formUrl, '_blank')}
                      data-testid="preview-form-btn"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customization */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Personnalisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="couleur_primaire">Couleur primaire</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="couleur_primaire"
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
                  <Label htmlFor="couleur_secondaire">Couleur secondaire</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      id="couleur_secondaire"
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

              {/* Preview */}
              <div className="p-4 rounded-lg border-2" style={{ borderColor: formData.couleur_primaire }}>
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: formData.couleur_primaire }}
                  />
                  <span className="font-medium" style={{ color: formData.couleur_primaire }}>
                    {formData.nom_compagnie || 'Votre Compagnie'}
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  style={{ backgroundColor: formData.couleur_secondaire }}
                >
                  Exemple de bouton
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Langue par défaut
              </CardTitle>
              <CardDescription>
                Choisissez la langue par défaut de votre formulaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select 
                value={formData.langue_defaut} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, langue_defaut: v }))}
              >
                <SelectTrigger data-testid="langue-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languageNames).map(([code, name]) => (
                    <SelectItem key={code} value={code}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Submit */}
        <div className="mt-6 flex justify-end">
          <Button 
            type="submit" 
            disabled={saving || !slugAvailable}
            className="bg-slate-900 hover:bg-slate-800"
            data-testid="save-profile-btn"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer le profil
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
