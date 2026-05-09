'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, Phone, MapPin, Calendar, User, Briefcase, 
  CheckCircle, Trash2, Loader2, MessageSquare, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
    try {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProspects(data || []);
    } catch (err) {
      console.error('Error fetching prospects:', err);
      toast.error('Erreur lors du chargement des prospects');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      if (newStatus === 'contacte') {
        const prospect = prospects.find(p => p.id === id);
        if (!prospect) throw new Error('Prospect introuvable');

        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;
        if (!userId) {
          toast.error("Vous devez être connecté pour transférer vers les clients.");
          return;
        }

        const { error: insertError } = await supabase.from('clients').insert({
          conseiller_id: userId,
          prenom: prospect.prenom,
          nom: prospect.nom,
          courriel: prospect.email,
          telephone: prospect.telephone,
          adresse: prospect.ville,
          source: `Landing Page (${prospect.type})`,
          statut: 'prospect',
          notes: prospect.message,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

        if (insertError) throw insertError;
      }

      const { error } = await supabase
        .from('prospects')
        .update({ statut: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setProspects(prev => prev.map(p => p.id === id ? { ...p, statut: newStatus } : p));
      toast.success(newStatus === 'contacte' ? 'Transféré vers vos Clients (onglet Prospect) !' : 'Statut mis à jour');
    } catch (err: any) {
      console.error('Erreur détaillée:', err);
      toast.error(`Erreur: ${err?.message || err?.details || 'lors de la mise à jour'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce prospect ?')) return;

    try {
      const { error } = await supabase
        .from('prospects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProspects(prev => prev.filter(p => p.id !== id));
      toast.success('Prospect supprimé');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Demandes Landing Page</h1>
        <p className="text-slate-500">Gérez les prospects et recrues arrivant du site public.</p>
      </div>

      {prospects.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center text-slate-400">
            <div className="mb-4 flex justify-center">
              <MessageSquare className="h-12 w-12 opacity-20" />
            </div>
            <p>Aucune demande pour le moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {prospects.map((prospect) => (
            <Card key={prospect.id} className={`overflow-hidden border-l-4 ${prospect.type === 'client' ? 'border-l-blue-500' : 'border-l-purple-500'}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${prospect.type === 'client' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                        {prospect.type === 'client' ? <User className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{prospect.prenom} {prospect.nom}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                            {prospect.type === 'client' ? 'Prospect Client' : 'Recrue Représentant'}
                          </Badge>
                          {prospect.statut === 'nouveau' && (
                            <Badge variant="default" className="bg-green-500 text-white text-[10px] uppercase tracking-wider animate-pulse">Nouveau</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 opacity-40" />
                        <a href={`mailto:${prospect.email}`} className="hover:text-blue-500 transition-colors">{prospect.email}</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 opacity-40" />
                        <a href={`tel:${prospect.telephone}`} className="hover:text-blue-500 transition-colors">{prospect.telephone}</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 opacity-40" />
                        <span>{prospect.ville || 'Non spécifié'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 opacity-40" />
                        <span>Reçu le {new Date(prospect.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    {prospect.type === 'client' && prospect.type_assurance && (
                      <div className="flex items-center gap-2 text-sm">
                        <ShieldCheck className="h-4 w-4 text-blue-500" />
                        <span className="font-bold text-slate-700">Type souhaité:</span>
                        <Badge variant="outline" className="bg-blue-50/50">{prospect.type_assurance}</Badge>
                      </div>
                    )}

                    {prospect.type === 'representant' && (
                      <div className="flex flex-wrap gap-4 text-sm bg-slate-50 p-3 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">Expérience:</span>
                          <span>{prospect.experience_assurance ? `Oui (${prospect.annees_experience} ans)` : 'Non'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">Permis AMF:</span>
                          <Badge variant="outline">{prospect.permis_amf}</Badge>
                        </div>
                      </div>
                    )}

                    {prospect.message && (
                      <div className="bg-slate-50 p-4 rounded-xl text-sm italic text-slate-600">
                        "{prospect.message}"
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col justify-end gap-2">
                    {prospect.statut === 'nouveau' ? (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleStatusChange(prospect.id, 'contacte')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer comme contacté
                      </Button>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-500 py-2 justify-center">
                        Contacté
                      </Badge>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDelete(prospect.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
