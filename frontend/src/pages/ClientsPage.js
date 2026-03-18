import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClients, deleteClient } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
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
import { Plus, Search, Phone, Mail, Trash2, Pencil, Download, Users } from 'lucide-react';
import { debounce } from '../utils/helpers';
import { getStatusBadgeClass, getStatusLabel, getInitials, getAvatarColor } from '../utils/clientHelpers';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const navigate = useNavigate();

  const loadClients = useCallback(async (searchTerm = '', status = '') => {
    try {
      setLoading(true);
      const data = await getClients(searchTerm, status === 'all' ? '' : status);
      setClients(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const debouncedSearch = useCallback(
    debounce((term) => {
      loadClients(term, statusFilter);
    }, 300),
    [statusFilter, loadClients]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    loadClients(search, value);
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;
    
    try {
      await deleteClient(clientToDelete.id);
      toast.success('Client supprimé avec succès');
      loadClients(search, statusFilter);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const handleExport = () => {
    const token = localStorage.getItem('token');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    window.location.href = `${backendUrl}/api/clients/export/csv?authorization=Bearer ${token}`;
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Clients
          </h1>
          <p className="text-slate-500 mt-1">
            {clients.length} client{clients.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExport}
            className="border-slate-200"
            data-testid="export-csv-btn"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
          <Button 
            onClick={() => navigate('/clients/new')}
            className="bg-slate-900 hover:bg-slate-800"
            data-testid="add-client-btn"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher par nom, téléphone, courriel..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10"
            data-testid="search-input"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-48" data-testid="status-filter">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="prospect">Prospect</SelectItem>
            <SelectItem value="actif">Client actif</SelectItem>
            <SelectItem value="suivi">En suivi</SelectItem>
            <SelectItem value="ferme">Dossier fermé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Client List */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-slate-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : clients.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-slate-100 rounded-full">
                <Users className="h-8 w-8 text-slate-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Aucun client trouvé
            </h3>
            <p className="text-slate-500 mb-6">
              {search || statusFilter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par ajouter votre premier client'}
            </p>
            {!search && statusFilter === 'all' && (
              <Button 
                onClick={() => navigate('/clients/new')}
                className="bg-slate-900 hover:bg-slate-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un client
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {clients.map((client) => (
            <Card 
              key={client.id} 
              className="border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/clients/${client.id}`)}
              data-testid={`client-card-${client.id}`}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 ${getAvatarColor(client.prenom + client.nom)}`}
                  >
                    {getInitials(client.prenom, client.nom)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {client.prenom} {client.nom}
                      </h3>
                      <Badge className={getStatusBadgeClass(client.statut)}>
                        {getStatusLabel(client.statut)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        <a 
                          href={`tel:${client.telephone}`} 
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-slate-900"
                        >
                          {client.telephone}
                        </a>
                      </span>
                      {client.courriel && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          <a 
                            href={`mailto:${client.courriel}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-slate-900 truncate max-w-[200px]"
                          >
                            {client.courriel}
                          </a>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/clients/${client.id}/edit`);
                      }}
                      data-testid={`edit-client-${client.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(client);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      data-testid={`delete-client-${client.id}`}
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
            <AlertDialogTitle>Supprimer ce client?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {clientToDelete?.prenom} {clientToDelete?.nom}? 
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="cancel-delete-btn">Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              data-testid="confirm-delete-btn"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientsPage;
