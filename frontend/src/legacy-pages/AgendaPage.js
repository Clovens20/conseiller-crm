import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRdv, getSuivis } from '@/services/api';
import { Calendar, Clock, Phone, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { getStatusLabel, formatDate, formatDateTime, getInitials, getAvatarColor } from '@/utils/clientHelpers';
import { supabase } from '@/lib/supabase';

const TIME_SLOTS = [
  '08:00', '09:30', '11:00', '12:30', 
  '14:00', '15:30', '17:00', '18:30'
];

const AgendaPage = () => {
  const [rdvList, setRdvList] = useState([]);
  const [suivisList, setSuivisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rdv');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rdv, suivis] = await Promise.all([getRdv(), getSuivis()]);
      
      // Fetch public appointments
      const { data: rdvsPublics } = await supabase
        .from('rendez_vous')
        .select(`
          id, date_heure, statut, prospect_id,
          prospects ( prenom, nom, telephone, statut )
        `)
        .order('date_heure', { ascending: true });

      const formattedRdvsPublics = (rdvsPublics || []).map(r => ({
        id: `pub_${r.id}`,
        real_id: r.id,
        prospect_id: r.prospect_id,
        prenom: r.prospects?.prenom || 'Inconnu',
        nom: r.prospects?.nom || '',
        telephone: r.prospects?.telephone || '',
        statut: 'nouveau',
        date_rdv: r.date_heure,
        isPublic: true
      }));

      const allRdv = [...rdv, ...formattedRdvsPublics].sort((a, b) => new Date(a.date_rdv) - new Date(b.date_rdv));

      setRdvList(allRdv);
      setSuivisList(suivis);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isPast = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const formatSelectedDate = (date) => {
    return date.toLocaleDateString('fr-CA', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Helper to filter events for a specific day and time slot
  const getEventsForSlot = (date, timeSlot) => {
    return rdvList.filter(client => {
      if (!client.date_rdv) return false;
      const clientDate = new Date(client.date_rdv);
      
      const isSameDay = clientDate.getDate() === date.getDate() &&
                        clientDate.getMonth() === date.getMonth() &&
                        clientDate.getFullYear() === date.getFullYear();
      
      if (!isSameDay) return false;
      
      const [hours, minutes] = timeSlot.split(':');
      return clientDate.getHours() === parseInt(hours, 10) && 
             clientDate.getMinutes() === parseInt(minutes, 10);
    });
  };

  const overdueCount = suivisList.filter(c => isPast(c.date_suivi)).length;

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="animate-pulse flex items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Agenda</h1>
          <p className="text-slate-400 text-sm mt-1">Vos rendez-vous et suivis à venir</p>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2 border-b border-slate-700/50 pb-4">
        <button
          onClick={() => setActiveTab('rdv')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-150 ${
            activeTab === 'rdv' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Calendrier ({rdvList.length})
        </button>
        <button
          onClick={() => setActiveTab('suivis')}
          className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-150 ${
            activeTab === 'suivis' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
          }`}
        >
          <Clock className="h-4 w-4" />
          Suivis ({suivisList.length})
          {overdueCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[20px] px-1 h-[20px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900">
              {overdueCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('dispos')}
          className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-150 ${
            activeTab === 'dispos' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Gérer les disponibilités
        </button>
      </div>

      {activeTab === 'rdv' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50">
            <button 
              onClick={handlePrevDay}
              className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white capitalize">
                {formatSelectedDate(selectedDate)}
              </h2>
            </div>

            <button 
              onClick={handleNextDay}
              className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="divide-y divide-slate-700/50 bg-slate-900/20">
            {TIME_SLOTS.map(slot => {
              const events = getEventsForSlot(selectedDate, slot);
              return (
                <div key={slot} className="flex flex-col md:flex-row">
                  {/* Time column */}
                  <div className="w-full md:w-32 p-4 md:border-r border-slate-700/50 flex md:justify-center items-center bg-slate-800/20">
                    <span className="text-lg font-bold text-slate-400">{slot}</span>
                  </div>
                  
                  {/* Events column */}
                  <div className="flex-1 p-3 min-h-[100px]">
                    {events.length === 0 ? (
                      <div className="h-full w-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-xs font-semibold text-slate-600">Créneau disponible</span>
                      </div>
                    ) : (
                      <div className="grid gap-3 grid-cols-1 xl:grid-cols-2">
                        {events.map(event => (
                          <div 
                            key={event.id}
                            onClick={() => event.isPublic ? router.push('/admin/prospects') : router.push(`/admin/clients/${event.id}`)}
                            className="group relative bg-slate-800 border border-slate-600 hover:border-blue-500 rounded-2xl p-4 cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] overflow-hidden"
                          >
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg ${getAvatarColor(event.prenom + event.nom)}`}>
                                {getInitials(event.prenom, event.nom)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-white truncate group-hover:text-blue-400 transition-colors">
                                  {event.prenom} {event.nom}
                                </h3>
                                <div className="flex items-center gap-3 mt-1.5">
                                  <span className="flex items-center gap-1.5 text-sm text-slate-400">
                                    <Phone className="w-3.5 h-3.5" />
                                    {event.telephone || 'Non spécifié'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {event.isPublic && (
                              <div className="absolute top-3 right-3">
                                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                  Prospect
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'suivis' && (
        <div className="space-y-4">
          {suivisList.length === 0 ? (
            <div className="text-center py-16 bg-slate-800 border border-slate-700 rounded-3xl">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                <Clock className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Aucun suivi prévu</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">Planifiez des suivis pour vos clients</p>
            </div>
          ) : (
            suivisList.map(client => (
              <div 
                key={client.id}
                onClick={() => router.push(`/admin/clients/${client.id}`)}
                className="bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-2xl p-6 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 ${getAvatarColor(client.prenom + client.nom)}`}>
                    {getInitials(client.prenom, client.nom)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{client.prenom} {client.nom}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" /> {formatDate(client.date_suivi)}
                      </span>
                      {client.telephone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-4 w-4" /> {client.telephone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'dispos' && (
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6">
          <div className="text-center py-12">
            <h3 className="text-white font-bold text-lg mb-2">Gestion des Disponibilités</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              Pour configurer des exceptions, journées de congé, ou bloquer des heures spécifiques, cette fonctionnalité nécessite le compte Administrateur Supabase.
            </p>
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl max-w-md mx-auto text-left">
               <p className="text-blue-300 text-sm">
                 <strong>Heures d'ouverture par défaut :</strong><br />
                 Lundi au Samedi : 08:00 - 20:00<br />
                 Créneaux : 08:00, 09:30, 11:00, 12:30, 14:00, 15:30, 17:00, 18:30
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaPage;
