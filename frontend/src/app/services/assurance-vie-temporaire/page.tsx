'use client';

import ServicePageTemplate from "@/components/ServicePageTemplate";
import { generateServiceSchema } from "@/lib/schema";
import { useContent } from "@/hooks/useContent";

const faqs = [
  {
    question: "C'est quoi l'assurance vie temporaire au Québec ?",
    answer:
      "L'assurance vie temporaire est une protection qui verse un montant forfaitaire à vos proches si vous décédez pendant la durée du contrat (10, 20 ou 30 ans). C'est la solution la plus abordable pour protéger votre famille contre la perte de votre revenu.",
  },
  {
    question: "Combien coûte une assurance vie temporaire au Québec ?",
    answer:
      "Le prix dépend de votre âge, état de santé, montant de couverture et durée. Pour un adulte en bonne santé de 35 ans, une couverture de 500 000 $ peut coûter entre 25 $ et 50 $ par mois. Obtenez une soumission gratuite adaptée à votre situation.",
  },
  {
    question: "Quelle différence entre assurance vie temporaire et permanente ?",
    answer:
      "La temporaire couvre une période définie (10-30 ans) à faible coût — idéale pour protéger une hypothèque ou remplacer votre revenu pendant que vos enfants grandissent. La permanente dure toute la vie mais coûte beaucoup plus cher. Pour la majorité des familles québécoises, la temporaire est la meilleure valeur.",
  },
  {
    question: "De combien d'assurance vie ai-je besoin ?",
    answer:
      "La règle générale est 10 à 12 fois votre revenu annuel. Exemple : si vous gagnez 70 000 $/an, visez une couverture entre 700 000 $ et 840 000 $. Cela couvre le remboursement de votre hypothèque, les dettes, et assure le niveau de vie de votre famille. Notre conseiller calcule le montant exact selon votre situation.",
  },
  {
    question: "Est-ce que le conseiller Planify est accrédité par l'AMF ?",
    answer:
      "Oui. Tous nos représentants sont accrédités par l'Autorité des marchés financiers (AMF) du Québec. Vous pouvez vérifier leur accréditation directement sur le registre public de l'AMF.",
  },
  {
    question: "Comment obtenir une soumission gratuite ?",
    answer:
      "Remplissez notre formulaire en ligne ou appelez-nous. Un conseiller accrédité vous contacte sous 24 heures pour analyser votre situation et vous présenter les meilleures options — sans pression, sans obligation.",
  },
];

export default function AssuranceVieTemporairePage() {
  const { content } = useContent('assurance-vie-temporaire', 'main', {
    hero: {
      badge: "✅ Accrédité AMF Québec",
      title: "Assurance Vie Temporaire au Québec",
      subtitle: "Protégez votre famille avec la couverture la plus abordable du marché. Consultation gratuite, soumission en 24h, aucune pression.",
    },
    intro: {
      heading: "Pourquoi l'assurance vie temporaire est le meilleur choix pour les familles québécoises",
      p1: "L'assurance vie temporaire, c'est la protection la plus efficace pour votre dollar. Elle garantit que si vous n'êtes plus là, votre famille ne perd pas sa maison, ne s'endette pas, et maintient son niveau de vie — le temps que vos enfants grandissent et que votre hypothèque soit remboursée.",
      p2: "Contrairement à l'assurance permanente qui coûte 5 à 10 fois plus cher, la temporaire vous donne une couverture maximale pendant la période où vous en avez le plus besoin : vos années de revenus actifs. Achetez du temporaire et investissez la différence — cette philosophie aide les familles québécoises depuis 1977."
    }
  });

  const schema = generateServiceSchema({
    name: content.hero.title,
    description: "Protection familiale avec assurance vie temporaire. Conseiller accrédité AMF, soumission gratuite au Québec.",
    url: "https://planifier.konektegroup.com/services/assurance-vie-temporaire",
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
          badge: content.hero.badge || "✅ Accrédité AMF Québec",
          title: content.hero.title,
          subtitle: content.hero.subtitle,
          ctaText: "Obtenir ma soumission gratuite",
          ctaHref: "/?contact=true",
        }}
        intro={{
          heading: content.intro.heading,
          paragraphs: [content.intro.p1, content.intro.p2].filter(Boolean),
        }}
        benefits={{
          title: content.benefits?.title || "Les avantages de l'assurance vie temporaire",
          items: content.benefits?.items?.length > 0 ? content.benefits.items : [
            { icon: "💰", title: "Prix abordable", description: "Couverture de 500 000 $ dès 25 $/mois pour un adulte en bonne santé." },
            { icon: "🏠", title: "Protège votre hypothèque", description: "Si vous décédez, votre famille garde la maison." },
            { icon: "👨👩👧👦", title: "Remplace votre revenu", description: "Le capital versé permet à votre famille de maintenir son niveau de vie." },
            { icon: "📋", title: "Simple à comprendre", description: "Pas de valeur de rachat compliquée, pas de frais cachés." },
            { icon: "⚡", title: "Soumission en 24h", description: "Notre conseiller vous contacte rapidement." },
            { icon: "🏅", title: "Accrédité AMF", description: "Tous nos représentants sont supervisés par l'AMF." },
          ],
        }}
        howItWorks={{
          title: content.howItWorks?.title || "Comment obtenir votre assurance vie en 4 étapes",
          steps: content.howItWorks?.steps?.length > 0 ? content.howItWorks.steps : [
            { number: "1", title: "Remplissez le formulaire gratuit", description: "2 minutes suffisent." },
            { number: "2", title: "Un conseiller accrédité AMF vous appelle sous 24h", description: "Il prend le temps de comprendre votre situation." },
            { number: "3", title: "Recevez votre analyse personnalisée", description: "Votre conseiller calcule le montant de couverture recommandé." },
            { number: "4", title: "Activez votre protection", description: "Signez votre contrat et votre famille est protégée." },
          ],
        }}
        faqs={{
          title: content.faqs?.title || "Questions fréquentes",
          items: content.faqs?.items?.length > 0 ? content.faqs.items : faqs,
        }}
        cta={{
          heading: "Protégez votre famille dès aujourd'hui",
          subheading:
            "Consultation gratuite avec un conseiller accrédité AMF. Aucune obligation, aucune pression.",
          buttonText: "Réserver ma consultation gratuite",
          buttonHref: "/?contact=true",
        }}
      />
    </>
  );
}
