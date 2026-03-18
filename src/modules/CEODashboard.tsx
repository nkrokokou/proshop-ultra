import React, { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { 
  TrendingDown, DollarSign, 
  BarChart3, PieChart, ArrowUpRight, 
  Zap, Target, Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/PremiumUI';

export const CEODashboard: React.FC = () => {
    const sales = useLiveQuery(() => db.sales.toArray());
    const expenses = useLiveQuery(() => db.expenses.toArray());
    const batches = useLiveQuery(() => db.productionBatches.toArray());

    const financials = useMemo(() => {
        if (!sales || !expenses || !batches) return { revenue: 0, outgoing: 0, productionCount: 0, profit: 0 };
        
        const revenue = sales.reduce((acc, s) => acc + s.total, 0);
        const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
        const productionCount = batches.length;
        const profit = revenue - totalExpenses;

        return { revenue, outgoing: totalExpenses, productionCount, profit };
    }, [sales, expenses, batches]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic">Monitoring Saadé</h2>
                    <p className="text-zinc-400 font-bold mt-1 uppercase text-[10px] tracking-[0.3em]">Business Intelligence & Rentabilité Nette</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex p-1 bg-zinc-100 rounded-2xl">
                        <button className="px-6 py-2 bg-white text-primary rounded-xl text-[10px] font-black shadow-sm uppercase tracking-widest">Temps Réel</button>
                        <button className="px-6 py-2 text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest">Vision Mensuelle</button>
                    </div>
                </div>
            </div>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <GlassCard className="p-8 bg-zinc-900 text-white border-none shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <DollarSign className="w-24 h-24" />
                    </div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Chiffre d'Affaires Cash</p>
                    <h3 className="text-4xl font-black tracking-tighter mb-6">{financials.revenue.toLocaleString()} F</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-green-400">
                        <ArrowUpRight className="w-4 h-4" />
                        <span>+14.5% vs mois dernier</span>
                    </div>
                </GlassCard>

                <GlassCard className="p-8 bg-red-500 text-white border-none shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <TrendingDown className="w-24 h-24" />
                    </div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Dépenses Opérationnelles</p>
                    <h3 className="text-4xl font-black tracking-tighter mb-6">{financials.outgoing.toLocaleString()} F</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-white/60">
                        <span>Flux sortants identifiés</span>
                    </div>
                </GlassCard>

                <GlassCard className={`p-8 border-none shadow-2xl relative overflow-hidden group ${financials.profit >= 0 ? 'bg-primary' : 'bg-orange-600'} text-white`}>
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <Briefcase className="w-24 h-24" />
                    </div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Bénéfice Net Estimé</p>
                    <h3 className="text-4xl font-black tracking-tighter mb-6">{financials.profit.toLocaleString()} F</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-white/80">
                        <Target className="w-4 h-4" />
                        <span>Objectif mensuel: 85% atteint</span>
                    </div>
                </GlassCard>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GlassCard className="p-8">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black text-zinc-800 uppercase tracking-tighter">Courbe de Croissance</h3>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">Évolution du CA sur les 7 derniers jours</p>
                        </div>
                        <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="h-64 flex items-end gap-2 pb-4">
                        {[40, 60, 45, 90, 65, 80, 100].map((h, i) => (
                            <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.1, duration: 1 }}
                                className="flex-1 bg-primary/10 hover:bg-primary rounded-t-lg transition-colors relative group"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {(h * 1000).toLocaleString()}F
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                        <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
                    </div>
                </GlassCard>

                <div className="grid grid-cols-1 gap-8">
                    <GlassCard className="p-8 bg-zinc-50 border-none flex items-center justify-between">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-primary">
                                <Zap className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-zinc-800 uppercase tracking-tighter">Activité Production</h3>
                                <p className="text-xs font-bold text-zinc-400 uppercase">{financials.productionCount} fournées terminées ce mois</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-2xl font-black text-primary tracking-tighter">Laboratoire Saadé</p>
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Mode Optimisé</span>
                         </div>
                    </GlassCard>

                    <GlassCard className="p-8 border-dashed border-2 border-zinc-200 bg-transparent flex flex-col items-center justify-center text-center">
                        <PieChart className="w-10 h-10 text-zinc-300 mb-4" />
                        <h4 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Répartition des Dépenses</h4>
                        <p className="text-[10px] font-bold text-zinc-400 mt-2">Analysez vos coûts par catégorie pour optimiser vos marges.</p>
                        <button className="mt-6 px-6 py-2 bg-zinc-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">Consulter le rapport complet</button>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};
