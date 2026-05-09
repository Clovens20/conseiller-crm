import React, { useState, useEffect } from 'react';
import {  useRouter } from 'next/navigation';
import { getLeads, convertLeadToClient, deleteLead, getNewLeadsCount } from '@/services/marketingApi';
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
import { UserPlus, Trash2, Phone, Mail, Calendar, CheckCircle, Clock, Globe, Briefcase, FileWarning } from 'lucide-react';
import { languageNames } from '@/utils/translations';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des leads');
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async (lead) => {
    setConverting(lead.id);
    try {
      const client = await convertLeadToClient(lead.id);
      toast.success(`${lead.nom_complet} converti en client!`);
      loadLeads();
      // Optionally navigate to the new client
      // router.push(`/clients/${client.id}`);
    } catch (error) {
      console.error('Erreur conversion lead:', error);
      toast.error(error.message || 'Erreur lors de la conversion');
    } finally {
      setConverting(null);
    }
  };

  const handleDeleteClick = (lead) => {
    setLeadToDelete(lead);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;
    
    try {
      await deleteLead(leadToDelete.id);
      toast.success('Lead supprimé');
      loadLeads();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const newLeadsCount = leads.filter(l => !l.converti).length;

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">
            Conduit (Leads)
          </h1>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            {leads.length} lead{leads.length !== 1 ? 's' : ''} au total
            {newLeadsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
                {newLeadsCount} nouveau{newLeadsCount !== 1 ? 'x' : ''}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Leads List */}
      {leads.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <UserPlus className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">
            Aucun lead pour le moment
          </h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            Partagez votre formulaire marketing pour recevoir des leads
          </p>
          <button 
            onClick={() => router.push('/admin/profile')} 
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-sm border border-slate-600 transition-all duration-150 mx-auto"
          >
            Configurer mon formulaire
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div 
              key={lead.id}
              className={`bg-slate-800 border rounded-2xl overflow-hidden transition-all ${!lead.converti && !lead.est_partiel ? 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-slate-700'} ${lead.est_partiel ? 'bg-amber-900/10' : ''}`}
              data-testid={`lead-card-${lead.id}`}
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h3 className="font-bold text-lg text-white">
                        {lead.nom_complet}
                      </h3>
                      {lead.converti ? (
                        <span className="bg-slate-500/20 text-slate-400 border border-slate-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Converti
                        </span>
                      ) : (
                        <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Nouveau
                        </span>
                      )}
                      {lead.est_partiel && !lead.converti && (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center">
                          <FileWarning className="h-3 w-3 mr-1" />
                          Partiel
                        </span>
                      )}
                      <span className="bg-slate-700 text-slate-300 border border-slate-600 px-2.5 py-1 rounded-full text-xs font-medium flex items-center">
                        <Globe className="h-3 w-3 mr-1" />
                        {languageNames[lead.langue] || lead.langue}
                      </span>
                      {lead.veut_devenir_conseiller && (
                        <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center">
                          <Briefcase className="h-3 w-3 mr-1" />
                          Veut devenir conseiller(ère)
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400 mb-4">
                      {lead.telephone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          <a href={`tel:${lead.telephone}`} className="hover:text-white transition-colors">
                            {lead.telephone}
                          </a>
                        </span>
                      )}
                      {lead.email && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />
                          <a href={`mailto:${lead.email}`} className="hover:text-white transition-colors">
                            {lead.email}
                          </a>
                        </span>
                      )}
                      {lead.utm_source && (
                        <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-xs">
                          Source: {lead.utm_source}
                        </span>
                      )}

                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(lead.created_at)}
                      </span>
                    </div>

                    {/* Besoins */}
                    {lead.besoins && lead.besoins.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Besoins</p>
                        <div className="flex flex-wrap gap-2">
                          {lead.besoins.map((besoin, idx) => (
                            <span key={idx} className="bg-slate-700 text-slate-300 border border-slate-600 px-2.5 py-1 rounded-lg text-xs font-medium">
                              {besoin}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Details */}
                    {lead.details && (
                      <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl mt-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Détails du message</p>
                        <p className="text-sm text-slate-300 whitespace-pre-wrap">{lead.details}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch lg:items-center gap-2 shrink-0">
                    {!lead.converti && (
                      <button
                        onClick={() => handleConvert(lead)}
                        disabled={converting === lead.id}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 transition-all duration-150 active:scale-95 disabled:opacity-50"
                        data-testid={`convert-lead-${lead.id}`}
                      >
                        {converting === lead.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Conversion...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />
                            Convertir en client
                          </>
                        )}
                      </button>
                    )}
                    {lead.converti && lead.client_id && (
                      <button
                        onClick={() => router.push(`/admin/clients/${lead.client_id}`)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-sm border border-slate-600 transition-all duration-150"
                      >
                        Voir le client
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(lead)}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white font-medium text-sm border border-red-600/30 hover:border-red-600 transition-all duration-150"
                      data-testid={`delete-lead-${lead.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden lg:inline">Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce lead?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {leadToDelete?.nom_complet}? 
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

export default LeadsPage;
