import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star } from 'lucide-react';

export const CustomerDisplayModule = ({ cart = [] }: { cart?: any[] }) => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Promotion / Branding Header */}
            <div className="h-2/3 relative overflow-hidden bg-zinc-900 flex items-center justify-center">
                <img 
                    src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=2070&auto=format&fit=crop" 
                    className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm"
                    alt="Saadé Mood"
                />
                <div className="relative z-10 text-center p-12">
                    <motion.div 
                        animate={{ scale: [1, 1.05, 1] }} 
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-32 h-32 bg-white rounded-3xl mx-auto mb-8 shadow-2xl flex items-center justify-center"
                    >
                        <span className="text-6xl font-black text-primary">S</span>
                    </motion.div>
                    <h1 className="text-6xl font-black text-white mb-4 uppercase tracking-tighter shadow-xl">Saadé</h1>
                    <p className="text-2xl text-accent font-bold uppercase tracking-widest">No Bad Days</p>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-10 right-10 flex gap-4">
                    <Heart className="w-8 h-8 text-accent fill-accent" />
                    <Star className="w-8 h-8 text-primary fill-primary" />
                </div>
            </div>

            {/* Real-time Cart Info */}
            <div className="h-1/3 p-12 flex items-center justify-between border-t-8 border-primary bg-zinc-50">
                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-white rounded-3xl shadow-lg border border-zinc-200 flex items-center justify-center text-primary">
                        <ShoppingBag className="w-12 h-12" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-zinc-900 uppercase">Votre Commande</h2>
                        <p className="text-xl text-zinc-500 font-bold">{cart.length} articles sélectionnés</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-2xl text-zinc-400 font-black uppercase tracking-widest mb-2">Total à payer</p>
                    <p className="text-8xl font-black text-primary tabular-nums">
                        {subtotal.toLocaleString()} <span className="text-4xl text-zinc-400">FCFA</span>
                    </p>
                </div>
            </div>

            {/* Footer Scroll */}
            <div className="h-16 bg-primary text-white flex items-center overflow-hidden">
                <motion.div 
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="flex whitespace-nowrap gap-20 text-xl font-black uppercase tracking-widest"
                >
                    {[1, 2, 3, 4, 5].map(i => (
                        <span key={i}>Merci de votre visite chez Saadé • Goûtez à l'excellence artisanale • Partagez vos moments #NoBadDays</span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
