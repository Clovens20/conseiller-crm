import type { Metadata } from "next";
import CalculateursFinanciers from "@/components/CalculateursFinanciers";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Calculateurs Financiers Gratuits | Planify",
  description: "Calculez votre couverture d'assurance vie, planifiez votre retraite et estimez votre plan de remboursement de dettes. Outils gratuits pour les familles québécoises.",
  openGraph: {
    title: "Calculateurs Financiers Gratuits | Planify",
    description: "Estimez vos besoins financiers en quelques secondes avec nos outils interactifs.",
    url: "https://planifier.konektegroup.com/calculateurs",
    siteName: "Planify",
    locale: "fr_CA",
    type: "website",
  },
};

export default function CalculateursPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] selection:bg-blue-500/30">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-emerald-50/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
        
        {/* Navigation */}
        <div className="mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-700 transition-colors font-bold text-sm group"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
            Retour à l'accueil
          </Link>
        </div>

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">
            Outils Interactifs
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
            Prenez le contrôle de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">votre avenir financier</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Utilisez nos calculateurs gratuits pour obtenir une vue claire de votre situation et identifier des opportunités d'optimisation.
          </p>
        </div>

        {/* Component */}
        <div className="mb-20">
          <CalculateursFinanciers />
        </div>

        {/* Trust Section */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">Pourquoi utiliser nos outils ?</h2>
              <p className="text-slate-500 leading-relaxed font-medium mb-6">
                Nos calculateurs sont basés sur les réalités fiscales et financières du Québec. Ils vous permettent de simuler différents scénarios sans avoir à partager vos informations personnelles immédiatement.
              </p>
              <ul className="space-y-3">
                {[
                  "Algorithmes optimisés AMF",
                  "Calculs d'intérêts composés précis",
                  "Scénarios personnalisables à 100%",
                  "Confidentialité garantie (pas de collecte de données)"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10px]">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 rounded-[2rem] p-8 flex flex-col justify-center border border-blue-100">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-black text-blue-900 mb-2">Besoin d'un plan certifié ?</h3>
              <p className="text-blue-800/70 text-sm leading-relaxed mb-6 font-medium">
                Un calculateur est un bon début, mais il ne remplace pas l'analyse d'un expert accrédité AMF qui prendra en compte vos bénéfices gouvernementaux, votre fiscalité et votre tolérance au risque.
              </p>
              <Link 
                href="/?contact=true" 
                className="bg-blue-700 text-white font-black px-8 py-4 rounded-2xl text-center hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
              >
                Parler à un conseiller
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-slate-400 font-medium">
            © 2025 Planify. Les calculateurs sont fournis à titre indicatif seulement. <br />
            Consultez toujours un professionnel accrédité avant de prendre une décision financière.
          </p>
        </div>
      </footer>

    </main>
  );
}
