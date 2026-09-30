import { AlertTriangle, Calendar, CheckCircle2, Download, FileText, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import type { AppCtx } from './ctx.js';

export function PortailTab({ ctx }: { ctx: AppCtx }) {
  const { activeSourcesInPerimeter, alerts, exportCountries, getSeverityBadge, monitoredSectors, portalSubTab, setMonitoredSectors, setPortalSubTab, setActiveTab, showToast, sources, toggleSourceInPerimeter } = ctx;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = async () => {
    setLoginLoading(true);
    try {
      const res = await fetch('https://foodsafetywatch.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('fsw_token', data.token);
        localStorage.setItem('fsw_user', JSON.stringify(data.user));
        setIsLoggedIn(true);
        setUserName(data.user.name);
        setShowLogin(false);
        showToast(`Bienvenue ${data.user.name} !`);
      } else {
        showToast(data.error || 'Erreur de connexion');
      }
    } catch {
      showToast('Erreur de connexion au serveur');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fsw_token');
    localStorage.removeItem('fsw_user');
    setIsLoggedIn(false);
    setUserName('');
    showToast('Déconnexion réussie');
  };

  const handleDownloadBulletin = async () => {
    const token = localStorage.getItem('fsw_token');
    if (!token) {
      setShowLogin(true);
      return;
    }
    try {
      const res = await fetch('https://foodsafetywatch.onrender.com/api/bulletin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bulletin-${new Date().toISOString().split('T')[0]}.html`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Bulletin téléchargé !');
      } else {
        showToast('Erreur lors de la génération du bulletin');
      }
    } catch {
      showToast('Erreur de connexion');
    }
  };

  if (showLogin) {
    return (
      <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-heading font-extrabold text-slate-900 mb-2">Connexion</h2>
          <p className="text-sm text-slate-500 mb-6">Accédez à votre espace de veille personnalisé.</p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Email professionnel</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="jean.dupont@entreprise.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#EA580C]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Mot de passe</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-[#EA580C]"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loginLoading}
              className="w-full py-3 bg-[#EA580C] hover:bg-[#c2410c] text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50"
            >
              {loginLoading ? 'Connexion...' : 'Se connecter'}
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className="w-full py-3 text-slate-500 text-sm hover:text-slate-700"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6">

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">

          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-slate-800">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                {isLoggedIn ? userName.charAt(0).toUpperCase() : 'VT'}
              </div>
              <div>
                <div className="font-heading font-bold text-sm text-white">{isLoggedIn ? userName : 'Visi.Tune'}</div>
                <div className="text-[10px] font-mono-code text-[#EA580C]">{isLoggedIn ? 'Connecté' : 'Plan Discovery (Essai 84j)'}</div>
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
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="w-full mt-3 px-3 py-2 text-xs text-slate-400 hover:text-white text-left"
              >
                Déconnexion
              </button>
            )}
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
                  <div className="text-2xl font-heading font-extrabold text-[#EA580C] mt-1">15 Oct</div>
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
                          className="accent-[#EA580C]"
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
                    className="text-xs text-[#EA580C] hover:underline"
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
                          className="accent-[#EA580C]"
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
                      <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#EA580C] uppercase mb-1">
                        <Calendar className="w-3 h-3" />
                        {b.date} • {b.pages}
                      </div>
                      <h4 className="font-heading font-bold text-sm text-white">{b.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">Dossiers clés : {b.highlights}</p>
                    </div>
                    <button 
                      onClick={handleDownloadBulletin}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5 text-[#EA580C]" />
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
                    className="px-4 py-2 bg-[#EA580C] text-white font-bold text-xs rounded-xl"
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
  );
}
