import { supabase } from '../lib/supabase';

const getCurrentUserId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
};

// ============ Conseiller Profile ============

export const getProfile = async () => {
  const userId = await getCurrentUserId();
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
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { data: existing } = await supabase
    .from('conseiller_profiles')
    .select('id')
    .eq('user_id', userId)
    .single();

  const now = new Date().toISOString();

  if (existing) {
    const { data, error } = await supabase
      .from('conseiller_profiles')
      .update({ ...profileData, updated_at: now })
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    // Generate a simple slug from company name if not provided
    const slug = profileData.slug || 
                 (profileData.nom_compagnie || 'conseiller')
                 .toLowerCase()
                 .replace(/[^a-z0-9]+/g, '-')
                 .replace(/(^-|-$)/g, '');

    const { data, error } = await supabase
      .from('conseiller_profiles')
      .insert({ 
        ...profileData, 
        slug: slug, 
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


// ============ Formulaires ============

export const getFormulaires = async () => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { data, error } = await supabase
    .from('formulaires')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getFormulaire = async (id) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { data, error } = await supabase
    .from('formulaires')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const getFormulaireBySlug = async (slug) => {
  // First get the formulaire
  const { data: formulaire, error } = await supabase
    .from('formulaires')
    .select('*')
    .eq('slug', slug)
    .eq('actif', true)
    .single();

  if (error) throw error;

  // Then get the conseiller profile separately
  const { data: profile } = await supabase
    .from('conseiller_profiles')
    .select('nom_compagnie, logo_url')
    .eq('user_id', formulaire.user_id)
    .single();

  return {
    ...formulaire,
    conseiller_profiles: profile || null
  };
};

export const createFormulaire = async (formulaireData) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('formulaires')
    .insert({
      ...formulaireData,
      user_id: userId,
      created_at: now,
      updated_at: now
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateFormulaire = async (id, formulaireData) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { data, error } = await supabase
    .from('formulaires')
    .update({
      ...formulaireData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteFormulaire = async (id) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { error } = await supabase
    .from('formulaires')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
  return { message: 'Formulaire supprimé' };
};

export const checkFormulaireSlugAvailable = async (slug, excludeId = null) => {
  let query = supabase
    .from('formulaires')
    .select('id')
    .eq('slug', slug);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return !data || data.length === 0;
};

// ============ Leads ============

export const getLeads = async () => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*, formulaires(nom)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
};

export const getNewLeadsCount = async () => {
  const userId = await getCurrentUserId();
  if (!userId) return 0;

  try {
    const { data, error } = await supabase
      .from('leads')
      .select('id')
      .eq('user_id', userId)
      .eq('converti', false);

    if (error) {
      return 0;
    }
    return data?.length || 0;
  } catch {
    return 0;
  }
};

export const createLead = async (leadData, slug, isPartial = false) => {
  // Get formulaire and user_id from slug
  const { data: formulaire, error: formError } = await supabase
    .from('formulaires')
    .select('id, user_id')
    .eq('slug', slug)
    .single();

  if (formError || !formulaire) throw new Error('Formulaire non trouvé');

  // If partial and we have an email, try to upsert to avoid duplicates
  if (isPartial && leadData.email) {
    const { data: existing } = await supabase
      .from('leads')
      .select('id')
      .eq('email', leadData.email)
      .eq('formulaire_id', formulaire.id)
      .eq('converti', false)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('leads')
        .update({
          ...leadData,
          est_partiel: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  }

  const { data, error } = await supabase
    .from('leads')
    .insert({
      ...leadData,
      user_id: formulaire.user_id,
      formulaire_id: formulaire.id,
      converti: false,
      est_partiel: isPartial,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const incrementFormVisits = async (slug, analyticsData = {}) => {
  const { data, error: fetchError } = await supabase
    .from('formulaires')
    .select('id, user_id, nb_visites')
    .eq('slug', slug)
    .single();

  if (fetchError || !data) return;

  // 1. Update simple counter (optional but fast for overview)
  await supabase
    .from('formulaires')
    .update({ nb_visites: (data.nb_visites || 0) + 1 })
    .eq('id', data.id);

  // 2. Insert detailed visit record
  const { error: visitError } = await supabase
    .from('form_visits')
    .insert({
      formulaire_id: data.id,
      user_id: data.user_id,
      referrer: analyticsData.referrer || null,
      utm_source: analyticsData.utm_source || null,
      utm_medium: analyticsData.utm_medium || null,
      utm_campaign: analyticsData.utm_campaign || null,
      device_type: analyticsData.device_type || 'unknwon',
    });
    
  if (visitError) {
    if (visitError.code !== '42P01') console.error('Error tracking visit:', visitError.message);
  }
};


export const getFormVisits = async (formulaireId) => {
  const { data, error } = await supabase
    .from('form_visits')
    .select('*')
    .eq('formulaire_id', formulaireId)
    .order('created_at', { ascending: false });
    
  if (error) {
    // Si la table n'existe pas encore, on retourne un tableau vide au lieu de crasher
    if (error.code === '42P01') return []; 
    throw error;
  }
  return data;
};



export const convertLeadToClient = async (leadId) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .eq('user_id', userId)
    .single();

  if (leadError || !lead) throw new Error('Lead non trouvé');

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
      notes: `<p><strong>Besoins exprimés:</strong></p><ul>${(lead.besoins || []).map(b => `<li>${b}</li>`).join('')}</ul>${lead.details ? `<p><strong>Détails:</strong> ${lead.details}</p>` : ''}${lead.veut_devenir_conseiller ? '<p><strong>⭐ Veut devenir conseiller(ère)</strong></p>' : ''}`,
      source: 'Formulaire marketing',
      created_at: now,
      updated_at: now
    })
    .select()
    .single();

  if (clientError) throw clientError;

  await supabase
    .from('leads')
    .update({ converti: true, client_id: client.id })
    .eq('id', leadId);

  return client;
};

export const deleteLead = async (leadId) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', leadId)
    .eq('user_id', userId);

  if (error) throw error;
  return { message: 'Lead supprimé' };
};
