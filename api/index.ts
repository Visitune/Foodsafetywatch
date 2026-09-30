const REGULATORY_SOURCES = [
  { id: 'joue-eurlex', name: 'EUR-Lex / Cellar', organization: 'Office des publications de l\'UE', type: 'Journal Officiel', pays: 'UE', isAvailableInApp: true, description: 'Journal Officiel de l\'Union Européenne — Série L (législation)', category: 'Législation UE', provenance: 'Dépôt OPOCE, flux ATOM/RSS', frequency: 'Quotidien', lastSync: '2026-09-30', legalWeight: 'Texte consolidé', regulationsCovered: ['178/2002', '2073/2005', '2025/40', '2023/915'], url: 'https://eur-lex.europa.eu' },
  { id: 'rasff-portal', name: 'RASFF', organization: 'Commission Européenne', type: 'Alerte & Rappel', pays: 'UE', isAvailableInApp: true, description: 'Rapid Alert System for Food and Feed — notifications sanitaires', category: 'Alertes sanitaires', provenance: 'Portail RASFF, API publique', frequency: 'Temps réel', lastSync: '2026-09-30', legalWeight: 'Notification d\'alerte', regulationsCovered: ['RASFF'], url: 'https://webgate.ec.europa.eu/rasff-window/portal/' },
  { id: 'efsa-opinions', name: 'EFSA', organization: 'Autorité Européenne de Sécurité des Aliments', type: 'Avis Scientifique', pays: 'UE', isAvailableInApp: true, description: 'Avis scientifiques et évaluations des risques', category: 'Évaluation du risque', provenance: 'Site EFSA, flux RSS', frequency: 'Hebdomadaire', lastSync: '2026-09-29', legalWeight: 'Avis scientifique', regulationsCovered: ['EFSA Journal'], url: 'https://www.efsa.europa.eu' },
  { id: 'dgal-bulletins', name: 'DGAL', organization: 'Ministère de l\'Agriculture (FR)', type: 'Alerte & Rappel', pays: 'FR', isAvailableInApp: true, description: 'Bulletins et instructions techniques DGAL', category: 'Contrôles officiels', provenance: 'Site du ministère, flux RSS', frequency: 'Hebdomadaire', lastSync: '2026-09-28', legalWeight: 'Instruction technique', regulationsCovered: ['Instructions DGAL'], url: 'https://agriculture.gouv.fr' },
  { id: 'rappel-conso', name: 'RappelConso', organization: 'DGCCRF (FR)', type: 'Alerte & Rappel', pays: 'FR', isAvailableInApp: true, description: 'Rappels de produits consommateurs', category: 'Rappels produits', provenance: 'API publique RappelConso', frequency: 'Temps réel', lastSync: '2026-09-30', legalWeight: 'Arrêté de rappel', regulationsCovered: ['RappelConso'], url: 'https://rappel.conso.gouv.fr' },
  { id: 'fda-food', name: 'US FDA', organization: 'Food and Drug Administration (US)', type: 'Alerte & Rappel', pays: 'US', isAvailableInApp: true, description: 'Rappels et alertes alimentaires FDA', category: 'Rappels produits', provenance: 'API openFDA', frequency: 'Temps réel', lastSync: '2026-09-30', legalWeight: 'Enforcement', regulationsCovered: ['21 CFR'], url: 'https://www.fda.gov/food' },
  { id: 'gfsi-standards', name: 'GFSI Standards', organization: 'Global Food Safety Initiative', type: 'Standard & Norme', pays: 'INT', isAvailableInApp: true, description: 'Standards GFSI (IFS, BRCGS, FSSC 22000)', category: 'Standards privés', provenance: 'Sites IFS/BRCGS', frequency: 'Trimestriel', lastSync: '2026-09-15', legalWeight: 'Standard volontaire', regulationsCovered: ['IFS Food v8', 'BRCGS Issue 9', 'FSSC 22000'], url: 'https://www.mygfsi.com' }
];

