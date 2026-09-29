export interface RegulatorySource {
  id: string;
  name: string;
  organization: string;
  pays: 'UE' | 'FR' | 'US' | 'UK' | 'DE' | 'CA' | 'INT';
  paysLabel: string;
  flag: string;
  type: 'Journal Officiel' | 'Alerte & Rappel' | 'Avis Scientifique' | 'Standard & Norme' | 'Base Légale';
  category: string;
  description: string;
  url: string;
  frequency: string;
  regulationsCovered: string[];
  legalWeight: 'Obligation légale directe' | 'Avis scientifique de référence' | 'Alerte sanitaire immédiate' | 'Standard de certification auditée';
  activeCount?: number;
  status: 'ONLINE' | 'SYNCED';
  lastSync: string;
  isAvailableInApp: boolean; // Indique clairement si la source est directement connectée/disponible dans l'outil
  provenance: string; // Origine exacte des données (API officielle, flux RSS direct, journal officiel en direct, etc.)
  coverageLevel: 'Intégrale' | 'En cours d\'intégration' | 'Planifiée Q4 2026';
  level?: 'Niveau 1 — Textes Officiels' | 'Niveau 2 — Intelligence & Impacts' | 'Niveau 3 — Risques & Alertes Sanitaires';
}

export const REGULATORY_SOURCES: RegulatorySource[] = [
  // ─── 1. EUR-LEX : SOURCE PRINCIPALE DU DROIT DE L'UE (NIVEAU 1) ───
  {
    id: 'joue-eurlex',
    name: 'EUR-Lex — Droit officiel de l\'Union Européenne & JOUE',
    organization: 'Union Européenne (Commission, Conseil & Parlement)',
    pays: 'UE',
    paysLabel: 'Union Européenne',
    flag: '🇪🇺',
    type: 'Journal Officiel',
    category: 'Réglementation Générale, Hygiène & Contaminants',
    description: 'Source de référence pour le droit de l\'UE : règlements, directives, décisions, actes délégués et d\'exécution, Journal officiel (séries L), et versions juridiques consolidées.',
    url: 'https://eur-lex.europa.eu',
    frequency: 'Quotidien (flux automatisé)',
    regulationsCovered: [
      'Règlement (CE) 178/2002 (General Food Law)',
      'Règlement (UE) 2023/915 (Teneurs maximales contaminants)',
      'Paquet Hygiène (852/2004, 853/2004, 2073/2005)',
      'Règlement (UE) 1169/2011 (INCO Étiquetage)',
      'Règlement (CE) 1935/2004 (Matériaux au contact FCM)'
    ],
    legalWeight: 'Obligation légale directe',
    status: 'ONLINE',
    lastSync: 'Il y a 4 min',
    isAvailableInApp: true,
    provenance: 'Connecteur API EUR-Lex REST officiel & flux RSS quotidien des séries L (Législation)',
    coverageLevel: 'Intégrale',
    level: 'Niveau 1 — Textes Officiels'
  },

  // ─── 2. CELLAR : DÉPÔT CENTRAL DES DONNÉES DE L'OFFICE DES PUBLICATIONS DE L'UE (NIVEAU 1) ───
  {
    id: 'cellar-publications',
    name: 'EUR-Lex / Cellar — Ingestion & Métadonnées Automatisées (REST, SPARQL, RSS/Atom)',
    organization: 'Office des publications de l\'Union Européenne (OPOCE)',
    pays: 'UE',
    paysLabel: 'Union Européenne',
    flag: '🇪🇺',
    type: 'Base Légale',
    category: 'Ingestion Technique & Détection des Modifications',
    description: 'Dépôt sémantique central de l\'UE au cœur du moteur d\'ingestion : flux RSS/ATOM, API REST et requêtes SPARQL pour détecter en continu les nouveaux textes, textes modifiés et métadonnées sans scraping.',
    url: 'https://op.europa.eu/en/web/cellar',
    frequency: 'Temps réel (Flux Atom/SPARQL)',
    regulationsCovered: [
      'Flux RSS/ATOM des actes adoptés et modifiés',
      'Point de terminaison SPARQL des métadonnées juridiques (EuroVoc)',
      'Versions consolidées et historique des modifications d\'articles',
      'Actes modificatifs et rectificatifs'
    ],
    legalWeight: 'Obligation légale directe',
    status: 'ONLINE',
    lastSync: 'Il y a 2 min',
    isAvailableInApp: true,
    provenance: 'API SPARQL Cellar (sparql.cellar.publications.europa.eu) & flux ATOM sémantiques',
    coverageLevel: 'Intégrale',
    level: 'Niveau 1 — Textes Officiels'
  },

  // ─── 3. LÉGIFRANCE & API PISTE (DILA) : SOURCE OFFICIELLE FRANÇAISE (NIVEAU 1) ───
  {
    id: 'legifrance-piste',
    name: 'Légifrance & API PISTE (DILA) — Droit Français & Textes Consolidés',
    organization: 'Direction de l\'information légale et administrative (DILA / Premier Ministre)',
    pays: 'FR',
    paysLabel: 'France',
    flag: '🇫🇷',
    type: 'Journal Officiel',
    category: 'Textes Juridiques Français & Décrets Ministériels',
    description: 'Source officielle française pour les textes juridiques. API officielle PISTE donnant accès aux données de production : Journal officiel (JORF), textes consolidés, circulaires, décrets, arrêtés et codes.',
    url: 'https://www.legifrance.gouv.fr',
    frequency: 'Quotidien (flux API PISTE OAuth2)',
    regulationsCovered: [
      'Code de la consommation & Code rural et de la pêche maritime',
      'Arrêtés ministériels microbiologiques et critères d\'hygiène nationaux',
      'Décrets relatifs à l\'information des consommateurs et étiquetage',
      'Circulaires, arrêtés préfectoraux et sanctions applicables'
    ],
    legalWeight: 'Obligation légale directe',
    status: 'ONLINE',
    lastSync: 'Il y a 6 min',
    isAvailableInApp: true,
    provenance: 'API stable Légifrance via PISTE (DILA) avec filtres de fonds juridiques officiels',
    coverageLevel: 'Intégrale',
    level: 'Niveau 1 — Textes Officiels'
  },

  // ─── 4. COMMISSION EUROPÉENNE DG SANTE : FOOD LAW CORPUS (NIVEAU 1) ───
  {
    id: 'dg-sante-foodlaw',
    name: 'Commission Européenne — DG SANTE (Food Safety & Hygiene Legislation)',
    organization: 'Direction Générale de la Santé et de la Sécurité Alimentaire (DG SANTE)',
    pays: 'UE',
    paysLabel: 'Union Européenne',
    flag: '🇪🇺',
    type: 'Base Légale',
    category: 'Food Law Européenne & Comités Réglementaires',
    description: 'Corpus officiel de la réglementation alimentaire européenne : General Food Law (178/2002), Hygiène (852/853/2073), Contaminants (2023/915), Matériaux au contact (1935/2004) et Contrôles officiels (2017/625).',
    url: 'https://ec.europa.eu/food/safety_en',
    frequency: 'Quotidien',
    regulationsCovered: [
      'General Food Law (Règlement CE 178/2002)',
      'Hygiène alimentaire (852/2004, 853/2004, 2073/2005)',
      'Contaminants chimiques et mycotoxines (2023/915)',
      'Matériaux de contact (1935/2004) et Contrôles officiels (2017/625)'
    ],
    legalWeight: 'Obligation légale directe',
    status: 'ONLINE',
    lastSync: 'Il y a 10 min',
    isAvailableInApp: true,
    provenance: 'Pages réglementaires officielles DG SANTE & registre des comités permanents (ScoPAFF)',
    coverageLevel: 'Intégrale',
    level: 'Niveau 1 — Textes Officiels'
  },

  // ─── 5. PPWR : EMBALLAGES ET DÉCHETS D'EMBALLAGES (NIVEAU 1) ───
  {
    id: 'ppwr-packaging',
    name: 'PPWR (Règlement UE 2025/40) & Matériaux au Contact (FCM)',
    organization: 'Union Européenne (EUR-Lex / Cellar)',
    pays: 'UE',
    paysLabel: 'Union Européenne',
    flag: '🇪🇺',
    type: 'Journal Officiel',
    category: 'Emballages, Plastiques & Économie Circulaire',
    description: 'Branche dédiée à la réglementation emballages : Règlement (UE) 2025/40 (PPWR), matériaux au contact des aliments (1935/2004, 10/2011), recyclabilité obligatoire, teneurs en plastique recyclé et PFAS.',
    url: 'https://eur-lex.europa.eu/eli/reg/2025/40/oj',
    frequency: 'Continu',
    regulationsCovered: [
      'Règlement (UE) 2025/40 relatif aux emballages et déchets d\'emballages',
      'Interdiction des PFAS dans les emballages alimentaires au-delà des seuils',
      'Teneurs minimales obligatoires en plastique recyclé d\'ici 2030',
      'Objectifs de réduction des déchets et de réemploi'
    ],
    legalWeight: 'Obligation légale directe',
    status: 'ONLINE',
    lastSync: 'Il y a 8 min',
    isAvailableInApp: true,
    provenance: 'EUR-Lex CELEX 32025R0040 & Publications Office Cellar REST',
    coverageLevel: 'Intégrale',
    level: 'Niveau 1 — Textes Officiels'
  },

  // ─── 6. DURABILITÉ & ENVIRONNEMENT (NIVEAU 1) ───
  {
    id: 'sustainability-environment',
    name: 'Sustainability & Environment (EUDR, PFAS, AGEC & Économie Circulaire)',
    organization: 'Union Européenne & France (DG ENV / DILA)',
    pays: 'UE',
    paysLabel: 'UE / France',
    flag: '🌱',
    type: 'Base Légale',
    category: 'Durabilité, Déforestation & Substances Chimiques',
    description: 'Grand domaine environnemental transversal : Règlement Déforestation (EUDR 2023/1115), restriction universelle PFAS (REACH), loi française AGEC, gaspillage alimentaire et allégations vertes (Green Claims).',
    url: 'https://environment.ec.europa.eu',
    frequency: 'Hebdomadaire',
    regulationsCovered: [
      'Règlement (UE) 2023/1115 (Zéro Déforestation - EUDR)',
      'Règlement REACH (Restrictions PFAS & perturbateurs endocriniens)',
      'Loi AGEC (Anti-gaspillage pour une économie circulaire)',
      'Directive sur les allégations environnementales (Green Claims)'
    ],
    legalWeight: 'Obligation légale directe',
    status: 'ONLINE',
    lastSync: 'Il y a 15 min',
    isAvailableInApp: true,
    provenance: 'EUR-Lex séries L & Journal Officiel de la République Française (Légifrance)',
    coverageLevel: 'Intégrale',
    level: 'Niveau 1 — Textes Officiels'
  },

  // ─── 7. DGAL : INSTRUCTIONS TECHNIQUES & CONTRÔLES FRANCE (NIVEAU 1) ───
  {
    id: 'dgal-bulletins',
    name: 'DGAL — Direction Générale de l\'Alimentation (France)',
    organization: 'Ministère de l\'Agriculture et de la Souveraineté Alimentaire',
    pays: 'FR',
    paysLabel: 'France',
    flag: '🇫🇷',
    type: 'Base Légale',
    category: 'Contrôles Officiels & Instructions Techniques',
    description: 'Instructions techniques ministérielles (Notes de service DGAL), plans de surveillance nationaux, guides de bonnes pratiques d\'hygiène (GBPH) et agréments sanitaires CE.',
    url: 'https://agriculture.gouv.fr/alimentation',
    frequency: 'Bi-hebdomadaire',
    regulationsCovered: ['Arrêté ministériel du 21 décembre 2009', 'Paquet Hygiène (Règlements 852/2004 et 853/2004)', 'Notes de service DGAL/SDSSA'],
    legalWeight: 'Obligation légale directe',
    status: 'ONLINE',
    lastSync: 'Il y a 14 min',
    isAvailableInApp: true,
    provenance: 'Bulletin officiel du Ministère de l\'Agriculture (BOMA) & flux téléservices DGAL/SDSSA',
    coverageLevel: 'Intégrale',
    level: 'Niveau 1 — Textes Officiels'
  },

  // ─── 8. RASFF : RISK INTELLIGENCE & ALERTES SANITAIRES (NIVEAU 3) ───
  {
    id: 'rasff-portal',
    name: 'RASFF Portal — Rapid Alert System for Food and Feed',
    organization: 'DG SANTE — Commission Européenne',
    pays: 'UE',
    paysLabel: 'Union Européenne',
    flag: '⚠️',
    type: 'Alerte & Rappel',
    category: 'Risk Intelligence / Notifications Sanitaires Rapides',
    description: 'Réseau européen d\'échange rapide d\'informations sur les risques liés aux denrées et aliments pour animaux (rejets frontaliers, toxi-infections, fraudes). Bien séparé du corpus juridique pur.',
    url: 'https://webgate.ec.europa.eu/rasff-window/screen/search',
    frequency: 'Temps réel (< 15 min)',
    regulationsCovered: ['Règlement (CE) 178/2002 art. 50 (Système d\'alerte rapide)', 'Rejets aux postes de contrôle frontaliers (PCF)', 'Notifications de retraits du marché'],
    legalWeight: 'Alerte sanitaire immédiate',
    status: 'ONLINE',
    lastSync: 'Il y a 2 min',
    isAvailableInApp: true,
    provenance: 'API ouverte DG SANTE European Commission (flux temps réel notifications sanitaires)',
    coverageLevel: 'Intégrale',
    level: 'Niveau 3 — Risques & Alertes Sanitaires'
  },

  // ─── 9. RAPPELCONSO : FLUX DES RAPPELS CONSOMMATEURS FRANCE (NIVEAU 3) ───
  {
    id: 'rappel-conso',
    name: 'RappelConso — Alertes & Retraits Sanitaires Officiels (France)',
    organization: 'Ministères de l\'Agriculture, de l\'Économie et de la Santé',
    pays: 'FR',
    paysLabel: 'France',
    flag: '🇫🇷',
    type: 'Alerte & Rappel',
    category: 'Risk Intelligence / Retraits & Rappels Consommateurs',
    description: 'Portail public officiel répertoriant tous les avis de rappel de denrées alimentaires déclarés obligatoirement par les exploitants du secteur agroalimentaire en France.',
    url: 'https://rappel.conso.gouv.fr',
    frequency: 'Temps réel (API ouverte)',
    regulationsCovered: ['Article L. 423-3 du Code de la consommation', 'Obligations de déclaration dématérialisée', 'Gestion des crises sanitaires'],
    legalWeight: 'Alerte sanitaire immédiate',
    status: 'ONLINE',
    lastSync: 'Il y a 1 min',
    isAvailableInApp: true,
    provenance: 'API ouverte data.economie.gouv.fr / RappelConso v2 (synchronisation continue)',
    coverageLevel: 'Intégrale',
    level: 'Niveau 3 — Risques & Alertes Sanitaires'
  },

  // ─── 10. EFSA : AVIS SCIENTIFIQUES & SEUILS TOXICOLOGIQUES (NIVEAU 3) ───
  {
    id: 'efsa-opinions',
    name: 'EFSA Journal & Scientific Opinions (Avis Scientifiques)',
    organization: 'Autorité Européenne de Sécurité des Aliments (EFSA)',
    pays: 'UE',
    paysLabel: 'Union Européenne',
    flag: '🇪🇺',
    type: 'Avis Scientifique',
    category: 'Risk Intelligence / Évaluation des Risques Scientifiques',
    description: 'Avis scientifiques indépendants servant de fondement aux révisions des seuils réglementaires (LMR pesticides, PFAS, additifs, néonicotinoïdes, mycotoxines).',
    url: 'https://www.efsa.europa.eu',
    frequency: 'Hebdomadaire',
    regulationsCovered: ['Doses journalières tolérables (DJT)', 'Évaluation des nouveaux aliments (Novel Food)', 'Avis réévaluation additifs (E250, E171...)'],
    legalWeight: 'Avis scientifique de référence',
    status: 'ONLINE',
    lastSync: 'Il y a 28 min',
    isAvailableInApp: true,
    provenance: 'Flux direct EFSA Open Analytics & Publications Wiley Online Library',
    coverageLevel: 'Intégrale',
    level: 'Niveau 3 — Risques & Alertes Sanitaires'
  },

  // ─── 11. ANSES : EXPERTISE SCIENTIFIQUE FRANCE (NIVEAU 3) ───
  {
    id: 'anses-avis',
    name: 'ANSES — Avis et Rapports d\'expertise sanitaire (France)',
    organization: 'Agence nationale de sécurité sanitaire de l\'alimentation (ANSES)',
    pays: 'FR',
    paysLabel: 'France',
    flag: '🇫🇷',
    type: 'Avis Scientifique',
    category: 'Risk Intelligence / Risques Microbiologiques & Émergents',
    description: 'Évaluations des risques microbiologiques (Listeria, Salmonella, E. coli STEC), contaminants chimiques dans l\'alimentation infantile, et risques sanitaires liés aux emballages.',
    url: 'https://www.anses.fr',
    frequency: 'Hebdomadaire',
    regulationsCovered: ['Avis d\'expertise collective', 'Évaluation des couples produit-procédé', 'Surveillance des toxi-infections alimentaires collectives (TIAC)'],
    legalWeight: 'Avis scientifique de référence',
    status: 'ONLINE',
    lastSync: 'Il y a 45 min',
    isAvailableInApp: true,
    provenance: 'Registre public des avis et publications scientifiques ANSES (opendata.gouv.fr)',
    coverageLevel: 'Intégrale',
    level: 'Niveau 3 — Risques & Alertes Sanitaires'
  },
  {
    id: 'fda-food',
    name: 'US FDA — Center for Food Safety and Applied Nutrition (CFSAN)',
    organization: 'U.S. Food and Drug Administration',
    pays: 'US',
    paysLabel: 'États-Unis',
    flag: '🇺🇸',
    type: 'Journal Officiel',
    category: 'Réglementation Export US & Traçabilité FSMA',
    description: 'Règles fédérales contraignantes (21 CFR), FSMA 204 Food Traceability Rule, Food Defense, enregistrement des sites de production (Bioterrorism Act) et Preventive Controls.',
    url: 'https://www.fda.gov/food',
    frequency: 'Quotidien',
    regulationsCovered: ['21 CFR Part 117 (FSMA PCHF)', 'FSMA Section 204 (Traceability Records)', 'FALCPA & FASTER Act (Allergens)'],
    legalWeight: 'Obligation légale directe',
    status: 'ONLINE',
    lastSync: 'Il y a 12 min',
    isAvailableInApp: true,
    provenance: 'API openFDA (food/enforcement & regulations) & US Federal Register API',
    coverageLevel: 'Intégrale'
  },
  {
    id: 'usda-fsis',
    name: 'USDA FSIS — Food Safety and Inspection Service',
    organization: 'United States Department of Agriculture',
    pays: 'US',
    paysLabel: 'États-Unis',
    flag: '🇺🇸',
    type: 'Journal Officiel',
    category: 'Viandes, Volailles & Produits Carnés Export',
    description: 'Réglementations fédérales régissant l\'inspection des viandes, de la volaille et des ovo-produits, validation des procédures HACCP et équivalences sanitaires à l\'export.',
    url: 'https://www.fsis.usda.gov',
    frequency: 'Quotidien',
    regulationsCovered: ['9 CFR (FSIS Meat & Poultry Regulations)', 'FSIS Directives sanitaires', 'Foreign Establishment Eligibility'],
    legalWeight: 'Obligation légale directe',
    status: 'ONLINE',
    lastSync: 'Il y a 32 min',
    isAvailableInApp: true,
    provenance: 'USDA FSIS Policy Archive & Recalls API (Directives et Notices)',
    coverageLevel: 'Intégrale'
  },
  {
    id: 'uk-fsa',
    name: 'UK Food Standards Agency (FSA)',
    organization: 'Food Standards Agency',
    pays: 'UK',
    paysLabel: 'Royaume-Uni',
    flag: '🇬🇧',
    type: 'Base Légale',
    category: 'Post-Brexit Export UK & SPS',
    description: 'Normes applicables aux denrées alimentaires en Angleterre, Pays de Galles et Irlande du Nord, régime d\'importation BTOM (Border Target Operating Model) et certificats sanitaires EHC.',
    url: 'https://www.food.gov.uk',
    frequency: 'Quotidien',
    regulationsCovered: ['Retained EU Law / UK Food Safety Act 1990', 'UK Food Information Regulations (Natasha\'s Law)', 'BTOM Sanitary and Phytosanitary Controls'],
    legalWeight: 'Obligation légale directe',
    status: 'ONLINE',
    lastSync: 'Il y a 19 min',
    isAvailableInApp: true,
    provenance: 'API Data.gov.uk / FSA Food Alerts Service & Legislation.gov.uk',
    coverageLevel: 'Intégrale'
  },
  {
    id: 'bfr-germany',
    name: 'BfR — Bundesinstitut für Risikobewertung',
    organization: 'Institut fédéral allemand d\'évaluation des risques',
    pays: 'DE',
    paysLabel: 'Allemagne',
    flag: '🇩🇪',
    type: 'Avis Scientifique',
    category: 'Évaluation des Risques & Matériaux de Contact (BfR Recommendations)',
    description: 'Recommandations BfR sur les matériaux en contact avec les aliments (matières plastiques, silicones, papiers/cartons) et avis toxicologiques sur les contaminants émergents.',
    url: 'https://www.bfr.bund.de',
    frequency: 'Hebdomadaire',
    regulationsCovered: ['Recommandations BfR relatives aux plastiques et emballages', 'Évaluation MOSH/MOAH dans les aliments', 'Seuils d\'alcaloïdes et mycotoxines'],
    legalWeight: 'Avis scientifique de référence',
    status: 'ONLINE',
    lastSync: 'Il y a 52 min',
    isAvailableInApp: true,
    provenance: 'Flux RSS & Base de données des recommandations BfR (BfR-Empfehlungen)',
    coverageLevel: 'Intégrale'
  },
  {
    id: 'cfia-acia',
    name: 'ACIA / CFIA — Agence canadienne d\'inspection des aliments',
    organization: 'Gouvernement du Canada',
    pays: 'CA',
    paysLabel: 'Canada',
    flag: '🇨🇦',
    type: 'Base Légale',
    category: 'Règlement sur la salubrité des aliments au Canada (RSAC)',
    description: 'Exigences relatives aux licences d\'importation, aux contrôles préventifs écrits (PCP), à la traçabilité et aux normes de composition pour le marché canadien.',
    url: 'https://inspection.canada.ca',
    frequency: 'Bi-hebdomadaire',
    regulationsCovered: ['Règlement sur la salubrité des aliments au Canada (RSAC / SFCR)', 'Loi sur les aliments et drogues (LAD)', 'Directives d\'exportation vers le Canada'],
    legalWeight: 'Obligation légale directe',
    status: 'ONLINE',
    lastSync: 'Il y a 38 min',
    isAvailableInApp: true,
    provenance: 'Service de données ouvertes du gouvernement canadien (ouvert.canada.ca) & Rappels ACIA',
    coverageLevel: 'Intégrale'
  },
  {
    id: 'codex-alimentarius',
    name: 'Codex Alimentarius (FAO / OMS)',
    organization: 'Organisation des Nations Unies pour l\'alimentation et l\'agriculture',
    pays: 'INT',
    paysLabel: 'International',
    flag: '🌐',
    type: 'Standard & Norme',
    category: 'Normes Alimentaires Internationales & Commerce OMC',
    description: 'Normes de référence mondiales utilisées pour le règlement des différends commerciaux à l\'OMC (SPS) : Principes généraux d\'hygiène alimentaire (HACCP Codex 2020), normes produits.',
    url: 'https://www.fao.org/fao-who-codexalimentarius',
    frequency: 'Mensuel',
    regulationsCovered: ['CXC 1-1969 Rév. 2020 (Système HACCP et Bonnes Pratiques d\'Hygiène)', 'LMR Codex pour résidus de pesticides', 'Normes d\'étiquetage des aliments préemballés'],
    legalWeight: 'Standard de certification auditée',
    status: 'ONLINE',
    lastSync: 'Il y a 1h',
    isAvailableInApp: true,
    provenance: 'Portail officiel FAO / OMS Codex Texts Repository & Rapports de sessions CAC',
    coverageLevel: 'Intégrale'
  },
  {
    id: 'gfsi-standards',
    name: 'GFSI — Référentiels IFS Food, BRCGS & FSSC 22000',
    organization: 'Global Food Safety Initiative (The Consumer Goods Forum)',
    pays: 'INT',
    paysLabel: 'International',
    flag: '🌐',
    type: 'Standard & Norme',
    category: 'Standards d\'Audit de la Grande Distribution',
    description: 'Veille sur les mises à jour des exigences de certification industrielle (IFS Food Version 8, BRCGS Food Issue 9, FSSC 22000 Version 6, Food Safety Culture, Food Defense, Food Fraud).',
    url: 'https://mygfsi.com',
    frequency: 'Bi-mensuel',
    regulationsCovered: ['IFS Food v8 (Doctrine & Checklists)', 'BRCGS Food Safety Issue 9', 'FSSC 22000 v6 (ISO 22000 + ISO/TS 22002-1)'],
    legalWeight: 'Standard de certification auditée',
    status: 'ONLINE',
    lastSync: 'Il y a 1h 20',
    isAvailableInApp: true,
    provenance: 'Portails auditeurs officiels IFS Academy, BRCGS Participate & FSSC 22000 Scheme Updates',
    coverageLevel: 'Intégrale'
  },
  {
    id: 'echa-reach-pfas',
    name: 'ECHA — Substances Chimiques & Restriction PFAS / MOCA',
    organization: 'Agence européenne des produits chimiques',
    pays: 'UE',
    paysLabel: 'Union Européenne',
    flag: '🇪🇺',
    type: 'Base Légale',
    category: 'Matériaux au Contact des Aliments & PFAS',
    description: 'Restrictions universelles PFAS, substances extrêmement préoccupantes (SVHC) entrant dans la composition des emballages alimentaires et encres d\'impression.',
    url: 'https://echa.europa.eu',
    frequency: 'Bi-hebdomadaire',
    regulationsCovered: ['Règlement REACH (CE) 1907/2006', 'Dossier de restriction universelle PFAS', 'Règlement (CE) 1935/2004 MOCA'],
    legalWeight: 'Obligation légale directe',
    status: 'ONLINE',
    lastSync: 'Il y a 35 min',
    isAvailableInApp: true,
    provenance: 'Registre ECHA Registry of Intentions & Listes des substances candidates SVHC',
    coverageLevel: 'Intégrale'
  },
  {
    id: 'dgccrf-france',
    name: 'DGCCRF — Enquêtes Répression des Fraudes',
    organization: 'Ministère de l\'Économie et des Finances (France)',
    pays: 'FR',
    paysLabel: 'France',
    flag: '🇫🇷',
    type: 'Journal Officiel',
    category: 'Fraudes, Allégations & Étiquetage INCO',
    description: 'Résultats des plans de contrôle annuels de la DGCCRF sur l\'authenticité (miel, huile d\'olive, viandes), allégations nutritionnelles et de santé, marquage d\'origine.',
    url: 'https://www.economie.gouv.fr/dgccrf',
    frequency: 'Hebdomadaire',
    regulationsCovered: ['Code de la consommation (L. 412-1 et suivants)', 'Règlement (CE) 1924/2006 (Allégations)', 'Règlement (UE) 2018/775 (Origine de l\'ingrédient primaire)'],
    legalWeight: 'Obligation légale directe',
    status: 'ONLINE',
    lastSync: 'Il y a 1h 05',
    isAvailableInApp: true,
    provenance: 'Publications officielles DGCCRF & Bilans d\'enquêtes annuelles',
    coverageLevel: 'Intégrale'
  },
  // Sources en cours ou planifiées pour démontrer la couverture et la transparence
  {
    id: 'fssai-india',
    name: 'FSSAI — Food Safety and Standards Authority of India',
    organization: 'Ministère de la Santé (Gouvernement de l\'Inde)',
    pays: 'INT',
    paysLabel: 'Inde / Asie',
    flag: '🇮🇳',
    type: 'Base Légale',
    category: 'Importation Épices, Riz & Thé',
    description: 'Réglementations et normes applicables aux exportations agricoles indiennes vers l\'Europe (épices, thé, basmati, contaminants chimiques et aflatoxines).',
    url: 'https://www.fssai.gov.in',
    frequency: 'Bi-mensuel',
    regulationsCovered: ['FSS Act 2006', 'Contaminants, Toxins & Residues Regulations', 'Certificats de salubrité export'],
    legalWeight: 'Obligation légale directe',
    status: 'SYNCED',
    lastSync: 'Prévu Q4 2026',
    isAvailableInApp: false,
    provenance: 'MoUs en cours de raccordement API avec le portail FSSAI Indian Customs',
    coverageLevel: 'En cours d\'intégration'
  },
  {
    id: 'fsanz-australia',
    name: 'FSANZ — Food Standards Australia New Zealand',
    organization: 'Gouvernement d\'Australie et de Nouvelle-Zélande',
    pays: 'INT',
    paysLabel: 'Australie & Océanie',
    flag: '🇦🇺',
    type: 'Journal Officiel',
    category: 'Australia New Zealand Food Standards Code',
    description: 'Code réglementaire commun pour les produits agroalimentaires commercialisés en Australie et Nouvelle-Zélande (OGM, irradiation, allergènes, étiquetage nutritionnel).',
    url: 'https://www.foodstandards.gov.au',
    frequency: 'Mensuel',
    regulationsCovered: ['Food Standards Code (Chapters 1 & 2)', 'Standard 1.2.3 Allergen Labelling', 'Imported Food Inspection Scheme (IFIS)'],
    legalWeight: 'Obligation légale directe',
    status: 'SYNCED',
    lastSync: 'Prévu Q4 2026',
    isAvailableInApp: false,
    provenance: 'Intégration prévue via Federal Register of Legislation australien',
    coverageLevel: 'Planifiée Q4 2026'
  },
  {
    id: 'iso-tc34',
    name: 'ISO / TC 34 — Produits alimentaires (ISO 22000 & Méthodes d\'analyse)',
    organization: 'Organisation internationale de normalisation (ISO)',
    pays: 'INT',
    paysLabel: 'International',
    flag: '🌐',
    type: 'Standard & Norme',
    category: 'Normes de Management & Méthodes d\'Analyses Microbiologiques',
    description: 'Évolutions des normes ISO 22000:2018 (Systèmes de management de la sécurité des denrées alimentaires) et méthodes d\'analyse microbiologique de référence (ISO 6579 Salmonella, ISO 11290 Listeria).',
    url: 'https://www.iso.org/committee/47858.html',
    frequency: 'Trimestriel',
    regulationsCovered: ['ISO 22000:2018', 'ISO 22002-1 (PRP)', 'ISO 20976-1 (Challenge-tests)'],
    legalWeight: 'Standard de certification auditée',
    status: 'ONLINE',
    lastSync: 'Il y a 3h',
    isAvailableInApp: true,
    provenance: 'Flux de veille AFNOR / ISO TC 34 Normalisation Agroalimentaire',
    coverageLevel: 'Intégrale'
  },
  {
    id: 'afsca-belgium',
    name: 'AFSCA — Agence fédérale pour la sécurité de la chaîne alimentaire',
    organization: 'Service Public Fédéral (Belgique)',
    pays: 'UE',
    paysLabel: 'Belgique / Bénélux',
    flag: '🇧🇪',
    type: 'Journal Officiel',
    category: 'Contrôles Sanitaires & Échanges Transfrontaliers',
    description: 'Circulaires professionnelles de l\'AFSCA, guides d\'autocontrôle validés, alertes de rappels produits et tolérances microbiologiques pour le marché bénélux.',
    url: 'https://www.favv-afsca.be',
    frequency: 'Quotidien',
    regulationsCovered: ['Loi belge du 4 février 2000', 'Guides d\'autocontrôle AFSCA G-001', 'Système d\'alerte sanitaire Be-Alert Food'],
    legalWeight: 'Obligation légale directe',
    status: 'ONLINE',
    lastSync: 'Il y a 22 min',
    isAvailableInApp: true,
    provenance: 'API publique AFSCA Recalls & Bulletin officiel fédéral belge (Moniteur Belge)',
    coverageLevel: 'Intégrale'
  },
  {
    id: 'aesan-spain',
    name: 'AESAN — Agencia Española de Seguridad Alimentaria y Nutrición',
    organization: 'Ministère de la Consommation (Espagne)',
    pays: 'UE',
    paysLabel: 'Espagne',
    flag: '🇪🇸',
    type: 'Base Légale',
    category: 'Importation Matières Premières & Alertes SCIRI',
    description: 'Système d\'alerte rapide espagnol SCIRI, notes d\'interprétation sur les critères d\'hygiène des denrées d\'origine animale et limites de résidus pour fruits et légumes.',
    url: 'https://www.aesan.gob.es',
    frequency: 'Bi-hebdomadaire',
    regulationsCovered: ['Real Decreto 1334/1999 (Norma general de etiquetado)', 'Réseau SCIRI (Red de Alerta Alimentaria)', 'Plans nationaux de contrôle PNCOCA'],
    legalWeight: 'Obligation légale directe',
    status: 'ONLINE',
    lastSync: 'Il y a 40 min',
    isAvailableInApp: true,
    provenance: 'Portail open data du gouvernement espagnol (datos.gob.es) & Bulletins AESAN',
    coverageLevel: 'Intégrale'
  },
  {
    id: 'osav-switzerland',
    name: 'OSAV / BLV — Office fédéral de la sécurité alimentaire et des affaires vétérinaires',
    organization: 'Confédération Suisse (DFI)',
    pays: 'INT',
    paysLabel: 'Suisse',
    flag: '🇨🇭',
    type: 'Base Légale',
    category: 'Accords Bilatéraux Vétérinaires & Export Suisse',
    description: 'Droit alimentaire suisse (ODAlOUs), ordonnance sur les denrées d\'origine animale (ODAlAn), et exigences spécifiques pour l\'export agroalimentaire vers le marché suisse.',
    url: 'https://www.blv.admin.ch',
    frequency: 'Bi-hebdomadaire',
    regulationsCovered: ['RS 817.02 (Ordonnance sur les denrées alimentaires et les objets usuels)', 'RS 817.022.16 (Critères d\'hygiène)', 'Accord vétérinaire UE-Suisse'],
    legalWeight: 'Obligation légale directe',
    status: 'ONLINE',
    lastSync: 'Il y a 1h 10',
    isAvailableInApp: true,
    provenance: 'Recueil officiel du droit fédéral suisse (Fedlex API) & Rappels OSAV',
    coverageLevel: 'Intégrale'
  },
  {
    id: 'nvwa-netherlands',
    name: 'NVWA — Nederlandse Voedsel- en Warenautoriteit',
    organization: 'Ministère de l\'Agriculture (Pays-Bas)',
    pays: 'UE',
    paysLabel: 'Pays-Bas',
    flag: '🇳🇱',
    type: 'Base Légale',
    category: 'Hub Logistique Rotterdam & Importations Maritimes',
    description: 'Inspections sanitaires aux postes frontières de Rotterdam et Schiphol, alertes sur les mycotoxines dans les cargaisons de café, cacao et fruits oléagineux.',
    url: 'https://www.nvwa.nl',
    frequency: 'Quotidien',
    regulationsCovered: ['Loi néerlandaise Warenwet', 'Inspections frontalières BIP Rotterdam', 'Tolérances alcaloïdes et contaminants'],
    legalWeight: 'Obligation légale directe',
    status: 'ONLINE',
    lastSync: 'Il y a 18 min',
    isAvailableInApp: true,
    provenance: 'Open Data Rijksoverheid & flux d\'inspection NVWA Keteninspectie',
    coverageLevel: 'Intégrale'
  },
  {
    id: 'gacc-china',
    name: 'GACC Décret 248/249 — Douanes Chinoises (CIFER)',
    organization: 'Administration Générale des Douanes de la République Populaire de Chine',
    pays: 'INT',
    paysLabel: 'Chine',
    flag: '🇨🇳',
    type: 'Journal Officiel',
    category: 'Enregistrement des Usines Exportatrices en Chine',
    description: 'Obligation d\'enregistrement CIFER de tous les sites de fabrication de denrées importées en Chine (Décret 248) et exigences de sécurité sanitaire et étiquetage GB (Décret 249).',
    url: 'http://cifer.singlewindow.cn',
    frequency: 'Mensuel',
    regulationsCovered: ['GACC Decree 248 (Enregistrement des établissements)', 'GACC Decree 249 (Mesures administratives sur la sécurité des aliments importés)', 'Standards Nationaux GB (Guobiao)'],
    legalWeight: 'Obligation légale directe',
    status: 'SYNCED',
    lastSync: 'En cours d\'intégration API',
    isAvailableInApp: false,
    provenance: 'Connecteur en développement avec la plateforme China Single Window & bulletins de l\'ambassade',
    coverageLevel: 'En cours d\'intégration'
  },
  {
    id: 'mhlw-japan',
    name: 'MHLW Japan — Ministry of Health, Labour and Welfare',
    organization: 'Gouvernement du Japon',
    pays: 'INT',
    paysLabel: 'Japon',
    flag: '🇯🇵',
    type: 'Base Légale',
    category: 'Spécifications d\'Importation & Liste Positive Additifs',
    description: 'Loi japonaise sur l\'assainissement des aliments (Food Sanitation Act), liste positive d\'additifs autorisés (très restrictive par rapport à l\'UE) et tolérances résidus phytosanitaires.',
    url: 'https://www.mhlw.go.jp/english',
    frequency: 'Bi-mensuel',
    regulationsCovered: ['Food Sanitation Act of Japan', 'Positive List System for Agricultural Chemical Residues', 'Specifications and Standards for Foods and Food Additives'],
    legalWeight: 'Obligation légale directe',
    status: 'SYNCED',
    lastSync: 'Planifié Q1 2027',
    isAvailableInApp: false,
    provenance: 'Documentation officielle JETRO & traduction légale MHLW Standards Database',
    coverageLevel: 'Planifiée Q4 2026'
  }
];

