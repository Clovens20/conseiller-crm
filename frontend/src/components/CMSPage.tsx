'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, Save, Eye, Globe, Shield, FileText, BookOpen, Heart, TrendingUp, PiggyBank, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CMSPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- TOUS LES CONTENUS COMPLETS PAR DÉFAUT ---
  const DEFAULTS = {
    landing: { 
      hero: { 
        title: 'Votre avenir financier commence ici', 
        subtitle: 'Que vous cherchiez à protéger votre famille ou à bâtir une carrière dans les services financiers, nous avons une solution pour vous.' 
      }, 
      stats: { years: '45 ans', families: '8M+', list: 'NYSE' } 
    },
    assurance: { 
      hero: { 
        badge: '✅ Accrédité AMF Québec', 
        title: "Assurance Vie Temporaire au Québec", 
        subtitle: "Protégez votre famille avec la couverture la plus abordable du marché. Consultation gratuite, soumission en 24h, aucune pression." 
      }, 
      intro: { 
        heading: "Pourquoi l'assurance vie temporaire est le meilleur choix pour les familles québécoises", 
        p1: "L'assurance vie temporaire, c'est la protection la plus efficace pour votre dollar. Elle garantit que si vous n'êtes plus là, votre famille ne perd pas sa maison, ne s'endette pas, et maintient son niveau de vie — le temps que vos enfants grandissent et que votre hypothèque soit remboursée.", 
        p2: "Contrairement à l'assurance permanente qui coûte 5 à 10 fois plus cher, la temporaire vous donne une couverture maximale pendant la période où vous en avez le plus besoin : vos années de revenus actifs. Achetez du temporaire et investissez la différence — cette philosophie aide les familles québécoises depuis 1977." 
      },
      benefits: { 
        title: "Les avantages de l'assurance vie temporaire", 
        items: [
          { icon: "💰", title: "Prix abordable", description: "Couverture de 500 000 $ dès 25 $/mois pour un adulte en bonne santé." },
          { icon: "🏠", title: "Protège votre hypothèque", description: "Si vous décédez, votre famille garde la maison. Fini la pression de vendre en urgence." },
          { icon: "👨👩👧👦", title: "Remplace votre revenu", description: "Le capital versé permet à votre famille de maintenir son niveau de vie." },
          { icon: "📋", title: "Simple à comprendre", description: "Pas de valeur de rachat compliquée, pas de frais cachés. Une prime fixe." },
          { icon: "⚡", title: "Soumission en 24h", description: "Notre conseiller vous contacte rapidement et vous présente des options." },
          { icon: "🏅", title: "Accrédité AMF", description: "Tous nos représentants sont supervisés par l'Autorité des marchés financiers." }
        ] 
      },
      howItWorks: {
        title: "Comment obtenir votre assurance vie en 4 étapes",
        steps: [
          { number: "1", title: "Remplissez le formulaire gratuit", description: "2 minutes suffisent. Indiquez votre âge et situation." },
          { number: "2", title: "Appel sous 24h", description: "Un conseiller prend le temps de comprendre vos objectifs." },
          { number: "3", title: "Analyse personnalisée", description: "Votre conseiller calcule le montant recommandé." },
          { number: "4", title: "Activez votre protection", description: "Signez votre contrat et votre famille est protégée." }
        ]
      },
      faqs: { 
        title: "Questions fréquentes — Assurance vie", 
        items: [
          { question: "C'est quoi l'assurance vie temporaire?", answer: "C'est une protection qui verse un montant si vous décédez pendant la durée du contrat (10, 20 ou 30 ans)." },
          { question: "Combien ça coûte?", answer: "Pour un adulte de 35 ans en santé, 500 000$ peut coûter entre 25$ et 50$ par mois." }
        ] 
      }
    },
    fonds: { 
      hero: { 
        badge: '📈 Accrédité AMF Québec', 
        title: "Fonds de Placement & Investissement au Québec", 
        subtitle: "REER, CELI, fonds distincts et communs — la bonne stratégie pour bâtir votre retraite. Analyse gratuite de votre profil investisseur." 
      }, 
      intro: { 
        heading: "Faites travailler votre argent pour vous", 
        p1: "Mettre de l'argent de côté c'est bien. Le faire fructifier intelligemment, c'est mieux. Pourtant, la majorité des Québécois laissent leur argent dormir dans un compte bancaire à 0,5 % d'intérêt.", 
        p2: "Que vous souhaitiez maximiser votre REER, ouvrir un CELI, ou diversifier avec des fonds distincts et communs, nos conseillers accrédités AMF vous bâtissent un programme complet." 
      },
      benefits: { 
        title: "Pourquoi investir avec un conseiller Planify ?", 
        items: [
          { icon: "🎯", title: "Stratégie personnalisée", description: "Votre plan est construit selon votre situation unique." },
          { icon: "🛡️", title: "Fonds distincts garantis", description: "Protection du capital à l'échéance et au décès." },
          { icon: "💸", title: "Optimisation fiscale", description: "Maximisez vos droits REER et CELI pour payer moins d'impôts." }
        ] 
      },
      howItWorks: {
        title: "De zéro à investisseur en 4 étapes",
        steps: [
          { number: "1", title: "Bilan financier gratuit", description: "Analyse de vos revenus, dettes et épargne." },
          { number: "2", title: "Profil investisseur", description: "On détermine votre tolérance au risque." },
          { number: "3", title: "Présentation du plan", description: "Vous recevez un plan complet et clair." },
          { number: "4", title: "Démarrage et suivi", description: "On active votre plan et on fait un suivi annuel." }
        ]
      },
      faqs: { 
        title: "Questions fréquentes — Investissement", 
        items: [
          { question: "Quelle différence entre REER et CELI?", answer: "Le REER donne une déduction fiscale maintenant, le CELI est libre d'impôt au retrait." }
        ] 
      }
    },
    dettes: { 
      hero: { 
        badge: '🏆 Accrédité AMF Québec', 
        title: "Éliminez vos dettes et libérez-vous financièrement", 
        subtitle: "Un plan concret pour rembourser vos dettes et votre hypothèque plus vite qu'avec votre banque. Analyse gratuite, résultats réels." 
      }, 
      intro: { 
        heading: "Les dettes coûtent plus cher que vous pensez", 
        p1: "Un solde de 5 000 $ sur une carte de crédit à 19,99 % vous coûtera plus de 10 000 $ en intérêts et prendra 15 ans à rembourser.", 
        p2: "Chez Planify, on vous bâtit un plan d'élimination des dettes qui tient compte de votre hypothèque, vos cartes et votre budget." 
      },
      benefits: { 
        title: "Ce qu'apporte un plan d'élimination des dettes", 
        items: [
          { icon: "🗓️", title: "Date de libération réelle", description: "Vous saurez exactement quand vous serez libre — une date précise." },
          { icon: "💵", title: "Économies en intérêts", description: "Un bon ordre de remboursement évite des milliers de dollars en intérêts." }
        ] 
      },
      howItWorks: {
        title: "Votre plan de remboursement en 4 étapes",
        steps: [
          { number: "1", title: "Inventaire complet", description: "On liste toutes vos dettes avec les taux et soldes." },
          { number: "2", title: "Analyse du budget", description: "On identifie votre capacité réelle de remboursement." },
          { number: "3", title: "Construction du plan", description: "Votre conseiller détermine l'ordre optimal." },
          { number: "4", title: "Suivi et ajustements", description: "On révise le plan annuellement." }
        ]
      },
      faqs: { 
        title: "Questions fréquentes — Dettes", 
        items: [
          { question: "Quelle dette payer en premier?", answer: "La méthode avalanche (taux le plus élevé) est la plus efficace." }
        ] 
      }
    },
    analyse: {
      hero: { badge: '🆓 100 % Gratuit — Accrédité AMF Québec', title: "Bilan financier complet et gratuit", subtitle: "En 60 minutes, un conseiller accrédité AMF analyse votre situation complète : dettes, assurances, épargne et retraite." },
      intro: { heading: "Votre argent travaille-t-il aussi fort que vous ?", p1: "La majorité des familles québécoises n'ont jamais eu de regard externe professionnel.", p2: "Le bilan Planify est comme un check-up médical pour vos finances." },
      benefits: { title: "Ce que couvre votre bilan", items: [{icon: '💳', title: 'Analyse des dettes', description: 'Hypothèque, cartes, prêts.'}] },
      howItWorks: {
        title: "Comment ça marche",
        steps: [
          { number: "1", title: "Contact", description: "Planifiez votre appel." },
          { number: "2", title: "Bilan", description: "Analyse complète." },
          { number: "3", title: "Plan", description: "Recommandations." },
          { number: "4", title: "Suivi", description: "Mise en action." }
        ]
      },
      faqs: { title: "Questions fréquentes", items: [{question: 'Est-ce vraiment gratuit?', answer: 'Oui, 100% gratuit.'}] }
    },
    guide: { 
      hero: { 
        title: "Débloquez votre Guide Financier", 
        subtitle: "Entrez vos informations pour accéder gratuitement au guide de 10 pages sur les finances québécoises. Assurance, Dettes, REER & CELI." 
      } 
    },
    legal: {
      privacy: `
        <h2>1. RESPONSABLE DE LA PROTECTION DES RENSEIGNEMENTS PERSONNELS</h2>
        <p>Conformément à la Loi 25 du Québec, un responsable de la protection des renseignements personnels a été désigné au sein de notre organisation.</p>
        <p>Pour toute question concernant la protection de vos renseignements personnels, vous pouvez nous contacter:</p>
        <p>📧 Email: <a href="mailto:planifier@konektegroup.com" class="text-blue-400 hover:underline">planifier@konektegroup.com</a></p>
        
        <h2>2. RENSEIGNEMENTS COLLECTÉS</h2>
        <p>Nous collectons uniquement les renseignements nécessaires à la prestation de nos services.</p>
        <ul>
          <li>Informations d'identification (Nom, Email, Téléphone)</li>
          <li>Informations financières générales</li>
          <li>Informations de navigation</li>
        </ul>
      `,
      terms: `
        <h2>1. ACCEPTATION DES CONDITIONS</h2>
        <p>En accédant à planifier.konektegroup.com et en utilisant nos services, vous acceptez d'être lié par les présentes conditions d'utilisation.</p>
        
        <h2>2. DESCRIPTION DES SERVICES</h2>
        <p>Planify est une plateforme de gestion de la relation client (CRM) destinée aux représentants autonomes accrédités AMF au Québec.</p>
        <p><strong>Important:</strong> Planify n'est pas un conseiller financier. Nous mettons en relation des clients avec des représentants accrédités AMF.</p>
        
        <h2>3. STATUT DES REPRÉSENTANTS</h2>
        <p>Les représentants utilisant notre plateforme sont des TRAVAILLEURS AUTONOMES indépendants.</p>
      `
    }
  };

  const [landing, setLanding] = useState<any>(DEFAULTS.landing);
  const [assurance, setAssurance] = useState<any>(DEFAULTS.assurance);
  const [fonds, setFonds] = useState<any>(DEFAULTS.fonds);
  const [dettes, setDettes] = useState<any>(DEFAULTS.dettes);
  const [analyse, setAnalyse] = useState<any>(DEFAULTS.analyse);
  const [guide, setGuide] = useState<any>(DEFAULTS.guide);
  const [legal, setLegal] = useState<any>(DEFAULTS.legal);

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('site_content').select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        const find = (slug: string, section: string, def: any) => {
          const found = data.find(d => d.page_slug === slug && d.section_id === section);
          return found ? { ...def, ...found.content } : def;
        };
        setLanding(find('landing', 'main', DEFAULTS.landing));
        setAssurance(find('assurance-vie-temporaire', 'main', DEFAULTS.assurance));
        setFonds(find('fonds-placement', 'main', DEFAULTS.fonds));
        setDettes(find('elimination-dettes', 'main', DEFAULTS.dettes));
        setAnalyse(find('analyse-financiere', 'main', DEFAULTS.analyse));
        setGuide(find('guide', 'main', DEFAULTS.guide));
        
        const priv = data.find(d => d.page_slug === 'privacy' && d.section_id === 'full');
        const term = data.find(d => d.page_slug === 'terms' && d.section_id === 'full');
        setLegal({
          privacy: priv?.content?.content || DEFAULTS.legal.privacy,
          terms: term?.content?.content || DEFAULTS.legal.terms
        });
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const saveSection = async (slug: string, content: any, sectionId: string = 'main') => {
    setSaving(true);
    try {
      const { error } = await supabase.from('site_content').upsert({ page_slug: slug, section_id: sectionId, content: content, updated_at: new Date().toISOString() }, { onConflict: 'page_slug,section_id' });
      if (error) throw error;
      toast.success(`Contenu mis à jour !`);
    } catch (err: any) { toast.error('Erreur : ' + err.message); } finally { setSaving(false); }
  };

  const ServiceEditor = ({ data, setData, slug }: any) => (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {/* HERO */}
        <AccordionItem value="hero" className="border border-slate-700 bg-slate-900/50 rounded-xl px-4">
          <AccordionTrigger className="text-white font-bold hover:no-underline">Section Hero</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            <div className="grid gap-2"><Label className="text-slate-400 uppercase text-[10px] font-black">Badge</Label><Input className="bg-slate-900 border-slate-700" value={data.hero?.badge} onChange={e => setData({...data, hero: {...data.hero, badge: e.target.value}})} /></div>
            <div className="grid gap-2"><Label className="text-slate-400 uppercase text-[10px] font-black">Titre</Label><Input className="bg-slate-900 border-slate-700" value={data.hero?.title} onChange={e => setData({...data, hero: {...data.hero, title: e.target.value}})} /></div>
            <div className="grid gap-2"><Label className="text-slate-400 uppercase text-[10px] font-black">Sous-titre</Label><textarea className="bg-slate-900 border-slate-700 rounded-lg p-3 text-sm min-h-[80px]" value={data.hero?.subtitle} onChange={e => setData({...data, hero: {...data.hero, subtitle: e.target.value}})} /></div>
          </AccordionContent>
        </AccordionItem>
        {/* INTRO */}
        <AccordionItem value="intro" className="border border-slate-700 bg-slate-900/50 rounded-xl px-4">
          <AccordionTrigger className="text-white font-bold hover:no-underline">Introduction</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            <div className="grid gap-2"><Label className="text-slate-400 uppercase text-[10px] font-black">Titre Intro</Label><Input className="bg-slate-900 border-slate-700" value={data.intro?.heading} onChange={e => setData({...data, intro: {...data.intro, heading: e.target.value}})} /></div>
            <div className="grid gap-2"><Label className="text-slate-400 uppercase text-[10px] font-black">Paragraphe 1</Label><textarea className="bg-slate-900 border-slate-700 rounded-lg p-3 text-sm min-h-[100px]" value={data.intro?.p1} onChange={e => setData({...data, intro: {...data.intro, p1: e.target.value}})} /></div>
            <div className="grid gap-2"><Label className="text-slate-400 uppercase text-[10px] font-black">Paragraphe 2</Label><textarea className="bg-slate-900 border-slate-700 rounded-lg p-3 text-sm min-h-[100px]" value={data.intro?.p2} onChange={e => setData({...data, intro: {...data.intro, p2: e.target.value}})} /></div>
          </AccordionContent>
        </AccordionItem>
        {/* BÉNÉFICES */}
        <AccordionItem value="benefits" className="border border-slate-700 bg-slate-900/50 rounded-xl px-4">
          <AccordionTrigger className="text-white font-bold hover:no-underline">Bénéfices</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            <div className="grid gap-2 mb-4"><Label className="text-slate-400 uppercase text-[10px] font-black">Titre de section</Label><Input className="bg-slate-900 border-slate-700" value={data.benefits?.title} onChange={e => setData({...data, benefits: {...data.benefits, title: e.target.value}})} /></div>
            {data.benefits?.items?.map((item: any, i: number) => (
              <div key={i} className="p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-3 relative">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-400" onClick={() => { const ni = [...data.benefits.items]; ni.splice(i, 1); setData({...data, benefits: {...data.benefits, items: ni}}); }}><Trash2 className="w-4 h-4" /></Button>
                <div className="grid grid-cols-[80px_1fr] gap-3"><div><Label className="text-[10px] font-black">Icon</Label><Input className="bg-slate-900 border-slate-700 text-center text-xl" value={item.icon} onChange={e => { const ni = [...data.benefits.items]; ni[i].icon = e.target.value; setData({...data, benefits: {...data.benefits, items: ni}}); }} /></div><div><Label className="text-[10px] font-black">Titre</Label><Input className="bg-slate-900 border-slate-700" value={item.title} onChange={e => { const ni = [...data.benefits.items]; ni[i].title = e.target.value; setData({...data, benefits: {...data.benefits, items: ni}}); }} /></div></div>
                <div><Label className="text-[10px] font-black">Description</Label><Input className="bg-slate-900 border-slate-700" value={item.description} onChange={e => { const ni = [...data.benefits.items]; ni[i].description = e.target.value; setData({...data, benefits: {...data.benefits, items: ni}}); }} /></div>
              </div>
            ))}
            <Button variant="outline" className="w-full border-dashed border-slate-600 text-slate-400" onClick={() => { const ni = [...(data.benefits?.items || [])]; ni.push({ icon: '✅', title: 'Nouveau', description: 'Description...' }); setData({...data, benefits: {...data.benefits, items: ni}}); }}><Plus className="w-4 h-4 mr-2" /> Ajouter un bénéfice</Button>
          </AccordionContent>
        </AccordionItem>
        {/* STEPS */}
        <AccordionItem value="steps" className="border border-slate-700 bg-slate-900/50 rounded-xl px-4">
          <AccordionTrigger className="text-white font-bold hover:no-underline">Étapes (Processus)</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            <div className="grid gap-2 mb-4"><Label className="text-slate-400 uppercase text-[10px] font-black">Titre de section</Label><Input className="bg-slate-900 border-slate-700" value={data.howItWorks?.title} onChange={e => setData({...data, howItWorks: {...data.howItWorks, title: e.target.value}})} /></div>
            {data.howItWorks?.steps?.map((step: any, i: number) => (
              <div key={i} className="p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-3 relative">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-400" onClick={() => { const ns = [...data.howItWorks.steps]; ns.splice(i, 1); setData({...data, howItWorks: {...data.howItWorks, steps: ns}}); }}><Trash2 className="w-4 h-4" /></Button>
                <div className="grid grid-cols-[60px_1fr] gap-3"><div><Label className="text-[10px] font-black">N°</Label><Input className="bg-slate-900 border-slate-700 text-center" value={step.number} onChange={e => { const ns = [...data.howItWorks.steps]; ns[i].number = e.target.value; setData({...data, howItWorks: {...data.howItWorks, steps: ns}}); }} /></div><div><Label className="text-[10px] font-black">Titre</Label><Input className="bg-slate-900 border-slate-700" value={step.title} onChange={e => { const ns = [...data.howItWorks.steps]; ns[i].title = e.target.value; setData({...data, howItWorks: {...data.howItWorks, steps: ns}}); }} /></div></div>
                <div><Label className="text-[10px] font-black">Description</Label><Input className="bg-slate-900 border-slate-700" value={step.description} onChange={e => { const ns = [...data.howItWorks.steps]; ns[i].description = e.target.value; setData({...data, howItWorks: {...data.howItWorks, steps: ns}}); }} /></div>
              </div>
            ))}
            <Button variant="outline" className="w-full border-dashed border-slate-600 text-slate-400" onClick={() => { const ns = [...(data.howItWorks?.steps || [])]; ns.push({ number: (ns.length+1).toString(), title: 'Nouvelle étape', description: 'Description...' }); setData({...data, howItWorks: {...data.howItWorks, steps: ns}}); }}><Plus className="w-4 h-4 mr-2" /> Ajouter une étape</Button>
          </AccordionContent>
        </AccordionItem>
        {/* FAQS */}
        <AccordionItem value="faqs" className="border border-slate-700 bg-slate-900/50 rounded-xl px-4">
          <AccordionTrigger className="text-white font-bold hover:no-underline">FAQ (Questions/Réponses)</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-4">
            {data.faqs?.items?.map((faq: any, i: number) => (
              <div key={i} className="p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-3 relative">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-400" onClick={() => { const ni = [...data.faqs.items]; ni.splice(i, 1); setData({...data, faqs: {...data.faqs, items: ni}}); }}><Trash2 className="w-4 h-4" /></Button>
                <div><Label className="text-[10px] font-black">Question</Label><Input className="bg-slate-900 border-slate-700" value={faq.question} onChange={e => { const ni = [...data.faqs.items]; ni[i].question = e.target.value; setData({...data, faqs: {...data.faqs, items: ni}}); }} /></div>
                <div><Label className="text-[10px] font-black">Réponse</Label><textarea className="bg-slate-900 border-slate-700 rounded-lg p-3 text-sm min-h-[80px]" value={faq.answer} onChange={e => { const ni = [...data.faqs.items]; ni[i].answer = e.target.value; setData({...data, faqs: {...data.faqs, items: ni}}); }} /></div>
              </div>
            ))}
            <Button variant="outline" className="w-full border-dashed border-slate-600 text-slate-400" onClick={() => { const ni = [...(data.faqs?.items || [])]; ni.push({ question: 'Nouvelle question', answer: 'Réponse...' }); setData({...data, faqs: {...data.faqs, items: ni}}); }}><Plus className="w-4 h-4 mr-2" /> Ajouter une question</Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex justify-end pt-4"><Button disabled={saving} onClick={() => saveSection(slug, data)} className="bg-blue-600 hover:bg-blue-500 font-bold px-10 py-6 rounded-2xl active:scale-95 transition-all">{saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />} Enregistrer cette page</Button></div>
    </div>
  );

  if (loading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div><h1 className="text-3xl font-black text-white">Gestion de contenu</h1><p className="text-slate-400">Modifiez absolument tout le contenu de vos pages</p></div>
        <Button variant="outline" onClick={() => window.open('/', '_blank')} className="bg-slate-800 border-slate-700 text-white"><Eye className="w-4 h-4 mr-2" /> Voir le site</Button>
      </div>
      <Tabs defaultValue="landing" className="w-full">
        <div className="overflow-x-auto pb-2"><TabsList className="flex w-max md:w-full bg-slate-800 border-slate-700 h-auto p-1"><TabsTrigger value="landing" className="py-2.5 px-4 flex gap-2"><Globe className="w-4 h-4" /> Accueil</TabsTrigger><TabsTrigger value="assurance" className="py-2.5 px-4 flex gap-2"><Heart className="w-4 h-4" /> Assurance</TabsTrigger><TabsTrigger value="fonds" className="py-2.5 px-4 flex gap-2"><TrendingUp className="w-4 h-4" /> Fonds</TabsTrigger><TabsTrigger value="dettes" className="py-2.5 px-4 flex gap-2"><PiggyBank className="w-4 h-4" /> Dettes</TabsTrigger><TabsTrigger value="analyse" className="py-2.5 px-4 flex gap-2"><FileText className="w-4 h-4" /> Analyse</TabsTrigger><TabsTrigger value="guide" className="py-2.5 px-4 flex gap-2"><BookOpen className="w-4 h-4" /> Guide</TabsTrigger><TabsTrigger value="legal" className="py-2.5 px-4 flex gap-2"><Shield className="w-4 h-4" /> Légal</TabsTrigger></TabsList></div>
        <TabsContent value="landing" className="pt-4"><Card className="bg-slate-800 border-slate-700 text-white p-6"><ServiceEditor data={landing} setData={setLanding} slug="landing" /></Card></TabsContent>
        <TabsContent value="assurance" className="pt-4"><Card className="bg-slate-800 border-slate-700 text-white p-6"><ServiceEditor data={assurance} setData={setAssurance} slug="assurance-vie-temporaire" /></Card></TabsContent>
        <TabsContent value="fonds" className="pt-4"><Card className="bg-slate-800 border-slate-700 text-white p-6"><ServiceEditor data={fonds} setData={setFonds} slug="fonds-placement" /></Card></TabsContent>
        <TabsContent value="dettes" className="pt-4"><Card className="bg-slate-800 border-slate-700 text-white p-6"><ServiceEditor data={dettes} setData={setDettes} slug="elimination-dettes" /></Card></TabsContent>
        <TabsContent value="analyse" className="pt-4"><Card className="bg-slate-800 border-slate-700 text-white p-6"><ServiceEditor data={analyse} setData={setAnalyse} slug="analyse-financiere" /></Card></TabsContent>
        <TabsContent value="guide" className="pt-4"><Card className="bg-slate-800 border-slate-700 text-white p-6 space-y-6"><div><Label className="text-slate-400 uppercase text-[10px] font-black">Titre</Label><Input className="bg-slate-900 border-slate-700" value={guide.hero?.title} onChange={e => setGuide({...guide, hero: {...guide.hero, title: e.target.value}})} /></div><div><Label className="text-slate-400 uppercase text-[10px] font-black">Sous-titre</Label><textarea className="bg-slate-900 border-slate-700 rounded-xl p-4 text-sm min-h-[100px]" value={guide.hero?.subtitle} onChange={e => setGuide({...guide, hero: {...guide.hero, subtitle: e.target.value}})} /></div><Button disabled={saving} onClick={() => saveSection('guide', guide)} className="bg-blue-600 hover:bg-blue-500 w-full py-6 font-bold rounded-2xl"><Save className="w-5 h-5 mr-2" /> Enregistrer Guide</Button></Card></TabsContent>
        <TabsContent value="legal" className="pt-4"><Card className="bg-slate-800 border-slate-700 text-white p-6 space-y-8">
            <div className="grid gap-3">
              <Label className="text-slate-400 uppercase text-[10px] font-black tracking-widest ml-1">Politique de Confidentialité (HTML)</Label>
              <textarea className="bg-slate-900 border-slate-700 rounded-xl p-4 text-xs font-mono min-h-[350px] resize-y" value={legal.privacy} onChange={e => setLegal({...legal, privacy: e.target.value})} />
              <div className="flex justify-end mt-2"><Button variant="outline" className="text-blue-400 border-blue-400/20 px-8 py-5 rounded-xl font-bold" onClick={() => saveSection('privacy', { content: legal.privacy, title: 'Politique de confidentialité', last_updated: new Date().toLocaleDateString('fr-CA') }, 'full')}>Enregistrer Politique</Button></div>
            </div>
            <div className="grid gap-3 border-t border-slate-700/50 pt-8">
              <Label className="text-slate-400 uppercase text-[10px] font-black tracking-widest ml-1">Conditions d'Utilisation (HTML)</Label>
              <textarea className="bg-slate-900 border-slate-700 rounded-xl p-4 text-xs font-mono min-h-[350px] resize-y" value={legal.terms} onChange={e => setLegal({...legal, terms: e.target.value})} />
              <div className="flex justify-end mt-2"><Button variant="outline" className="text-blue-400 border-blue-400/20 px-8 py-5 rounded-xl font-bold" onClick={() => saveSection('terms', { content: legal.terms, title: "Conditions d'utilisation", last_updated: new Date().toLocaleDateString('fr-CA') }, 'full')}>Enregistrer Conditions</Button></div>
            </div>
          </Card></TabsContent>
      </Tabs>
    </div>
  );
}
