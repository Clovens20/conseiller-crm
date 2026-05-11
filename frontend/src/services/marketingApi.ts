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
    .from('profils')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const createOrUpdateProfile = async (profileData: any) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { data: existing } = await supabase
    .from('profils')
    .select('id')
    .eq('id', userId)
    .single();

  const now = new Date().toISOString();

  if (existing) {
    const { data, error } = await supabase
      .from('profils')
      .update({ ...profileData, updated_at: now })
      .eq('id', userId)
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
      .from('profils')
      .insert({ 
        ...profileData, 
        slug: slug, 
        id: userId, 
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
    .eq('conseiller_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getFormulaire = async (id: string) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { data, error } = await supabase
    .from('formulaires')
    .select('*')
    .eq('id', id)
    .eq('conseiller_id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const getFormulaireBySlug = async (slug: string) => {
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
    .from('profils')
    .select('nom_compagnie, logo_url')
    .eq('id', formulaire.conseiller_id)
    .single();

  return {
    ...formulaire,
    profils: profile || null
  };
};

export const createFormulaire = async (formulaireData: any) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('formulaires')
    .insert({
      ...formulaireData,
      conseiller_id: userId,
      created_at: now,
      updated_at: now
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateFormulaire = async (id: string, formulaireData: any) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { data, error } = await supabase
    .from('formulaires')
    .update({
      ...formulaireData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('conseiller_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteFormulaire = async (id: string) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { error } = await supabase
    .from('formulaires')
    .delete()
    .eq('id', id)
    .eq('conseiller_id', userId);

  if (error) throw error;
  return { message: 'Formulaire supprimé' };
};

export const checkFormulaireSlugAvailable = async (slug: string, excludeId: string | null = null) => {
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
      .eq('conseiller_id', userId)
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
      .eq('conseiller_id', userId)
      .eq('converti', false);

    if (error) {
      return 0;
    }
    return data?.length || 0;
  } catch {
    return 0;
  }
};

export const createLead = async (leadData: any, slug: string, isPartial = false) => {
  // Get formulaire and user_id from slug
  const { data: formulaire, error: formError } = await supabase
    .from('formulaires')
    .select('id, conseiller_id')
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
      conseiller_id: formulaire.conseiller_id,
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

export const incrementFormVisits = async (slug: string, analyticsData: any = {}) => {
  const { data, error: fetchError } = await supabase
    .from('formulaires')
    .select('id, conseiller_id, nb_visites')
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
      conseiller_id: data.conseiller_id,
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

export const incrementSiteVisit = async () => {
  try {
    const { data: current, error: fetchError } = await supabase
      .from('site_stats')
      .select('count')
      .eq('page', 'landing')
      .maybeSingle();
    
    if (fetchError) {
      if (fetchError.code === '42P01') return; // Table doesn't exist yet
      throw fetchError;
    }

    if (current) {
      await supabase
        .from('site_stats')
        .update({ count: (current.count || 0) + 1 })
        .eq('page', 'landing');
    } else {
      // First visit, create the row
      await supabase
        .from('site_stats')
        .insert({ page: 'landing', count: 1 });
    }
  } catch (err) {
    console.error('Error incrementing site visit:', err);
  }
};

export const getSiteVisits = async () => {
  try {
    const { data, error } = await supabase.from('site_stats').select('count').eq('page', 'landing').maybeSingle();
    if (error) return 0;
    return data?.count || 0;
  } catch {
    return 0;
  }
};


export const getFormVisits = async (formulaireId: string) => {
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



export const convertLeadToClient = async (leadId: string) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .eq('conseiller_id', userId)
    .single();

  if (leadError || !lead) throw new Error('Lead non trouvé');

  const now = new Date().toISOString();
  const nameParts = (lead.nom_complet || '').split(' ');
  const prenom = nameParts[0] || '';
  const nom = nameParts.slice(1).join(' ') || prenom;

  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert({
      conseiller_id: userId,
      prenom: prenom,
      nom: nom || prenom,
      telephone: lead.telephone,
      courriel: lead.email,
      statut: 'prospect',
      notes: `<p><strong>Besoins exprimés:</strong></p><ul>${(lead.besoins || []).map((b: string) => `<li>${b}</li>`).join('')}</ul>${lead.details ? `<p><strong>Détails:</strong> ${lead.details}</p>` : ''}${lead.veut_devenir_conseiller ? '<p><strong>⭐ Veut devenir conseiller(ère)</strong></p>' : ''}`,
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

export const deleteLead = async (leadId: string) => {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Non authentifié');

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', leadId)
    .eq('conseiller_id', userId);

  if (error) throw error;
  return { message: 'Lead supprimé' };
};
