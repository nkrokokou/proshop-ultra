import React, { useState } from 'react';
import { 
  Settings, Database, Download, Upload, 
  Trash2, Save, CheckCircle2, RefreshCw,
  Layout, Shield
} from 'lucide-react';
import { GlassCard } from '../components/PremiumUI';
import { db } from '../lib/db';

export const ConfigurationModule: React.FC = () => {
    const [isSaving, setIsSaving] = useState(false);

    const handleExport = async () => {
        const data: any = {};
        data.products = await db.products.toArray();
        data.sales = await db.sales.toArray();
        data.clients = await db.clients.toArray();
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-saadee-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (data.products) await db.products.bulkPut(data.products);
                if (data.sales) await db.sales.bulkPut(data.sales);
                if (data.clients) await db.clients.bulkPut(data.clients);
                alert('Données restaurées avec succès !');
                window.location.reload();
            } catch (err) {
                alert('Erreur lors de la restauration : ' + err);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Configuration</h2>
                <p className="text-white/40 mt-1">Gérez les paramètres globaux et la sécurité de vos données.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Settings */}
                <GlassCard className="p-6 space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Settings className="w-5 h-5 text-primary" /> Paramètres Généraux
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-white/40 uppercase">Nom de l'Etablissement</label>
                            <input type="text" defaultValue="VILLA NO BAD DAYS" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-primary outline-none" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-white/40 uppercase">Adresse / Contact</label>
                            <textarea defaultValue="Lomé, Togo - Quartier Forever" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-primary outline-none min-h-[80px]" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-white/40 uppercase">Devise locale</label>
                            <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-primary outline-none">
                                <option value="FCFA">FCFA</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                    </div>
                    <button 
                        onClick={() => { setIsSaving(true); setTimeout(() => setIsSaving(false), 2000); }}
                        className="w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                        {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        {isSaving ? 'ENREGISTREMENT...' : 'SAUVEGARDER'}
                    </button>
                </GlassCard>

                {/* Database & Backup */}
                <GlassCard className="p-6 space-y-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Database className="w-5 h-5 text-accent" /> Données & Sauvegardes
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-sm">Sauvegarde Locale</h4>
                                <p className="text-[10px] text-white/40">Téléchargez vos données au format JSON.</p>
                            </div>
                            <button onClick={handleExport} className="p-3 rounded-xl bg-accent/20 text-accent hover:bg-accent hover:text-white transition-all">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-sm">Restaurer des Données</h4>
                                <p className="text-[10px] text-white/40">Importez un fichier de sauvegarde précédent.</p>
                            </div>
                            <label className="p-3 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer">
                                <Upload className="w-5 h-5" />
                                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                            </label>
                        </div>

                        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-sm text-red-500">Remise à Zéro</h4>
                                <p className="text-[10px] text-red-500/40">Effacer toutes les données locales.</p>
                            </div>
                            <button onClick={async () => {
                                if(confirm('Êtes-vous sûr de vouloir tout effacer ? Cette action est irréversible.')) {
                                    await db.delete();
                                    window.location.reload();
                                }
                            }} className="p-3 rounded-xl bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </GlassCard>

                {/* Modules Activation */}
                <GlassCard className="p-6 space-y-6 md:col-span-2">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Layout className="w-5 h-5 text-green-400" /> Gestion des Modules
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { id: 'POS', name: 'Caisse Restaurant', active: true },
                            { id: 'CEO', name: 'Espace CEO', active: true },
                            { id: 'STOCK', name: 'Gestion Stocks', active: true },
                            { id: 'RECALIBRAGE', name: 'Recalibrage / Recettes', active: true }
                        ].map(mod => (
                            <div key={mod.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{mod.id}</span>
                                    {mod.active && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                                </div>
                                <span className="text-xs font-bold">{mod.name}</span>
                                <div className={`h-1.5 w-full rounded-full ${mod.active ? 'bg-green-400' : 'bg-white/10'}`} />
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
