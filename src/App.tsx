import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Scale,
  Database,
  AlertTriangle,
  Cpu,
  User,
  PhoneCall,
  SlidersHorizontal,
  X,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  REGULATORY_SOURCES,
  DIAGNOSTIC_PROFILES,
  RegulatorySource
} from './data/sourcesData.js';
import {
  OFFICIAL_REGULATORY_TEXTS,
  OfficialRegulatoryText,
  TextStatus
} from './data/regulatoryEngineData.js';
import type { AlertItem } from './types.js';
import type { AppCtx } from './components/ctx.js';
import { AccueilTab } from './components/AccueilTab.js';
import { EngineTab } from './components/EngineTab.js';
import { SourcesTab } from './components/SourcesTab.js';
import { DiagnosticTab } from './components/DiagnosticTab.js';
import { VeilleTab } from './components/VeilleTab.js';
import { TarifsTab } from './components/TarifsTab.js';
import { PortailTab } from './components/PortailTab.js';
import { CallbackModal } from './components/CallbackModal.js';
import { SourceDetailModal } from './components/SourceDetailModal.js';
import { ArchitectureModal } from './components/ArchitectureModal.js';
import { TextDetailModal } from './components/TextDetailModal.js';

const API_URL = import.meta.env.VITE_API_URL || 'https://foodsafetywatch.onrender.com';
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'accueil' | 'engine' | 'sources' | 'diagnostic' | 'veille' | 'tarifs' | 'portail'>('accueil');
  const [currentLang, setCurrentLang] = useState<'FR' | 'EN' | 'DE'>('FR');
  
  // Data states
  const [sources, setSources] = useState<RegulatorySource[]>(REGULATORY_SOURCES);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState<boolean>(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('traiteur_salaisons');
  
  // Regulatory Intelligence Engine States (Socle EUR-Lex / Cellar + Légifrance / PISTE)
  const [engineLevel, setEngineLevel] = useState<1 | 2 | 3>(1);
  const [engineJurisdiction, setEngineJurisdiction] = useState<'ALL' | 'UE' | 'FR'>('ALL');
  const [engineDomain, setEngineDomain] = useState<string>('ALL');
  const [engineStatus, setEngineStatus] = useState<'ALL' | TextStatus>('ALL');
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
  const [alertUrgencyFilter, setAlertUrgencyFilter] = useState<'ALL' | AlertItem['severity']>('ALL');
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
      const res = await fetch(API_URL + '/api/regulatory/texts');
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
      const res = await fetch(API_URL + '/api/sources');
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
      const res = await fetch(API_URL + '/api/contact-lead', {
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
      const res = await fetch(API_URL + '/api/ask-regulatory', {
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
  const ctx: AppCtx = {
    activeTab,
    setActiveTab,
    currentLang,
    setCurrentLang,
    showToast,
    simplifiedView,
    setSimplifiedView,
    sources,
    alerts,
    loadingAlerts,
    fetchAlerts,
    regulatoryTexts,
    selectedProfileId,
    setSelectedProfileId,
    currentProfile,
    engineLevel,
    setEngineLevel,
    engineJurisdiction,
    setEngineJurisdiction,
    engineDomain,
    setEngineDomain,
    engineStatus,
    setEngineStatus,
    engineSearch,
    setEngineSearch,
    filteredRegulatoryTexts,
    engineStats,
    selectedTextDetail,
    setSelectedTextDetail,
    showArchitectureModal,
    setShowArchitectureModal,
    sourceSearch,
    setSourceSearch,
    sourcePaysFilter,
    setSourcePaysFilter,
    sourceTypeFilter,
    setSourceTypeFilter,
    sourceAvailabilityFilter,
    setSourceAvailabilityFilter,
    filteredSources,
    sourceStats,
    selectedSourceDetail,
    setSelectedSourceDetail,
    activeSourcesInPerimeter,
    toggleSourceInPerimeter,
    aiQuestion,
    setAiQuestion,
    aiAnswer,
    setAiAnswer,
    aiLoading,
    handleAskAI,
    alertSearch,
    setAlertSearch,
    alertUrgencyFilter,
    setAlertUrgencyFilter,
    alertSecteurFilter,
    setAlertSecteurFilter,
    alertViewMode,
    setAlertViewMode,
    expandedAlertId,
    setExpandedAlertId,
    filteredAlerts,
    monitoredSectors,
    setMonitoredSectors,
    exportCountries,
    portalSubTab,
    setPortalSubTab,
    isModalOpen,
    setIsModalOpen,
    callbackForm,
    setCallbackForm,
    callbackSubmitting,
    callbackSuccess,
    handleCallbackSubmit,
    getSeverityBadge
  };



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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
          
          <div className="flex items-center justify-between h-16">
          
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



          {/* Action CTAs (Zone 3) — Clean and well spaced */}
          <div className="hidden xl:flex items-center gap-3">
            
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
                    showToast(lang === 'FR' ? 'Langue : français (FR)' : `Version ${lang} en cours de rédaction — la démo reste en français`);
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
          <div className="flex items-center gap-2 xl:hidden">
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

          </div>

          {/* Navigation Links (Zone 2) — Clean modern text links with hover effect */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/50">
            <button 
              onClick={() => setActiveTab('accueil')}
              className={`px-2 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'accueil' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/20' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Accueil
            </button>
            <button 
              onClick={() => setActiveTab('engine')}
              className={`px-2 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'engine' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Moteur Juridique</span>
              <span className={`hidden xl:inline px-1.5 py-0.5 text-[9px] rounded-full font-mono-code font-bold ${
                activeTab === 'engine' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {regulatoryTexts.length}
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('sources')}
              className={`px-2 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'sources' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Sources</span>
              <span className={`hidden xl:inline px-1.5 py-0.5 text-[9px] rounded-full font-mono-code font-bold ${
                activeTab === 'sources' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {sources.length}
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('veille')}
              className={`px-2 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'veille' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Alertes RASFF</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            </button>
            <button 
              onClick={() => setActiveTab('diagnostic')}
              className={`px-2 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'diagnostic' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Cas Réels</span>
            </button>
            <button 
              onClick={() => setActiveTab('tarifs')}
              className={`px-2 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'tarifs' ? 'bg-[#EA580C] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Tarifs
            </button>
            <button 
              onClick={() => setActiveTab('portail')}
              className={`px-2 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'portail' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Portail
            </button>
          </nav>

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
                          showToast(lang === 'FR' ? 'Langue : français (FR)' : `Version ${lang} en cours de rédaction — la démo reste en français`);
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
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveTab('tarifs');
                    }}
                    className="w-full py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <ArrowRight className="w-4 h-4 text-[#EA580C]" />
                    <span>Essai Gratuit — 3 mois</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {activeTab === 'accueil' && <AccueilTab ctx={ctx} />}

      {activeTab === 'engine' && <EngineTab ctx={ctx} />}

      {activeTab === 'sources' && <SourcesTab ctx={ctx} />}

      {activeTab === 'diagnostic' && <DiagnosticTab ctx={ctx} />}

      {activeTab === 'veille' && <VeilleTab ctx={ctx} />}

      {activeTab === 'tarifs' && <TarifsTab ctx={ctx} />}

      {activeTab === 'portail' && <PortailTab ctx={ctx} />}

      <CallbackModal ctx={ctx} />

      <SourceDetailModal ctx={ctx} />

      <ArchitectureModal ctx={ctx} />

      <TextDetailModal ctx={ctx} />


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
            PLATEFORME DE VEILLE ALIMENTAIRE — DÉMONSTRATION · RÉFÉRENTIELS CIBLES : GFSI, IFS FOOD V8, BRCGS ISSUE 9
          </div>
        </div>
      </footer>

    </div>
  );
}