export interface DiagnosticCaseProfile {
  id: string;
  name: string;
  companyName: string;
  badge: string;
  secteur: string;
  meta: string;
  marches: string;
  import: string;
  certifications: string[];
  tags: { label: string; type: 'critical' | 'warning' | 'success' }[];
  alerts: {
    urgency: 'critical' | 'high' | 'medium';
    title: string;
    source: string;
    date: string;
    desc: string;
    impact: string;
  }[];
  actions: {
    priority: 'haute' | 'moyenne' | 'optionnelle';
    icon: string;
    title: string;
    desc: string;
    visipilotModule: 'VisiPLM' | 'VISITrack' | 'VISIcat' | 'VisiVal' | 'VisiPact' | 'VisiTact';
  }[];
  visipilotValue: string;
  ecosystemSynergy: string;
}

export const DIAGNOSTIC_PROFILES: DiagnosticCaseProfile[] = [
  {
    id: 'traiteur_salaisons',
    name: 'Frais, Traiteur & Charcuterie',
    companyName: 'Salaisons & Mets Gourmets',
    badge: 'Produits Frais & DLC Courtes',
    secteur: 'Salaisons, Charcuterie cuite & Plats traiteur prêts à consommer',
    meta: 'PME agroalimentaire · 140 salariés · Usines en Bretagne et Auvergne',
    marches: 'GMS France (90%), Export Belgique & Allemagne (10%)',
    import: 'Matières premières porcines & volailles (France, Espagne), épices et boyaux (UE, Asie)',
    certifications: ['IFS Food v8', 'Réglementation Paquet Hygiène CE 853/2004', 'Viande de Porc Français (VPF)', 'Bio UE'],
    tags: [
      { label: 'Risque Microbiologique Majeur', type: 'critical' },
      { label: 'Flux Tendus & DLC < 21 jours', type: 'warning' },
      { label: 'IFS Food v8 Niveau Supérieur', type: 'success' }
    ],
    alerts: [
      {
        urgency: 'critical',
        title: 'Mise à jour Règlement (CE) 2073/2005 — Critères Listeria monocytogenes dans les denrées prêtes à consommer',
        source: 'Journal Officiel de l\'Union Européenne · Commission Européenne',
        date: 'Septembre 2026',
        desc: 'L\'UE a durci les règles d\'absence de Listeria monocytogenes (< 100 ufc/g en fin de DLC) pour les aliments permettant le développement du germe dès lors que l\'exploitant ne dispose pas d\'un test de vieillissement validé selon la norme ISO 20976-1.',
        impact: 'Obligation de revalider sous 60 jours tous les challenge-tests sur les gammes tranchées sous atmosphère modifiée.'
      },
      {
        urgency: 'high',
        title: 'Baisse des seuils autorisés de Nitrites et Nitrates (Règlement UE 2023/2108)',
        source: 'EFSA & DGAL · Instruction technique DGAL/SDSSA',
        date: 'Août 2026',
        desc: 'Entrée en application du palier 2 de réduction des teneurs maximales en nitrites résiduels (E249, E250). Contrôles renforcés de la DGAL lors des audits d\'agrément sanitaire.',
        impact: 'Révision obligatoire des fiches recettes dans le PLM et validation microbiologique Clostridium botulinum.'
      },
      {
        urgency: 'medium',
        title: 'Allergènes involontaires — Nouveau seuil d\'action Afsca & DGAL pour la moutarde et le céleri',
        source: 'DGAL & EFSA Allergens Working Group',
        date: 'Juillet 2026',
        desc: 'Harmonisation européenne des doses de référence VITAL 3.0 pour l\'étiquetage de précaution (« peut contenir des traces »).',
        impact: 'Mise à jour des fiches techniques produits finis et validation du plan de nettoyage entre les séries.'
      }
    ],
    actions: [
      {
        priority: 'haute',
        icon: '🔴',
        title: 'Plan de contrôle renforcé Listeria en environnement de tranchage',
        desc: 'Échantillonnage hebdomadaire des zones de contact alimentaire (trancheuses, tapis inox) et mise en place d\'un horizon scanning 12 mois.',
        visipilotModule: 'VisiTact'
      },
      {
        priority: 'haute',
        icon: '🔴',
        title: 'Reformulation fiches recettes nitrites résiduels dans VisiPLM',
        desc: 'Mise à jour automatique des seuils d\'ingrédients dans VisiPLM et calcul de conformité instantané vis-à-vis du Règlement UE 2023/2108.',
        visipilotModule: 'VisiPLM'
      },
      {
        priority: 'moyenne',
        icon: '🟡',
        title: 'Audit fournisseur boyaux et épices via VisiPact',
        desc: 'Automatisation des grilles d\'évaluation des sous-traitants pour exiger les attestations de non-irradiation et certificats allergènes.',
        visipilotModule: 'VisiPact'
      }
    ],
    visipilotValue: 'FoodSafetyWatch a alerté le Directeur Qualité 7 semaines avant l\'inspection vétérinaire inopinée, permettant de formaliser les challenge-tests sans arrêt de ligne.',
    ecosystemSynergy: 'Synchronisé avec VisiTact (supervision IoT des températures de découpe) et VisiPLM (recettes et allergènes centralisés).'
  },
  {
    id: 'laiterie_fromagerie',
    name: 'Produits Laitiers & Fromages AOP',
    companyName: 'Coopérative Laitière des Terroirs',
    badge: 'Filière Laitière & Export US',
    secteur: 'Fromages AOP au lait cru, yaourts et ingrédients laitiers (poudre de lactosérum)',
    meta: 'ETI coopérative · 420 salariés · 3 sites de transformation · Exportation mondiale',
    marches: 'France, Union Européenne, États-Unis (agrément FDA), Japon, Royaume-Uni',
    import: 'Packaging, ferments lactiques, sel marin de Guérande, arômes naturels',
    certifications: ['FSSC 22000 v6', 'IFS Food v8', 'Agrément FDA FSMA', 'AOP Fromages de France', 'Halal certifié'],
    tags: [
      { label: 'Agrément FDA FSMA Requis', type: 'critical' },
      { label: 'Lait Cru & Toxines Staphylocoques', type: 'warning' },
      { label: 'Exigence Export Monde', type: 'success' }
    ],
    alerts: [
      {
        urgency: 'critical',
        title: 'FDA FSMA Rule 204 — Exigences de traçabilité électronique pour les fromages à pâte molle',
        source: 'US Federal Register · FDA CFSAN',
        date: 'Septembre 2026',
        desc: 'La FDA impose aux exportateurs de fromages à pâte molle la tenue de registres numériques d\'événements de suivi critiques (KDE - Key Data Elements) à chaque étape de transformation et d\'expédition.',
        impact: 'Risque de blocage douanier immédiat aux frontières américaines en cas d\'absence d\'interfaçage dématérialisé.'
      },
      {
        urgency: 'high',
        title: 'MOCA & Emballages — Interdiction des PFAS dans les opercules et cires fromagères',
        source: 'Commission Européenne & ECHA · Règlement MOCA 2026',
        date: 'Août 2026',
        desc: 'Obligation de fournir les attestations de conformité d\'absence totale de PFAS pour tous les papiers paraffinés et emballages au contact direct du fromage.',
        impact: 'Audit urgent des 4 fournisseurs de conditionnement et mise en conformité des déclarations de conformité CE.'
      },
      {
        urgency: 'medium',
        title: 'UK Border Target Operating Model (BTOM) — Nouveaux certificats sanitaires EHC fromages',
        source: 'UK Department for Environment, Food and Rural Affairs (DEFRA)',
        date: 'Août 2026',
        desc: 'Contrôles documentaires et physiques renforcés aux postes d\'inspection frontaliers (BCP) britanniques sur les produits laitiers à moyen risque.',
        impact: 'Pré-notification automatique sur le système IPAFFS et harmonisation des mentions d\'étiquetage.'
      }
    ],
    actions: [
      {
        priority: 'haute',
        icon: '🔴',
        title: 'Interconnexion traçabilité lot FSMA 204 via VISITrack',
        desc: 'Cartographie des Critical Tracking Events (CTE) et génération automatique des fichiers d\'échange conformes FDA.',
        visipilotModule: 'VISITrack'
      },
      {
        priority: 'haute',
        icon: '🔴',
        title: 'Campagne de collecte des certificats PFAS emballage',
        desc: 'Envoi d\'une campagne automatisée d\'audit fournisseurs via VisiPact pour certifier les papiers et cires.',
        visipilotModule: 'VisiPact'
      },
      {
        priority: 'moyenne',
        icon: '🟡',
        title: 'Mise à niveau HACCP FSSC 22000 version 6',
        desc: 'Revue des programmes prérequis opérationnels (PRPO) pour la gestion des biofilms et surveillance des eaux de lavage.',
        visipilotModule: 'VISIcat'
      }
    ],
    visipilotValue: 'La coopérative a sécurisé 14 M€ de chiffre d\'affaires export USA en intégrant la règle FSMA 204 quatre mois avant la date limite d\'application.',
    ecosystemSynergy: 'Totalement couplé avec VISITrack pour la traçabilité amont des élevages laitiers et VISIcat pour les non-conformités GFSI.'
  },
  {
    id: 'epicerie_ingredients',
    name: 'Épicerie, Épices & Ingrédients du Monde',
    companyName: 'NaturaSpices International',
    badge: 'Import Matières Premières & Risques Chimiques',
    secteur: 'Importation, mouture et conditionnement d\'épices, poivres, vanille et herbes aromatiques',
    meta: 'ETI · 280 salariés · Plateformes logistiques Le Havre et Marseille',
    marches: 'Industriels agroalimentaires européens, food service, marques distributeurs',
    import: 'Inde (poivre, curcuma), Madagascar (vanille), Vietnam (cannelle), Turquie (origan)',
    certifications: ['IFS Broker & IFS Food', 'BRCGS Food', 'Bio / Fairtrade', 'SEDEX SMETA'],
    tags: [
      { label: 'Risque Contaminants & Pesticides', type: 'critical' },
      { label: 'Chaîne d\'Approvisionnement Complexe', type: 'warning' },
      { label: 'Due Diligence CSDDD', type: 'success' }
    ],
    alerts: [
      {
        urgency: 'critical',
        title: 'Règlement (UE) 2024/... Révision des LMR d\'Oxyde d\'Éthylène et de Chlormequat',
        source: 'Journal Officiel UE · EFSA Pesticides Peer Review',
        date: 'Septembre 2026',
        desc: 'Abaissement de la limite de quantification à 0.01 mg/kg sur les épices séchées. Alerte automatique déclenchée sur tous les lots de sésame et de curcuma en provenance du sous-continent indien.',
        impact: 'Blocage préventif des conteneurs en mer jusqu\'à obtention des analyses libératoires accréditées COFRAC.'
      },
      {
        urgency: 'high',
        title: 'Alcaloïdes pyrrolizidiniques (AP) — Contrôles renforcés sur les herbes aromatiques séchées',
        source: 'Règlement (UE) 2023/915 · DGAL France',
        date: 'Août 2026',
        desc: 'Surveillance ciblée de la contamination croisée des cultures d\'origan et de thym par des mauvaises herbes toxiques (Senecio).',
        impact: 'Obligation de mettre en place un protocole de tri optique chez les collecteurs amont.'
      },
      {
        urgency: 'medium',
        title: 'Directive européenne sur le devoir de vigilance (CSDDD) — Cartographie des risques filières',
        source: 'Commission Européenne · Transposition 2026',
        date: 'Juillet 2026',
        desc: 'Obligation pour les donneurs d\'ordre d\'auditer les conditions de travail et la sécurité environnementale chez les producteurs amont.',
        impact: 'Déploiement d\'un questionnaire d\'auto-évaluation des coopératives agricoles partenaires.'
      }
    ],
    actions: [
      {
        priority: 'haute',
        icon: '🔴',
        title: 'Plan de contrôle analytique multi-résidus automatisé dans VISITrack',
        desc: 'Intégration directe des résultats de laboratoires (Eurofins, Silliker) avec comparaison instantanée aux seuils LMR de l\'UE.',
        visipilotModule: 'VISITrack'
      },
      {
        priority: 'haute',
        icon: '🔴',
        title: 'Audit à distance des filières d\'approvisionnement Asie',
        desc: 'Génération de grilles de vérification des bonnes pratiques agricoles (GAP) pour les fournisseurs indiens et vietnamiens.',
        visipilotModule: 'VisiPact'
      },
      {
        priority: 'moyenne',
        icon: '🟡',
        title: 'Gestion des fiches de données de sécurité et allergènes',
        desc: 'Centralisation des bulletins d\'analyse lot par lot pour transmission dématérialisée aux clients industriels.',
        visipilotModule: 'VisiPLM'
      }
    ],
    visipilotValue: 'Évitement d\'un rappel produit de 450 000 € grâce à la notification précoce d\'une modification de LMR 3 semaines avant parution au JOUE.',
    ecosystemSynergy: 'VISITrack cartographie les risques par pays source, VisiPact gère les audits tiers et VisiPLM verrouille les fiches spécifications matières.'
  },
  {
    id: 'surgele_maree',
    name: 'Surgelés & Produits de la Mer',
    companyName: 'Océan Délices Surgelés',
    badge: 'Produits de la Pêche & Chaîne du Froid',
    secteur: 'Filets de poisson surgelés, plats cuisinés marins, crevettes et céphalopodes',
    meta: 'PME · 190 salariés · Usine de transformation à Boulogne-sur-Mer',
    marches: 'Restauration Hors Domicile (RHD), GMS France et Union Européenne',
    import: 'Pêche Atlantique Nord-Est, crevettes d\'Équateur et d\'Asie, colin d\'Alaska',
    certifications: ['IFS Food v8', 'MSC Pêche Durable', 'ASC Aquaculture Responsable', 'Bio'],
    tags: [
      { label: 'Surveillance Histamine & Métaux Lourds', type: 'critical' },
      { label: 'Température Négative -18°C Continue', type: 'warning' },
      { label: 'Traçabilité Océanographique FAO', type: 'success' }
    ],
    alerts: [
      {
        urgency: 'critical',
        title: 'Contrôles renforcés Histamine sur les poissons pélagiques (Règlement CE 2073/2005)',
        source: 'DGAL & RASFF Notifications',
        date: 'Septembre 2026',
        desc: 'Augmentation des alertes RASFF sur les thons et maquereaux avec formation d\'histamine suite à des ruptures de chaîne du froid amont en mer.',
        impact: 'Mise en place d\'un dosage rapide d\'histamine systématique au dépotage avant déchargement de chaque conteneur.'
      },
      {
        urgency: 'high',
        title: 'Règlement (UE) 2023/915 — Nouvelles teneurs maximales en cadmium et plomb dans les céphalopodes',
        source: 'Journal Officiel UE',
        date: 'Août 2026',
        desc: 'Réduction de 20% des seuils admissibles de cadmium dans les calmars et seiches importés d\'Amérique du Sud.',
        impact: 'Contrôle analytique préalable obligatoire sur échantillon avant dédouanement.'
      },
      {
        urgency: 'medium',
        title: 'Étiquetage des zones de capture FAO et engins de pêche (Règlement OCM 1379/2013)',
        source: 'DGCCRF & Direction des Pêches Maritimes',
        date: 'Juillet 2026',
        desc: 'Contrôles accrus sur l\'exactitude des sous-zones de pêche FAO (ex: FAO 27.VIIe) et du nom scientifique des espèces.',
        impact: 'Validation des maquettes emballages via le module de contrôle étiquetage VisiPLM.'
      }
    ],
    actions: [
      {
        priority: 'haute',
        icon: '🔴',
        title: 'Déploiement sondes IoT sans fil VisiTact en chambres -20°C',
        desc: 'Supervision temps réel 24/7 avec alertes SMS/App immédiates en cas de dérive thermique selon la norme EN 12830.',
        visipilotModule: 'VisiTact'
      },
      {
        priority: 'haute',
        icon: '🔴',
        title: 'Workflow automatique de libération des lots marée',
        desc: 'Blocage informatique automatique dans VisiPLM des lots tant que les analyses d\'histamine et métaux lourds ne sont pas validées.',
        visipilotModule: 'VisiPLM'
      },
      {
        priority: 'moyenne',
        icon: '🟡',
        title: 'Vérification conformité mentions d\'étiquetage OCM',
        desc: 'Audit automatique des mentions légales (zone FAO, méthode de capture, décongélation) par rapport au référentiel DGCCRF.',
        visipilotModule: 'VISIcat'
      }
    ],
    visipilotValue: 'Zéro non-conformité majeure lors du renouvellement de l\'audit IFS Food v8 grâce aux relevés continus horodatés de VisiTact.',
    ecosystemSynergy: 'VisiTact garantit la chaîne du froid physique, tandis que VisiPLM et VISIcat automatisent la conformité réglementaire.'
  }
];

