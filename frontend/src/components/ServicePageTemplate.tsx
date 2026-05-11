// components/ServicePageTemplate.tsx
// Template réutilisable pour toutes les pages de services

import Link from "next/link";

export interface FAQ {
  question: string;
  answer: string;
}

export interface ServicePageProps {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaHref: string;
  };
  intro: {
    heading: string;
    paragraphs: string[];
  };
  benefits: {
    title: string;
    items: { icon: string; title: string; description: string }[];
  };
  howItWorks: {
    title: string;
    steps: { number: string; title: string; description: string }[];
  };
  faqs: {
    title: string;
    items: FAQ[];
  };
  cta: {
    heading: string;
    subheading: string;
    buttonText: string;
    buttonHref: string;
  };
}

export default function ServicePageTemplate({
  hero,
  intro,
  benefits,
  howItWorks,
  faqs,
  cta,
}: ServicePageProps) {
  return (
    <main className="bg-white text-gray-900">

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-blue-500 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
            {hero.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {hero.title}
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {hero.subtitle}
          </p>
          <Link
            href={hero.ctaHref}
            className="inline-block bg-white text-blue-900 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition"
          >
            {hero.ctaText}
          </Link>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-blue-900">{intro.heading}</h2>
          {intro.paragraphs.map((p, i) => (
            <p key={i} className="text-gray-700 text-lg leading-relaxed mb-4">
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* ── BÉNÉFICES ── */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
            {benefits.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.items.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-blue-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
            {howItWorks.title}
          </h2>
          <div className="space-y-8">
            {howItWorks.steps.map((step, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-1 text-blue-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
            {faqs.title}
          </h2>
          <div className="space-y-6">
            {faqs.items.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-2 text-blue-900">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="bg-blue-900 text-white py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{cta.heading}</h2>
          <p className="text-blue-200 text-lg mb-8">{cta.subheading}</p>
          <Link
            href={cta.buttonHref}
            className="inline-block bg-white text-blue-900 font-bold px-10 py-4 rounded-xl text-lg hover:bg-blue-50 transition"
          >
            {cta.buttonText}
          </Link>
        </div>
      </section>

    </main>
  );
}
