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
import RichTextEditor from '@/components/RichTextEditor';

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
      privacy: {
        hero: {
          tag: 'Document légal',
          title: 'Politique de confidentialité',
          description: 'Vos renseignements personnels sont protégés conformément à la Loi 25 du Québec et à la législation fédérale applicable.',
          meta: { effectiveDate: '1er janvier 2024', lastUpdate: '11 mai 2025', version: '2.1' }
        },
        sections: [
          { id: 's1', number: '1', title: "Identification de l'entreprise responsable", content: `<p>La présente Politique de confidentialité est publiée par <strong>Konekte Group</strong>, exploitant la plateforme <strong>Planify</strong> accessible à l'adresse <em>planifier.konektegroup.com</em>.</p><div class="card"><div class="card-title">Responsable de la protection des renseignements personnels (RPRP)</div><p style="margin:0">Conformément à la <em>Loi modernisant des dispositions législatives en matière de protection des renseignements personnels</em> (Loi 25), Konekte Group a désigné un Responsable de la protection des renseignements personnels. Ses coordonnées figurent à la section 13 de la présente politique.</p></div><p>Nos représentants sont des travailleurs autonomes accrédités par l'<strong>Autorité des marchés financiers (AMF) du Québec</strong>. À ce titre, la collecte et le traitement de certains renseignements sont également soumis aux obligations réglementaires de l'AMF.</p>` },
          { id: 's2', number: '2', title: "Portée de la politique", content: `<p>Cette politique s'applique à toute personne qui :</p><ul><li>Visite le site Web <em>planifier.konektegroup.com</em> et ses sous-pages ;</li><li>Remplit un formulaire de prise de contact, de consultation ou d'inscription ;</li><li>Communique par courriel, téléphone ou tout autre canal avec nos représentants ou notre équipe administrative ;</li><li>Utilise la plateforme CRM Planify en tant que représentant accrédité.</li></ul><p>Elle s'applique dans le respect des lois suivantes :</p><ul><li><strong>Loi 25 (Québec)</strong> — Loi modernisant des dispositions législatives en matière de protection des renseignements personnels ;</li><li><strong>Loi sur la protection des renseignements personnels et les documents électroniques (LPRPDE)</strong> — Canada ;</li><li>Règlements applicables de l'<strong>AMF du Québec</strong> ;</li><li>Toute autre loi provinciale ou fédérale pertinente.</li></ul>` },
          { id: 's3', number: '3', title: "Renseignements personnels collectés", content: `<p>Nous collectons uniquement les renseignements nécessaires aux finalités déclarées (<em>principe de minimisation</em>). Voici les catégories de renseignements susceptibles d'être collectés :</p><h3>3.1 Renseignements d'identification</h3><ul><li>Nom complet, prénom</li><li>Adresse postale</li><li>Numéro de téléphone</li><li>Adresse courriel</li><li>Date de naissance (si requis pour un produit financier)</li></ul><h3>3.2 Renseignements financiers et professionnels</h3><ul><li>Situation financière générale (revenus, dettes, actifs) — fournie volontairement lors d'une consultation</li><li>Objectifs financiers et de retraite</li><li>Numéro de permis AMF (pour les représentants)</li><li>Informations relatives aux produits souscrits</li></ul><h3>3.3 Renseignements techniques (navigation)</h3><ul><li>Adresse IP</li><li>Type de navigateur et système d'exploitation</li><li>Pages visitées, durée de la visite, liens cliqués</li><li>Source de trafic (ex. : référence Google, réseaux sociaux)</li></ul><div class="alert"><strong>Important :</strong> Nous ne collectons jamais de numéros d'assurance sociale, de données bancaires complètes, ni de renseignements médicaux sans consentement explicite préalable et justification légale.</div>` },
          { id: 's4', number: '4', title: "Finalités et utilisation", content: `<p>Vos renseignements sont utilisés aux fins suivantes :</p><div class="table-wrap"><table><thead><tr><th>Finalité</th><th>Base légale</th><th>Exemples concrets</th></tr></thead><tbody><tr><td>Prestation des services financiers</td><td>Consentement / obligation contractuelle</td><td>Analyse financière, recommandation de produits, souscription</td></tr><tr><td>Gestion de la relation client</td><td>Consentement / intérêt légitime</td><td>Suivi de dossier, rappels de rendez-vous</td></tr><tr><td>Communications marketing</td><td>Consentement exprès</td><td>Infolettres, offres de service, webinaires</td></tr><tr><td>Conformité réglementaire AMF</td><td>Obligation légale</td><td>Conservation des dossiers, audits</td></tr><tr><td>Amélioration de la plateforme</td><td>Intérêt légitime</td><td>Analyse de l'utilisation, correction de bogues</td></tr><tr><td>Prévention de la fraude</td><td>Obligation légale / intérêt légitime</td><td>Détection d'activités suspectes</td></tr><tr><td>Recrutement de représentants</td><td>Consentement</td><td>Traitement des candidatures, formation AMF</td></tr></tbody></table></div>` },
          { id: 's5', number: '5', title: "Divulgation à des tiers", content: `<p>Nous pouvons partager vos renseignements avec les catégories de tiers suivantes, dans la mesure strictement nécessaire :</p><h3>5.1 Partenaires de service</h3><ul><li><strong>Assureurs et fournisseurs de fonds</strong> — pour la souscription et l'administration de produits financiers ;</li><li><strong>Fournisseurs de technologie</strong> — hébergement, CRM, gestion des courriels ;</li><li><strong>Processeurs de paiement</strong> — pour le traitement des frais d'inscription.</li></ul><h3>5.3 Ce que nous ne faisons jamais</h3><div class="alert"><strong>Nous ne vendons, louons ni échangeons jamais vos renseignements personnels</strong> à des fins commerciales avec des entreprises tierces.</div>` },
          { id: 's6', number: '6', title: "Transferts hors Québec", content: `<p>Certains de nos fournisseurs technologiques peuvent traiter des données sur des serveurs situés hors du Québec (notamment en Ontario, aux États-Unis ou en Europe). Avant tout transfert, nous effectuons une <strong>évaluation des facteurs relatifs à la vie privée (EFVP)</strong>.</p><div class="alert alert-blue"><strong>Droit d'information :</strong> Vous pouvez nous demander la liste des pays où vos renseignements peuvent être transférés.</div>` },
          { id: 's7', number: '7', title: "Cookies et technologies", content: `<p>Notre site utilise des témoins (<em>cookies</em>) et technologies similaires.</p><div class="table-wrap"><table><thead><tr><th>Type</th><th>Finalité</th><th>Durée</th><th>Désactivable</th></tr></thead><tbody><tr><td><strong>Essentiels</strong></td><td>Fonctionnement du site</td><td>Session</td><td>Non</td></tr><tr><td><strong>Analytiques</strong></td><td>Statistiques (ex. : Google Analytics)</td><td>13 mois</td><td>Oui</td></tr><tr><td><strong>Fonctionnels</strong></td><td>Mémorisation des préférences</td><td>12 mois</td><td>Oui</td></tr><tr><td><strong>Marketing</strong></td><td>Publicités personnalisées</td><td>24 mois</td><td>Oui</td></tr></tbody></table></div>` },
          { id: 's8', number: '8', title: "Conservation et destruction", content: `<p>Nous conservons vos renseignements aussi longtemps que nécessaire pour les finalités déclarées :</p><div class="table-wrap"><table><thead><tr><th>Catégorie de données</th><th>Durée</th><th>Fondement</th></tr></thead><tbody><tr><td>Dossiers clients actifs</td><td>7 ans</td><td>AMF / fiscalité</td></tr><tr><td>Dossiers de consultation</td><td>3 ans</td><td>Prescription civile</td></tr><tr><td>Candidatures representatives</td><td>6 mois</td><td>RH</td></tr></tbody></table></div>` },
          { id: 's9', number: '9', title: "Mesures de sécurité", content: `<div class="rights-grid"><div class="right-card"><div class="right-icon">🔐</div><div class="right-title">Chiffrement</div><div class="right-desc">TLS 1.3 et AES-256.</div></div><div class="right-card"><div class="right-icon">🛡️</div><div class="right-title">Contrôle d'accès</div><div class="right-desc">Principe du moindre privilège.</div></div><div class="right-card"><div class="right-icon">🚨</div><div class="right-title">Incidents</div><div class="right-desc">Procédure de réponse aux incidents Loi 25.</div></div></div>` },
          { id: 's10', number: '10', title: "Droits des personnes", content: `<div class="rights-grid"><div class="right-card"><div class="right-icon">👁️</div><div class="right-title">Accès</div><div class="right-desc">Consulter vos données.</div></div><div class="right-card"><div class="right-icon">✏️</div><div class="right-title">Rectification</div><div class="right-desc">Corriger les erreurs.</div></div><div class="right-card"><div class="right-icon">🚫</div><div class="right-title">Retrait</div><div class="right-desc">Retirer votre consentement.</div></div></div><div class="alert alert-blue"><strong>Recours externes :</strong> Contactez la CAI (www.cai.gouv.qc.ca) en cas de litige.</div>` },
          { id: 's11', number: '11', title: "Mineurs", content: `<p>Nos services sont destinés exclusivement aux personnes âgées de <strong>18 ans et plus</strong>.</p>` },
          { id: 's12', number: '12', title: "Mises à jour", content: `<p>Nous nous réservons le droit de modifier la présente politique. En cas de modification substantielle, un avis sera publié sur la page d'accueil.</p>` },
          { id: 's13', number: '13', title: "Contact et plaintes", content: `<p>Pour toute question, contactez notre Responsable de la protection des renseignements personnels via les coordonnées ci-dessous.</p>` }
        ],
        contactBox: {
          company: 'Konekte Group',
          email: 'planifier@konektegroup.com',
          website: 'https://planifier.konektegroup.com',
          responseDelay: '30 jours calendaires'
        }
      },
      terms: {
        hero: {
          tag: 'Document légal',
          title: "Conditions d'utilisation",
          description: "En utilisant la plateforme Planify, vous acceptez les présentes conditions. Veuillez les lire attentivement avant toute utilisation.",
          meta: { effectiveDate: '1er janvier 2024', lastUpdate: '11 mai 2025', version: '2.1' }
        },
        sections: [
          { id: 's1', number: '1', title: "Acceptation des conditions", content: `<p>En accédant à la Plateforme, vous déclarez avoir lu, compris et accepté sans réserve les présentes Conditions.</p><div class="alert"><strong>Si vous n'acceptez pas ces conditions, veuillez cesser immédiatement d'utiliser la Plateforme.</strong></div>` },
          { id: 's2', number: '2', title: "Définitions", content: `<div class="table-wrap"><table><thead><tr><th>Terme</th><th>Définition</th></tr></thead><tbody><tr><td><strong>Plateforme</strong></td><td>Le site Web et ses fonctionnalités CRM.</td></tr><tr><td><strong>Représentant</strong></td><td>Travailleur autonome accrédité AMF.</td></tr></tbody></table></div>` },
          { id: 's3', number: '3', title: "Description des services", content: `<div class="two-col"><div class="col-card"><div class="col-card-title">🏦 Pour les Clients</div><ul><li>Mise en relation AMF</li><li>Information produits</li></ul></div><div class="col-card"><div class="col-card-title">💼 Pour les Représentants</div><ul><li>Plateforme CRM</li><li>Outils de suivi</li></ul></div></div>` },
          { id: 's4', number: '4', title: "Inscription et compte", content: `<p>Vous êtes responsable de la confidentialité de vos identifiants.</p>` },
          { id: 's5', number: '5', title: "Utilisation acceptable", content: `<div class="alert alert-red"><strong>Toute violation peut entraîner la suspension immédiate du compte.</strong></div>` },
          { id: 's6', number: '6', title: "Services financiers", content: `<div class="highlight-box"><h3>⚠️ Ce que la Plateforme n'est pas</h3><p>Planify est une plateforme de mise en relation. Elle ne constitue pas un conseil financier personnalisé.</p></div>` },
          { id: 's7', number: '7', title: "Propriété intellectuelle", content: `<p>Le contenu est la propriété exclusive de Konekte Group.</p>` },
          { id: 's8', number: '8', title: "Confidentialité", content: `<p>Voir notre Politique de confidentialité.</p>` },
          { id: 's9', number: '9', title: "Limitation de responsabilité", content: `<p>La plateforme est fournie "telle quelle". Konekte n'est pas responsable des actes des représentants indépendants.</p>` },
          { id: 's10', number: '10', title: "Indemnisation", content: `<p>Vous acceptez d'indemniser Konekte Group pour toute violation des conditions.</p>` },
          { id: 's11', number: '11', title: "Services tiers", content: `<p>Konekte n'exerce aucun contrôle sur les sites tiers (assureurs, etc.).</p>` },
          { id: 's12', number: '12', title: "Modification et résiliation", content: `<p>Konekte peut suspendre votre accès en cas de violation ou de retrait de permis AMF.</p>` },
          { id: 's13', number: '13', title: "Droit applicable", content: `<p>Lois de la province de Québec. District de Montréal.</p>` },
          { id: 's14', number: '14', title: "Dispositions générales", content: `<p>Les présentes constituent l'intégralité de l'accord.</p>` },
          { id: 's15', number: '15', title: "Contact", content: `<p>Pour toute question, contactez notre service juridique.</p>` }
        ],
        contactBox: {
          company: 'Konekte Group',
          email: 'planifier@konektegroup.com',
          website: 'https://planifier.konektegroup.com',
          responseDelay: 'N/A'
        }
      }
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
          privacy: priv ? { ...DEFAULTS.legal.privacy, ...priv.content } : DEFAULTS.legal.privacy,
          terms: term ? { ...DEFAULTS.legal.terms, ...term.content } : DEFAULTS.legal.terms
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

  const LegalEditor = ({ data, setData, slug, saving, onSave }: any) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Configuration Hero</h3>
          <div className="grid gap-2"><Label className="text-[10px] font-black text-slate-400">Tag</Label><Input className="bg-slate-900 border-slate-700" value={data.hero?.tag} onChange={e => setData({...data, hero: {...data.hero, tag: e.target.value}})} /></div>
          <div className="grid gap-2"><Label className="text-[10px] font-black text-slate-400">Titre</Label><Input className="bg-slate-900 border-slate-700" value={data.hero?.title} onChange={e => setData({...data, hero: {...data.hero, title: e.target.value}})} /></div>
          <div className="grid gap-2"><Label className="text-[10px] font-black text-slate-400">Description</Label><textarea className="bg-slate-900 border-slate-700 rounded-lg p-3 text-sm min-h-[80px]" value={data.hero?.description} onChange={e => setData({...data, hero: {...data.hero, description: e.target.value}})} /></div>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Métadonnées</h3>
          <div className="grid gap-2"><Label className="text-[10px] font-black text-slate-400">Entrée en vigueur</Label><Input className="bg-slate-900 border-slate-700" value={data.hero?.meta?.effectiveDate} onChange={e => setData({...data, hero: {...data.hero, meta: {...data.hero.meta, effectiveDate: e.target.value}}})} /></div>
          <div className="grid gap-2"><Label className="text-[10px] font-black text-slate-400">Dernière mise à jour</Label><Input className="bg-slate-900 border-slate-700" value={data.hero?.meta?.lastUpdate} onChange={e => setData({...data, hero: {...data.hero, meta: {...data.hero.meta, lastUpdate: e.target.value}}})} /></div>
          <div className="grid gap-2"><Label className="text-[10px] font-black text-slate-400">Version</Label><Input className="bg-slate-900 border-slate-700" value={data.hero?.meta?.version} onChange={e => setData({...data, hero: {...data.hero, meta: {...data.hero.meta, version: e.target.value}}})} /></div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Sections de contenu</h3>
        <Accordion type="single" collapsible className="w-full space-y-3">
          {data.sections?.map((section: any, i: number) => (
            <AccordionItem key={i} value={`section-${i}`} className="border border-slate-700 bg-slate-900/30 rounded-xl px-4">
              <AccordionTrigger className="text-white font-medium hover:no-underline flex gap-3">
                <span className="bg-blue-600/20 text-blue-400 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold">{section.number}</span>
                {section.title || "Nouvelle section"}
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="grid grid-cols-[60px_1fr] gap-3">
                  <div><Label className="text-[10px] font-black text-slate-400">N°</Label><Input className="bg-slate-900 border-slate-700 text-center" value={section.number} onChange={e => { const ns = [...data.sections]; ns[i].number = e.target.value; setData({...data, sections: ns}); }} /></div>
                  <div><Label className="text-[10px] font-black text-slate-400">Titre</Label><Input className="bg-slate-900 border-slate-700" value={section.title} onChange={e => { const ns = [...data.sections]; ns[i].title = e.target.value; setData({...data, sections: ns}); }} /></div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contenu</Label>
                  <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                    <RichTextEditor 
                      content={section.content} 
                      onChange={(html: string) => {
                        const ns = [...data.sections];
                        ns[i].content = html;
                        setData({...data, sections: ns});
                      }}
                      placeholder="Rédigez le contenu de cette section..."
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => { const ns = [...data.sections]; ns.splice(i, 1); setData({...data, sections: ns}); }}><Trash2 className="w-4 h-4 mr-2" /> Supprimer cette section</Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button variant="outline" className="w-full border-dashed border-slate-600 text-slate-400 py-6" onClick={() => { const ns = [...(data.sections || [])]; ns.push({ id: `s${ns.length + 1}`, number: (ns.length + 1).toString(), title: 'Nouvelle section', content: '<p>Contenu...</p>' }); setData({...data, sections: ns}); }}><Plus className="w-4 h-4 mr-2" /> Ajouter une section</Button>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-700">
        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Bloc Contact (RPRP)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2"><Label className="text-[10px] font-black text-slate-400">Entreprise</Label><Input className="bg-slate-900 border-slate-700" value={data.contactBox?.company} onChange={e => setData({...data, contactBox: {...data.contactBox, company: e.target.value}})} /></div>
          <div className="grid gap-2"><Label className="text-[10px] font-black text-slate-400">Courriel</Label><Input className="bg-slate-900 border-slate-700" value={data.contactBox?.email} onChange={e => setData({...data, contactBox: {...data.contactBox, email: e.target.value}})} /></div>
          <div className="grid gap-2"><Label className="text-[10px] font-black text-slate-400">Site Web</Label><Input className="bg-slate-900 border-slate-700" value={data.contactBox?.website} onChange={e => setData({...data, contactBox: {...data.contactBox, website: e.target.value}})} /></div>
          <div className="grid gap-2"><Label className="text-[10px] font-black text-slate-400">Délai de réponse</Label><Input className="bg-slate-900 border-slate-700" value={data.contactBox?.responseDelay} onChange={e => setData({...data, contactBox: {...data.contactBox, responseDelay: e.target.value}})} /></div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button disabled={saving} onClick={onSave} className="bg-blue-600 hover:bg-blue-500 font-bold px-10 py-6 rounded-2xl">
          {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />} 
          Enregistrer {slug === 'privacy' ? 'la Politique' : 'les Conditions'}
        </Button>
      </div>
    </div>
  );

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
            <div className="space-y-2"><Label className="text-slate-400 uppercase text-[10px] font-black">Paragraphe 1</Label><RichTextEditor content={data.intro?.p1} onChange={html => setData({...data, intro: {...data.intro, p1: html}})} /></div>
            <div className="space-y-2"><Label className="text-slate-400 uppercase text-[10px] font-black">Paragraphe 2</Label><RichTextEditor content={data.intro?.p2} onChange={html => setData({...data, intro: {...data.intro, p2: html}})} /></div>
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
                <div className="space-y-2"><Label className="text-[10px] font-black">Réponse</Label><RichTextEditor content={faq.answer} onChange={html => { const ni = [...data.faqs.items]; ni[i].answer = html; setData({...data, faqs: {...data.faqs, items: ni}}); }} /></div>
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
        <TabsContent value="legal" className="pt-4">
          <Card className="bg-slate-800 border-slate-700 text-white p-6 space-y-8">
            <Tabs defaultValue="privacy-edit" className="w-full">
              <TabsList className="bg-slate-900 border-slate-700 mb-6">
                <TabsTrigger value="privacy-edit">Politique de Confidentialité</TabsTrigger>
                <TabsTrigger value="terms-edit">Conditions d'Utilisation</TabsTrigger>
              </TabsList>

              <TabsContent value="privacy-edit" className="space-y-6">
                <LegalEditor 
                  data={legal.privacy} 
                  setData={(d: any) => setLegal({...legal, privacy: d})} 
                  slug="privacy" 
                  saving={saving}
                  onSave={() => saveSection('privacy', legal.privacy, 'full')}
                />
              </TabsContent>

              <TabsContent value="terms-edit" className="space-y-6">
                <LegalEditor 
                  data={legal.terms} 
                  setData={(d: any) => setLegal({...legal, terms: d})} 
                  slug="terms" 
                  saving={saving}
                  onSave={() => saveSection('terms', legal.terms, 'full')}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
