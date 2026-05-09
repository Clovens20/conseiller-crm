import React from 'react';
import LegalPageLayout, { LegalSection } from '@/components/LegalPageLayout';

export const metadata = {
  title: "Conditions d'utilisation | Planify",
  description: "Conditions d'utilisation de la plateforme Planify",
};

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="Conditions d'utilisation"
      icon="📄"
      lastUpdated="9 mai 2025"
      badge="Veuillez lire attentivement avant d'utiliser notre plateforme"
    >
      <LegalSection number="1" title="ACCEPTATION DES CONDITIONS">
        <p>En accédant à <a href="https://planifier.konektegroup.com" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">planifier.konektegroup.com</a> et en utilisant nos services, vous acceptez d'être lié par les présentes conditions d'utilisation.</p>
        <p className="mt-2">Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.</p>
        <p className="mt-2">Ces conditions s'appliquent à tous les utilisateurs: visiteurs, clients potentiels et candidats représentants.</p>
      </LegalSection>

      <LegalSection number="2" title="DESCRIPTION DES SERVICES">
        <p>Planify est une plateforme de gestion de la relation client (CRM) destinée aux représentants autonomes accrédités AMF au Québec.</p>
        <p className="font-semibold text-white mt-4">Services offerts via cette plateforme:</p>
        
        <div className="space-y-4 mt-2">
          <div>
            <p className="text-slate-300 font-medium">Pour les visiteurs:</p>
            <ul className="list-disc ml-6 mt-1 text-slate-300">
              <li>Demande de consultation financière</li>
              <li>Information sur les services disponibles</li>
              <li>Formulaire de candidature représentant</li>
            </ul>
          </div>
          <div>
            <p className="text-slate-300 font-medium">Pour les représentants accrédités:</p>
            <ul className="list-disc ml-6 mt-1 text-slate-300">
              <li>Gestion des dossiers clients</li>
              <li>Suivi des rendez-vous et activités</li>
              <li>Outils de présentation et formulaires</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <p className="flex gap-2">
            <span>⚠️</span>
            <span className="font-medium text-yellow-500">Important: Planify n'est pas un conseiller financier. Nous mettons en relation des clients avec des représentants accrédités AMF.</span>
          </p>
        </div>
      </LegalSection>

      <LegalSection number="3" title="STATUT DES REPRÉSENTANTS">
        <p>Les représentants utilisant notre plateforme sont des TRAVAILLEURS AUTONOMES indépendants.</p>
        
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="font-semibold text-white mb-2">Ils NE SONT PAS:</p>
            <ul className="space-y-1">
              <li className="flex items-center gap-2">❌ Des employés de Planify</li>
              <li className="flex items-center gap-2">❌ Des employés salariés</li>
              <li className="flex items-center gap-2">❌ Des agents exclusifs</li>
            </ul>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="font-semibold text-white mb-2">Ils SONT:</p>
            <ul className="space-y-1">
              <li className="flex items-center gap-2">✅ Des travailleurs autonomes accrédités</li>
              <li className="flex items-center gap-2">✅ Supervisés par l'AMF du Québec</li>
              <li className="flex items-start gap-2">✅ Responsables de leurs propres activités professionnelles</li>
            </ul>
          </div>
        </div>

        <p className="mt-4">Planify ne peut être tenu responsable des actions ou omissions des représentants indépendants.</p>
      </LegalSection>

      <LegalSection number="4" title="UTILISATION ACCEPTABLE">
        <p>Vous vous engagez à utiliser notre plateforme de façon légitime:</p>
        
        <div className="mt-4 space-y-4">
          <div>
            <p className="font-semibold text-white flex items-center gap-2 mb-2">✅ Autorisé:</p>
            <ul className="list-disc ml-8 text-slate-300">
              <li>Soumettre des demandes de bonne foi</li>
              <li>Fournir des informations exactes</li>
              <li>Contacter notre équipe pour questions</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white flex items-center gap-2 mb-2">❌ Interdit:</p>
            <ul className="list-disc ml-8 text-slate-300">
              <li>Fournir de fausses informations</li>
              <li>Harceler nos représentants</li>
              <li>Tenter d'accéder sans autorisation</li>
              <li>Utiliser des robots ou scripts</li>
              <li>Reproduire notre contenu sans permission</li>
              <li>Utiliser la plateforme à des fins illégales ou frauduleuses</li>
            </ul>
          </div>
        </div>

        <p className="mt-6 font-semibold text-red-400">Tout manquement peut entraîner la suspension immédiate de l'accès.</p>
      </LegalSection>

      <LegalSection number="5" title="LIMITATION DE RESPONSABILITÉ">
        <p>Dans toute la mesure permise par la loi applicable:</p>
        <p className="mt-4 font-semibold text-white">Planify ne peut être tenu responsable:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1 text-slate-300">
          <li>Des décisions financières prises suite à une consultation</li>
          <li>Des actions des représentants autonomes indépendants</li>
          <li>Des interruptions de service</li>
          <li>Des pertes de données causées par des tiers</li>
          <li>Des dommages indirects ou consécutifs</li>
        </ul>
        <p className="mt-4 italic text-slate-400">Les services sont fournis "tels quels" sans garantie expresse ou implicite de résultats financiers.</p>
      </LegalSection>

      <LegalSection number="6" title="PROPRIÉTÉ INTELLECTUELLE">
        <p>Tout le contenu de cette plateforme est protégé:</p>
        <p className="mt-4 font-semibold text-white">© 2025 Planify / Konekte Group<br/>Tous droits réservés.</p>
        <p className="mt-4 font-semibold text-white">Protégé:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1 text-slate-300">
          <li>Logo et identité visuelle Planify</li>
          <li>Textes et contenus rédactionnels</li>
          <li>Code source de la plateforme</li>
          <li>Base de données et structure</li>
        </ul>
        <p className="mt-4">Toute reproduction, distribution ou utilisation sans autorisation écrite préalable est strictement interdite.</p>
      </LegalSection>

      <LegalSection number="7" title="LIENS EXTERNES">
        <p>Notre plateforme peut contenir des liens vers des sites tiers.</p>
        <p className="mt-2">Planify n'est pas responsable du contenu, de la confidentialité ou des pratiques de ces sites externes.</p>
        <p className="mt-2">La présence d'un lien n'implique pas notre approbation du site lié.</p>
      </LegalSection>

      <LegalSection number="8" title="MODIFICATIONS DES CONDITIONS">
        <p>Nous nous réservons le droit de modifier ces conditions en tout temps.</p>
        <p className="mt-2">Les modifications entrent en vigueur dès leur publication.</p>
        <p className="mt-2">Il vous incombe de consulter régulièrement cette page.</p>
        <p className="mt-2">L'utilisation continue de la plateforme après modification constitue votre acceptation des nouvelles conditions.</p>
      </LegalSection>

      <LegalSection number="9" title="DROIT APPLICABLE ET JURIDICTION">
        <p>Les présentes conditions sont régies par les lois de la province de Québec et les lois fédérales du Canada applicables.</p>
        <p className="mt-2">Tout litige sera soumis à la juridiction exclusive des tribunaux de la province de Québec.</p>
        <p className="mt-4 font-semibold text-white">Lois applicables:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1 text-slate-300">
          <li>Code civil du Québec</li>
          <li>Loi sur la protection des renseignements personnels (Loi 25)</li>
          <li>Loi sur la distribution de produits et services financiers</li>
          <li>Règlements de l'AMF</li>
        </ul>
      </LegalSection>

      <LegalSection number="10" title="CONTACT">
        <p>Pour toute question concernant ces conditions d'utilisation:</p>
        <p className="mt-4">
          📧 <a href="mailto:planifier@konektegroup.com" className="text-blue-400 hover:underline">planifier@konektegroup.com</a><br/>
          🌐 <a href="https://planifier.konektegroup.com" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">planifier.konektegroup.com</a>
        </p>
        <p className="mt-2 italic">Nous répondrons dans un délai de 5 jours ouvrables.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
