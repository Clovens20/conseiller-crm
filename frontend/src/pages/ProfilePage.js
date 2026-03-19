import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProfile, createOrUpdateProfile } from '../services/marketingApi';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { toast } from 'sonner';
import { Save, Loader2, Building2, Palette, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
      toast.error('Erreur lors de l\'enregistrement');
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
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Mon Profil
        </h1>
        <p className="text-slate-500 mt-1">
          Configurez votre profil d'entreprise
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
                <Label htmlFor="message_accueil">Message d'accueil par défaut (optionnel)</Label>
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

          {/* Formulaires Link */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Mes Formulaires Marketing
              </CardTitle>
              <CardDescription>
                Créez et gérez vos formulaires de capture de leads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Vous pouvez maintenant créer plusieurs formulaires marketing personnalisés, 
                chacun avec son propre lien unique et ses propres options.
              </p>
              <Button 
                type="button" 
                onClick={() => navigate('/formulaires')}
                className="w-full"
                data-testid="go-to-formulaires-btn"
              >
                <FileText className="h-4 w-4 mr-2" />
                Gérer mes formulaires
              </Button>
            </CardContent>
          </Card>

          {/* Customization */}
          <Card className="border-slate-200 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Couleurs par défaut
              </CardTitle>
              <CardDescription>
                Ces couleurs seront utilisées par défaut lors de la création de nouveaux formulaires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Submit */}
        <div className="mt-6 flex justify-end">
          <Button 
            type="submit" 
            disabled={saving}
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
