import { Database, ExternalLink, Globe2, RefreshCw, Search, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { AppCtx } from './ctx.js';

export function SourcesTab({ ctx }: { ctx: AppCtx }) {
  const { activeSourcesInPerimeter, aiAnswer, aiLoading, aiQuestion, filteredSources, handleAskAI, setAiAnswer, setAiQuestion, setSelectedSourceDetail, setSourceAvailabilityFilter, setSourcePaysFilter, setSourceSearch, setSourceTypeFilter, simplifiedView, sourceAvailabilityFilter, sourcePaysFilter, sourceSearch, sourceStats, sourceTypeFilter, sources, toggleSourceInPerimeter } = ctx;
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-800 bg-slate-50">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-[2px] w-6 bg-[#EA580C]"></div>
            <span className="text-xs font-mono-code uppercase tracking-widest text-[#EA580C] font-bold">
              NIVEAU 1 — CATALOGUE DES SOURCES RÉGLEMENTAIRES
            </span>
          </div>
          <h2 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
            Sources Officielles & Provenance
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl font-medium">
            Explorez l'ensemble des journaux officiels, dépôts de données, agences d'évaluation du risque, bases de rappels et standards de certification audités par VisiPilot.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono-code text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-2xs font-semibold">
            <strong className="text-slate-900">{filteredSources.length}</strong> sources affichées / {sources.length} répertoriées
          </span>
        </div>
      </div>

      {/* ─── BANDEAU DE TRANSPARENCE : ÉTAT DE DISPONIBILITÉ & PROVENANCE DES SOURCES ─── */}
      {!simplifiedView && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Card 1 : Sources Directement Disponibles dans l'Outil */}
          <div 
            onClick={() => setSourceAvailabilityFilter(sourceAvailabilityFilter === 'AVAILABLE' ? 'ALL' : 'AVAILABLE')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group shadow-2xs ${
              sourceAvailabilityFilter === 'AVAILABLE'
                ? 'bg-emerald-50/80 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                : 'bg-white border-slate-200 hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono-code uppercase font-extrabold text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                DISPONIBLES DANS L'OUTIL
              </div>
              <span className="text-2xl font-heading font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                {sourceStats.available}
              </span>
            </div>
            <div className="text-xs font-bold text-emerald-800 mt-2">
              Flux API & Journaux Officiels connectés
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">
              Ces sources sont intégrées au périmètre de veille VisiPilot : leurs textes, alertes et avis scientifiques alimentent vos tableaux de bord.
            </p>
            <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700">
              <span>{sourceAvailabilityFilter === 'AVAILABLE' ? '✓ Filtre actif' : 'Filtrer ces sources'}</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 2 : Sources Non Disponibles / En cours d'intégration */}
          <div 
            onClick={() => setSourceAvailabilityFilter(sourceAvailabilityFilter === 'UPCOMING' ? 'ALL' : 'UPCOMING')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group shadow-2xs ${
              sourceAvailabilityFilter === 'UPCOMING'
                ? 'bg-amber-50/80 border-amber-500 shadow-md ring-1 ring-amber-500'
                : 'bg-white border-slate-200 hover:border-amber-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono-code uppercase font-extrabold text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                NON DISPONIBLES EN DIRECT / EN COURS
              </div>
              <span className="text-2xl font-heading font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                {sourceStats.upcoming}
              </span>
            </div>
            <div className="text-xs font-bold text-amber-800 mt-2">
              Raccordements API & Accords bilatéraux Q4
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">
              Sources internationales cataloguées et documentées mais dont le flux continu nécessite une passerelle export spécifique.
            </p>
            <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-amber-700">
              <span>{sourceAvailabilityFilter === 'UPCOMING' ? '✓ Filtre actif' : 'Filtrer ces sources'}</span>
              <span>→</span>
            </div>
          </div>

          {/* Card 3 : Total & Traçabilité Complète */}
          <div 
            onClick={() => setSourceAvailabilityFilter('ALL')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group shadow-2xs ${
              sourceAvailabilityFilter === 'ALL'
                ? 'bg-blue-50/80 border-blue-500 shadow-md ring-1 ring-blue-500'
                : 'bg-white border-slate-200 hover:border-blue-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono-code uppercase font-extrabold text-blue-700">
                <Database className="w-4 h-4 text-blue-600" />
                TOTAL CATALOGUE AUDITÉ
              </div>
              <span className="text-2xl font-heading font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                {sourceStats.total}
              </span>
            </div>
            <div className="text-xs font-bold text-blue-800 mt-2">
              Transparence & Provenance certifiée VisiPilot
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">
              Chaque fiche explicite l'origine juridique, le protocole technique de collecte et le lien direct vers le portail officiel.
            </p>
            <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-700">
              <span>{sourceAvailabilityFilter === 'ALL' ? '✓ Affichage complet' : 'Voir tout le catalogue'}</span>
              <span>→</span>
            </div>
          </div>

        </div>
      )}

      {/* AI Regulatory Consultation Box */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#EA580C_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#EA580C] uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          Assistant Réglementaire IA VisiPilot
        </div>
        <h3 className="text-lg font-heading font-extrabold text-slate-900 mb-2">
          Interroger la jurisprudence & les exigences réglementaires
        </h3>
        <p className="text-xs text-slate-500 mb-4 max-w-2xl font-medium">
          Posez une question technique sur les seuils de contaminants, les règles d'exportation (ex: FDA FSMA 204), les critères microbiologiques ou les restrictions PFAS.
        </p>

        <form onSubmit={handleAskAI} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Ex: Quelles sont les exigences pour exporter du fromage aux USA sous FSMA 204 ?"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#EA580C] transition-colors"
            />
          </div>
          <button 
            type="submit"
            disabled={aiLoading}
            className="px-6 py-3 bg-[#EA580C] hover:bg-[#c2410c] disabled:opacity-50 text-white text-xs font-bold font-heading uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
          >
            {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Analyser</span>
          </button>
        </form>

        {/* AI Response Display */}
        {aiAnswer && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed whitespace-pre-line shadow-2xs"
          >
            <div className="flex items-center justify-between font-bold text-[#EA580C] mb-2 pb-2 border-b border-slate-200">
              <span className="flex items-center gap-1.5 font-heading">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Synthèse Réglementaire VisiPilot
              </span>
              <button 
                onClick={() => setAiAnswer(null)}
                className="text-slate-400 hover:text-slate-800 font-semibold"
              >
                Fermer
              </button>
            </div>
            {aiAnswer}
          </motion.div>
        )}
      </div>

      {/* Search Bar & Multi-Criteria Filters */}
      <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl space-y-4 shadow-2xs">

        {/* Main Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Rechercher par mot-clé, nom d'organisme (EFSA, FDA, DGAL), règlement (178/2002, 2023/915) ou danger (Listeria, PFAS)..."
            value={sourceSearch}
            onChange={(e) => setSourceSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#EA580C] transition-colors"
          />
          {sourceSearch && (
            <button 
              onClick={() => setSourceSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Availability Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 text-xs">
          <span className="text-slate-500 text-xs font-mono-code uppercase mr-1 shrink-0 font-bold">Disponibilité :</span>
          {[
            { id: 'ALL', label: `Toutes les sources (${sourceStats.total})` },
            { id: 'AVAILABLE', label: `🟢 Disponibles dans l'outil (${sourceStats.available})` },
            { id: 'UPCOMING', label: `⏳ En cours / Non disponibles (${sourceStats.upcoming})` },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSourceAvailabilityFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-semibold text-xs ${
                sourceAvailabilityFilter === f.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Jurisdiction Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 text-xs pt-2.5 border-t border-slate-100">
          <span className="text-slate-500 text-xs font-mono-code uppercase mr-1 shrink-0 font-bold">Zone :</span>
          {[
            { id: 'ALL', label: 'Toutes les zones' },
            { id: 'UE', label: '🇪🇺 Union Européenne' },
            { id: 'FR', label: '🇫🇷 France' },
            { id: 'US', label: '🇺🇸 États-Unis' },
            { id: 'UK', label: '🇬🇧 Royaume-Uni' },
            { id: 'DE', label: '🇩🇪 Allemagne' },
            { id: 'CA', label: '🇨🇦 Canada' },
            { id: 'INT', label: '🌐 International / Codex' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setSourcePaysFilter(filter.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-semibold text-xs ${
                sourcePaysFilter === filter.id
                  ? 'bg-[#EA580C] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 border border-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Type Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs pt-2.5 border-t border-slate-100">
          <span className="text-slate-500 text-xs font-mono-code uppercase mr-1 shrink-0 font-bold">Type :</span>
          {[
            'ALL',
            'Journal Officiel',
            'Alerte & Rappel',
            'Avis Scientifique',
            'Standard & Norme',
            'Base Légale'
          ].map(type => (
            <button
              key={type}
              onClick={() => setSourceTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-semibold transition-all ${
                sourceTypeFilter === type
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-950 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {type === 'ALL' ? 'Tous les types' : type}
            </button>
          ))}
        </div>

      </div>

      {/* Sources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSources.map(source => {
          const isInPerimeter = activeSourcesInPerimeter.includes(source.id);
          return (
            <div 
              key={source.id}
              className={`bg-white border rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-slate-400 hover:shadow-md ${
                isInPerimeter ? 'border-blue-300 shadow-sm shadow-blue-50' : 'border-slate-200/80 shadow-2xs'
              }`}
            >
              <div>
                {/* Statut de présence / Disponibilité bien visible en tête de carte */}
                {source.isAvailableInApp ? (
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3 shadow-2xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      ✓ DISPONIBLE DANS L'OUTIL
                    </span>
                    <span className="text-[10px] font-mono-code bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                      Flux Actif
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-3 shadow-2xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      ⏳ EN COURS D'INTÉGRATION
                    </span>
                    <span className="text-[10px] font-mono-code bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                      Q4 2026
                    </span>
                  </div>
                )}

                {/* Top Row: Country Badge & Type */}
                <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{source.flag}</span>
                    <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-bold uppercase">
                      {source.paysLabel}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-code text-[#EA580C] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200/60 font-bold">
                    {source.type}
                  </span>
                </div>

                {/* Source Name & Organization */}
                <h3 className="font-heading font-bold text-base text-slate-900 leading-snug group-hover:text-[#EA580C] transition-colors mt-2">
                  {source.name}
                </h3>
                <div className="text-[11px] font-semibold text-slate-500 mt-1">
                  {source.organization}
                </div>

                {/* Legal Weight Tag */}
                <div className="mt-2">
                  <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded">
                    ⚖️ {source.legalWeight}
                  </span>
                </div>

                {/* Description */}
                <p className={`text-xs text-slate-600 mt-3 leading-relaxed font-medium ${simplifiedView ? 'line-clamp-1' : 'line-clamp-3'}`}>
                  {source.description}
                </p>

                {/* Bloc Explicatif Transparent : D'où viennent ces données ? (Masqué en mode épuré) */}
                {!simplifiedView && (
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="text-[10px] font-mono-code uppercase text-[#EA580C] font-extrabold flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-[#EA580C]" />
                      Provenance exacte des données :
                    </div>
                    <div className="text-xs text-slate-700 leading-snug font-semibold">
                      {source.provenance}
                    </div>
                    <div className="text-[10px] font-mono-code text-slate-500 flex items-center justify-between pt-1.5 border-t border-slate-200 font-bold">
                      <span>Fréquence : <strong className="text-slate-800">{source.frequency}</strong></span>
                      <span className="text-emerald-700">{source.lastSync}</span>
                    </div>
                  </div>
                )}

                {/* Key Regulations Tags (Masqué en mode épuré) */}
                {!simplifiedView && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[10px] font-mono-code text-slate-400 uppercase mb-1.5 font-bold">
                      Textes surveillés :
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {source.regulationsCovered.map((reg, idx) => (
                        <span 
                          key={idx}
                          className="text-[9px] font-mono-code bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-semibold"
                        >
                          {reg}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                <button
                  onClick={() => setSelectedSourceDetail(source)}
                  className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 py-1 hover:underline font-bold"
                >
                  <span>Fiche technique</span>
                  <span>→</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSourceInPerimeter(source.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      isInPerimeter
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isInPerimeter ? '✓ Dans mon périmètre' : '+ Activer'}
                  </button>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                    title="Ouvrir le portail officiel de l'organisme"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
