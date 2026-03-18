import React, { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../lib/db";
import { 
  Search, Utensils, Coffee, 
  Pizza, Sandwich, IceCream, 
  ChevronRight, Heart, ShoppingBag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../components/PremiumUI";

export const DigitalMenuModule: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const allProducts = useLiveQuery(() => db.products.toArray()) || [];
    const products = allProducts.filter(p => p.type === 'PRODUCT');

    const categories = ["all", ...new Set(products.map(p => p.category))];

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categoryIcons: Record<string, any> = {
        "all": Utensils,
        "Ptit Dej": Coffee,
        "Burgers": Sandwich,
        "Hot Dogs": Sandwich,
        "Pizzas": Pizza,
        "Sucré": IceCream,
        "Boissons": Coffee
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-1000 p-4 md:p-8">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-black tracking-tighter text-primary uppercase italic">Menu Saadé</h1>
                <p className="text-zinc-400 font-bold uppercase text-xs tracking-[0.4em]">Une expérience culinaire immersive</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300 group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Qu'allez-vous déguster aujourd'hui ?" 
                        className="w-full pl-16 pr-8 py-6 bg-white border-none rounded-[2.5rem] font-black text-sm text-zinc-800 shadow-2xl shadow-zinc-200/50 focus:ring-4 ring-primary/5 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar -mx-4 px-4">
                {categories.map(cat => {
                    const Icon = categoryIcons[cat] || Utensils;
                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap shadow-xl ${selectedCategory === cat ? 'bg-primary text-white scale-105' : 'bg-white text-zinc-400 hover:text-primary'}`}
                        >
                            <Icon className="w-4 h-4" />
                            {cat === 'all' ? 'Tout le Menu' : cat}
                        </button>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {filteredProducts.map(product => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                        >
                            <GlassCard className="p-0 overflow-hidden group hover:border-primary transition-all rounded-[3rem]">
                                <div className="aspect-[4/3] bg-zinc-100 relative">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                            <Utensils className="w-16 h-16 opacity-10" />
                                        </div>
                                    )}
                                    <div className="absolute top-6 right-6">
                                        <button className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-xl flex items-center justify-center text-accent hover:scale-110 transition-all">
                                            <Heart className="w-5 h-5 fill-accent" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-6 left-6">
                                        <span className="px-5 py-2 bg-primary/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                                            {product.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-10 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-2xl font-black text-zinc-800 tracking-tighter uppercase">{product.name}</h3>
                                        <p className="text-2xl font-black text-primary tracking-tighter">{product.price.toLocaleString()} F</p>
                                    </div>
                                    <p className="text-zinc-400 text-xs font-bold leading-relaxed">
                                        {product.description || "Une création artisanale signée Saadé, préparée avec passion pour votre plus grand plaisir gourmand."}
                                    </p>
                                    <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Disponible</span>
                                        </div>
                                        <button className="flex items-center gap-2 group-hover:gap-4 transition-all text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                            Détails <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="py-20 text-center space-y-6">
                <GlassCard className="max-w-xl mx-auto p-12 bg-primary text-white border-none shadow-3xl shadow-primary/30 rounded-[3rem]">
                    <h3 className="text-2xl font-black tracking-tighter uppercase mb-4">Prêt à Commander ?</h3>
                    <p className="text-white/70 text-sm font-bold mb-10">Scannez le QR Code à votre table ou passez commande directement au comptoir.</p>
                    <button className="w-full py-6 bg-white text-primary rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3">
                        <ShoppingBag className="w-5 h-5" /> Commencer ma Commande
                    </button>
                </GlassCard>
            </div>
        </div>
    );
};
