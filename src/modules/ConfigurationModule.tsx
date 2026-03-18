import React, { useState } from 'react';
import { 
  Settings, Database, Download, Upload, 
  Trash2, Save, CheckCircle2, RefreshCw,
  Layout
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

    const handleReset = async () => {
        if(confirm('Êtes-vous sûr de vouloir tout effacer ? Cette action est irréversible.')) {
            await db.delete();
            window.location.reload();
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-primary">Configuration</h2>
                    <p className="text-zinc-500 font-medium text-sm">Paramètres et gestion de la base de données SAADEE.</p>
                </div>
                <button 
                    onClick={() => { setIsSaving(true); setTimeout(() => setIsSaving(false), 2000); }}
                    className="neo-button flex items-center gap-2"
                >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'ENREGISTREMENT...' : 'SAUVEGARDER'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Settings */}
                <div className="space-y-4">
                    <h3 className="text-lg font-black flex items-center gap-2 text-zinc-800">
                        <Layout className="w-5 h-5 text-primary" /> Paramètres Généraux
                    </h3>
                    <GlassCard className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nom de l'établissement</label>
                            <input 
                                type="text" 
                                defaultValue="SAADEE (Villa No Bad Days)"
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-sm font-bold text-zinc-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Adresse / Contact</label>
                            <textarea 
                                defaultValue="Villa No Bad Days, Lomé - Quartier Forever"
                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-sm font-bold text-zinc-700 min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Devise locale</label>
                            <select className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-sm font-bold text-zinc-700">
                                <option value="FCFA">FCFA</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                    </GlassCard>
                </div>

                {/* Database Management */}
                <div className="space-y-4">
                    <h3 className="text-lg font-black flex items-center gap-2 text-zinc-800">
                        <Database className="w-5 h-5 text-accent" /> Base de Données
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        <button 
                            onClick={handleExport}
                            className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-2xl hover:border-primary/50 hover:bg-zinc-50 transition-all group shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white">
                                    <Download className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-zinc-800">Exporter Sauvegarde</p>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Télécharger .json</p>
                                </div>
                            </div>
                        </button>

                        <label className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-2xl hover:border-accent/50 hover:bg-zinc-50 transition-all cursor-pointer group shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-accent/5 text-accent flex items-center justify-center transition-colors group-hover:bg-accent group-hover:text-white">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-zinc-800">Restaurer Données</p>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Importer un fichier</p>
                                </div>
                            </div>
                            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                        </label>

                        <button 
                            onClick={handleReset}
                            className="flex items-center justify-between p-4 bg-white border border-red-100 rounded-2xl hover:bg-red-50 hover:border-red-300 transition-all group shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center transition-colors group-hover:bg-red-500 group-hover:text-white">
                                    <Trash2 className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-red-600">Réinitialisation</p>
                                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Effacer tout les contenus</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modules Activation Matrix */}
            <div className="space-y-4">
                <h3 className="text-lg font-black flex items-center gap-2 text-zinc-800 font-mono tracking-tighter">
                    <Settings className="w-5 h-5 text-zinc-300" /> MATRICE D'ACTIVATION
                </h3>
                <GlassCard className="p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { id: 'POS', name: 'Terminal Point de Vente', status: 'Actif', color: 'green' },
                            { id: 'CEO', name: 'Tableau de Bord CEO', status: 'Actif', color: 'green' },
                            { id: 'INV', name: 'Gestion d\'Inventaire', status: 'Actif', color: 'green' },
                            { id: 'REP', name: 'Rapports Comptables', status: 'Actif', color: 'green' }
                        ].map(mod => (
                            <div key={mod.id} className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col gap-4 relative overflow-hidden group">
                                <div className={`absolute top-0 right-0 w-16 h-16 bg-${mod.color}-500/5 rounded-bl-full transition-all group-hover:w-20 group-hover:h-20`} />
                                <div className="flex justify-between items-center relative z-10">
                                    <span className="text-[10px] font-black text-zinc-400 tracking-widest">{mod.id}</span>
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-zinc-800">{mod.name}</h4>
                                    <p className="text-[9px] font-bold text-green-600 uppercase mt-1">{mod.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
