import React, { useState } from 'react';
import {
    Wrench, Plus, Search,
    Clock, CheckCircle2, Truck, AlertCircle,
    User, Hash
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { GlassCard } from '../components/PremiumUI';
import { motion, AnimatePresence } from 'framer-motion';
import type { Repair } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const RepairModule: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showNewModal, setShowNewModal] = useState(false);

    // Live Queries
    const repairs = useLiveQuery(() => db.repairs.toArray(), []);
    const clients = useLiveQuery(() => db.clients.toArray(), []);

    const filteredRepairs = repairs?.filter(r => {
        const matchesSearch = r.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.imei?.includes(searchTerm);
        const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    }).sort((a, b) => b.createdAt - a.createdAt);

    const getStatusIcon = (status: Repair['status']) => {
        switch (status) {
            case 'PENDING': return <Clock className="w-4 h-4 text-orange-400" />;
            case 'IN_PROGRESS': return <Wrench className="w-4 h-4 text-primary animate-pulse" />;
            case 'COMPLETED': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
            case 'DELIVERED': return <Truck className="w-4 h-4 text-blue-400" />;
        }
    };

    const getStatusLabel = (status: Repair['status']) => {
        switch (status) {
            case 'PENDING': return 'En Attente';
            case 'IN_PROGRESS': return 'En Cours';
            case 'COMPLETED': return 'Prêt';
            case 'DELIVERED': return 'Livré';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Atelier de Réparation</h2>
                    <p className="text-white/40">Suivez et gérez les interventions techniques en temps réel.</p>
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
                            placeholder="Rechercher par appareil, IMEI ou client..."
                            className="bg-transparent border-none focus:ring-0 text-sm flex-1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="h-6 w-px bg-white/10 mx-2" />
                        <div className="flex gap-1">
                            {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setStatusFilter(f)}
                                    className={`px - 3 py - 1.5 rounded - lg text - [10px] font - bold transition - all ${statusFilter === f ? 'bg-primary text-white' : 'hover:bg-white/5 text-white/40'} `}
                                >
                                    {f === 'ALL' ? 'TOUT' : getStatusLabel(f as Repair['status']).toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Repair List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredRepairs?.map((repair) => {
                        const client = clients?.find(c => c.id === repair.clientId);
                        return (
                            <motion.div
                                key={repair.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <GlassCard className="p-0 overflow-hidden group">
                                    <div className={`h - 1.5 w - full ${repair.status === 'PENDING' ? 'bg-orange-500' :
                                            repair.status === 'IN_PROGRESS' ? 'bg-primary' :
                                                repair.status === 'COMPLETED' ? 'bg-green-500' : 'bg-blue-500'
                                        } `} />

                                    <div className="p-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold flex items-center gap-2">
                                                    {repair.deviceName}
                                                    <span className="text-[10px] font-mono text-white/20">#{repair.id.slice(0, 8)}</span>
                                                </h3>
                                                <p className="text-xs text-white/40 flex items-center gap-1 mt-1">
                                                    <User className="w-3 h-3" /> {client?.name || 'Client Inconnu'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
                                                {getStatusIcon(repair.status)}
                                                <span className="text-[10px] font-bold">{getStatusLabel(repair.status)}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2 text-xs">
                                                <AlertCircle className="w-3 h-3 text-red-400 mt-0.5" />
                                                <p className="text-white/60 italic line-clamp-2">{repair.problem}</p>
                                            </div>
                                            {repair.imei && (
                                                <div className="flex items-center gap-2 text-[10px] text-white/30 font-mono">
                                                    <Hash className="w-3 h-3" /> IMEI: {repair.imei}
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                            <div className="text-xs">
                                                <p className="text-white/20 uppercase font-bold text-[10px]">Total Estimé</p>
                                                <p className="text-primary font-bold">{repair.price.toLocaleString()} F</p>
                                            </div>
                                            <div className="text-xs text-right">
                                                <p className="text-white/20 uppercase font-bold text-[10px]">Acompte</p>
                                                <p className="text-green-400 font-bold">{repair.deposit.toLocaleString()} F</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 pt-2">
                                            <button className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold transition-all">
                                                DÉTAILS
                                            </button>
                                            <button
                                                className="flex-1 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-[10px] font-bold transition-all"
                                                onClick={async () => {
                                                    const nextStatus =
                                                        repair.status === 'PENDING' ? 'IN_PROGRESS' :
                                                            repair.status === 'IN_PROGRESS' ? 'COMPLETED' :
                                                                repair.status === 'COMPLETED' ? 'DELIVERED' : 'DELIVERED';
                                                    await db.repairs.update(repair.id, { status: nextStatus });
                                                }}
                                            >
                                                {repair.status === 'PENDING' ? 'DÉMARRER' :
                                                    repair.status === 'IN_PROGRESS' ? 'TERMINER' :
                                                        repair.status === 'COMPLETED' ? 'LIVRER' : 'LIVRÉ'}
                                            </button>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {(!filteredRepairs || filteredRepairs.length === 0) && (
                    <div className="col-span-full py-20 text-center opacity-20">
                        <Wrench className="w-12 h-12 mx-auto mb-4" />
                        <p>Aucun ticket de réparation trouvé.</p>
                    </div>
                )}
            </div>

            {/* Modal de création (Simplifié pour le moment) */}
            {showNewModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <GlassCard className="w-full max-w-lg p-6 space-y-6" hover={false}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Plus className="w-5 h-5 text-primary" /> Nouveau Ticket
                            </h3>
                            <button onClick={() => setShowNewModal(false)} className="text-white/40 hover:text-white transition-colors">
                                <AlertCircle className="w-5 h-5 rotate-45" />
                            </button>
                        </div>

                        <form className="space-y-4" onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const formData = new FormData(form);

                            const newRepair: Repair = {
                                id: uuidv4(),
                                clientId: 'c1', // Mocking client for now
                                deviceName: formData.get('device') as string,
                                imei: formData.get('imei') as string,
                                problem: formData.get('problem') as string,
                                status: 'PENDING',
                                cost: 0,
                                price: Number(formData.get('price')),
                                deposit: Number(formData.get('deposit')),
                                spareParts: [],
                                unlockCode: formData.get('unlock') as string,
                                createdAt: Date.now(),
                            };

                            await db.repairs.add(newRepair);
                            setShowNewModal(false);
                        }}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-white/40 uppercase">Appareil</label>
                                    <input name="device" required className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:border-primary outline-none" placeholder="ex: iPhone 13 Pro" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-white/40 uppercase">IMEI / SN</label>
                                    <input name="imei" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:border-primary outline-none" placeholder="Facultatif" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-white/40 uppercase">Problème constaté</label>
                                <textarea name="problem" required className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:border-primary outline-none min-h-[80px]" placeholder="Description de la panne..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-white/40 uppercase">Code / Schéma</label>
                                    <input name="unlock" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:border-primary outline-none" placeholder="Code dév." />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-white/40 uppercase">Date Estimée</label>
                                    <input type="date" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:border-primary outline-none text-white/40" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-white/40 uppercase">Total (F)</label>
                                    <input name="price" type="number" required className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:border-primary outline-none font-bold text-primary" placeholder="0" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-white/40 uppercase">Acompte (F)</label>
                                    <input name="deposit" type="number" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:border-primary outline-none font-bold text-green-400" placeholder="0" />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-3 neo-button font-bold text-sm flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> ENREGISTRER LE TICKET
                            </button>
                        </form>
                    </GlassCard>
                </div>
            )}
        </div>
    );
};
