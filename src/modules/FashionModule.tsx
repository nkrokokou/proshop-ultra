import React, { useState } from 'react';
import {
    Shirt, Plus, Search,
    Scissors, Ruler, CheckCircle2, Truck,
    User, Calendar, Clock
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { GlassCard } from '../components/PremiumUI';
import { motion, AnimatePresence } from 'framer-motion';
import type { FashionOrder } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const FashionModule: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showNewModal, setShowNewModal] = useState(false);

    // Live Queries
    const orders = useLiveQuery(() => db.fashionOrders.toArray(), []);
    const clients = useLiveQuery(() => db.clients.toArray(), []);

    const filteredOrders = orders?.filter(o => {
        const matchesSearch = o.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    }).sort((a, b) => b.createdAt - a.createdAt);

    const getStatusIcon = (status: FashionOrder['status']) => {
        switch (status) {
            case 'PENDING': return <Clock className="w-4 h-4 text-orange-400" />;
            case 'CUTTING': return <Scissors className="w-4 h-4 text-primary" />;
            case 'SEWING': return <Ruler className="w-4 h-4 text-accent animate-pulse" />;
            case 'READY': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
            case 'DELIVERED': return <Truck className="w-4 h-4 text-blue-400" />;
        }
    };

    const getStatusLabel = (status: FashionOrder['status']) => {
        switch (status) {
            case 'PENDING': return 'En Attente';
            case 'CUTTING': return 'Coupe';
            case 'SEWING': return 'Couture';
            case 'READY': return 'Prêt';
            case 'DELIVERED': return 'Livré';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Atelier de Mode</h2>
                    <p className="text-white/40">Gérez vos retouches et confections sur mesure.</p>
                </div>
                <button
                    onClick={() => setShowNewModal(true)}
                    className="neo-button flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Nouveau Ticket
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <GlassCard className="flex-1 p-2" hover={false}>
                    <div className="flex items-center gap-4 px-2">
                        <Search className="w-4 h-4 text-white/20" />
                        <input
                            type="text"
                            placeholder="Rechercher une commande..."
                            className="bg-transparent border-none focus:ring-0 text-sm flex-1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="h-6 w-px bg-white/10 mx-2" />
                        <div className="flex gap-1 overflow-x-auto custom-scrollbar whitespace-nowrap">
                            {['ALL', 'PENDING', 'CUTTING', 'SEWING', 'READY', 'DELIVERED'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setStatusFilter(f)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${statusFilter === f ? 'bg-primary text-white' : 'hover:bg-white/5 text-white/40'}`}
                                >
                                    {f === 'ALL' ? 'TOUT' : getStatusLabel(f as FashionOrder['status']).toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Orders List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredOrders?.map((order) => {
                        const client = clients?.find(c => c.id === order.clientId);
                        return (
                            <motion.div
                                key={order.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <GlassCard className="p-0 overflow-hidden group">
                                    <div className={`h-1.5 w-full ${order.status === 'PENDING' ? 'bg-orange-500' :
                                            order.status === 'CUTTING' ? 'bg-primary' :
                                                order.status === 'SEWING' ? 'bg-accent' :
                                                    order.status === 'READY' ? 'bg-green-500' : 'bg-blue-500'
                                        }`} />

                                    <div className="p-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${order.type === 'CONFECTION' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
                                                        {order.type}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold flex items-center gap-2">
                                                    {order.description}
                                                    <span className="text-[10px] font-mono text-white/20">#{order.id.slice(0, 8)}</span>
                                                </h3>
                                                <p className="text-xs text-white/40 flex items-center gap-1 mt-1">
                                                    <User className="w-3 h-3" /> {client?.name || 'Client Inconnu'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
                                                {getStatusIcon(order.status)}
                                                <span className="text-[10px] font-bold">{getStatusLabel(order.status)}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                            <div className="text-xs">
                                                <p className="text-white/20 uppercase font-bold text-[10px]">Prix Total</p>
                                                <p className="text-primary font-bold">{order.price.toLocaleString()} F</p>
                                            </div>
                                            <div className="text-xs text-right">
                                                <p className="text-white/20 uppercase font-bold text-[10px]">Date Prévue</p>
                                                <p className="text-white font-bold flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {order.deadline ? new Date(order.deadline).toLocaleDateString() : '-'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 pt-2">
                                            <button className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold transition-all">
                                                DÉTAILS
                                            </button>
                                            <button
                                                className="flex-1 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-[10px] font-bold transition-all"
                                                onClick={async () => {
                                                    const statusOrder: FashionOrder['status'][] = ['PENDING', 'CUTTING', 'SEWING', 'READY', 'DELIVERED'];
                                                    const currentIndex = statusOrder.indexOf(order.status);
                                                    const nextStatus = statusOrder[Math.min(currentIndex + 1, statusOrder.length - 1)];
                                                    await db.fashionOrders.update(order.id, { status: nextStatus });
                                                }}
                                            >
                                                SUIVANT
                                            </button>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {(!filteredOrders || filteredOrders.length === 0) && (
                    <div className="col-span-full py-20 text-center opacity-20">
                        <Shirt className="w-12 h-12 mx-auto mb-4" />
                        <p>Aucune commande de mode trouvée.</p>
                    </div>
                )}
            </div>

            {/* Modal simplified */}
            {showNewModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <GlassCard className="w-full max-w-lg p-6 space-y-6" hover={false}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Plus className="w-5 h-5 text-primary" /> Nouveau Ticket Mode
                            </h3>
                            <button onClick={() => setShowNewModal(false)} className="text-white/40 hover:text-white transition-colors text-xl">×</button>
                        </div>

                        <form className="space-y-4" onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const formData = new FormData(form);

                            const newOrder: FashionOrder = {
                                id: uuidv4(),
                                clientId: 'c1', // Mocking client for now
                                type: formData.get('type') as any,
                                description: formData.get('description') as string,
                                status: 'PENDING',
                                price: Number(formData.get('price')),
                                deposit: Number(formData.get('deposit')),
                                createdAt: Date.now(),
                                deadline: formData.get('deadline') ? new Date(formData.get('deadline') as string).getTime() : undefined,
                            };

                            await db.fashionOrders.add(newOrder);
                            setShowNewModal(false);
                        }}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-white/40 uppercase">Type</label>
                                    <select name="type" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:border-primary outline-none">
                                        <option value="RETOUCHE">Retouche</option>
                                        <option value="CONFECTION">Confection</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-white/40 uppercase">Date Prévue</label>
                                    <input name="deadline" type="date" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:border-primary outline-none" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-white/40 uppercase">Description</label>
                                <textarea name="description" required className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:border-primary outline-none min-h-[80px]" placeholder="Ex: Robe de soirée, Ajustement pantalon..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-white/40 uppercase">Prix (F)</label>
                                    <input name="price" type="number" required className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:border-primary outline-none font-bold text-primary" placeholder="0" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-white/40 uppercase">Acompte (F)</label>
                                    <input name="deposit" type="number" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:border-primary outline-none font-bold text-green-400" placeholder="0" />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-3 neo-button font-bold text-sm flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> ENREGISTRER LA COMMANDE
                            </button>
                        </form>
                    </GlassCard>
                </div>
            )}
        </div>
    );
};
