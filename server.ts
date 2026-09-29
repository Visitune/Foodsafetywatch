import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { REGULATORY_SOURCES, DIAGNOSTIC_PROFILES, PRICING_PLANS } from './src/data/sourcesData.js';
import { REGULATORY_DOMAINS, OFFICIAL_REGULATORY_TEXTS, INGESTION_PIPELINES } from './src/data/regulatoryEngineData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isDev = process.env.NODE_ENV !== 'production';
const port = isDev ? 3000 : (process.env.PORT || 3000);

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Cache for alerts
let cachedAlerts: any[] = [];
let lastAlertsFetchTime = 0;

// Lead storage (persisted in data/leads.json so it survives restarts)
interface LeadSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  source: string;
  profile: string;
  date: string;
}

const leadsDir = path.join(__dirname, 'data');
const leadsFile = path.join(leadsDir, 'leads.json');

function loadLeads(): LeadSubmission[] {
  try {
    if (fs.existsSync(leadsFile)) {
      const raw = fs.readFileSync(leadsFile, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as LeadSubmission[];
    }
  } catch (e) {
    console.error('Unable to load leads file:', e);
  }
  return [];
}

function persistLeads(leads: LeadSubmission[]): void {
  try {
    fs.mkdirSync(leadsDir, { recursive: true });
    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (e) {
    console.error('Unable to persist leads:', e);
  }
}

let leadSubmissions: LeadSubmission[] = loadLeads();

// Gemini-powered real-time alert generator
async function getFoodSafetyAlerts(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedAlerts.length > 0 && (now - lastAlertsFetchTime < 1000 * 60 * 15)) {
    return cachedAlerts;
  }

  try {
    const prompt = `Agis en tant qu'analyste réglementaire senior en sécurité des aliments (food safety) pour VisiPilot.
IMPORTANT : ces alertes sont des EXEMPLES DE DÉMONSTRATION inspirés de faits réels et vérifiables.
N'invente AUCUNE référence juridique (numéro de règlement, CELEX, article, NOR) : utilise uniquement des références réelles et reconnues (ex : Règlement (CE) 178/2002, Règlement (CE) 2073/2005, Règlement (UE) 2023/915, Règlement (UE) 2017/625, Règlement (UE) 2025/40, 21 CFR Part 1 Subpart S) ou des mentions génériques si tu hésites.
Génère un tableau JSON de 8 alertes et veilles réglementaires récentes et réalistes en sécurité sanitaire des aliments (microbiologie, contaminants chimiques, PFAS, allergènes, étiquetage, rappels RASFF / FDA / RappelConso).
Chaque objet doit comporter :
- id (string ex: 'alert-01')
- title (string : titre précis, technique et impactant en français)
- source (string ex: 'Règlement (UE) 2024/1102 · Journal Officiel UE', 'Notification RASFF 2026.4912', 'FDA CFSAN 21 CFR Part 117', 'Avis ANSES n°2026-SA-0084', 'DGAL Instruction technique')
- legal_ref (string : référence de loi ou norme ex: 'Règlement (CE) 178/2002', 'Règlement (UE) 2023/915', 'FSMA 204 Rule', 'Règlement (CE) 2073/2005')
- pays (string : 'UE', 'FR', 'US', 'UK', 'DE', ou 'INT')
- date (ISO string récente)
- severity (string : 'critical', 'high', 'medium', 'low')
- secteur (string : 'Produits Laitiers', 'Viandes & Traiteur', 'Épicerie & Épices', 'Produits de la Mer', 'Emballages & MOCA', 'Fruits & Légumes', 'Multi-secteurs')
- hazard_category (string : 'Pathogène / Microbiologique', 'Chimique & Contaminants', 'Allergènes & INCO', 'Matériaux de Contact & PFAS', 'Fraude & Traçabilité')
- summary (string : 2 à 3 phrases claires expliquant le fait réglementaire ou le retrait sanitaire)
- impact (string : l'impact opérationnel précis pour les usines, les acheteurs et la R&D)
- recommendation (string : la mesure corrective préconisée par VisiPilot pour sécuriser les audits GFSI / IFS / BRCGS)
- visipilot_tool (string : 'VisiPLM' ou 'VISITrack' ou 'VISIcat' ou 'VisiTact' ou 'VisiVal' ou 'VisiPact')
- url (string vers source officielle)

Renvoie UNIQUEMENT le tableau JSON sans texte avant ni après.`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = result.text || '';
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanedText);
    if (Array.isArray(parsed) && parsed.length > 0) {
      cachedAlerts = parsed;
      lastAlertsFetchTime = now;
      return cachedAlerts;
    }
  } catch (error: any) {
    console.error('Error fetching alerts with Gemini, using vetted fallback:', error.message || error);
  }

  // Robust verified fallback alerts
  cachedAlerts = [
    {
      id: 'alert-01',
      title: 'Mise à jour des critères Listeria monocytogenes pour les denrées prêtes à consommer (Règlement CE 2073/2005)',
      source: 'Journal Officiel de l\'Union Européenne (EUR-Lex)',
      legal_ref: 'Règlement (CE) n° 2073/2005 modifié par le Règlement (UE) 2024/2895',
      pays: 'UE',
      date: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      severity: 'critical',
      secteur: 'Viandes & Traiteur',
      hazard_category: 'Pathogène / Microbiologique',
      summary: 'Le critère Listeria monocytogenes des denrées prêtes à consommer évolue vers l\'absence dans 25 g, avec validation par challenge-tests (référentiel ISO 20976-1). Le Règlement (UE) 2024/2895 modifie le Règlement (CE) 2073/2005 : échéance de conformité au 1er juillet 2026.',
      impact: 'Nécessité de réviser immédiatement les dossiers de validation de DLC de tous les produits tranchés ou conditionnés sous atmosphère protectrice.',
      recommendation: 'Réaliser un audit de validation des challenge-tests et renforcer les plans de prélèvements de surface sur les lignes de conditionnement.',
      visipilot_tool: 'VisiTact',
      url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32024R2895'
    },
    {
      id: 'alert-02',
      title: 'Restriction d\'usage et nouvelles LMR pour les substances PFAS dans les emballages alimentaires (MOCA)',
      source: 'Commission Européenne & Agence Européenne des Produits Chimiques (ECHA)',
      legal_ref: 'Règlement (CE) n° 1935/2004 & REACH Annexe XVII',
      pays: 'UE',
      date: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      severity: 'high',
      secteur: 'Emballages & MOCA',
      hazard_category: 'Matériaux de Contact & PFAS',
      summary: 'Adoption du calendrier d\'interdiction progressive des composés per- et polyfluoroalkylés (PFAS) utilisés comme barrières oléophobes dans les papiers, cartons et opercules plastiques.',
      impact: 'Obligation d\'obtenir des certificats de conformité vierges de PFAS auprès des fournisseurs de conditionnement sous peine de non-conformité majeure IFS / BRCGS.',
      recommendation: 'Lancer une campagne de collecte d\'attestations et d\'analyses de migration spécifique via le portail VisiPact.',
      visipilot_tool: 'VisiPact',
      url: 'https://echa.europa.eu'
    },
    {
      id: 'alert-03',
      title: 'FDA FSMA Rule 204 — Registres électroniques des événements de traçabilité critiques (KDE)',
      source: 'US Federal Register · Food and Drug Administration',
      legal_ref: '21 CFR Part 1, Subpart S (Règle 204 FSMA — Kritical Data Elements)',
      pays: 'US',
      date: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      severity: 'critical',
      secteur: 'Produits Laitiers',
      hazard_category: 'Fraude & Traçabilité',
      summary: 'Tout exploitant de denrées à haut risque (légumes-feuilles, fromages à croûte naturelle, purées de fruits à coque, mollusques, poissons entiers) doit tenir un registre électronique des événements de traçabilité critiques (KDE) et le transmettre à la FDA sous 24 h sur demande.',
      impact: 'Tout manquement entraîne la rétention douanière sans examen physique (DWPE - Detention Without Physical Examination).',
      recommendation: 'Connecter les numéros de lots de fabrication au registre centralisé VISITrack pour générer l\'export standardisé FDA en un clic.',
      visipilot_tool: 'VISITrack',
      url: 'https://www.fda.gov/food'
    },
    {
      id: 'alert-04',
      title: 'Alerte RappelConso : Présence d\'Ochratoxine A au-delà du seuil maximal dans des lots de piments séchés',
      source: 'RappelConso · DGCCRF',
      legal_ref: 'Règlement (UE) 2023/915 relatif aux teneurs maximales en contaminants',
      pays: 'FR',
      date: new Date(Date.now() - 1000 * 60 * 520).toISOString(),
      severity: 'high',
      secteur: 'Épicerie & Épices',
      hazard_category: 'Chimique & Contaminants',
      summary: 'Retrait du marché de plusieurs lots d\'épices suite à un autocontrôle révélant une teneur en mycotoxines supérieure à la teneur maximale réglementaire applicable (Annexe I du Règlement (UE) 2023/915).',
      impact: 'Blocage des stocks des matières premières associées et mise en quarantaine des produits finis incorporant ce lot.',
      recommendation: 'Déclencher la procédure de non-conformité dans VISIcat et notifier immédiatement les clients ayant reçu les assemblages concernés.',
      visipilot_tool: 'VISIcat',
      url: 'https://rappel.conso.gouv.fr'
    },
    {
      id: 'alert-05',
      title: 'Étiquetage préventif de traces d\'arachide et de fruits à coque — bases quantitatives de type VITAL',
      source: 'EFSA NDA Panel & DGAL Note de service',
      legal_ref: 'Règlement (UE) n° 1169/2011 (INCO) & Codex Alimentarius',
      pays: 'UE',
      date: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
      severity: 'medium',
      secteur: 'Multi-secteurs',
      hazard_category: 'Allergènes & INCO',
      summary: 'Tendance réglementaire et scientifique (EFSA / ANSES) à fonder l\'étiquetage préventif de traces d\'allergènes sur une analyse quantitative du risque plutôt que sur des mentions systématiques : le référentiel VITAL (doses de référence, développé par l\'ANSES et largement adopté par l\'industrie) en constitue la méthode de référence, sans valeur de texte contraignant.',
      impact: 'Audit des lignes polyvalentes et mise à jour des maquettes d\'étiquetage dans le module recette VisiPLM.',
      recommendation: 'Effectuer les calculs de dose ingérée de référence et valider l\'efficacité du nettoyage par tests bandelettes immuno-enzymatiques.',
      visipilot_tool: 'VisiPLM',
      url: 'https://www.efsa.europa.eu'
    },
    {
      id: 'alert-06',
      title: 'UK BTOM — Contrôles physiques et documentaires sur les produits carnés et halieutiques importés',
      source: 'UK Department for Environment, Food and Rural Affairs (DEFRA)',
      legal_ref: 'UK Border Target Operating Model (BTOM)',
      pays: 'UK',
      date: new Date(Date.now() - 1000 * 60 * 940).toISOString(),
      severity: 'medium',
      secteur: 'Produits de la Mer',
      hazard_category: 'Fraude & Traçabilité',
      summary: 'Entrée en vigueur des taux de contrôle renforcés aux postes d\'inspection frontaliers britanniques (BCP). Nécessité d\'un certificat sanitaire d\'exportation (EHC) dématérialisé conforme.',
      impact: 'Ralentissement logistique potentiel pour les produits ultra-frais en transit transmanche.',
      recommendation: 'Pré-enregistrer systématiquement les envois sur IPAFFS et auditer les déclarations en douane via VisiPilot.',
      visipilot_tool: 'VISITrack',
      url: 'https://www.food.gov.uk'
    }
  ];
  lastAlertsFetchTime = now;
  return cachedAlerts;
}

