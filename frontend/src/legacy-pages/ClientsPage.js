import React, { useState, useEffect, useCallback } from 'react';
import {  useRouter } from 'next/navigation';
import { getClients, deleteClient, exportClientsCSV } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Plus, Search, Phone, Mail, Trash2, Pencil, Download, Users, Eye } from 'lucide-react';
import { debounce } from '@/utils/helpers';
import { getStatusLabel, getInitials, getAvatarColor } from '@/utils/clientHelpers';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const router = useRouter();

  const loadClients = useCallback(async (searchTerm = '', status = '') => {
    try {
      setLoading(true);
      const data = await getClients(searchTerm, status === 'all' ? '' : status);
      setClients(data);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
      toast.error(error.message || 'Erreur lors du chargement des clients');
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

  const handleExport = async () => {
    try {
      await exportClientsCSV();
      toast.success('Export CSV téléchargé');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  const getNewBadgeClass = (status) => {
    switch (status) {
      case 'prospect': return 'bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs font-semibold inline-block';
      case 'actif': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-semibold inline-block';
      case 'suivi': return 'bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full text-xs font-semibold inline-block';
      case 'ferme': return 'bg-slate-500/20 text-slate-400 border border-slate-500/30 px-2.5 py-1 rounded-full text-xs font-semibold inline-block';
      case 'nouveau': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full text-xs font-semibold inline-block';
      default: return 'bg-slate-500/20 text-slate-400 border border-slate-500/30 px-2.5 py-1 rounded-full text-xs font-semibold inline-block';
    }
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Clients</h1>
          <p className="text-slate-400 text-sm mt-1">
            {clients.length} client{clients.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
            <input 
              className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 hover:border-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-white text-sm outline-none transition-all"
              placeholder="Rechercher..."
              value={search}
              onChange={handleSearchChange}
              data-testid="search-input"
            />
          </div>
          
          {/* Filter */}
          <select 
            value={statusFilter} 
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full sm:w-48 px-4 py-2.5 bg-slate-800 border border-slate-700 hover:border-slate-500 focus:border-blue-500 rounded-xl text-white text-sm outline-none transition-all"
          >
            <option value="all">Tous les statuts</option>
            <option value="prospect">Prospect</option>
            <option value="actif">Client actif</option>
            <option value="suivi">En suivi</option>
            <option value="ferme">Dossier fermé</option>
          </select>

          {/* Actions */}
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-sm border border-slate-600 transition-all duration-150 whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </button>
          <button 
            onClick={() => router.push('/admin/clients/new')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all duration-150 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4"/>
            Nouveau client
          </button>
        </div>
      </div>

      {/* Client List */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-800 rounded-2xl h-20 border border-slate-700" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <Users className="w-8 h-8 text-slate-500"/>
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Aucun client trouvé</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            {search || statusFilter !== 'all' 
              ? 'Essayez de modifier vos critères de recherche'
              : 'Commencez par ajouter votre premier client'}
          </p>
          {!search && statusFilter === 'all' && (
            <button 
              onClick={() => router.push('/admin/clients/new')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all duration-150 active:scale-95 mx-auto"
            >
              <Plus className="w-4 h-4"/>
              Nouveau client
            </button>
          )}
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-700">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr 
                  key={client.id} 
                  className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer group"
                  onClick={() => router.push(`/admin/clients/${client.id}`)}
                >
                  <td className="px-4 py-3.5 text-sm text-slate-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${getAvatarColor(client.prenom + client.nom)}`}>
                        {getInitials(client.prenom, client.nom)}
                      </div>
                      <span className="font-bold text-white group-hover:text-blue-400 transition-colors">{client.prenom} {client.nom}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-400">
                    <div className="flex flex-col gap-1.5">
                      {client.telephone && (
                        <span className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5" /> 
                          <a href={`tel:${client.telephone}`} onClick={(e) => e.stopPropagation()} className="hover:text-white transition-colors">{client.telephone}</a>
                        </span>
                      )}
                      {client.courriel && (
                        <span className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5" /> 
                          <a href={`mailto:${client.courriel}`} onClick={(e) => e.stopPropagation()} className="hover:text-white transition-colors truncate max-w-[200px] block">{client.courriel}</a>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm">
                    <span className={getNewBadgeClass(client.statut)}>
                      {getStatusLabel(client.statut)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <button 
                        onClick={(e) => { e.stopPropagation(); router.push(`/admin/clients/${client.id}`); }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-sm border border-slate-600 transition-all duration-150"
                      >
                        <Eye className="w-3.5 h-3.5"/>
                        Voir
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); router.push(`/admin/clients/${client.id}/edit`); }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-sm border border-slate-600 transition-all duration-150"
                      >
                        <Pencil className="w-3.5 h-3.5"/>
                        Modifier
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(client); }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white font-medium text-sm border border-red-600/30 hover:border-red-600 transition-all duration-150"
                      >
                        <Trash2 className="w-3.5 h-3.5"/>
                        <span className="sr-only">Supprimer</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
