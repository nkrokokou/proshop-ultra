import React, { useState, useEffect } from "react";
import type { Learner, Enrollment } from "../types";
import { db } from "../lib/db";
import { 
  Users, Plus, Search, 
  BookOpen, Calendar, CheckCircle2,
  Clock, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../components/PremiumUI";

export const TrainingManagementModule: React.FC = () => {
    const [learners, setLearners] = useState<Learner[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<'LEARNERS' | 'COURSES' | 'PAYMENTS'>('LEARNERS');
    const [showLearnerModal, setShowLearnerModal] = useState(false);
    const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [lData, eData] = await Promise.all([
            db.getLearners(),
            db.getEnrollments()
        ]);
        setLearners(lData);
        setEnrollments(eData);
    };

    const handleSaveLearner = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        
        const learner: Learner = {
            id: selectedLearner?.id || `LRN-${Date.now()}`,
            fullName: fd.get('fullName') as string,
            phone: fd.get('phone') as string,
            whatsapp: fd.get('whatsapp') as string,
            address: fd.get('address') as string,
            registrationDate: selectedLearner?.registrationDate || Date.now(),
            status: (fd.get('status') as any) || 'ACTIVE'
        };

        await db.saveLearner(learner);
        setShowLearnerModal(false);
        setSelectedLearner(null);
        loadData();
    };

    const filteredLearners = learners.filter(l => 
        l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-primary uppercase italic">Académie Saadé</h2>
                    <p className="text-zinc-500 font-medium mt-1">Formation professionnelle Saadé - Excellence culinaire.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex p-1 bg-zinc-100 rounded-2xl">
                        {(['LEARNERS', 'COURSES', 'PAYMENTS'] as const).map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)} 
                                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-zinc-400 uppercase'}`}
                            >
                                {tab === 'LEARNERS' ? 'Apprenants' : tab === 'COURSES' ? 'Formations' : 'Scolarité'}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={() => { setSelectedLearner(null); setShowLearnerModal(true); }}
                        className="neo-button flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Nouvel Apprenant
                    </button>
                </div>
            </div>

            {activeTab === 'LEARNERS' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <GlassCard className="p-6 bg-zinc-950 text-white border-none shadow-2xl">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Apprenants</p>
                            <h3 className="text-3xl font-black text-primary tracking-tighter">{learners.length}</h3>
                            <Users className="w-8 h-8 text-primary/40 mt-4" />
                        </GlassCard>
                        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <GlassCard className="p-6 border-none shadow-xl shadow-zinc-100 flex items-center justify-between">
                                 <div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">En Formation</p>
                                    <h3 className="text-2xl font-black text-zinc-800">{learners.filter(l => l.status === 'ACTIVE').length}</h3>
                                 </div>
                                 <Clock className="w-8 h-8 text-zinc-200" />
                            </GlassCard>
                            <GlassCard className="p-6 border-none bg-zinc-50/50 flex items-center justify-between">
                                 <div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Diplomés 2024</p>
                                    <h3 className="text-2xl font-black text-zinc-800">{learners.filter(l => l.status === 'GRADUATED').length}</h3>
                                 </div>
                                 <CheckCircle2 className="w-8 h-8 text-zinc-200" />
                            </GlassCard>
                            <GlassCard className="p-6 border-none bg-zinc-50/50 flex items-center justify-between">
                                 <div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Retards Paiement</p>
                                    <h3 className="text-2xl font-black text-red-500">
                                        {enrollments.filter(e => e.paidAmount < e.totalFee).length}
                                    </h3>
                                 </div>
                                 <AlertCircle className="w-8 h-8 text-red-100" />
                            </GlassCard>
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                            type="text" 
                            placeholder="Rechercher un apprenant par nom ou téléphone..."
                            className="w-full pl-16 pr-8 py-5 bg-white border-none rounded-[2rem] font-black text-xs text-zinc-800 shadow-xl shadow-zinc-200/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLearners.map(learner => (
                            <GlassCard 
                                key={learner.id} 
                                className="p-6 hover:border-primary transition-all cursor-pointer group"
                                onClick={() => { setSelectedLearner(learner); setShowLearnerModal(true); }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center font-black text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all text-xl">
                                            {learner.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-zinc-800 uppercase tracking-tighter">{learner.fullName}</h4>
                                            <p className="text-[9px] font-black text-zinc-400 uppercase">{learner.phone}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${learner.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-zinc-100 text-zinc-400'}`}>
                                        {learner.status}
                                    </span>
                                </div>
                                <div className="space-y-3 pt-4 border-t border-zinc-50">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase">
                                        <BookOpen className="w-3 h-3" /> 
                                        {enrollments.find(e => e.learnerId === learner.id) ? 'Pâtisserie Pro' : 'Non inscrit'}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase italic">
                                        <Calendar className="w-3 h-3" /> Inscrit le {new Date(learner.registrationDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                     <button className="flex-1 py-3 bg-zinc-100 text-zinc-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                                        Détails
                                     </button>
                                     <button className="flex-1 py-3 bg-zinc-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-[1.05] transition-all">
                                        Paiement
                                     </button>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </>
            )}

            {/* Modal Learner */}
            <AnimatePresence>
                {showLearnerModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLearnerModal(false)} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
                            <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter text-primary">Dossier Apprenant</h3>
                            <form onSubmit={handleSaveLearner} className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1 ml-2">Nom Complet</label>
                                    <input name="fullName" defaultValue={selectedLearner?.fullName} required className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1 ml-2">Téléphone</label>
                                    <input name="phone" defaultValue={selectedLearner?.phone} required className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1 ml-2">WhatsApp</label>
                                    <input name="whatsapp" defaultValue={selectedLearner?.whatsapp} className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs" />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1 ml-2">Adresse Résidence</label>
                                    <input name="address" defaultValue={selectedLearner?.address} className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1 ml-2">Statut</label>
                                    <select name="status" defaultValue={selectedLearner?.status} className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs">
                                        <option value="ACTIVE">En Formation</option>
                                        <option value="INACTIVE">Session Suspendue</option>
                                        <option value="GRADUATED">Diplomé</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/30 mt-4">
                                        Enregistrer le Dossier
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
