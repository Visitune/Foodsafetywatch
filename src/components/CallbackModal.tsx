import { CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { AppCtx } from './ctx.js';

export function CallbackModal({ ctx }: { ctx: AppCtx }) {
  const { callbackForm, callbackSubmitting, callbackSuccess, handleCallbackSubmit, isModalOpen, setCallbackForm, setIsModalOpen } = ctx;
  return (
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
                    <div className="h-[2px] w-5 bg-[#EA580C]"></div>
                    <span className="text-[10px] font-mono-code text-[#EA580C] uppercase tracking-wider">
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
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EA580C]"
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
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EA580C]"
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
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EA580C]"
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
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Vos enjeux ou questions (optionnel)</label>
                    <textarea 
                      rows={3}
                      placeholder="Ex: Exigences export USA FSMA 204, audit Listeria, emballages PFAS..."
                      value={callbackForm.message}
                      onChange={(e) => setCallbackForm({ ...callbackForm, message: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EA580C]"
                    ></textarea>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={callbackSubmitting}
                  className="w-full py-3 bg-[#EA580C] hover:bg-[#ea580c] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#EA580C]/20 disabled:opacity-50 mt-2"
                >
                  {callbackSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande d\'échange →'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
