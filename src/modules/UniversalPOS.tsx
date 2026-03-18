import React, { useState } from 'react';
import {
    ShoppingCart, Search, Trash2,
    CreditCard, Banknote, CheckCircle2,
    Package
} from 'lucide-react';
import { useApp } from '../lib/context';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { SalesService } from '../lib/services/SalesService';
import type { SaleItem, Product } from '../types';

export const UniversalPOS: React.FC = () => {
    useApp();
    const [cart, setCart] = useState<SaleItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [configProduct, setConfigProduct] = useState<Product | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');

    // Fetch products from Dexie
    const products = useLiveQuery(
        () => db.products.toArray(),
        []
    );

    const filteredProducts = products?.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.barcode?.includes(searchQuery)
    );

    const addProductToCart = (product: Product, size?: string, color?: string) => {
        setCart(prev => {
            const cartId = `${product.id}-${size || ''}-${color || ''}`;
            const existing = prev.find(item => `${item.productId}-${item.selectedSize || ''}-${item.selectedColor || ''}` === cartId);

            if (existing) {
                return prev.map(item =>
                    `${item.productId}-${item.selectedSize || ''}-${item.selectedColor || ''}` === cartId
                        ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
                        : item
                );
            }
            return [...prev, {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                total: product.price,
                selectedSize: size,
                selectedColor: color
            }];
        });
        setConfigProduct(null);
        setSelectedSize('');
        setSelectedColor('');
    };

    const handleProductClick = (product: Product) => {
        if (product.category === 'Mode' && (product.features.sizes?.length || product.features.colors?.length)) {
            setConfigProduct(product);
        } else {
            addProductToCart(product);
        }
    };

    const updateQuantity = (productId: string, delta: number, size?: string, color?: string) => {
        setCart(prev => prev.map(item => {
            if (item.productId === productId && item.selectedSize === size && item.selectedColor === color) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty, total: newQty * item.price };
            }
            return item;
        }));
    };

    const removeFromCart = (productId: string, size?: string, color?: string) => {
        setCart(prev => prev.filter(item => !(item.productId === productId && item.selectedSize === size && item.selectedColor === color)));
    };

    const handleFinalize = async () => {
        if (cart.length === 0) return;

        try {
            await SalesService.finalizeSale(cart, 'CASH', 'GENERAL_RETAIL');
            setCart([]);
        } catch (error) {
            console.error('Sale failed:', error);
        }
    };

    const total = cart.reduce((acc, item) => acc + item.total, 0);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-full">
            {/* Product Selection Area */}
            <div className="xl:col-span-2 space-y-6">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Scanner un code-barres ou rechercher un produit..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 focus:ring-4 ring-primary/5 transition-all text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredProducts?.map(product => (
                        <button
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            className="glass-panel p-4 hover:border-primary/50 transition-all flex flex-col items-center gap-3 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/5 text-white/40 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <Package className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                                <span className="text-sm font-medium block truncate w-full max-w-[120px]">{product.name}</span>
                                <span className="text-xs text-primary font-bold">{product.price.toLocaleString()} F</span>
                            </div>
                        </button>
                    ))}

                    {products?.length === 0 && (
                        <div className="col-span-full py-20 text-center opacity-30">
                            <p>Aucun produit en stock. Ajoutez-en dans l'inventaire.</p>
                        </div>
                    )}
                </div>

                {/* Variation Selection Modal */}
                <AnimatePresence>
                    {configProduct && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                className="bg-surface/90 border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6"
                            >
                                <div className="text-center">
                                    <h3 className="text-xl font-bold">{configProduct.name}</h3>
                                    <p className="text-white/40 text-sm">Sélectionnez les variantes</p>
                                </div>

                                {configProduct.features.sizes && (
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Taille</p>
                                        <div className="flex flex-wrap gap-2">
                                            {configProduct.features.sizes.map(size => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedSize === size ? 'bg-primary text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                                                >{size}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {configProduct.features.colors && (
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Couleur</p>
                                        <div className="flex flex-wrap gap-2">
                                            {configProduct.features.colors.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedColor === color ? 'bg-primary text-white border-primary' : 'bg-white/5 border border-white/5 text-white/40 hover:bg-white/10'}`}
                                                >{color}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => setConfigProduct(null)} className="flex-1 py-3 rounded-xl bg-white/5 font-bold text-sm">ANNULER</button>
                                    <button
                                        onClick={() => addProductToCart(configProduct, selectedSize, selectedColor)}
                                        className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20"
                                    >AJOUTER</button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Cart Area */}
            <div className="glass-panel flex flex-col h-[calc(100vh-180px)] xl:h-auto overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface/20">
                    <h3 className="font-bold flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-primary" /> Panier Complet
                    </h3>
                    <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded-full">{cart.length} ARTICLES</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {cart.map((item, idx: number) => (
                            <motion.div
                                key={`${item.productId}-${idx}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3 group hover:border-white/10 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="font-bold text-sm block">{item.name}</span>
                                        <div className="flex gap-2 mt-1">
                                            {item.selectedSize && <span className="text-[9px] font-bold bg-white/5 px-1.5 py-0.5 rounded text-white/40">SIZE: {item.selectedSize}</span>}
                                            {item.selectedColor && <span className="text-[9px] font-bold bg-white/5 px-1.5 py-0.5 rounded text-white/40">COLOR: {item.selectedColor}</span>}
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.productId, item.selectedSize, item.selectedColor)} className="text-white/20 hover:text-red-400 transition-colors p-1">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.productId, -1, item.selectedSize, item.selectedColor)}
                                            className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-sm hover:bg-white/10 transition-colors font-bold"
                                        >-</button>
                                        <span className="text-sm font-black w-6 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.productId, 1, item.selectedSize, item.selectedColor)}
                                            className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-sm hover:bg-white/10 transition-colors font-bold"
                                        >+</button>
                                    </div>
                                    <span className="font-black text-primary">{item.total.toLocaleString()} F</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {cart.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-48 text-white/10">
                            <ShoppingCart className="w-16 h-16 mb-4 opacity-10" />
                            <p className="text-sm font-bold uppercase tracking-widest text-white/5">Panier vide</p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/5 space-y-4 bg-surface/30">
                    <div className="flex justify-between items-center text-white/40 text-sm">
                        <span>Sous-total</span>
                        <span>{total.toLocaleString()} F</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-black text-primary">{total.toLocaleString()} F</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary/20 border border-primary/20 text-primary font-bold">
                            <Banknote className="w-4 h-4" /> Espèces
                        </button>
                        <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all opacity-50 cursor-not-allowed">
                            <CreditCard className="w-4 h-4" /> Mobile
                        </button>
                    </div>

                    <button
                        onClick={handleFinalize}
                        disabled={cart.length === 0}
                        className="w-full py-4 neo-button flex items-center justify-center gap-2 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCircle2 className="w-6 h-6" /> FINALISER LA VENTE
                    </button>
                </div>
            </div>
        </div>
    );
};
