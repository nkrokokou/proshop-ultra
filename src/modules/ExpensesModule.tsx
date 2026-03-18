import React, { useState, useEffect } from "react";
import type { Expense } from "../types";
import { db } from "../lib/db";
import { 
  DollarSign, Plus, Trash2, Calendar, 
  Search, TrendingDown,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../components/PremiumUI";

export const ExpensesModule: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("ALL");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await db.getExpenses();
        setExpenses(data);
    };

    const handleSaveExpense = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        
        const expense: Expense = {
            id: `EXP-${Date.now()}`,
            category: fd.get('category') as any,
            amount: Number(fd.get('amount')),
            description: fd.get('description') as string,
            date: new Date(fd.get('date') as string).getTime(),
            paymentMethod: fd.get('paymentMethod') as any,
            agentName: 'Admin' // Placeholder
        };

        await db.saveExpense(expense);
        setShowModal(false);
        loadData();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Supprimer cette dépense ?')) {
            await db.deleteExpense(id);
            loadData();
        }
    };

    const categories = ['ALL', 'LOYER', 'SALAIRES', 'MATIERES_PREMIERES', 'ELECTRICITE', 'AUTRE'];
    
    const filteredExpenses = expenses.filter(e => {
        const matchesSearch = e.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = filterCategory === "ALL" || e.category === filterCategory;
        return matchesSearch && matchesCat;
    });

    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-primary uppercase italic">Finance Saadé</h2>
                    <p className="text-zinc-500 font-medium mt-1">Suivi des flux sortants & contrôle des coûts opérationnels.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="neo-button flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Enregistrer Dépense
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <GlassCard className="p-6 bg-red-500 text-white border-none shadow-2xl">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Dépenses (Période)</p>
                    <h3 className="text-3xl font-black tracking-tighter">{totalExpenses.toLocaleString()} F</h3>
                    <div className="flex items-center gap-1 mt-4 text-[10px] font-bold text-white/60">
                        <TrendingDown className="w-3 h-3" />
                        <span>Sortie de trésorerie</span>
                    </div>
                </GlassCard>
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassCard className="p-6 border-none shadow-xl shadow-zinc-100 flex items-center justify-between">
                         <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Plus Grosse Catégorie</p>
                            <h3 className="text-xl font-black text-zinc-800 uppercase tracking-tighter">Matières Prem.</h3>
                         </div>
                         <ArrowUpRight className="w-8 h-8 text-red-50" />
                    </GlassCard>
                    <GlassCard className="p-6 border-none bg-zinc-50/50 flex items-center justify-between">
                         <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Moyenne / Jour</p>
                            <h3 className="text-xl font-black text-zinc-800">12 500 F</h3>
                         </div>
                         <Calendar className="w-8 h-8 text-zinc-100" />
                    </GlassCard>
                    <GlassCard className="p-6 border-none bg-primary text-white flex items-center justify-between">
                         <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Cash en Caisse</p>
                            <h3 className="text-xl font-black">2.4M F</h3>
                         </div>
                         <DollarSign className="w-8 h-8 text-white/20" />
                    </GlassCard>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                        type="text" 
                        placeholder="Rechercher par description..."
                        className="w-full pl-16 pr-8 py-5 bg-white border-none rounded-[2rem] font-black text-xs text-zinc-800 shadow-xl shadow-zinc-200/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex p-1 bg-zinc-100 rounded-2xl">
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => setFilterCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-[9px] font-black transition-all ${filterCategory === cat ? 'bg-white text-primary shadow-sm' : 'text-zinc-400 uppercase'}`}
                        >
                            {cat === 'ALL' ? 'Tout' : cat.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <GlassCard className="p-0 overflow-hidden border-none shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-zinc-100 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                                <th className="px-8 py-6">Date / Heure</th>
                                <th className="px-8 py-6">Catégorie</th>
                                <th className="px-8 py-6">Description</th>
                                <th className="px-8 py-6">Méthode</th>
                                <th className="px-8 py-6 text-right">Montant</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {filteredExpenses.map(exp => (
                                <tr key={exp.id} className="group hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-zinc-300" />
                                            <div>
                                                <p className="text-xs font-black text-zinc-800">{new Date(exp.date).toLocaleDateString()}</p>
                                                <p className="text-[9px] font-bold text-zinc-400 italic">{new Date(exp.date).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-red-50 text-red-500 border border-red-100 rounded-lg text-[8px] font-black uppercase tracking-widest">
                                            {exp.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-black text-zinc-600 uppercase italic">{exp.description}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase">{exp.paymentMethod}</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <p className="text-lg font-black text-red-500 tracking-tighter">-{exp.amount.toLocaleString()} F</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => handleDelete(exp.id)}
                                            className="p-3 bg-zinc-100 text-zinc-300 rounded-xl hover:bg-zinc-950 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl">
                            <h3 className="text-2xl font-black mb-10 uppercase tracking-tighter text-red-500">Nouvelle Sortie de Fonds</h3>
                            <form onSubmit={handleSaveExpense} className="grid grid-cols-2 gap-8">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2 ml-2">Description</label>
                                    <input name="description" required className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs" placeholder="Ex: Achat sacs de farine, Facture CIE..." />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2 ml-2">Catégorie</label>
                                    <select name="category" className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs">
                                        {categories.filter(c => c !== 'ALL').map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2 ml-2">Date</label>
                                    <input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} required className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs" />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2 ml-2">Montant (F)</label>
                                    <input type="number" name="amount" required className="w-full p-6 bg-red-50 border-none rounded-2xl font-black text-2xl text-red-500 text-center" placeholder="0" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2 ml-2">Méthode Paiement</label>
                                    <select name="paymentMethod" className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs">
                                        <option value="CASH">Espèces</option>
                                        <option value="ORANGE_MONEY">Orange Money</option>
                                        <option value="WAVE">Wave</option>
                                        <option value="BANK">Virement Bancaire</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button type="submit" className="w-full py-5 bg-red-500 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-red-500/30 mb-1">
                                        Valider la Dépense
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
