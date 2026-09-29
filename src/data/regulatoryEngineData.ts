export interface RegulatoryDomain {
  id: string;
  name: string;
  icon: string;
  description: string;
  subDomains: string[];
}

export const REGULATORY_DOMAINS: RegulatoryDomain[] = [
  {
    id: 'food_safety',
    name: 'Sécurité des aliments',
    icon: '🥫',
    description: 'HACCP, critères microbiologiques, teneurs maximales en contaminants, résidus de pesticides, gestion des allergènes majeurs.',
    subDomains: ['HACCP', 'Hygiène', 'Microbiologie', 'Contaminants', 'Résidus & LMR', 'Allergènes majeurs']
  },
  {
    id: 'labeling',
    name: 'Étiquetage & information du consommateur',
    icon: '🏷️',
    description: 'Règlement INCO 1169/2011, déclaration nutritionnelle, allégations nutritionnelles et de santé, indication du pays d\'origine.',
    subDomains: ['Étiquetage général (INCO)', 'Nutrition & Nutri-Score', 'Allégations de santé', 'Origine des ingrédients', 'Allergènes de précaution']
  },
  {
    id: 'packaging',
    name: 'Matériaux au contact & emballages (PPWR)',
    icon: '📦',
    description: 'Règlement-cadre 1935/2004, matières plastiques 10/2011, nouveau règlement PPWR (UE) 2025/40, recyclabilité et réduction des déchets.',
    subDomains: ['PPWR (Règlement 2025/40)', 'Matériaux de contact (FCM)', 'Plastiques recyclés', 'Substances préoccupantes', 'Réemploi & Réutilisation']
  },
  {
    id: 'sustainability',
    name: 'Durabilité & environnement',
    icon: '🌱',
    description: 'Restriction universelle PFAS (REACH), zéro déforestation (EUDR), économie circulaire, gaspillage alimentaire, allégations vertes.',
    subDomains: ['PFAS & Chimie', 'Règlement Déforestation (EUDR)', 'Économie circulaire & AGEC', 'Gaspillage alimentaire', 'Green Claims']
  },
  {
    id: 'controls',
    name: 'Contrôles officiels & opérateurs',
    icon: '🏭',
    description: 'Règlement (UE) 2017/625, traçabilité amont/aval (art. 18), agréments sanitaires CE, inspections frontalières et importations pays tiers.',
    subDomains: ['Contrôles officiels (2017/625)', 'Traçabilité & Lots', 'Agréments sanitaires', 'Import / Export & Certificats', 'Plans de surveillance']
  },
  {
    id: 'general_law',
    name: 'Droit général & responsabilité',
    icon: '⚖️',
    description: 'General Food Law 178/2002, responsabilité civile et pénale de l\'exploitant, fraudes alimentaires (DGCCRF), droit de la consommation.',
    subDomains: ['General Food Law (178/2002)', 'Responsabilité de l\'exploitant', 'Fraudes & Adultération', 'Sanctions & Procédures']
  }
];

export type TextStatus = 'NOUVEAU' | 'MODIFIÉ' | 'CONSOLIDÉ' | 'EN VIGUEUR' | 'ABROGÉ';

export interface OfficialRegulatoryText {
  id: string;
  title: string;
  legalReference: string;
  celexOrNor: string;
  jurisdiction: 'UE' | 'FR';
  jurisdictionLabel: string;
  officialSource: 'EUR-Lex / Cellar' | 'Légifrance / PISTE';
  officialSourceBadge: string;
  sourceUrl: string;
  consolidatedUrl?: string;
  domainId: string;
  domainName: string;
  subDomain: string;
  status: TextStatus;
  statusBadgeColor: string;
  datePublication: string;
  dateEntreeVigueur: string;
  dateApplication: string;
  isApplied: boolean;
  modifiedArticles: string[];
  articlesImpactSummary: string;
  impactLevel: 'CRITIQUE' | 'ÉLEVÉ' | 'MODÉRÉ';
  affectedSectors: string[];
  affectedProducts: string[];
  previousRequirements: string;
  newRequirements: string;
  visipilotSoftwareModule: 'VisiPLM' | 'VISITrack' | 'VISIcat' | 'VisiTact' | 'VisiPact' | 'VisiVal';
  visipilotActionPlan: string;
  cellarSparqlMetadata?: {
    workId: string;
    eurovocCodes: string[];
    directoryCodes: string[];
  };
  pisteMetadata?: {
    nor: string;
    nature: string;
    ministere: string;
  };
}

