import React from 'react';
import LegalPageLayout, { LegalSection } from '@/components/LegalPageLayout';

export const metadata = {
  title: 'Politique de confidentialité | Planify',
  description: 'Notre politique de confidentialité conforme à la Loi 25 du Québec',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Politique de confidentialité"
      icon="🔒"
      lastUpdated="9 mai 2025"
      badge="Conforme à la Loi 25 du Québec (Loi modernisant des dispositions législatives en matière de protection des renseignements personnels)"
    >
      <LegalSection number="1" title="RESPONSABLE DE LA PROTECTION DES RENSEIGNEMENTS PERSONNELS">
        <p>Conformément à la Loi 25 du Québec, un responsable de la protection des renseignements personnels a été désigné au sein de notre organisation.</p>
        <p>Pour toute question concernant la protection de vos renseignements personnels, vous pouvez nous contacter:</p>
        <p className="mt-4">
          📧 Email: <a href="mailto:planifier@konektegroup.com" className="text-blue-400 hover:underline">planifier@konektegroup.com</a><br/>
          🌐 Site: <a href="https://planifier.konektegroup.com" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">planifier.konektegroup.com</a>
        </p>
      </LegalSection>

      <LegalSection number="2" title="RENSEIGNEMENTS COLLECTÉS">
        <p>Nous collectons uniquement les renseignements nécessaires à la prestation de nos services:</p>
        <div className="space-y-4 mt-4">
          <div>
            <p className="font-semibold text-white">a) Informations d'identification:</p>
            <ul className="list-disc ml-6 mt-2 text-slate-300">
              <li>Prénom et nom</li>
              <li>Adresse courriel</li>
              <li>Numéro de téléphone</li>
              <li>Ville et province de résidence</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">b) Informations financières générales:</p>
            <ul className="list-disc ml-6 mt-2 text-slate-300">
              <li>Besoins financiers exprimés</li>
              <li>Situation familiale générale</li>
              <li>Préférences de services</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">c) Informations de navigation:</p>
            <ul className="list-disc ml-6 mt-2 text-slate-300">
              <li>Adresse IP (anonymisée)</li>
              <li>Pages visitées</li>
              <li>Source de la visite (UTM)</li>
              <li>Durée de la session</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="font-semibold text-white mb-2">Nous ne collectons JAMAIS:</p>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">❌ Numéro d'assurance sociale</li>
            <li className="flex items-center gap-2">❌ Informations bancaires</li>
            <li className="flex items-center gap-2">❌ Documents financiers</li>
            <li className="flex items-center gap-2">❌ Informations médicales détaillées</li>
          </ul>
        </div>
      </LegalSection>

      <LegalSection number="3" title="FINALITÉS DE LA COLLECTE">
        <p>Vos renseignements sont utilisés exclusivement pour:</p>
        <ul className="list-disc ml-6 mt-4 space-y-2">
          <li>Vous contacter suite à votre demande de consultation ou de carrière</li>
          <li>Vous présenter les services adaptés à votre situation</li>
          <li>Améliorer nos services et notre plateforme</li>
          <li>Respecter nos obligations légales envers l'AMF du Québec</li>
          <li>Vous envoyer des communications pertinentes (avec votre consentement)</li>
        </ul>
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="font-semibold text-white mb-2">Vos renseignements ne sont JAMAIS utilisés pour:</p>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">❌ Être vendus à des tiers</li>
            <li className="flex items-center gap-2">❌ Marketing non sollicité</li>
            <li className="flex items-center gap-2">❌ Profilage automatisé</li>
          </ul>
        </div>
      </LegalSection>

      <LegalSection number="4" title="CONSENTEMENT">
        <p>En soumettant notre formulaire, vous consentez expressément à:</p>
        <ul className="list-disc ml-6 mt-4 space-y-2">
          <li>La collecte des renseignements fournis</li>
          <li>Être contacté par un représentant autonome accrédité AMF</li>
          <li>L'utilisation de vos données aux fins décrites dans la présente politique</li>
        </ul>
        <p className="mt-4">Vous pouvez retirer votre consentement en tout temps en nous contactant.</p>
        <p>Le retrait du consentement n'affecte pas la légalité des traitements effectués avant ce retrait.</p>
      </LegalSection>

      <LegalSection number="5" title="COMMUNICATION À DES TIERS">
        <p>Vos renseignements personnels peuvent être communiqués à:</p>
        <ul className="space-y-2 mt-4">
          <li className="flex items-center gap-2">✅ Représentants accrédités AMF (pour vous contacter)</li>
          <li className="flex items-center gap-2">✅ Fournisseurs de services technologiques (hébergement sécurisé - Supabase/Vercel)</li>
          <li className="flex items-center gap-2">✅ Autorités légales (si requis par la loi)</li>
        </ul>
        <p className="mt-4">Tous nos partenaires sont contractuellement tenus de respecter la confidentialité de vos données et la Loi 25.</p>
        <p className="font-semibold text-white mt-2">Nous ne vendons, louons ou partageons JAMAIS vos données à des fins commerciales.</p>
      </LegalSection>

      <LegalSection number="6" title="CONSERVATION DES DONNÉES">
        <p>Vos renseignements sont conservés selon les délais suivants:</p>
        <ul className="list-disc ml-6 mt-4 space-y-2">
          <li>Demandes de consultation: 2 ans</li>
          <li>Dossiers clients actifs: durée de la relation + 7 ans (obligation AMF)</li>
          <li>Données de navigation: 13 mois</li>
          <li>Candidatures représentants: 1 an</li>
        </ul>
        <p className="mt-4">À l'expiration de ces délais, vos données sont supprimées de façon sécurisée et irréversible.</p>
      </LegalSection>

      <LegalSection number="7" title="SÉCURITÉ DES DONNÉES">
        <p>Nous mettons en œuvre des mesures de sécurité robustes:</p>
        <ul className="space-y-2 mt-4">
          <li className="flex items-center gap-2">🔐 Chiffrement SSL/TLS (HTTPS)</li>
          <li className="flex items-center gap-2">🔐 Base de données chiffrée (Supabase)</li>
          <li className="flex items-center gap-2">🔐 Accès restreint aux données</li>
          <li className="flex items-center gap-2">🔐 Authentification à deux facteurs pour l'accès administrateur</li>
          <li className="flex items-center gap-2">🔐 Sauvegardes régulières sécurisées</li>
        </ul>
        <p className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg text-blue-100">
          En cas d'incident de confidentialité, nous nous engageons à vous notifier dans les 72 heures conformément à la Loi 25.
        </p>
      </LegalSection>

      <LegalSection number="8" title="VOS DROITS (Loi 25 Québec)">
        <p>Conformément à la Loi 25, vous avez le droit de:</p>
        <ul className="space-y-4 mt-4">
          <li className="flex items-start gap-3">
            <span className="text-xl">📋</span>
            <div>
              <p className="font-semibold text-white">Accès</p>
              <p>Obtenir une copie de vos données personnelles</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">✏️</span>
            <div>
              <p className="font-semibold text-white">Rectification</p>
              <p>Corriger des informations inexactes</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">🗑️</span>
            <div>
              <p className="font-semibold text-white">Effacement</p>
              <p>Demander la suppression de vos données ("droit à l'oubli")</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">📦</span>
            <div>
              <p className="font-semibold text-white">Portabilité</p>
              <p>Recevoir vos données dans un format structuré</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">⛔</span>
            <div>
              <p className="font-semibold text-white">Opposition</p>
              <p>Vous opposer à certains traitements de vos données</p>
            </div>
          </li>
        </ul>
        <div className="mt-6">
          <p>Pour exercer ces droits, contactez-nous:</p>
          <p>📧 <a href="mailto:planifier@konektegroup.com" className="text-blue-400 hover:underline">planifier@konektegroup.com</a></p>
          <p className="mt-2 italic">Nous répondrons dans un délai de 30 jours.</p>
        </div>
      </LegalSection>

      <LegalSection number="9" title="TÉMOINS (COOKIES)">
        <p>Notre site utilise des témoins (cookies) pour:</p>
        <div className="space-y-4 mt-4">
          <div>
            <p className="font-semibold text-white">Témoins essentiels (requis):</p>
            <ul className="list-disc ml-6 mt-1 text-slate-300">
              <li>Session d'authentification</li>
              <li>Préférences de langue</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">Témoins analytiques (avec consentement):</p>
            <ul className="list-disc ml-6 mt-1 text-slate-300">
              <li>PostHog Analytics (comportement anonyme)</li>
              <li>Statistiques de visite</li>
            </ul>
          </div>
        </div>
        <p className="mt-4">Vous pouvez gérer vos préférences de témoins dans les paramètres de votre navigateur.</p>
      </LegalSection>

      <LegalSection number="10" title="MODIFICATIONS">
        <p>Nous nous réservons le droit de modifier cette politique en tout temps. Les modifications entrent en vigueur dès leur publication sur cette page.</p>
        <p>Nous vous informerons de tout changement important par courriel si vous êtes un client actif.</p>
        <p className="mt-4 font-semibold text-white">Dernière révision: 9 mai 2025</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
