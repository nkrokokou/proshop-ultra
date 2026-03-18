import React, { useState, useEffect } from "react";
import type { SaadeLoyalty, LoyaltyAgent, Client, LoyaltyCotisation } from "../types";
import { db } from "../lib/db";
import { 
  Search, Plus,
  Award, Shield, History
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../components/PremiumUI";

export const SaadeLoyaltyModule: React.FC = () => {
    const [loyalty, setLoyalty] = useState<SaadeLoyalty[]>([]);
    const [agents, setAgents] = useState<LoyaltyAgent[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'POINTS' | 'TONTINE'>('TONTINE');
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [showCotisationModal, setShowCotisationModal] = useState(false);
    const [selectedLoyalty, setSelectedLoyalty] = useState<SaadeLoyalty | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [lData, aData, cData] = await Promise.all([
            db.getLoyalty(),
            db.getLoyaltyAgents(),
            db.getClients()
        ]);
        setLoyalty(lData);
        setAgents(aData);
        setClients(cData);
    };

    const handleEnroll = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const clientId = fd.get('clientId') as string;
        const client = clients.find(c => c.id === clientId);

        const newLoyalty: SaadeLoyalty = {
            id: `LOY-${Date.now()}`,
            clientId,
            clientName: client?.name || 'Inconnu',
            currentAmount: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: 'ACTIVE',
            mode: fd.get('mode') as any,
            targetAmount: Number(fd.get('targetAmount')),
            contributionAmount: Number(fd.get('contributionAmount')),
            frequency: fd.get('frequency') as any,
            carnetNumber: fd.get('carnetNumber') as string,
            startDate: Date.now(),
            isProductDelivered: false
        };

        await db.saveLoyalty(newLoyalty);
        setShowEnrollModal(false);
        loadData();
    };

    const handleCotisation = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedLoyalty) return;
        const fd = new FormData(e.currentTarget);
        
        const amount = Number(fd.get('amount'));
        const cotisation: LoyaltyCotisation = {
            id: `COT-${Date.now()}`,
            carnetId: selectedLoyalty.id,
            clientId: selectedLoyalty.clientId,
            agentId: fd.get('agentId') as string,
            amount: amount,
            date: Date.now(),
            paymentMethod: fd.get('paymentMethod') as any,
            status: 'VALIDATED',
            createdAt: Date.now()
        };

        await db.saveLoyaltyCotisation(cotisation);
        
        // Update total balance in loyalty record
        const updated = { ...selectedLoyalty, currentAmount: selectedLoyalty.currentAmount + amount };
        await db.saveLoyalty(updated);
        
        setShowCotisationModal(false);
        setSelectedLoyalty(null);
        loadData();
    };

    const filteredLoyalty = loyalty.filter(l => 
        (l.mode === viewMode || (viewMode === 'POINTS' && !l.mode)) &&
        (l.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
         l.carnetNumber?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-primary uppercase">Saadé {viewMode === 'TONTINE' ? 'Tontine' : 'Fidélité'}</h2>
                    <p className="text-zinc-500 font-medium mt-1">Gérez les épargnes et la fidélisation de vos clients.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex p-1 bg-zinc-100 rounded-2xl">
                        <button onClick={() => setViewMode('TONTINE')} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${viewMode === 'TONTINE' ? 'bg-white text-primary shadow-sm' : 'text-zinc-400'}`}>TONTINE</button>
                        <button onClick={() => setViewMode('POINTS')} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${viewMode === 'POINTS' ? 'bg-white text-primary shadow-sm' : 'text-zinc-400'}`}>Fidélité</button>
                    </div>
                    <button onClick={() => setShowEnrollModal(true)} className="neo-button flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Nouvelle Inscription
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <GlassCard className="p-6 bg-zinc-950 text-white border-none shadow-2xl shadow-zinc-950/20">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Épargne Totale</p>
                    <h3 className="text-3xl font-black text-primary tracking-tighter">
                        {loyalty.filter(l => l.mode === 'TONTINE').reduce((sum, l) => sum + l.currentAmount, 0).toLocaleString()} F
                    </h3>
                </GlassCard>
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassCard className="p-6 border-none shadow-xl shadow-zinc-100 flex items-center justify-between">
                         <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Carnets Actifs</p>
                            <h3 className="text-2xl font-black text-zinc-800">{loyalty.filter(l => l.status === 'ACTIVE').length}</h3>
                         </div>
                         <Shield className="w-8 h-8 text-zinc-200" />
                    </GlassCard>
                    <GlassCard className="p-6 border-none bg-zinc-50/50 flex items-center justify-between">
                         <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Objectifs Atteints</p>
                            <h3 className="text-2xl font-black text-zinc-800">
                                {loyalty.filter(l => l.targetAmount && l.currentAmount >= l.targetAmount).length}
                            </h3>
                         </div>
                         <Award className="w-8 h-8 text-zinc-200" />
                    </GlassCard>
                    <GlassCard className="p-6 border-none bg-zinc-50/50 flex items-center justify-between">
                         <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Agents Terrain</p>
                            <h3 className="text-2xl font-black text-zinc-800">{agents.length}</h3>
                         </div>
                         <History className="w-8 h-8 text-zinc-200" />
                    </GlassCard>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                    type="text" 
                    placeholder="Rechercher par nom, téléphone ou numéro de carnet..."
                    className="w-full pl-16 pr-8 py-5 bg-white border-none rounded-[2rem] font-black text-xs text-zinc-800 shadow-xl shadow-zinc-200/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLoyalty.map(item => (
                    <GlassCard 
                        key={item.id} 
                        className={`p-6 hover:border-primary transition-all cursor-pointer group flex flex-col gap-4 ${item.currentAmount >= (item.targetAmount || 0) ? 'border-green-200 bg-green-50/30' : ''}`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center font-black text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all">
                                    {item.clientName.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-black text-zinc-800 uppercase tracking-tighter">{item.clientName}</h4>
                                    <p className="text-[9px] font-black text-zinc-400 uppercase">#{item.carnetNumber || 'FIDELITE'}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${item.status === 'ACTIVE' ? 'bg-blue-100 text-blue-600' : 'bg-zinc-100 text-zinc-400'}`}>
                                {item.status}
                            </span>
                        </div>

                        <div className="space-y-2 py-2">
                            <div className="flex justify-between text-[9px] font-black uppercase">
                                <span className="text-zinc-400">Progression</span>
                                <span className="text-zinc-800">{item.currentAmount.toLocaleString()} / {item.targetAmount?.toLocaleString() || '-'} F</span>
                            </div>
                            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-1000 ${item.currentAmount >= (item.targetAmount || 0) ? 'bg-green-500' : 'bg-primary'}`}
                                    style={{ width: `${Math.min(100, (item.currentAmount / (item.targetAmount || 1)) * 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                            <button 
                                onClick={() => { setSelectedLoyalty(item); setShowCotisationModal(true); }}
                                className="flex-1 py-3 bg-zinc-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all"
                            >
                                Encaisser
                            </button>
                            <button className="px-4 py-2 bg-zinc-100 text-zinc-400 rounded-xl hover:bg-primary hover:text-white transition-all">
                                <History className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showEnrollModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEnrollModal(false)} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
                            <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter text-primary">Nouveau Carnet Saadé</h3>
                            <form onSubmit={handleEnroll} className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Choisir Client</label>
                                    <select name="clientId" required className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs">
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Type Entente</label>
                                    <select name="mode" className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs">
                                        <option value="TONTINE">Épargne/Tontine</option>
                                        <option value="POINTS">Fidélité (Points)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">N° Carnet</label>
                                    <input name="carnetNumber" required className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Objectif (F)</label>
                                    <input type="number" name="targetAmount" required className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Mise Fixe (Optionnel)</label>
                                    <input type="number" name="contributionAmount" className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs" />
                                </div>
                                <div className="col-span-2">
                                    <button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/30 mt-4">
                                        Valider Inscription
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {showCotisationModal && selectedLoyalty && (
                     <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCotisationModal(false)} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl">
                            <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Cotisation</h3>
                            <p className="text-[10px] font-black text-zinc-400 uppercase mb-8">{selectedLoyalty.clientName} • #{selectedLoyalty.carnetNumber}</p>
                            <form onSubmit={handleCotisation} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Montant Versé</label>
                                    <input type="number" name="amount" defaultValue={selectedLoyalty.contributionAmount} required className="w-full p-5 bg-zinc-50 border-none rounded-2xl font-black text-xl text-primary" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Agent de Collecte</label>
                                    <select name="agentId" required className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs">
                                        {agents.map(a => <option key={a.id} value={a.id}>{a.fullName}</option>)}
                                        <option value="caissiere">Caissière (Sur place)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Méthode</label>
                                    <select name="paymentMethod" className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs">
                                        <option value="CASH">Éspèces</option>
                                        <option value="MOBILE_MONEY">Mobile Money</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full py-5 bg-zinc-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-zinc-950/20 mt-4">
                                    Enregistrer Versement
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
