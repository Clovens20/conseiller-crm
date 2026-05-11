'use client';

import ServicePageTemplate from "@/components/ServicePageTemplate";
import { generateServiceSchema } from "@/lib/schema";
import { useContent } from "@/hooks/useContent";

const faqs = [
  {
    question: "Comment rembourser mon hypothèque plus rapidement au Québec ?",
    answer:
      "Plusieurs stratégies permettent d'accélérer le remboursement : augmenter la fréquence de paiements (bi-hebdomadaire accéléré), effectuer des paiements forfaitaires annuels, augmenter le montant de vos versements. Rembourser 10 % de capital supplémentaire par an peut couper des années de votre hypothèque et vous faire économiser des dizaines de milliers de dollars en intérêts.",
  },
  {
    question: "Quelle dette devrais-je rembourser en premier ?",
    answer:
      "La méthode avalanche (rembourser d'abord la dette au taux d'intérêt le plus élevé) est la plus efficace mathématiquement. Les cartes de crédit à 19-22 % passent avant l'hypothèque à 5-6 %. La méthode boule de neige (rembourser la plus petite dette d'abord) peut être plus motivante psychologiquement. Votre conseiller vous aide à choisir selon votre situation.",
  },
  {
    question: "Est-ce qu'il vaut mieux rembourser mes dettes ou investir ?",
    answer:
      "Si vos dettes ont un taux supérieur au rendement espéré de vos investissements (ex: carte de crédit à 20 % vs fonds à 7 %), remboursez d'abord. Mais avec une hypothèque à 5 %, investir dans un REER (déduction fiscale + rendement de 7-8 %) peut être plus avantageux. Une bonne stratégie combine les deux — votre conseiller l'analyse gratuitement.",
  },
  {
    question: "Combien de temps pour se libérer de ses dettes ?",
    answer:
      "Cela dépend du montant total, des taux d'intérêt et de votre capacité de remboursement. Avec un plan structuré, la plupart de nos clients éliminent leurs dettes à la consommation (cartes, prêts personnels) en 2 à 5 ans. Pour une hypothèque, on peut souvent réduire l'amortissement de 5 à 10 ans avec les bonnes stratégies.",
  },
  {
    question: "Dois-je voir un syndic de faillite ou un conseiller financier ?",
    answer:
      "Un syndic de faillite intervient dans les cas extrêmes (faillite, proposition de consommateur). Si vous êtes en mesure de payer vos dettes mais souhaitez le faire plus intelligemment, un conseiller financier comme Planify est la bonne ressource. On vous bâtit un plan de remboursement sans les conséquences négatives d'une faillite sur votre dossier de crédit.",
  },
  {
    question: "Le service d'élimination des dettes de Planify est-il gratuit ?",
    answer:
      "La consultation initiale et l'analyse de votre situation sont 100 % gratuites et sans obligation. Notre conseiller accrédité AMF vous présente un plan de remboursement personnalisé lors de votre première rencontre.",
  },
];

export default function EliminationDettesPage() {
  const { content } = useContent('elimination-dettes', 'main', {
    hero: {
      badge: "🏆 Accrédité AMF Québec",
      title: "Éliminez vos dettes et libérez-vous financièrement",
      subtitle: "Un plan concret pour rembourser vos dettes et votre hypothèque plus vite qu'avec votre banque. Analyse gratuite, résultats réels.",
    },
    intro: {
      heading: "Les dettes coûtent plus cher que vous pensez",
      p1: "Un solde de 5 000 $ sur une carte de crédit à 19,99 % qui ne paie que le minimum mensuel vous coûtera plus de 10 000 $ en intérêts et prendra 15 ans à rembourser. Ce n'est pas un problème de volonté — c'est un problème de stratégie.",
      p2: "Chez Planify, on ne vous juge pas. On vous bâtit un plan d'élimination des dettes qui tient compte de votre hypothèque, vos cartes de crédit, vos prêts personnels et votre budget — dans l'ordre optimal pour payer le moins d'intérêts possible."
    }
  });

  const schema = generateServiceSchema({
    name: content.hero.title,
    description: "Stratégies concrètes pour rembourser dettes et hypothèque plus rapidement. Conseiller financier accrédité AMF au Québec.",
    url: "https://planifier.konektegroup.com/services/elimination-dettes",
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
          badge: content.hero.badge || "🏆 Accrédité AMF Québec",
          title: content.hero.title,
          subtitle: content.hero.subtitle,
          ctaText: "Obtenir mon plan de remboursement gratuit",
          ctaHref: "/?contact=true",
        }}
        intro={{
          heading: content.intro.heading,
          paragraphs: [content.intro.p1, content.intro.p2].filter(Boolean),
        }}
        benefits={{
          title: content.benefits?.title || "Ce qu'apporte un plan d'élimination des dettes",
          items: content.benefits?.items?.length > 0 ? content.benefits.items : [
            { icon: "🗓️", title: "Date de libération réelle", description: "Vous saurez exactement quand vous serez libre." },
            { icon: "💵", title: "Économies en intérêts", description: "Un bon ordre de remboursement évite des frais." },
            { icon: "📉", title: "Hypothèque raccourcie", description: "Coupez 5 à 10 ans de votre hypothèque." },
            { icon: "🧘", title: "Paix d'esprit", description: "Avoir un plan clair réduit le stress financier." },
            { icon: "📈", title: "Libérer du cash-flow", description: "Libérez des liquidités pour investir." },
            { icon: "🤝", title: "Accompagnement", description: "Suivi régulier et ajustements." },
          ],
        }}
        howItWorks={{
          title: content.howItWorks?.title || "Votre plan de remboursement en 4 étapes",
          steps: content.howItWorks?.steps?.length > 0 ? content.howItWorks.steps : [
            { number: "1", title: "Inventaire complet", description: "Hypothèque, cartes, prêts — on liste tout." },
            { number: "2", title: "Analyse du budget", description: "On identifie votre capacité réelle." },
            { number: "3", title: "Construction du plan", description: "Ordre optimal et stratégies d'accélération." },
            { number: "4", title: "Suivi et ajustements", description: "On révise le plan annuellement." },
          ],
        }}
        faqs={{
          title: content.faqs?.title || "Questions fréquentes",
          items: content.faqs?.items?.length > 0 ? content.faqs.items : faqs,
        }}
        cta={{
          heading: "Commencez votre chemin vers la liberté financière",
          subheading: "Analyse gratuite de vos dettes et plan personnalisé. Un conseiller accrédité AMF vous contacte sous 24 heures.",
          buttonText: "Obtenir mon plan gratuit",
          buttonHref: "/?contact=true",
        }}
      />
    </>
  );
}
