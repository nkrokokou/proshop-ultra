import React, { useState, useEffect } from "react";
import type { Recipe, ProductionBatch } from "../types";
import { db } from "../lib/db";
import { 
  ChefHat, Plus, Play, Timer, 
  Search, History, CheckCircle2
} from "lucide-react";
// No motion needed here anymore
import { GlassCard } from "../components/PremiumUI";

export const ProductionModule: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [batches, setBatches] = useState<ProductionBatch[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'RECIPES' | 'BATCHES'>('RECIPES');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [rData, bData] = await Promise.all([
            db.getRecipes(),
            db.getProductionBatches()
        ]);
        setRecipes(rData);
        setBatches(bData);
    };

    const handleStartBatch = async (recipe: Recipe) => {
        const batch: ProductionBatch = {
            id: `BAT-${Date.now()}`,
            recipeId: recipe.id,
            productName: recipe.productName,
            plannedQuantity: recipe.yield,
            startDate: Date.now(),
            status: 'IN_PROGRESS',
            agentId: 'chef-1' // Placeholder
        };
        await db.saveProductionBatch(batch);
        setViewMode('BATCHES');
        loadData();
    };

    const handleCompleteBatch = async (batch: ProductionBatch, actualQty: number) => {
        const updatedBatch: ProductionBatch = {
            ...batch,
            actualQuantity: actualQty,
            endDate: Date.now(),
            status: 'COMPLETED'
        };

        // Update Stock of the finished product
        const recipe = recipes.find(r => r.id === batch.recipeId);
        if (recipe) {
            await db.simpleUpdateStock(recipe.productId, actualQty, `Production Fini: ${batch.id}`);
            
            // Deduct ingredients from stock
            for (const ing of recipe.ingredients) {
                const totalUsed = (ing.quantity / recipe.yield) * actualQty;
                await db.simpleUpdateStock(ing.ingredientId, -totalUsed, `Consommation Production: ${batch.id}`);
            }
        }

        await db.saveProductionBatch(updatedBatch);
        loadData();
    };

    const filteredRecipes = recipes.filter(r => 
        r.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-primary uppercase italic">Laboratoire Saadé</h2>
                    <p className="text-zinc-500 font-medium mt-1">Maîtrise culinaire & Pilotage de production Saadé.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex p-1 bg-zinc-100 rounded-2xl">
                        <button onClick={() => setViewMode('RECIPES')} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${viewMode === 'RECIPES' ? 'bg-white text-primary shadow-sm' : 'text-zinc-400 uppercase'}`}>Recettes</button>
                        <button onClick={() => setViewMode('BATCHES')} className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${viewMode === 'BATCHES' ? 'bg-white text-primary shadow-sm' : 'text-zinc-400 uppercase'}`}>Fournées</button>
                    </div>
                    <button className="neo-button flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Nouvelle Recette
                    </button>
                </div>
            </div>

            {viewMode === 'RECIPES' ? (
                <>
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                            type="text" 
                            placeholder="Rechercher une fiche technique..."
                            className="w-full pl-16 pr-8 py-5 bg-white border-none rounded-[2rem] font-black text-xs text-zinc-800 shadow-xl shadow-zinc-200/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRecipes.length === 0 ? (
                            <GlassCard className="col-span-full p-20 flex flex-col items-center justify-center text-center opacity-60 bg-zinc-50 border-dashed border-2">
                                <ChefHat className="w-16 h-16 mb-4 text-zinc-300" />
                                <h3 className="text-xl font-black uppercase text-zinc-400">Aucune fiche technique</h3>
                                <p className="text-xs font-bold text-zinc-400 mt-2">Créez vos recettes pour automatiser la gestion des stocks de production.</p>
                            </GlassCard>
                        ) : (
                            filteredRecipes.map(recipe => (
                                <GlassCard key={recipe.id} className="p-6 group hover:border-primary transition-all">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all">
                                            <ChefHat className="w-6 h-6" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{recipe.yield} {recipe.unit}</p>
                                            <p className="text-[9px] font-black text-zinc-400 uppercase mt-1">Coût Estimé: {recipe.totalCost.toLocaleString()} F</p>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-black text-zinc-800 uppercase tracking-tighter mb-4">{recipe.productName}</h3>
                                    
                                    <div className="space-y-2 mb-6">
                                        {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                                            <div key={idx} className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                                                <span>{ing.ingredientName}</span>
                                                <span>{ing.quantity} {ing.unit}</span>
                                            </div>
                                        ))}
                                        {recipe.ingredients.length > 3 && (
                                            <p className="text-[9px] font-black text-primary uppercase">+ {recipe.ingredients.length - 3} autres ingrédients</p>
                                        )}
                                    </div>

                                    <button 
                                        onClick={() => handleStartBatch(recipe)}
                                        className="w-full py-4 bg-zinc-950 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-zinc-950/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
                                    >
                                        <Play className="w-3.5 h-3.5 fill-white" /> Lancer Production
                                    </button>
                                </GlassCard>
                            ))
                        )}
                    </div>
                </>
            ) : (
                <div className="space-y-6">
                    {batches.filter(b => b.status === 'IN_PROGRESS').map(batch => (
                        <GlassCard key={batch.id} className="p-8 border-none bg-primary/5 shadow-xl shadow-primary/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-[2rem] bg-white shadow-xl flex items-center justify-center text-primary relative">
                                        <Timer className="w-8 h-8 animate-spin-slow" />
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-4 border-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-zinc-800 uppercase tracking-tighter">{batch.productName}</h3>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase">Batch #{batch.id} • Démarré à {new Date(batch.startDate).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Objectif</p>
                                        <h4 className="text-2xl font-black text-primary">{batch.plannedQuantity}</h4>
                                    </div>
                                    <button 
                                        onClick={() => handleCompleteBatch(batch, batch.plannedQuantity)}
                                        className="px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-105 transition-all"
                                    >
                                        Finaliser & Déduire Ingrédients
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}

                    <div className="pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <History className="w-5 h-5 text-zinc-400" />
                            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Historique de Production</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {batches.filter(b => b.status === 'COMPLETED').map(batch => (
                                <div key={batch.id} className="bg-white p-6 rounded-3xl border border-zinc-100 flex items-center justify-between group hover:border-primary transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-300">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-zinc-800 uppercase tracking-tighter">{batch.productName}</p>
                                            <p className="text-[9px] font-bold text-zinc-400 italic">Terminé le {new Date(batch.endDate || 0).toLocaleDateString()} à {new Date(batch.endDate || 0).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-primary">+{batch.actualQuantity} Stock</p>
                                        <p className="text-[8px] font-black text-zinc-300 uppercase">Efficacité 100%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
