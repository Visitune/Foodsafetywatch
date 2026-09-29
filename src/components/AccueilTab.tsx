import { BookOpen, ChevronRight, Cpu, FileCheck, Globe2, PhoneCall, ShieldCheck, Sparkles } from 'lucide-react';
import type { AppCtx } from './ctx.js';

export function AccueilTab({ ctx }: { ctx: AppCtx }) {
  const { alerts, getSeverityBadge, setActiveTab, setExpandedAlertId, setIsModalOpen } = ctx;
  return (
    <div className="bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200/60 bg-white">
        {/* Subtle Industrial Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#EA580C_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Headlines & Call to action */}
            <div className="lg:col-span-7 space-y-6">

              {/* VisiPilot signature element */}
              <div className="flex items-center gap-2">
                <div className="h-[2px] w-8 bg-[#EA580C]"></div>
                <span className="text-xs font-mono-code uppercase tracking-widest text-[#EA580C] font-bold">
                  VEILLE RÉGLEMENTAIRE & SÉCURITÉ DES ALIMENTS
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tight leading-tight">
                La conformité en sécurité des aliments commence par une veille maîtrisée.<br/>
                <span className="text-[#EA580C]">FoodSafetyWatch par VisiPilot vous accompagne.</span>
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                Depuis plus de 15 ans sur le terrain industriel, <strong className="text-slate-900">VisiPilot</strong> harmonise excellence opérationnelle et solutions digitales. <strong className="text-slate-900">FoodSafetyWatch</strong> est le service de veille réglementaire et sanitaire pour l'agroalimentaire : nos experts analysent, qualifient et traduisent chaque alerte en plan d'action immédiat pour vos usines et laboratoires.
              </p>

              {/* 3 Key Stats matching SustainWatch */}
              <div className="grid grid-cols-3 gap-6 pt-4 pb-2 border-y border-slate-200">
                <div>
                  <div className="text-3xl font-heading font-extrabold text-[#EA580C]">6</div>
                  <div className="text-xs text-slate-500 mt-1 font-semibold">Domaines réglementaires couverts (UE & France)</div>
                </div>
                <div>
                  <div className="text-3xl font-heading font-extrabold text-slate-900">2</div>
                  <div className="text-xs text-slate-500 mt-1 font-semibold">Socles officiels : EUR-Lex/Cellar & Légifrance/PISTE</div>
                </div>
                <div>
                  <div className="text-3xl font-heading font-extrabold text-emerald-600">3 Mois</div>
                  <div className="text-xs text-slate-500 mt-1 font-semibold">D'essai gratuit sans engagement</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap items-center gap-4">
                  <button 
                    onClick={() => setActiveTab('tarifs')}
                    className="px-6 py-3.5 bg-[#EA580C] hover:bg-[#c2410c] text-white font-heading font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 group"
                  >
                    Commencer ma veille — 3 mois gratuits
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('diagnostic')}
                    className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-heading font-semibold text-sm rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-2"
                  >
                    <Cpu className="w-4 h-4 text-[#EA580C]" />
                    Voir la démo interactive
                  </button>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-3 pt-1 font-medium">
                  <span>Sans carte bancaire</span>
                  <span>·</span>
                  <span>Sans engagement</span>
                  <span>·</span>
                  <span>Résiliable en 1 clic</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="hover:text-[#EA580C] text-slate-700 underline underline-offset-4 flex items-center gap-1 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#EA580C]" />
                    Être rappelé par un auditeur VisiPilot
                  </button>
                  <span className="text-slate-300">·</span>
                  <button 
                    onClick={() => setActiveTab('portail')}
                    className="hover:text-[#EA580C] text-slate-700 underline underline-offset-4 transition-colors"
                  >
                    Déjà client ? Accéder au portail
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual Card with Recent Live Alerts */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200 shadow-lg rounded-3xl p-6 relative">

                {/* Top Card Badge */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                    <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider">
                      Dernières alertes validées
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono-code text-slate-400 uppercase font-bold">
                    Filtrage Expert VisiPilot
                  </span>
                </div>

                {/* Alerts Mini List */}
                <div className="space-y-3.5">
                  {alerts.slice(0, 4).map(alert => (
                    <div 
                      key={alert.id}
                      onClick={() => {
                        setExpandedAlertId(alert.id);
                        setActiveTab('veille');
                      }}
                      className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 hover:border-orange-500/40 rounded-xl transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getSeverityBadge(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className="text-[10px] font-mono-code text-slate-500 font-semibold">
                          {alert.source.split('·')[0]}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#EA580C] transition-colors line-clamp-2">
                        {alert.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {alert.impact}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer of Card */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>⋯ et 6 domaines réglementaires sous surveillance</span>
                  <button 
                    onClick={() => setActiveTab('sources')}
                    className="text-[#EA580C] font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    Toutes les sources
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* How It Works - Process in 3 Steps (SustainWatch exact model) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-[2px] w-6 bg-[#EA580C]"></div>
              <span className="text-xs font-mono-code uppercase tracking-widest text-[#EA580C] font-bold">
                MÉTHODOLOGIE AUDITÉ GFSI
              </span>
              <div className="h-[2px] w-6 bg-[#EA580C]"></div>
            </div>
            <h2 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
              Comment ça marche
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              De la détection internationale à vos ateliers de production, un processus rigoureux en 3 étapes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Step 1 */}
            <div className="bg-white border border-slate-200 p-8 rounded-2xl relative group hover:border-[#EA580C]/50 transition-all shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center font-heading font-extrabold text-[#EA580C] text-xl mb-6 shadow-sm">
                1
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-3">
                Détection multi-sources continue
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Nos robots de crawl et collecteurs connectés parcourent 24/7 les publications officielles : Journal Officiel de l'UE (EUR-Lex), RASFF, RappelConso, US FDA Federal Register, DGAL, EFSA, UK FSA, BfR et Codex Alimentarius.
              </p>
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-mono-code text-slate-400 font-semibold">
                  JOUE (Série L), JORF, RASFF, FDA, EFSA & DGAL scrutés en continu
                </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200 p-8 rounded-2xl relative group hover:border-[#EA580C]/50 transition-all shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center font-heading font-extrabold text-[#EA580C] text-xl mb-6 shadow-sm">
                2
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-3">
                Validation par des auditeurs QHSE
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Chaque texte, alerte ou projet de révision est analysé et qualifié par un expert sécurité des aliments VisiPilot. Nous éliminons le bruit pour ne transmettre que les évolutions qui impactent vos recettes, usines et fournisseurs.
              </p>
                <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-mono-code text-slate-400 font-semibold">
                  Filtrage expert humain · Analyse d'impact technique
                </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-200 p-8 rounded-2xl relative group hover:border-[#EA580C]/50 transition-all shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center font-heading font-extrabold text-[#EA580C] text-xl mb-6 shadow-sm">
                3
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 mb-3">
                Alerte personnalisée & Plan d'action
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Vous recevez une synthèse opérationnelle avec les échéances d'application, les seuils microbiologiques ou chimiques modifiés, et les recommandations d'audit pour rester « Audit Ready » pour vos certifications IFS Food et BRCGS.
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-mono-code text-slate-400 font-semibold">
                Connecté aux modules VisiPLM & VISITrack
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* VisiPilot Software Suite Synergy Section */}
      <section className="py-16 border-b border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono-code text-[#EA580C] uppercase tracking-widest font-bold">
                L'ÉCOSYSTÈME VISIPILOT
              </span>
              <h3 className="text-2xl font-heading font-bold text-slate-900 mt-1">
                De la veille réglementaire à la résolution sur le terrain
              </h3>
            </div>
            <div className="text-xs text-slate-600 max-w-md font-medium">
              FoodSafetyWatch s'intègre nativement à vos logiciels VisiPilot pour convertir instantanément les exigences réglementaires en actions de contrôle.
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { name: 'VisiPLM', desc: 'Recettes & spécifications matières', icon: BookOpen },
              { name: 'VISITrack', desc: 'Hub conformité fournisseurs', icon: Globe2 },
              { name: 'VISIcat', desc: 'Gestion non-conformités GFSI', icon: ShieldCheck },
              { name: 'VisiTact', desc: 'Zéro-papier & IoT température/pH', icon: Cpu },
              { name: 'VisiPact', desc: 'Audits fournisseurs automatisés', icon: FileCheck },
              { name: 'VisiVal', desc: 'Culture sécurité des aliments', icon: Sparkles }
            ].map(tool => (
              <div key={tool.name} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl hover:border-slate-300 hover:bg-slate-100/60 shadow-2xs hover:shadow-xs transition-all">
                <tool.icon className="w-5 h-5 text-[#EA580C] mb-2" />
                <div className="font-heading font-bold text-xs text-slate-900">{tool.name}</div>
                <div className="text-[10px] text-slate-500 mt-1 leading-snug font-medium">{tool.desc}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Pre-footer CTA Banner */}
      <section className="py-16 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-amber-500/10 border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
            Prêt à sécuriser vos audits réglementaires et export ?
          </h3>
          <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed font-medium">
            Testez FoodSafetyWatch sans engagement pendant 90 jours. Configurez vos filières d'importation, vos marchés d'export et vos certifications.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button 
              onClick={() => setActiveTab('tarifs')}
              className="px-6 py-3 bg-[#EA580C] hover:bg-[#c2410c] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
            >
              Activer 3 mois d'essai gratuit
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-heading font-semibold text-xs rounded-xl border border-slate-200 transition-all shadow-2xs"
            >
              Échanger avec un auditeur VisiPilot
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
