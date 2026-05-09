import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
import { Plus, Search, Phone, Mail, Trash2, BookUser, X } from 'lucide-react';

const STATUTS = ['À contacter', 'Contacté', 'En négociation', 'Client'];

const STATUT_STYLES = {
  'À contacter':    'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Contacté':       'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'En négociation': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Client':         'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

const FORM_VIDE = {
  nom_complet: '',
  telephone: '',
  email: '',
  objectif: '',
  notes: '',
  date_contact: '',
  heure_contact: '',
  statut: 'À contacter',
};

const ContactsPage = () => {
  const [contacts, setContacts]                 = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [form, setForm]                         = useState(FORM_VIDE);
  const [afficherForm, setAfficherForm]         = useState(false);
  const [recherche, setRecherche]               = useState('');
  const [filtreStatut, setFiltreStatut]         = useState('all');
  const [saving, setSaving]                     = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete]   = useState(null);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .or(`user_id.eq.${userId},user_id.is.null`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur Supabase detail:', error);
        throw error;
      }
      setContacts(data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const ajouterContact = async () => {
    if (!form.nom_complet.trim()) {
      toast.error('Le nom complet est obligatoire.');
      return;
    }
    setSaving(true);
    try {
      // Récupérer l'ID de l'utilisateur connecté
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        return;
      }

      // Nettoyage des données pour la base de données (remplace les chaînes vides par null)
      const dataToSave = {
        ...form,
        user_id: userId,
        date_contact:  form.date_contact  || null,
        heure_contact: form.heure_contact || null,
        email:         form.email         || null,
        objectif:      form.objectif      || null,
        notes:         form.notes         || null,
      };

      const { error } = await supabase
        .from('contacts')
        .insert([dataToSave]);

      if (error) throw error;

      toast.success('Contact ajouté avec succès !');
      setForm(FORM_VIDE);
      setAfficherForm(false);
      fetchContacts();
    } catch (error) {
      toast.error('Erreur : ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const changerStatut = async (contact, nouveauStatut) => {
    try {
      setLoading(true);
      
      // Si on passe en négociation, on déplace vers les Leads (le "Conduit")
      if (nouveauStatut === 'En négociation') {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (!userId) {
          toast.error('Session expirée. Veuillez vous reconnecter.');
          return;
        }

        // 1. Créer le lead
        const leadData = {
          user_id: userId,
          nom_complet: contact.nom_complet,
          telephone: contact.telephone,
          email: contact.email,
          details: `Objectif: ${contact.objectif || ''}\nNotes: ${contact.notes || ''}\nPlanifié le: ${contact.date_contact || ''} ${contact.heure_contact || ''}`,
          converti: false,
          created_at: new Date().toISOString()
        };

        const { error: insertError } = await supabase
          .from('leads')
          .insert([leadData]);

        if (insertError) throw insertError;

        // 2. Supprimer le contact
        const { error: deleteError } = await supabase
          .from('contacts')
          .delete()
          .eq('id', contact.id);

        if (deleteError) throw deleteError;

        toast.success(`Le contact ${contact.nom_complet} a été déplacé dans le Conduit (Leads) !`);
        fetchContacts();
        return;
      }

      // Changement de statut normal
      const { error } = await supabase
        .from('contacts')
        .update({ statut: nouveauStatut })
        .eq('id', contact.id);

      if (error) throw error;
      toast.success(`Statut mis à jour : ${nouveauStatut}`);
      fetchContacts();
    } catch (error) {
      console.error('Erreur automation:', error);
      toast.error('Erreur lors du changement de statut');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (contact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactToDelete.id);
      if (error) throw error;
      toast.success('Contact supprimé');
      fetchContacts();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    }
  };

  // Calculs mémorisés pour éviter les décalages d'affichage
  const { contactsFiltres, compteurs, totalTotal } = useMemo(() => {
    const filtres = contacts.filter((c) => {
      const matchNom = c.nom_complet.toLowerCase().includes(recherche.toLowerCase());
      const matchStatut = filtreStatut === 'all' || c.statut === filtreStatut;
      return matchNom && matchStatut;
    });

    const counts = STATUTS.reduce((acc, s) => {
      acc[s] = contacts.filter((c) => c.statut === s).length;
      return acc;
    }, {});

    return { 
      contactsFiltres: filtres, 
      compteurs: counts, 
      totalTotal: contacts.length 
    };
  }, [contacts, recherche, filtreStatut]);

  return (
    <div className="p-4 md:p-8 animate-fade-in">

      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">
            Contacts
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {totalTotal} contact{totalTotal !== 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={() => setAfficherForm(!afficherForm)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 active:scale-95 ${
            afficherForm 
              ? 'bg-slate-700 hover:bg-slate-600 text-white' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
          }`}
        >
          {afficherForm
            ? <><X className="h-4 w-4" />Fermer</>
            : <><Plus className="h-4 w-4" />Nouveau contact</>
          }
        </button>
      </div>

      {/* Compteurs par statut */}
      <div className="flex flex-wrap gap-3 mb-6">
        {STATUTS.map((s) => (
          <span
            key={s}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${STATUT_STYLES[s]}`}
          >
            {s} : {compteurs[s] || 0}
          </span>
        ))}
      </div>

      {/* Formulaire d'ajout */}
      {afficherForm && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6">
            Nouveau contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Informations de base</label>
              <Input
                name="nom_complet"
                placeholder="Nom complet *"
                value={form.nom_complet}
                onChange={handleChange}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
              />
              <Input
                name="telephone"
                placeholder="Téléphone"
                value={form.telephone}
                onChange={handleChange}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
              />
              <Input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Planification & Statut</label>
              <div className="flex gap-2">
                <Input
                  name="date_contact"
                  type="date"
                  value={form.date_contact}
                  onChange={handleChange}
                  className="flex-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                  style={{ colorScheme: 'dark' }}
                />
                <Input
                  name="heure_contact"
                  type="time"
                  value={form.heure_contact}
                  onChange={handleChange}
                  className="w-32 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <select
                name="statut"
                value={form.statut}
                onChange={handleChange}
                className="w-full h-11 px-3 py-2 border border-slate-700 rounded-md text-sm bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                {STATUTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <Input
                name="objectif"
                placeholder="Objectif (Retraite, Vie, etc.)"
                value={form.objectif}
                onChange={handleChange}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-11"
              />
            </div>

            <div className="space-y-3 lg:col-span-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Cahier de notes</label>
              <div className="relative h-[152px] w-full">
                <div className="absolute inset-0 bg-slate-900/50 rounded-xl border border-slate-700 shadow-inner" 
                     style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '100% 1.5rem' }}>
                </div>
                <textarea
                  name="notes"
                  placeholder="Détails du projet / Notes importantes..."
                  value={form.notes}
                  onChange={handleChange}
                  rows={5}
                  className="relative w-full h-full p-4 bg-transparent border-0 text-sm resize-none focus:outline-none focus:ring-0 leading-6 text-slate-300 placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={ajouterContact}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all duration-150 active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer le contact'}
            </button>
            <button
              onClick={() => { setAfficherForm(false); setForm(FORM_VIDE); }}
              className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium text-sm transition-all duration-150"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Recherche + Filtre */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher par nom..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="pl-11 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-11 focus-visible:ring-blue-500 rounded-xl"
          />
        </div>
        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          className="w-full sm:w-64 h-11 px-4 border border-slate-700 rounded-xl text-sm bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <option value="all">Tous les statuts</option>
          {STATUTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 animate-pulse">
              <div className="h-16 bg-slate-700/50 rounded-xl" />
            </div>
          ))}
        </div>
      ) : contactsFiltres.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <BookUser className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">
            Aucun contact trouvé
          </h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
            {recherche || filtreStatut !== 'all'
              ? 'Essayez de modifier vos critères de recherche'
              : 'Commencez par ajouter votre premier contact'}
          </p>
          {!recherche && filtreStatut === 'all' && (
            <button
              onClick={() => setAfficherForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all duration-150 mx-auto active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Ajouter un contact
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {contactsFiltres.map((contact) => (
            <div
              key={contact.id}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-4 md:p-6 hover:border-slate-500 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">

                  {/* Nom + badge statut */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="font-bold text-lg text-white">
                      {contact.nom_complet}
                    </h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUT_STYLES[contact.statut] || STATUT_STYLES['À contacter']}`}>
                      {contact.statut}
                    </span>
                  </div>

                  {/* Coordonnées */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400 mb-4">
                    {contact.telephone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        <a href={`tel:${contact.telephone}`} className="hover:text-white transition-colors">
                          {contact.telephone}
                        </a>
                      </span>
                    )}
                    {contact.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">
                          {contact.email}
                        </a>
                      </span>
                    )}
                  </div>

                  {/* Objectif & Notes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {contact.objectif && (
                      <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">🎯 Objectif</p>
                        <p className="text-sm text-slate-300">{contact.objectif}</p>
                      </div>
                    )}
                    {(contact.date_contact || contact.heure_contact) && (
                      <div className="p-4 bg-sky-900/10 rounded-xl border border-sky-500/20">
                        <p className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2">📅 Prochain Contact</p>
                        <p className="text-sm font-semibold text-sky-300 flex items-center gap-2">
                           {contact.date_contact || 'Non définie'} 
                           {contact.heure_contact && <span className="text-sky-400">à {contact.heure_contact}</span>}
                        </p>
                      </div>
                    )}
                  </div>

                  {contact.notes && (
                    <div className="mb-4 p-4 bg-amber-900/10 rounded-xl border-l-4 border-amber-500/50 font-serif italic text-amber-200/80">
                      <p className="text-xs not-italic font-bold text-amber-500 mb-2 uppercase tracking-tight">Cahier de notes :</p>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{contact.notes}</p>
                    </div>
                  )}

                  {/* Boutons changement de statut */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {STATUTS.map((s) => (
                      <button
                        key={s}
                        onClick={() => changerStatut(contact, s)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          contact.statut === s
                            ? STATUT_STYLES[s]
                            : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white border border-transparent'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <small className="text-slate-500 text-xs block font-medium">
                    Fiche créée le {new Date(contact.created_at).toLocaleDateString('fr-CA')}
                  </small>
                </div>

                {/* Supprimer */}
                <div className="shrink-0 pt-1">
                  <button
                    onClick={() => handleDeleteClick(contact)}
                    className="p-2 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white font-medium text-sm border border-red-600/30 hover:border-red-600 transition-all duration-150"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce contact ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer {contactToDelete?.nom_complet} ?
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

export default ContactsPage;
