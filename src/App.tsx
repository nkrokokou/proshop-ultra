import { useState } from 'react'
import {
  Home, Package, Settings, ShoppingCart,
  Search, Bell, User, TrendingUp, Users, DollarSign,
  Sparkles, Zap, ChevronRight, LayoutGrid
} from 'lucide-react'
import { GlassCard, StatCard } from './components/PremiumUI'
import { MiniChart } from './components/MiniChart'
import { SaadeePOS } from './modules/SaadeePOS'
import { CEODashboard } from './modules/CEODashboard'
import { InventoryModule } from './modules/InventoryModule';
import { ConfigurationModule } from './modules/ConfigurationModule';
import { ProductionModule } from './modules/ProductionModule';
import { motion, AnimatePresence } from 'framer-motion'
import { AppProvider, useApp } from './lib/context'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './lib/db'

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <motion.div
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-300 rounded-xl group ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-primary/5 text-zinc-600 hover:text-primary'}`}
  >
    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
    <span className="font-medium text-sm">{label}</span>
    {active && <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-glow" />}
  </motion.div>
)

const Layout = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="flex h-screen bg-background text-zinc-900 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 flex flex-col p-4 gap-8 bg-white/50 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-primary/20">V</div>
          <div>
            <h1 className="text-sm font-black leading-none text-primary">VILLA NO BAD DAYS</h1>
            <span className="text-[9px] text-accent font-mono uppercase tracking-widest font-bold">Premium POS Engine</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
          <SidebarItem icon={Home} label="Tableau de bord" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
          <SidebarItem icon={ShoppingCart} label="Caisse" active={activeTab === 'Ventes'} onClick={() => setActiveTab('Ventes')} />
          <SidebarItem icon={LayoutGrid} label="Espace CEO" active={activeTab === 'CEO'} onClick={() => setActiveTab('CEO')} />
          <SidebarItem icon={Package} label="Inventaire" active={activeTab === 'Inventaire'} onClick={() => setActiveTab('Inventaire')} />
          <SidebarItem icon={Zap} label="Production & Recalibrage" active={activeTab === 'Production'} onClick={() => setActiveTab('Production')} />

          <div className="mt-auto border-t border-zinc-100 pt-4">
            <SidebarItem icon={Settings} label="Configuration" active={activeTab === 'Paramètres'} onClick={() => setActiveTab('Paramètres')} />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-zinc-200 flex items-center px-8 justify-between bg-white/30 backdrop-blur-md">
          <div className="flex items-center gap-6 flex-1 max-w-xl">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full bg-zinc-100 border border-transparent rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:bg-white focus:border-primary/30 focus:ring-4 ring-primary/5 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl hover:bg-zinc-100 text-zinc-500 relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-white" />
            </button>
            <div className="w-px h-6 bg-zinc-200 mx-2" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-zinc-900">Admin</p>
                <p className="text-[10px] text-zinc-400 font-bold tracking-wider uppercase">Directeur</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200">
                <User className="w-5 h-5 text-zinc-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'Dashboard' ? <HomeDashboard /> :
                activeTab === 'Ventes' ? <SaadeePOS /> :
                  activeTab === 'Inventaire' ? <InventoryModule /> :
                    activeTab === 'Production' ? <ProductionModule /> :
                      activeTab === 'CEO' ? <CEODashboard /> :
                        activeTab === 'Paramètres' ? <ConfigurationModule /> :
                          <ComingSoon tab={activeTab} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

const HomeDashboard = () => {
  // useApp() is available via context if needed in the future
  useApp();

  // Live queries for real statistics
  const sales = useLiveQuery(() => db.sales.toArray());
  const clients = useLiveQuery(() => db.clients.toArray());
  const specialOrders = useLiveQuery(() => db.specialOrders.where('status').notEqual('DELIVERED').toArray());
  const stockAlerts = useLiveQuery(() => db.products.filter(p => p.stock <= p.minStock).toArray());

  const totalTurnover = sales?.reduce((acc: number, s) => acc + s.total, 0) || 0;
  const clientCount = clients?.length || 0;
  const ordersCount = specialOrders?.length || 0;
  const stockAlertCount = stockAlerts?.length || 0;


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-primary">Vue d'ensemble</h2>
          <p className="text-zinc-500 font-medium mt-1">Bienvenue dans votre centre de contrôle SAADEE.</p>
        </div>
        <div className="flex gap-3">
          <button className="neo-button flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Nouvelle Vente
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Chiffre d'Affaires" value={`${totalTurnover.toLocaleString()} F`} trend={{ value: 12, isUp: true }} icon={TrendingUp} color="primary" />
        <StatCard label="Clients Fidèles" value={clientCount.toString()} trend={{ value: 5, isUp: true }} icon={Users} color="accent" />
        <StatCard label="Commandes Spéciales" value={ordersCount.toString()} icon={ShoppingCart} color="orange-500" />
        <StatCard label="Alertes Stock" value={stockAlertCount.toString()} trend={{ value: 0, isUp: false }} icon={Package} color="red-500" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <GlassCard className="lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold">Performances Hebdomadaires</h3>
              <p className="text-sm text-white/40">Ventes cumulées par jour</p>
            </div>
            <select className="bg-zinc-100 border border-zinc-200 rounded-lg text-xs p-2 focus:outline-none focus:border-primary">
              <option>Aujourd'hui</option>
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
            </select>
          </div>
          <MiniChart />
        </GlassCard>

        {/* Insights */}
        <div className="space-y-6">
          <GlassCard className="border-accent/20 bg-accent/5">
            <div className="flex items-center gap-3 mb-4 text-accent">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold">Insight Intelligent</h3>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Vos ventes de <span className="text-primary font-black">Croissants Pur Beurre</span> ont augmenté de 32% cette semaine. Prévoyez une fournée supplémentaire demain matin.
            </p>
            <button className="mt-4 text-xs font-bold text-accent flex items-center gap-1 hover:gap-2 transition-all">
              Voir l'analyse complète <ChevronRight className="w-3 h-3" />
            </button>
          </GlassCard>

          <GlassCard>
            <h3 className="font-bold mb-4 flex items-center gap-2 text-zinc-800">
              <Zap className="w-5 h-5 text-yellow-500" /> Accès Rapides
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-zinc-700">Ouvrir Plan de Table</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-primary transition-colors" />
              </button>
              <button
                className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-zinc-700">Inventaire Critique</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-accent transition-colors" />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}


const ComingSoon = ({ tab }: { tab: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
    <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
      <LayoutGrid className="w-10 h-10 text-white/20 animate-pulse" />
    </div>
    <h2 className="text-3xl font-bold mb-2">{tab}</h2>
    <p className="text-white/40 max-w-sm">
      Cette section est en cours d'assemblage par l'Ultra Engine. Restez à l'écoute !
    </p>
    <button className="mt-8 neo-button">Exporter vers PDF (Bêta)</button>
  </div>
)

function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  )
}

export default App