// ─── API ROUTES ───

// Regulatory sources list & search
app.get('/api/sources', (req, res) => {
  const { pays, type, q, availability } = req.query;
  let sources = [...REGULATORY_SOURCES];

  const totalInCatalog = REGULATORY_SOURCES.length;
  const totalAvailable = REGULATORY_SOURCES.filter(s => s.isAvailableInApp).length;
  const totalInIntegration = REGULATORY_SOURCES.filter(s => !s.isAvailableInApp).length;

  if (availability === 'AVAILABLE') {
    sources = sources.filter(s => s.isAvailableInApp);
  } else if (availability === 'UNAVAILABLE') {
    sources = sources.filter(s => !s.isAvailableInApp);
  }

  if (pays && pays !== 'ALL') {
    sources = sources.filter(s => s.pays === pays);
  }

  if (type && type !== 'ALL') {
    sources = sources.filter(s => s.type === type);
  }

  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    sources = sources.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.organization.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query) ||
      s.provenance.toLowerCase().includes(query) ||
      s.regulationsCovered.some(r => r.toLowerCase().includes(query))
    );
  }

  res.json({
    total: sources.length,
    stats: {
      totalInCatalog,
      totalAvailable,
      totalInIntegration
    },
    sources
  });
});

// Alerts list with filtering
app.get('/api/alerts', async (req, res) => {
  const { force } = req.query;
  const alerts = await getFoodSafetyAlerts(force === 'true');
  const { urgency, secteur, q } = req.query;

  let filtered = [...alerts];
  if (urgency && urgency !== 'ALL') {
    filtered = filtered.filter(a => a.severity === urgency);
  }
  if (secteur && secteur !== 'ALL') {
    filtered = filtered.filter(a => a.secteur === secteur || a.secteur === 'Multi-secteurs');
  }
  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(query) ||
      a.summary.toLowerCase().includes(query) ||
      a.legal_ref.toLowerCase().includes(query) ||
      a.hazard_category.toLowerCase().includes(query)
    );
  }

  res.json({
    count: filtered.length,
    alerts: filtered
  });
});