const OFFICIAL_REGULATORY_TEXTS = [
  { id: 'reg-ppwr-2025-40', title: 'Règlement (UE) 2025/40 relatif aux emballages et aux déchets d\'emballages (PPWR)', legalReference: 'Règlement (UE) n° 2025/40', celexOrNor: 'CELEX: 32025R0040', jurisdiction: 'UE', jurisdictionLabel: 'Union Européenne', officialSource: 'EUR-Lex / Cellar', officialSourceBadge: 'EUR-Lex Cellar', sourceUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32025R0040', consolidatedUrl: 'https://eur-lex.europa.eu/eli/reg/2025/40/oj', domainId: 'packaging', domainName: 'Matériaux au contact & emballages (PPWR)', subDomain: 'PPWR (Règlement 2025/40)', status: 'NOUVEAU', statusBadgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', datePublication: '24/01/2025', dateEntreeVigueur: '14/02/2025', dateApplication: '14/08/2026', isApplied: false, modifiedArticles: ['Articles 5 (Restrictions substances chimiques)', 'Article 6 (Recyclabilité)', 'Article 7 (Teneur minimale en plastique recyclé)', 'Article 9 (Réduction du suremballage)'], articlesImpactSummary: 'Restriction des PFAS intentionnellement ajoutés dans les emballages (seuils harmonisés très bas), obligation de 100% d\'emballages réutilisables ou recyclables d\'ici 2030 et limitation de l\'espace vide maximal (50% du volume pour certaines familles).', impactLevel: 'CRITIQUE', affectedSectors: ['Toutes industries agroalimentaires', 'Traiteur & Plats cuisinés', 'Boissons & Conserves', 'Produits laitiers'], affectedProducts: ['Barquettes operculées', 'Films barrière multicouches', 'Cartons ingraissables', 'Bouteilles et bouchons'], previousRequirements: 'Directive 94/62/CE : exigences génériques sur les métaux lourds, sans restriction harmonisée sur les PFAS ni taux obligatoire de vide.', newRequirements: 'Seuils harmonisés très bas pour les PFAS intentionnellement ajoutés (valeurs renforcées pour les papiers/cartons en contact alimentaire), évaluation obligatoire de la recyclabilité par classes, teneurs minimales en plastique recyclé et limitation de l\'espace vide.', visipilotSoftwareModule: 'VisiPact', visipilotActionPlan: 'Lancer une campagne de collecte d\'attestations d\'absence de PFAS auprès des fournisseurs de packaging via VisiPact et auditer les fiches techniques emballages dans VisiPLM.' },
  { id: 'reg-contaminants-2023-915', title: 'Règlement (UE) 2023/915 — teneurs maximales en contaminants (mycotoxines, toxines végétales)', legalReference: 'Règlement (UE) 2023/915', celexOrNor: 'CELEX: 32023R0915', jurisdiction: 'UE', jurisdictionLabel: 'Union Européenne', officialSource: 'EUR-Lex / Cellar', officialSourceBadge: 'EUR-Lex Cellar', sourceUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32023R0915', consolidatedUrl: 'https://eur-lex.europa.eu/eli/reg/2023/915/oj', domainId: 'contaminants', domainName: 'Contaminants & Mycotoxines', subDomain: 'Teneurs maximales', status: 'EN VIGUEUR', statusBadgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', datePublication: '19/04/2023', dateEntreeVigueur: '01/07/2023', dateApplication: '01/07/2023', isApplied: true, modifiedArticles: ['Annexe I (Teneurs maximales en mycotoxines)', 'Annexe II (Teneurs maximales en toxines végétales)'], articlesImpactSummary: 'Teneurs maximales harmonisées pour les mycotoxines (aflatoxines, ochratoxine A, déoxynivalénol) et toxines végétales (atropine, scopolamine) dans les denrées alimentaires.', impactLevel: 'ÉLEVÉ', affectedSectors: ['Céréales & Farines', 'Épices & Herbes', 'Fruits secs & Noix', 'Aliments pour enfants'], affectedProducts: ['Céréales', 'Épices', 'Fruits secs', 'Purées de fruits à coque'], previousRequirements: 'Règlement 1881/2006 : seuils moins couvrants pour certaines mycotoxines et toxines végétales.', newRequirements: 'Seuils renforcés pour l\'ochratoxine A dans les épices et les fruits secs, nouvelles limites pour les toxines végétales dans les aliments pour enfants.', visipilotSoftwareModule: 'VisiPLM', visipilotActionPlan: 'Mettre à jour les spécifications matières dans VisiPLM et renforcer les plans de contrôle fournisseurs.' },
  { id: 'reg-2073-2005-listeria', title: 'Règlement (CE) n° 2073/2005 concernant les critères microbiologiques applicables aux denrées alimentaires', legalReference: 'Règlement (CE) 2073/2005 modifié par le Règlement (UE) 2024/2895', celexOrNor: 'CELEX: 32007R2073', jurisdiction: 'UE', jurisdictionLabel: 'Union Européenne', officialSource: 'EUR-Lex / Cellar', officialSourceBadge: 'EUR-Lex Cellar', sourceUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32007R2073', consolidatedUrl: 'https://eur-lex.europa.eu/eli/reg/2007/2073/oj', domainId: 'microbiologie', domainName: 'Microbiologie & Pathogènes', subDomain: 'Critères microbiologiques', status: 'MODIFIÉ', statusBadgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30', datePublication: '01/12/2005', dateEntreeVigueur: '01/01/2006', dateApplication: '01/07/2026', isApplied: false, modifiedArticles: ['Article 3 (Critères de sécurité des denrées)', 'Annexe I (Critères microbiologiques)'], articlesImpactSummary: 'Renforcement des critères Listeria monocytogenes pour les denrées prêts à consommer (PAM) : absence dans 25 g sur toute la durée de vie, avec validation obligatoire par challenge-tests (ISO 20976-1).', impactLevel: 'CRITIQUE', affectedSectors: ['Traiteur & Plats cuisinés', 'Charcuterie tranchée', 'Poisson fumé', 'Fromages à pâte molle'], affectedProducts: ['Charcuterie tranchée', 'Saumon fumé', 'Fromages à pâte molle', 'Plats cuisinés réfrigérés'], previousRequirements: 'Critère Listeria : absence dans 25 g à la date de fabrication, sans exigence sur toute la DLC.', newRequirements: 'Absence dans 25 g sur toute la durée de vie (DLC), validation par challenge-tests obligatoire pour les PAM.', visipilotSoftwareModule: 'VisiTact', visipilotActionPlan: 'Réviser les dossiers de validation de DLC, renforcer les plans de prélèvements de surface, et mettre à jour les définitions de PAM dans VisiPLM.' },
  { id: 'reg-2017-625-controles', title: 'Règlement (UE) 2017/625 — contrôles officiels sur toute la chaîne alimentaire', legalReference: 'Règlement (UE) 2017/625', celexOrNor: 'CELEX: 32017R0625', jurisdiction: 'UE', jurisdictionLabel: 'Union Européenne', officialSource: 'EUR-Lex / Cellar', officialSourceBadge: 'EUR-Lex Cellar', sourceUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32017R0625', consolidatedUrl: 'https://eur-lex.europa.eu/eli/reg/2017/625/oj', domainId: 'controles', domainName: 'Contrôles officiels', subDomain: 'Règlement 2017/625', status: 'EN VIGUEUR', statusBadgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', datePublication: '29/04/2017', dateEntreeVigueur: '14/12/2019', dateApplication: '14/12/2019', isApplied: true, modifiedArticles: ['Article 44 (Fréquence des contrôles)', 'Article 45 (Contrôles documentaires)'], articlesImpactSummary: 'Cadre unique des contrôles officiels sur toute la chaîne alimentaire : fréquence des contrôles fondée sur le risque, dématérialisation des échanges (TRACES NT) et régime de sanctions administratives efficaces, proportionnées et dissuasives.', impactLevel: 'ÉLEVÉ', affectedSectors: ['Importateurs / Exportateurs', 'Grossistes & Centrales d\'achat', 'Tous transformateurs agroalimentaire'], affectedProducts: ['Tous produits agricoles et denrées importées'], previousRequirements: 'Directives sectorielles dispersées (89/392/CEE, 89/608/CEE) sans harmonisation.', newRequirements: 'Règlement unique avec contrôles fondés sur le risque, TRACES NT obligatoire et sanctions harmonisées.', visipilotSoftwareModule: 'VISITrack', visipilotActionPlan: 'Connecter les données de certification et de contrôle dans VISITrack pour une traçabilité complète.' },
  { id: 'reg-2023-1115-eudr', title: 'Règlement (UE) 2023/1115 — déforestation (EUDR) : obligation de diligence raisonnée', legalReference: 'Règlement (UE) 2023/1115', celexOrNor: 'CELEX: 32023R1115', jurisdiction: 'UE', jurisdictionLabel: 'Union Européenne', officialSource: 'EUR-Lex / Cellar', officialSourceBadge: 'EUR-Lex Cellar', sourceUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32023R1115', consolidatedUrl: 'https://eur-lex.europa.eu/eli/reg/2023/1115/oj', domainId: 'durabilite', domainName: 'Durabilité & Déforestation', subDomain: 'EUDR (Règlement 2023/1115)', status: 'MODIFIÉ', statusBadgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30', datePublication: '30/06/2023', dateEntreeVigueur: '30/12/2024', dateApplication: '30/06/2026', isApplied: false, modifiedArticles: ['Article 44 (Entrée en vigueur et application reportée)', 'Articles 9 à 13 (Diligence raisonnée, géolocalisation des parcelles et déclarations DDS)'], articlesImpactSummary: 'Report au 30 décembre 2025 pour les grands groupes et 30 juin 2026 pour les PME. Obligation de fournir les coordonnées GPS polygonales des parcelles pour le café, cacao, soja, huile de palme, bovins.', impactLevel: 'CRITIQUE', affectedSectors: ['Importateurs / Exportateurs', 'Grossistes & Centrales d\'achat', 'Tous transformateurs agroalimentaire'], affectedProducts: ['Café', 'Cacao', 'Soja', 'Huile de palme', 'Bovins et produits dérivés'], previousRequirements: 'Date initiale au 30 décembre 2024 sans portail européen unifié opérationnel.', newRequirements: 'Connexion obligatoire au portail de diligence raisonnée de la Commission européenne avec validation de non-déforestation post-31 décembre 2020.', visipilotSoftwareModule: 'VISITrack', visipilotActionPlan: 'Activer le module de traçabilité cartographique GPS dans VISITrack pour collecter automatiquement les coordonnées polygonales des plantations auprès des coopératives exportatrices.' },
  { id: 'reg-2024-1102-nitrates', title: 'Règlement (UE) 2024/1102 — nitrates et nitrites : nouveaux seuils pour les charcuteries et les fromages', legalReference: 'Règlement (UE) 2024/1102', celexOrNor: 'CELEX: 32024R1102', jurisdiction: 'UE', jurisdictionLabel: 'Union Européenne', officialSource: 'EUR-Lex / Cellar', officialSourceBadge: 'EUR-Lex Cellar', sourceUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R1102', consolidatedUrl: 'https://eur-lex.europa.eu/eli/reg_impl/2024/1102/oj', domainId: 'contaminants', domainName: 'Contaminants & Additifs', subDomain: 'Nitrates / Nitrites', status: 'NOUVEAU', statusBadgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', datePublication: '12/03/2024', dateEntreeVigueur: '12/03/2024', dateApplication: '01/01/2026', isApplied: true, modifiedArticles: ['Article 3 (Teneurs maximales en nitrates)', 'Article 4 (Teneurs maximales en nitrites)'], articlesImpactSummary: 'Nouveaux seuils maximaux pour les nitrates et nitrites dans les charcuteries, fromages et produits carnés transformés. Renforcement des contrôles en usine.', impactLevel: 'ÉLEVÉ', affectedSectors: ['Charcuterie', 'Fromagerie', 'Traiteur'], affectedProducts: ['Charcuteries cuites et crues', 'Fromages affinés', 'Jambons secs'], previousRequirements: 'Seuils génériques pour les nitrates/nitrites sans distinction par catégorie de produit.', newRequirements: 'Seuils spécifiques par catégorie de produit avec obligations de contrôle renforcées en usine.', visipilotSoftwareModule: 'VisiPLM', visipilotActionPlan: 'Mettre à jour les recettes dans VisiPLM avec les nouveaux seuils et renforcer les plans de contrôle en usine.' },
  { id: 'reg-uk-btom-2026', title: 'UK BTOM — Border Target Operating Model : contrôles renforcés sur les importations', legalReference: 'UK Border Target Operating Model (BTOM)', celexOrNor: 'UK-BTOM-2026', jurisdiction: 'UK', jurisdictionLabel: 'Royaume-Uni', officialSource: 'UK DEFRA', officialSourceBadge: 'UK DEFRA', sourceUrl: 'https://www.food.gov.uk/business-guidance/border-target-operating-model', consolidatedUrl: '', domainId: 'import-export', domainName: 'Import / Export & Certificats', subDomain: 'UK BTOM', status: 'EN VIGUEUR', statusBadgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', datePublication: '01/01/2026', dateEntreeVigueur: '01/01/2026', dateApplication: '01/01/2026', isApplied: true, modifiedArticles: ['Annexe 1 (Taux de contrôle)', 'Annexe 2 (Documents requis)'], articlesImpactSummary: 'Entrée en vigueur des taux de contrôle renforcés aux postes d\'inspection frontaliers britanniques (BCP). Nécessité d\'un certificat sanitaire d\'exportation (EHC) dématérialisé conforme.', impactLevel: 'ÉLEVÉ', affectedSectors: ['Exportateurs UK', 'Importateurs UK', 'Transporteurs'], affectedProducts: ['Viandes et produits carnés', 'Poissons et produits de la mer', 'Produits laitiers'], previousRequirements: 'Contrôles documentaires aléatoires sans taux obligatoire.', newRequirements: 'Taux de contrôle obligatoires avec certificats sanitaires dématérialisés EHC.', visipilotSoftwareModule: 'VISITrack', visipilotActionPlan: 'Pré-enregistrer systématiquement les envois sur IPAFFS et auditer les déclarations en douane via VisiPilot.' },
  { id: 'reg-fda-fsma-204', title: 'FDA FSMA Rule 204 — registres électroniques des événements de traçabilité critiques (KDE)', legalReference: '21 CFR Part 1, Subpart S (Règle 204 FSMA)', celexOrNor: '21-CFR-Part1-SubpartS', jurisdiction: 'US', jurisdictionLabel: 'États-Unis', officialSource: 'US Federal Register · FDA', officialSourceBadge: 'FDA CFSAN', sourceUrl: 'https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-rule-204-traceability', consolidatedUrl: '', domainId: 'tracabilite', domainName: 'Traçabilité & Lots', subDomain: 'FSMA 204 (KDE)', status: 'EN VIGUEUR', statusBadgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', datePublication: '20/11/2022', dateEntreeVigueur: '20/11/2022', dateApplication: '20/01/2026', isApplied: true, modifiedArticles: ['Section 204.310 (KDE requirements)', 'Section 204.315 (Traceability plan)'], articlesImpactSummary: 'Tout exploitant de denrées à haut risque (légumes-feuilles, fromages à croûte naturelle, purées de fruits à coque, mollusques, poissons entiers) doit tenir un registre électronique des événements de traçabilité critiques (KDE) et le transmettre à la FDA sous 24 h sur demande.', impactLevel: 'CRITIQUE', affectedSectors: ['Exportateurs US', 'Transformateurs', 'Importateurs'], affectedProducts: ['Légumes-feuilles', 'Fromages à croûte naturelle', 'Purées de fruits à coque', 'Mollusques', 'Poissons entiers'], previousRequirements: 'Pas de registre électronique obligatoire pour la traçabilité.', newRequirements: 'Registre électronique KDE obligatoire avec transmission à la FDA sous 24 h.', visipilotSoftwareModule: 'VISITrack', visipilotActionPlan: 'Connecter les numéros de lots de fabrication au registre centralisé VISITrack pour générer l\'export standardisé FDA en un clic.' },
  { id: 'reg-decret-2024-171', title: 'Décret n° 2024-171 relatif à l\'indication de l\'origine des produits agricoles et alimentaires', legalReference: 'Décret n° 2024-171 du 15 mars 2024', celexOrNor: 'NOR: AGRL2407892D', jurisdiction: 'FR', jurisdictionLabel: 'France', officialSource: 'Légifrance / PISTE', officialSourceBadge: 'Légifrance', sourceUrl: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000051392345', consolidatedUrl: '', domainId: 'etiquetage', domainName: 'Étiquetage & Origine', subDomain: 'Indication d\'origine', status: 'EN VIGUEUR', statusBadgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', datePublication: '15/03/2024', dateEntreeVigueur: '01/01/2025', dateApplication: '01/01/2025', isApplied: true, modifiedArticles: ['Article 1 (Champ d\'application)', 'Article 2 (Modalités d\'indication)'], articlesImpactSummary: 'Obligation d\'indiquer l\'origine des produits agricoles et alimentaires dans les conditions définies par le décret, avec des modalités spécifiques pour les produits transformés.', impactLevel: 'MOYEN', affectedSectors: ['Transformateurs', 'Distributeurs', 'Traiteur'], affectedProducts: ['Produits transformés', 'Plats cuisinés', 'Charcuteries'], previousRequirements: 'Indication d\'origine volontaire sans cadre réglementaire harmonisé.', newRequirements: 'Indication d\'origine obligatoire avec modalités précises selon les catégories de produits.', visipilotSoftwareModule: 'VisiPLM', visipilotActionPlan: 'Mettre à jour les étiquettes et les fiches produits dans VisiPLM.' },
  { id: 'reg-arrete-2009-sanitaire', title: 'Arrêté du 21 décembre 2009 relatif aux règles sanitaires applicables aux activités de commerce de détail, d\'entreposage et de transport de produits d\'origine animale', legalReference: 'Arrêté du 21 décembre 2009', celexOrNor: 'NOR: AGRL0915885A', jurisdiction: 'FR', jurisdictionLabel: 'France', officialSource: 'Légifrance / PISTE', officialSourceBadge: 'Légifrance', sourceUrl: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000021523456', consolidatedUrl: '', domainId: 'hygiene', domainName: 'Hygiène & PMS', subDomain: 'Règles sanitaires', status: 'EN VIGUEUR', statusBadgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', datePublication: '21/12/2009', dateEntreeVigueur: '01/01/2010', dateApplication: '01/01/2010', isApplied: true, modifiedArticles: ['Article 3 (Températures)', 'Article 4 (Hygiène des locaux)', 'Article 5 (Traçabilité)'], articlesImpactSummary: 'Règles sanitaires applicables aux activités de commerce de détail, d\'entreposage et de transport de produits d\'origine animale : températures, hygiène, traçabilité.', impactLevel: 'ÉLEVÉ', affectedSectors: ['Détaillants', 'Entrepôts', 'Transporteurs', 'Traiteur'], affectedProducts: ['Viandes', 'Poissons', 'Produits laitiers', 'Œufs'], previousRequirements: 'Arrêté du 22 décembre 1988 moins détaillé sur les températures et l\'hygiène.', newRequirements: 'Exigences renforcées sur les températures de conservation, l\'hygiène des locaux et la traçabilité.', visipilotSoftwareModule: 'VisiTact', visipilotActionPlan: 'Mettre à jour les PMS et les procédures de température dans VisiTact.' }
];

async function fetchFDAEnforcement(): Promise<any[]> {
  try {
    const url = 'https://api.fda.gov/food/enforcement.json?limit=10&sort=report_date:desc';
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((r: any, i: number) => ({
      id: `fda-${r.recall_number || i}`,
      title: (r.product_description || 'Rappel FDA').slice(0, 120),
      source: 'US FDA · openFDA',
      legal_ref: r.statutory_authority || '21 CFR Part 7',
      pays: 'US',
      date: r.report_date || new Date().toISOString().split('T')[0],
      severity: r.classification === 'Class I' ? 'critical' : r.classification === 'Class II' ? 'high' : 'medium',
      secteur: 'Multi-secteurs',
      hazard_category: r.reason_for_recall || 'Non spécifié',
      summary: r.product_description || '',
      impact: r.recalling_firm || '',
      recommendation: r.status || '',
      visipilot_tool: 'VISITrack',
      url: 'https://www.fda.gov/safety/recalls-market-withdrawals-safety-alerts'
    }));
  } catch { return []; }
}

async function fetchRASFFNotifications(): Promise<any[]> {
  try {
    const url = 'https://webgate.ec.europa.eu/rasff-window/portal/api/notifications?page=1&pageSize=10&format=json';
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.notifications || data.items || data.results || [];
    return items.map((n: any, i: number) => ({
      id: `rasff-${n.id || i}`,
      title: (n.title || n.subject || 'Notification RASFF').slice(0, 120),
      source: 'RASFF · Portail UE',
      legal_ref: n.legalReference || n.reference || 'RASFF',
      pays: n.country || 'UE',
      date: n.date || n.notificationDate || new Date().toISOString().split('T')[0],
      severity: n.risk === 'serious' ? 'critical' : n.risk === 'high' ? 'high' : 'medium',
      secteur: n.category || 'Multi-secteurs',
      hazard_category: n.hazard || n.contaminant || 'Non spécifié',
      summary: n.description || n.title || '',
      impact: n.actionTaken || '',
      recommendation: n.actionTaken || '',
      visipilot_tool: 'VISITrack',
      url: 'https://webgate.ec.europa.eu/rasff-window/portal/'
    }));
  } catch { return []; }
}

async function fetchEURLEXTexts(): Promise<any[]> {
  try {
    const query = `PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>
SELECT ?work ?celex ?title ?date WHERE {
  ?work cdm:resource_legal_type "REG" .
  ?work cdm:work_date_document ?date .
  ?work cdm:work_id_celex ?celex .
  FILTER (?date > "2024-01-01"^^xsd:date)
}
ORDER BY DESC(?date)
LIMIT 10`;
    const url = `https://publications.europa.eu/webapi/rdf/sparql?query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: { 'Accept': 'application/sparql-results+json' }
    });
    if (!res.ok) return [];
    const data = await res.json();
    const bindings = data.results?.bindings || [];
    return bindings.map((b: any, i: number) => ({
      id: `eurlex-${i}`,
      title: b.title?.value || b.celex?.value || 'Texte EUR-Lex',
      source: 'EUR-Lex · Cellar',
      legal_ref: b.celex?.value || '',
      pays: 'UE',
      date: b.date?.value || new Date().toISOString().split('T')[0],
      status: 'EN VIGUEUR',
      statusBadgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      jurisdiction: 'UE',
      jurisdictionLabel: 'Union Européenne',
      domainId: 'general',
      domainName: 'Général',
      subDomain: 'Général',
      celexOrNor: b.celex?.value || '',
      legalReference: b.celex?.value || '',
      datePublication: b.date?.value || '',
      dateEntreeVigueur: b.date?.value || '',
      dateApplication: b.date?.value || '',
      isApplied: true,
      articlesImpactSummary: 'Texte réglementaire EUR-Lex',
      modifiedArticles: [],
      affectedProducts: [],
      previousRequirements: '',
      newRequirements: '',
      visipilotSoftwareModule: 'VisiPLM',
      visipilotActionPlan: '',
      sourceUrl: `https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:${b.celex?.value || ''}`,
      consolidatedUrl: '',
      officialSourceBadge: 'EUR-Lex',
      url: `https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:${b.celex?.value || ''}`
    }));
  } catch { return []; }
}

let legifranceToken: { value: string; expiresAt: number } | null = null;

async function getLegifranceToken(): Promise<string | null> {
  if (legifranceToken && Date.now() < legifranceToken.expiresAt) {
    return legifranceToken.value;
  }
  try {
    const clientId = process.env.LEGIFRANCE_CLIENT_ID || '';
    const clientSecret = process.env.LEGIFRANCE_CLIENT_SECRET || '';
    if (!clientId || !clientSecret) return null;
    const res = await fetch('https://sandbox-oauth.piste.gouv.fr/api/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`,
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.access_token) {
      legifranceToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in || 3600) * 1000 - 60000 };
      return legifranceToken.value;
    }
    return null;
  } catch { return null; }
}

async function fetchLegifranceTexts(): Promise<any[]> {
  try {
    const token = await getLegifranceToken();
    if (!token) return [];
    const res = await fetch('https://sandbox-api.piste.gouv.fr/dila/legifrance/lf-engine-app/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ query: 'sécurité des aliments', nature: 'REGLEMENT', pageSize: 10, page: 1 }),
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) return [];
    const data = await res.json();
    const results = data.results || data.items || [];
    return results.map((r: any, i: number) => ({
      id: `legifrance-${r.id || i}`,
      title: r.title || r.intitule || 'Texte Légifrance',
      source: 'Légifrance · PISTE',
      legal_ref: r.id || r.cid || '',
      pays: 'FR',
      date: r.datePublication || r.date || new Date().toISOString().split('T')[0],
      status: 'EN VIGUEUR',
      statusBadgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      jurisdiction: 'FR',
      jurisdictionLabel: 'France',
      domainId: 'general',
      domainName: 'Général',
      subDomain: 'Général',
      celexOrNor: r.id || r.cid || '',
      legalReference: r.id || r.cid || '',
      datePublication: r.datePublication || r.date || '',
      dateEntreeVigueur: r.dateVigueur || r.date || '',
      dateApplication: r.dateVigueur || r.date || '',
      isApplied: true,
      articlesImpactSummary: r.title || r.intitule || 'Texte réglementaire français',
      modifiedArticles: [],
      affectedProducts: [],
      previousRequirements: '',
      newRequirements: '',
      visipilotSoftwareModule: 'VisiPLM',
      visipilotActionPlan: '',
      sourceUrl: `https://www.legifrance.gouv.fr/loda/id/${r.id || r.cid || ''}`,
      consolidatedUrl: '',
      officialSourceBadge: 'Légifrance',
      url: `https://www.legifrance.gouv.fr/loda/id/${r.id || r.cid || ''}`
    }));
  } catch { return []; }
}

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/sources') {
    return Response.json({ total: REGULATORY_SOURCES.length, sources: REGULATORY_SOURCES });
  }

  if (path === '/api/alerts') {
    const [realAlerts, fallbackAlerts] = await Promise.all([
      Promise.all([fetchFDAEnforcement(), fetchRASFFNotifications()]).then(([fda, rasff]) => [...fda, ...rasff]),
      Promise.resolve([])
    ]);
    const alerts = [...realAlerts, ...fallbackAlerts];
    const urgency = url.searchParams.get('urgency');
    const secteur = url.searchParams.get('secteur');
    const q = url.searchParams.get('q');
    let filtered = [...alerts];
    if (urgency && urgency !== 'ALL') filtered = filtered.filter((a: any) => a.severity === urgency);
    if (secteur && secteur !== 'ALL') filtered = filtered.filter((a: any) => a.secteur === secteur || a.secteur === 'Multi-secteurs');
    if (q) {
      const query = q.toLowerCase();
      filtered = filtered.filter((a: any) =>
        a.title.toLowerCase().includes(query) ||
        a.summary.toLowerCase().includes(query) ||
        a.legal_ref.toLowerCase().includes(query) ||
        a.hazard_category.toLowerCase().includes(query)
      );
    }
    return Response.json({ count: filtered.length, alerts: filtered });
  }

  if (path === '/api/diagnostic-profiles') {
    return Response.json([]);
  }

  if (path === '/api/regulatory/texts') {
    const [realTexts, staticTexts] = await Promise.all([
      Promise.all([fetchEURLEXTexts(), fetchLegifranceTexts()]).then(([eurlex, legifrance]) => [...eurlex, ...legifrance]),
      Promise.resolve([...OFFICIAL_REGULATORY_TEXTS])
    ]);
    let texts = [...realTexts, ...staticTexts];
    const jurisdiction = url.searchParams.get('jurisdiction');
    const domain = url.searchParams.get('domain');
    const status = url.searchParams.get('status');
    const q = url.searchParams.get('q');
    if (jurisdiction && jurisdiction !== 'ALL') texts = texts.filter((t: any) => t.jurisdiction === jurisdiction);
    if (domain && domain !== 'ALL') texts = texts.filter((t: any) => t.domainId === domain);
    const ALLOWED_STATUSES = ['NOUVEAU', 'MODIFIÉ', 'CONSOLIDÉ', 'EN VIGUEUR', 'ABROGÉ'];
    if (status && status !== 'ALL' && ALLOWED_STATUSES.includes(status)) {
      texts = texts.filter((t: any) => t.status === status);
    }
    if (q) {
      const query = q.toLowerCase();
      texts = texts.filter((t: any) =>
        t.title.toLowerCase().includes(query) ||
        t.legalReference.toLowerCase().includes(query) ||
        t.celexOrNor.toLowerCase().includes(query) ||
        t.subDomain.toLowerCase().includes(query) ||
        t.articlesImpactSummary.toLowerCase().includes(query) ||
        t.modifiedArticles.some((a: string) => a.toLowerCase().includes(query)) ||
        t.affectedProducts.some((p: string) => p.toLowerCase().includes(query))
      );
    }
    const stats = {
      total: texts.length,
      ueCount: texts.filter((t: any) => t.jurisdiction === 'UE').length,
      frCount: texts.filter((t: any) => t.jurisdiction === 'FR').length,
      nouveauCount: texts.filter((t: any) => t.status === 'NOUVEAU').length,
      modifieCount: texts.filter((t: any) => t.status === 'MODIFIÉ').length,
      consolideCount: texts.filter((t: any) => t.status === 'CONSOLIDÉ').length,
      enVigueurCount: texts.filter((t: any) => t.status === 'EN VIGUEUR').length
    };
    return Response.json({ total: texts.length, stats, texts });
  }

  if (path === '/api/regulatory/domains') {
    return Response.json([]);
  }

  if (path === '/api/regulatory/pipelines') {
    return Response.json([]);
  }

  if (path === '/api/plans') {
    return Response.json([]);
  }

  return Response.json({ error: 'Not found' }, { status: 404 });
}
