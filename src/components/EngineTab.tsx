import { AlertTriangle, BookOpen, Code2, ExternalLink, Layers, Scale, Search } from 'lucide-react';
import { REGULATORY_DOMAINS } from '../data/regulatoryEngineData.js';
import type { TextStatus } from '../data/regulatoryEngineData.js';
import type { AppCtx } from './ctx.js';

export function EngineTab({ ctx }: { ctx: AppCtx }) {
  const { alerts, engineDomain, engineJurisdiction, engineLevel, engineSearch, engineStats, engineStatus, filteredRegulatoryTexts, regulatoryTexts, setActiveTab, setEngineDomain, setEngineJurisdiction, setEngineLevel, setEngineSearch, setEngineStatus, setShowArchitectureModal, setSelectedTextDetail, simplifiedView } = ctx;
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-8 text-slate-800 bg-slate-50">

      {/* Header & Baseline */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-[#EA580C] bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
              SOCLE OFFICIEL : 🇪🇺 EUR-LEX / CELLAR + 🇫🇷 LÉGIFRANCE / PISTE
            </span>
            <span className="text-xs font-mono-code text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Architecture cible · Zéro scraping · 100% API & dépôts officiels
            </span>
          </div>
          <h2 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
            Regulatory Intelligence Engine
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed font-medium">
            Moteur d'ingestion et d'analyse comparative du droit alimentaire européen et français. Surveillance automatisée via flux ATOM/RSS, point d'accès SPARQL triplestore Cellar (OPOCE) et API OAuth2 Légifrance/PISTE (DILA).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowArchitectureModal(true)}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-mono-code font-bold flex items-center gap-2 transition-all shadow-2xs"
          >
            <Code2 className="w-4 h-4 text-[#EA580C]" />
            <span>Architecture Technique (Cellar & PISTE)</span>
          </button>
          <span className="text-xs font-mono-code text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-2xs font-semibold">
            <strong className="text-slate-900">{filteredRegulatoryTexts.length}</strong> textes juridiques
          </span>
        </div>
      </div>

      {/* ─── SÉPARATION EN 3 NIVEAUX DE VEILLE (CONSTITUTION MÉTHODOLOGIQUE) ─── */}
      {!simplifiedView ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Niveau 1 : REGULATORY SOURCES (Uniquement les textes juridiques authentiques) */}
          <div 
            onClick={() => setEngineLevel(1)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative shadow-2xs ${
              engineLevel === 1 
                ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                : 'bg-white border-slate-200 hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-emerald-800">
                  Niveau 1 — Regulatory Sources
                </span>
              </div>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                Textes Authentiques
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-base text-slate-950 mt-2">
              Textes Juridiques Officiels
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              Uniquement les actes juridiques promulgués (EUR-Lex / Cellar, Légifrance, JOUE, JORF). Règlements, directives, décrets, arrêtés.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700">
              <span>{engineLevel === 1 ? '● Vue active' : 'Afficher les textes'}</span>
              <span>→</span>
            </div>
          </div>

          {/* Niveau 2 : REGULATORY INTELLIGENCE (Compréhension des changements) */}
          <div 
            onClick={() => setEngineLevel(2)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative shadow-2xs ${
              engineLevel === 2 
                ? 'bg-amber-50/70 border-amber-500 shadow-md ring-1 ring-amber-500'
                : 'bg-white border-slate-200 hover:border-amber-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-amber-800">
                  Niveau 2 — Regulatory Intelligence
                </span>
              </div>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                Impacts & Comparatif
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-base text-slate-950 mt-2">
              Analyse & Comparateur Avant/Après
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              Compréhension des changements : articles modifiés, comparaison ancienne vs nouvelle exigence, échéancier d'application et modules VisiPilot.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-amber-700">
              <span>{engineLevel === 2 ? '● Vue active' : 'Afficher l\'analyse d\'impact'}</span>
              <span>→</span>
            </div>
          </div>

          {/* Niveau 3 : FOOD SAFETY / RISK INTELLIGENCE (Anticipation sanitaire) */}
          <div 
            onClick={() => setEngineLevel(3)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative shadow-2xs ${
              engineLevel === 3 
                ? 'bg-blue-50/70 border-blue-500 shadow-md ring-1 ring-blue-500'
                : 'bg-white border-slate-200 hover:border-blue-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-blue-800">
                  Niveau 3 — Risk Intelligence
                </span>
              </div>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                Anticipation Risques
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-base text-slate-950 mt-2">
              Signaux Sanitaires & Horizon Scanning
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              Ce qui permet d'anticiper : alertes rapides RASFF, rappels consommateurs RappelConso, avis scientifiques EFSA/ANSES et tendances émergentes.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-700">
              <span>{engineLevel === 3 ? '● Vue active' : 'Explorer les signaux sanitaires'}</span>
              <span>→</span>
            </div>
          </div>

        </div>
      ) : (
        /* Vue Simplifiée des Niveaux de Veille */
        <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <span className="text-xs text-slate-500 font-mono-code uppercase font-bold pl-2">Niveau méthodologique :</span>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setEngineLevel(1)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                engineLevel === 1 ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Niveau 1 — Textes Officiels
            </button>
            <button
              onClick={() => setEngineLevel(2)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                engineLevel === 2 ? 'bg-amber-500 text-white shadow-2xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Niveau 2 — Impacts & Écart
            </button>
            <button
              onClick={() => setEngineLevel(3)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                engineLevel === 3 ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Niveau 3 — Risques & RASFF
            </button>
          </div>
        </div>
      )}

      {/* ─── VUE NIVEAU 1 & NIVEAU 2 : MOTEUR DE RECHERCHE DES TEXTES JURIDIQUES ─── */}
      {(engineLevel === 1 || engineLevel === 2) && (
        <div className="space-y-6">

          {/* Filtres Multi-Critères Exclusifs */}
          <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl space-y-5 shadow-2xs">

            {/* 1. Territoire Juridique (Les 2 socles fondamentaux) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#EA580C]" />
                <span className="text-xs font-mono-code font-bold text-slate-700 uppercase tracking-wider">
                  Territoire Juridique :
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto text-xs">
                {[
                  { id: 'ALL', label: `Tous les territoires (${engineStats.total})` },
                  { id: 'UE', label: `🇪🇺 Union Européenne · EUR-Lex (${engineStats.ueCount})` },
                  { id: 'FR', label: `🇫🇷 France · Légifrance (${engineStats.frCount})` }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setEngineJurisdiction(t.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all font-semibold text-xs border ${
                      engineJurisdiction === t.id
                        ? 'bg-[#EA580C] text-white border-orange-500 shadow-md shadow-orange-500/10'
                        : 'bg-slate-50 text-slate-600 hover:text-slate-900 border-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Statut Juridique Clé (NOUVEAU / MODIFIÉ / CONSOLIDÉ / EN VIGUEUR) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-mono-code font-bold text-slate-700 uppercase tracking-wider">
                  Statut du texte :
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto text-xs">
                {[
                  { id: 'ALL', label: 'Tous les statuts' },
                  { id: 'NOUVEAU', label: `🟢 NOUVEAU (${engineStats.nouveauCount})`, color: 'text-emerald-700' },
                  { id: 'MODIFIÉ', label: `🟠 MODIFIÉ (${engineStats.modifieCount})`, color: 'text-amber-700' },
                  { id: 'CONSOLIDÉ', label: `🔵 CONSOLIDÉ (${engineStats.consolideCount})`, color: 'text-blue-700' },
                   { id: 'EN VIGUEUR', label: '✓ EN VIGUEUR', color: 'text-slate-700' }
                 ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setEngineStatus(s.id as 'ALL' | TextStatus)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-mono-code text-xs font-semibold border ${
                      engineStatus === s.id
                        ? 'bg-slate-800 text-white border-slate-700 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 hover:text-slate-950 border-slate-200/80'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Les 6 Grands Domaines Réglementaires */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono-code font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Filtrer par domaine réglementaire (6 domaines clés) :
                </span>
                {engineDomain !== 'ALL' && (
                  <button 
                    onClick={() => setEngineDomain('ALL')}
                    className="text-[11px] text-[#EA580C] hover:underline font-bold"
                  >
                    Réinitialiser le domaine
                  </button>
                )}
              </div>

              {!simplifiedView ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {REGULATORY_DOMAINS.map(dom => {
                    const isSelected = engineDomain === dom.id;
                    const textCount = regulatoryTexts.filter(t => t.domainId === dom.id).length;
                    return (
                      <button
                        key={dom.id}
                        onClick={() => setEngineDomain(isSelected ? 'ALL' : dom.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between shadow-2xs ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500'
                            : 'bg-slate-50 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100/60'
                        }`}
                      >
                        <div>
                          <div className="text-xl mb-1.5">{dom.icon}</div>
                          <div className="text-xs font-heading font-bold text-slate-900 leading-tight">
                            {dom.name}
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] font-mono-code text-slate-500 flex items-center justify-between font-bold">
                          <span>{textCount} texte{textCount > 1 ? 's' : ''}</span>
                          <span className={isSelected ? 'text-blue-600 font-bold' : ''}>
                            {isSelected ? '✓' : ''}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Version épurée des boutons de domaines */
                <div className="flex flex-wrap gap-1.5">
                  {REGULATORY_DOMAINS.map(dom => {
                    const isSelected = engineDomain === dom.id;
                    return (
                      <button
                        key={dom.id}
                        onClick={() => setEngineDomain(isSelected ? 'ALL' : dom.id)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          isSelected 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <span>{dom.icon} {dom.name.split('&')[0].split('(')[0].trim()}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Barre de Recherche Textuelle & Références */}
            <div className="relative pt-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Rechercher par CELEX (ex: 32025R0040), NOR (ex: ECOC2331589D), article, mot-clé (Listeria, PFAS, PPWR, contaminants, traçabilité)..."
                value={engineSearch}
                onChange={(e) => setEngineSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#EA580C] transition-colors"
              />
              {engineSearch && (
                <button 
                  onClick={() => setEngineSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

          </div>

          {/* Note de transparence : données de démonstration */}
          <div className="px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
            <span className="font-bold shrink-0">DÉMO</span>
            <span>Extraits réglementaires de démonstration (exemples illustratifs). Le texte authentique fait foi via les liens officiels EUR-Lex / Légifrance joints à chaque fiche.</span>
          </div>

          {/* Liste des Textes Juridiques Officiels */}
          <div className="space-y-4">
            {filteredRegulatoryTexts.length === 0 ? (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3 shadow-2xs">
                <Scale className="w-12 h-12 text-slate-400 mx-auto" />
                <div className="text-base font-heading font-bold text-slate-900">
                  Aucun texte juridique ne correspond aux filtres sélectionnés
                </div>
                <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                  Essayez d'élargir votre recherche en réinitialisant le statut, le domaine ou la recherche par mot-clé.
                </p>
                <button
                  onClick={() => {
                    setEngineJurisdiction('ALL');
                    setEngineDomain('ALL');
                    setEngineStatus('ALL');
                    setEngineSearch('');
                  }}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 transition-colors shadow-2xs"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            ) : (
              filteredRegulatoryTexts.map(text => {
                const isNew = text.status === 'NOUVEAU';
                const isMod = text.status === 'MODIFIÉ';
                const isCons = text.status === 'CONSOLIDÉ';
                return (
                  <div 
                    key={text.id}
                    className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-5 sm:p-6 transition-all space-y-4 shadow-2xs"
                  >
                    {/* Ligne 1 : Badges d'authentification et statut juridique */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Juridiction Flag & Badge */}
                        <span className="text-lg">{text.jurisdiction === 'UE' ? '🇪🇺' : '🇫🇷'}</span>
                        <span className="text-xs font-mono-code font-bold text-slate-600">
                          {text.jurisdictionLabel}
                        </span>
                        <span className="text-slate-300">•</span>

                        {/* Statut Juridique Pro : NOUVEAU / MODIFIÉ / CONSOLIDÉ */}
                        <span className={`text-[11px] font-mono-code font-extrabold px-2.5 py-0.5 rounded-md border ${text.statusBadgeColor}`}>
                          {text.status}
                        </span>

                        {/* Source Officielle Certifiée */}
                        <span className="text-[10px] font-mono-code bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-semibold">
                          {text.officialSourceBadge}
                        </span>
                      </div>

                      {/* CELEX ou NOR unique */}
                      <div className="flex items-center gap-2 text-xs font-mono-code">
                        <span className="text-slate-400 font-medium">Réf. officielle :</span>
                        <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-amber-800 font-bold">
                          {text.celexOrNor}
                        </span>
                      </div>

                    </div>

                    {/* Ligne 2 : Titre & Référence Légale */}
                    <div>
                      <div className="text-xs font-mono-code uppercase text-[#EA580C] font-extrabold mb-1">
                        {text.domainName} · {text.subDomain}
                      </div>
                      <h3 className="text-base sm:text-lg font-heading font-extrabold text-slate-900 leading-snug hover:text-[#EA580C] transition-colors">
                        {text.title}
                      </h3>
                      <div className="text-xs text-slate-500 mt-1 font-mono-code font-medium">
                        {text.legalReference}
                      </div>
                    </div>

                    {/* Ligne 3 : Les 3 Dates Légales Essentielles (Unboxed & Clean if simplified) */}
                    {!simplifiedView ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs">
                        <div>
                          <span className="text-[10px] font-mono-code uppercase text-slate-500 block font-bold">
                            📅 Date de publication
                          </span>
                          <strong className="text-slate-800 font-mono-code">{text.datePublication}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono-code uppercase text-slate-500 block font-bold">
                            ⚖️ Entrée en vigueur
                          </span>
                          <strong className="text-slate-800 font-mono-code">{text.dateEntreeVigueur}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono-code uppercase text-slate-500 block font-bold">
                            ⏱️ Application obligatoire
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <strong className={text.isApplied ? 'text-emerald-700 font-mono-code' : 'text-[#EA580C] font-mono-code'}>
                              {text.dateApplication}
                            </strong>
                            <span className={`text-[9px] font-mono-code px-1.5 py-0.2 rounded font-bold ${
                              text.isApplied 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-orange-50 text-orange-700 border border-orange-200'
                            }`}>
                              {text.isApplied ? 'En vigueur' : 'À anticiper'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Metadata ligne en affichage épuré */
                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-slate-500 border-t border-slate-100 pt-2.5 font-semibold">
                        <span>📅 Publié : <strong className="text-slate-700">{text.datePublication}</strong></span>
                        <span>⚖️ Vigueur : <strong className="text-slate-700">{text.dateEntreeVigueur}</strong></span>
                        <span>⏱️ Application : <strong className="text-[#EA580C]">{text.dateApplication}</strong></span>
                      </div>
                    )}

                    {/* Ligne 4 : Articles Modifiés & Synthèse de l'Impact */}
                    <div className="space-y-2">
                      <div className={`text-xs text-slate-600 leading-relaxed font-medium ${simplifiedView ? 'line-clamp-1' : ''}`}>
                        <strong className="text-slate-900 font-bold">Synthèse réglementaire : </strong>
                        {text.articlesImpactSummary}
                      </div>

                      {/* Tags des articles touchés (masqués si simplifié) */}
                      {!simplifiedView && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-mono-code uppercase text-slate-400 mr-1 font-bold">
                            Articles touchés :
                          </span>
                          {text.modifiedArticles.map((art, idx) => (
                            <span 
                              key={idx}
                              className="text-[10px] font-mono-code bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold"
                            >
                              {art}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Ligne 5 (Regulatory Intelligence) : Comparatif Avant / Après (masqué si épuré) */}
                    {engineLevel === 2 && !simplifiedView && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                        <div className="p-3 bg-red-50/50 border border-red-200 rounded-xl space-y-1">
                          <div className="text-[10px] font-mono-code uppercase text-red-700 font-bold">
                            Exigences Antérieures
                          </div>
                          <div className="text-xs text-slate-600 leading-relaxed font-medium">
                            {text.previousRequirements}
                          </div>
                        </div>
                        <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1">
                          <div className="text-[10px] font-mono-code uppercase text-emerald-700 font-bold">
                            Nouvelles Exigences Contraignantes
                          </div>
                          <div className="text-xs text-slate-800 leading-relaxed font-bold">
                            {text.newRequirements}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ligne 6 : Produits Concernés & Action Opérationnelle VisiPilot (masqué si épuré) */}
                    {!simplifiedView && (
                      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-mono-code uppercase text-slate-400 mr-1 font-bold">
                            Produits ciblés :
                          </span>
                          {text.affectedProducts.map((p, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-semibold">
                              {p}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono-code text-slate-500 font-bold">Module VisiPilot :</span>
                          <span className="text-[10px] font-heading font-extrabold text-[#EA580C] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
                            {text.visipilotSoftwareModule}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Ligne 7 : Actions & Liens Officiels EUR-Lex / Légifrance */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedTextDetail(text)}
                        className="text-xs font-bold text-[#EA580C] hover:text-[#c2410c] flex items-center gap-1 hover:underline"
                      >
                        <span>Fiche d'audit détaillée & plan d'action</span>
                        <span>→</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {text.consolidatedUrl && (
                          <a 
                            href={text.consolidatedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-mono-code flex items-center gap-1.5 transition-colors font-semibold"
                          >
                            <span>Texte consolidé</span>
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </a>
                        )}
                        <a 
                          href={text.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <span>Ouvrir sur {text.jurisdiction === 'UE' ? 'EUR-Lex' : 'Légifrance'}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                        </a>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* ─── VUE NIVEAU 3 : FOOD SAFETY / RISK INTELLIGENCE ─── */}
      {engineLevel === 3 && (
        <div className="space-y-6">

          <div className="p-6 bg-gradient-to-r from-blue-50 via-white to-white border border-blue-200 rounded-2xl space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-mono-code font-bold uppercase text-blue-700">
              <AlertTriangle className="w-4 h-4 text-blue-600" />
              Niveau 3 — Signaux d'alerte opérationnels et anticipation avant vote
            </div>
            <h3 className="text-xl font-heading font-extrabold text-slate-950">
              Séparation Méthodologique : Le Risque vs Le Droit
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl font-medium">
              Comme préconisé, le <strong>RASFF</strong> et les avis d'experts ne sont pas des textes de loi, mais des signaux de <strong>Risk Intelligence</strong> essentiels pour anticiper les révisions réglementaires de 12 à 18 mois avant leur publication au Journal Officiel.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button 
                onClick={() => setActiveTab('veille')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-all shadow-md shadow-blue-500/10"
              >
                Consulter le flux des alertes en direct (RASFF / RappelConso) →
              </button>
              <button 
                onClick={() => setActiveTab('diagnostic')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200"
              >
                Voir l'impact sur un profil usine (Démo) →
              </button>
            </div>
          </div>

          {/* Feed d'anticipation et d'alertes instantané */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.slice(0, 4).map(alert => (
              <div key={alert.id} className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded uppercase bg-red-50 text-red-700 border border-red-200">
                    {alert.hazard_category}
                  </span>
                  <span className="text-[11px] font-mono-code text-slate-500 font-semibold">{alert.source}</span>
                </div>
                <h4 className="font-heading font-bold text-sm text-slate-900 leading-snug">{alert.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 font-medium">{alert.summary}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="font-mono-code text-[10px]">Réf. légale : {alert.legal_ref}</span>
                  <span className="text-[#EA580C] font-extrabold">{alert.visipilot_tool}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
