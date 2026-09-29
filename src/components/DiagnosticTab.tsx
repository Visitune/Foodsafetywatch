import { AlertTriangle, CheckCircle2, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { DIAGNOSTIC_PROFILES } from '../data/sourcesData.js';
import type { AppCtx } from './ctx.js';

export function DiagnosticTab({ ctx }: { ctx: AppCtx }) {
  const { currentProfile, getSeverityBadge, setActiveTab, selectedProfileId, setSelectedProfileId, simplifiedView } = ctx;
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-10 text-slate-800 bg-slate-50">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2">
          <div className="h-[2px] w-6 bg-[#EA580C]"></div>
          <span className="text-xs font-mono-code uppercase tracking-widest text-[#EA580C] font-extrabold">
            CAS PRATIQUES & DÉMO INTERACTIVE
          </span>
          <div className="h-[2px] w-6 bg-[#EA580C]"></div>
        </div>
        <h2 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
          Découvrez la veille ciblée sur votre métier
        </h2>
        <p className="text-sm text-slate-500 font-semibold">
          Choisissez un profil d'entreprise agroalimentaire ci-dessous pour voir comment FoodSafetyWatch cartographie les risques, notifie les alertes et génère le plan de mise en conformité.
        </p>
      </div>

      {/* Profile Selector Buttons (Like SustainWatch) */}
      <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DIAGNOSTIC_PROFILES.map(profile => {
            const isSelected = profile.id === selectedProfileId;
            return (
              <button
                key={profile.id}
                onClick={() => setSelectedProfileId(profile.id)}
                className={`p-4 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-orange-50/50 border-[#EA580C] shadow-sm'
                    : 'bg-slate-50 border-slate-200/80 hover:border-slate-350 hover:bg-slate-100/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono-code text-[#EA580C] uppercase tracking-wider font-extrabold">
                    {profile.badge}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#EA580C]"></span>}
                </div>
                <div className="font-heading font-bold text-sm text-slate-900">{profile.name}</div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-semibold">{profile.companyName}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Detail Sheet (Matching SustainWatch) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-8 shadow-sm">

        {/* Top Identity Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-heading font-extrabold text-slate-900">
                {currentProfile.companyName}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 border border-orange-200 text-[#EA580C]">
                {currentProfile.name}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 font-semibold">
              {currentProfile.meta}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {currentProfile.tags.map((tag, i) => (
              <span 
                key={i}
                className={`text-[10px] font-bold px-2.5 py-1 rounded border uppercase tracking-wider ${
                  tag.type === 'critical' ? 'text-red-700 bg-red-50 border-red-200' :
                  tag.type === 'warning' ? 'text-orange-700 bg-orange-50 border-orange-200' :
                  'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* Regulatory Profile Table (Exact SustainWatch component) - Masqué si simplifié */}
        {!simplifiedView && (
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#EA580C]" />
              Profil Réglementaire & Périmètre d'Activité
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs shadow-2xs">
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-500 w-1/4">Secteur d'activité</td>
                    <td className="p-3 text-slate-900 font-bold">{currentProfile.secteur}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="p-3 font-semibold text-slate-500">Marchés de commercialisation</td>
                    <td className="p-3 text-slate-700 font-medium">{currentProfile.marches}</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-500">Filières d'importation matières</td>
                    <td className="p-3 text-slate-700 font-medium">{currentProfile.import}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Certifications & référentiels</td>
                    <td className="p-3 text-slate-700 font-medium">
                      <div className="flex flex-wrap gap-1.5">
                        {currentProfile.certifications.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded font-mono-code text-[11px] font-bold">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Targeted Alerts triggered for this profile */}
        <div className="space-y-4">
          <h4 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            Alertes réglementaires ciblées pour ce profil
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {currentProfile.alerts.map((alert, idx) => (
              <div key={idx} className="p-4 bg-slate-50/50 border border-slate-200 rounded-2xl shadow-2xs">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getSeverityBadge(alert.urgency)}`}>
                    {alert.urgency}
                  </span>
                  <span className="text-[10px] font-mono-code text-slate-500 font-semibold">
                    {alert.source} • {alert.date}
                  </span>
                </div>
                <h5 className="font-bold text-sm text-slate-900">{alert.title}</h5>
                <p className={`text-xs text-slate-600 mt-1.5 leading-relaxed font-medium ${simplifiedView ? 'line-clamp-1' : ''}`}>{alert.desc}</p>
                {!simplifiedView && (
                  <div className="mt-3 p-2.5 bg-red-50 border border-red-200/60 rounded-lg text-xs text-red-800 font-medium">
                    <strong className="font-bold text-red-900">Impact opérationnel :</strong> {alert.impact}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Prioritized Compliance Actions (Haute, Moyenne, Optionnelle) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Plan d'actions de mise en conformité
            </h4>
            <span className="text-[11px] font-bold text-[#EA580C] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded font-mono-code">
              {currentProfile.actions.length} actions préconisées
            </span>
          </div>

          <div className="space-y-3">
            {currentProfile.actions.map((act, idx) => (
              <div key={idx} className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl flex items-start gap-4 shadow-2xs">
                <div className="text-xl mt-0.5">{act.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono-code uppercase font-extrabold text-slate-500">
                      {act.priority === 'haute' ? '🔴 Priorité Haute' : act.priority === 'moyenne' ? '🟠 Priorité Moyenne' : '🟡 Optionnelle'}
                    </span>
                    <span className="text-[10px] font-mono-code text-[#EA580C] bg-orange-50 px-2 py-0.5 rounded border border-orange-200 font-extrabold">
                      Module {act.visipilotModule}
                    </span>
                  </div>
                  <div className="font-heading font-bold text-xs text-slate-950 mt-1">{act.title}</div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Value Added & VisiPilot Synergy Box */}
        <div className="p-5 bg-gradient-to-r from-blue-50 via-white to-white border border-blue-200 rounded-2xl space-y-3 shadow-2xs">
          <div className="text-xs font-heading font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Bénéfice opérationnel VisiPilot
          </div>
          <p className="text-xs text-slate-700 leading-relaxed italic font-medium">
            "{currentProfile.visipilotValue}"
          </p>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 font-bold">
            <strong>Synergie logicielle :</strong> {currentProfile.ecosystemSynergy}
          </div>
        </div>

        {/* CTA from Diagnostic to Trial */}
        <div className="text-center pt-4">
          <button
            onClick={() => setActiveTab('tarifs')}
            className="px-8 py-3.5 bg-[#EA580C] hover:bg-[#c2410c] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/15"
          >
            Configurer la veille pour mon entreprise — 3 mois gratuits
          </button>
        </div>

      </div>

    </div>
  );
}
