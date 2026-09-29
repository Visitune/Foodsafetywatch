import { ExternalLink, Globe2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { AppCtx } from './ctx.js';

export function SourceDetailModal({ ctx }: { ctx: AppCtx }) {
  const { activeSourcesInPerimeter, selectedSourceDetail, setSelectedSourceDetail, toggleSourceInPerimeter } = ctx;
  return (
    <AnimatePresence>
      {selectedSourceDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white border border-slate-200/80 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6 text-slate-800"
          >
            <button 
              onClick={() => setSelectedSourceDetail(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              title="Fermer la fiche"
            >
              <X className="w-5 h-5" />
            </button>

            {/* En-tête de la fiche */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{selectedSourceDetail.flag}</span>
                <span className="text-xs font-mono-code uppercase px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                  {selectedSourceDetail.paysLabel}
                </span>
                <span className="text-xs font-mono-code text-[#EA580C] bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 font-bold">
                  {selectedSourceDetail.type}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 leading-tight">
                {selectedSourceDetail.name}
              </h3>
              <div className="text-sm font-medium text-slate-500 mt-1">
                Émis par : <strong className="text-slate-800 font-bold">{selectedSourceDetail.organization}</strong>
              </div>
            </div>

            {/* État de présence & Disponibilité dans l'outil */}
            {selectedSourceDetail.isAvailableInApp ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse mt-1 shrink-0"></span>
                  <div>
                    <div className="text-sm font-heading font-bold text-emerald-800">
                      SOURCE DISPONIBLE EN DIRECT DANS L'OUTIL
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5 font-medium leading-relaxed">
                      Cette source est intégrée à la passerelle VisiPilot (API officielle directe, architecture cible). Les nouvelles publications alimentent vos tableaux de bord.
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono-code font-bold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 shrink-0">
                  Flux Connecté
                </span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="w-3 h-3 rounded-full bg-amber-500 mt-1 shrink-0"></span>
                  <div>
                    <div className="text-sm font-heading font-bold text-amber-800">
                      SOURCE EN COURS D'INTÉGRATION ({selectedSourceDetail.coverageLevel.toUpperCase()})
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5 font-medium leading-relaxed">
                      Cette source fait partie du catalogue de référence VisiPilot. Le raccordement de son flux automatisé est planifié ou livrable sur demande pour vos filières d'exportation.
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono-code font-bold bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg border border-amber-200 shrink-0">
                  En intégration
                </span>
              </div>
            )}

            {/* Cartographie de Provenance : D'où viennent ces données ? */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="text-xs font-mono-code uppercase text-[#EA580C] font-bold flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#EA580C]" />
                Origine & Mécanisme de collecte des données
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {selectedSourceDetail.provenance}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-mono-code uppercase text-slate-500 block font-bold">Fréquence</span>
                  <strong className="text-slate-800 font-bold">{selectedSourceDetail.frequency}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono-code uppercase text-slate-500 block font-bold">Dernier contrôle</span>
                  <strong className="text-emerald-700 font-bold">{selectedSourceDetail.lastSync}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono-code uppercase text-slate-500 block font-bold">Valeur légale</span>
                  <strong className="text-slate-800 font-bold">{selectedSourceDetail.legalWeight}</strong>
                </div>
              </div>
            </div>

            {/* Textes et règlements surveillés */}
            <div>
              <div className="text-xs font-mono-code uppercase text-slate-500 font-bold mb-2">
                Textes de loi & référentiels surveillés pour cette source :
              </div>
              <div className="space-y-1.5">
                {selectedSourceDetail.regulationsCovered.map((reg, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold">
                    <span className="text-[#EA580C] font-bold">§</span>
                    <span>{reg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description & Intégration VisiPilot */}
            <div>
              <div className="text-xs font-mono-code uppercase text-slate-500 font-bold mb-2">
                Périmètre & Portée opérationnelle :
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-medium">
                {selectedSourceDetail.description}
              </p>
            </div>

            {/* Actions & Liens officiels */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <a 
                href={selectedSourceDetail.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-200 transition-colors shadow-2xs"
              >
                <ExternalLink className="w-4 h-4 text-slate-500" />
                <span>Consulter le site officiel de l'organisme</span>
              </a>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    toggleSourceInPerimeter(selectedSourceDetail.id);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                    activeSourcesInPerimeter.includes(selectedSourceDetail.id)
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                      : 'bg-[#EA580C] hover:bg-[#c2410c] text-white shadow-sm'
                  }`}
                >
                  {activeSourcesInPerimeter.includes(selectedSourceDetail.id)
                    ? '✓ Actif dans mon périmètre'
                    : '+ Ajouter à mon périmètre'}
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
