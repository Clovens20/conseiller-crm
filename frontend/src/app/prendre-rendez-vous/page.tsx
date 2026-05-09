'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Calendar as CalendarIcon, Clock, CheckCircle, ChevronLeft, ChevronRight, User, Loader2 } from 'lucide-react';
import Link from 'next/link';

const SLOTS = ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30'];

function BookingContent() {
  const searchParams = useSearchParams();
  const prospectId = searchParams.get('prospect_id');
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [prospect, setProspect] = useState<any>(null);

  useEffect(() => {
    // If it's Sunday, move to Monday
    const today = new Date();
    if (today.getDay() === 0) {
      today.setDate(today.getDate() + 1);
      setSelectedDate(today);
    }
  }, []);

  useEffect(() => {
    if (prospectId) {
      fetchProspect();
    }
  }, [prospectId]);

  useEffect(() => {
    fetchAvailability();
  }, [selectedDate]);

  const fetchProspect = async () => {
    try {
      const { data } = await supabase.from('prospects').select('*').eq('id', prospectId).single();
      if (data) setProspect(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAvailability = async () => {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const { data: rdvs } = await supabase
        .from('rendez_vous')
        .select('date_heure')
        .gte('date_heure', startOfDay.toISOString())
        .lte('date_heure', endOfDay.toISOString())
        .neq('statut', 'annulé');

      const { data: indispos } = await supabase
        .from('indisponibilites')
        .select('date_heure, type')
        .gte('date_heure', startOfDay.toISOString())
        .lte('date_heure', endOfDay.toISOString());

      const booked = new Set<string>();
      
      rdvs?.forEach(r => {
        const d = new Date(r.date_heure);
        booked.add(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
      });

      indispos?.forEach(i => {
        if (i.type === 'journee_complete') {
          SLOTS.forEach(s => booked.add(s));
        } else {
          const d = new Date(i.date_heure);
          booked.add(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
        }
      });

      // Also block past times for today
      const now = new Date();
      if (selectedDate.toDateString() === now.toDateString()) {
        SLOTS.forEach(slot => {
          const [h, m] = slot.split(':').map(Number);
          if (now.getHours() > h || (now.getHours() === h && now.getMinutes() >= m)) {
            booked.add(slot);
          }
        });
      }

      setBookedSlots(Array.from(booked));
    } catch (error) {
      console.error("Erreur de récupération des disponibilités", error);
    }
  };

  const changeDays = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    
    // Prevent going to the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newDate < today) return;

    // Skip Sundays (0)
    if (newDate.getDay() === 0) {
      newDate.setDate(newDate.getDate() + (days > 0 ? 1 : -1));
    }
    
    setSelectedDate(newDate);
    setSelectedSlot(null);
  };

  const handleBooking = async () => {
    if (!selectedSlot || !prospectId) return;
    setLoading(true);

    try {
      const [hours, minutes] = selectedSlot.split(':');
      const dateHeure = new Date(selectedDate);
      dateHeure.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const { error } = await supabase.from('rendez_vous').insert({
        prospect_id: prospectId,
        date_heure: dateHeure.toISOString(),
        duree_minutes: 90,
        statut: 'planifié'
      });

      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la réservation. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 text-center border border-slate-700 shadow-2xl">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Rendez-vous Confirmé !</h2>
          <p className="text-slate-300 mb-8 leading-relaxed">
            Merci {prospect?.prenom}, votre rendez-vous est bien noté. Vous recevrez une invitation avec tous les détails.
          </p>
          <Link href="/">
            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
              Retour à l'accueil
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Planifiez votre consultation</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Choisissez un créneau horaire qui vous convient. La rencontre dure environ 1h30.
          </p>
        </div>

        <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl flex flex-col md:flex-row">
          {/* Left panel - User Info */}
          <div className="bg-slate-800/50 p-8 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-700">
            {prospect ? (
              <div>
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <User className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{prospect.prenom} {prospect.nom}</h3>
                <p className="text-slate-400 text-sm mb-6">{prospect.email}</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-300 text-sm">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span>Durée : 1h30</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 text-sm">
                    <CalendarIcon className="h-5 w-5 text-blue-500" />
                    <span>Consultation {prospect.type === 'client' ? 'Client' : 'Carrière'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-slate-700 rounded-2xl mb-6"></div>
                <div className="h-6 w-32 bg-slate-700 rounded mb-2"></div>
                <div className="h-4 w-48 bg-slate-700 rounded"></div>
              </div>
            )}
          </div>

          {/* Right panel - Calendar */}
          <div className="p-8 md:w-2/3">
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => changeDays(-1)} 
                disabled={isToday}
                className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="text-center">
                <p className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-1">
                  {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long' })}
                </p>
                <h2 className="text-2xl font-bold text-white">
                  {selectedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </h2>
              </div>
              <button 
                onClick={() => changeDays(1)} 
                className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {SLOTS.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = selectedSlot === slot;
                
                return (
                  <button
                    key={slot}
                    disabled={isBooked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`
                      py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 border-2
                      ${isBooked 
                        ? 'bg-slate-800/30 border-slate-800 text-slate-600 cursor-not-allowed line-through' 
                        : isSelected
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30 scale-105'
                          : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-blue-500 hover:text-white'
                      }
                    `}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedSlot || loading}
              className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                ${!selectedSlot 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-500 text-white shadow-xl shadow-green-600/20'
                }
              `}
            >
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Confirmer le rendez-vous'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center"><Loader2 className="h-8 w-8 text-blue-500 animate-spin" /></div>}>
      <BookingContent />
    </Suspense>
  );
}
