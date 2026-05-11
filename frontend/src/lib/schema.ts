// lib/schema.ts
// Générateur de Schema.org JSON-LD pour chaque page de service
// Aide Google à comprendre le contenu et améliore les rich results

export function generateServiceSchema({
  name,
  description,
  url,
  faqs,
}: {
  name: string;
  description: string;
  url: string;
  faqs: { question: string; answer: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // Schema du service financier
      {
        "@type": "FinancialProduct",
        name,
        description,
        url,
        provider: {
          "@type": "Organization",
          name: "Planify",
          url: "https://planifier.konektegroup.com",
          areaServed: {
            "@type": "Province",
            name: "Québec",
          },
          hasCredential: {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "Licence AMF Québec",
          },
        },
      },
      // Schema FAQ (génère des rich results dans Google!)
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
}

// Schema global de l'organisation (à mettre dans le layout principal)
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "Planify",
  url: "https://planifier.konektegroup.com",
  logo: "https://planifier.konektegroup.com/logo.png",
  description:
    "Conseiller financier accrédité AMF au Québec. Assurance vie temporaire, fonds de placement, élimination de dettes et protection invalidité pour les familles québécoises.",
  address: {
    "@type": "PostalAddress",
    addressRegion: "QC",
    addressCountry: "CA",
  },
  areaServed: "Québec",
  hasCredential: "Accrédité AMF Québec",
  sameAs: [
    // Ajoute tes URLs de réseaux sociaux ici
    // "https://www.facebook.com/planify",
    // "https://www.linkedin.com/company/planify",
  ],
};
