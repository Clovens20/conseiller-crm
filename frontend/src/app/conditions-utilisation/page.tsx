'use client';

import React from 'react';
import ModernLegalLayout from '@/components/ModernLegalLayout';
import { useContent } from '@/hooks/useContent';

export default function TermsOfServicePage() {
  const { content, loading } = useContent('terms', 'full', {
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
  });

  if (loading) return (
    <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0d1f3c]"></div>
    </div>
  );

  return (
    <ModernLegalLayout
      hero={content.hero}
      sections={content.sections}
      contactBox={content.contactBox}
    />
  );
}
