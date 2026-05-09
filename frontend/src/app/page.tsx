'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Shield, TrendingUp, Users, FileText, AlertCircle, CheckCircle, Scale, PiggyBank, Heart, ChevronRight, Briefcase, Info } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useContent } from '@/hooks/useContent';

export default function LandingPage() {
  const router = useRouter();

  // Dynamic Content
  const { content: landingContent, loading: contentLoading } = useContent('landing', 'main', {
    hero: {
      title: 'Votre avenir financier commence ici',
      subtitle: 'Que vous cherchiez à protéger votre famille ou à bâtir une carrière dans les services financiers, nous avons une solution pour vous.',
      bg_image: 'https://images.unsplash.com/photo-1721995432582-b0a486848fca?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBhcmNoaXRlY3R1cmUlMjBtaW5pbWFsaXN0JTIwYmx1ZSUyMGFic3RyYWN0fGVufDB8fHx8MTc3Mzg3NzAyOXww&ixlib=rb-4.1.0&q=85'
    },
    stats: {
      years: '45 ans',
      families: '8M+',
      list: 'NYSE'
    }
  });

  // Form states
  const [clientForm, setClientForm] = useState({
    prenom: '', nom: '', email: '', telephone: '', ville: '', situation: '', message: ''
  });
  const [clientLoading, setClientLoading] = useState(false);
  const [clientSuccess, setClientSuccess] = useState(false);
  const [clientError, setClientError] = useState('');

  const [repForm, setRepForm] = useState({
    prenom: '', nom: '', email: '', telephone: '', ville: '', situation: '', disponibilite: '', experience: '', motivation: '', message: '', consenti: false
  });
  const [repLoading, setRepLoading] = useState(false);
  const [repSuccess, setRepSuccess] = useState(false);
  const [repError, setRepError] = useState('');

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isRepModalOpen, setIsRepModalOpen] = useState(false);

  const submitClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientLoading(true);
    setClientError('');
    try {
      const { data, error } = await supabase.from('prospects').insert({
        type: 'client',
        prenom: clientForm.prenom,
        nom: clientForm.nom,
        email: clientForm.email,
        telephone: clientForm.telephone,
        ville: clientForm.ville,
        message: `Besoin principal : ${clientForm.situation}\n\nMessage : ${clientForm.message}`,
        statut: 'nouveau'
      }).select().single();
      if (error) throw error;
      setClientSuccess(true);
      setClientForm({ prenom: '', nom: '', email: '', telephone: '', ville: '', situation: '', message: '' });
      setIsClientModalOpen(false);
      router.push(`/prendre-rendez-vous?prospect_id=${data.id}`);
    } catch (err: any) {
      setClientError(err.message || 'Une erreur est survenue.');
    } finally {
      setClientLoading(false);
    }
  };

  const submitRep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repForm.consenti) {
      setRepError("Veuillez cocher la case de consentement.");
      return;
    }
    setRepLoading(true);
    setRepError('');
    try {
      const finalMessage = `Situation actuelle : ${repForm.situation}
Disponibilité : ${repForm.disponibilite}
Expérience en finances : ${repForm.experience}
Motivation principale : ${repForm.motivation}

Message additionnel :
${repForm.message}`;

      const { data, error } = await supabase.from('prospects').insert({
        type: 'representant',
        prenom: repForm.prenom,
        nom: repForm.nom,
        email: repForm.email,
        telephone: repForm.telephone,
        ville: repForm.ville,
        message: finalMessage.trim(),
        statut: 'nouveau'
      }).select().single();
      if (error) throw error;
      setRepSuccess(true);
      setRepForm({ prenom: '', nom: '', email: '', telephone: '', ville: '', situation: '', disponibilite: '', experience: '', motivation: '', message: '', consenti: false });
      setIsRepModalOpen(false);
      router.push(`/prendre-rendez-vous?prospect_id=${data.id}`);
    } catch (err: any) {
      setRepError(err.message || 'Une erreur est survenue.');
    } finally {
      setRepLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* SECTION 1 - HERO */}
      <section 
        className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url(${landingContent.hero?.bg_image})`
        }}
      >
        <div className="absolute inset-0 bg-slate-900/80 z-0" />
        
        {/* Abstract SVG Background Lines */}
        <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,300 Q400,200 800,400 T1600,300" fill="none" stroke="url(#lineGrad)" strokeWidth="2" className="animate-pulse" />
            <path d="M0,500 Q500,400 900,600 T1800,400" fill="none" stroke="url(#lineGrad)" strokeWidth="1.5" style={{animationDelay: '1s'}} className="animate-pulse" />
            <path d="M0,100 Q600,300 1000,100 T2000,200" fill="none" stroke="url(#lineGrad)" strokeWidth="1" style={{animationDelay: '2s'}} className="animate-pulse" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B] font-semibold text-sm mb-8">
              <Shield className="w-4 h-4" />
              🏆 Accrédité AMF — Québec
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight whitespace-pre-line">
              {landingContent.hero?.title}
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              {landingContent.hero?.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-5 mb-16">
              <button 
                onClick={() => setIsClientModalOpen(true)}
                className="group flex items-center justify-center gap-3 bg-[#1E40AF] hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg shadow-blue-900/50 hover:-translate-y-1"
              >
                <Shield className="w-5 h-5" />
                Consultation gratuite
              </button>
              
              <button 
                onClick={() => setIsRepModalOpen(true)}
                className="group flex items-center justify-center gap-3 bg-transparent border-2 border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B] hover:text-[#0F172A] font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg shadow-[#F59E0B]/10 hover:-translate-y-1"
              >
                <Briefcase className="w-5 h-5" />
                Opportunité de carrière
              </button>
            </div>

            {/* Trust Stats */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-700/50 max-w-xl">
              <div>
                <p className="text-3xl font-black text-white mb-1">{landingContent.stats?.years}</p>
                <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold">d'expertise</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white mb-1">{landingContent.stats?.families}</p>
                <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold">familles aidées</p>
              </div>
              <div>
                <p className="text-3xl font-black text-white mb-1">{landingContent.stats?.list}</p>
                <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold">S&P 500 listé</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - PROBLÈME */}
      <section className="py-24 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-16">La réalité des familles québécoises</h2>
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* AVANT */}
            <div className="bg-red-950/20 border border-red-900/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <AlertCircle className="w-32 h-32 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-red-400 mb-8 flex items-center gap-3">
                La situation courante
              </h3>
              <ul className="space-y-5 text-lg">
                {[
                  "Dettes et hypothèques mal gérées",
                  "Impôts trop élevés",
                  "Assurances coûteuses et inadéquates",
                  "Peu ou pas d'épargne-retraite",
                  "Aucun plan financier structuré"
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="text-red-500 font-bold mt-1">❌</span>
                    <span className="text-slate-300">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* APRÈS */}
            <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <CheckCircle className="w-32 h-32 text-[#10B981]" />
              </div>
              <h3 className="text-2xl font-bold text-[#10B981] mb-8 flex items-center gap-3">
                L'approche optimisée
              </h3>
              <ul className="space-y-5 text-lg">
                {[
                  "Plan d'élimination des dettes",
                  "Stratégie fiscale optimisée",
                  "Assurance-vie temporaire abordable",
                  "Programme d'investissement complet",
                  "Suivi personnalisé et continu"
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="text-[#10B981] font-bold mt-1">✅</span>
                    <span className="text-white">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 max-w-4xl mx-auto border border-[#F59E0B]/30 bg-[#F59E0B]/5 rounded-2xl p-10 text-center relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0B1120] px-4 text-[#F59E0B]">
              <span className="text-5xl">"</span>
            </div>
            <p className="text-2xl md:text-3xl text-white font-medium italic leading-relaxed">
              Achetez du temporaire et investissez la différence — une philosophie qui transforme des vies depuis 1977.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 - NOS SERVICES */}
      <section className="py-24 bg-gradient-to-b from-[#0F172A] to-[#14233A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Une suite complète de solutions</h2>
            <p className="text-[#F59E0B] text-lg font-medium">Supervisé par l'AMF du Québec</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Assurance-vie temporaire", desc: "Protection maximale pour votre famille. Simple, abordable, adapté à la classe moyenne québécoise." },
              { icon: TrendingUp, title: "Fonds de placement", desc: "Fonds communs, fonds distincts et solutions d'investissement adaptés à vos objectifs de retraite." },
              { icon: PiggyBank, title: "Élimination des dettes", desc: "Stratégies concrètes pour rembourser vos dettes et hypothèques plus rapidement." },
              { icon: Heart, title: "Protection invalidité", desc: "Revenu de remplacement si vous ne pouvez plus travailler. Protégez ce qui compte le plus." },
              { icon: FileText, title: "Analyse financière", desc: "Bilan financier complet et gratuit pour toute famille québécoise. Sans obligation." }
            ].map((service, i) => (
              <div key={i} className="bg-[#1E293B]/50 border border-slate-700 rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 hover:border-[#F59E0B]/50 hover:shadow-lg hover:shadow-[#F59E0B]/5 group">
                <div className="w-14 h-14 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center mb-6 group-hover:bg-[#F59E0B]/20 transition-colors">
                  <service.icon className="w-7 h-7 text-[#F59E0B]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - DEUX CHEMINS */}
      <section id="comment-ca-marche" className="py-24 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Deux chemins, une même mission</h2>
            <p className="text-slate-400 text-lg">Soyez 100% informé avant de faire votre choix</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* CARD CLIENT */}
            <div className="bg-gradient-to-b from-[#1E40AF]/10 to-[#0F172A] border border-[#1E40AF]/30 rounded-3xl p-8 md:p-12 flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className="text-5xl">🏦</div>
                <div>
                  <h3 className="text-3xl font-black text-white">Devenir Client</h3>
                  <p className="text-[#60A5FA]">Consultation gratuite, sans obligation</p>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">À quoi s'attendre :</h4>
                <ul className="space-y-3">
                  {["Analyse de votre situation financière", "Présentation des solutions adaptées", "Aucune pression de vente", "Confidentialité garantie", "Service 100% gratuit"].map((t, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300"><CheckCircle className="w-5 h-5 text-[#60A5FA] shrink-0" /> {t}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-10">
                <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Étapes :</h4>
                <div className="space-y-4">
                  {[
                    "Remplissez le formulaire",
                    "Un représentant accrédité AMF vous contacte sous 24h",
                    "Rencontre à votre convenance (en personne ou virtuel)",
                    "Recevez votre plan personnalisé"
                  ].map((t, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-[#1E40AF]/20 text-[#60A5FA] flex items-center justify-center font-bold shrink-0 border border-[#1E40AF]/30">{i + 1}</div>
                      <p className="text-slate-300 pt-1">{t}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <div className="bg-[#1E40AF]/10 border border-[#1E40AF]/30 rounded-xl p-5 mb-8 flex gap-4">
                  <Info className="w-6 h-6 text-[#60A5FA] shrink-0" />
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Notre représentant est un travailleur autonome accrédité AMF. Il est rémunéré par commissions sur les produits souscrits — la consultation initiale est toujours gratuite.
                  </p>
                </div>

                <button onClick={() => setIsClientModalOpen(true)} className="w-full bg-[#1E40AF] hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl transition-colors flex justify-center items-center gap-2">
                  Réserver ma consultation <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* CARD REPRÉSENTANT */}
            <div className="bg-gradient-to-b from-[#F59E0B]/10 to-[#0F172A] border border-[#F59E0B]/30 rounded-3xl p-8 md:p-12 flex flex-col relative overflow-hidden">
              <div className="flex items-center gap-4 mb-8">
                <div className="text-5xl">💼</div>
                <div>
                  <h3 className="text-3xl font-black text-white">Devenir Représentant</h3>
                  <p className="text-[#F59E0B]">Une carrière dans les services financiers</p>
                </div>
              </div>

              <div className="mb-8 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-xl p-5">
                <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Ce que c'est — SOYONS CLAIRS :</h4>
                <ul className="space-y-3">
                  {[
                    "Ce poste est un travail AUTONOME, non un emploi salarié",
                    "Rémunération 100% à commission",
                    "Permis AMF obligatoire (pris en charge)",
                    "Frais d'inscription modiques requis",
                    "Temps partiel ou plein — flexible"
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-200"><Info className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" /> {t}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-8">
                <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Inclus :</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Formation P.Q.A.P. complète", "Permis AMF pris en charge", "Mentorat personnalisé", "Outils technologiques fournis", "Horaire 100% flexible", "Possibilité de bâtir une équipe"].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-300 text-sm"><CheckCircle className="w-4 h-4 text-[#F59E0B] shrink-0" /> {t}</div>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Idéal si :</h4>
                <ul className="space-y-2 text-slate-300">
                  {["Tu veux changer de carrière", "Tu veux un revenu supplémentaire", "Tu veux aider ta communauté", "Tu rêves d'avoir ta propre entreprise", "Tu veux te former en finances"].map((t, i) => (
                    <li key={i}>✓ {t}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl p-5 mb-8 flex gap-4">
                  <AlertCircle className="w-6 h-6 text-[#F59E0B] shrink-0" />
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Il s'agit d'un modèle de travail autonome — comme un entrepreneur indépendant. Vos revenus dépendent directement de votre effort et de votre volume de ventes. Aucun salaire de base garanti.
                  </p>
                </div>

                <button onClick={() => setIsRepModalOpen(true)} className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-[#0F172A] font-bold text-lg py-4 rounded-xl transition-colors flex justify-center items-center gap-2">
                  Explorer cette opportunité <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 - PROCESSUS REPRÉSENTANT */}
      <section className="py-24 bg-[#0F172A] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">De zéro à représentant accrédité</h2>
            <p className="text-[#F59E0B] text-lg font-medium">Délai moyen: 4 à 8 semaines</p>
          </div>

          <div className="relative">
            {/* Horizontal Line for Desktop */}
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-1 bg-slate-800 rounded-full">
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#F59E0B]/30 to-[#F59E0B] rounded-full w-[100%] opacity-50"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {[
                { step: "1", title: "Entrevue", desc: "Rencontre sans engagement. On aligne vos objectifs.", time: "Jour 1" },
                { step: "2", title: "Inscription", desc: "Frais d'inscription modiques. Accès aux outils.", time: "Jour 1-2" },
                { step: "3", title: "Formation", desc: "Étude P.Q.A.P. avec tuteurs et coaching.", time: "Sem. 1-6" },
                { step: "4", title: "Examen AMF", desc: "Passage de l'examen officiel.", time: "Sem. 4-8" },
                { step: "5", title: "Stage", desc: "Période probatoire de 3 mois pour activer le permis.", time: "12 sem." },
                { step: "6", title: "Accréditation", desc: "Vous êtes 100% autonome! 🚀", time: "Final" }
              ].map((s, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#1E293B] border-4 border-[#0F172A] shadow-[0_0_0_2px_#F59E0B] text-[#F59E0B] flex items-center justify-center font-black text-xl mb-6">
                    {s.step}
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">{s.title}</h4>
                  <p className="text-slate-400 text-sm mb-3 h-16">{s.desc}</p>
                  <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-widest bg-[#F59E0B]/10 px-3 py-1 rounded-full">{s.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 max-w-2xl mx-auto bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
            <p className="text-slate-300">
              <span className="text-xl mr-2">💡</span>
              Des commissions sont possibles sous supervision AVANT même d'obtenir votre permis AMF.
            </p>
          </div>
        </div>
      </section>

      {/* MODALS */}
      <Dialog open={isClientModalOpen} onOpenChange={setIsClientModalOpen}>
        <DialogContent className="sm:max-w-[700px] bg-[#0F172A] border-[#1E40AF]/30 p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-white mb-3">🏦 Demande de consultation</h2>
              <p className="text-slate-400">Gratuit • Sans engagement • Réponse sous 24h</p>
            </div>

            {clientSuccess ? (
              <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-2xl p-10 text-center">
                <CheckCircle className="w-16 h-16 text-[#10B981] mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Demande reçue!</h3>
                <p className="text-slate-300">Nous vous contactons sous 24 heures pour planifier votre consultation gratuite.</p>
              </div>
            ) : (
              <form onSubmit={submitClient} className="space-y-6">
                {clientError && (
                  <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
                    {clientError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Prénom *</label>
                    <input required type="text" value={clientForm.prenom} onChange={e => setClientForm({...clientForm, prenom: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1E40AF]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Nom *</label>
                    <input required type="text" value={clientForm.nom} onChange={e => setClientForm({...clientForm, nom: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1E40AF]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                    <input required type="email" value={clientForm.email} onChange={e => setClientForm({...clientForm, email: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1E40AF]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Téléphone *</label>
                    <input required type="tel" value={clientForm.telephone} onChange={e => setClientForm({...clientForm, telephone: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1E40AF]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Ville/Province *</label>
                  <input required list="villes-list" type="text" value={clientForm.ville} onChange={e => setClientForm({...clientForm, ville: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1E40AF]" placeholder="Ex: Montréal, Québec..." />
                  <datalist id="villes-list">
                    <option value="Montréal" />
                    <option value="Québec" />
                    <option value="Laval" />
                    <option value="Gatineau" />
                    <option value="Longueuil" />
                    <option value="Sherbrooke" />
                    <option value="Lévis" />
                    <option value="Saguenay" />
                    <option value="Trois-Rivières" />
                    <option value="Terrebonne" />
                    <option value="Saint-Jean-sur-Richelieu" />
                    <option value="Brossard" />
                    <option value="Repentigny" />
                    <option value="Saint-Jérôme" />
                    <option value="Drummondville" />
                    <option value="Granby" />
                    <option value="Blainville" />
                    <option value="Saint-Hyacinthe" />
                    <option value="Shawinigan" />
                    <option value="Rimouski" />
                    <option value="Châteauguay" />
                    <option value="Victoriaville" />
                    <option value="Rouyn-Noranda" />
                    <option value="Boucherville" />
                    <option value="Mirabel" />
                    <option value="Mascouche" />
                    <option value="Joliette" />
                    <option value="Montérégie" />
                    <option value="Laurentides" />
                    <option value="Lanaudière" />
                    <option value="Estrie" />
                    <option value="Outaouais" />
                    <option value="Mauricie" />
                    <option value="Abitibi-Témiscamingue" />
                    <option value="Côte-Nord" />
                    <option value="Gaspésie" />
                    <option value="Ontario" />
                    <option value="Nouveau-Brunswick" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Situation *</label>
                  <select required value={clientForm.situation} onChange={e => setClientForm({...clientForm, situation: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1E40AF] appearance-none">
                    <option value="">Sélectionnez votre besoin principal</option>
                    <option value="Protéger famille">Je veux protéger ma famille</option>
                    <option value="Planifier retraite">Je veux planifier ma retraite</option>
                    <option value="Réduire dettes">Je veux réduire mes dettes</option>
                    <option value="Investir">Je veux investir</option>
                    <option value="Autre">Autre / Je ne sais pas encore</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message (optionnel)</label>
                  <textarea rows={3} value={clientForm.message} onChange={e => setClientForm({...clientForm, message: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1E40AF]"></textarea>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed text-center">
                  En soumettant ce formulaire, vous acceptez d'être contacté par un représentant autonome accrédité AMF. Aucune obligation d'achat.
                </p>

                <button disabled={clientLoading} type="submit" className="w-full bg-[#1E40AF] hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl transition-colors disabled:opacity-50">
                  {clientLoading ? 'Envoi en cours...' : 'Envoyer ma demande →'}
                </button>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRepModalOpen} onOpenChange={setIsRepModalOpen}>
        <DialogContent className="sm:max-w-[700px] bg-[#0F172A] border-[#F59E0B]/30 p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent"></div>
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white mb-3">💼 Demande d'information — Carrière</h2>
              <p className="text-slate-400">Entrevue sans engagement</p>
            </div>

            <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl p-4 mb-8">
              <p className="text-sm text-[#F59E0B] font-medium text-center">
                Rappel : Il s'agit d'un travail autonome rémunéré à commission, non un emploi salarié.
              </p>
            </div>

            {repSuccess ? (
              <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-2xl p-10 text-center">
                <CheckCircle className="w-16 h-16 text-[#10B981] mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Candidature reçue!</h3>
                <p className="text-slate-300">Un représentant vous contactera sous peu pour planifier une entrevue sans engagement.</p>
              </div>
            ) : (
              <form onSubmit={submitRep} className="space-y-6">
                {repError && (
                  <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-sm">
                    {repError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Prénom *</label>
                    <input required type="text" value={repForm.prenom} onChange={e => setRepForm({...repForm, prenom: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F59E0B]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Nom *</label>
                    <input required type="text" value={repForm.nom} onChange={e => setRepForm({...repForm, nom: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F59E0B]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                    <input required type="email" value={repForm.email} onChange={e => setRepForm({...repForm, email: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F59E0B]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Téléphone *</label>
                    <input required type="tel" value={repForm.telephone} onChange={e => setRepForm({...repForm, telephone: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F59E0B]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Ville/Province *</label>
                  <input required list="villes-list" type="text" value={repForm.ville} onChange={e => setRepForm({...repForm, ville: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F59E0B]" placeholder="Ex: Montréal, Québec..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Situation actuelle *</label>
                    <select required value={repForm.situation} onChange={e => setRepForm({...repForm, situation: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F59E0B] appearance-none">
                      <option value="">Sélectionnez</option>
                      <option value="Employé TP">Employé(e) à temps plein</option>
                      <option value="Employé TPartiel">Employé(e) à temps partiel</option>
                      <option value="Autonome">Travailleur(se) autonome</option>
                      <option value="Recherche emploi">En recherche d'emploi</option>
                      <option value="Étudiant">Étudiant(e)</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Disponibilité *</label>
                    <select required value={repForm.disponibilite} onChange={e => setRepForm({...repForm, disponibilite: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F59E0B] appearance-none">
                      <option value="">Sélectionnez</option>
                      <option value="Temps partiel">Temps partiel (en parallèle)</option>
                      <option value="Temps plein">Temps plein</option>
                      <option value="Flexible">Les deux selon les opportunités</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Expérience en finances ? *</label>
                    <select required value={repForm.experience} onChange={e => setRepForm({...repForm, experience: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F59E0B] appearance-none">
                      <option value="">Sélectionnez</option>
                      <option value="Aucune">Aucune expérience</option>
                      <option value="Quelques notions">Quelques notions</option>
                      <option value="Significative">Expérience significative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Motivation principale *</label>
                    <select required value={repForm.motivation} onChange={e => setRepForm({...repForm, motivation: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F59E0B] appearance-none">
                      <option value="">Sélectionnez</option>
                      <option value="Revenu">Revenu supplémentaire</option>
                      <option value="Changement">Changement de carrière</option>
                      <option value="Aider">Aider ma communauté</option>
                      <option value="Entreprise">Bâtir ma propre entreprise</option>
                      <option value="Formation">Formation en finances</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message (optionnel)</label>
                  <textarea rows={3} value={repForm.message} onChange={e => setRepForm({...repForm, message: e.target.value})} className="w-full bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#F59E0B]"></textarea>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[#F59E0B]/5 rounded-xl border border-[#F59E0B]/20">
                  <input type="checkbox" required checked={repForm.consenti} onChange={e => setRepForm({...repForm, consenti: e.target.checked})} className="mt-1 w-5 h-5 accent-[#F59E0B] shrink-0" />
                  <p className="text-xs text-slate-300">
                    Je comprends qu'il s'agit d'un travail autonome rémunéré à commission, non un emploi salarié, et que des frais d'inscription modiques sont requis.
                  </p>
                </div>

                <button disabled={repLoading} type="submit" className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-[#0F172A] font-bold text-lg py-4 rounded-xl transition-colors disabled:opacity-50">
                  {repLoading ? 'Envoi en cours...' : 'Soumettre ma candidature →'}
                </button>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* SECTION 8 - FOOTER */}
      <footer className="bg-[#0B1120] border-t border-slate-800 pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center">
              <span className="text-[#0F172A] font-black text-sm">P</span>
            </div>
            <span className="text-white font-bold text-xl tracking-wide">Planify | Services Financiers</span>
          </div>
          
          <p className="text-slate-300 mb-2">Représentant accrédité AMF — Québec</p>
          <p className="text-slate-400 mb-8">Supervisé par l'Autorité des marchés financiers du Québec</p>
          
          <div className="flex justify-center items-center gap-4 mb-12">
            <Link href="/politique-confidentialite"
              className="text-slate-500 hover:text-slate-300 text-sm transition-colors underline underline-offset-2">
              Politique de confidentialité
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/conditions-utilisation"
              className="text-slate-500 hover:text-slate-300 text-sm transition-colors underline underline-offset-2">
              Conditions d'utilisation
            </Link>
          </div>
          
          <p className="text-xs text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Les services financiers sont offerts par un représentant autonome accrédité par l'AMF. Les résultats peuvent varier selon la situation individuelle de chaque client.
          </p>
          
          <p className="text-sm text-slate-500">© 2025 Planify. Tous droits réservés.</p>
        </div>
      </footer>

    </div>
  );
}
