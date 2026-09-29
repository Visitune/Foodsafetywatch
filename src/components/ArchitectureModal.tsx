import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { AppCtx } from './ctx.js';

export function ArchitectureModal({ ctx }: { ctx: AppCtx }) {
  const { setShowArchitectureModal, showArchitectureModal } = ctx;
  return (
    <AnimatePresence>
      {showArchitectureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6 text-slate-800"
          >
            <button 
              onClick={() => setShowArchitectureModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono-code font-bold uppercase text-[#EA580C] bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                  BANC D'ESSAI TECHNIQUE & PIPELINES D'INGESTION
                </span>
                <span className="text-xs font-mono-code text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Architecture cible · Zéro scraping · 100% API & dépôts officiels
                </span>
              </div>
              <h3 className="text-2xl font-heading font-extrabold text-slate-900">
                Architecture d'Ingestion Automatisée EUR-Lex/Cellar & Légifrance/PISTE
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed font-semibold">
                Schéma de l'infrastructure de collecte sans intermédiaire. Les métadonnées et textes sont moissonnés en continu directement auprès des dépôts étatiques européens et français.
              </p>
            </div>

            {/* Schéma de flux visuel */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="text-xs font-mono-code uppercase font-bold text-slate-500">
                Flux d'ingestion technique bidirectionnel :
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Brique 1 : Cellar / EUR-Lex */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-bold text-blue-600 flex items-center gap-1.5">
                      <span>🇪🇺</span>
                      <span>CELLAR (OPOCE)</span>
                    </span>
                    <span className="text-[10px] font-mono-code text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                      SPARQL 1.1 + ATOM
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                    Dépôt central de l'Office des publications de l'UE. Scrutation continue des flux ATOM du Journal Officiel (Série L) et interrogation différentielle SPARQL sur le triplestore RDF pour identifier les actes modificatifs.
                  </p>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono-code text-[10px] text-slate-600 space-y-1">
                    <div className="text-blue-700 font-bold">Endpoint SPARQL :</div>
                    <div className="text-slate-500 truncate font-semibold">https://publications.europa.eu/webapi/rdf/sparql</div>
                    <div className="text-emerald-700 pt-1 font-semibold">PREFIX cdm: &lt;http://publications.europa.eu/ontology/cdm#&gt;</div>
                    <div className="text-slate-600">SELECT ?work ?celex WHERE &#123; ?work cdm:resource_legal_type &quot;REG&quot; &#125;</div>
                  </div>
                </div>

                {/* Brique 2 : Légifrance / PISTE */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-heading font-bold text-emerald-700 flex items-center gap-1.5">
                      <span>🇫🇷</span>
                      <span>LÉGIFRANCE (DILA / PISTE)</span>
                    </span>
                    <span className="text-[10px] font-mono-code text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                      OAuth2 + REST JSON
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                    Plateforme interministérielle PISTE opérée par la DILA. Authentification par jeton JWT Bearer, requêtes plein texte sur les arrêtés techniques DGAL et extraction des articles consolidés du Code de la consommation.
                  </p>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono-code text-[10px] text-slate-600 space-y-1">
                    <div className="text-emerald-700 font-bold">OAuth2 Token URL :</div>
                    <div className="text-slate-500 truncate font-semibold">https://oauth.piste.gouv.fr/api/oauth/token</div>
                    <div className="text-orange-600 pt-1 font-semibold">POST /dila/legifrance/lf-engine-app/suggest/search</div>
                    <div className="text-slate-600">&#123; &quot;fond&quot;: &quot;JORF&quot;, &quot;recherche&quot;: &quot;sécurité des aliments&quot; &#125;</div>
                  </div>
                </div>

              </div>

              {/* Pipeline unifié */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-center space-y-1 text-xs">
                <div className="font-heading font-bold text-slate-800 flex items-center justify-center gap-2">
                  <span>Moteur d'Ingestion VisiPilot</span>
                  <span>→</span>
                  <span className="text-[#EA580C]">Classification 6 Domaines</span>
                  <span>→</span>
                  <span className="text-emerald-700">Passerelle Logicielle Terrain</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono-code font-bold">
                  Filtrage automatique : HACCP, Contaminants (2023/915), Emballages (PPWR 2025/40), Durabilité (PFAS), Contrôles (2017/625)
                </div>
              </div>

            </div>

            {/* Les Garanties d'un socle API officiel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                <div className="font-heading font-bold text-slate-900">⚖️ Opposabilité Juridique</div>
                <div className="text-slate-600 leading-snug font-medium">
                  Les données proviennent directement des publications authentiques (EUR-Lex et JORF officiel).
                </div>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                <div className="font-heading font-bold text-slate-900">🔄 Versions Consolidées</div>
                <div className="text-slate-600 leading-snug font-medium">
                  Accès immédiat à la version à jour incorporant les arrêtés modificatifs et rectificatifs successifs.
                </div>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 shadow-2xs">
                <div className="font-heading font-bold text-slate-900">🛡️ Audit Ready GFSI</div>
                <div className="text-slate-600 leading-snug font-medium">
                  Fournit la traçabilité exigée par l'exigence 1.2.2 des référentiels IFS Food v8 et BRCGS Issue 9.
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowArchitectureModal(false)}
                className="px-6 py-2.5 bg-[#EA580C] text-white font-bold font-heading uppercase tracking-wider text-xs rounded-xl hover:bg-[#c2410c] transition-colors shadow-2xs"
              >
                Fermer le banc d'essai
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
