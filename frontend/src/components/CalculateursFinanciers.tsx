"use client";
// components/CalculateursFinanciers.tsx
// Intégrer dans ton projet : <CalculateursFinanciers />
// À placer par ex. dans app/calculateurs/page.tsx ou directement dans une page

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = "av" | "ret" | "dette";
type Freq  = "monthly" | "biweekly" | "weekly";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtCAD(n: number): string {
  return Math.round(n).toLocaleString("fr-CA") + "\u00a0$";
}
function fmtK(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(".", ",") + "\u00a0M\u00a0$";
  if (n >= 1_000)     return Math.round(n / 1_000) + "\u00a0k\u00a0$";
  return fmtCAD(n);
}

// ─── Slider field ─────────────────────────────────────────────────────────────
function SliderField({
  label, min, max, step, value, display, onChange,
}: {
  label: string; min: number; max: number; step: number;
  value: number; display: string; onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium">{label}</label>
      <div className="flex items-center gap-4">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <span className="text-sm font-semibold text-blue-900 text-right min-w-[90px] bg-blue-50 px-2 py-1 rounded-md">{display}</span>
      </div>
    </div>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────
function ResultCard({ label, value, variant = "default" }: {
  label: string; value: string; variant?: "default" | "highlight" | "success";
}) {
  const bg = variant === "highlight" ? "bg-blue-600 shadow-md" : variant === "success" ? "bg-emerald-50 border border-emerald-100" : "bg-white border border-gray-100 shadow-sm";
  const vColor = variant === "highlight" ? "text-white" : variant === "success" ? "text-emerald-700" : "text-blue-900";
  const lColor = variant === "highlight" ? "text-blue-100" : "text-gray-500";
  return (
    <div className={`${bg} rounded-2xl p-4 transition-all hover:scale-[1.02]`}>
      <p className={`text-[10px] uppercase tracking-wider font-bold mb-1 ${lColor}`}>{label}</p>
      <p className={`text-xl font-black ${vColor}`}>{value}</p>
    </div>
  );
}

// ─── Chart (assurance vie) ────────────────────────────────────────────────────
function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => Math.abs(d.value)));
  return (
    <div className="flex items-end gap-3 h-32 pt-4 px-2">
      {data.map((d) => (
        <div key={d.label} className="flex flex-col items-center flex-1 gap-1 group">
          <span className="text-[10px] font-bold text-gray-500 text-center opacity-0 group-hover:opacity-100 transition-opacity">{fmtK(Math.abs(d.value))}</span>
          <div
            className="w-full rounded-t-lg transition-all duration-500 ease-out"
            style={{ height: `${(Math.abs(d.value) / max) * 80}px`, backgroundColor: d.color, opacity: d.value < 0 ? 0.3 : 1 }}
          />
          <span className="text-[9px] font-medium text-gray-400 text-center leading-tight h-8 flex items-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Line chart (generic) ─────────────────────────────────────────────────────
function LineChart({ series }: { series: { label: string; points: number[]; color: string }[]; labels?: string[] }) {
  const allVals = series.flatMap((s) => s.points);
  const minV = 0, maxV = Math.max(...allVals, 1);
  const W = 600, H = 150, PAD = 8;
  const xs = (i: number, len: number) => PAD + (i / (len - 1)) * (W - PAD * 2);
  const ys = (v: number) => H - PAD - ((v - minV) / (maxV - minV)) * (H - PAD * 2);
  return (
    <div className="relative bg-white rounded-2xl p-2 border border-gray-100">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-40" role="img" aria-label="Graphique de croissance">
        {series.map((s) => {
          const pts = s.points.map((v, i) => `${xs(i, s.points.length)},${ys(v)}`).join(" ");
          const fill = `${pts} ${xs(s.points.length - 1, s.points.length)},${H} ${xs(0, s.points.length)},${H}`;
          return (
            <g key={s.label}>
              <polygon points={fill} fill={s.color} fillOpacity={0.08} className="transition-all duration-1000" />
              <polyline points={pts} fill="none" stroke={s.color} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" className="transition-all duration-1000" />
            </g>
          );
        })}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#f3f4f6" strokeWidth={2} />
      </svg>
      <div className="absolute top-4 right-4 flex flex-col gap-1">
        {series.map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="w-3 h-1 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-[9px] font-bold text-gray-400 uppercase">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ASSURANCE VIE tab ────────────────────────────────────────────────────────
function AssuranceVie() {
  const [income,  setIncome]  = useState(70000);
  const [years,   setYears]   = useState(20);
  const [debts,   setDebts]   = useState(250000);
  const [savings, setSavings] = useState(30000);

  const coverage = Math.max(0, income * years + debts - savings);
  const premium  = Math.round(coverage * 0.00005);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SliderField label="Revenu annuel" min={20000} max={200000} step={1000} value={income} display={fmtCAD(income)} onChange={setIncome} />
        <SliderField label="Années à couvrir" min={5} max={35} step={1} value={years} display={`${years} ans`} onChange={setYears} />
        <SliderField label="Dettes totales (hypothèque, prêts…)" min={0} max={800000} step={5000} value={debts} display={fmtCAD(debts)} onChange={setDebts} />
        <SliderField label="Épargne actuelle" min={0} max={500000} step={5000} value={savings} display={fmtCAD(savings)} onChange={setSavings} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Couverture recommandée" value={fmtK(coverage)} variant="highlight" />
        <ResultCard label="Prime estimée / mois" value={`~${fmtCAD(premium)}/m`} />
        <ResultCard label="Remplacement du revenu" value={`${years} ans`} />
      </div>

      <div className="bg-gray-50/50 rounded-3xl p-4 border border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 px-2">Répartition des besoins</p>
        <BarChart data={[
          { label: "Remplacement revenu", value: income * years, color: "#1d4ed8" },
          { label: "Dettes",              value: debts,           color: "#3b82f6" },
          { label: "Épargne déduite",     value: -savings,        color: "#10b981" },
        ]} />
      </div>

      <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <span className="text-blue-600 text-sm">💡</span>
        </div>
        <p className="text-xs text-blue-800 leading-relaxed font-medium">
          Estimation basée sur la règle des 10-12x le revenu + dettes - épargne. Un conseiller accrédité AMF calcule le montant exact selon vos bénéfices actuels.
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl p-6 shadow-lg shadow-blue-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-white font-bold mb-1">Besoin d'une soumission officielle ?</p>
          <p className="text-blue-100 text-xs">C'est gratuit et sans aucune obligation de votre part.</p>
        </div>
        <a href="/?contact=true" className="bg-white text-blue-900 font-black px-6 py-3 rounded-xl text-sm hover:scale-105 transition-transform active:scale-95 shadow-lg">Consultation gratuite →</a>
      </div>
    </div>
  );
}

// ─── RETRAITE tab ─────────────────────────────────────────────────────────────
function Retraite() {
  const [age,     setAge]     = useState(35);
  const [retire,  setRetire]  = useState(65);
  const [current, setCurrent] = useState(20000);
  const [amount,  setAmount]  = useState(400);
  const [rate,    setRate]    = useState(6);
  const [freq,    setFreq]    = useState<Freq>("monthly");

  const years = Math.max(0, retire - age);

  let monthly = 0;
  if (freq === "monthly")   { monthly = amount; }
  if (freq === "biweekly")  { monthly = amount * 26 / 12; }
  if (freq === "weekly")    { monthly = amount * 52 / 12; }

  const ppy = freq === "monthly" ? 12 : freq === "biweekly" ? 26 : 52;
  const r   = (rate / 100) / ppy;
  const n   = years * ppy;
  const fv  = years > 0 ? current * Math.pow(1 + r, n) + amount * (Math.pow(1 + r, n) - 1) / r : current;
  const tc  = current + amount * n;
  const gains = fv - tc;
  const monthlyIncome = fv * 0.04 / 12;

  const steps = Math.min(years, 20);
  const chartPoints = {
    total:   Array.from({ length: steps + 1 }, (_, i) => { const yr = Math.round(i * years / steps), ni = yr * ppy; return Math.round(current * Math.pow(1 + r, ni) + amount * (Math.pow(1 + r, ni) - 1) / r); }),
    cotise:  Array.from({ length: steps + 1 }, (_, i) => { const yr = Math.round(i * years / steps), ni = yr * ppy, fvi = current * Math.pow(1 + r, ni) + amount * (Math.pow(1 + r, ni) - 1) / r; return Math.round(Math.min(current + amount * ni, fvi)); }),
  };

  const freqBtn = (f: Freq, label: string) => (
    <button
      key={f}
      onClick={() => setFreq(f)}
      className={`flex-1 py-2.5 text-[10px] uppercase tracking-wider font-black transition ${
        freq === f ? "bg-blue-700 text-white shadow-inner" : "bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profil de l'investisseur</p>
          <span className="text-[10px] font-black bg-blue-100 text-blue-700 rounded-full px-3 py-1 uppercase tracking-widest">
            {years} ans de croissance
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <SliderField label="Âge actuel" min={18} max={70} step={1} value={age} display={`${age} ans`} onChange={setAge} />
          <SliderField label="Âge de retraite" min={50} max={75} step={1} value={retire} display={`${retire} ans`} onChange={setRetire} />
          <SliderField label="Épargne actuelle" min={0} max={500000} step={1000} value={current} display={fmtCAD(current)} onChange={setCurrent} />
        </div>
      </div>

      <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Cotisation & Fréquence</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <SliderField label="Montant de cotisation" min={0} max={2000} step={10} value={amount} display={fmtCAD(amount)} onChange={setAmount} />
          <div className="flex flex-col gap-2">
            <div className="flex border-2 border-gray-100 rounded-xl overflow-hidden bg-white">
              {freqBtn("monthly",   "Mensuel")}
              {freqBtn("biweekly",  "2 Sem.")}
              {freqBtn("weekly",    "Hebdo")}
            </div>
            <p className="text-[10px] text-center font-bold text-blue-600 uppercase">
              = {fmtCAD(monthly)} par mois
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <SliderField label="Rendement annuel estimé" min={1} max={12} step={0.5} value={rate} display={`${rate.toFixed(1).replace(".", ",")} %`} onChange={setRate} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Fonds accumulé"   value={fmtK(Math.round(fv))}     variant="highlight" />
        <ResultCard label="Rendements nets" value={`+${fmtK(Math.round(gains))}`} variant="success" />
        <ResultCard label="Total cotisé"     value={fmtK(Math.round(tc))} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-900 rounded-2xl p-5 text-white flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-emerald-300 uppercase mb-1">Revenu mensuel estimé</p>
            <p className="text-2xl font-black">{fmtCAD(Math.round(monthlyIncome))}</p>
          </div>
          <div className="text-3xl">🌴</div>
        </div>
        <ResultCard label="Effort mensuel équivalent"  value={`${fmtCAD(monthly)}/mois`} />
      </div>

      {years > 0 && (
        <div className="bg-gray-50/50 rounded-3xl p-4 border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 px-2">Croissance projetée</p>
          <LineChart series={[
            { label: "Capital Final",  points: chartPoints.total,  color: "#1d4ed8" },
            { label: "Total Cotisé", points: chartPoints.cotise, color: "#10b981" },
          ]} />
        </div>
      )}

      <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <span className="text-blue-600 text-sm">💰</span>
        </div>
        <p className="text-xs text-blue-800 leading-relaxed font-medium">
          Note: Cotiser aux 2 semaines accélère la croissance grâce aux intérêts composés. Estimation excluant la RRQ et la PSV.
        </p>
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-6 shadow-lg shadow-emerald-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-white font-bold mb-1">Voulez-vous un plan retraite complet ?</p>
          <p className="text-emerald-100 text-xs">Analyse gratuite de vos droits gouvernementaux incluse.</p>
        </div>
        <a href="/?contact=true" className="bg-white text-emerald-900 font-black px-6 py-3 rounded-xl text-sm hover:scale-105 transition-transform active:scale-95 shadow-lg">Bilan complet gratuit →</a>
      </div>
    </div>
  );
}

// ─── DETTES tab ───────────────────────────────────────────────────────────────
function Dettes() {
  const [balance, setBalance] = useState(20000);
  const [rate,    setRate]    = useState(19);
  const [payment, setPayment] = useState(400);

  const r = rate / 100 / 12;
  const payoffMonths = (b: number, p: number) => p <= b * r ? Infinity : Math.ceil(-Math.log(1 - (r * b) / p) / Math.log(1 + r));
  const totalInterest = (b: number, p: number) => { const m = payoffMonths(b, p); return isFinite(m) ? p * m - b : Infinity; };

  const mo       = payoffMonths(balance, payment);
  const interest = totalInterest(balance, payment);
  const p2       = payment * 1.15; // On propose +15% pour plus d'impact
  const saving   = Math.max(0, interest - totalInterest(balance, p2));
  const y = Math.floor(mo / 12), ms = mo % 12;
  const dur = isFinite(mo) ? `${y > 0 ? `${y} an${y > 1 ? "s" : ""}` : ""}${ms > 0 ? ` ${ms} mois` : ""}` : "Jamais";

  const maxM  = Math.min(isFinite(mo) ? mo : 120, 120);
  const step  = Math.max(1, Math.ceil(maxM / 14));
  const pts1: number[] = [], pts2: number[] = [];
  let b1 = balance, b2 = balance;
  for (let m = 0; m <= maxM; m += step) {
    pts1.push(Math.max(0, Math.round(b1)));
    pts2.push(Math.max(0, Math.round(b2)));
    for (let s = 0; s < step; s++) { b1 = Math.max(0, b1 * (1 + r) - payment); b2 = Math.max(0, b2 * (1 + r) - p2); }
  }
  pts1.push(0); pts2.push(0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-red-50/30 rounded-3xl p-6 border border-red-100">
        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-4">État de vos dettes</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SliderField label="Solde total"   min={1000}  max={100000} step={500}  value={balance} display={fmtCAD(balance)} onChange={setBalance} />
          <SliderField label="Taux d'intérêt" min={1}     max={30}     step={0.5}  value={rate}    display={`${rate.toFixed(1)} %`}  onChange={setRate} />
          <SliderField label="Paiement actuel" min={50}    max={5000}   step={50}   value={payment} display={fmtCAD(payment)} onChange={setPayment} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Libéré en"          value={dur}                                    variant="highlight" />
        <ResultCard label="Intérêts perdus" value={isFinite(interest) ? fmtK(Math.round(interest)) : "—"} />
        <ResultCard label="Économie si +15%/m" value={isFinite(saving) && saving > 0 ? `-${fmtK(Math.round(saving))}` : "—"} variant="success" />
      </div>

      <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 px-2">Vitesse de remboursement</p>
        <LineChart series={[
          { label: "Paiement actuel",   points: pts1, color: "#ef4444" },
          { label: "Boost +15%", points: pts2, color: "#10b981" },
        ]} />
      </div>

      <div className="bg-red-50/50 rounded-2xl p-4 border border-red-100 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <span className="text-red-600 text-sm">⚖️</span>
        </div>
        <p className="text-xs text-red-800 leading-relaxed font-medium">
          Augmenter votre paiement de seulement 15% peut vous faire économiser des milliers de dollars en intérêts et raccourcir votre dette de plusieurs mois.
        </p>
      </div>

      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-6 shadow-lg shadow-red-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <p className="text-white font-bold mb-1">Assez de payer des intérêts ?</p>
          <p className="text-red-100 text-xs">Découvrez notre stratégie "Avalanche" pour vous libérer.</p>
        </div>
        <a href="/?contact=true" className="bg-white text-red-900 font-black px-6 py-3 rounded-xl text-sm hover:scale-105 transition-transform active:scale-95 shadow-lg">Plan d'élimination gratuit →</a>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CalculateursFinanciers() {
  const [activeTab, setActiveTab] = useState<TabId>("av");
  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: "av",    label: "Assurance vie", icon: "🛡️" },
    { id: "ret",   label: "Retraite",      icon: "📈" },
    { id: "dette", label: "Dettes",        icon: "💳" },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-blue-900/5 p-4 md:p-10 max-w-4xl mx-auto overflow-hidden">
      {/* Tabs */}
      <div className="flex bg-gray-100/50 p-1.5 rounded-2xl mb-10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-4 text-[10px] md:text-xs uppercase tracking-widest font-black transition-all rounded-xl flex items-center justify-center gap-2 ${
              activeTab === t.id
                ? "bg-white text-blue-900 shadow-lg shadow-blue-900/5"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <span className="text-lg md:text-xl">{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="relative">
        {activeTab === "av"    && <AssuranceVie />}
        {activeTab === "ret"   && <Retraite />}
        {activeTab === "dette" && <Dettes />}
      </div>
    </div>
  );
}
