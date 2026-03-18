import React from 'react';
import { motion } from 'framer-motion';
import { Printer, X, CheckCircle2 } from 'lucide-react';

interface ReceiptProps {
    type: 'CUSTOMER' | 'KITCHEN' | 'BAR';
    orderId: string;
    items: any[];
    total?: number;
    onClose: () => void;
}

export const PrinterPreviewModule = ({ type, orderId, items, total, onClose }: ReceiptProps) => {
    const now = new Date().toLocaleString('fr-FR');
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
            >
                {/* Modal Header */}
                <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                    <div className="flex items-center gap-3 text-zinc-900">
                        <Printer className="w-5 h-5" />
                        <h2 className="font-black uppercase tracking-widest text-sm">Aperçu Impression : {type}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-zinc-500" />
                    </button>
                </div>

                {/* Thermal Receipt Simulation */}
                <div className="flex-1 overflow-y-auto p-8 bg-zinc-100 flex flex-col items-center custom-scrollbar">
                    <div className="bg-white w-full max-w-[300px] shadow-sm p-6 font-mono text-[10px] text-zinc-800 leading-relaxed border-t-4 border-primary">
                        <div className="text-center mb-6">
                            <p className="font-black text-xs uppercase mb-1">Saadé</p>
                            <p>VILLA NO BAD DAYS, LOME</p>
                            <p>+228 90 00 00 00</p>
                            <div className="h-px bg-zinc-200 w-full my-4 border-dashed border-t" />
                            <p className="font-bold">{type === 'CUSTOMER' ? 'REÇU DE VENTE' : 'BON DE PRÉPARATION'}</p>
                            <p>#{orderId}</p>
                            <p>{now}</p>
                            <div className="h-px bg-zinc-200 w-full my-4 border-dashed border-t" />
                        </div>

                        <div className="space-y-2 mb-6">
                            {items.map((item, i) => (
                                <div key={i} className="flex justify-between items-start">
                                    <span className="flex-1">{item.name} x{item.quantity}</span>
                                    {type === 'CUSTOMER' && <span className="ml-4">{(item.price * item.quantity).toLocaleString()}</span>}
                                </div>
                            ))}
                        </div>

                        {type === 'CUSTOMER' && total && (
                            <>
                                <div className="h-px bg-zinc-200 w-full my-4 border-dashed border-t" />
                                <div className="flex justify-between font-black text-xs">
                                    <span>TOTAL</span>
                                    <span>{total.toLocaleString()} FCFA</span>
                                </div>
                                <div className="h-px bg-zinc-200 w-full my-4 border-dashed border-t" />
                            </>
                        )}

                        <div className="text-center mt-6 text-[8px] opacity-60 italic">
                            {type === 'CUSTOMER' ? (
                                <p>MERCI DE VOTRE VISITE !<br/>Suivez-nous sur Instagram @saade</p>
                            ) : (
                                <p>SAADÉ - CUISINE ARTISANALE</p>
                            )}
                        </div>
                        
                        {/* Cut Line Simulation */}
                        <div className="mt-8 flex justify-between gap-1">
                             {[...Array(15)].map((_, i) => <div key={i} className="h-0.5 w-1 bg-zinc-200" />)}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-white border-t border-zinc-100 flex gap-4">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 px-6 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirmer l'Impression
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