export const OFFICIAL_REGULATORY_TEXTS: OfficialRegulatoryText[] = [
  // ─── 1. PPWR : RÈGLEMENT (UE) 2025/40 (NOUVEAU / EMBALLAGES) ───
  {
    id: 'reg-ppwr-2025-40',
    title: 'Règlement (UE) 2025/40 relatif aux emballages et aux déchets d\'emballages (PPWR)',
    legalReference: 'Règlement (UE) n° 2025/40 du Parlement européen et du Conseil',
    celexOrNor: 'CELEX: 32025R0040',
    jurisdiction: 'UE',
    jurisdictionLabel: 'Union Européenne',
    officialSource: 'EUR-Lex / Cellar',
    officialSourceBadge: 'EUR-Lex Cellar (REST/Atom)',
    sourceUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32025R0040',
    consolidatedUrl: 'https://eur-lex.europa.eu/eli/reg/2025/40/oj',
    domainId: 'packaging',
    domainName: 'Matériaux au contact & emballages (PPWR)',
    subDomain: 'PPWR (Règlement 2025/40)',
    status: 'NOUVEAU',
    statusBadgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    datePublication: '24/01/2025',
    dateEntreeVigueur: '14/02/2025',
    dateApplication: '14/08/2026',
    isApplied: false,
    modifiedArticles: ['Articles 5 (Restrictions substances chimiques)', 'Article 6 (Recyclabilité)', 'Article 7 (Teneur minimale en plastique recyclé)', 'Article 9 (Réduction du suremballage)'],
    articlesImpactSummary: 'Restriction des PFAS intentionnellement ajoutés dans les emballages (seuils harmonisés très bas), obligation de 100% d\'emballages réutilisables ou recyclables d\'ici 2030 et limitation de l\'espace vide maximal (50% du volume pour certaines familles).',
    impactLevel: 'CRITIQUE',
    affectedSectors: ['Toutes industries agroalimentaires', 'Traiteur & Plats cuisinés', 'Boissons & Conserves', 'Produits laitiers'],
    affectedProducts: ['Barquettes operculées', 'Films barrière multicouches', 'Cartons ingraissables', 'Bouteilles et bouchons'],
    previousRequirements: 'Directive 94/62/CE : exigences génériques sur les métaux lourds, sans restriction harmonisée sur les PFAS ni taux obligatoire de vide.',
    newRequirements: 'Seuils harmonisés très bas pour les PFAS intentionnellement ajoutés (valeurs renforcées pour les papiers/cartons en contact alimentaire), évaluation obligatoire de la recyclabilité par classes, teneurs minimales en plastique recyclé et limitation de l\'espace vide.',
    visipilotSoftwareModule: 'VisiPact',
    visipilotActionPlan: 'Lancer une campagne de collecte d\'attestations d\'absence de PFAS auprès des fournisseurs de packaging via VisiPact et auditer les fiches techniques emballages dans VisiPLM.',
    cellarSparqlMetadata: {
      workId: 'cellar:8a3b5c12-32025R0040',
      eurovocCodes: ['2743 emballage', '2825 déchet d\'emballage', '1590 protection de l\'environnement', '2737 sécurité des aliments'],
      directoryCodes: ['15.10.20 Protection de l\'environnement', '13.30.16 Sécurité sanitaire des aliments']
    }
  },

  // ─── 2. CONTAMINANTS : RÈGLEMENT (UE) 2023/915 MODIFIÉ (MYCOTOXINES & TOXINES VÉGÉTALES) ───
  {
    id: 'reg-contaminants-2023-915-mod',
    title: 'Règlement (UE) 2023/915 — teneurs maximales en contaminants (extrait de démonstration : scénario de révision des seuils Ochratoxine A)',
    legalReference: 'Règlement (UE) 2023/915 (extrait de démonstration — scénario de modification, à confronter au texte publié au JOUE)',
    celexOrNor: 'CELEX: 32023R0915',
    jurisdiction: 'UE',
    jurisdictionLabel: 'Union Européenne',
    officialSource: 'EUR-Lex / Cellar',
    officialSourceBadge: 'EUR-Lex Cellar (SPARQL)',
    sourceUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32023R0915',
    consolidatedUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32023R0915',
    domainId: 'food_safety',
    domainName: 'Sécurité des aliments',
    subDomain: 'Contaminants',
    status: 'MODIFIÉ',
    statusBadgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    datePublication: '18/03/2026',
    dateEntreeVigueur: '08/04/2026',
    dateApplication: '01/07/2027',
    isApplied: false,
    modifiedArticles: ['Annexe I, section 1 (Mycotoxines - Ochratoxine A)', 'Annexe I, section 2 (Toxines végétales - Alcaloïdes)', 'Annexe I, section 5 (PFAS dans les produits de la pêche)'],
    articlesImpactSummary: 'Scénario de démonstration : abaissement des teneurs maximales en Ochratoxine A (épices, fruits séchés, cacao) et création d\'un seuil spécifique pour les alcaloïdes tropaniques dans les infusions.',
    impactLevel: 'CRITIQUE',
    affectedSectors: ['Épicerie & Épices', 'Cacao & Chocolaterie', 'Infusions & Thés', 'Céréales & Meunerie'],
    affectedProducts: ['Piment et paprika séchés', 'Poivre et muscade', 'Pâtes de cacao', 'Graines de lin et de chia'],
    previousRequirements: 'Ochratoxine A : teneurs maximales de 5 µg/kg dans les épices séchées (genre Capsicum) et les herbes séchées selon l\'Annexe I du règlement 2023/915.',
    newRequirements: 'Scénario illustratif : seuil maximal abaissé pour les épices, avec validation systématique des lots importés (chromatographie LC-MS/MS) avant mise en fabrication.',
    visipilotSoftwareModule: 'VISITrack',
    visipilotActionPlan: 'Mettre à jour les grilles de contrôle des réceptions matières premières dans VISITrack et bloquer automatiquement tout lot dont le certificat d\'analyse dépasse 10 µg/kg.',
    cellarSparqlMetadata: {
      workId: 'cellar:4d12ef90-32026R0842',
      eurovocCodes: ['2735 contaminant', '2737 sécurité des aliments', '1445 mycotoxine', '2731 produit agricole'],
      directoryCodes: ['03.50.10 Droit alimentaire', '15.20 Protection des consommateurs']
    }
  },

  // ─── 3. MICROBIOLOGIE : RÈGLEMENT (CE) 2073/2005 (CONSOLIDÉ / LISTERIA MONOCYTOGENES) ───
  {
    id: 'reg-microbio-2073-2005-cons',
    title: 'Règlement (CE) n° 2073/2005 concernant les critères microbiologiques applicables aux denrées alimentaires (Version consolidée)',
    legalReference: 'Règlement (CE) n° 2073/2005 consolidé avec le Règlement (UE) 2024/2895',
    celexOrNor: 'CELEX: 02005R2073-20241101',
    jurisdiction: 'UE',
    jurisdictionLabel: 'Union Européenne',
    officialSource: 'EUR-Lex / Cellar',
    officialSourceBadge: 'EUR-Lex Consolidé',
    sourceUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R2895',
    consolidatedUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:02005R2073',
    domainId: 'food_safety',
    domainName: 'Sécurité des aliments',
    subDomain: 'Microbiologie',
    status: 'CONSOLIDÉ',
    statusBadgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    datePublication: '25/10/2024',
    dateEntreeVigueur: '11/11/2024',
    dateApplication: '01/07/2026',
    isApplied: true,
    modifiedArticles: ['Annexe I, Chapitre 1, Critère 1.2 (Listeria monocytogenes dans les denrées prêtes à consommer)', 'Notes de bas de page 4 et 8 (Validation challenge-tests ISO 20976-1)'],
    articlesImpactSummary: 'Suppression de la tolérance de 100 ufc/g en fin de DLC pour les produits prêts à être consommés sans preuve documentaire formelle issue de challenge-tests ISO 20976-1.',
    impactLevel: 'CRITIQUE',
    affectedSectors: ['Salaisons & Charcuterie', 'Traiteur frais & Plats préparés', 'Fromages au lait cru & Pâtes molles', 'Produits de la mer fumés'],
    affectedProducts: ['Jambon cuit tranché', 'Saumon fumé', 'Fromages à pâte molle', 'Salades composées réfrigérées'],
    previousRequirements: 'Possibilité d\'invoquer des études de vieillissement historiques internes sans protocole standardisé strict.',
    newRequirements: 'Absence stricte dans 25g au stade usine sauf si un challenge-test mené selon la norme ISO 20976-1 démontre que le germe ne dépassera pas 100 ufc/g en fin de vie commerciale.',
    visipilotSoftwareModule: 'VisiTact',
    visipilotActionPlan: 'Intégrer les sondes de surveillance thermique sans fil VisiTact sur les postes de tranchage et corréler les données avec les dossiers de validation de DLC dans VisiPLM.',
    cellarSparqlMetadata: {
      workId: 'cellar:02005R2073-20241101',
      eurovocCodes: ['1855 bactérie', '2737 sécurité des aliments', '1598 hygiène des aliments', '2733 produit laitier'],
      directoryCodes: ['03.50.20 Hygiène alimentaire', '15.20 Santé publique']
    }
  },

  // ─── 4. FRANCE / LÉGIFRANCE : DÉCRET N° 2024-171 RELATIF À L'ORIGINE DES INGRÉDIENTS (AGEC / RESTAURATION) ───
  {
    id: 'fr-decret-origine-2024',
    title: 'Décret n° 2024-171 relatif à l\'indication de l\'origine des viandes et ingrédients primaires dans la restauration et les produits préparés',
    legalReference: 'Décret n° 2024-171 du 4 mars 2024 (Code de la consommation)',
    celexOrNor: 'NOR: ECOC2331589D',
    jurisdiction: 'FR',
    jurisdictionLabel: 'France',
    officialSource: 'Légifrance / PISTE',
    officialSourceBadge: 'Légifrance API PISTE (DILA)',
    sourceUrl: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049242981',
    consolidatedUrl: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000049244012',
    domainId: 'labeling',
    domainName: 'Étiquetage & information du consommateur',
    subDomain: 'Origine des ingrédients',
    status: 'EN VIGUEUR',
    statusBadgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    datePublication: '06/03/2024',
    dateEntreeVigueur: '07/03/2024',
    dateApplication: '01/03/2025',
    isApplied: true,
    modifiedArticles: ['Articles R. 412-43-1 et R. 412-43-2 du Code de la consommation', 'Article L. 412-4 du Code rural'],
    articlesImpactSummary: 'Obligation d\'afficher le pays d\'élevage et d\'abattage des viandes bovines, porcines, ovines et de volailles incorporées dans les plats cuisinés vendus en restauration et collectivités.',
    impactLevel: 'ÉLEVÉ',
    affectedSectors: ['Plats cuisinés surgelés & frais', 'Conserveries de viande', 'Fournisseurs de la restauration hors foyer (RHF)'],
    affectedProducts: ['Hachis parmentier', 'Lasagnes et pâtes farcies', 'Terrines et rillettes', 'Cordons bleus et nuggets'],
    previousRequirements: 'Indication obligatoire limitée aux viandes crues non transformées sous le décret de 2002.',
    newRequirements: 'Extension formelle aux viandes utilisées comme ingrédients dans toutes les préparations alimentaires avec contrôle d\'authenticité par la DGCCRF.',
    visipilotSoftwareModule: 'VisiPLM',
    visipilotActionPlan: 'Configurer la génération automatique des mentions d\'origine sur les fiches techniques clients et étiquettes via le module recette VisiPLM.',
    pisteMetadata: {
      nor: 'ECOC2331589D',
      nature: 'Décret en Conseil d\'État',
      ministere: 'Ministère de l\'Économie, des Finances et de la Souveraineté industrielle et numérique'
    }
  },

  // ─── 5. FRANCE / LÉGIFRANCE : ARRÊTÉ DU 21 DÉCEMBRE 2009 MODIFIÉ (PAQUET HYGIÈNE / AGRÉMENTS) ───
  {
    id: 'fr-arrete-hygiene-2009-base',
    title: 'Arrêté du 21 décembre 2009 relatif aux règles sanitaires applicables aux activités de commerce de détail et d\'entreposage de produits d\'origine animale (DGAL)',
    legalReference: 'Arrêté du 21 décembre 2009 (DGAL)',
    celexOrNor: 'NOR: AGRL0915885A',
    jurisdiction: 'FR',
    jurisdictionLabel: 'France',
    officialSource: 'Légifrance / PISTE',
    officialSourceBadge: 'Légifrance API PISTE (DILA)',
    sourceUrl: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000021574488',
    domainId: 'controls',
    domainName: 'Contrôles officiels & opérateurs',
    subDomain: 'Agréments sanitaires',
    status: 'EN VIGUEUR',
    statusBadgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    datePublication: '31/12/2009',
    dateEntreeVigueur: '31/12/2009',
    dateApplication: '01/09/2010',
    isApplied: true,
    modifiedArticles: ['Règles d\'hygiène des locaux et des équipements', 'Températures de conservation et enregistrement des relevés', 'Dérogations à l\'agrément pour le commerce de détail vers le consommateur final'],
    articlesImpactSummary: 'Règles sanitaires applicables aux commerces de détail et à l\'entreposage de produits d\'origine animale : conditions de température, hygiène, traçabilité et dérogations détaillées à l\'agrément sanitaire CE pour le détail vers le consommateur.',
    impactLevel: 'ÉLEVÉ',
    affectedSectors: ['Boucherie & Charcuterie artisanale', 'Plats cuisinés livrés', 'Plateformes logistiques réfrigérées'],
    affectedProducts: ['Viandes hachées fraîches', 'Pâtisseries fraîches à la crème', 'Plats du jour sous vide'],
    previousRequirements: 'Avant 2009 : arrêté du 31 décembre 2004 et règles moins structurées sur les dérogations du commerce de détail.',
    newRequirements: 'Températures de conservation codifiées, enregistrement des relevés et dérogations au besoin d\'agrément CE pour le commerce de détail vers le consommateur final.',
    visipilotSoftwareModule: 'VISIcat',
    visipilotActionPlan: 'Alimenter automatiquement le registre des non-conformités VISIcat en cas de rupture de chaîne du froid détectée par les capteurs IoT VisiTact.',
    pisteMetadata: {
      nor: 'AGRL0915885A',
      nature: 'Arrêté ministériel',
      ministere: 'Ministère de l\'Agriculture et de la Souveraineté Alimentaire'
    }
  },

  // ─── 6. UE : RÈGLEMENT CONTRÔLES OFFICIELS (UE) 2017/625 (CONSOLIDÉ / NOUVELLES MODALITÉS IMSOC) ───
  {
    id: 'reg-controls-2017-625-base',
    title: 'Règlement (UE) 2017/625 concernant les contrôles officiels et les autres activités officielles dans le secteur agroalimentaire (Règlement « Contrôles Officiels » - OCR)',
    legalReference: 'Règlement (UE) 2017/625 du Parlement européen et du Conseil',
    celexOrNor: 'CELEX: 32017R0625',
    jurisdiction: 'UE',
    jurisdictionLabel: 'Union Européenne',
    officialSource: 'EUR-Lex / Cellar',
    officialSourceBadge: 'EUR-Lex Cellar (REST/Atom)',
    sourceUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32017R0625',
    consolidatedUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32017R0625',
    domainId: 'controls',
    domainName: 'Contrôles officiels & opérateurs',
    subDomain: 'Contrôles officiels (2017/625)',
    status: 'EN VIGUEUR',
    statusBadgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    datePublication: '14/04/2017',
    dateEntreeVigueur: '04/05/2017',
    dateApplication: '14/05/2017',
    isApplied: true,
    modifiedArticles: ['Article 4 (Planification des contrôles officiels fondée sur le risque)', 'Article 131 (Certification officielle et interopérabilité TRACES NT / RASFF)', 'Articles 137 et suivants (Sanctions administratives)'],
    articlesImpactSummary: 'Cadre unique des contrôles officiels sur toute la chaîne alimentaire : fréquence des contrôles fondée sur le risque, dématérialisation des échanges (TRACES NT) et régime de sanctions administratives efficaces, proportionnées et dissuasives.',
    impactLevel: 'ÉLEVÉ',
    affectedSectors: ['Importateurs / Exportateurs', 'Grossistes & Centrales d\'achat', 'Tous transformateurs agroalimentaires'],
    affectedProducts: ['Tous produits agricoles et denrées importées'],
    previousRequirements: 'Avant le 14/05/2017 : Directive 2008/104/CE (contrôles officiels) et pratiques nationales hétérogènes.',
    newRequirements: 'Montée en charge continue de la dématérialisation (TRACES NT, certification officielle électronique) et intégration avec le système d\'alerte rapide RASFF.',
    visipilotSoftwareModule: 'VISITrack',
    visipilotActionPlan: 'Interfacer les numéros de certificats sanitaires TRACES-NT dans VISITrack pour faciliter les audits inopinés des inspecteurs de la DGAL.',
    cellarSparqlMetadata: {
      workId: 'cellar:02017R0625-20250301',
      eurovocCodes: ['1598 hygiène des aliments', '2737 sécurité des aliments', '192 inspection sanitaire', '2731 produit agricole'],
      directoryCodes: ['03.50.10 Droit alimentaire', '03.50.30 Contrôles vétérinaires et zootechniques']
    }
  },

  // ─── 7. UE : RÈGLEMENT DÉFORESTATION (UE) 2023/1115 (EUDR) — APPLICATION REPORTÉE & EXIGENCES DE GÉOLOCALISATION ───
  {
    id: 'reg-eudr-2023-1115-mod',
    title: 'Règlement (UE) 2023/1115 relatif à la mise à disposition sur le marché de l\'Union de certains produits associés à la déforestation (EUDR)',
    legalReference: 'Règlement (UE) 2023/1115 modifié par le Règlement (UE) 2024/3142',
    celexOrNor: 'CELEX: 32024R3142',
    jurisdiction: 'UE',
    jurisdictionLabel: 'Union Européenne',
    officialSource: 'EUR-Lex / Cellar',
    officialSourceBadge: 'EUR-Lex Cellar (REST/Atom)',
    sourceUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R3142',
    consolidatedUrl: 'https://eur-lex.europa.eu/eli/reg/2023/1115/oj',
    domainId: 'sustainability',
    domainName: 'Durabilité & environnement',
    subDomain: 'Règlement Déforestation (EUDR)',
    status: 'MODIFIÉ',
    statusBadgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    datePublication: '20/12/2024',
    dateEntreeVigueur: '21/12/2024',
    dateApplication: '30/12/2025',
    isApplied: true,
    modifiedArticles: ['Article 44 (Entrée en vigueur et application reportée)', 'Articles 9 à 13 (Diligence raisonnée, géolocalisation des parcelles et déclarations DDS)'],
    articlesImpactSummary: 'Report au 30 décembre 2025 pour les grands groupes et 30 juin 2026 pour les PME. Obligation de fournir les coordonnées GPS polygonales des parcelles pour le café, cacao, soja, huile de palme, bovins.',
    impactLevel: 'CRITIQUE',
    affectedSectors: ['Chocolaterie & Cacao', 'Torréfaction & Café', 'Huiles végétales & Margarines', 'Nutrition animale (soja)'],
    affectedProducts: ['Fèves et tourteaux de cacao', 'Grains de café vert', 'Huile de palme raffinée', 'Tourteaux de soja'],
    previousRequirements: 'Date initiale au 30 décembre 2024 sans portail européen unifié opérationnel.',
    newRequirements: 'Connexion obligatoire au portail de diligence raisonnée de la Commission européenne avec validation de non-déforestation post-31 décembre 2020.',
    visipilotSoftwareModule: 'VISITrack',
    visipilotActionPlan: 'Activer le module de traçabilité cartographique GPS dans VISITrack pour collecter automatiquement les coordonnées polygonales des plantations auprès des coopératives exportatrices.',
    cellarSparqlMetadata: {
      workId: 'cellar:5a9e34bc-32024R3142',
      eurovocCodes: ['1590 protection de l\'environnement', '2731 produit agricole', '1612 déboisement', '2737 sécurité des aliments'],
      directoryCodes: ['15.10.30 Protection de la nature', '03.50.10 Droit alimentaire']
    }
  },

  // ─── 8. FRANCE / LÉGIFRANCE : LOI AGEC ART. 13 (ALLÉGATIONS ENVIRONNEMENTALES & SUBSTANCES DANGEREUSES) ───
  {
    id: 'fr-loi-agec-art-13',
    title: 'Décret d\'application n° 2022-748 pris en application de l\'article 13 de la loi n° 2020-105 (AGEC) — Fiche produit des qualités et caractéristiques environnementales',
    legalReference: 'Code de l\'environnement, Article R. 541-220 et suivants',
    celexOrNor: 'NOR: TREP2200888D',
    jurisdiction: 'FR',
    jurisdictionLabel: 'France',
    officialSource: 'Légifrance / PISTE',
    officialSourceBadge: 'Légifrance API PISTE (DILA)',
    sourceUrl: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000045696515',
    consolidatedUrl: 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000045697800',
    domainId: 'sustainability',
    domainName: 'Durabilité & environnement',
    subDomain: 'Économie circulaire & AGEC',
    status: 'EN VIGUEUR',
    statusBadgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    datePublication: '30/04/2022',
    dateEntreeVigueur: '01/01/2023',
    dateApplication: '01/01/2025',
    isApplied: true,
    modifiedArticles: ['Article R. 541-221 (Seuils d\'assujettissement CA et unités)', 'Article R. 541-222 (Interdiction des mentions « biodégradable » et « respectueux de l\'environnement »)'],
    articlesImpactSummary: 'Interdiction absolue des allégations génériques trompeuses sur les emballages alimentaires et obligation de publication dématérialisée de la présence de substances dangereuses (REACH SVHC > 0,1%).',
    impactLevel: 'MODÉRÉ',
    affectedSectors: ['Tous fabricants de produits de grande consommation (PGC)'],
    affectedProducts: ['Tous emballages préemballés alimentaires vendus en GMS'],
    previousRequirements: 'Mentions marketing libres avec justificatifs partiels.',
    newRequirements: 'Interdiction de la mention « biodégradable ». Fiche environnementale dématérialisée obligatoire accessible en libre accès en ligne.',
    visipilotSoftwareModule: 'VisiVal',
    visipilotActionPlan: 'Valider la conformité des maquettes marketing et mentions packaging dans le module de conformité réglementaire VisiVal avant impression.',
    pisteMetadata: {
      nor: 'TREP2200888D',
      nature: 'Décret en Conseil d\'État',
      ministere: 'Ministère de la Transition écologique et de la Cohésion des territoires'
    }
  },

  // ─── 9. UE : GENERAL FOOD LAW (RÈGLEMENT CE 178/2002) — CADRE FONDAMENTAL CONSOLIDÉ ───
  {
    id: 'reg-general-food-law-178-2002',
    title: 'Règlement (CE) n° 178/2002 établissant les principes généraux et les prescriptions générales de la législation alimentaire (General Food Law)',
    legalReference: 'Règlement (CE) n° 178/2002 consolidé (EFSA & Alerte rapide)',
    celexOrNor: 'CELEX: 02002R0178-20220701',
    jurisdiction: 'UE',
    jurisdictionLabel: 'Union Européenne',
    officialSource: 'EUR-Lex / Cellar',
    officialSourceBadge: 'EUR-Lex Consolidé',
    sourceUrl: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:02002R0178-20220701',
    consolidatedUrl: 'https://eur-lex.europa.eu/eli/reg/2002/178/oj',
    domainId: 'general_law',
    domainName: 'Droit général & responsabilité',
    subDomain: 'General Food Law (178/2002)',
    status: 'EN VIGUEUR',
    statusBadgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    datePublication: '01/02/2002',
    dateEntreeVigueur: '21/02/2002',
    dateApplication: '01/01/2005',
    isApplied: true,
    modifiedArticles: ['Article 14 (Prescriptions relatives à la sécurité des denrées)', 'Article 18 (Principe de traçabilité d\'un pas en amont et d\'un pas en aval)', 'Article 19 (Obligation de retrait et rappel immédiat)'],
    articlesImpactSummary: 'Socle juridique suprême : obligation de résultat de sécurité sanitaire pour l\'exploitant, traçabilité ascendante et descendante sous 24h, et déclaration sans délai aux autorités compétentes.',
    impactLevel: 'CRITIQUE',
    affectedSectors: ['Tous les exploitants du secteur agroalimentaire'],
    affectedProducts: ['Toutes denrées destinées à la consommation humaine'],
    previousRequirements: 'Directives sectorielles morcelées sans responsabilité explicite unifiée.',
    newRequirements: 'Principe de précaution opposable, création de l\'EFSA et du système RASFF, responsabilité exclusive de l\'exploitant.',
    visipilotSoftwareModule: 'VISIcat',
    visipilotActionPlan: 'Automatiser la génération du dossier de retrait/rappel et de notification aux autorités sanitaires dans VISIcat en cas d\'autocontrôle positif non libéré.',
    cellarSparqlMetadata: {
      workId: 'cellar:02002R0178-20220701',
      eurovocCodes: ['2737 sécurité des aliments', '03.50 droit alimentaire', '1598 hygiène des aliments', '192 inspection sanitaire'],
      directoryCodes: ['03.50.10 Droit alimentaire', '15.20 Santé publique']
    }
  }
];

