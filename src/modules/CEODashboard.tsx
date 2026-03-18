import React, { useState } from 'react';
import { 
  Package, Scale, 
  TrendingUp, TrendingDown, Save,
  FileText, Download, PieChart,
  DollarSign
} from 'lucide-react';
import { RAW_MATERIALS, SAADEE_MENU } from '../data/saadeeMenu';
import { GlassCard } from '../components/PremiumUI';

export const CEODashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'Stats' | 'Costing' | 'Stock' | 'Reports'>('Stats');
    const [materials, setMaterials] = useState(RAW_MATERIALS);
    const selectedRecipe = SAADEE_MENU[0];

    // Mock recipe composition for the selected item
    const mockRecipe = [
        { materialId: 'mat-1', quantity: 0.1, unit: 'kg' }, // 100g farine
        { materialId: 'mat-2', quantity: 0.05, unit: 'kg' }, // 50g beurre
        { materialId: 'mat-4', quantity: 1, unit: 'unité' }, // 1 oeuf
    ];

    const calculateCost = () => {
        return mockRecipe.reduce((acc, r) => {
            const mat = materials.find(m => m.id === r.materialId);
            return acc + (mat ? mat.pricePerUnit * r.quantity : 0);
        }, 0);
    };

    const costPrice = calculateCost();
    const margin = selectedRecipe.price - costPrice;
    const marginPercent = (margin / selectedRecipe.price) * 100;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-primary">Espace CEO</h2>
                    <p className="text-zinc-500 font-medium mt-1">Pilotage stratégique de Villa No Bad Days.</p>
                </div>
                <div className="flex bg-zinc-100 p-1.5 rounded-xl border border-zinc-200">
                    {(['Stats', 'Costing', 'Stock', 'Reports'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg' : 'text-zinc-400 hover:text-primary'}`}
                        >
                            {tab === 'Stats' && 'Statistiques'}
                            {tab === 'Costing' && 'Recalibrage'}
                            {tab === 'Stock' && 'Inventaire'}
                            {tab === 'Reports' && 'Rapports'}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'Stats' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassCard className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">+12% vs hier</span>
                        </div>
                        <h4 className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">CA du Jour</h4>
                        <p className="text-3xl font-black mt-2 text-zinc-900">425 500 F</p>
                    </GlassCard>

                    <GlassCard className="p-6 text-accent">
                         <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-accent/10">
                                <PieChart className="w-5 h-5" />
                            </div>
                        </div>
                        <h4 className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Top Catégorie</h4>
                        <p className="text-3xl font-black mt-2 text-zinc-900">Ô My Dog</p>
                        <p className="text-xs text-zinc-500 font-medium mt-1">65% des ventes totales</p>
                    </GlassCard>

                    <GlassCard className="p-6">
                         <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                        <h4 className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Marge Moyenne</h4>
                        <p className="text-3xl font-black mt-2 text-zinc-800">42%</p>
                    </GlassCard>
                </div>
            )}

            {activeTab === 'Costing' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Raw Materials Editor */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-black flex items-center gap-2 text-zinc-800">
                            <Package className="w-5 h-5 text-primary" /> Matières Premières
                        </h3>
                        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-100 shadow-sm">
                            {materials.map(mat => (
                                <div key={mat.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-zinc-800">{mat.name}</span>
                                        <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">Unité: {mat.unit}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="number" 
                                            value={mat.pricePerUnit} 
                                            onChange={(e) => {
                                                const newVal = parseInt(e.target.value);
                                                setMaterials(prev => prev.map(m => m.id === mat.id ? {...m, pricePerUnit: newVal} : m));
                                            }}
                                            className="w-24 bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-right font-black text-sm focus:outline-none focus:border-primary text-zinc-700"
                                        />
                                        <span className="text-[10px] font-black text-zinc-400">F/{mat.unit}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-300 hover:text-primary hover:border-primary/20 transition-all text-[10px] font-black uppercase tracking-widest">
                            + AJOUTER UNE MATIÈRE
                        </button>
                    </div>

                    {/* Recipe Recalibrator */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Scale className="w-5 h-5 text-accent" /> Fiche Technique : {selectedRecipe.name}
                        </h3>
                        <GlassCard className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Coût de Revient</span>
                                    <p className="text-2xl font-black text-red-500">{costPrice.toFixed(0)} F</p>
                                </div>
                                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Marge brute</span>
                                    <p className="text-2xl font-black text-green-600">{margin.toFixed(0)} F</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-300">
                                    <span>Ingrédient</span>
                                    <span>Quantité</span>
                                    <span>Coût</span>
                                </div>
                                {mockRecipe.map(r => {
                                    const mat = materials.find(m => m.id === r.materialId);
                                    return (
                                        <div key={r.materialId} className="flex justify-between items-center py-2 border-t border-zinc-50 text-sm">
                                            <span className="font-bold text-zinc-700">{mat?.name}</span>
                                            <span className="text-zinc-500 font-medium">{r.quantity} {r.unit}</span>
                                            <span className="font-black text-zinc-900">{(mat ? mat.pricePerUnit * r.quantity : 0).toFixed(0)} F</span>
                                        </div>
                                    );
                                })}
                            </div>

                             <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                                <div>
                                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Marge en %</span>
                                    <p className="text-2xl font-black text-primary">{marginPercent.toFixed(1)}%</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {marginPercent < 30 ? (
                                        <div className="bg-red-500/10 text-red-500 px-3 py-1.5 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                                            <TrendingDown className="w-3 h-3" /> MARGE FAIBLE
                                        </div>
                                    ) : (
                                        <div className="bg-green-500/10 text-green-500 px-3 py-1.5 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                                            <TrendingUp className="w-3 h-3" /> EXCELLENT
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button className="w-full py-4 bg-accent text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-accent/20">
                                <Save className="w-5 h-5" /> SAUVEGARDER MODIFICATIONS
                            </button>
                        </GlassCard>
                    </div>
                </div>
            )}

            {activeTab === 'Reports' && (
                <div className="space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-white" /> Rapports de Clôture
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <GlassCard key={i} className="p-6 group hover:border-primary/50 transition-all cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <FileText className="w-6 h-6 text-white/40 group-hover:text-primary transition-colors" />
                                    </div>
                                    <button className="p-2 rounded-lg hover:bg-white/10">
                                        <Download className="w-4 h-4 text-white/40" />
                                    </button>
                                </div>
                                <h5 className="font-bold">Rapport du 1{i}/03/2026</h5>
                                <p className="text-xs text-white/40 mt-1">Généré à 23h45 | Clôture par CEO</p>
                                <div className="mt-4 flex justify-between items-center text-sm">
                                    <span className="text-white/60">CA Total</span>
                                    <span className="font-black text-primary">{(380000 + (i * 15000)).toLocaleString()} F</span>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
