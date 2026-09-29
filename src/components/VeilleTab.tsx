import { ChevronDown, Clock, ExternalLink, LayoutGrid, List, RefreshCw, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { AlertItem } from '../types.js';
import type { AppCtx } from './ctx.js';

export function VeilleTab({ ctx }: { ctx: AppCtx }) {
  const { alertSecteurFilter, alertSearch, alertUrgencyFilter, alertViewMode, expandedAlertId, fetchAlerts, filteredAlerts, getSeverityBadge, loadingAlerts, setAlertSearch, setAlertSecteurFilter, setAlertUrgencyFilter, setAlertViewMode, setExpandedAlertId } = ctx;
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-slate-800 bg-slate-50">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-[2px] w-6 bg-[#EA580C]"></div>
            <span className="text-xs font-mono-code uppercase tracking-widest text-[#EA580C] font-bold">
              NIVEAU 3 — RISK INTELLIGENCE & ALERTES SANITAIRES
            </span>
          </div>
          <h2 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
            Alertes & Retraits Sanitaires en Direct
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Toutes les alertes sanitaires (RASFF, RappelConso, FDA) et avis scientifiques qualifiés par les auditeurs QHSE VisiPilot.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchAlerts(true)}
            disabled={loadingAlerts}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl flex items-center gap-2 text-slate-700 transition-all shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#EA580C] ${loadingAlerts ? 'animate-spin' : ''}`} />
            <span>Actualiser les flux</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Filtrer les alertes..."
              value={alertSearch}
              onChange={(e) => setAlertSearch(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#EA580C] w-full"
            />
          </div>

          <select 
            value={alertUrgencyFilter}
            onChange={(e) => setAlertUrgencyFilter(e.target.value as 'ALL' | AlertItem['severity'])}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#EA580C]"
          >
            <option value="ALL">Toutes urgences</option>
            <option value="critical">🔴 Critique</option>
            <option value="high">🟠 Haute</option>
            <option value="medium">🟡 Moyenne</option>
            <option value="low">Bas de priorité</option>
          </select>

          <select 
            value={alertSecteurFilter}
            onChange={(e) => setAlertSecteurFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#EA580C]"
          >
            <option value="ALL">Tous secteurs</option>
            <option value="Viandes & Traiteur">Viandes & Traiteur</option>
            <option value="Produits Laitiers">Produits Laitiers</option>
            <option value="Épicerie & Épices">Épicerie & Épices</option>
            <option value="Produits de la Mer">Produits de la Mer</option>
            <option value="Emballages & MOCA">Emballages & MOCA</option>
          </select>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setAlertViewMode('list')}
            className={`p-1.5 rounded ${alertViewMode === 'list' ? 'bg-[#EA580C] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setAlertViewMode('grid')}
            className={`p-1.5 rounded ${alertViewMode === 'grid' ? 'bg-[#EA580C] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Note de transparence : alertes de démonstration */}
      <div className="px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
        <span className="font-bold shrink-0">DÉMO</span>
        <span>Flux illustratif de démonstration. Dans le service opérationnel, ces alertes proviennent des sources officielles (RASFF, RappelConso, FDA, JOUE / JORF) qualifiées par nos auditeurs.</span>
      </div>

      {/* Alerts Feed */}
      {loadingAlerts ? (
        <div className="py-24 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-[#EA580C] animate-spin mx-auto" />
          <div className="text-xs font-mono-code text-slate-400 uppercase tracking-widest">
            Interrogation des serveurs RASFF, FDA et Journal Officiel...
          </div>
        </div>
      ) : (
        <div className={alertViewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'space-y-4'}>
          {filteredAlerts.map(alert => {
            const isExpanded = expandedAlertId === alert.id;
            return (
              <div 
                key={alert.id}
                className="bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] font-mono-code text-slate-500 uppercase flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(alert.date).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] font-mono-code text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                        {alert.secteur}
                      </span>
                      <span className="text-[10px] font-mono-code text-[#EA580C] bg-[#EA580C]/10 px-2 py-0.5 rounded">
                        {alert.hazard_category}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-white leading-snug">
                      {alert.title}
                    </h3>
                    <div className="text-xs text-slate-400 mt-1 font-mono-code">
                      Réf. légale : <strong className="text-slate-300">{alert.legal_ref}</strong>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono-code text-slate-500 block uppercase">Source</span>
                    <span className="text-xs font-semibold text-slate-300">{alert.source.split('·')[0]}</span>
                  </div>
                </div>

                <p className={`text-xs text-slate-300 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                  {alert.summary}
                </p>

                {/* Expanded Detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-slate-800 space-y-3"
                    >
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-200">
                        <strong className="block text-red-400 font-heading mb-1">Impact Industriel & Recettes :</strong>
                        {alert.impact}
                      </div>
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-200">
                        <strong className="block text-emerald-400 font-heading mb-1">Recommandation Expert VisiPilot :</strong>
                        {alert.recommendation}
                      </div>
                      {alert.visipilot_tool && (
                        <div className="text-[11px] font-mono-code text-slate-400">
                          Outil VisiPilot préconisé : <strong className="text-[#EA580C]">{alert.visipilot_tool}</strong>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                    className="text-[11px] font-bold text-slate-400 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    {isExpanded ? 'Réduire l\'analyse' : 'Voir l\'impact & recommandations'}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <a 
                    href={alert.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#EA580C] hover:underline flex items-center gap-1"
                  >
                    Source officielle
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
