import { supabase } from '../lib/supabase';

// Get current user from localStorage
const getCurrentUserId = () => {
  const user = localStorage.getItem('crm_user');
  if (!user) return null;
  return JSON.parse(user).id;
};

// Stats
export const getStats = async () => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;

  const total_clients = clients?.length || 0;
  const total_prospects = clients?.filter(c => c.statut === 'prospect').length || 0;

  // RDV this month
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const rdv_this_month = clients?.filter(c => {
    if (!c.date_rdv) return false;
    const rdvDate = new Date(c.date_rdv);
    return rdvDate >= firstDay && rdvDate <= lastDay;
  }).length || 0;

  // Suivis pending
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const suivis_pending = clients?.filter(c => {
    if (!c.date_suivi || c.statut === 'ferme') return false;
    const suiviDate = new Date(c.date_suivi);
    return suiviDate <= today;
  }).length || 0;

  return {
    total_clients,
    total_prospects,
    rdv_this_month,
    suivis_pending
  };
};

// Clients
export const getClients = async (search = '', statut = '') => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  let query = supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (statut) {
    query = query.eq('statut', statut);
  }

  const { data, error } = await query;
  if (error) throw error;

  let clients = data || [];

  // Filter by search if provided
  if (search) {
    const searchLower = search.toLowerCase();
    clients = clients.filter(c =>
      c.prenom?.toLowerCase().includes(searchLower) ||
      c.nom?.toLowerCase().includes(searchLower) ||
      c.telephone?.toLowerCase().includes(searchLower) ||
      c.courriel?.toLowerCase().includes(searchLower)
    );
  }

  return clients;
};

export const getClient = async (id) => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const createClient = async (clientData) => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('clients')
    .insert({
      ...clientData,
      user_id: userId,
      nb_enfants: clientData.nb_enfants || 0,
      statut: clientData.statut || 'prospect',
      created_at: now,
      updated_at: now
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateClient = async (id, clientData) => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { data, error } = await supabase
    .from('clients')
    .update({
      ...clientData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteClient = async (id) => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
  return { message: 'Client supprimé avec succès' };
};

// Agenda
export const getRdv = async () => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)
    .not('date_rdv', 'is', null)
    .order('date_rdv', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const getSuivis = async () => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)
    .not('date_suivi', 'is', null)
    .neq('statut', 'ferme')
    .order('date_suivi', { ascending: true });

  if (error) throw error;
  return data || [];
};

// Export CSV
export const exportClientsCSV = async () => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)
    .order('nom', { ascending: true });

  if (error) throw error;

  // Create CSV content
  const headers = [
    'Prénom', 'Nom', 'Téléphone', 'Courriel', 'Adresse',
    'Conjoint', 'Nb Enfants', 'Statut', 'Date RDV', 'Date Suivi',
    'Notes', 'Source', 'Créé le'
  ];

  const rows = (clients || []).map(c => [
    c.prenom || '', c.nom || '', c.telephone || '', c.courriel || '', c.adresse || '',
    c.conjoint || '', c.nb_enfants || 0, c.statut || '',
    c.date_rdv || '', c.date_suivi || '',
    (c.notes || '').replace(/"/g, '""'), c.source || '', c.created_at || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'clients.csv';
  link.click();
};
