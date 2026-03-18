```javascript
import React, { useState } from 'react';
import {
  Settings, Database, Download, Upload, 
  Trash2, Save, CheckCircle2, RefreshCw,
  Layout
} from 'lucide-react';
import { GlassCard } from '../components/PremiumUI';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';

export const InventoryModule: React.FC = () => {
    const [filter, setFilter] = useState('ALL');

    const products = useLiveQuery(
        () => db.products.toArray(),
        []
    );

    const filteredProducts = products?.filter(p => {
        if (filter === 'ALL') return true;
        if (filter === 'MATIERES') return p.category === 'Matières Premières';
        if (filter === 'PATISSERIE') return p.category === 'Pâtisserie';
        if (filter === 'REPRODUCTION') return p.category === 'Produits Finis';
        if (filter === 'BOISSONS') return p.category === 'Boissons';
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Inventaire Universel</h2>
                    <p className="text-white/40">Gérez vos stocks intelligemment à travers tous les modules.</p>
                </div>
                <button className="neo-button flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Nouvel Article
                </button>
            </div>

            <div className="flex gap-4">
                <GlassCard className="flex-1 p-2" hover={false}>
                    <div className="flex items-center gap-2 px-2">
                        <Filter className="w-4 h-4 text-white/20" />
                        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                            {['ALL', 'MATIERES', 'PATISSERIE', 'RESTAURATION', 'BOISSONS'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${filter === f ? 'bg-primary text-white' : 'hover:bg-white/5 text-white/40'}`}
                                >
                                    {f === 'ALL' ? 'TOUT' :
                                     f === 'MATIERES' ? 'MATIÈRES PREMIÈRES' :
                                     f === 'RESTAURATION' ? 'RESTAURANT (ÔMyDog)' : f}
                                </button>
                            ))}
                        </div>
                    </div>
                </GlassCard>
                <GlassCard className="w-64 p-2" hover={false}>
                    <div className="relative">
                        <Scan className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input type="text" placeholder="Scan Barcode..." className="bg-transparent border-none focus:ring-0 text-sm pl-10 w-full" />
                    </div>
                </GlassCard>
            </div>

            {/* Modern Table Layout */}
            <GlassCard className="p-0 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest">Article</th>
                            <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest">Catégorie</th>
                            <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest">Stock / Etat</th>
                            <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest">Prix</th>
                             <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredProducts?.map(product => (
                            <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            {product.category === 'Matières Premières' ? <Package className="w-5 h-5" /> :
                                                product.category === 'Pâtisserie' ? <Coffee className="w-5 h-5" /> :
                                                product.category === 'Produits Finis' ? <Beef className="w-5 h-5" /> :
                                                    <Utensils className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{product.name}</p>
                                            <p className="text-[10px] text-white/30 font-mono">{product.barcode || 'NO-BARCODE'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold uppercase">{product.category}</span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${product.stock <= product.minStock ? 'bg-orange-500 animate-pulse' : 'bg-green-500'} shadow-lg`} />
                                        <span className="text-sm font-bold">{product.stock}</span>
                                        <span className="text-[10px] text-white/20">/ {product.minStock} min</span>
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-sm">{product.price.toLocaleString()} F</td>
                                 <td className="p-4 text-right">
                                    <button className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all">MODIFIER</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {!filteredProducts || filteredProducts.length === 0 && (
                    <div className="p-20 text-center opacity-20">
                        <Package className="w-12 h-12 mx-auto mb-4" />
                        <p>Aucun article trouvé</p>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

