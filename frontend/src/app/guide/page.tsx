"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle, Lock, Download, Mail, User, Phone, MapPin } from "lucide-react";
import { useContent } from "@/hooks/useContent";

export default function GuidePage() {
  const { content } = useContent('guide', 'main', {
    hero: {
      title: "Débloquez votre Guide Financier",
      subtitle: "Entrez vos informations pour accéder gratuitement au guide de 10 pages sur les finances québécoises."
    }
  });

  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", telephone: "", ville: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const hasAccess = localStorage.getItem("planify_guide_unlocked");
    if (hasAccess === "true") {
      setUnlocked(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: insertError } = await supabase.from("prospects").insert({
        type: "client", 
        prenom: form.prenom,
        nom: form.nom,
        email: form.email,
        telephone: form.telephone || "Non fourni",
        ville: form.ville || "Non spécifié",
        message: "GUIDE_DOWNLOAD: Téléchargement du Guide Financier",
        statut: "nouveau"
      });

      if (insertError) {
        console.error("Supabase error:", insertError);
        throw new Error(insertError.message || "Erreur de base de données");
      }

      localStorage.setItem("planify_guide_unlocked", "true");
      setUnlocked(true);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] -ml-48 -mb-48" />

        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              <Lock className="w-3 h-3" /> Contenu Privé
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {content.hero.title}
            </h1>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed font-medium">
              {content.hero.subtitle}
            </p>
            <ul className="space-y-4 text-slate-300 font-bold text-sm hidden md:block">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" /> Assurance, Dettes, REER & CELI
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" /> Plan d'action en 5 étapes
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" /> Format PDF téléchargeable
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-blue-900/40">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold border border-red-100 flex flex-col gap-1">
                  <span>Une erreur est survenue lors de l'enregistrement :</span>
                  <span className="opacity-80 font-mono">{error}</span>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3 h-3" /> Prénom
                  </label>
                  <input
                    required
                    type="text"
                    value={form.prenom}
                    onChange={e => setForm({...form, prenom: e.target.value})}
                    placeholder="Jean"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3 h-3" /> Nom
                  </label>
                  <input
                    required
                    type="text"
                    value={form.nom}
                    onChange={e => setForm({...form, nom: e.target.value})}
                    placeholder="Tremblay"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Courriel
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="jean@exemple.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Phone className="w-3 h-3" /> Téléphone
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.telephone}
                    onChange={e => setForm({...form, telephone: e.target.value})}
                    placeholder="514-000-0000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Ville
                  </label>
                  <input
                    required
                    type="text"
                    value={form.ville}
                    onChange={e => setForm({...form, ville: e.target.value})}
                    placeholder="Montréal"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-3 group active:scale-95 disabled:opacity-50 mt-4"
              >
                {loading ? "Déblocage en cours..." : (
                  <>
                    Débloquer le Guide Gratuit <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-slate-400 text-center font-medium leading-relaxed">
                En débloquant le guide, vous acceptez de recevoir nos conseils financiers. <br /> 
                Vos données sont 100% sécurisées et nous détestons le spam.
              </p>
            </form>
          </div>

        </div>
      </main>
    );
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bitter:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

        :root {
          --blue-dark: #0C447C;
          --blue:      #185FA5;
          --blue-mid:  #3266ad;
          --blue-light:#E6F1FB;
          --green:     #1D9E75;
          --green-light:#E1F5EE;
          --amber:     #BA7517;
          --amber-light:#FAEEDA;
          --red:       #A32D2D;
          --red-light: #FCEBEB;
          --gray-dark: #2C2C2A;
          --gray:      #5F5E5A;
          --gray-light:#F1EFE8;
          --white:     #FFFFFF;
        }

        .guide-body {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: var(--gray-dark);
          background: #fff;
          max-width: 820px;
          margin: 0 auto;
          padding: 0;
        }

        .cover {
          background: var(--blue-dark);
          color: white;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 64px;
          position: relative;
          page-break-after: always;
        }
        .cover::before {
          content: '';
          position: absolute;
          bottom: 0; right: 0;
          width: 300px; height: 300px;
          background: var(--blue);
          border-radius: 50%;
          transform: translate(30%, 30%);
          opacity: 0.4;
        }
        .cover-badge {
          display: inline-block;
          background: var(--blue);
          color: white;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 20px;
          margin-bottom: 32px;
          width: fit-content;
        }
        .cover h1 {
          font-family: 'Bitter', serif;
          font-size: 42px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 24px;
          max-width: 560px;
        }
        .cover-subtitle {
          font-size: 16px;
          color: rgba(255,255,255,0.75);
          max-width: 480px;
          margin-bottom: 48px;
        }
        .cover-stats {
          display: flex;
          gap: 40px;
          margin-bottom: 64px;
        }
        .cover-stat { text-align: left; }
        .cover-stat .num { font-family: 'Bitter', serif; font-size: 32px; font-weight: 700; color: white; }
        .cover-stat .lbl { font-size: 12px; color: rgba(255,255,255,0.6); }
        .cover-footer {
          border-top: 1px solid rgba(255,255,255,0.15);
          padding-top: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .cover-logo { font-family: 'Bitter', serif; font-size: 22px; font-weight: 700; color: white; }
        .cover-amf  { font-size: 11px; color: rgba(255,255,255,0.5); }

        .toc-page {
          padding: 64px;
          page-break-after: always;
          min-height: 100vh;
        }
        .toc-title {
          font-family: 'Bitter', serif;
          font-size: 24px;
          color: var(--blue-dark);
          margin-bottom: 32px;
          padding-bottom: 12px;
          border-bottom: 2px solid var(--blue-light);
        }
        .toc-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 0;
          border-bottom: 1px solid var(--gray-light);
        }
        .toc-num {
          width: 32px; height: 32px;
          background: var(--blue-dark);
          color: white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600;
          flex-shrink: 0;
        }
        .toc-item-title { font-weight: 500; color: var(--gray-dark); flex: 1; }
        .toc-item-sub   { font-size: 12px; color: var(--gray); }

        .page {
          padding: 56px 64px;
          page-break-after: always;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .page:last-child { page-break-after: avoid; }

        .chapter-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--blue);
          margin-bottom: 8px;
        }
        h2.section-title {
          font-family: 'Bitter', serif;
          font-size: 28px;
          color: var(--blue-dark);
          line-height: 1.3;
          margin-bottom: 20px;
        }
        h3 {
          font-family: 'Bitter', serif;
          font-size: 17px;
          color: var(--blue-dark);
          margin: 28px 0 10px;
        }
        p { margin-bottom: 14px; color: var(--gray-dark); }

        .box {
          border-radius: 12px;
          padding: 20px 24px;
          margin: 20px 0;
        }
        .box-blue   { background: var(--blue-light);   border-left: 4px solid var(--blue); }
        .box-green  { background: var(--green-light);  border-left: 4px solid var(--green); }
        .box-amber  { background: var(--amber-light);  border-left: 4px solid var(--amber); }
        .box-red    { background: var(--red-light);    border-left: 4px solid var(--red); }
        .box-title  { font-weight: 600; font-size: 13px; margin-bottom: 8px; }
        .box-blue .box-title   { color: var(--blue-dark); }
        .box-green .box-title  { color: #085041; }
        .box-amber .box-title  { color: var(--amber); }
        .box-red .box-title    { color: var(--red); }

        .checklist { list-style: none; padding: 0; margin: 16px 0; }
        .checklist li {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 7px 0;
          border-bottom: 1px solid var(--gray-light);
          font-size: 13px;
        }
        .checklist li:last-child { border-bottom: none; }
        .check-box {
          width: 18px; height: 18px; min-width: 18px;
          border: 2px solid var(--blue);
          border-radius: 4px;
          margin-top: 2px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 13px;
        }
        th {
          background: var(--blue-dark);
          color: white;
          padding: 10px 14px;
          text-align: left;
          font-weight: 600;
          font-size: 12px;
        }
        td {
          padding: 10px 14px;
          border-bottom: 1px solid var(--gray-light);
        }
        tr:nth-child(even) td { background: var(--gray-light); }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin: 24px 0;
        }
        .stat-card {
          background: var(--blue-light);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }
        .stat-card .big { font-family: 'Bitter', serif; font-size: 32px; font-weight: 700; color: var(--blue-dark); }
        .stat-card .sml { font-size: 12px; color: var(--blue-mid); margin-top: 4px; }

        .steps { margin: 20px 0; }
        .step {
          display: flex; gap: 16px; align-items: flex-start;
          padding: 16px 0;
          border-bottom: 1px solid var(--gray-light);
        }
        .step:last-child { border-bottom: none; }
        .step-num {
          width: 36px; height: 36px; min-width: 36px;
          background: var(--blue-dark);
          color: white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 15px;
        }
        .step-content h4 { font-weight: 600; color: var(--blue-dark); margin-bottom: 4px; }
        .step-content p  { margin: 0; font-size: 13px; }

        .cta-page {
          background: var(--blue-dark);
          color: white;
          padding: 64px;
          page-break-before: always;
          min-height: 50vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        .cta-page h2 { font-family: 'Bitter', serif; font-size: 32px; margin-bottom: 16px; }
        .cta-page p  { color: rgba(255,255,255,0.75); font-size: 15px; max-width: 480px; margin-bottom: 32px; }
        .cta-url {
          display: inline-block;
          background: white;
          color: var(--blue-dark);
          font-weight: 700;
          font-size: 16px;
          padding: 16px 40px;
          border-radius: 12px;
          text-decoration: none;
          letter-spacing: 0.5px;
        }
        .cta-disclaimer { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 32px; }

        .page-footer {
          margin-top: auto;
          padding-top: 24px;
          border-top: 1px solid var(--gray-light);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          color: var(--gray);
        }

        @media print {
          body { background: white !important; }
          .guide-body { max-width: 100%; margin: 0; padding: 0; }
          .cover, .toc-page, .page, .cta-page { page-break-after: always; min-height: 100vh; }
          @page { size: A4; margin: 0; }
          .download-bar { display: none !important; }
        }

        .download-bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          background: var(--blue-dark);
          color: white;
          padding: 12px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 999;
          font-size: 13px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .download-bar button {
          background: white;
          color: var(--blue-dark);
          border: none;
          border-radius: 8px;
          padding: 8px 20px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .download-bar button:hover { transform: scale(1.05); }

        .spacer { flex: 1; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
      `}</style>

      <div className="guide-body animate-in fade-in duration-700">
        {/* Download bar (web only) */}
        <div className="download-bar">
          <div className="flex items-center gap-4">
            <a href="/" className="text-white hover:text-blue-200 font-bold">← Retour</a>
            <span>📋 Guide complet des finances personnelles québécoises — Planify</span>
          </div>
          <button onClick={() => window.print()}>⬇ Télécharger en PDF</button>
        </div>
        <div style={{ height: "52px" }}></div>

        {/* PAGE 1 — COUVERTURE */}
        <div className="cover">
          <div className="cover-badge">✅ Accrédité AMF Québec</div>
          <h1>Guide Complet des Finances Personnelles Québécoises</h1>
          <p className="cover-subtitle">Tout ce que vous devez savoir pour protéger votre famille, éliminer vos dettes et bâtir votre retraite — expliqué simplement.</p>
          <div className="cover-stats">
            <div className="cover-stat"><div className="num">5</div><div className="lbl">grandes étapes</div></div>
            <div className="cover-stat"><div className="num">45</div><div className="lbl">ans d'expertise</div></div>
            <div className="cover-stat"><div className="num">8M+</div><div className="lbl">familles aidées</div></div>
          </div>
          <div className="cover-footer">
            <div className="cover-logo">Planify</div>
            <div className="cover-amf">Supervisé par l'Autorité des marchés financiers du Québec (AMF)</div>
          </div>
        </div>

        {/* PAGE 2 — TABLE DES MATIÈRES */}
        <div className="toc-page">
          <h2 className="toc-title">Table des matières</h2>

          {[
            { n: 1, t: "La réalité financière des familles québécoises", s: "Pourquoi la majorité des Québécois ne sont pas préparés" },
            { n: 2, t: "Protéger votre famille — L'assurance vie temporaire", s: "Combien, pourquoi et comment choisir" },
            { n: 3, t: "Éliminer vos dettes intelligemment", s: "Méthodes, stratégies et calculs concrets" },
            { n: 4, t: "REER & CELI — Faire fructifier votre argent", s: "Comprendre les deux piliers de l'épargne au Québec" },
            { n: 5, t: "Protéger votre revenu — L'assurance invalidité", s: "Ce que la CNESST et l'assurance emploi ne couvrent pas" },
            { n: 6, t: "Votre plan en 5 étapes — Par où commencer", s: "Un plan d'action clair, dans le bon ordre" },
            { n: 7, t: "Lexique et ressources", s: "Définitions essentielles et liens utiles" }
          ].map(item => (
            <div key={item.n} className="toc-item">
              <div className="toc-num">{item.n}</div>
              <div>
                <div className="toc-item-title">{item.t}</div>
                <div className="toc-item-sub">{item.s}</div>
              </div>
            </div>
          ))}

          <div className="box box-blue" style={{ marginTop: "40px" }}>
            <div className="box-title">À qui s'adresse ce guide ?</div>
            <p style={{ margin: 0, fontSize: "13px" }}>Ce guide est conçu pour les familles québécoises de la classe moyenne qui veulent reprendre le contrôle de leurs finances — sans jargon inutile, sans pression de vente. Toutes les informations sont basées sur la réalité fiscale et légale du Québec.</p>
          </div>

          <div className="spacer"></div>
          <div className="page-footer">
            <span>Planify | Guide Finances Personnelles Québécoises</span>
            <span>planifier.konektegroup.com</span>
          </div>
        </div>

        {/* PAGE 3 — CHAPITRE 1 */}
        <div className="page">
          <div className="chapter-label">Chapitre 1</div>
          <h2 className="section-title">La réalité financière des familles québécoises</h2>
          <p>La majorité des familles québécoises travaillent fort, mais peu ont un plan financier structuré. Le résultat ? Des dettes qui s'accumulent, pas assez d'épargne pour la retraite, et une famille non protégée en cas de coup dur.</p>

          <div className="stats-row">
            <div className="stat-card"><div className="big">73%</div><div className="sml">des Québécois n'ont pas de plan financier écrit</div></div>
            <div className="stat-card"><div className="big">1/3</div><div className="sml">des Canadiens vivront une invalidité avant 65 ans</div></div>
            <div className="stat-card"><div className="big">68%</div><div className="sml">des familles n'ont pas 3 mois de réserve</div></div>
          </div>

          <h3>Les 5 problèmes les plus courants</h3>
          <div className="box box-red">
            <div className="box-title">⚠ Ce que vivent la plupart des familles</div>
            <ul style={{ paddingLeft: "16px", fontSize: "13px" }}>
              <li style={{ marginBottom: "6px" }}><strong>Dettes à taux élevé</strong> — Cartes de crédit à 19-22 %</li>
              <li style={{ marginBottom: "6px" }}><strong>Aucune protection</strong> — Famille sans assurance vie adéquate</li>
              <li style={{ marginBottom: "6px" }}><strong>Épargne insuffisante</strong> — Droits REER et CELI non maximisés</li>
              <li style={{ marginBottom: "6px" }}><strong>Impôts trop élevés</strong> — Absence de stratégie fiscale</li>
              <li><strong>Pas de plan</strong> — Aucune vision à long terme</li>
            </ul>
          </div>

          <h3>La philosophie qui transforme des vies</h3>
          <p style={{ fontStyle: "italic", fontSize: "16px", color: "var(--blue-dark)", borderLeft: "4px solid var(--blue)", paddingLeft: "16px", margin: "20px 0" }}>"Achetez du temporaire et investissez la différence."</p>
          <p>Cette philosophie simple, appliquée depuis 1977, permet aux familles de la classe moyenne de maximiser leur protection tout en bâtissant un patrimoine. Au lieu de payer trop cher pour une assurance permanente, on choisit la temporaire (moins chère) et on investit la différence.</p>

          <div className="spacer"></div>
          <div className="page-footer">
            <span>Planify | Chapitre 1 — La réalité québécoise</span>
            <span>planifier.konektegroup.com</span>
          </div>
        </div>

        {/* PAGE 4 — CHAPITRE 2 */}
        <div className="page">
          <div className="chapter-label">Chapitre 2</div>
          <h2 className="section-title">Protéger votre famille — L'assurance vie temporaire</h2>
          <p>Si vous décédiez demain, votre famille pourrait-elle maintenir son niveau de vie ? Pour la majorité des familles québécoises, la réponse honnête est non.</p>
          
          <h3>Temporaire vs permanente</h3>
          <table>
            <thead>
              <tr><th>Critère</th><th>Temporaire</th><th>Permanente</th></tr>
            </thead>
            <tbody>
              <tr><td>Durée</td><td>10, 20 ou 30 ans</td><td>Toute la vie</td></tr>
              <tr><td>Coût mensuel</td><td>25–80 $/mois</td><td>150–400 $/mois</td></tr>
              <tr><td>Recommandé pour</td><td>Familles, hypothèques</td><td>Successions complexes</td></tr>
            </tbody>
          </table>

          <div className="box box-blue">
            <div className="box-title">Formule de base</div>
            <p style={{ margin: "8px 0 0", fontSize: "13px" }}><strong>Couverture</strong> = (Revenu × 10) + Dettes − Épargne</p>
          </div>

          <div className="spacer"></div>
          <div className="page-footer">
            <span>Planify | Chapitre 2 — Assurance vie</span>
            <span>planifier.konektegroup.com</span>
          </div>
        </div>

        {/* PAGE 5 — CHAPITRE 3 */}
        <div className="page">
          <div className="chapter-label">Chapitre 3</div>
          <h2 className="section-title">Éliminer vos dettes intelligemment</h2>
          <p>Les dettes coûtent bien plus cher que ce que vous croyez. Un solde de 5 000 $ à 20% peut prendre 15 ans à rembourser au minimum.</p>

          <div className="two-col">
            <div className="box box-blue">
              <div className="box-title">⚡ Méthode Avalanche</div>
              <p style={{ fontSize: "13px", margin: 0 }}>Rembourser d'abord le taux le plus élevé. Optimal financièrement.</p>
            </div>
            <div className="box box-green">
              <div className="box-title">🎯 Méthode Boule de neige</div>
              <p style={{ fontSize: "13px", margin: 0 }}>Rembourser d'abord le plus petit solde. Optimal psychologiquement.</p>
            </div>
          </div>

          <div className="spacer"></div>
          <div className="page-footer">
            <span>Planify | Chapitre 3 — Dettes</span>
            <span>planifier.konektegroup.com</span>
          </div>
        </div>

        {/* PAGE 6 — CHAPITRE 4 */}
        <div className="page">
          <div className="chapter-label">Chapitre 4</div>
          <h2 className="section-title">REER & CELI — Faire fructifier votre argent</h2>
          <p>Le REER et le CELI sont les deux outils les plus puissants pour construire votre retraite au Canada.</p>

          <div className="box box-green">
            <div className="box-title">Règle générale</div>
            <ul style={{ paddingLeft: "16px", fontSize: "13px" }}>
              <li><strong>Revenu &lt; 50k$</strong> — Prioriser le CELI</li>
              <li><strong>Revenu &gt; 100k$</strong> — Prioriser le REER</li>
            </ul>
          </div>

          <div className="spacer"></div>
          <div className="page-footer">
            <span>Planify | Chapitre 4 — REER & CELI</span>
            <span>planifier.konektegroup.com</span>
          </div>
        </div>

        {/* PAGE 7 — CHAPITRE 5 */}
        <div className="page">
          <div className="chapter-label">Chapitre 5</div>
          <h2 className="section-title">Protéger votre revenu — L'assurance invalidité</h2>
          <p>Votre capacité à gagner votre vie est votre actif le plus précieux. Ne le laissez pas sans protection.</p>
          
          <div className="box box-red">
            <div className="box-title">Le risque réel</div>
            <p style={{ fontSize: "13px", margin: 0 }}>1 Canadien sur 3 vivra une invalidité de plus de 90 jours avant sa retraite. La CNESST ne couvre que les accidents de travail, pas les maladies.</p>
          </div>

          <div className="spacer"></div>
          <div className="page-footer">
            <span>Planify | Chapitre 5 — Invalidité</span>
            <span>planifier.konektegroup.com</span>
          </div>
        </div>

        {/* PAGE 8 — CHAPITRE 6 */}
        <div className="page">
          <div className="chapter-label">Chapitre 6</div>
          <h2 className="section-title">Votre plan en 5 étapes</h2>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <div className="step-content"><h4>Fonds d'urgence</h4><p>1 à 3 mois de dépenses dans un CELI.</p></div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <div className="step-content"><h4>Protection famille</h4><p>Assurance vie temporaire adéquate.</p></div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <div className="step-content"><h4>Dettes</h4><p>Éliminer les taux &gt; 8%.</p></div>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <div className="step-content"><h4>Investissement</h4><p>REER + CELI systématique.</p></div>
            </div>
            <div className="step">
              <div className="step-num">5</div>
              <div className="step-content"><h4>Revenu</h4><p>Assurance invalidité individuelle.</p></div>
            </div>
          </div>

          <div className="spacer"></div>
          <div className="page-footer">
            <span>Planify | Chapitre 6 — Plan 5 étapes</span>
            <span>planifier.konektegroup.com</span>
          </div>
        </div>

        {/* PAGE 9 — LEXIQUE */}
        <div className="page">
          <div className="chapter-label">Chapitre 7</div>
          <h2 className="section-title">Lexique & Ressources</h2>
          <div style={{ fontSize: "13px" }}>
            <p><strong>AMF</strong> — Autorité des marchés financiers.</p>
            <p><strong>CELI</strong> — Compte d'Épargne Libre d'Impôt.</p>
            <p><strong>REER</strong> — Régime Enregistré d'Épargne-Retraite.</p>
            <p><strong>RRQ</strong> — Régime de rentes du Québec.</p>
          </div>
          <div className="spacer"></div>
          <div className="page-footer">
            <span>Planify | Chapitre 7 — Lexique</span>
            <span>planifier.konektegroup.com</span>
          </div>
        </div>

        {/* PAGE 10 — CTA FINAL */}
        <div className="cta-page">
          <div style={{ fontSize: "48px", marginBottom: "24px" }}>🏆</div>
          <h2>Prêt à passer à l'action ?</h2>
          <p>Réservez votre consultation gratuite avec un conseiller Planify accrédité AMF.</p>
          <a className="cta-url" href="/?contact=true">Réserver ma consultation</a>
          <div className="cta-disclaimer">
            Les services financiers sont offerts par un représentant autonome accrédité par l'AMF. © 2025 Planify.
          </div>
        </div>
      </div>
    </>
  );
}
