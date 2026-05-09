import React, { useState, useEffect } from 'react';
import {  useRouter } from 'next/navigation';
import { getFormulaires, deleteFormulaire, getFormVisits } from '@/services/marketingApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Plus, FileText, Pencil, Trash2, Copy, ExternalLink, Globe, Eye, BarChart3, Smartphone, Monitor } from 'lucide-react';
import { languageNames } from '@/utils/translations';

const FormulairesPage = () => {
  const [formulaires, setFormulaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formulaireToDelete, setFormulaireToDelete] = useState(null);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loadingVisits, setLoadingVisits] = useState(false);
  const router = useRouter();

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



  const handleStatsClick = async (form) => {
    setSelectedForm(form);
    setStatsDialogOpen(true);
    setLoadingVisits(true);
    try {
      const data = await getFormVisits(form.id);
      setVisits(data);
    } catch (error) {
      console.error('Stats load error:', error);
      toast.error(`Erreur: ${error.message || 'Impossible de charger les statistiques'}`);
    } finally {

      setLoadingVisits(false);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">
            Mes Formulaires
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Créez et gérez vos formulaires marketing
          </p>
        </div>
        <button 
          onClick={() => router.push('/admin/formulaires/new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all duration-150 active:scale-95"
          data-testid="create-formulaire-btn"
        >
          <Plus className="h-4 w-4" />
          Nouveau formulaire
        </button>
      </div>

      {formulaires.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <FileText className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">
            Aucun formulaire créé
          </h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            Créez votre premier formulaire marketing pour attirer des prospects
          </p>
          <button 
            onClick={() => router.push('/admin/formulaires/new')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all duration-150 mx-auto active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Créer un formulaire
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {formulaires.map((form) => (
            <div key={form.id} className="bg-slate-800 border border-slate-700 rounded-2xl hover:border-slate-500 transition-all overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-white">
                        {form.nom}
                      </h3>
                      {form.actif ? (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">Actif</span>
                      ) : (
                        <span className="bg-slate-500/20 text-slate-400 border border-slate-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">Inactif</span>
                      )}
                      <span className="flex items-center gap-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full text-xs font-semibold">
                        <Eye className="h-3 w-3" />
                        {form.nb_visites || 0} visite{(form.nb_visites || 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <code className="text-sm bg-slate-900 text-blue-400 border border-slate-700 px-3 py-1.5 rounded-lg font-mono">
                        /f/{form.slug}
                      </code>
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4 text-slate-500" />
                        {(form.langues || ['fr']).map(lang => (
                          <span key={lang} className="bg-slate-700 text-slate-300 border border-slate-600 px-2 py-0.5 rounded text-xs font-medium uppercase">
                            {languageNames[lang] || lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    {form.besoins_personnalises && form.besoins_personnalises.length > 0 && (
                      <p className="text-sm text-slate-400">
                        <span className="font-semibold text-slate-300">{form.besoins_personnalises.length}</span> besoin(s) personnalisé(s)
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyUrl(form.slug)}
                      className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all duration-150"
                      title="Copier le lien"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleStatsClick(form)}
                      className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all duration-150"
                      title="Statistiques détaillées"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => window.open(`/f/${form.slug}`, '_blank')}
                      className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all duration-150"
                      title="Aperçu"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/admin/formulaires/${form.id}/edit`)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-sm border border-slate-600 transition-all duration-150"
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="hidden sm:inline">Modifier</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(form)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white font-medium text-sm border border-red-600/30 hover:border-red-600 transition-all duration-150"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
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

      <AlertDialog open={statsDialogOpen} onOpenChange={setStatsDialogOpen}>
        <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Statistiques de visites : {selectedForm?.nom}</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Aperçu des sources de trafic et des appareils utilisés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            {loadingVisits ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : visits.length === 0 ? (
              <p className="text-center text-slate-500 py-8">Aucune visite enregistrée pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {visits.slice(0, 20).map((visit) => (
                  <div key={visit.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg text-sm border border-slate-700">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">
                        {visit.utm_source ? `Campagne: ${visit.utm_source}` : 'Visite directe / Inconnue'}
                      </span>
                      <span className="text-xs text-slate-400 truncate max-w-[300px]" title={visit.referrer}>
                        Ref: {visit.referrer || 'Aucun'}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-mono text-slate-500">
                        {new Date(visit.created_at).toLocaleString('fr-CA')}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {visit.device_type === 'mobile' ? (
                          <Smartphone className="h-3 w-3 text-slate-500" />
                        ) : (
                          <Monitor className="h-3 w-3 text-slate-500" />
                        )}
                        <span className="text-[10px] uppercase font-semibold text-slate-500">
                          {visit.device_type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {visits.length > 20 && (
                  <p className="text-center text-xs text-slate-500 pt-2 italic">
                    Affichage des 20 dernières visites sur {visits.length}
                  </p>
                )}
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setStatsDialogOpen(false)}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
            >
              Fermer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FormulairesPage;
