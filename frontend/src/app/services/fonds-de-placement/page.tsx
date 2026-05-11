'use client';

import ServicePageTemplate from "@/components/ServicePageTemplate";
import { generateServiceSchema } from "@/lib/schema";
import { useContent } from "@/hooks/useContent";

const faqs = [
  {
    question: "Quelle différence entre REER et CELI au Québec ?",
    answer:
      "Le REER (Régime Enregistré d'Épargne-Retraite) vous donne une déduction fiscale sur vos cotisations maintenant, mais vous payez de l'impôt au retrait à la retraite. Le CELI (Compte d'Épargne Libre d'Impôt) ne donne pas de déduction, mais tous vos gains et retraits sont 100 % libres d'impôt. Les deux sont complémentaires — votre conseiller vous aide à choisir la bonne stratégie.",
  },
  {
    question: "C'est quoi un fonds distinct ? C'est mieux qu'un fonds commun ?",
    answer:
      "Les fonds distincts (offerts par les assureurs) offrent des garanties à l'échéance et au décès — votre capital est protégé même si les marchés baissent. Les fonds communs n'ont pas cette protection mais peuvent offrir de meilleurs rendements. Pour les personnes proches de la retraite ou peu tolérantes au risque, les fonds distincts sont souvent préférables.",
  },
  {
    question: "Combien dois-je investir par mois pour ma retraite ?",
    answer:
      "La règle générale est d'épargner 10 à 15 % de votre revenu brut. Si vous gagnez 60 000 $/an, visez 500 à 750 $/mois. Mais même commencer à 100 $/mois fait une énorme différence grâce aux intérêts composés. Notre conseiller calcule le montant exact selon votre âge, revenus et objectifs de retraite.",
  },
  {
    question: "Est-il trop tard pour commencer à investir à 45 ou 50 ans ?",
    answer:
      "Jamais trop tard ! À 45 ans, il vous reste 20 ans de croissance. Des cotisations maximales au REER et CELI combinées à une bonne stratégie permettent de bâtir un fonds de retraite solide. L'important est de commencer maintenant avec un plan adapté à votre situation.",
  },
  {
    question: "Mes placements sont-ils en sécurité si l'entreprise fait faillite ?",
    answer:
      "Les fonds distincts bénéficient d'une protection de l'Assuran-Vie (jusqu'à 200 000 $ par catégorie). Les fonds communs sont détenus séparément de l'actif de la société de fonds — ils ne peuvent pas être saisis. Votre conseiller explique en détail les protections applicables à chaque produit.",
  },
  {
    question: "Comment choisir entre différents fonds selon mon profil ?",
    answer:
      "Votre tolérance au risque, votre horizon de placement et vos objectifs déterminent le bon fonds. Un profil conservateur (proche retraite) privilégiera les obligations et fonds garantis. Un profil croissance (jeune investisseur) peut tolérer plus d'actions. Notre conseiller effectue gratuitement un questionnaire de profil investisseur.",
  },
];

export default function FondsPlacementPage() {
  const { content } = useContent('fonds-placement', 'main', {
    hero: {
      badge: "📈 Accrédité AMF Québec",
      title: "Fonds de Placement & Investissement au Québec",
      subtitle: "REER, CELI, fonds distincts et communs — la bonne stratégie pour bâtir votre retraite. Analyse gratuite de votre profil investisseur.",
    },
    intro: {
      heading: "Faites travailler votre argent pour vous",
      p1: "Mettre de l'argent de côté c'est bien. Le faire fructifier intelligemment, c'est mieux. Pourtant, la majorité des Québécois laissent leur argent dormir dans un compte bancaire à 0,5 % d'intérêt — pendant que l'inflation grignote leur pouvoir d'achat.",
      p2: "Que vous souhaitiez maximiser votre REER, ouvrir un CELI, ou diversifier avec des fonds distincts et communs, nos conseillers accrédités AMF vous bâtissent un programme d'investissement complet — adapté à votre âge, vos revenus et votre tolérance au risque."
    }
  });

  const schema = generateServiceSchema({
    name: content.hero.title,
    description: "Solutions d'investissement REER, CELI, fonds distincts et communs pour la retraite. Conseiller financier accrédité AMF au Québec.",
    url: "https://planifier.konektegroup.com/services/fonds-de-placement",
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
          badge: content.hero.badge || "📈 Accrédité AMF Québec",
          title: content.hero.title,
          subtitle: content.hero.subtitle,
          ctaText: "Analyser mon profil gratuitement",
          ctaHref: "/?contact=true",
        }}
        intro={{
          heading: content.intro.heading,
          paragraphs: [content.intro.p1, content.intro.p2].filter(Boolean),
        }}
        benefits={{
          title: content.benefits?.title || "Pourquoi investir avec un conseiller Planify ?",
          items: content.benefits?.items?.length > 0 ? content.benefits.items : [
            { icon: "🎯", title: "Stratégie personnalisée", description: "Votre plan est construit selon votre situation unique." },
            { icon: "🛡️", title: "Fonds distincts garantis", description: "Protection du capital à l'échéance et au décès." },
            { icon: "💸", title: "Optimisation fiscale", description: "Maximisez vos droits REER et CELI." },
            { icon: "📊", title: "Suivi continu", description: "Revue annuelle de votre portefeuille." },
            { icon: "🔐", title: "Accrédité AMF", description: "Représentant supervisé par l'AMF." },
            { icon: "🆓", title: "Bilan gratuit", description: "Première rencontre complète sans frais." },
          ],
        }}
        howItWorks={{
          title: content.howItWorks?.title || "De zéro à investisseur en 4 étapes",
          steps: content.howItWorks?.steps?.length > 0 ? content.howItWorks.steps : [
            { number: "1", title: "Bilan financier gratuit", description: "Analyse de votre situation actuelle." },
            { number: "2", title: "Questionnaire de profil investisseur", description: "Détermine votre tolérance au risque." },
            { number: "3", title: "Présentation de votre programme", description: "Quel fonds, quel compte et pourquoi." },
            { number: "4", title: "Démarrage et suivi", description: "Activation et suivi annuel." },
          ],
        }}
        faqs={{
          title: content.faqs?.title || "Questions fréquentes",
          items: content.faqs?.items?.length > 0 ? content.faqs.items : faqs,
        }}
        cta={{
          heading: "Commencez à faire fructifier votre argent",
          subheading: "Bilan financier complet et gratuit. Votre conseiller accrédité AMF vous contacte sous 24 heures.",
          buttonText: "Réserver mon bilan gratuit",
          buttonHref: "/?contact=true",
        }}
      />
    </>
  );
}
