import express from 'express';
import { REGULATORY_SOURCES, DIAGNOSTIC_PROFILES, PRICING_PLANS } from '../src/data/sourcesData.js';
import { REGULATORY_DOMAINS, OFFICIAL_REGULATORY_TEXTS, INGESTION_PIPELINES } from '../src/data/regulatoryEngineData.js';

const app = express();
app.use(express.json());

// ─── REAL DATA CONNECTORS ───

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
      signal: AbortSignal.timeout(8000),
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

// ─── API ROUTES ───

app.get('/api/sources', (req, res) => {
  res.json({ total: REGULATORY_SOURCES.length, sources: REGULATORY_SOURCES });
});

app.get('/api/alerts', async (req, res) => {
  const { force } = req.query;
  const [realAlerts, fallbackAlerts] = await Promise.all([
    Promise.all([fetchFDAEnforcement(), fetchRASFFNotifications()]).then(([fda, rasff]) => [...fda, ...rasff]),
    Promise.resolve([])
  ]);
  const alerts = [...realAlerts, ...fallbackAlerts];
  const { urgency, secteur, q } = req.query;
  let filtered = [...alerts];
  if (urgency && urgency !== 'ALL') filtered = filtered.filter((a: any) => a.severity === urgency);
  if (secteur && secteur !== 'ALL') filtered = filtered.filter((a: any) => a.secteur === secteur || a.secteur === 'Multi-secteurs');
  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    filtered = filtered.filter((a: any) =>
      a.title.toLowerCase().includes(query) ||
      a.summary.toLowerCase().includes(query) ||
      a.legal_ref.toLowerCase().includes(query) ||
      a.hazard_category.toLowerCase().includes(query)
    );
  }
  res.json({ count: filtered.length, alerts: filtered });
});

app.get('/api/diagnostic-profiles', (req, res) => {
  res.json(DIAGNOSTIC_PROFILES);
});

app.get('/api/regulatory/texts', async (req, res) => {
  const { jurisdiction, domain, status, q } = req.query;
  const [realTexts, staticTexts] = await Promise.all([
    fetchEURLEXTexts(),
    Promise.resolve([...OFFICIAL_REGULATORY_TEXTS])
  ]);
  let texts = [...realTexts, ...staticTexts];
  if (jurisdiction && jurisdiction !== 'ALL') texts = texts.filter((t: any) => t.jurisdiction === jurisdiction);
  if (domain && domain !== 'ALL') texts = texts.filter((t: any) => t.domainId === domain);
  const ALLOWED_STATUSES = ['NOUVEAU', 'MODIFIÉ', 'CONSOLIDÉ', 'EN VIGUEUR', 'ABROGÉ'];
  const statusParam = typeof status === 'string' ? status : undefined;
  if (statusParam && statusParam !== 'ALL' && ALLOWED_STATUSES.includes(statusParam)) {
    texts = texts.filter((t: any) => t.status === statusParam);
  }
  if (q && typeof q === 'string') {
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
  res.json({ total: texts.length, stats, texts });
});

app.get('/api/regulatory/domains', (req, res) => {
  res.json(REGULATORY_DOMAINS);
});

app.get('/api/regulatory/pipelines', (req, res) => {
  res.json(INGESTION_PIPELINES);
});

app.get('/api/plans', (req, res) => {
  res.json(PRICING_PLANS);
});

export default app;
