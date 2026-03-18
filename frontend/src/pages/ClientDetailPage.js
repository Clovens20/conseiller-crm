import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClient, deleteClient } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
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
import { 
  ArrowLeft, Pencil, Trash2, Phone, Mail, MapPin, 
  Users, Calendar, Clock, FileText, Tag
} from 'lucide-react';
import { getStatusBadgeClass, getStatusLabel, getInitials, getAvatarColor, formatDate, formatDateTime } from '../utils/clientHelpers';

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      navigate('/clients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClient(id);
      toast.success('Client supprimé avec succès');
      navigate('/clients');
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
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/clients')}
          className="p-2"
          data-testid="back-btn"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${getAvatarColor(client.prenom + client.nom)}`}
            >
              {getInitials(client.prenom, client.nom)}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {client.prenom} {client.nom}
              </h1>
              <Badge className={getStatusBadgeClass(client.statut)}>
                {getStatusLabel(client.statut)}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate(`/clients/${id}/edit`)}
            data-testid="edit-btn"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button 
            variant="outline"
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 border-red-200 hover:bg-red-50"
            data-testid="delete-btn"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Phone className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Téléphone</p>
                <a 
                  href={`tel:${client.telephone}`}
                  className="font-medium text-slate-900 hover:text-sky-600"
                >
                  {client.telephone}
                </a>
              </div>
            </div>
            {client.courriel && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Mail className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Courriel</p>
                  <a 
                    href={`mailto:${client.courriel}`}
                    className="font-medium text-slate-900 hover:text-sky-600 break-all"
                  >
                    {client.courriel}
                  </a>
                </div>
              </div>
            )}
            {client.adresse && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <MapPin className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Adresse</p>
                  <p className="font-medium text-slate-900">{client.adresse}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Family Info */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Situation familiale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {client.conjoint && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Users className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Conjoint(e)</p>
                  <p className="font-medium text-slate-900">{client.conjoint}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Users className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Enfants</p>
                <p className="font-medium text-slate-900">{client.nb_enfants || 0}</p>
              </div>
            </div>
            {client.source && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Tag className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Source</p>
                  <p className="font-medium text-slate-900">{client.source}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dates */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Suivi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {client.date_rdv && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-sky-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Prochain RDV</p>
                  <p className="font-medium text-slate-900">{formatDateTime(client.date_rdv)}</p>
                </div>
              </div>
            )}
            {client.date_suivi && (
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${new Date(client.date_suivi) <= new Date() ? 'bg-red-100' : 'bg-amber-100'}`}>
                  <Clock className={`h-4 w-4 ${new Date(client.date_suivi) <= new Date() ? 'text-red-600' : 'text-amber-600'}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Prochain suivi</p>
                  <p className={`font-medium ${new Date(client.date_suivi) <= new Date() ? 'text-red-600' : 'text-slate-900'}`}>
                    {formatDate(client.date_suivi)}
                    {new Date(client.date_suivi) <= new Date() && ' (En retard)'}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Calendar className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Créé le</p>
                <p className="font-medium text-slate-900">{formatDate(client.created_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="border-slate-200 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes / Besoins financiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {client.notes ? (
              <div 
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: client.notes }}
              />
            ) : (
              <p className="text-slate-500 italic">Aucune note pour ce client</p>
            )}
          </CardContent>
        </Card>
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
