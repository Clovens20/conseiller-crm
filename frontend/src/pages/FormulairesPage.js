import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFormulaires, deleteFormulaire } from '../services/marketingApi';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { toast } from 'sonner';
import { Plus, FileText, Pencil, Trash2, Copy, ExternalLink, Globe } from 'lucide-react';
import { languageNames } from '../utils/translations';

const FormulairesPage = () => {
  const [formulaires, setFormulaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formulaireToDelete, setFormulaireToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadFormulaires();
  }, []);

  const loadFormulaires = async () => {
    try {
      const data = await getFormulaires();
      setFormulaires(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des formulaires');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (formulaire) => {
    setFormulaireToDelete(formulaire);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!formulaireToDelete) return;
    try {
      await deleteFormulaire(formulaireToDelete.id);
      toast.success('Formulaire supprimé');
      loadFormulaires();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleteDialogOpen(false);
      setFormulaireToDelete(null);
    }
  };

  const copyUrl = (slug) => {
    const url = `${window.location.origin}/f/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Lien copié!');
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Mes Formulaires
          </h1>
          <p className="text-slate-500 mt-1">
            Créez et gérez vos formulaires marketing
          </p>
        </div>
        <Button 
          onClick={() => navigate('/formulaires/new')}
          className="bg-slate-900 hover:bg-slate-800"
          data-testid="create-formulaire-btn"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau formulaire
        </Button>
      </div>

      {formulaires.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-slate-100 rounded-full">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Aucun formulaire créé
            </h3>
            <p className="text-slate-500 mb-4">
              Créez votre premier formulaire marketing pour attirer des prospects
            </p>
            <Button onClick={() => navigate('/formulaires/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un formulaire
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {formulaires.map((form) => (
            <Card key={form.id} className="border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-slate-900">
                        {form.nom}
                      </h3>
                      {form.actif ? (
                        <Badge className="bg-green-100 text-green-700">Actif</Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-600">Inactif</Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded">
                        /f/{form.slug}
                      </code>
                      <div className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5 text-slate-400" />
                        {(form.langues || ['fr']).map(lang => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {languageNames[lang] || lang}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {form.besoins_personnalises && form.besoins_personnalises.length > 0 && (
                      <p className="text-sm text-slate-500">
                        {form.besoins_personnalises.length} besoin(s) personnalisé(s)
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyUrl(form.slug)}
                      title="Copier le lien"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(`/f/${form.slug}`, '_blank')}
                      title="Aperçu"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/formulaires/${form.id}/edit`)}
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(form)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce formulaire?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer "{formulaireToDelete?.nom}"? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FormulairesPage;
