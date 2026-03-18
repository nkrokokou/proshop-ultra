import React, { useState, useEffect } from "react";
import type { SpecialOrder, Client } from "../types";
import { db } from "../lib/db";
import { 
  Plus, Printer, 
  Utensils as CateringIcon, Search,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../components/PremiumUI";

export const SpecialOrdersModule: React.FC = () => {
    const [orders, setOrders] = useState<SpecialOrder[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<SpecialOrder | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [oData, cData] = await Promise.all([
            db.getSpecialOrders(),
            db.getClients()
        ]);
        setOrders(oData);
        setClients(cData);
    };

    const handleSaveOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const clientId = fd.get('clientId') as string;
        const client = clients.find(c => c.id === clientId);

        const order: SpecialOrder = {
            id: selectedOrder?.id || `ORD-${Date.now()}`,
            clientId,
            clientName: client?.name || 'Inconnu',
            clientPhone: client?.phone || '',
            orderType: fd.get('orderType') as any,
            description: fd.get('description') as string,
            status: (fd.get('status') as any) || 'PENDING',
            totalPrice: Number(fd.get('totalPrice')),
            deposit: Number(fd.get('deposit')),
            payments: selectedOrder?.payments || [],
            createdAt: selectedOrder?.createdAt || Date.now(),
            deadline: new Date(fd.get('deadline') as string).getTime()
        };

        await db.saveSpecialOrder(order);
        setShowOrderModal(false);
        setSelectedOrder(null);
        loadData();
    };

    const handleUpdateStatus = async (orderId: string, newStatus: SpecialOrder['status']) => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            await db.saveSpecialOrder({ ...order, status: newStatus });
            loadData();
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             o.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "ALL" || o.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'PENDING': return 'bg-orange-100 text-orange-600';
            case 'PREPARING': return 'bg-blue-100 text-blue-600';
            case 'READY': return 'bg-green-100 text-green-600';
            case 'DELIVERED': return 'bg-zinc-100 text-zinc-400';
            default: return 'bg-zinc-100 text-zinc-400';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-primary uppercase italic">Saadé Special</h2>
                    <p className="text-zinc-500 font-medium mt-1">Commandes sur mesure, Catering & Événementiel.</p>
                </div>
                <div className="flex gap-4">
                     <div className="flex p-1 bg-zinc-100 rounded-2xl">
                        {['ALL', 'PENDING', 'PREPARING', 'READY', 'DELIVERED'].map(status => (
                            <button 
                                key={status} 
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${filterStatus === status ? 'bg-white text-primary shadow-sm' : 'text-zinc-400 uppercase'}`}
                            >
                                {status === 'ALL' ? 'Tout' : status}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => { setSelectedOrder(null); setShowOrderModal(true); }} className="neo-button flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Nouvelle Commande
                    </button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                    type="text" 
                    placeholder="Chercher par client, type de gâteau, description..."
                    className="w-full pl-16 pr-8 py-5 bg-white border-none rounded-[2rem] font-black text-xs text-zinc-800 shadow-xl shadow-zinc-200/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredOrders.map(order => (
                    <GlassCard 
                        key={order.id} 
                        className={`p-8 group hover:border-primary transition-all duration-500 relative overflow-hidden flex flex-col ${order.status === 'READY' ? 'border-green-200' : ''}`}
                    >
                         <div className="flex justify-between items-start mb-6">
                            <div className={`w-14 h-14 rounded-2xl ${order.status === 'PREPARING' ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-primary/10 text-primary'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <CateringIcon className="w-7 h-7" />
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                                <p className="text-[10px] font-black text-zinc-400 mt-2 uppercase tracking-tighter italic">
                                    {new Date(order.deadline).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <h4 className="text-sm font-black text-zinc-800 uppercase tracking-tighter">{order.clientName}</h4>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">{order.orderType}</p>
                            </div>

                            <div className="p-4 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
                                <p className="text-[10px] font-black text-zinc-600 uppercase italic leading-relaxed">
                                    {order.description}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-[9px] font-black uppercase">
                                    <span className="text-zinc-400">Avance / Reste</span>
                                    <span className="text-zinc-800">{order.deposit.toLocaleString()} / {(order.totalPrice - order.deposit).toLocaleString()} F</span>
                                </div>
                                <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary transition-all duration-1000"
                                        style={{ width: `${(order.deposit / order.totalPrice) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-zinc-50 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Total Net</span>
                                <span className="text-xl font-black text-primary tracking-tighter">{order.totalPrice.toLocaleString()} F</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-zinc-100 text-zinc-400 rounded-xl hover:bg-zinc-950 hover:text-white transition-all">
                                    <Printer className="w-4 h-4" />
                                </button>
                                {order.status === 'PENDING' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                                        className="p-3 bg-zinc-950 text-white rounded-xl hover:scale-110 transition-transform"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                                {order.status === 'PREPARING' && (
                                    <button 
                                        onClick={() => handleUpdateStatus(order.id, 'READY')}
                                        className="p-3 bg-green-500 text-white rounded-xl hover:scale-110 transition-transform"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showOrderModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowOrderModal(false)} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl">
                            <h3 className="text-2xl font-black mb-10 uppercase tracking-tighter text-primary">Nouvelle Commande Spéciale</h3>
                            <form onSubmit={handleSaveOrder} className="grid grid-cols-2 gap-8">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2 ml-2">Sélectionner Client</label>
                                    <select name="clientId" required className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs">
                                        {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2 ml-2">Type de Commande</label>
                                    <select name="orderType" className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs">
                                        <option value="CAKE">Gâteau d'Anniversaire</option>
                                        <option value="EVENT">Événement / Catering</option>
                                        <option value="SPECIAL">Commande Spéciale</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2 ml-2">Date Échéance</label>
                                    <input type="date" name="deadline" required className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs" />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2 ml-2">Détails & Spécifications</label>
                                    <textarea name="description" rows={3} required className="w-full p-6 bg-zinc-50 border-none rounded-2xl font-bold text-xs" placeholder="Ex: Inscription, Parfums, Nombre de personnes..." />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2 ml-2">Total Devis (F)</label>
                                    <input type="number" name="totalPrice" required className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-black text-xl text-primary" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2 ml-2">Acompte Versé (F)</label>
                                    <input type="number" name="deposit" required className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs" />
                                </div>
                                <div className="col-span-2">
                                    <button type="submit" className="w-full py-6 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 mt-4">
                                        Valider la Commande
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