export interface IngestionPipelineArchitecture {
  id: string;
  name: string;
  jurisdiction: 'UE' | 'FR';
  officialAgency: string;
  authMethod: string;
  endpoints: {
    protocol: 'REST' | 'SPARQL' | 'ATOM/RSS' | 'OAuth2';
    url: string;
    description: string;
    format: string;
  }[];
  syncStrategy: string;
  technicalCapabilities: string[];
}

export const INGESTION_PIPELINES: IngestionPipelineArchitecture[] = [
  {
    id: 'cellar-eurlex',
    name: 'EUR-Lex / Cellar — Office des Publications de l\'Union Européenne',
    jurisdiction: 'UE',
    officialAgency: 'Publications Office of the European Union (OPOCE)',
    authMethod: 'Accès libre Open Data / SPARQL Endpoint public & Flux ATOM sans jeton',
    endpoints: [
      {
        protocol: 'ATOM/RSS',
        url: 'https://eur-lex.europa.eu/rss/daily_oj_l.xml',
        description: 'Flux ATOM quotidien du Journal Officiel de l\'Union Européenne (Série L - Législation)',
        format: 'XML / Atom 1.0'
      },
      {
        protocol: 'SPARQL',
        url: 'https://publications.europa.eu/webapi/rdf/sparql',
        description: 'Point d\'accès SPARQL triplestore Cellar (interrogation sémantique des métadonnées CELEX, dates et relations modificatives)',
        format: 'SPARQL 1.1 Query / JSON-LD'
      },
      {
        protocol: 'REST',
        url: 'https://eur-lex.europa.eu/api/v1/work/{celex}',
        description: 'API REST d\'ingestion des textes intégraux, versions consolidées et notices documentaires',
        format: 'REST JSON / XML Formex'
      }
    ],
    syncStrategy: 'Ingestion par scrutation continue du flux ATOM (toutes les 15 minutes) + Requête SPARQL différentielle quotidienne pour cartographier les actes modificatifs (amending acts).',
    technicalCapabilities: [
      'Détection automatique de tout acte nouveau dans les domaines Eurovoc 03.50 (Alimentaire) et 15.10 (Environnement)',
      'Identification instantanée du statut : NOUVEAU vs MODIFIÉ vs CONSOLIDÉ',
      'Extraction des articles précis et annexes touchés par les règlements d\'exécution',
      'Calcul automatique du compte à rebours avant la date d\'application effective'
    ]
  },
  {
    id: 'piste-legifrance',
    name: 'Légifrance / PISTE — Direction de l\'Information Légale et Administrative (DILA)',
    jurisdiction: 'FR',
    officialAgency: 'DILA — Services du Premier Ministre (France)',
    authMethod: 'OAuth2 Client Credentials via plateforme interministérielle PISTE (piste.gouv.fr)',
    endpoints: [
      {
        protocol: 'OAuth2',
        url: 'https://oauth.piste.gouv.fr/api/oauth/token',
        description: 'Génération du jeton JWT Bearer sécurisé pour l\'accès aux fonds de production',
        format: 'OAuth2 JSON Token'
      },
      {
        protocol: 'REST',
        url: 'https://api.piste.gouv.fr/dila/legifrance/lf-engine-app/consult/getArticle',
        description: 'Recherche et extraction du texte consolidé des articles du Code rural et du Code de la consommation',
        format: 'REST JSON'
      },
      {
        protocol: 'REST',
        url: 'https://api.piste.gouv.fr/dila/legifrance/lf-engine-app/suggest/search',
        description: 'Interrogation plein texte des parutions quotidiennes au Journal Officiel de la République Française (JORF)',
        format: 'REST JSON'
      }
    ],
    syncStrategy: 'Synchronisation quotidienne à 06h00 UTC dès publication du JORF officiel par la DILA + rafraîchissement hebdomadaire des textes consolidés des codes juridiques français.',
    technicalCapabilities: [
      'Filtrage par NOR ministériel (Agriculture, Économie, Santé, Transition écologique)',
      'Suivi des arrêtés techniques DGAL, décrets d\'application et ordonnances',
      'Vérification de l\'état de vigueur : EN VIGUEUR / ABROGÉ / MODIFIÉ',
      'Traçabilité intégrale vers le lien pérenne officiel Légifrance'
    ]
  }
];
