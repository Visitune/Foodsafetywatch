import { CheckCircle2, PhoneCall } from 'lucide-react';
import { PRICING_PLANS } from '../data/sourcesData.js';
import type { AppCtx } from './ctx.js';

export function TarifsTab({ ctx }: { ctx: AppCtx }) {
  const { setActiveTab, setIsModalOpen, showToast } = ctx;
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">

      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2">
          <div className="h-[2px] w-6 bg-[#EA580C]"></div>
          <span className="text-xs font-mono-code uppercase tracking-widest text-[#EA580C]">
            TARIFICATION TRANSPARENTE
          </span>
          <div className="h-[2px] w-6 bg-[#EA580C]"></div>
        </div>
        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
          Des offres pour <span className="text-[#EA580C]">tous les besoins</span>
        </h2>
        <p className="text-sm text-slate-500">
          De la découverte gratuite à la solution entreprise avec expert auditeur dédié. Sans engagement, sans carte bancaire.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {PRICING_PLANS.map(plan => {
          return (
            <div 
              key={plan.id}
              className={`bg-[#111827] rounded-3xl p-8 flex flex-col justify-between border relative ${
                plan.isPopular 
                  ? 'border-[#EA580C] shadow-2xl shadow-[#EA580C]/20' 
                  : 'border-slate-800'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="mb-4">
                  <span className={`text-[10px] font-bold font-mono-code px-3 py-1 rounded-full border uppercase tracking-wider ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-heading font-extrabold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-2 min-h-[48px] leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="mt-6 mb-6 pb-6 border-b border-slate-800">
                  {plan.surDevis ? (
                    <div className="text-3xl font-heading font-extrabold text-white">Sur devis</div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-heading font-extrabold text-white">
                          {plan.trialDays > 0 ? 'Gratuit' : `${plan.priceMonthly} €`}
                        </span>
                        {plan.trialDays === 0 && (
                          <span className="text-xs text-slate-400 font-medium">/mois HT</span>
                        )}
                      </div>
                      {plan.trialDays > 0 && (
                        <div className="text-xs text-emerald-400 font-mono-code mt-1 font-semibold">
                          90 jours d'essai gratuit, puis 29 €/mois
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Features list */}
                <div className="space-y-3 text-xs">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 pt-6 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    if (plan.surDevis) {
                      setIsModalOpen(true);
                    } else {
                      setActiveTab('portail');
                      showToast(`Offre ${plan.name} sélectionnée !`);
                    }
                  }}
                  className={`w-full py-3.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
                    plan.isPopular
                      ? 'bg-[#EA580C] hover:bg-[#ea580c] text-white shadow-[#EA580C]/25'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  {plan.ctaText}
                </button>
                <div className="text-[10px] text-center text-slate-500 font-mono-code">
                  {plan.ctaSubtext}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Expert callback notice */}
      <div className="text-center bg-[#111827] border border-slate-800 p-8 rounded-2xl max-w-3xl mx-auto space-y-4">
        <h4 className="font-heading font-bold text-lg text-white">Besoin d'un audit de votre périmètre réglementaire ?</h4>
        <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
          Un expert VisiPilot analyse votre catalogue produits, vos destinations d'exportation et vos certifications pour dimensionner votre veille.
        </p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 text-xs font-bold font-heading uppercase tracking-wider"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#EA580C]" />
          Être rappelé par un expert sous 48h
        </button>
      </div>

    </div>
  );
}
