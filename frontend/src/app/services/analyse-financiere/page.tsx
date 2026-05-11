'use client';

import ServicePageTemplate from "@/components/ServicePageTemplate";
import { generateServiceSchema } from "@/lib/schema";
import { useContent } from "@/hooks/useContent";

const faqs = [
  {
    question: "C'est quoi un bilan financier et pourquoi en ai-je besoin ?",
    answer:
      "Un bilan financier, c'est une radiographie complète de votre situation : revenus, dettes, assurances, épargne, retraite. Sans cette vue d'ensemble, la plupart des gens prennent des décisions financières à l'aveugle — en surpayant pour des assurances inutiles, en laissant des dettes à taux élevé traîner, ou en n'épargnant pas au bon endroit. Un bilan vous donne un plan clair basé sur votre réalité.",
  },
  {
    question: "Le bilan financier de Planify est-il vraiment gratuit ?",
    answer:
      "Oui, la consultation initiale et le bilan complet sont 100 % gratuits et sans obligation. Notre conseiller est rémunéré par commissions sur les produits souscrits — seulement si vous décidez d'aller de l'avant après avoir reçu votre analyse. Vous ne payez jamais pour la rencontre elle-même.",
  },
  {
    question: "Combien de temps dure un bilan financier ?",
    answer:
      "Environ 60 à 90 minutes, en personne ou en visioconférence selon votre préférence. C'est le temps nécessaire pour bien comprendre votre situation, analyser vos documents et vous présenter un plan d'action personnalisé.",
  },
  {
    question: "Quels documents apporter pour le bilan ?",
    answer:
      "Les plus utiles : vos avis de cotisation de l'ARC (revenus, droits REER), vos relevés de dettes (soldes et taux), vos contrats d'assurance actuels, et vos relevés d'épargne (REER, CELI).",
  },
];

export default function AnalyseFinancierePage() {
  const { content } = useContent('analyse-financiere', 'main', {
    hero: {
      badge: "🆓 100 % Gratuit — Accrédité AMF Québec",
      title: "Bilan financier complet et gratuit pour toute famille québécoise",
      subtitle: "En 60 minutes, un conseiller accrédité AMF analyse votre situation complète : dettes, assurances, épargne et retraite. Sans pression. Sans obligation.",
    },
    intro: {
      heading: "Vous travaillez fort — mais est-ce que votre argent travaille aussi fort que vous ?",
      p1: "La majorité des familles québécoises n'ont jamais eu de regard externe et professionnel sur leurs finances. Résultat : des assurances trop chères ou inadéquates, des dettes qui traînent inutilement, un REER ou un CELI sous-utilisé, et aucun plan clair pour la retraite.",
      p2: "Le bilan financier de Planify, c'est comme un check-up médical — mais pour vos finances. En une rencontre, votre conseiller accrédité AMF dresse un portrait complet de votre situation, identifie les lacunes et vous remet un plan d'action personnalisé."
    }
  });

  const schema = generateServiceSchema({
    name: content.hero.title,
    description: "Bilan financier complet et gratuit pour toute famille québécoise. Conseiller accrédité AMF, analyse de vos dettes, assurances, épargne et retraite.",
    url: "https://planifier.konektegroup.com/services/analyse-financiere",
    faqs,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <ServicePageTemplate
        hero={{
          badge: content.hero.badge || "🆓 100 % Gratuit — Accrédité AMF Québec",
          title: content.hero.title,
          subtitle: content.hero.subtitle,
          ctaText: "Réserver mon bilan gratuit",
          ctaHref: "/?contact=true",
        }}
        intro={{
          heading: content.intro.heading,
          paragraphs: [content.intro.p1, content.intro.p2].filter(Boolean),
        }}
        benefits={{
          title: content.benefits?.title || "Ce que couvre votre bilan financier gratuit",
          items: content.benefits?.items?.length > 0 ? content.benefits.items : [
            { icon: "💳", title: "Analyse de vos dettes", description: "Cartes, hypothèque, prêts — on identifie l'ordre optimal de remboursement." },
            { icon: "🛡️", title: "Revue de vos assurances", description: "On vérifie que votre famille est bien couverte au meilleur prix." },
            { icon: "📈", title: "Évaluation de l'épargne", description: "REER, CELI — on identifie la meilleure stratégie fiscale." },
            { icon: "🏖️", title: "Projection de retraite", description: "On calcule si votre fonds actuel suffit pour vos objectifs." },
            { icon: "🧾", title: "Optimisation fiscale", description: "Réduisez votre facture fiscale grâce aux bons outils." },
            { icon: "📋", title: "Plan d'action", description: "Vous repartez avec un plan clair, chiffré et personnalisé." },
          ],
        }}
        howItWorks={{
          title: content.howItWorks?.title || "Votre bilan financier en 4 étapes simples",
          steps: content.howItWorks?.steps?.length > 0 ? content.howItWorks.steps : [
            { number: "1", title: "Réservez votre rencontre", description: "Remplissez le formulaire en 2 minutes." },
            { number: "2", title: "Rencontre (60-90 min)", description: "En personne ou virtuelle, sans jugement." },
            { number: "3", title: "Analyse et présentation", description: "On vous montre les forces et les lacunes." },
            { number: "4", title: "Plan d'action", description: "Repartez avec un plan concret sans obligation." },
          ],
        }}
        faqs={{
          title: content.faqs?.title || "Questions fréquentes",
          items: content.faqs?.items?.length > 0 ? content.faqs.items : faqs,
        }}
        cta={{
          heading: "Prenez 60 minutes pour changer votre situation",
          subheading: "Bilan financier complet et gratuit, sans obligation. Un conseiller accrédité AMF vous contacte sous 24 heures.",
          buttonText: "Réserver mon bilan gratuit",
          buttonHref: "/?contact=true",
        }}
      />
    </>
  );
}
