import React from 'react';
import Link from 'next/link';

interface LegalHero {
  tag: string;
  title: string;
  description: string;
  meta: {
    effectiveDate: string;
    lastUpdate: string;
    version: string;
  };
}

interface LegalSection {
  id: string;
  number: string;
  title: string;
  content: string; // HTML content
}

interface ContactBox {
  company: string;
  email: string;
  website: string;
  responseDelay: string;
}

interface ModernLegalLayoutProps {
  hero: LegalHero;
  sections: LegalSection[];
  contactBox: ContactBox;
}

export default function ModernLegalLayout({ hero, sections, contactBox }: ModernLegalLayoutProps) {
  return (
    <div className="modern-legal-page min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: `
        .modern-legal-page {
          --navy: #0d1f3c;
          --navy-light: #162d52;
          --gold: #c9a84c;
          --gold-light: #e2c97e;
          --cream: #faf8f4;
          --text: #2a2a2a;
          --muted: #6b7280;
          --border: #e5e0d5;
          --white: #ffffff;
          
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--text);
          line-height: 1.75;
          font-size: 16px;
        }

        .modern-legal-page header {
          background: var(--navy);
          padding: 0;
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 3px solid var(--gold);
        }

        .modern-legal-page .header-inner {
          max-width: 900px;
          margin: 0 auto;
          padding: 18px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modern-legal-page .logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          color: var(--white);
          font-weight: 700;
          letter-spacing: 0.02em;
          text-decoration: none;
        }

        .modern-legal-page .logo span { color: var(--gold); }

        .modern-legal-page .badge {
          font-size: 0.7rem;
          font-weight: 500;
          color: var(--gold-light);
          border: 1px solid var(--gold);
          padding: 3px 10px;
          border-radius: 20px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .modern-legal-page .hero {
          background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
          padding: 64px 32px 56px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .modern-legal-page .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 1;
        }

        .modern-legal-page .hero-tag {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 16px;
        }

        .modern-legal-page .hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          color: var(--white);
          margin-bottom: 16px;
          position: relative;
        }

        .modern-legal-page .hero p {
          color: rgba(255,255,255,0.65);
          font-size: 0.95rem;
          max-width: 540px;
          margin: 0 auto;
          position: relative;
        }

        .modern-legal-page .hero-meta {
          display: flex;
          justify-content: center;
          gap: 32px;
          margin-top: 32px;
          position: relative;
          flex-wrap: wrap;
        }

        .modern-legal-page .hero-meta span {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.5);
        }

        .modern-legal-page .hero-meta strong { color: var(--gold-light); font-weight: 500; }

        .modern-legal-page .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 64px 32px;
        }

        .modern-legal-page .toc {
          background: var(--white);
          border: 1px solid var(--border);
          border-left: 4px solid var(--gold);
          border-radius: 8px;
          padding: 28px 32px;
          margin-bottom: 56px;
        }

        .modern-legal-page .toc-title {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .modern-legal-page .toc ol {
          padding-left: 20px;
          columns: 2;
          gap: 24px;
        }

        .modern-legal-page .toc li {
          margin-bottom: 8px;
        }

        .modern-legal-page .toc a {
          color: var(--muted);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s;
        }

        .modern-legal-page .toc a:hover { color: var(--gold); }

        @media (max-width: 600px) { .modern-legal-page .toc ol { columns: 1; } }

        .modern-legal-page section {
          margin-bottom: 56px;
          scroll-margin-top: 80px;
        }

        .modern-legal-page .section-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: var(--gold);
          color: var(--navy);
          font-size: 0.8rem;
          font-weight: 700;
          border-radius: 50%;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .modern-legal-page .section-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }

        .modern-legal-page h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: var(--navy);
          margin: 0;
        }

        .modern-legal-page h3 {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          color: var(--navy);
          margin: 20px 0 10px;
        }

        .modern-legal-page .legal-content p { margin-bottom: 14px; color: #3a3a3a; font-size: 0.94rem; }
        .modern-legal-page .legal-content p:last-child { margin-bottom: 0; }

        .modern-legal-page .legal-content ul, 
        .modern-legal-page .legal-content ol {
          padding-left: 24px;
          margin-bottom: 14px;
        }

        .modern-legal-page .legal-content li {
          margin-bottom: 6px;
          font-size: 0.94rem;
          color: #3a3a3a;
        }

        .modern-legal-page .card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 20px 24px;
          margin: 16px 0;
        }

        .modern-legal-page .card-title {
          font-weight: 600;
          color: var(--navy);
          font-size: 0.9rem;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .modern-legal-page .alert {
          background: #fffbf0;
          border: 1px solid #f0d080;
          border-left: 4px solid var(--gold);
          border-radius: 6px;
          padding: 16px 20px;
          margin: 20px 0;
          font-size: 0.88rem;
          color: #5a4a10;
        }

        .modern-legal-page .alert strong { color: #3d3000; }

        .modern-legal-page .alert-blue {
          background: #f0f4ff;
          border-color: #bfcfff;
          border-left-color: #3b5bdb;
          color: #1a2a6b;
        }

        .modern-legal-page .alert-red {
          background: #fff5f5;
          border-color: #ffa8a8;
          border-left-color: #e03131;
          color: #6b1515;
        }

        .modern-legal-page .table-wrap { overflow-x: auto; margin: 16px 0; }
        .modern-legal-page table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        .modern-legal-page thead tr { background: var(--navy); color: var(--white); }
        .modern-legal-page th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 500;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .modern-legal-page td {
          padding: 11px 16px;
          border-bottom: 1px solid var(--border);
          vertical-align: top;
        }

        .modern-legal-page tbody tr:hover { background: #f9f7f3; }

        .modern-legal-page .rights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin: 20px 0;
        }

        .modern-legal-page .right-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 20px;
        }

        .modern-legal-page .right-icon {
          font-size: 1.4rem;
          margin-bottom: 10px;
        }

        .modern-legal-page .right-title {
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 6px;
        }

        .modern-legal-page .right-desc { font-size: 0.83rem; color: var(--muted); line-height: 1.6; }

        .modern-legal-page .contact-box {
          background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
          border-radius: 12px;
          padding: 36px 40px;
          color: var(--white);
          margin-top: 32px;
        }

        .modern-legal-page .contact-box h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          color: var(--white);
          margin-bottom: 20px;
        }

        .modern-legal-page .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .modern-legal-page .contact-item { font-size: 0.875rem; }
        .modern-legal-page .contact-label {
          color: var(--gold-light);
          font-size: 0.72rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 4px;
        }

        .modern-legal-page .contact-value { color: rgba(255,255,255,0.85); }
        .modern-legal-page .contact-value a { color: var(--gold-light); text-decoration: none; }

        .modern-legal-page footer {
          background: var(--navy);
          padding: 28px 32px;
          text-align: center;
          border-top: 3px solid var(--gold);
        }

        .modern-legal-page footer p { font-size: 0.8rem; color: rgba(255,255,255,0.45); margin: 0; }
        .modern-legal-page footer a { color: var(--gold-light); text-decoration: none; }

        .modern-legal-page .highlight-box {
          background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
          border-radius: 12px;
          padding: 32px 36px;
          color: var(--white);
          margin: 24px 0;
        }
        .modern-legal-page .highlight-box p { color: rgba(255,255,255,0.8); margin-bottom: 10px; font-size: 0.9rem; }
        .modern-legal-page .highlight-box h3 { color: var(--gold-light); margin-bottom: 14px; font-family: 'Playfair Display', serif; }

        .modern-legal-page .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 16px 0;
        }

        @media (max-width: 600px) { .modern-legal-page .two-col { grid-template-columns: 1fr; } }

        .modern-legal-page .col-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 20px;
        }

        .modern-legal-page .col-card-title {
          font-weight: 600;
          font-size: 0.88rem;
          color: var(--navy);
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 2px solid var(--gold);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      ` }} />

      {/* HEADER */}
      <header>
        <div className="header-inner">
          <Link href="/" className="logo">Plani<span>fy</span></Link>
          <span className="badge">Supervisé par l'AMF</span>
        </div>
      </header>

      {/* HERO */}
      <div className="hero">
        <div className="hero-tag">{hero.tag}</div>
        <h1>{hero.title}</h1>
        <p>{hero.description}</p>
        <div className="hero-meta">
          <span><strong>Entrée en vigueur :</strong> {hero.meta.effectiveDate}</span>
          <span><strong>Dernière mise à jour :</strong> {hero.meta.lastUpdate}</span>
          <span><strong>Version :</strong> {hero.meta.version}</span>
        </div>
      </div>

      {/* MAIN */}
      <main className="container">
        {/* TABLE DES MATIÈRES */}
        <nav className="toc">
          <div className="toc-title">Table des matières</div>
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        {/* SECTIONS */}
        <div className="legal-content">
          {sections.map((section) => (
            <section id={section.id} key={section.id}>
              <div className="section-header">
                <span className="section-number">{section.number}</span>
                <h2>{section.title}</h2>
              </div>
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </section>
          ))}
        </div>

        {/* CONTACT BOX */}
        <div className="contact-box">
          <h3>Responsable de la protection des renseignements personnels (RPRP)</h3>
          <div className="contact-grid">
            <div className="contact-item">
              <span className="contact-label">Entreprise</span>
              <span className="contact-value">{contactBox.company}</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Courriel dédié</span>
              <span className="contact-value">
                <a href={`mailto:${contactBox.email}`}>{contactBox.email}</a>
              </span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Site Web</span>
              <span className="contact-value">
                <a href={contactBox.website} target="_blank" rel="noopener noreferrer">{contactBox.website.replace('https://', '')}</a>
              </span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Délai de réponse</span>
              <span className="contact-value">{contactBox.responseDelay}</span>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-12 border-t-3 border-[#c9a84c]">
        <p className="text-[0.8rem] text-white/45">© 2025 Planify — {contactBox.company} | <Link href="/conditions-utilisation" className="text-[#e2c97e] no-underline">Conditions d'utilisation</Link> | <Link href="/politique-confidentialite" className="text-[#e2c97e] no-underline">Politique de confidentialité</Link></p>
        <p className="mt-2 text-[0.8rem] text-white/45">Représentant accrédité AMF du Québec — Les services financiers sont offerts par des travailleurs autonomes accrédités.</p>
      </footer>
    </div>
  );
}
