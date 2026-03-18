import React, { useState } from 'react';
import { 
  ShoppingCart, Utensils, Coffee, Pizza, 
  Send, Trash2, 
  CheckCircle2, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SaadeeItem } from '../data/saadeeMenu';
import { SAADEE_MENU } from '../data/saadeeMenu';

export const SaadeePOS: React.FC = () => {
  const [cart, setCart] = useState<(SaadeeItem & { quantity: number })[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Ô My Dog');
  const [activeSection, setActiveSection] = useState<string>('Toutes');

  const categories = Array.from(new Set(SAADEE_MENU.map(item => item.category)));
  const sections = ['Toutes', ...Array.from(new Set(SAADEE_MENU.filter(item => item.category === activeCategory).map(item => item.section)))];

  const addToCart = (item: SaadeeItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        return { ...i, quantity: Math.max(1, i.quantity + delta) };
      }
      return i;
    }));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const sendToCuisine = () => {
    if (cart.length === 0) return;
    
    // Logic for printer dispatching
    const kitchenItems = cart.filter(i => i.printer === 'KITCHEN');
    const barItems = cart.filter(i => i.printer === 'BAR');

    console.log('ENVOI CUISINE:', kitchenItems);
    console.log('ENVOI BAR:', barItems);

    alert(`Commande envoyée !\nCuisine: ${kitchenItems.length} articles\nBar: ${barItems.length} articles`);
    setCart([]);
  };

  const filteredItems = SAADEE_MENU.filter(item => 
    item.category === activeCategory && 
    (activeSection === 'Toutes' || item.section === activeSection)
  );

  return (
    <div className="flex h-full gap-6 select-none animate-in fade-in duration-500">
      {/* Left Navigation (Categories) */}
      <div className="w-24 flex flex-col gap-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setActiveSection('Toutes'); }}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all ${activeCategory === cat ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-white text-zinc-400 hover:bg-zinc-100 border border-zinc-200/50'}`}
          >
            {cat === 'Ô My Dog' ? <Utensils className="w-6 h-6 mb-2" /> : <Coffee className="w-6 h-6 mb-2" />}
            <span className="text-[10px] font-bold uppercase tracking-tighter leading-none">{cat}</span>
          </button>
        ))}
      </div>

      {/* Center - Menu Items */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Sections Header */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {sections.map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all ${activeSection === section ? 'bg-primary text-white shadow-md' : 'bg-white text-zinc-500 hover:bg-zinc-100 border border-zinc-200'}`}
            >
              {section}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1 content-start">
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.button
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id}
                onClick={() => addToCart(item)}
                className="group relative h-32 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between items-start transition-all hover:border-primary/50 shadow-sm hover:shadow-md"
              >
                <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Zap className="w-3 h-3 text-primary" />
                </div>
                <span className="text-xs font-bold text-left leading-tight w-full line-clamp-2 text-zinc-800">{item.name}</span>
                <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">{item.price.toLocaleString()} F</span>
                
                {/* Visual Hint for Printer */}
                <div className={`absolute bottom-0 right-0 w-8 h-1 ${item.printer === 'KITCHEN' ? 'bg-red-500' : 'bg-blue-500'} opacity-20`} />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Right - Order Summary */}
      <div className="w-96 flex flex-col bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 bg-zinc-50 border-b border-zinc-100 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2 text-zinc-800">
            <ShoppingCart className="w-5 h-5 text-primary" /> Commande
          </h3>
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">SAADEE POS</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {cart.map(item => (
              <motion.div
                key={item.id}
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                className="bg-zinc-50 rounded-xl p-3 flex flex-col gap-2 group border border-transparent hover:border-zinc-200 transition-all"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold leading-tight flex-1 text-zinc-700">{item.name}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-white/20 hover:text-red-400 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 text-xs">-</button>
                    <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded flex items-center justify-center bg-white/5 hover:bg-white/10 text-xs">+</button>
                  </div>
                  <span className="text-sm font-black text-primary">{(item.price * item.quantity).toLocaleString()} F</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <Pizza className="w-16 h-16 mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest text-center">Aucun article<br/>Sélectionnez un délice</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-zinc-50 border-t border-zinc-200 space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-[10px] text-zinc-400 uppercase font-black">Total à payer</span>
            <span className="text-2xl font-black text-primary tabular-nums tracking-tighter">{(total).toLocaleString()} F</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button onClick={sendToCuisine} className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-white border border-zinc-200 hover:border-primary/50 transition-all group">
                <Send className="w-5 h-5 text-zinc-300 group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Cuisine / Bar</span>
             </button>
             <button className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-primary shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Payer</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
