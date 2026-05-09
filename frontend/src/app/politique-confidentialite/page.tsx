'use client';

import React from 'react';
import LegalPageLayout from '@/components/LegalPageLayout';
import { useContent } from '@/hooks/useContent';

export default function PrivacyPolicyPage() {
  const { content, loading } = useContent('privacy', 'full', {
    title: 'Politique de confidentialité',
    last_updated: '9 mai 2025',
    content: `
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
      icon="🔒"
      lastUpdated={content.last_updated}
      badge="Conforme à la Loi 25 du Québec"
    >
      <div 
        className="prose prose-invert max-w-none prose-slate px-4 md:px-0"
        dangerouslySetInnerHTML={{ __html: content.content }} 
      />
    </LegalPageLayout>
  );
}