// Diagnostic case profiles
app.get('/api/diagnostic-profiles', (req, res) => {
  res.json(DIAGNOSTIC_PROFILES);
});

// Regulatory Intelligence Engine : Official Texts (EUR-Lex / Cellar & Légifrance / PISTE)
app.get('/api/regulatory/texts', (req, res) => {
  const { jurisdiction, domain, status, q } = req.query;
  let texts = [...OFFICIAL_REGULATORY_TEXTS];

  if (jurisdiction && jurisdiction !== 'ALL') {
    texts = texts.filter(t => t.jurisdiction === jurisdiction);
  }

  if (domain && domain !== 'ALL') {
    texts = texts.filter(t => t.domainId === domain);
  }

  const ALLOWED_STATUSES: string[] = ['NOUVEAU', 'MODIFIÉ', 'CONSOLIDÉ', 'EN VIGUEUR', 'ABROGÉ'];
  const statusParam = typeof status === 'string' ? status : undefined;
  if (statusParam && statusParam !== 'ALL' && ALLOWED_STATUSES.includes(statusParam)) {
    texts = texts.filter(t => t.status === statusParam);
  }

  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    texts = texts.filter(t => 
      t.title.toLowerCase().includes(query) ||
      t.legalReference.toLowerCase().includes(query) ||
      t.celexOrNor.toLowerCase().includes(query) ||
      t.subDomain.toLowerCase().includes(query) ||
      t.articlesImpactSummary.toLowerCase().includes(query) ||
      t.modifiedArticles.some(a => a.toLowerCase().includes(query)) ||
      t.affectedProducts.some(p => p.toLowerCase().includes(query))
    );
  }

  const stats = {
    total: OFFICIAL_REGULATORY_TEXTS.length,
    ueCount: OFFICIAL_REGULATORY_TEXTS.filter(t => t.jurisdiction === 'UE').length,
    frCount: OFFICIAL_REGULATORY_TEXTS.filter(t => t.jurisdiction === 'FR').length,
    nouveauCount: OFFICIAL_REGULATORY_TEXTS.filter(t => t.status === 'NOUVEAU').length,
    modifieCount: OFFICIAL_REGULATORY_TEXTS.filter(t => t.status === 'MODIFIÉ').length,
    consolideCount: OFFICIAL_REGULATORY_TEXTS.filter(t => t.status === 'CONSOLIDÉ').length,
    enVigueurCount: OFFICIAL_REGULATORY_TEXTS.filter(t => t.status === 'EN VIGUEUR').length
  };

  res.json({
    total: texts.length,
    stats,
    texts
  });
});

