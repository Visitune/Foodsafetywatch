import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  User, 
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Clock,
  Filter,
  FileText,
  AlertTriangle,
  Zap,
  Info,
  ChevronDown,
  LayoutGrid,
  List,
  CheckCircle2,
  Globe2,
  SlidersHorizontal,
  Download,
  Calendar,
  Layers,
  Sparkles,
  PhoneCall,
  X,
  Send,
  Building,
  ArrowRight,
  Database,
  Lock,
  Cpu,
  BookOpen,
  HelpCircle,
  FileCheck,
  Scale,
  Terminal,
  Code2,
  ArrowUpDown,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  REGULATORY_SOURCES, 
  DIAGNOSTIC_PROFILES, 
  PRICING_PLANS,
  RegulatorySource,
  DiagnosticCaseProfile 
} from './data/sourcesData.js';
import { 
  REGULATORY_DOMAINS, 
  OFFICIAL_REGULATORY_TEXTS, 
  INGESTION_PIPELINES,
  OfficialRegulatoryText,
  RegulatoryDomain,
  IngestionPipelineArchitecture
} from './data/regulatoryEngineData.js';

interface AlertItem {
  id: string;
  title: string;
  source: string;
  legal_ref: string;
  pays: string;
  date: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  secteur: string;
  hazard_category: string;
  summary: string;
  impact: string;
  recommendation: string;
  visipilot_tool?: string;
  url: string;
}

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'accueil' | 'engine' | 'sources' | 'diagnostic' | 'veille' | 'tarifs' | 'portail'>('accueil');
  const [currentLang, setCurrentLang] = useState<'FR' | 'EN' | 'DE' | 'ES'>('FR');
  
  // Data states
  const [sources, setSources] = useState<RegulatorySource[]>(REGULATORY_SOURCES);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState<boolean>(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('traiteur_salaisons');
  
  // Regulatory Intelligence Engine States (Socle EUR-Lex / Cellar + Légifrance / PISTE)
  const [engineLevel, setEngineLevel] = useState<1 | 2 | 3>(1);
  const [engineJurisdiction, setEngineJurisdiction] = useState<'ALL' | 'UE' | 'FR'>('ALL');
  const [engineDomain, setEngineDomain] = useState<string>('ALL');
  const [engineStatus, setEngineStatus] = useState<string>('ALL');
  const [engineSearch, setEngineSearch] = useState<string>('');
  const [regulatoryTexts, setRegulatoryTexts] = useState<OfficialRegulatoryText[]>(OFFICIAL_REGULATORY_TEXTS);
  const [selectedTextDetail, setSelectedTextDetail] = useState<OfficialRegulatoryText | null>(null);
  const [showArchitectureModal, setShowArchitectureModal] = useState<boolean>(false);

  // Sources search & filter states
  const [sourceSearch, setSourceSearch] = useState<string>('');
  const [sourcePaysFilter, setSourcePaysFilter] = useState<string>('ALL');
  const [sourceTypeFilter, setSourceTypeFilter] = useState<string>('ALL');
  const [sourceAvailabilityFilter, setSourceAvailabilityFilter] = useState<'ALL' | 'AVAILABLE' | 'UPCOMING'>('ALL');
  const [selectedSourceDetail, setSelectedSourceDetail] = useState<RegulatorySource | null>(null);
  
  // AI Regulatory Assistant states
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  
  // Alerts view states
  const [alertSearch, setAlertSearch] = useState<string>('');
  const [alertUrgencyFilter, setAlertUrgencyFilter] = useState<string>('ALL');
  const [alertSecteurFilter, setAlertSecteurFilter] = useState<string>('ALL');
  const [alertViewMode, setAlertViewMode] = useState<'list' | 'grid'>('list');
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  // Client Portal states
  const [activeSourcesInPerimeter, setActiveSourcesInPerimeter] = useState<string[]>([
    'joue-eurlex', 'rasff-portal', 'efsa-opinions', 'dgal-bulletins', 'rappel-conso', 'fda-food', 'gfsi-standards'
  ]);
  const [monitoredSectors, setMonitoredSectors] = useState<string[]>([
    'Viandes, Volailles & Charcuterie', 'Produits Laitiers & Fromages', 'Matériaux au Contact (MOCA / PFAS)'
  ]);
  const [exportCountries, setExportCountries] = useState<string[]>(['France', 'Union Européenne', 'États-Unis']);
  const [importCountries, setImportCountries] = useState<string[]>(['Espagne', 'Inde', 'Pays-Bas']);
  const [certificationsHeld, setCertificationsHeld] = useState<string[]>(['IFS Food v8', 'Bio UE']);
  const [portalSubTab, setPortalSubTab] = useState<'dashboard' | 'perimetre' | 'bulletins' | 'alertes' | 'abonnement'>('dashboard');

  // Callback modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [callbackForm, setCallbackForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [callbackSubmitting, setCallbackSubmitting] = useState<boolean>(false);
  const [callbackSuccess, setCallbackSuccess] = useState<boolean>(false);
  
  // Mobile responsiveness hamburger state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Simplified View state
  const [simplifiedView, setSimplifiedView] = useState<boolean>(false);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch initial alerts & sources & regulatory texts
  useEffect(() => {
    fetchAlerts();
    fetchSources();
    fetchRegulatoryTexts();
  }, []);

  const fetchRegulatoryTexts = async () => {
    try {
      const res = await fetch('/api/regulatory/texts');
      if (res.ok) {
        const data = await res.json();
        if (data.texts && data.texts.length > 0) {
          setRegulatoryTexts(data.texts);
        }
      }
    } catch (e) {
      console.error('Error fetching regulatory texts:', e);
    }
  };

  const fetchSources = async () => {
    try {
      const res = await fetch('/api/sources');
      if (res.ok) {
        const data = await res.json();
        if (data.sources && data.sources.length > 0) {
          setSources(data.sources);
        }
      }
    } catch (e) {
      console.error('Error fetching sources:', e);
    }
  };

  const fetchAlerts = async (force = false) => {
    setLoadingAlerts(true);
    try {
      const res = await fetch(`/api/alerts?force=${force}`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch (e) {
      console.error('Error fetching alerts:', e);
    } finally {
      setLoadingAlerts(false);
    }
  };

  // Handle Callback Request submit
  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackForm.name || !callbackForm.email || !callbackForm.phone) {
      alert('Veuillez renseigner votre nom, email et téléphone.');
      return;
    }
    setCallbackSubmitting(true);
    try {
      const res = await fetch('/api/contact-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(callbackForm)
      });
      if (res.ok) {
        setCallbackSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setCallbackSuccess(false);
          setCallbackForm({ name: '', email: '', phone: '', company: '', message: '' });
          showToast('Demande envoyée ! Un expert VisiPilot vous contactera sous 48h.');
        }, 2200);
      }
    } catch (err) {
      console.error('Error submitting callback:', err);
    } finally {
      setCallbackSubmitting(false);
    }
  };

  // Handle AI Consultation
  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    setAiAnswer(null);
    try {
      const res = await fetch('/api/ask-regulatory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: aiQuestion,
          secteur: monitoredSectors.join(', '),
          pays: exportCountries.join(', ')
        })
      });
      const data = await res.json();
      setAiAnswer(data.answer || 'Aucune réponse générée.');
    } catch (err) {
      console.error('Error querying AI:', err);
      setAiAnswer('Erreur de connexion au moteur réglementaire. Veuillez réessayer.');
    } finally {
      setAiLoading(false);
    }
  };

  // Filtered sources
  const filteredSources = useMemo(() => {
    return sources.filter(s => {
      const matchPays = sourcePaysFilter === 'ALL' || s.pays === sourcePaysFilter;
      const matchType = sourceTypeFilter === 'ALL' || s.type === sourceTypeFilter;
      const matchAvailability = 
        sourceAvailabilityFilter === 'ALL' ||
        (sourceAvailabilityFilter === 'AVAILABLE' && s.isAvailableInApp) ||
        (sourceAvailabilityFilter === 'UPCOMING' && !s.isAvailableInApp);

      const q = sourceSearch.toLowerCase().trim();
      const matchSearch = !q || (
        s.name.toLowerCase().includes(q) ||
        s.organization.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.provenance.toLowerCase().includes(q) ||
        s.regulationsCovered.some(r => r.toLowerCase().includes(q))
      );
      return matchPays && matchType && matchAvailability && matchSearch;
    });
  }, [sources, sourcePaysFilter, sourceTypeFilter, sourceAvailabilityFilter, sourceSearch]);

  // Source availability stats
  const sourceStats = useMemo(() => {
    const total = sources.length;
    const available = sources.filter(s => s.isAvailableInApp).length;
    const upcoming = total - available;
    return { total, available, upcoming };
  }, [sources]);

  // Regulatory Intelligence Engine Filtered Texts
  const filteredRegulatoryTexts = useMemo(() => {
    return regulatoryTexts.filter(t => {
      const matchJur = engineJurisdiction === 'ALL' || t.jurisdiction === engineJurisdiction;
      const matchDom = engineDomain === 'ALL' || t.domainId === engineDomain;
      const matchStat = engineStatus === 'ALL' || t.status === engineStatus;
      const q = engineSearch.toLowerCase().trim();
      const matchSearch = !q || (
        t.title.toLowerCase().includes(q) ||
        t.legalReference.toLowerCase().includes(q) ||
        t.celexOrNor.toLowerCase().includes(q) ||
        t.subDomain.toLowerCase().includes(q) ||
        t.articlesImpactSummary.toLowerCase().includes(q) ||
        t.affectedProducts.some(p => p.toLowerCase().includes(q)) ||
        t.modifiedArticles.some(a => a.toLowerCase().includes(q))
      );
      return matchJur && matchDom && matchStat && matchSearch;
    });
  }, [regulatoryTexts, engineJurisdiction, engineDomain, engineStatus, engineSearch]);

  // Regulatory Engine Summary Stats
  const engineStats = useMemo(() => {
    const total = regulatoryTexts.length;
    const ueCount = regulatoryTexts.filter(t => t.jurisdiction === 'UE').length;
    const frCount = regulatoryTexts.filter(t => t.jurisdiction === 'FR').length;
    const nouveauCount = regulatoryTexts.filter(t => t.status === 'NOUVEAU').length;
    const modifieCount = regulatoryTexts.filter(t => t.status === 'MODIFIÉ').length;
    const consolideCount = regulatoryTexts.filter(t => t.status === 'CONSOLIDÉ').length;
    return { total, ueCount, frCount, nouveauCount, modifieCount, consolideCount };
  }, [regulatoryTexts]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      const matchUrgency = alertUrgencyFilter === 'ALL' || a.severity === alertUrgencyFilter;
      const matchSecteur = alertSecteurFilter === 'ALL' || a.secteur === alertSecteurFilter || a.secteur === 'Multi-secteurs';
      const q = alertSearch.toLowerCase().trim();
      const matchSearch = !q || (
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.legal_ref.toLowerCase().includes(q) ||
        a.hazard_category.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q)
      );
      return matchUrgency && matchSecteur && matchSearch;
    });
  }, [alerts, alertUrgencyFilter, alertSecteurFilter, alertSearch]);

  // Toggle source in perimeter
  const toggleSourceInPerimeter = (sourceId: string) => {
    setActiveSourcesInPerimeter(prev => {
      if (prev.includes(sourceId)) {
        showToast('Source retirée de votre périmètre');
        return prev.filter(id => id !== sourceId);
      } else {
        showToast('Source ajoutée à votre périmètre de veille');
        return [...prev, sourceId];
      }
    });
  };

  // Severity styles
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-700 bg-red-50 border border-red-200/80 font-bold';
      case 'high':
        return 'text-orange-700 bg-orange-50 border border-orange-200/80 font-bold';
      case 'medium':
        return 'text-amber-800 bg-amber-50 border border-amber-200/80 font-bold';
      default:
        return 'text-blue-700 bg-blue-50 border border-blue-200/80 font-bold';
    }
  };

  const currentProfile = DIAGNOSTIC_PROFILES.find(p => p.id === selectedProfileId) || DIAGNOSTIC_PROFILES[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-orange-500/20 font-sans">
      
      {/* Toast Notification — Light-themed & crisp */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-xl text-xs font-semibold text-slate-900"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HEADER / NAVIGATION (Top Bar Contract: Bright Light mode, Single-element Brand, 3-Zones) ─── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Zone (Zone 1) — Single-element Wordmark/Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setActiveTab('accueil');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-left focus:outline-none group transition-all"
              title="FoodSafetyWatch par VisiPilot - Accueil"
            >
              {/* Logo VisiPilot Officiel on pure white */}
              <div className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-[1.02] transition-transform">
                <img 
                  src="/logovisipilot.png" 
                  alt="VisiPilot Logo" 
                  className="h-8 md:h-9 w-auto object-contain"
                />
              </div>

              {/* Fine vertical divider */}
              <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

              {/* Title & Micro tag */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-[#EA580C] transition-colors">
                    FoodSafety<span className="text-[#EA580C]">Watch</span>
                  </span>
                  <span className="text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded bg-orange-100 text-[#EA580C] border border-orange-200">
                    v2.5
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] mt-0.5 text-slate-500 font-medium">
                  <span>Veille Réglementaire & Sanitaire</span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-emerald-600 font-mono-code font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {sourceStats.available} sources actives
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Navigation Links (Zone 2) — Clean modern text links with hover effect */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/50">
            <button 
              onClick={() => setActiveTab('accueil')}
              className={`px-3 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'accueil' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Accueil
            </button>
            <button 
              onClick={() => setActiveTab('engine')}
              className={`px-3 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'engine' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Moteur Juridique</span>
              <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-mono-code font-bold ${
                activeTab === 'engine' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {regulatoryTexts.length}
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('sources')}
              className={`px-3 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'sources' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Sources</span>
              <span className={`px-1.5 py-0.5 text-[9px] rounded-full font-mono-code font-bold ${
                activeTab === 'sources' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {sources.length}
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('veille')}
              className={`px-3 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'veille' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Alertes RASFF</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            </button>
            <button 
              onClick={() => setActiveTab('diagnostic')}
              className={`px-3 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'diagnostic' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Cas Réels</span>
            </button>
            <button 
              onClick={() => setActiveTab('tarifs')}
              className={`px-3 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'tarifs' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Tarifs
            </button>
            <button 
              onClick={() => setActiveTab('portail')}
              className={`px-3 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'portail' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Portail
            </button>
          </nav>

          {/* Action CTAs (Zone 3) — Clean and well spaced */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* View Toggle */}
            <button
              onClick={() => {
                setSimplifiedView(!simplifiedView);
                showToast(simplifiedView ? "Affichage détaillé activé" : "Affichage simplifié épuré activé");
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-bold transition-all shadow-2xs ${
                simplifiedView 
                  ? 'bg-amber-50 border-amber-300 text-amber-800' 
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
              title={simplifiedView ? "Passer en affichage détaillé" : "Passer en affichage épuré simplifié"}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{simplifiedView ? "Affichage épuré" : "Affichage complet"}</span>
            </button>

            {/* Language Picker */}
            <div className="flex items-center gap-1 text-xs font-mono-code bg-slate-100 border border-slate-200/60 px-1.5 py-1 rounded-lg">
              {(['FR', 'EN', 'DE'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => {
                    setCurrentLang(lang);
                    showToast(`Langue sélectionnée : ${lang}`);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    currentLang === lang ? 'bg-[#EA580C] text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Quick Callback CTA */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 hover:border-[#EA580C] text-slate-600 hover:text-slate-900 rounded-lg text-xs font-bold transition-all bg-white"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Rappel expert</span>
            </button>

            {/* Premium CTA */}
            <button
              onClick={() => setActiveTab('tarifs')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#EA580C] hover:bg-[#c2410c] text-white rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all shadow-xs"
            >
              <span>Essai Gratuit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hamburger / Menu toggle button for Mobile/Tablet */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 border border-slate-200 rounded-lg bg-white text-[#EA580C]"
              title="Rappel expert"
            >
              <PhoneCall className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              aria-label="Menu Principal"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5 text-[#EA580C]" />}
            </button>
          </div>

        </div>

        {/* ─── MOBILE DRAWER MENU (Responsive & Clean: Light Theme) ─── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-slate-200 shadow-lg overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4 text-sm font-medium border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => { setActiveTab('accueil'); setMobileMenuOpen(false); }}
                    className={`p-3 rounded-lg text-xs font-bold uppercase text-center border transition-all ${activeTab === 'accueil' ? 'bg-orange-50 border-orange-200 text-[#EA580C]' : 'border-slate-100 text-slate-700 bg-slate-50'}`}
                  >
                    Accueil
                  </button>
                  <button 
                    onClick={() => { setActiveTab('engine'); setMobileMenuOpen(false); }}
                    className={`p-3 rounded-lg text-xs font-bold uppercase text-center border flex items-center justify-center gap-1.5 transition-all ${activeTab === 'engine' ? 'bg-orange-50 border-orange-200 text-[#EA580C]' : 'border-slate-100 text-slate-700 bg-slate-50'}`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    Moteur ({regulatoryTexts.length})
                  </button>
                  <button 
                    onClick={() => { setActiveTab('sources'); setMobileMenuOpen(false); }}
                    className={`p-3 rounded-lg text-xs font-bold uppercase text-center border flex items-center justify-center gap-1.5 transition-all ${activeTab === 'sources' ? 'bg-orange-50 border-orange-200 text-[#EA580C]' : 'border-slate-100 text-slate-700 bg-slate-50'}`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    Sources ({sources.length})
                  </button>
                  <button 
                    onClick={() => { setActiveTab('veille'); setMobileMenuOpen(false); }}
                    className={`p-3 rounded-lg text-xs font-bold uppercase text-center border flex items-center justify-center gap-1.5 transition-all ${activeTab === 'veille' ? 'bg-orange-50 border-orange-200 text-[#EA580C]' : 'border-slate-100 text-slate-700 bg-slate-50'}`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    Alertes
                  </button>
                  <button 
                    onClick={() => { setActiveTab('diagnostic'); setMobileMenuOpen(false); }}
                    className={`p-3 rounded-lg text-xs font-bold uppercase text-center border transition-all ${activeTab === 'diagnostic' ? 'bg-orange-50 border-orange-200 text-[#EA580C]' : 'border-slate-100 text-slate-700 bg-slate-50'}`}
                  >
                    Cas Réels
                  </button>
                  <button 
                    onClick={() => { setActiveTab('tarifs'); setMobileMenuOpen(false); }}
                    className={`p-3 rounded-lg text-xs font-bold uppercase text-center border transition-all ${activeTab === 'tarifs' ? 'bg-orange-50 border-orange-200 text-[#EA580C]' : 'border-slate-100 text-slate-700 bg-slate-50'}`}
                  >
                    Tarifs & Essai
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">Mode d'affichage :</span>
                  <button
                    onClick={() => {
                      setSimplifiedView(!simplifiedView);
                      showToast(simplifiedView ? "Affichage détaillé activé" : "Affichage épuré activé");
                    }}
                    className={`px-3 py-1.5 border rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      simplifiedView 
                        ? 'bg-amber-50 border-amber-300 text-amber-800' 
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{simplifiedView ? "Épuré" : "Complet"}</span>
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs text-slate-500">Langue active :</span>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border">
                    {(['FR', 'EN', 'DE'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => {
                          setCurrentLang(lang);
                          showToast(`Langue sélectionnée : ${lang}`);
                        }}
                        className={`px-3 py-1 rounded text-xs font-bold ${currentLang === lang ? 'bg-[#EA580C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsModalOpen(true);
                    }}
                    className="w-full py-3 bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Demander un rappel gratuit</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── TAB 1 : ACCUEIL / LANDING ─── */}
      {activeTab === 'accueil' && (
        <div className="bg-slate-50 text-slate-800">
          {/* Hero Section */}
          <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200/60 bg-white">
            {/* Subtle Industrial Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#EA580C_1px,transparent_1px)] [background-size:24px_24px]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Column: Headlines & Call to action */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* VisiPilot signature element */}
                  <div className="flex items-center gap-2">
                    <div className="h-[2px] w-8 bg-[#EA580C]"></div>
                    <span className="text-xs font-mono-code uppercase tracking-widest text-[#EA580C] font-bold">
                      VEILLE RÉGLEMENTAIRE & SÉCURITÉ DES ALIMENTS
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tight leading-tight">
                    La conformité en sécurité des aliments commence par une veille maîtrisée.<br/>
                    <span className="text-[#EA580C]">FoodSafetyWatch par VisiPilot vous accompagne.</span>
                  </h1>

                  <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                    Depuis plus de 15 ans sur le terrain industriel, <strong className="text-slate-900">VisiPilot</strong> harmonise excellence opérationnelle et solutions digitales. <strong className="text-slate-900">FoodSafetyWatch</strong> est le service de veille réglementaire et sanitaire pour l'agroalimentaire : nos experts analysent, qualifient et traduisent chaque alerte en plan d'action immédiat pour vos usines et laboratoires.
                  </p>

                  {/* 3 Key Stats matching SustainWatch */}
                  <div className="grid grid-cols-3 gap-6 pt-4 pb-2 border-y border-slate-200">
                    <div>
                      <div className="text-3xl font-heading font-extrabold text-[#EA580C]">120+</div>
                      <div className="text-xs text-slate-500 mt-1 font-semibold">Réglementations & sources officielles suivies</div>
                    </div>
                    <div>
                      <div className="text-3xl font-heading font-extrabold text-slate-900">25+</div>
                      <div className="text-xs text-slate-500 mt-1 font-semibold">Pays et zones export couverts</div>
                    </div>
                    <div>
                      <div className="text-3xl font-heading font-extrabold text-emerald-600">3 Mois</div>
                      <div className="text-xs text-slate-500 mt-1 font-semibold">D'essai gratuit sans engagement</div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-wrap items-center gap-4">
                      <button 
                        onClick={() => setActiveTab('tarifs')}
                        className="px-6 py-3.5 bg-[#EA580C] hover:bg-[#c2410c] text-white font-heading font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 group"
                      >
                        Commencer ma veille — 3 mois gratuits
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                      <button 
                        onClick={() => setActiveTab('diagnostic')}
                        className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-heading font-semibold text-sm rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-2"
                      >
                        <Cpu className="w-4 h-4 text-[#EA580C]" />
                        Voir la démo interactive
                      </button>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-3 pt-1 font-medium">
                      <span>Sans carte bancaire</span>
                      <span>·</span>
                      <span>Sans engagement</span>
                      <span>·</span>
                      <span>Résiliable en 1 clic</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1">
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="hover:text-[#EA580C] text-slate-700 underline underline-offset-4 flex items-center gap-1 transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-[#EA580C]" />
                        Être rappelé par un auditeur VisiPilot
                      </button>
                      <span className="text-slate-300">·</span>
                      <button 
                        onClick={() => setActiveTab('portail')}
                        className="hover:text-[#EA580C] text-slate-700 underline underline-offset-4 transition-colors"
                      >
                        Déjà client ? Accéder au portail
                      </button>
                    </div>
                  </div>

                </div>

                {/* Right Column: Hero Visual Card with Recent Live Alerts */}
                <div className="lg:col-span-5">
                  <div className="bg-white border border-slate-200 shadow-lg rounded-3xl p-6 relative">
                    
                    {/* Top Card Badge */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                        <h3 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider">
                          Dernières alertes validées
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono-code text-slate-400 uppercase font-bold">
                        Filtrage Expert VisiPilot
                      </span>
                    </div>

                    {/* Alerts Mini List */}
                    <div className="space-y-3.5">
                      {alerts.slice(0, 4).map(alert => (
                        <div 
                          key={alert.id}
                          onClick={() => {
                            setExpandedAlertId(alert.id);
                            setActiveTab('veille');
                          }}
                          className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 hover:border-orange-500/40 rounded-xl transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getSeverityBadge(alert.severity)}`}>
                              {alert.severity}
                            </span>
                            <span className="text-[10px] font-mono-code text-slate-500 font-semibold">
                              {alert.source.split('·')[0]}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#EA580C] transition-colors line-clamp-2">
                            {alert.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                            {alert.impact}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Footer of Card */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>⋯ et 120+ réglementations sous surveillance</span>
                      <button 
                        onClick={() => setActiveTab('sources')}
                        className="text-[#EA580C] font-bold hover:underline flex items-center gap-1 text-[11px]"
                      >
                        Toutes les sources
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* How It Works - Process in 3 Steps (SustainWatch exact model) */}
          <section className="py-20 bg-slate-50 border-b border-slate-200/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-2xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="h-[2px] w-6 bg-[#EA580C]"></div>
                  <span className="text-xs font-mono-code uppercase tracking-widest text-[#EA580C] font-bold">
                    MÉTHODOLOGIE AUDITÉ GFSI
                  </span>
                  <div className="h-[2px] w-6 bg-[#EA580C]"></div>
                </div>
                <h2 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
                  Comment ça marche
                </h2>
                <p className="text-slate-500 text-sm mt-2 font-medium">
                  De la détection internationale à vos ateliers de production, un processus rigoureux en 3 étapes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Step 1 */}
                <div className="bg-white border border-slate-200 p-8 rounded-2xl relative group hover:border-[#EA580C]/50 transition-all shadow-2xs">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center font-heading font-extrabold text-[#EA580C] text-xl mb-6 shadow-sm">
                    1
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 mb-3">
                    Détection multi-sources continue
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Nos robots de crawl et collecteurs connectés parcourent 24/7 les publications officielles : Journal Officiel de l'UE (EUR-Lex), RASFF, RappelConso, US FDA Federal Register, DGAL, EFSA, UK FSA, BfR et Codex Alimentarius.
                  </p>
                  <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-mono-code text-slate-400 font-semibold">
                    Plus de 2 500 textes et flux scrutés/mois
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-white border border-slate-200 p-8 rounded-2xl relative group hover:border-[#EA580C]/50 transition-all shadow-2xs">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center font-heading font-extrabold text-[#EA580C] text-xl mb-6 shadow-sm">
                    2
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 mb-3">
                    Validation par des auditeurs QHSE
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Chaque texte, alerte ou projet de révision est analysé et qualifié par un expert sécurité des aliments VisiPilot. Nous éliminons le bruit pour ne transmettre que les évolutions qui impactent vos recettes, usines et fournisseurs.
                  </p>
                  <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-mono-code text-slate-400 font-semibold">
                    Zéro faux positif · Analyse d'impact technique
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-white border border-slate-200 p-8 rounded-2xl relative group hover:border-[#EA580C]/50 transition-all shadow-2xs">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center font-heading font-extrabold text-[#EA580C] text-xl mb-6 shadow-sm">
                    3
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 mb-3">
                    Alerte personnalisée & Plan d'action
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Vous recevez une synthèse opérationnelle avec les échéances d'application, les seuils microbiologiques ou chimiques modifiés, et les recommandations d'audit pour rester « Audit Ready » pour vos certifications IFS Food et BRCGS.
                  </p>
                  <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-mono-code text-slate-400 font-semibold">
                    Connecté aux modules VisiPLM & VISITrack
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* VisiPilot Software Suite Synergy Section */}
          <section className="py-16 border-b border-slate-200/60 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                <div>
                  <span className="text-xs font-mono-code text-[#EA580C] uppercase tracking-widest font-bold">
                    L'ÉCOSYSTÈME VISIPILOT
                  </span>
                  <h3 className="text-2xl font-heading font-bold text-slate-900 mt-1">
                    De la veille réglementaire à la résolution sur le terrain
                  </h3>
                </div>
                <div className="text-xs text-slate-600 max-w-md font-medium">
                  FoodSafetyWatch s'intègre nativement à vos logiciels VisiPilot pour convertir instantanément les exigences réglementaires en actions de contrôle.
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {[
                  { name: 'VisiPLM', desc: 'Recettes & spécifications matières', icon: BookOpen },
                  { name: 'VISITrack', desc: 'Hub conformité fournisseurs', icon: Globe2 },
                  { name: 'VISIcat', desc: 'Gestion non-conformités GFSI', icon: ShieldCheck },
                  { name: 'VisiTact', desc: 'Zéro-papier & IoT température/pH', icon: Cpu },
                  { name: 'VisiPact', desc: 'Audits fournisseurs automatisés', icon: FileCheck },
                  { name: 'VisiVal', desc: 'Culture sécurité des aliments', icon: Sparkles }
                ].map(tool => (
                  <div key={tool.name} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl hover:border-slate-300 hover:bg-slate-100/60 shadow-2xs hover:shadow-xs transition-all">
                    <tool.icon className="w-5 h-5 text-[#EA580C] mb-2" />
                    <div className="font-heading font-bold text-xs text-slate-900">{tool.name}</div>
                    <div className="text-[10px] text-slate-500 mt-1 leading-snug font-medium">{tool.desc}</div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* Pre-footer CTA Banner */}
          <section className="py-16 bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-amber-500/10 border-y border-slate-200/80">
            <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
              <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
                Prêt à sécuriser vos audits réglementaires et export ?
              </h3>
              <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed font-medium">
                Testez FoodSafetyWatch sans engagement pendant 90 jours. Configurez vos filières d'importation, vos marchés d'export et vos certifications.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <button 
                  onClick={() => setActiveTab('tarifs')}
                  className="px-6 py-3 bg-[#EA580C] hover:bg-[#c2410c] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
                >
                  Activer 3 mois d'essai gratuit
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-heading font-semibold text-xs rounded-xl border border-slate-200 transition-all shadow-2xs"
                >
                  Échanger avec un auditeur VisiPilot
                </button>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* ─── TAB : REGULATORY INTELLIGENCE ENGINE (EUR-LEX / CELLAR + LÉGIFRANCE / PISTE) ─── */}
      {activeTab === 'engine' && (
        <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-8 text-slate-800 bg-slate-50">
          
          {/* Header & Baseline */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-[#EA580C] bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                  SOCLE OFFICIEL : 🇪🇺 EUR-LEX / CELLAR + 🇫🇷 LÉGIFRANCE / PISTE
                </span>
                <span className="text-xs font-mono-code text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Zéro Scraping · 100% API & Dépôts Officiels
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
                        onClick={() => setEngineStatus(s.id)}
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
      )}
      {activeTab === 'sources' && (
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
                  Ces sources sont directement intégrées : leurs textes, alertes et avis scientifiques sont captés automatiquement par VisiPilot.
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
      )}

      {/* ─── TAB 3 : DIAGNOSTIC / DÉMO (EXACT REPLICATION DE /DIAGNOSTIC DE SUSTAINWATCH) ─── */}
      {activeTab === 'diagnostic' && (
        <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-10 text-slate-800 bg-slate-50">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2">
              <div className="h-[2px] w-6 bg-[#EA580C]"></div>
              <span className="text-xs font-mono-code uppercase tracking-widest text-[#EA580C] font-extrabold">
                CAS PRATIQUES & DÉMO INTERACTIVE
              </span>
              <div className="h-[2px] w-6 bg-[#EA580C]"></div>
            </div>
            <h2 className="text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
              Découvrez la veille ciblée sur votre métier
            </h2>
            <p className="text-sm text-slate-500 font-semibold">
              Choisissez un profil d'entreprise agroalimentaire ci-dessous pour voir comment FoodSafetyWatch cartographie les risques, notifie les alertes et génère le plan de mise en conformité.
            </p>
          </div>

          {/* Profile Selector Buttons (Like SustainWatch) */}
          <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {DIAGNOSTIC_PROFILES.map(profile => {
                const isSelected = profile.id === selectedProfileId;
                return (
                  <button
                    key={profile.id}
                    onClick={() => setSelectedProfileId(profile.id)}
                    className={`p-4 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'bg-orange-50/50 border-[#EA580C] shadow-sm'
                        : 'bg-slate-50 border-slate-200/80 hover:border-slate-350 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono-code text-[#EA580C] uppercase tracking-wider font-extrabold">
                        {profile.badge}
                      </span>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#EA580C]"></span>}
                    </div>
                    <div className="font-heading font-bold text-sm text-slate-900">{profile.name}</div>
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-1 font-semibold">{profile.companyName}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Profile Detail Sheet (Matching SustainWatch) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-8 shadow-sm">
            
            {/* Top Identity Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-heading font-extrabold text-slate-900">
                    {currentProfile.companyName}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 border border-orange-200 text-[#EA580C]">
                    {currentProfile.name}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 font-semibold">
                  {currentProfile.meta}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {currentProfile.tags.map((tag, i) => (
                  <span 
                    key={i}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded border uppercase tracking-wider ${
                      tag.type === 'critical' ? 'text-red-700 bg-red-50 border-red-200' :
                      tag.type === 'warning' ? 'text-orange-700 bg-orange-50 border-orange-200' :
                      'text-emerald-700 bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Regulatory Profile Table (Exact SustainWatch component) - Masqué si simplifié */}
            {!simplifiedView && (
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#EA580C]" />
                  Profil Réglementaire & Périmètre d'Activité
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs shadow-2xs">
                  <table className="w-full text-left">
                    <tbody>
                      <tr className="border-b border-slate-200 bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-500 w-1/4">Secteur d'activité</td>
                        <td className="p-3 text-slate-900 font-bold">{currentProfile.secteur}</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 font-semibold text-slate-500">Marchés de commercialisation</td>
                        <td className="p-3 text-slate-700 font-medium">{currentProfile.marches}</td>
                      </tr>
                      <tr className="border-b border-slate-200 bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-500">Filières d'importation matières</td>
                        <td className="p-3 text-slate-700 font-medium">{currentProfile.import}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-slate-500">Certifications & référentiels</td>
                        <td className="p-3 text-slate-700 font-medium">
                          <div className="flex flex-wrap gap-1.5">
                            {currentProfile.certifications.map((c, i) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded font-mono-code text-[11px] font-bold">
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Targeted Alerts triggered for this profile */}
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                Alertes réglementaires ciblées pour ce profil
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {currentProfile.alerts.map((alert, idx) => (
                  <div key={idx} className="p-4 bg-slate-50/50 border border-slate-200 rounded-2xl shadow-2xs">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getSeverityBadge(alert.urgency)}`}>
                        {alert.urgency}
                      </span>
                      <span className="text-[10px] font-mono-code text-slate-500 font-semibold">
                        {alert.source} • {alert.date}
                      </span>
                    </div>
                    <h5 className="font-bold text-sm text-slate-900">{alert.title}</h5>
                    <p className={`text-xs text-slate-600 mt-1.5 leading-relaxed font-medium ${simplifiedView ? 'line-clamp-1' : ''}`}>{alert.desc}</p>
                    {!simplifiedView && (
                      <div className="mt-3 p-2.5 bg-red-50 border border-red-200/60 rounded-lg text-xs text-red-800 font-medium">
                        <strong className="font-bold text-red-900">Impact opérationnel :</strong> {alert.impact}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Prioritized Compliance Actions (Haute, Moyenne, Optionnelle) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Plan d'actions de mise en conformité
                </h4>
                <span className="text-[11px] font-bold text-[#EA580C] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded font-mono-code">
                  {currentProfile.actions.length} actions préconisées
                </span>
              </div>

              <div className="space-y-3">
                {currentProfile.actions.map((act, idx) => (
                  <div key={idx} className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl flex items-start gap-4 shadow-2xs">
                    <div className="text-xl mt-0.5">{act.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono-code uppercase font-extrabold text-slate-500">
                          {act.priority === 'haute' ? '🔴 Priorité Haute' : act.priority === 'moyenne' ? '🟠 Priorité Moyenne' : '🟡 Optionnelle'}
                        </span>
                        <span className="text-[10px] font-mono-code text-[#EA580C] bg-orange-50 px-2 py-0.5 rounded border border-orange-200 font-extrabold">
                          Module {act.visipilotModule}
                        </span>
                      </div>
                      <div className="font-heading font-bold text-xs text-slate-950 mt-1">{act.title}</div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{act.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Value Added & VisiPilot Synergy Box */}
            <div className="p-5 bg-gradient-to-r from-blue-50 via-white to-white border border-blue-200 rounded-2xl space-y-3 shadow-2xs">
              <div className="text-xs font-heading font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Bénéfice opérationnel VisiPilot
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic font-medium">
                "{currentProfile.visipilotValue}"
              </p>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 font-bold">
                <strong>Synergie logicielle :</strong> {currentProfile.ecosystemSynergy}
              </div>
            </div>

            {/* CTA from Diagnostic to Trial */}
            <div className="text-center pt-4">
              <button
                onClick={() => setActiveTab('tarifs')}
                className="px-8 py-3.5 bg-[#EA580C] hover:bg-[#c2410c] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/15"
              >
                Configurer la veille pour mon entreprise — 3 mois gratuits
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ─── TAB 4 : ALERTES EN DIRECT (LIVE VEILLE) ─── */}
      {activeTab === 'veille' && (
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
                onChange={(e) => setAlertUrgencyFilter(e.target.value)}
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

          {/* Alerts Feed */}
          {loadingAlerts ? (
            <div className="py-24 text-center space-y-4">
              <RefreshCw className="w-8 h-8 text-[#F97316] animate-spin mx-auto" />
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
                          <span className="text-[10px] font-mono-code text-[#F97316] bg-[#F97316]/10 px-2 py-0.5 rounded">
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
                              Outil VisiPilot préconisé : <strong className="text-[#F97316]">{alert.visipilot_tool}</strong>
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
                        className="text-xs font-semibold text-[#F97316] hover:underline flex items-center gap-1"
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
      )}

      {/* ─── TAB 5 : OFFRES & TARIFS (SUSTAINWATCH PRICING EXACT REPLICA) ─── */}
      {activeTab === 'tarifs' && (
        <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2">
              <div className="h-[2px] w-6 bg-[#F97316]"></div>
              <span className="text-xs font-mono-code uppercase tracking-widest text-[#F97316]">
                TARIFICATION TRANSPARENTE
              </span>
              <div className="h-[2px] w-6 bg-[#F97316]"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Des offres pour <span className="text-[#F97316]">tous les besoins</span>
            </h2>
            <p className="text-sm text-slate-400">
              De la découverte gratuite à la solution entreprise avec expert auditeur dédié. Sans engagement, sans carte bancaire.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {PRICING_PLANS.map(plan => {
              return (
                <div 
                  key={plan.id}
                  className={`bg-[#111827] rounded-3xl p-8 flex flex-col justify-between border relative ${
                    plan.isPopular 
                      ? 'border-[#F97316] shadow-2xl shadow-[#F97316]/20' 
                      : 'border-slate-800'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="mb-4">
                      <span className={`text-[10px] font-bold font-mono-code px-3 py-1 rounded-full border uppercase tracking-wider ${plan.badgeColor}`}>
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-heading font-extrabold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-2 min-h-[48px] leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Price Display */}
                    <div className="mt-6 mb-6 pb-6 border-b border-slate-800">
                      {plan.surDevis ? (
                        <div className="text-3xl font-heading font-extrabold text-white">Sur devis</div>
                      ) : (
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-heading font-extrabold text-white">
                              {plan.trialDays > 0 ? 'Gratuit' : `${plan.priceMonthly} €`}
                            </span>
                            {plan.trialDays === 0 && (
                              <span className="text-xs text-slate-400 font-medium">/mois HT</span>
                            )}
                          </div>
                          {plan.trialDays > 0 && (
                            <div className="text-xs text-emerald-400 font-mono-code mt-1 font-semibold">
                              90 jours d'essai gratuit, puis 29 €/mois
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Features list */}
                    <div className="space-y-3 text-xs">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-8 pt-6 border-t border-slate-800 space-y-2">
                    <button
                      onClick={() => {
                        if (plan.surDevis) {
                          setIsModalOpen(true);
                        } else {
                          setActiveTab('portail');
                          showToast(`Offre ${plan.name} sélectionnée !`);
                        }
                      }}
                      className={`w-full py-3.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
                        plan.isPopular
                          ? 'bg-[#F97316] hover:bg-[#ea580c] text-white shadow-[#F97316]/25'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      {plan.ctaText}
                    </button>
                    <div className="text-[10px] text-center text-slate-500 font-mono-code">
                      {plan.ctaSubtext}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Expert callback notice */}
          <div className="text-center bg-[#111827] border border-slate-800 p-8 rounded-2xl max-w-3xl mx-auto space-y-4">
            <h4 className="font-heading font-bold text-lg text-white">Besoin d'un audit de votre périmètre réglementaire ?</h4>
            <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
              Un expert VisiPilot analyse votre catalogue produits, vos destinations d'exportation et vos certifications pour dimensionner votre veille.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 text-xs font-bold font-heading uppercase tracking-wider"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#F97316]" />
              Être rappelé par un expert sous 48h
            </button>
          </div>

        </div>
      )}

      {/* ─── TAB 6 : PORTAIL CLIENT (REPLIQUE DE L'ESPACE CLIENT SUSTAINWATCH) ─── */}
      {activeTab === 'portail' && (
        <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 shrink-0 space-y-6">
              
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center gap-3 pb-3 mb-3 border-b border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                    VT
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm text-white">Visi.Tune</div>
                    <div className="text-[10px] font-mono-code text-[#F97316]">Plan Discovery (Essai 84j)</div>
                  </div>
                </div>

                <nav className="space-y-1 text-xs">
                  {[
                    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutGrid },
                    { id: 'perimetre', label: 'Ma veille (Périmètre)', icon: SlidersHorizontal },
                    { id: 'bulletins', label: 'Mes bulletins mensuels', icon: FileText },
                    { id: 'alertes', label: 'Mes alertes ciblées', icon: AlertTriangle },
                    { id: 'abonnement', label: 'Mon abonnement', icon: CheckCircle2 }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setPortalSubTab(tab.id as any)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition-all ${
                        portalSubTab === tab.id
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Monitored Summary Box */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 text-xs space-y-3">
                <div className="text-[10px] font-mono-code text-slate-500 uppercase tracking-widest">
                  SYNTHÈSE DU PÉRIMÈTRE
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sources actives :</span>
                  <strong className="text-white">{activeSourcesInPerimeter.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Secteurs suivis :</span>
                  <strong className="text-white">{monitoredSectors.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pays export :</span>
                  <strong className="text-white">{exportCountries.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Statut audit :</span>
                  <strong className="text-emerald-400">AUDIT READY</strong>
                </div>
              </div>

            </aside>

            {/* Portal Main Content */}
            <main className="flex-1 bg-[#111827] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              
              {/* SUBTAB 1 : DASHBOARD */}
              {portalSubTab === 'dashboard' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-heading font-extrabold text-white">Tableau de Bord Réglementaire</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Vue d'ensemble de votre dispositif de veille sanitaire et conformité IFS/GFSI.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                      <div className="text-[10px] font-mono-code text-slate-400 uppercase">Alertes cette semaine</div>
                      <div className="text-2xl font-heading font-extrabold text-red-400 mt-1">2</div>
                      <div className="text-[10px] text-slate-500 mt-1">1 critique, 1 haute</div>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                      <div className="text-[10px] font-mono-code text-slate-400 uppercase">Sources surveillées</div>
                      <div className="text-2xl font-heading font-extrabold text-white mt-1">{activeSourcesInPerimeter.length}</div>
                      <div className="text-[10px] text-emerald-400 mt-1">Flux 100% synchronisés</div>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                      <div className="text-[10px] font-mono-code text-slate-400 uppercase">Prochaine revue</div>
                      <div className="text-2xl font-heading font-extrabold text-[#F97316] mt-1">15 Oct</div>
                      <div className="text-[10px] text-slate-500 mt-1">Bulletin mensuel n°10</div>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
                      <div className="text-[10px] font-mono-code text-slate-400 uppercase">Indice Conformité</div>
                      <div className="text-2xl font-heading font-extrabold text-emerald-400 mt-1">98.4%</div>
                      <div className="text-[10px] text-slate-500 mt-1">Conforme IFS Food v8</div>
                    </div>
                  </div>

                  {/* Quick Action Plan */}
                  <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <h4 className="font-heading font-bold text-sm text-white">Alertes récentes nécessitant une action</h4>
                    {alerts.slice(0, 2).map(a => (
                      <div key={a.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
                        <div>
                          <div className="font-semibold text-xs text-white">{a.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{a.recommendation}</div>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${getSeverityBadge(a.severity)}`}>
                          {a.severity}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* SUBTAB 2 : PERIMETRE DE VEILLE */}
              {portalSubTab === 'perimetre' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-heading font-extrabold text-white">Configuration du Périmètre de Veille</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Paramétrez vos secteurs, vos pays et vos sources pour que FoodSafetyWatch ne vous notifie que du strict nécessaire.
                    </p>
                  </div>

                  {/* Sectors Selection */}
                  <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                    <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                      Secteurs d'activité surveillés
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        'Viandes, Volailles & Charcuterie',
                        'Produits Laitiers & Fromages',
                        'Produits de la Pêche & Surgelés',
                        'Épicerie, Céréales & Épices',
                        'Fruits, Légumes & Végétaux',
                        'Matériaux au Contact (MOCA / PFAS)'
                      ].map(sec => {
                        const isChecked = monitoredSectors.includes(sec);
                        return (
                          <label 
                            key={sec}
                            className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                              isChecked ? 'bg-blue-950/40 border-blue-500/40 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                setMonitoredSectors(prev => 
                                  isChecked ? prev.filter(s => s !== sec) : [...prev, sec]
                                );
                                showToast('Périmètre mis à jour');
                              }}
                              className="accent-[#F97316]"
                            />
                            <span>{sec}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Sources Toggle */}
                  <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                        Sources de veille actives ({activeSourcesInPerimeter.length} sélectionnées)
                      </h4>
                      <button 
                        onClick={() => setActiveTab('sources')}
                        className="text-xs text-[#F97316] hover:underline"
                      >
                        Gérer dans le catalogue complet →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {sources.map(src => {
                        const isActive = activeSourcesInPerimeter.includes(src.id);
                        return (
                          <label 
                            key={src.id}
                            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                              isActive ? 'bg-slate-900 border-blue-500/30 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
                            }`}
                          >
                            <input 
                              type="checkbox"
                              checked={isActive}
                              onChange={() => toggleSourceInPerimeter(src.id)}
                              className="accent-[#F97316]"
                            />
                            <span>{src.flag} {src.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* SUBTAB 3 : BULLETINS MENSUELS */}
              {portalSubTab === 'bulletins' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-heading font-extrabold text-white">Mes Bulletins Mensuels</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Analyses de synthèse rédigées et validées par nos experts auditeurs sécurité des aliments.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        title: 'Bulletin de Veille Sanitaire & Réglementaire — Septembre 2026',
                        date: '25 Septembre 2026',
                        highlights: 'Listeria (ISO 20976-1), PFAS emballages UE, calendrier FSMA 204 FDA',
                        pages: '14 pages'
                      },
                      {
                        title: 'Bulletin de Veille Sanitaire & Réglementaire — Août 2026',
                        date: '28 Août 2026',
                        highlights: 'Nitrites/nitrates palier 2, LMR pesticides, contrôles BTOM Royaume-Uni',
                        pages: '12 pages'
                      }
                    ].map((b, i) => (
                      <div key={i} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#F97316] uppercase mb-1">
                            <Calendar className="w-3 h-3" />
                            {b.date} • {b.pages}
                          </div>
                          <h4 className="font-heading font-bold text-sm text-white">{b.title}</h4>
                          <p className="text-xs text-slate-400 mt-1">Dossiers clés : {b.highlights}</p>
                        </div>
                        <button 
                          onClick={() => showToast('Téléchargement du bulletin PDF officiel')}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 shrink-0"
                        >
                          <Download className="w-3.5 h-3.5 text-[#F97316]" />
                          Télécharger PDF
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* SUBTAB 4 : ABONNEMENT */}
              {portalSubTab === 'abonnement' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-heading font-extrabold text-white">Mon Abonnement & Compte</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Gestion de votre formule et coordonnées de facturation.
                    </p>
                  </div>

                  <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                      <div>
                        <div className="text-xs text-slate-400 uppercase font-mono-code">Formule en cours</div>
                        <div className="text-xl font-heading font-extrabold text-white mt-0.5">Offre Discovery — Essai 90 jours</div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">
                        Actif (84 jours restants)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-500 block">Prochaine échéance :</span>
                        <strong className="text-white">21 Décembre 2026</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Montant après essai :</span>
                        <strong className="text-white">29 € HT / mois</strong>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex gap-4">
                      <button 
                        onClick={() => setActiveTab('tarifs')}
                        className="px-4 py-2 bg-[#F97316] text-white font-bold text-xs rounded-xl"
                      >
                        Passer à l'offre Pro avec Expert Dédié
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </main>

          </div>

        </div>
      )}

      {/* ─── MODAL : ÊTRE RAPPELÉ PAR UN EXPERT VISIPILOT (SUSTAINWATCH REPLICA) ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111827] border border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              {callbackSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white">Demande enregistrée !</h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Un auditeur et expert en sécurité des aliments VisiPilot vous recontactera sous 48h ouvrées.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit} className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-[2px] w-5 bg-[#F97316]"></div>
                      <span className="text-[10px] font-mono-code text-[#F97316] uppercase tracking-wider">
                        CONSEIL & AUDIT REGLEMENTAIRE
                      </span>
                    </div>
                    <h3 className="text-xl font-heading font-extrabold text-white">
                      Être rappelé par un expert VisiPilot
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Échangez avec un spécialiste pour auditer votre périmètre de veille et vos obligations sanitaires.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Nom et prénom *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Jean Dupont"
                        value={callbackForm.name}
                        onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F97316]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">Email professionnel *</label>
                        <input 
                          type="email" 
                          required
                          placeholder="j.dupont@entreprise.com"
                          value={callbackForm.email}
                          onChange={(e) => setCallbackForm({ ...callbackForm, email: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F97316]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-300 block mb-1">Téléphone *</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="+33 6 12 34 56 78"
                          value={callbackForm.phone}
                          onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F97316]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Entreprise & Secteur</label>
                      <input 
                        type="text" 
                        placeholder="Nom de votre usine / coopérative / marque"
                        value={callbackForm.company}
                        onChange={(e) => setCallbackForm({ ...callbackForm, company: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F97316]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Vos enjeux ou questions (optionnel)</label>
                      <textarea 
                        rows={3}
                        placeholder="Ex: Exigences export USA FSMA 204, audit Listeria, emballages PFAS..."
                        value={callbackForm.message}
                        onChange={(e) => setCallbackForm({ ...callbackForm, message: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F97316]"
                      ></textarea>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={callbackSubmitting}
                    className="w-full py-3 bg-[#F97316] hover:bg-[#ea580c] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#F97316]/20 disabled:opacity-50 mt-2"
                  >
                    {callbackSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande d\'échange →'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL : FICHE TECHNIQUE & PROVENANCE DÉTAILLÉE D'UNE SOURCE RÉGLEMENTAIRE ─── */}
      <AnimatePresence>
        {selectedSourceDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200/80 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6 text-slate-800"
            >
              <button 
                onClick={() => setSelectedSourceDetail(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                title="Fermer la fiche"
              >
                <X className="w-5 h-5" />
              </button>

              {/* En-tête de la fiche */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{selectedSourceDetail.flag}</span>
                  <span className="text-xs font-mono-code uppercase px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                    {selectedSourceDetail.paysLabel}
                  </span>
                  <span className="text-xs font-mono-code text-[#EA580C] bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 font-bold">
                    {selectedSourceDetail.type}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 leading-tight">
                  {selectedSourceDetail.name}
                </h3>
                <div className="text-sm font-medium text-slate-500 mt-1">
                  Émis par : <strong className="text-slate-800 font-bold">{selectedSourceDetail.organization}</strong>
                </div>
              </div>

              {/* État de présence & Disponibilité dans l'outil */}
              {selectedSourceDetail.isAvailableInApp ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse mt-1 shrink-0"></span>
                    <div>
                      <div className="text-sm font-heading font-bold text-emerald-800">
                        SOURCE DISPONIBLE EN DIRECT DANS L'OUTIL
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5 font-medium leading-relaxed">
                        Cette source est raccordée en continu via connecteur API direct. Les nouvelles publications alimentent immédiatement vos tableaux de bord.
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono-code font-bold bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 shrink-0">
                    Flux Connecté
                  </span>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-3 h-3 rounded-full bg-amber-500 mt-1 shrink-0"></span>
                    <div>
                      <div className="text-sm font-heading font-bold text-amber-800">
                        SOURCE EN COURS D'INTÉGRATION ({selectedSourceDetail.coverageLevel.toUpperCase()})
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5 font-medium leading-relaxed">
                        Cette source fait partie du catalogue de référence VisiPilot. Le raccordement de son flux automatisé est planifié ou livrable sur demande pour vos filières d'exportation.
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono-code font-bold bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg border border-amber-200 shrink-0">
                    En intégration
                  </span>
                </div>
              )}

              {/* Cartographie de Provenance : D'où viennent ces données ? */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="text-xs font-mono-code uppercase text-[#EA580C] font-bold flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-[#EA580C]" />
                  Origine & Mécanisme de collecte des données
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {selectedSourceDetail.provenance}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] font-mono-code uppercase text-slate-500 block font-bold">Fréquence</span>
                    <strong className="text-slate-800 font-bold">{selectedSourceDetail.frequency}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-code uppercase text-slate-500 block font-bold">Dernier contrôle</span>
                    <strong className="text-emerald-700 font-bold">{selectedSourceDetail.lastSync}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-code uppercase text-slate-500 block font-bold">Valeur légale</span>
                    <strong className="text-slate-800 font-bold">{selectedSourceDetail.legalWeight}</strong>
                  </div>
                </div>
              </div>

              {/* Textes et règlements surveillés */}
              <div>
                <div className="text-xs font-mono-code uppercase text-slate-500 font-bold mb-2">
                  Textes de loi & référentiels surveillés pour cette source :
                </div>
                <div className="space-y-1.5">
                  {selectedSourceDetail.regulationsCovered.map((reg, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold">
                      <span className="text-[#EA580C] font-bold">§</span>
                      <span>{reg}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description & Intégration VisiPilot */}
              <div>
                <div className="text-xs font-mono-code uppercase text-slate-500 font-bold mb-2">
                  Périmètre & Portée opérationnelle :
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-medium">
                  {selectedSourceDetail.description}
                </p>
              </div>

              {/* Actions & Liens officiels */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <a 
                  href={selectedSourceDetail.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-200 transition-colors shadow-2xs"
                >
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                  <span>Consulter le site officiel de l'organisme</span>
                </a>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      toggleSourceInPerimeter(selectedSourceDetail.id);
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                      activeSourcesInPerimeter.includes(selectedSourceDetail.id)
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                        : 'bg-[#EA580C] hover:bg-[#c2410c] text-white shadow-sm'
                    }`}
                  >
                    {activeSourcesInPerimeter.includes(selectedSourceDetail.id)
                      ? '✓ Actif dans mon périmètre'
                      : '+ Ajouter à mon périmètre'}
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL : ARCHITECTURE TECHNIQUE EUR-LEX / CELLAR + LÉGIFRANCE / PISTE ─── */}
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
                    Zéro Scraping · 100% API & Dépôts Officiels
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

      {/* ─── MODAL : FICHE D'AUDIT TECHNIQUE COMPLÈTE D'UN TEXTE JURIDIQUE ─── */}
      <AnimatePresence>
        {selectedTextDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6 text-slate-800"
            >
              <button 
                onClick={() => setSelectedTextDetail(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* En-tête */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-2xl">{selectedTextDetail.jurisdiction === 'UE' ? '🇪🇺' : '🇫🇷'}</span>
                  <span className="text-xs font-mono-code font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedTextDetail.jurisdictionLabel}
                  </span>
                  <span className={`text-xs font-mono-code font-extrabold px-2.5 py-1 rounded border ${selectedTextDetail.statusBadgeColor}`}>
                    {selectedTextDetail.status}
                  </span>
                  <span className="text-xs font-mono-code text-amber-800 bg-amber-50 border border-amber-200 px-2 py-1 rounded font-bold">
                    {selectedTextDetail.celexOrNor}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 leading-tight">
                  {selectedTextDetail.title}
                </h3>
                <div className="text-xs text-slate-500 mt-1 font-mono-code font-semibold">
                  Réf : {selectedTextDetail.legalReference}
                </div>
              </div>

              {/* Calendrier légal */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] font-mono-code uppercase text-slate-500 block font-bold">Date de publication</span>
                  <strong className="text-slate-800 text-sm font-mono-code font-bold">{selectedTextDetail.datePublication}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono-code uppercase text-slate-500 block font-bold">Entrée en vigueur</span>
                  <strong className="text-slate-800 text-sm font-mono-code font-bold">{selectedTextDetail.dateEntreeVigueur}</strong>
                </div>
                <div>
                  <span className="text-[10px] font-mono-code uppercase text-slate-500 block font-bold">Application obligatoire</span>
                  <strong className="text-[#EA580C] text-sm font-mono-code font-bold">{selectedTextDetail.dateApplication}</strong>
                </div>
              </div>

              {/* Comparatif réglementaire Avant / Après */}
              <div className="space-y-3">
                <div className="text-xs font-mono-code uppercase text-slate-500 font-bold">
                  Analyse d'Impact Réglementaire (Niveau 2 Intelligence) :
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 border border-red-200/80 rounded-2xl space-y-1.5">
                    <div className="text-xs font-mono-code uppercase text-red-800 font-bold">
                      Exigences Antérieures
                    </div>
                    <div className="text-xs text-red-950 leading-relaxed font-semibold">
                      {selectedTextDetail.previousRequirements}
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl space-y-1.5">
                    <div className="text-xs font-mono-code uppercase text-emerald-800 font-bold">
                      Nouvelles Exigences Contraignantes
                    </div>
                    <div className="text-xs text-emerald-950 leading-relaxed font-bold">
                      {selectedTextDetail.newRequirements}
                    </div>
                  </div>
                </div>
              </div>

              {/* Articles touchés */}
              <div>
                <div className="text-xs font-mono-code uppercase text-slate-500 font-bold mb-2">
                  Articles et annexes touchés par cet acte :
                </div>
                <div className="space-y-1.5">
                  {selectedTextDetail.modifiedArticles.map((art, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold font-mono-code">
                      <span className="text-[#EA580C] font-bold">§</span>
                      <span>{art}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan d'action VisiPilot */}
              <div className="p-5 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 border border-orange-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono-code uppercase font-bold text-[#EA580C] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    Plan d'action d'audit recommandé VisiPilot
                  </div>
                  <span className="text-xs font-heading font-extrabold text-slate-800 px-2 py-0.5 rounded bg-orange-100 border border-orange-200">
                    Module : {selectedTextDetail.visipilotSoftwareModule}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  {selectedTextDetail.visipilotActionPlan}
                </p>
              </div>

              {/* Actions & Liens */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {selectedTextDetail.consolidatedUrl && (
                    <a 
                      href={selectedTextDetail.consolidatedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-200 shadow-2xs"
                    >
                      <span>Consulter la version consolidée</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  )}
                  <a 
                    href={selectedTextDetail.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-200"
                  >
                    <span>Lien officiel {selectedTextDetail.jurisdiction === 'UE' ? 'EUR-Lex' : 'Légifrance'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  </a>
                </div>

                <button
                  onClick={() => {
                    setSelectedTextDetail(null);
                    showToast(`Texte ${selectedTextDetail.celexOrNor} ajouté au dossier d'audit.`);
                  }}
                  className="px-5 py-2.5 bg-[#EA580C] hover:bg-[#c2410c] text-white font-bold font-heading uppercase tracking-wider text-xs rounded-xl shadow-xs transition-all"
                >
                  Ajouter au classeur d'audit IFS / BRCGS
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── FOOTER (EXACT REPLICATION DE SUSTAINWATCH WITH VISIPILOT TOUCH IN GORGEOUS LIGHT THEME) ─── */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-3">
              <img 
                src="/logovisipilot.png" 
                alt="VisiPilot Logo" 
                className="h-7 w-auto object-contain opacity-90"
              />
              <span className="text-[11px] font-mono-code text-slate-500 uppercase tracking-wider font-semibold">
                © 2026 VisiPilot — FoodSafetyWatch. Tous droits réservés.
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-heading font-bold uppercase tracking-wider text-slate-500">
              <button onClick={() => setActiveTab('accueil')} className="hover:text-[#EA580C] transition-colors">Accueil</button>
              <button onClick={() => setActiveTab('sources')} className="hover:text-[#EA580C] transition-colors">Recherche Sources</button>
              <button onClick={() => setActiveTab('diagnostic')} className="hover:text-[#EA580C] transition-colors">Démo Interactive</button>
              <button onClick={() => setActiveTab('veille')} className="hover:text-[#EA580C] transition-colors">Alertes en Direct</button>
              <button onClick={() => setActiveTab('tarifs')} className="hover:text-[#EA580C] transition-colors">Tarifs</button>
              <button onClick={() => setActiveTab('portail')} className="hover:text-blue-600 transition-colors">Espace Client</button>
              <button onClick={() => setIsModalOpen(true)} className="hover:text-[#EA580C] transition-colors">Contact Expert</button>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-[10px] text-slate-400 font-mono-code font-bold">
            SYS.STATUS: ONLINE • PLATFORME DE VEILLE ALIMENTAIRE AUDITÉE POUR LES STANDARDS GFSI, IFS FOOD VERSION 8 ET BRCGS ISSUE 9
          </div>
        </div>
      </footer>

    </div>
  );
}
