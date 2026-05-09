import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getClient, deleteClient } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { 
  ArrowLeft, Pencil, Trash2, Phone, Mail, MapPin, 
  Users, Calendar, Clock, FileText, Tag
} from 'lucide-react';
import { getStatusBadgeClass, getStatusLabel, getInitials, getAvatarColor, formatDate, formatDateTime } from '@/utils/clientHelpers';

const ClientDetailPage = ({ id: propId }) => {
  const params = useParams();
  const router = useRouter();
  const id = propId || params.id || (params.slug && params.slug[1]);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      const data = await getClient(id);
      setClient(data);
    } catch (error) {
      toast.error('Client non trouvé');
      router.push('/admin/clients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClient(id);
      toast.success('Client supprimé avec succès');
      router.push('/admin/clients');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-slate-200 rounded mb-6" />
          <div className="h-64 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (!client) {
    return null;
  }

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin/clients')}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-150 border border-slate-700"
            data-testid="back-btn"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4">
            <div 
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${getAvatarColor(client.prenom + client.nom)}`}
            >
              {getInitials(client.prenom, client.nom)}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white mb-1">
                {client.prenom} {client.nom}
              </h1>
              <span className={getStatusBadgeClass(client.statut)}>
                {getStatusLabel(client.statut)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push(`/admin/clients/${id}/edit`)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all duration-150 active:scale-95"
            data-testid="edit-btn"
          >
            <Pencil className="h-4 w-4" />
            <span className="hidden sm:inline">Modifier</span>
          </button>
          <button 
            onClick={() => setDeleteDialogOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white font-semibold text-sm border border-red-600/30 hover:border-red-600 transition-all duration-150"
            data-testid="delete-btn"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Supprimer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Contact</h2>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-slate-700 rounded-xl shrink-0">
                <Phone className="h-5 w-5 text-slate-300" />
              </div>
              <div className="pt-0.5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Téléphone</p>
                <a 
                  href={`tel:${client.telephone}`}
                  className="font-medium text-white hover:text-blue-400 transition-colors"
                >
                  {client.telephone}
                </a>
              </div>
            </div>
            {client.courriel && (
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-700 rounded-xl shrink-0">
                  <Mail className="h-5 w-5 text-slate-300" />
                </div>
                <div className="pt-0.5 min-w-0">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Courriel</p>
                  <a 
                    href={`mailto:${client.courriel}`}
                    className="font-medium text-white hover:text-blue-400 transition-colors break-words block"
                  >
                    {client.courriel}
                  </a>
                </div>
              </div>
            )}
            {client.adresse && (
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-700 rounded-xl shrink-0">
                  <MapPin className="h-5 w-5 text-slate-300" />
                </div>
                <div className="pt-0.5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Adresse</p>
                  <p className="font-medium text-white">{client.adresse}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Family Info */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Situation familiale</h2>
          <div className="space-y-5">
            {client.conjoint && (
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-700 rounded-xl shrink-0">
                  <Users className="h-5 w-5 text-slate-300" />
                </div>
                <div className="pt-0.5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Conjoint(e)</p>
                  <p className="font-medium text-white">{client.conjoint}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-slate-700 rounded-xl shrink-0">
                <Users className="h-5 w-5 text-slate-300" />
              </div>
              <div className="pt-0.5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Enfants</p>
                <p className="font-medium text-white">{client.nb_enfants || 0}</p>
              </div>
            </div>
            {client.source && (
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-slate-700 rounded-xl shrink-0">
                  <Tag className="h-5 w-5 text-slate-300" />
                </div>
                <div className="pt-0.5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Source</p>
                  <p className="font-medium text-white">{client.source}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Suivi</h2>
          <div className="space-y-5">
            {client.date_rdv && (
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-blue-500/20 border border-blue-500/30 rounded-xl shrink-0">
                  <Calendar className="h-5 w-5 text-blue-400" />
                </div>
                <div className="pt-0.5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Prochain RDV</p>
                  <p className="font-medium text-white">{formatDateTime(client.date_rdv)}</p>
                </div>
              </div>
            )}
            {client.date_suivi && (
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl border shrink-0 ${new Date(client.date_suivi) <= new Date() ? 'bg-red-500/20 border-red-500/30' : 'bg-amber-500/20 border-amber-500/30'}`}>
                  <Clock className={`h-5 w-5 ${new Date(client.date_suivi) <= new Date() ? 'text-red-400' : 'text-amber-400'}`} />
                </div>
                <div className="pt-0.5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Prochain suivi</p>
                  <p className={`font-medium ${new Date(client.date_suivi) <= new Date() ? 'text-red-400' : 'text-white'}`}>
                    {formatDate(client.date_suivi)}
                    {new Date(client.date_suivi) <= new Date() && ' (En retard)'}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-slate-700 rounded-xl shrink-0">
                <Calendar className="h-5 w-5 text-slate-300" />
              </div>
              <div className="pt-0.5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Créé le</p>
                <p className="font-medium text-white">{formatDate(client.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 lg:col-span-3">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 bg-slate-700 rounded-lg shrink-0">
              <FileText className="h-5 w-5 text-slate-300" />
            </div>
            Notes / Besoins financiers
          </h2>
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 shadow-inner">
            {client.notes ? (
              <div 
                className="prose prose-invert prose-slate max-w-none text-slate-300 marker:text-slate-500"
                dangerouslySetInnerHTML={{ __html: client.notes }}
              />
            ) : (
              <p className="text-slate-500 italic text-center py-4">Aucune note pour ce client</p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce client?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {client.prenom} {client.nom}? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
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

export default ClientDetailPage;
