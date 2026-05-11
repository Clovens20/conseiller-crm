'use client';

import React from 'react';
import LegalPageLayout from '@/components/LegalPageLayout';
import { useContent } from '@/hooks/useContent';

export default function TermsOfServicePage() {
  const { content, loading } = useContent('terms', 'full', {
    title: "Conditions d'utilisation",
    last_updated: '9 mai 2025',
    content: `
      <h2>1. ACCEPTATION DES CONDITIONS</h2>
      <p>En accédant à planifier.konektegroup.com et en utilisant nos services, vous acceptez d'être lié par les présentes conditions d'utilisation.</p>
      
      <h2>2. DESCRIPTION DES SERVICES</h2>
      <p>Planify est une plateforme de gestion de la relation client (CRM) destinée aux représentants autonomes accrédités AMF au Québec.</p>
      <p><strong>Important:</strong> Planify n'est pas un conseiller financier. Nous mettons en relation des clients avec des représentants accrédités AMF.</p>
      
      <h2>3. STATUT DES REPRÉSENTANTS</h2>
      <p>Les représentants utilisant notre plateforme sont des TRAVAILLEURS AUTONOMES indépendants.</p>
    `
  });

  if (loading) return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <LegalPageLayout
      title={content.title}
      icon="📄"
      lastUpdated={content.last_updated}
      badge="Veuillez lire attentivement avant d'utiliser notre plateforme"
    >
      <div
        className="prose prose-invert max-w-none prose-slate px-4 md:px-0"
        dangerouslySetInnerHTML={{ __html: content.content }}
      />
    </LegalPageLayout>
  );
}
