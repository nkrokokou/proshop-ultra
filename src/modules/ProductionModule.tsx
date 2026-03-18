import React, { useState } from 'react';
import { 
  Zap, Plus, Search, Scale, 
  Clock, CheckCircle2, Package, TrendingUp,
  Beef, ChefHat
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { GlassCard } from '../components/PremiumUI';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductionModule: React.FC = () => {
    const [view, setView] = useState<'ORDERS' | 'RECIPES'>('ORDERS');
    const [searchTerm, setSearchTerm] = useState('');

    const specialOrders = useLiveQuery(() => db.specialOrders.toArray(), []);
    const ingredients = useLiveQuery(() => db.products.where('category').equals('Matières Premières').toArray(), []);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header with innovative toggle */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-primary tracking-tighter uppercase">PRODUCTION SAADEE</h2>
                    <p className="text-zinc-500 font-medium text-sm italic">Innovation & Recalibrage des fiches techniques.</p>
                </div>
                <div className="flex bg-zinc-100 p-1.5 rounded-2xl gap-1">
                    <button 
                        onClick={() => setView('ORDERS')}
                        className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${view === 'ORDERS' ? 'bg-white text-primary shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                        COMMANDES SPÉCIALES
                    </button>
                    <button 
                        onClick={() => setView('RECIPES')}
                        className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${view === 'RECIPES' ? 'bg-white text-primary shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                        RECALIBRAGE (FICHES)
                    </button>
                </div>
            </div>

            {view === 'RECIPES' ? (
                /* INNOVATION: Recipe Costing / Recalibration View */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <h3 className="text-lg font-black flex items-center gap-2 text-zinc-800">
                           <Scale className="w-5 h-5 text-accent" /> Matières Premières
                        </h3>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {ingredients?.map(ing => (
                                <GlassCard key={ing.id} className="p-4 hover:border-accent/40 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-sm text-zinc-800">{ing.name}</p>
                                            <p className="text-[10px] text-zinc-400 font-mono italic">{ing.price.toLocaleString()} F / {ing.features.unit}</p>
                                        </div>
                                        <TrendingUp className="w-4 h-4 text-green-500 opacity-20" />
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black flex items-center gap-2 text-zinc-800 uppercase tracking-tighter">
                                <ChefHat className="w-5 h-5 text-primary" /> Simulateur de Coût
                            </h3>
                            <button className="neo-button text-[10px] py-2 px-4">NOUVELLE FICHE</button>
                        </div>
                        <GlassCard className="p-12 border-dashed border-zinc-200 bg-zinc-50/30 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
                                <Zap className="w-10 h-10 text-zinc-200" />
                            </div>
                            <h4 className="text-xl font-black text-zinc-400 mb-2">Sélectionnez une pâtisserie</h4>
                            <p className="text-zinc-400 text-sm max-w-sm">Ajustez les doses en grammes pour recalculer automatiquement votre marge brute en temps réel.</p>
                        </GlassCard>
                    </div>
                </div>
            ) : (
                /* Special Orders View (Legacy "Repair" logic repurposed) */
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <GlassCard className="flex-1 p-2" hover={false}>
                            <div className="flex items-center gap-4 px-4">
                                <Search className="w-4 h-4 text-zinc-300" />
                                <input 
                                    type="text" 
                                    placeholder="Rechercher une commande (Client, Gâteau...)" 
                                    className="bg-transparent border-none focus:ring-0 text-sm flex-1 text-zinc-700"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Plus className="w-5 h-5 text-primary cursor-pointer hover:scale-110 transition-transform" />
                            </div>
                        </GlassCard>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {specialOrders?.map(order => (
                            <motion.div key={order.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <GlassCard className="p-0 overflow-hidden group">
                                    <div className="h-2 w-full bg-primary/20 bg-gradient-to-r from-primary/40 to-accent/40" />
                                    <div className="p-6 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-black text-zinc-800 text-lg">{order.description}</h4>
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1 italic">Prévu pour le {new Date(order.deadline).toLocaleDateString()}</p>
                                            </div>
                                            <div className="p-2 rounded-xl bg-primary/5 text-primary">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-end border-t border-zinc-100 pt-4">
                                            <div>
                                                <p className="text-[9px] font-black text-zinc-400 uppercase">Acompte versé</p>
                                                <p className="text-sm font-black text-green-600">{order.deposit.toLocaleString()} F</p>
                                            </div>
                                            <button className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
                                                GÉRER
                                            </button>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}

                        {(!specialOrders || specialOrders.length === 0) && (
                            <div className="col-span-full py-32 text-center opacity-10">
                                <ChefHat className="w-20 h-20 mx-auto mb-4" />
                                <p className="text-xl font-black uppercase">Prêt pour la fournée</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
