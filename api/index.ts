import { REGULATORY_SOURCES, DIAGNOSTIC_PROFILES, PRICING_PLANS } from '../src/data/sourcesData.js';
import { REGULATORY_DOMAINS, OFFICIAL_REGULATORY_TEXTS, OFFICIAL_REGULATORY_TEXTS_2026_2027, INGESTION_PIPELINES } from '../src/data/regulatoryEngineData.js';

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
    return Response.json(DIAGNOSTIC_PROFILES);
  }

  if (path === '/api/regulatory/texts') {
    const [realTexts, staticTexts] = await Promise.all([
      Promise.all([fetchEURLEXTexts(), fetchLegifranceTexts()]).then(([eurlex, legifrance]) => [...eurlex, ...legifrance]),
      Promise.resolve([...OFFICIAL_REGULATORY_TEXTS, ...OFFICIAL_REGULATORY_TEXTS_2026_2027])
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
    return Response.json(REGULATORY_DOMAINS);
  }

  if (path === '/api/regulatory/pipelines') {
    return Response.json(INGESTION_PIPELINES);
  }

  if (path === '/api/plans') {
    return Response.json(PRICING_PLANS);
  }

  return Response.json({ error: 'Not found' }, { status: 404 });
}
