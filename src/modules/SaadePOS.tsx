import React, { useState, useEffect } from "react";
import type { Product, SaleItem, Sale, Client } from "../types";
import { db } from "../lib/db";
import { 
  Search, ShoppingCart, 
  Printer, User,
  Pizza, Store, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../components/PremiumUI";
import { PrinterPreviewModule } from "../components/PrinterPreviewModule";
import { playSound } from "../lib/sounds";

export const SaadePOS: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [cart, setCart] = useState<SaleItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [paymentMethod, setPaymentMethod] = useState<Sale['paymentMethod']>('CASH');
    const [lastSale, setLastSale] = useState<Sale | null>(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptType, setReceiptType] = useState<'CUSTOMER' | 'KITCHEN' | 'BAR'>('CUSTOMER');

    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [showClientModal, setShowClientModal] = useState(false);
    const [clientSearch, setClientSearch] = useState("");

    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [pData, cData] = await Promise.all([
            db.getProducts(),
            db.getClients()
        ]);
        setProducts(pData.filter(p => p.type === 'PRODUCT'));
        setClients(cData);
    };

    const addToCart = (product: Product) => {
        if (product.stock <= 0) {
            alert(`Stock insuffisant pour ${product.name}`);
            return;
        }

        setCart(prev => {
            const existing = prev.find(item => item.productId === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    alert("Limite de stock atteinte.");
                    return prev;
                }
                return prev.map(item =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
                        : item
                );
            }
            return [...prev, {
                productId: product.id,
                name: product.name,
                quantity: 1,
                price: product.price,
                total: product.price
            }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        const product = products.find(p => p.id === productId);
        setCart(prev => prev.map(item => {
            if (item.productId === productId) {
                const newQty = Math.max(0, item.quantity + delta);
                if (product && newQty > product.stock) {
                    alert("Stock insuffisant.");
                    return item;
                }
                return { ...item, quantity: newQty, total: newQty * item.price };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);

    const handleCheckout = async () => {
        if (cart.length === 0 || isProcessing) return;
        setIsProcessing(true);

        try {
            const saleProfit = cart.reduce((sum, item) => {
                const product = products.find(p => p.id === item.productId);
                return sum + (item.price - (product?.costPrice || 0)) * item.quantity;
            }, 0);

            const newSale: Sale = {
                id: `SALE-${Date.now()}`,
                clientId: selectedClient?.id,
                clientName: selectedClient?.name || 'PASSANT',
                items: cart,
                subtotal: subtotal,
                discount: 0,
                total: subtotal,
                profit: saleProfit,
                paymentMethod: paymentMethod,
                status: 'COMPLETED',
                createdAt: Date.now(),
                module: 'RESTAURANT'
            };

            await db.saveSale(newSale);
            playSound('CASH_REGISTER');
            setLastSale(newSale);
            setSelectedClient(null);
            setPaymentMethod('CASH');
            setShowReceipt(true);
            setReceiptType('CUSTOMER');
            await loadData();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'encaissement.");
        } finally {
            setIsProcessing(false);
        }
    };

    const filteredProducts = products.filter(p => 
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         p.barcode?.toLowerCase() === searchTerm.toLowerCase()) &&
        (filterCategory === "all" || p.category === filterCategory)
    );

    const categories = ["all", ...new Set(products.map(p => p.category))];

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.phone.includes(clientSearch)
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:h-[calc(100vh-8rem)] animate-in fade-in duration-700 min-h-0">
            {/* Catalog Area */}
            <div className="flex-1 flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-4">
                   <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                            type="text" 
                            placeholder="Rechercher ou scanner code-barres..."
                            className="w-full pl-12 pr-6 py-4 bg-white border-none rounded-[2rem] font-black text-xs text-zinc-800 shadow-xl shadow-zinc-200/50 focus:ring-2 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && filteredProducts.length === 1) {
                                    addToCart(filteredProducts[0]);
                                    setSearchTerm("");
                                }
                            }}
                        />
                   </div>
                   <div className="flex gap-2 p-1 bg-zinc-100 rounded-[2rem] overflow-x-auto custom-scrollbar no-scrollbar">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-4 py-3 rounded-[1.5rem] text-[9px] font-black transition-all whitespace-nowrap ${filterCategory === cat ? 'bg-white text-primary shadow-sm' : 'text-zinc-400 uppercase'}`}
                            >
                                {cat === 'all' ? 'TOUT' : cat.toUpperCase()}
                            </button>
                        ))}
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 content-start">
                    {filteredProducts.map(product => (
                        <motion.div 
                          layout 
                          key={product.id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToCart(product)}
                        >
                            <GlassCard className={`p-4 flex flex-col items-center text-center gap-3 cursor-pointer hover:border-primary transition-all border-zinc-100 shadow-lg shadow-zinc-100/50 h-full ${product.stock <= 5 ? 'border-orange-200' : ''}`}>
                                <div className="w-16 h-16 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300 relative">
                                   {product.category.includes('Patisserie') ? <Store className="w-8 h-8" /> : <Pizza className="w-8 h-8" />}
                                   {product.stock <= 10 && (
                                       <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-orange-500 text-white text-[8px] font-black rounded-full">
                                           {product.stock}
                                       </span>
                                   )}
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-zinc-800 uppercase leading-tight line-clamp-2 mb-1">{product.name}</h4>
                                    <p className="text-[10px] font-black text-primary">{product.price.toLocaleString()} F</p>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Cart Sidebar */}
            <div className="w-full lg:w-96 flex flex-col gap-6 lg:h-full min-h-0">
                <GlassCard className="flex-1 p-6 lg:p-8 flex flex-col border-none shadow-2xl shadow-zinc-200/50 min-h-0 overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <ShoppingCart className="w-5 h-5 text-primary" />
                            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Panier Actuel</h3>
                        </div>
                        <span className="px-3 py-1 bg-zinc-100 rounded-full text-[9px] font-black text-zinc-500">{cart.length} ITEMS</span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 mb-6 min-h-0">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 gap-4">
                                <ShoppingCart className="w-12 h-12" />
                                <p className="text-[10px] font-black uppercase">Votre panier est vide</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.productId} className="flex items-center justify-between group">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-zinc-800 uppercase line-clamp-1">{item.name}</p>
                                        <p className="text-[9px] font-bold text-zinc-400">{item.price.toLocaleString()} F</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-zinc-50 p-1 rounded-xl">
                                        <button onClick={() => updateQuantity(item.productId, -1)} className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-primary transition-colors text-xs">-</button>
                                        <span className="text-[10px] font-black w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.productId, 1)} className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-primary transition-colors text-xs">+</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="space-y-4 pt-6 border-t border-zinc-50 shrink-0">
                        {/* Client Selection */}
                        <button 
                            onClick={() => setShowClientModal(true)}
                            className="w-full p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-between group hover:border-primary/30 transition-all"
                        >
                            <div className="flex items-center gap-3 text-left">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-zinc-300">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Client</p>
                                    <p className="text-[10px] font-black text-zinc-700">{selectedClient?.name || 'PASSANT'}</p>
                                </div>
                            </div>
                            <Plus className="w-4 h-4 text-zinc-300 group-hover:text-primary" />
                        </button>

                        {/* Payment Method */}
                        <div className="flex gap-2">
                            {(['CASH', 'MOBILE_MONEY', 'CARD'] as const).map(method => (
                                <button
                                    key={method}
                                    onClick={() => setPaymentMethod(method)}
                                    className={`flex-1 py-3 rounded-xl text-[8px] font-black transition-all ${paymentMethod === method ? 'bg-primary text-white' : 'bg-zinc-100 text-zinc-400'}`}
                                >
                                    {method === 'CASH' ? 'ESPÈCES' : method === 'MOBILE_MONEY' ? 'MOBILE' : 'CARTE'}
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between items-center px-2">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total à payer</span>
                            <span className="text-3xl font-black text-primary tracking-tighter">{subtotal.toLocaleString()} F</span>
                        </div>

                        <button 
                            onClick={handleCheckout}
                            disabled={cart.length === 0 || isProcessing}
                            className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
                        >
                             {isProcessing ? 'TRAITEMENT...' : 'Valider & Encaisser'}
                        </button>
                    </div>
                </GlassCard>

                {lastSale && (
                     <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                             <p className="text-[10px] font-black text-primary uppercase">Vente réussie !</p>
                        </div>
                        <button 
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-primary text-white rounded-xl text-[9px] font-black uppercase flex items-center gap-2"
                        >
                             <Printer className="w-3 h-3" /> Reçu
                        </button>
                     </motion.div>
                )}
            </div>

            {/* Client Modal */}
            <AnimatePresence>
                {showClientModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowClientModal(false)} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                            <h3 className="text-xl font-black mb-6 uppercase tracking-tighter">Sélectionner Client</h3>
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input 
                                    type="text" 
                                    placeholder="Nom ou téléphone..."
                                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-none rounded-2xl text-xs font-bold"
                                    value={clientSearch}
                                    onChange={(e) => setClientSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                                {filteredClients.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => {
                                            setSelectedClient(c);
                                            setShowClientModal(false);
                                        }}
                                        className="w-full p-4 rounded-2xl hover:bg-zinc-50 transition-colors text-left flex items-center justify-between group"
                                    >
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-800">{c.name}</p>
                                            <p className="text-[9px] font-bold text-zinc-400">{c.phone}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                            <Plus className="w-4 h-4" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Receipt Preview Modal */}
            {showReceipt && lastSale && (
                <PrinterPreviewModule 
                    type={receiptType}
                    orderId={lastSale.id}
                    items={lastSale.items}
                    total={lastSale.total}
                    onClose={() => setShowReceipt(false)}
                />
            )}
        </div>
    );
};
