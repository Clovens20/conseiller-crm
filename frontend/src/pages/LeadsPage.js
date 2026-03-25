import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeads, convertLeadToClient, deleteLead, getNewLeadsCount } from '../services/marketingApi';
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
import { UserPlus, Trash2, Phone, Mail, Calendar, CheckCircle, Clock, Globe, Briefcase, FileWarning } from 'lucide-react';
import { languageNames } from '../utils/translations';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const navigate = useNavigate();

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
      // navigate(`/clients/${client.id}`);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Conduit (Leads)
          </h1>
          <p className="text-slate-500 mt-1">
            {leads.length} lead{leads.length !== 1 ? 's' : ''} au total
            {newLeadsCount > 0 && (
              <span className="ml-2 text-green-600 font-medium">
                ({newLeadsCount} nouveau{newLeadsCount !== 1 ? 'x' : ''})
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Leads List */}
      {leads.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-slate-100 rounded-full">
                <UserPlus className="h-8 w-8 text-slate-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Aucun lead pour le moment
            </h3>
            <p className="text-slate-500 mb-4">
              Partagez votre formulaire marketing pour recevoir des leads
            </p>
            <Button onClick={() => navigate('/profile')} variant="outline">
              Configurer mon formulaire
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <Card 
              key={lead.id}
              className={`border-slate-200 ${!lead.converti && !lead.est_partiel ? 'ring-2 ring-green-500 ring-offset-2' : ''} ${lead.est_partiel ? 'bg-amber-50/30' : ''}`}
              data-testid={`lead-card-${lead.id}`}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg text-slate-900">
                        {lead.nom_complet}
                      </h3>
                      {lead.converti ? (
                        <Badge className="bg-slate-100 text-slate-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Converti
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-700">
                          <Clock className="h-3 w-3 mr-1" />
                          Nouveau
                        </Badge>
                      )}
                      {lead.est_partiel && !lead.converti && (
                        <Badge className="bg-amber-100 text-amber-700">
                          <FileWarning className="h-3 w-3 mr-1" />
                          Partiel
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        <Globe className="h-3 w-3 mr-1" />
                        {languageNames[lead.langue] || lead.langue}
                      </Badge>
                      {lead.veut_devenir_conseiller && (
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                          <Briefcase className="h-3 w-3 mr-1" />
                          Veut devenir conseiller(ère)
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        <a href={`tel:${lead.telephone}`} className="hover:text-slate-900">
                          {lead.telephone}
                        </a>
                      </span>
                      {lead.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          <a href={`mailto:${lead.email}`} className="hover:text-slate-900">
                            {lead.email}
                          </a>
                        </span>
                      )}
                      {lead.utm_source && (
                        <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                          Source: {lead.utm_source}
                        </Badge>
                      )}

                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(lead.created_at)}
                      </span>
                    </div>

                    {/* Besoins */}
                    {lead.besoins && lead.besoins.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-slate-500 mb-1">Besoins:</p>
                        <div className="flex flex-wrap gap-1">
                          {lead.besoins.map((besoin, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {besoin}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Details */}
                    {lead.details && (
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs font-medium text-slate-500 mb-1">Détails:</p>
                        <p className="text-sm text-slate-700">{lead.details}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!lead.converti && (
                      <Button
                        onClick={() => handleConvert(lead)}
                        disabled={converting === lead.id}
                        className="bg-green-600 hover:bg-green-700"
                        data-testid={`convert-lead-${lead.id}`}
                      >
                        {converting === lead.id ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Conversion...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Convertir en client
                          </span>
                        )}
                      </Button>
                    )}
                    {lead.converti && lead.client_id && (
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/clients/${lead.client_id}`)}
                      >
                        Voir le client
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(lead)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      data-testid={`delete-lead-${lead.id}`}
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
