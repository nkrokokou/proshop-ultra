import React, { useState } from 'react';
import {
    Plus, Filter,
    Scan, Coffee, Utensils, Package, Beef,
    TrendingUp, TrendingDown, History, BarChart3,
    ArrowUpCircle, ArrowDownCircle, Save, X
} from 'lucide-react';
import { GlassCard, StatCard } from '../components/PremiumUI';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import type { StockMovement, Product } from '../types';

export const InventoryModule: React.FC = () => {
    const [filter, setFilter] = useState('ALL');
    const [activeView, setActiveView] = useState<'STOCK' | 'JOURNAL'>('STOCK');
    const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN');
    const [movementQty, setMovementQty] = useState(1);
    const [movementReason, setMovementReason] = useState('');

    const products = useLiveQuery(() => db.products.toArray(), []);
    const movements = useLiveQuery(() => db.stockMovements.orderBy('date').reverse().toArray(), []);

    const filteredProducts = products?.filter(p => {
        if (filter === 'ALL') return true;
        if (filter === 'MATIERES') return p.category === 'Matières Premières';
        if (filter === 'PATISSERIE') return p.category === 'Pâtisserie';
        if (filter === 'RESTAURATION') return p.category === 'Restaurant';
        if (filter === 'BOISSONS') return p.category === 'Boissons';
        return true;
    });

    const totalInvestment = products?.reduce((acc, p) => acc + (p.costPrice * p.stock), 0) || 0;
    const potentialRevenue = products?.reduce((acc, p) => acc + (p.price * p.stock), 0) || 0;

    const handleMovement = async () => {
        if (!selectedProduct) return;
        
        const change = movementType === 'IN' ? movementQty : -movementQty;
        const newStock = Math.max(0, selectedProduct.stock + change);

        const movement: StockMovement = {
            id: uuidv4(),
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            type: movementType,
            quantity: movementQty,
            reason: movementReason || (movementType === 'IN' ? 'Réapprovisionnement' : 'Sortie de stock'),
            date: Date.now(),
            agentName: 'Admin',
            previousStock: selectedProduct.stock,
            newStock: newStock
        };

        await db.stockMovements.add(movement);
        await db.products.update(selectedProduct.id, { stock: newStock, updatedAt: Date.now() });
        
        setIsMovementModalOpen(false);
        setSelectedProduct(null);
        setMovementReason('');
        setMovementQty(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-primary">Inventaire Saadé</h2>
                    <p className="text-zinc-500 font-medium text-sm">Gestion industrielle des stocks et flux.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setActiveView(activeView === 'STOCK' ? 'JOURNAL' : 'STOCK')}
                        className="neo-button flex items-center gap-2 bg-white/50"
                    >
                        {activeView === 'STOCK' ? <History className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                        {activeView === 'STOCK' ? 'Journal des Flux' : 'Vue Stock'}
                    </button>
                    <button className="neo-button flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Nouvel Article
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    label="Investissement Réel" 
                    value={`${totalInvestment.toLocaleString()} F`} 
                    icon={TrendingDown} 
                    trend={{ value: 12, isUp: false }}
                    color="primary"
                />
                <StatCard 
                    label="Chiffre d'Affaires Potentiel" 
                    value={`${potentialRevenue.toLocaleString()} F`} 
                    icon={TrendingUp} 
                    trend={{ value: 8, isUp: true }}
                    color="accent"
                />
                <StatCard 
                    label="Articles en Alerte" 
                    value={products?.filter(p => p.stock <= p.minStock).length.toString() || '0'} 
                    icon={BarChart3} 
                    color="zinc"
                />
            </div>

            {activeView === 'STOCK' ? (
                <>
                <div className="flex gap-4">
                    <GlassCard className="flex-1 p-2" hover={false}>
                        <div className="flex items-center gap-2 px-2">
                            <Filter className="w-4 h-4 text-zinc-300" />
                            <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                                {['ALL', 'MATIERES', 'PATISSERIE', 'RESTAURATION', 'BOISSONS'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${filter === f ? 'bg-primary text-white' : 'hover:bg-zinc-100 text-zinc-400'}`}
                                    >
                                        {f === 'ALL' ? 'TOUT' :
                                         f === 'MATIERES' ? 'MATIÈRES PREMIÈRES' :
                                         f === 'RESTAURATION' ? 'RESTAURANT' : f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="w-64 p-2" hover={false}>
                        <div className="relative">
                            <Scan className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                            <input type="text" placeholder="Rechercher article..." className="bg-transparent border-none focus:ring-0 text-sm pl-10 w-full text-zinc-700 placeholder:text-zinc-300" />
                        </div>
                    </GlassCard>
                </div>

                <GlassCard className="p-0 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                <th className="p-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Article</th>
                                <th className="p-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Catégorie</th>
                                <th className="p-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Stock</th>
                                <th className="p-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Prix Vente</th>
                                <th className="p-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredProducts?.map(product => (
                                <tr key={product.id} className="hover:bg-zinc-50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                {product.category === 'Matières Premières' ? <Package className="w-5 h-5" /> :
                                                    product.category === 'Pâtisserie' ? <Coffee className="w-5 h-5" /> :
                                                    product.category === 'Restaurant' ? <Beef className="w-5 h-5" /> :
                                                        <Utensils className="w-5 h-5" />}
                                            </div>
                                             <div>
                                                <p className="font-bold text-sm text-zinc-800">{product.name}</p>
                                                <p className="text-[10px] text-zinc-400 font-mono font-bold">{product.barcode || 'ARTICLE-SAADÉ'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-[10px] font-black uppercase text-zinc-500">{product.category}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${product.stock <= product.minStock ? 'bg-orange-500 animate-pulse' : 'bg-green-500'} shadow-lg`} />
                                            <span className="text-sm font-bold text-zinc-800">{product.stock}</span>
                                            <span className="text-[10px] text-zinc-400 font-bold ml-1">/ {product.minStock} min</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-black text-sm text-primary">{product.price.toLocaleString()} F</td>
                                     <td className="p-4 text-right flex gap-2 justify-end">
                                        <button 
                                            onClick={() => { setSelectedProduct(product); setMovementType('IN'); setIsMovementModalOpen(true); }}
                                            className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all"
                                            title="Entrée de stock"
                                        >
                                            <ArrowUpCircle className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => { setSelectedProduct(product); setMovementType('OUT'); setIsMovementModalOpen(true); }}
                                            className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all"
                                            title="Sortie de stock"
                                        >
                                            <ArrowDownCircle className="w-4 h-4" />
                                        </button>
                                        <button className="text-[10px] font-black text-primary bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all">DÉTAILS</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {(!filteredProducts || filteredProducts.length === 0) && (
                        <div className="p-20 text-center opacity-30">
                            <Package className="w-12 h-12 mx-auto mb-4 text-zinc-400" />
                            <p className="text-sm font-bold text-zinc-400">Aucun article trouvé</p>
                        </div>
                    )}
                </GlassCard>
                </>
            ) : (
                <GlassCard className="p-0 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                <th className="p-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Date</th>
                                <th className="p-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Article</th>
                                <th className="p-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Flux</th>
                                <th className="p-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Raison</th>
                                <th className="p-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Stock Final</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {movements?.map(mv => (
                                <tr key={mv.id} className="hover:bg-zinc-50 transition-colors">
                                    <td className="p-4 text-xs font-medium text-zinc-500">
                                        {new Date(mv.date).toLocaleString()}
                                    </td>
                                    <td className="p-4 font-bold text-sm text-zinc-800">{mv.productName}</td>
                                    <td className="p-4">
                                        <div className={`flex items-center gap-1 font-black text-xs ${mv.type === 'IN' ? 'text-green-500' : 'text-orange-500'}`}>
                                            {mv.type === 'IN' ? <ArrowUpCircle className="w-3 h-3" /> : <ArrowDownCircle className="w-3 h-3" />}
                                            {mv.type === 'IN' ? '+' : '-'}{mv.quantity}
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs italic text-zinc-400">{mv.reason}</td>
                                    <td className="p-4 font-mono text-xs font-bold">{mv.newStock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </GlassCard>
            )}

            {/* Movement Modal */}
            <AnimatePresence>
                {isMovementModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 border border-zinc-100"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black text-primary">
                                    {movementType === 'IN' ? 'Entrée de Stock' : 'Sortie de Stock'}
                                </h3>
                                <button onClick={() => setIsMovementModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <p className="text-sm text-zinc-500 mb-6">
                                Produit : <span className="font-bold text-zinc-800">{selectedProduct?.name}</span>
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Quantité</label>
                                    <input 
                                        type="number" 
                                        value={movementQty}
                                        onChange={(e) => setMovementQty(parseInt(e.target.value) || 0)}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 ring-primary/5 text-lg font-black text-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Raison / Commentaire</label>
                                    <input 
                                        type="text" 
                                        value={movementReason}
                                        onChange={(e) => setMovementReason(e.target.value)}
                                        placeholder={movementType === 'IN' ? 'Réapprovisionnement fournisseur...' : 'Casse, perte, erreur...'}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 ring-primary/5 text-sm"
                                    />
                                </div>

                                <button 
                                    onClick={handleMovement}
                                    className="w-full bg-primary text-white py-4 rounded-xl font-black shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 mt-4"
                                >
                                    <Save className="w-5 h-5" /> ENREGISTRER LE MOUVEMENT
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
