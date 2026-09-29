import type { Dispatch, FormEvent, SetStateAction } from 'react';
import type { RegulatorySource, DiagnosticCaseProfile } from '../data/sourcesData.js';
import type { OfficialRegulatoryText, TextStatus } from '../data/regulatoryEngineData.js';
import type { AlertItem } from '../types.js';

export interface AppCtx {
  // Navigation & langue
  activeTab: 'accueil' | 'engine' | 'sources' | 'diagnostic' | 'veille' | 'tarifs' | 'portail';
  setActiveTab: (tab: 'accueil' | 'engine' | 'sources' | 'diagnostic' | 'veille' | 'tarifs' | 'portail') => void;
  currentLang: 'FR' | 'EN' | 'DE';
  setCurrentLang: (lang: 'FR' | 'EN' | 'DE') => void;
  showToast: (msg: string) => void;
  simplifiedView: boolean;
  setSimplifiedView: (v: boolean) => void;

  // Données globales
  sources: RegulatorySource[];
  alerts: AlertItem[];
  loadingAlerts: boolean;
  fetchAlerts: (force?: boolean) => void;
  regulatoryTexts: OfficialRegulatoryText[];

  // Diagnostic (cas réels)
  selectedProfileId: string;
  setSelectedProfileId: (id: string) => void;
  currentProfile: DiagnosticCaseProfile;

  // Moteur juridique (EUR-Lex/Cellar + Légifrance/PISTE)
  engineLevel: 1 | 2 | 3;
  setEngineLevel: (level: 1 | 2 | 3) => void;
  engineJurisdiction: 'ALL' | 'UE' | 'FR';
  setEngineJurisdiction: (j: 'ALL' | 'UE' | 'FR') => void;
  engineDomain: string;
  setEngineDomain: (d: string) => void;
  engineStatus: 'ALL' | TextStatus;
  setEngineStatus: (s: 'ALL' | TextStatus) => void;
  engineSearch: string;
  setEngineSearch: (s: string) => void;
  filteredRegulatoryTexts: OfficialRegulatoryText[];
  engineStats: {
    total: number;
    ueCount: number;
    frCount: number;
    nouveauCount: number;
    modifieCount: number;
    consolideCount: number;
  };
  selectedTextDetail: OfficialRegulatoryText | null;
  setSelectedTextDetail: (text: OfficialRegulatoryText | null) => void;
  showArchitectureModal: boolean;
  setShowArchitectureModal: (v: boolean) => void;

  // Sources
  sourceSearch: string;
  setSourceSearch: (s: string) => void;
  sourcePaysFilter: string;
  setSourcePaysFilter: (s: string) => void;
  sourceTypeFilter: string;
  setSourceTypeFilter: (s: string) => void;
  sourceAvailabilityFilter: 'ALL' | 'AVAILABLE' | 'UPCOMING';
  setSourceAvailabilityFilter: (s: 'ALL' | 'AVAILABLE' | 'UPCOMING') => void;
  filteredSources: RegulatorySource[];
  sourceStats: { total: number; available: number; upcoming: number };
  selectedSourceDetail: RegulatorySource | null;
  setSelectedSourceDetail: (source: RegulatorySource | null) => void;
  activeSourcesInPerimeter: string[];
  toggleSourceInPerimeter: (sourceId: string) => void;

  // Assistant IA
  aiQuestion: string;
  setAiQuestion: (s: string) => void;
  aiAnswer: string | null;
  setAiAnswer: (s: string | null) => void;
  aiLoading: boolean;
  handleAskAI: (e: FormEvent) => void;

  // Veille (alertes)
  alertSearch: string;
  setAlertSearch: (s: string) => void;
  alertUrgencyFilter: 'ALL' | AlertItem['severity'];
  setAlertUrgencyFilter: (s: 'ALL' | AlertItem['severity']) => void;
  alertSecteurFilter: string;
  setAlertSecteurFilter: (s: string) => void;
  alertViewMode: 'list' | 'grid';
  setAlertViewMode: (m: 'list' | 'grid') => void;
  expandedAlertId: string | null;
  setExpandedAlertId: (id: string | null) => void;
  filteredAlerts: AlertItem[];

  // Portail client
  monitoredSectors: string[];
  setMonitoredSectors: Dispatch<SetStateAction<string[]>>;
  exportCountries: string[];
  portalSubTab: 'dashboard' | 'perimetre' | 'bulletins' | 'alertes' | 'abonnement';
  setPortalSubTab: (tab: 'dashboard' | 'perimetre' | 'bulletins' | 'alertes' | 'abonnement') => void;

  // Modal rappel expert
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  callbackForm: { name: string; email: string; phone: string; company: string; message: string };
  setCallbackForm: Dispatch<SetStateAction<{ name: string; email: string; phone: string; company: string; message: string }>>;
  callbackSubmitting: boolean;
  callbackSuccess: boolean;
  handleCallbackSubmit: (e: FormEvent) => void;

  // Utilitaires
  getSeverityBadge: (severity: string) => string;
}
