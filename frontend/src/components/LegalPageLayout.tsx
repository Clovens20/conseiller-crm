import React from 'react';
import Link from 'next/link';

interface LegalPageLayoutProps {
  title: string;
  icon: string;
  lastUpdated: string;
  badge?: string;
  children: React.ReactNode;
}

export function LegalSection({
  number,
  title,
  icon,
  children
}: {
  number: string;
  title: string;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={`section-${number}`} className="mb-12 print:mb-6">
      <h2 className="text-xl font-bold text-white mb-4 mt-10 flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm shrink-0">
          {number}
        </span>
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{title}</span>
      </h2>
      <div className="text-slate-300 leading-relaxed space-y-4">
        {children}
      </div>
      <hr className="mt-12 border-slate-800 print:hidden" />
    </section>
  );
}

export default function LegalPageLayout({
  title,
  icon,
  lastUpdated,
  badge,
  children
}: LegalPageLayoutProps) {
  return (
    <div className="bg-slate-900 min-h-screen font-sans selection:bg-blue-500/30">
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 print:hidden">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-16 print:py-8 print:max-w-none">
        <header className="mb-16 p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="text-4xl">{icon}</span>
                {title}
              </h1>
              <div className="flex flex-col gap-2">
                <p className="text-slate-400 text-sm">
                  Dernière mise à jour: <span className="text-slate-300">{lastUpdated}</span>
                </p>
                {badge && (
                  <p className="text-xs font-medium text-emerald-400 bg-emerald-400/10 inline-flex px-3 py-1 rounded-full w-fit mt-2 leading-relaxed">
                    {badge}
                  </p>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="legal-content">
          {children}
        </div>

        <footer className="mt-24 pt-8 border-t border-slate-800 text-center print:hidden">
          <p className="text-slate-400 mb-6">
            Des questions? Contactez-nous:<br />
            <a href="mailto:planifier@konektegroup.com" className="text-blue-400 hover:text-blue-300 transition-colors mt-2 inline-block">
              📧 planifier@konektegroup.com
            </a>
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </footer>
      </main>
    </div>
  );
}
