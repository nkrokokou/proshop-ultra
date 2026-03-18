import React, { useState } from "react";
import { 
  Settings, Bell, Shield, 
  Palette, Database, Globe,
  Save, RefreshCw
} from "lucide-react";
import { GlassCard } from "../components/PremiumUI";

export const ConfigurationModule: React.FC = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'Général', icon: Settings },
        { id: 'appearance', label: 'Apparence', icon: Palette },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Sécurité', icon: Shield },
        { id: 'data', label: 'Données', icon: Database }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-primary uppercase">Configuration Système</h2>
                    <p className="text-zinc-500 font-medium mt-1">Personnalisez votre expérience Saadé.</p>
                </div>
                <button className="neo-button flex items-center gap-2">
                    <Save className="w-4 h-4" /> Enregistrer les modifications
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-64 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-zinc-400 hover:bg-zinc-50'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1">
                    <GlassCard className="p-10 border-none shadow-2xl shadow-zinc-200/50">
                        {activeTab === 'general' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nom de l'Établissement</label>
                                        <input type="text" defaultValue="Saadé" className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-4 font-black text-xs text-zinc-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Devise</label>
                                        <input type="text" defaultValue="FCFA" className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-4 font-black text-xs text-zinc-800" />
                                    </div>
                                </div>

                                <div className="p-6 bg-zinc-50 border border-dashed border-zinc-200 rounded-3xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-zinc-300">
                                            <Globe className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-800 uppercase">Synchronisation Cloud</p>
                                            <p className="text-[9px] font-bold text-zinc-400">Dernière synchro: il y a 5 min</p>
                                        </div>
                                    </div>
                                    <button className="p-3 bg-white rounded-xl shadow-sm text-zinc-400 hover:text-primary transition-all">
                                        <RefreshCw className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab !== 'general' && (
                            <div className="h-64 flex flex-col items-center justify-center text-center opacity-20 space-y-4">
                                <Settings className="w-12 h-12" />
                                <p className="text-xs font-black uppercase tracking-widest">Contenu en cours de développement</p>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};
