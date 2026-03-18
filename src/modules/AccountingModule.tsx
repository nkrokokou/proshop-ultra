import { Table, ArrowUpRight } from 'lucide-react';
import { GlassCard } from '../components/PremiumUI';

export const AccountingModule = () => {
    const chartAccounts = [
        { code: '101', label: 'Capital Social', category: 'CAPITAUX', balance: 5000000, type: 'CRÉDIT' },
        { code: '211', label: 'Matériel Industriel (Four, Pétrins)', category: 'IMMOBILISATIONS', balance: 12500000, type: 'DÉBIT' },
        { code: '401', label: 'Fournisseurs Matières Premières', category: 'DETTES', balance: 450000, type: 'CRÉDIT' },
        { code: '512', label: 'Banque (Orabank)', category: 'TRÉSORERIE', balance: 2850000, type: 'DÉBIT' },
        { code: '531', label: 'Caisse Magasin', category: 'TRÉSORERIE', balance: 125000, type: 'DÉBIT' },
        { code: '601', label: 'Achats Matières Premières', category: 'CHARGES', balance: 1850000, type: 'DÉBIT' },
        { code: '641', label: 'Rémunération Personnel', category: 'CHARGES', balance: 950000, type: 'DÉBIT' },
        { code: '701', label: 'Ventes de Produits Finis', category: 'PRODUITS', balance: 4250000, type: 'CRÉDIT' },
    ];

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-zinc-900 uppercase">Plan Comptable & Finance</h2>
                    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-1">Structure OHADA - Pilotage Financier Saadé</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6 border-l-4 border-l-emerald-500">
                    <p className="text-[10px] font-black text-zinc-400 uppercase mb-2">Trésorerie Nette</p>
                    <p className="text-3xl font-black text-emerald-600">2 975 000 F</p>
                    <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold mt-2">
                        <ArrowUpRight className="w-3 h-3" /> +12% ce mois
                    </div>
                </GlassCard>
                <GlassCard className="p-6 border-l-4 border-l-rose-500">
                    <p className="text-[10px] font-black text-zinc-400 uppercase mb-2">Dettes Fournisseurs</p>
                    <p className="text-3xl font-black text-rose-600">450 000 F</p>
                    <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold mt-2">
                        Échéances à 15 jours
                    </div>
                </GlassCard>
                <GlassCard className="p-6 border-l-4 border-l-primary">
                    <p className="text-[10px] font-black text-zinc-400 uppercase mb-2">Résultat Provisoire</p>
                    <p className="text-3xl font-black text-primary">1 450 000 F</p>
                    <div className="flex items-center gap-2 text-primary text-[10px] font-bold mt-2">
                        Objectif : 2.5M F
                    </div>
                </GlassCard>
            </div>

            <GlassCard className="overflow-hidden">
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                    <h3 className="font-black uppercase text-xs tracking-widest flex items-center gap-2">
                        <Table className="w-4 h-4 text-primary" /> Grand Livre des Comptes
                    </h3>
                    <div className="flex gap-2">
                         <span className="px-3 py-1 bg-white border border-zinc-200 rounded-lg text-[10px] font-bold uppercase cursor-pointer hover:bg-zinc-100 transition-colors">Exporter PDF</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-zinc-50 text-zinc-400 font-black uppercase tracking-widest border-b border-zinc-100">
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Intitulé du Compte</th>
                                <th className="px-6 py-4">Catégorie</th>
                                <th className="px-6 py-4 text-right">Solde</th>
                                <th className="px-6 py-4 text-center">Sens</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {chartAccounts.map((acc) => (
                                <tr key={acc.code} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-primary">{acc.code}</td>
                                    <td className="px-6 py-4 font-bold text-zinc-700">{acc.label}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-zinc-100 text-zinc-500 rounded text-[9px] font-black uppercase">
                                            {acc.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-black tabular-nums">
                                        {acc.balance.toLocaleString()} F
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${acc.type === 'DÉBIT' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                            {acc.type}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};
