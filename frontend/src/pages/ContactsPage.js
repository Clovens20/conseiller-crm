import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
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
import { Plus, Search, Phone, Mail, Trash2, BookUser, X } from 'lucide-react';

const STATUTS = ['À contacter', 'Contacté', 'En négociation', 'Client'];

const STATUT_STYLES = {
  'À contacter':    'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Contacté':       'bg-blue-100 text-blue-800 border-blue-200',
  'En négociation': 'bg-purple-100 text-purple-800 border-purple-200',
  'Client':         'bg-green-100 text-green-800 border-green-200',
};

const FORM_VIDE = {
  nom_complet: '',
  telephone: '',
  email: '',
  objectif: '',
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

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
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
      const { error } = await supabase
        .from('contacts')
        .insert([{ ...form }]);

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

  const changerStatut = async (id, nouveauStatut) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ statut: nouveauStatut })
        .eq('id', id);
      if (error) throw error;
      fetchContacts();
    } catch (error) {
      toast.error('Erreur lors du changement de statut');
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

  const contactsFiltres = contacts.filter((c) => {
    const matchNom    = c.nom_complet.toLowerCase().includes(recherche.toLowerCase());
    const matchStatut = filtreStatut === 'all' || c.statut === filtreStatut;
    return matchNom && matchStatut;
  });

  const compteurs = STATUTS.reduce((acc, s) => {
    acc[s] = contacts.filter((c) => c.statut === s).length;
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-8 animate-fade-in">

      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Contacts
          </h1>
          <p className="text-slate-500 mt-1">
            {contacts.length} contact{contacts.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <Button
          onClick={() => setAfficherForm(!afficherForm)}
          className="bg-slate-900 hover:bg-slate-800"
        >
          {afficherForm
            ? <><X className="h-4 w-4 mr-2" />Fermer</>
            : <><Plus className="h-4 w-4 mr-2" />Nouveau contact</>
          }
        </Button>
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
        <Card className="border-slate-200 mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Nouveau contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="nom_complet"
                placeholder="Nom complet *"
                value={form.nom_complet}
                onChange={handleChange}
              />
              <Input
                name="telephone"
                placeholder="Téléphone"
                value={form.telephone}
                onChange={handleChange}
              />
              <Input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
              <select
                name="statut"
                value={form.statut}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                {STATUTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="md:col-span-2">
                <textarea
                  name="objectif"
                  placeholder="Objectif / Notes (ex: offrir assurance vie, retraite...)"
                  value={form.objectif}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button
                onClick={ajouterContact}
                disabled={saving}
                className="bg-slate-900 hover:bg-slate-800"
              >
                {saving ? 'Enregistrement...' : '✅ Enregistrer'}
              </Button>
              <Button
                variant="outline"
                onClick={() => { setAfficherForm(false); setForm(FORM_VIDE); }}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recherche + Filtre */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher par nom..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
          className="w-full sm:w-52 px-3 py-2 border border-slate-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
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
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-slate-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : contactsFiltres.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-slate-100 rounded-full">
                <BookUser className="h-8 w-8 text-slate-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Aucun contact trouvé
            </h3>
            <p className="text-slate-500 mb-6">
              {recherche || filtreStatut !== 'all'
                ? 'Essayez de modifier vos critères de recherche'
                : 'Commencez par ajouter votre premier contact'}
            </p>
            {!recherche && filtreStatut === 'all' && (
              <Button
                onClick={() => setAfficherForm(true)}
                className="bg-slate-900 hover:bg-slate-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un contact
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contactsFiltres.map((contact) => (
            <Card
              key={contact.id}
              className="border-slate-200 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">

                    {/* Nom + badge statut */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900">
                        👤 {contact.nom_complet}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUT_STYLES[contact.statut] || STATUT_STYLES['À contacter']}`}>
                        {contact.statut}
                      </span>
                    </div>

                    {/* Coordonnées */}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-3">
                      {contact.telephone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          <a href={`tel:${contact.telephone}`} className="hover:text-slate-900">
                            {contact.telephone}
                          </a>
                        </span>
                      )}
                      {contact.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          <a href={`mailto:${contact.email}`} className="hover:text-slate-900">
                            {contact.email}
                          </a>
                        </span>
                      )}
                    </div>

                    {/* Objectif */}
                    {contact.objectif && (
                      <p className="text-sm text-slate-500 italic mb-3">
                        🎯 {contact.objectif}
                      </p>
                    )}

                    {/* Boutons changement de statut */}
                    <div className="flex flex-wrap gap-2">
                      {STATUTS.map((s) => (
                        <button
                          key={s}
                          onClick={() => changerStatut(contact.id, s)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                            contact.statut === s
                              ? STATUT_STYLES[s]
                              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    <small className="text-slate-300 mt-2 block">
                      Ajouté le {new Date(contact.created_at).toLocaleDateString('fr-CA')}
                    </small>
                  </div>

                  {/* Supprimer */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(contact)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
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