// Regulatory Domains (6 core domains)
app.get('/api/regulatory/domains', (req, res) => {
  res.json(REGULATORY_DOMAINS);
});

// Ingestion Pipelines architecture (Cellar SPARQL/Atom & Légifrance PISTE)
app.get('/api/regulatory/pipelines', (req, res) => {
  res.json(INGESTION_PIPELINES);
});

// Pricing plans
app.get('/api/plans', (req, res) => {
  res.json(PRICING_PLANS);
});

// Contact lead / Expert callback request
app.post('/api/contact-lead', (req, res) => {
  const { name, email, phone, company, message, source, profile } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Nom et email professionnel requis.' });
  }

  const submission = {
    id: 'lead-' + Date.now(),
    name,
    email,
    phone: phone || '',
    company: company || '',
    message: message || '',
    source: source || 'rappel-expert',
    profile: profile || 'standard',
    date: new Date().toISOString()
  };

  leadSubmissions.push(submission);
  persistLeads(leadSubmissions);
  console.log('New lead registered:', submission);

  res.json({
    success: true,
    message: 'Votre demande a bien été transmise à l\'équipe VisiPilot. Un expert vous recontactera sous 48h ouvrées.',
    leadId: submission.id
  });
});

// Ask AI about regulatory compliance
app.post('/api/ask-regulatory', async (req, res) => {
  const { question, secteur, pays } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Une question est requise.' });
  }

  try {
    const prompt = `Tu es l'expert réglementaire en sécurité des aliments (Food Safety Regulatory Specialist) de VisiPilot.
L'utilisateur pose une question de conformité réglementaire :
Question : "${question}"
Secteur : "${secteur || 'Agroalimentaire général'}"
Pays / Zone : "${pays || 'Union Européenne & France'}"

Fournis une réponse professionnelle, précise, structurée et directement applicable en usine ou en laboratoire qualité.
La réponse doit comprendre :
1. Le cadre légal applicable (avec les numéros exacts des Règlements UE, lois ou normes ex: CE 178/2002, CE 2073/2005, CE 1935/2004, FDA 21 CFR, etc.).
2. Les exigences clés et les seuils à respecter.
3. Les risques en cas de non-conformité (retrait-rappel, sanctions pénales, audits GFSI).
4. La recommandation concrète VisiPilot (procédure HACCP, plan de contrôle, traçabilité).

Sois concis, pragmatique, sans jargon inutile, dans le ton d'excellence opérationnelle de VisiPilot.`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({
      answer: result.text || 'Réponse générée par l\'expertise réglementaire VisiPilot.'
    });
  } catch (error: any) {
    console.error('Error generating regulatory answer:', error);
    res.status(500).json({
      error: 'Erreur lors de la consultation réglementaire. Veuillez réessayer.'
    });
  }
});

// Server startup with Vite middlewares in development
async function startServer() {
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`FoodSafetyWatch server running at http://localhost:${port}`);
  });
}

startServer();
