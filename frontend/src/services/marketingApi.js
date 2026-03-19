import { supabase } from '../lib/supabase';

// Get current user from localStorage
const getCurrentUserId = () => {
  const user = localStorage.getItem('crm_user');
  if (!user) return null;
  return JSON.parse(user).id;
};

// ============ Conseiller Profile ============

export const getProfile = async () => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { data, error } = await supabase
    .from('conseiller_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const createOrUpdateProfile = async (profileData) => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  // Check if profile exists
  const { data: existing } = await supabase
    .from('conseiller_profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  const now = new Date().toISOString();

  if (existing) {
    const { data, error } = await supabase
      .from('conseiller_profiles')
      .update({
        ...profileData,
        updated_at: now
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('conseiller_profiles')
      .insert({
        ...profileData,
        user_id: userId,
        created_at: now,
        updated_at: now
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const checkSlugAvailable = async (slug, currentUserId = null) => {
  let query = supabase
    .from('conseiller_profiles')
    .select('id, user_id')
    .eq('slug', slug);

  const { data, error } = await query;
  
  if (error) throw error;
  
  // Si pas de résultat, le slug est disponible
  if (!data || data.length === 0) return true;
  
  // Si le slug appartient à l'utilisateur actuel, c'est ok
  if (currentUserId && data[0].user_id === currentUserId) return true;
  
  return false;
};

export const getProfileBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('conseiller_profiles')
    .select('*, users(email)')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
};

// ============ Leads ============

export const getLeads = async () => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getNewLeadsCount = async () => {
  const userId = getCurrentUserId();
  if (!userId) return 0;

  const { data, error } = await supabase
    .from('leads')
    .select('id')
    .eq('user_id', userId)
    .eq('converti', false);

  if (error) return 0;
  return data?.length || 0;
};

export const createLead = async (leadData, slug) => {
  // Get user_id from slug
  const { data: profile, error: profileError } = await supabase
    .from('conseiller_profiles')
    .select('user_id')
    .eq('slug', slug)
    .single();

  if (profileError || !profile) throw new Error('Conseiller non trouvé');

  const { data, error } = await supabase
    .from('leads')
    .insert({
      ...leadData,
      user_id: profile.user_id,
      converti: false,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const convertLeadToClient = async (leadId) => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  // Get lead data
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .eq('user_id', userId)
    .single();

  if (leadError || !lead) throw new Error('Lead non trouvé');

  // Create client from lead
  const now = new Date().toISOString();
  const nameParts = lead.nom_complet.split(' ');
  const prenom = nameParts[0] || '';
  const nom = nameParts.slice(1).join(' ') || prenom;

  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert({
      user_id: userId,
      prenom: prenom,
      nom: nom || prenom,
      telephone: lead.telephone,
      courriel: lead.email,
      statut: 'prospect',
      notes: `<p><strong>Besoins exprimés:</strong></p><ul>${(lead.besoins || []).map(b => `<li>${b}</li>`).join('')}</ul>${lead.details ? `<p><strong>Détails:</strong> ${lead.details}</p>` : ''}`,
      source: 'Formulaire marketing',
      created_at: now,
      updated_at: now
    })
    .select()
    .single();

  if (clientError) throw clientError;

  // Update lead as converted
  const { error: updateError } = await supabase
    .from('leads')
    .update({
      converti: true,
      client_id: client.id
    })
    .eq('id', leadId);

  if (updateError) throw updateError;

  return client;
};

export const deleteLead = async (leadId) => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', leadId)
    .eq('user_id', userId);

  if (error) throw error;
  return { message: 'Lead supprimé' };
};
