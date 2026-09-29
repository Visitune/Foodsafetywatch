import { ExternalLink, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { AppCtx } from './ctx.js';

export function TextDetailModal({ ctx }: { ctx: AppCtx }) {
  const { selectedTextDetail, setSelectedTextDetail, showToast } = ctx;
  return (
    <AnimatePresence>
      {selectedTextDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6 text-slate-800"
          >
            <button 
              onClick={() => setSelectedTextDetail(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* En-tête */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-2xl">{selectedTextDetail.jurisdiction === 'UE' ? '🇪🇺' : '🇫🇷'}</span>
                <span className="text-xs font-mono-code font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {selectedTextDetail.jurisdictionLabel}
                </span>
                <span className={`text-xs font-mono-code font-extrabold px-2.5 py-1 rounded border ${selectedTextDetail.statusBadgeColor}`}>
                  {selectedTextDetail.status}
                </span>
                <span className="text-xs font-mono-code text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded font-bold">
                  {selectedTextDetail.celexOrNor}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 leading-tight">
                {selectedTextDetail.title}
              </h3>
              <div className="text-xs text-slate-500 mt-1 font-mono-code font-semibold">
                Réf : {selectedTextDetail.legalReference}
              </div>
            </div>

            {/* Calendrier légal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
              <div>
                <span className="text-[10px] font-mono-code uppercase text-slate-500 block font-bold">Date de publication</span>
                <strong className="text-slate-800 text-sm font-mono-code font-bold">{selectedTextDetail.datePublication}</strong>
              </div>
              <div>
                <span className="text-[10px] font-mono-code uppercase text-slate-500 block font-bold">Entrée en vigueur</span>
                <strong className="text-slate-800 text-sm font-mono-code font-bold">{selectedTextDetail.dateEntreeVigueur}</strong>
              </div>
              <div>
                <span className="text-[10px] font-mono-code uppercase text-slate-500 block font-bold">Application obligatoire</span>
                <strong className="text-[#EA580C] text-sm font-mono-code font-bold">{selectedTextDetail.dateApplication}</strong>
              </div>
            </div>

            {/* Comparatif réglementaire Avant / Après */}
            <div className="space-y-3">
              <div className="text-xs font-mono-code uppercase text-slate-500 font-bold">
                Analyse d'Impact Réglementaire (Niveau 2 Intelligence) :
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 border border-red-200/80 rounded-2xl space-y-1.5">
                  <div className="text-xs font-mono-code uppercase text-red-800 font-bold">
                    Exigences Antérieures
                  </div>
                  <div className="text-xs text-red-950 leading-relaxed font-semibold">
                    {selectedTextDetail.previousRequirements}
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl space-y-1.5">
                  <div className="text-xs font-mono-code uppercase text-emerald-800 font-bold">
                    Nouvelles Exigences Contraignantes
                  </div>
                  <div className="text-xs text-emerald-950 leading-relaxed font-bold">
                    {selectedTextDetail.newRequirements}
                  </div>
                </div>
              </div>
            </div>

            {/* Articles touchés */}
            <div>
              <div className="text-xs font-mono-code uppercase text-slate-500 font-bold mb-2">
                Articles et annexes touchés par cet acte :
              </div>
              <div className="space-y-1.5">
                {selectedTextDetail.modifiedArticles.map((art, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold font-mono-code">
                    <span className="text-[#EA580C] font-bold">§</span>
                    <span>{art}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan d'action VisiPilot */}
            <div className="p-5 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 border border-orange-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono-code uppercase font-bold text-[#EA580C] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Plan d'action d'audit recommandé VisiPilot
                </div>
                <span className="text-xs font-heading font-extrabold text-slate-800 px-2 py-0.5 rounded bg-orange-100 border border-orange-200">
                  Module : {selectedTextDetail.visipilotSoftwareModule}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                {selectedTextDetail.visipilotActionPlan}
              </p>
            </div>

            {/* Actions & Liens */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {selectedTextDetail.consolidatedUrl && (
                  <a 
                    href={selectedTextDetail.consolidatedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-200 shadow-2xs"
                  >
                    <span>Consulter la version consolidée</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                )}
                <a 
                  href={selectedTextDetail.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-200"
                >
                  <span>Lien officiel {selectedTextDetail.jurisdiction === 'UE' ? 'EUR-Lex' : 'Légifrance'}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>

              <button
                onClick={() => {
                  setSelectedTextDetail(null);
                  showToast(`Texte ${selectedTextDetail.celexOrNor} ajouté au dossier d'audit.`);
                }}
                className="px-5 py-2.5 bg-[#EA580C] hover:bg-[#c2410c] text-white font-bold font-heading uppercase tracking-wider text-xs rounded-xl shadow-xs transition-all"
              >
                Ajouter au classeur d'audit IFS / BRCGS
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
