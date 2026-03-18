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
                    <h2 className="text-3xl font-bold tracking-tight">Espace CEO</h2>
                    <p className="text-white/40 mt-1">Pilotage stratégique de Villa No Bad Days.</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    {(['Stats', 'Costing', 'Stock', 'Reports'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
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
                            <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+12% vs hier</span>
                        </div>
                        <h4 className="text-sm text-white/40 font-bold uppercase tracking-wider">CA du Jour</h4>
                        <p className="text-3xl font-black mt-2">425 500 F</p>
                    </GlassCard>

                    <GlassCard className="p-6 text-accent">
                         <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-accent/10">
                                <PieChart className="w-5 h-5" />
                            </div>
                        </div>
                        <h4 className="text-sm text-white/40 font-bold uppercase tracking-wider">Top Catégorie</h4>
                        <p className="text-3xl font-black mt-2 text-white">Ô My Dog</p>
                        <p className="text-xs text-white/40 mt-1">65% des ventes totales</p>
                    </GlassCard>

                    <GlassCard className="p-6">
                         <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                        <h4 className="text-sm text-white/40 font-bold uppercase tracking-wider">Marge Moyenne</h4>
                        <p className="text-3xl font-black mt-2">42%</p>
                    </GlassCard>
                </div>
            )}

            {activeTab === 'Costing' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Raw Materials Editor */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" /> Matières Premières
                        </h3>
                        <div className="bg-surface/30 border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                            {materials.map(mat => (
                                <div key={mat.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">{mat.name}</span>
                                        <span className="text-[10px] text-white/40 uppercase tracking-widest">Unité: {mat.unit}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="number" 
                                            value={mat.pricePerUnit} 
                                            onChange={(e) => {
                                                const newVal = parseInt(e.target.value);
                                                setMaterials(prev => prev.map(m => m.id === mat.id ? {...m, pricePerUnit: newVal} : m));
                                            }}
                                            className="w-24 bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-right font-bold text-sm focus:outline-none focus:border-primary"
                                        />
                                        <span className="text-[10px] font-bold text-white/40">F/{mat.unit}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-white/20 hover:text-white hover:border-white/20 transition-all text-sm font-bold">
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
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-bold text-white/40 uppercase">Coût de Revient</span>
                                    <p className="text-2xl font-black text-red-400">{costPrice.toFixed(0)} F</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-bold text-white/40 uppercase">Marge brute</span>
                                    <p className="text-2xl font-black text-green-400">{margin.toFixed(0)} F</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-white/20">
                                    <span>Ingrédient</span>
                                    <span>Quantité</span>
                                    <span>Coût</span>
                                </div>
                                {mockRecipe.map(r => {
                                    const mat = materials.find(m => m.id === r.materialId);
                                    return (
                                        <div key={r.materialId} className="flex justify-between items-center py-2 border-t border-white/5 text-sm">
                                            <span className="font-bold">{mat?.name}</span>
                                            <span className="text-white/60">{r.quantity} {r.unit}</span>
                                            <span className="font-black">{(mat ? mat.pricePerUnit * r.quantity : 0).toFixed(0)} F</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-white/40 uppercase">Marge en %</span>
                                    <p className="text-xl font-black text-primary">{marginPercent.toFixed(1)}%</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {marginPercent < 30 ? (
                                        <div className="bg-red-500/10 text-red-500 p-2 rounded-lg flex items-center gap-2 text-[10px] font-bold">
                                            <TrendingDown className="w-3 h-3" /> MARGE FAIBLE
                                        </div>
                                    ) : (
                                        <div className="bg-green-500/10 text-green-500 p-2 rounded-lg flex items-center gap-2 text-[10px] font-bold">
                                            <TrendingUp className="w-3 h-3" /> BONNE MARGE
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
