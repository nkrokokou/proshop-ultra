import React, { useState, useEffect } from "react";
import type { Product, StockMovement } from "../types";
import { db } from "../lib/db";
import { 
  Plus, Search, Edit2,
  Filter, TrendingUp, Package
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../components/PremiumUI";

export const AdvancedInventoryModule: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showMovements, setShowMovements] = useState(false);
    const [movements, setMovements] = useState<StockMovement[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [pData, mData] = await Promise.all([
            db.getProducts(),
            db.getStockMovements()
        ]);
        setProducts(pData);
        setMovements(mData);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Supprimer ce produit ?")) {
            await db.deleteProduct(id);
            loadData();
        }
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const product: Product = {
            id: selectedProduct?.id || `PROD-${Date.now()}`,
            name: data.name as string,
            category: data.category as string,
            price: Number(data.price),
            costPrice: Number(data.costPrice),
            stock: Number(data.stock),
            minStock: Number(data.minStock),
            barcode: data.barcode as string,
            description: data.description as string,
            createdAt: selectedProduct?.createdAt || Date.now(),
            updatedAt: Date.now(),
            features: { unit: data.unit as string }
        };

        await db.saveProduct(product);
        setShowModal(false);
        setSelectedProduct(null);
        loadData();
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStockCount = products.filter(p => p.stock <= (p.minStock || 0)).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-primary">Gestion des Stocks</h2>
                    <p className="text-zinc-500 font-medium mt-1">Supervisez vos matières premières et produits finis.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setShowMovements(!showMovements)}
                        className="px-6 py-4 bg-zinc-100 text-zinc-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-2"
                    >
                        {showMovements ? 'Voir Stocks' : 'Historique Flux'}
                    </button>
                    <button 
                        onClick={() => { setSelectedProduct(null); setShowModal(true); }}
                        className="neo-button flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Nouveau Produit
                    </button>
                </div>
            </div>

            {!showMovements ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <GlassCard className="p-6 bg-zinc-950 text-white border-none shadow-2xl shadow-zinc-950/20">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Valeur Vente Stock</p>
                            <h3 className="text-3xl font-black tracking-tighter">{totalValue.toLocaleString()} F</h3>
                            <TrendingUp className="w-8 h-8 text-primary mt-4" />
                        </GlassCard>
                        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <GlassCard className="p-6 border-none shadow-xl shadow-zinc-100">
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Alertes Rupture</p>
                                <h3 className={`text-3xl font-black ${lowStockCount > 0 ? 'text-red-500' : 'text-zinc-800'}`}>{lowStockCount}</h3>
                            </GlassCard>
                            <GlassCard className="p-6 border-none bg-zinc-50/50 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Références</p>
                                    <h3 className="text-3xl font-black text-zinc-800">{products.length}</h3>
                                </div>
                                <Package className="w-8 h-8 text-zinc-200" />
                            </GlassCard>
                            <GlassCard className="p-6 border-none bg-zinc-50/50 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Matières Premières</p>
                                    <h3 className="text-3xl font-black text-zinc-800">{products.filter(p => p.category === 'Matières Premières').length}</h3>
                                </div>
                                <TrendingUp className="w-8 h-8 text-zinc-200 opacity-20" />
                            </GlassCard>
                        </div>
                    </div>

                    <GlassCard className="p-8 border-none bg-white shadow-2xl shadow-zinc-200/50">
                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input 
                                    type="text" 
                                    placeholder="Rechercher par nom, catégorie, code..."
                                    className="w-full pl-16 pr-8 py-5 bg-zinc-50 border-none rounded-[2rem] font-black text-xs text-zinc-800 focus:ring-2 focus:ring-primary shadow-inner"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="px-8 py-5 bg-zinc-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                                <Filter className="w-4 h-4" /> Filtrer
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-100">
                                        <th className="pb-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Produit</th>
                                        <th className="pb-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Catégorie</th>
                                        <th className="pb-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">Stock</th>
                                        <th className="pb-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Prix</th>
                                        <th className="pb-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                    {filteredProducts.map(product => (
                                        <tr key={product.id} className="group hover:bg-zinc-50 transition-colors">
                                            <td className="py-5">
                                                <p className="font-black text-xs text-zinc-800 uppercase tracking-tighter">{product.name}</p>
                                                <p className="text-[10px] text-zinc-400 uppercase">{product.barcode || 'SANS CODE'}</p>
                                            </td>
                                            <td className="py-5">
                                                <span className="px-3 py-1 bg-zinc-100 rounded-full text-[9px] font-black uppercase text-zinc-500">{product.category}</span>
                                            </td>
                                            <td className="py-5 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className={`text-xs font-black ${product.stock <= (product.minStock || 0) ? 'text-red-500' : 'text-zinc-800'}`}>{product.stock}</span>
                                                    {product.stock <= (product.minStock || 0) && <span className="text-[8px] font-black text-red-400 uppercase tracking-tighter animate-pulse">CRITIQUE</span>}
                                                </div>
                                            </td>
                                            <td className="py-5 text-right font-black text-xs text-primary">{product.price.toLocaleString()} F</td>
                                            <td className="py-5 text-right">
                                                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => { setSelectedProduct(product); setShowModal(true); }}
                                                        className="p-2 bg-zinc-100 text-zinc-600 rounded-lg hover:bg-primary hover:text-white transition-all"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 bg-zinc-100 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                                    >
                                                        <Plus className="w-3.5 h-3.5 rotate-45" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </>
            ) : (
                <GlassCard className="p-8 border-none bg-white shadow-2xl">
                    <h3 className="text-xl font-black mb-8 uppercase tracking-tighter">Journal des Flux Stock</h3>
                    <div className="space-y-4">
                        {movements.map(m => (
                            <div key={m.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <div>
                                    <p className="text-[10px] font-black text-zinc-800 uppercase">{m.productName}</p>
                                    <p className="text-[8px] font-bold text-zinc-400 uppercase">{new Date(m.date).toLocaleString()} • {m.agentName}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-xs font-black ${m.type === 'IN' ? 'text-green-500' : 'text-red-500'}`}>
                                        {m.type === 'IN' ? '+' : '-'}{m.quantity}
                                    </p>
                                    <p className="text-[8px] font-black text-zinc-400 uppercase">Stock: {m.newStock}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            )}

            {/* Modal Produit */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">{selectedProduct ? 'Modifier Produit' : 'Nouveau Produit'}</h3>
                            <form onSubmit={handleSave} className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Nom du Produit</label>
                                    <input name="name" defaultValue={selectedProduct?.name} required className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Catégorie</label>
                                    <select name="category" defaultValue={selectedProduct?.category} className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs">
                                        <option>Matières Premières</option>
                                        <option>Boulangerie</option>
                                        <option>Pâtisserie</option>
                                        <option>Cuisine</option>
                                        <option>Boissons</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Code-barres / ID</label>
                                    <input name="barcode" defaultValue={selectedProduct?.barcode} className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Prix de Vente</label>
                                    <input type="number" name="price" defaultValue={selectedProduct?.price} required className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Prix d'Achat (Coût)</label>
                                    <input type="number" name="costPrice" defaultValue={selectedProduct?.costPrice} required className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Stock Actuel</label>
                                    <input type="number" name="stock" defaultValue={selectedProduct?.stock} required className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Seuil Alerte</label>
                                    <input type="number" name="minStock" defaultValue={selectedProduct?.minStock} required className="w-full p-4 bg-zinc-50 border-none rounded-2xl font-bold text-xs" />
                                </div>
                                <div className="col-span-2">
                                    <button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/30 mt-4">
                                        Sauvegarder les Données
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