export const PRICING_PLANS = [
  {
    id: 'discovery',
    name: 'Discovery',
    badge: '90 JOURS D\'ESSAI GRATUIT',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Pour découvrir FoodSafetyWatch et valider la pertinence de la veille réglementaire pour votre usine ou laboratoire qualité.',
    priceMonthly: 29,
    priceYearly: 0,
    trialDays: 90,
    isPopular: false,
    ctaText: 'Commencer ma veille — 3 mois gratuits',
    ctaSubtext: 'Sans carte bancaire · Sans engagement · Résiliable en 1 clic',
    features: [
      'Bulletin mensuel de veille réglementaire personnalisé',
      'Accès au moteur de recherche de 30+ sources officielles (JOUE, FDA, EFSA, RASFF, DGAL)',
      '1 secteur agroalimentaire complet configuré',
      '1 utilisateur référent qualité / affaires réglementaires',
      '1 pays d\'implantation de votre site',
      'Jusqu\'à 3 pays d\'exportation surveillés',
      'Jusqu\'à 3 pays d\'importation matières premières',
      'Support technique par email sous 24h'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: 'RECOMMANDÉ AGROALIMENTAIRE',
    badgeColor: 'bg-[#EA580C]/10 text-[#EA580C] border-[#EA580C]/30',
    description: 'La solution complète pour les industriels, coopératives et laboratoires qui doivent maîtriser l\'ensemble de leurs obligations et anticiper les crises.',
    priceMonthly: 215,
    priceYearly: 0,
    trialDays: 0,
    isPopular: true,
    ctaText: 'Souscrire à l\'offre Pro',
    ctaSubtext: 'Facturation mensuelle sans engagement · Mise en service sous 48h',
    features: [
      'Tout ce qui est inclus dans l\'offre Discovery',
      'Expert VisiPilot attitré (auditeur QHSE & sécurité des aliments)',
      'Alertes sanitaires & réglementaires en temps réel (< 30 min)',
      'Revue semestrielle de conformité personnalisée avec votre expert',
      'Jusqu\'à 5 utilisateurs (Direction, Qualité, R&D, Achats)',
      'Jusqu\'à 3 secteurs d\'activité ou filières',
      'Jusqu\'à 3 pays d\'implantation de sites industriels',
      'Jusqu\'à 10 pays d\'exportation et d\'importation suivis',
      'Matrice des impacts réglementaires sur vos matières et recettes',
      'Support prioritaire par téléphone et visio'
    ]
  },
  {
    id: 'premium',
    name: 'Enterprise Premium',
    badge: 'SUR MESURE & MULTI-SITES',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    description: 'Pour les groupes agroalimentaires multi-sites, directions qualité groupe et marques internationales exigeant un accompagnement stratégique dédié.',
    priceMonthly: 0,
    priceYearly: 0,
    trialDays: 0,
    isPopular: false,
    surDevis: true,
    ctaText: 'Demander un devis sur mesure',
    ctaSubtext: 'Étude de cadrage gratuite avec un expert VisiPilot',
    features: [
      'Tout ce qui est inclus dans l\'offre Pro',
      'Nombre d\'utilisateurs et de sites industriels illimités',
      'Tous secteurs et pays d\'implantation / export / import illimités',
      'Horizon scanning 12-18 mois : détection anticipée des projets de règlements européens et FDA avant vote',
      'Revue trimestrielle de conformité stratégique',
      'Interfaçage API direct avec votre ERP et la suite VisiPilot (VisiPLM, VISITrack, VISIcat, VisiTact)',
      'Formations sur site ou à distance pour vos équipes qualité et R&D',
      'Accompagnement d\'urgence en cas de crise sanitaire ou audit inopiné'
    ]
  }
];
