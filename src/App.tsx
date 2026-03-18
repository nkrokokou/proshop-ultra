import { useState } from 'react'
import {
  Home, Package, Settings, ShoppingCart, Wrench, Shirt,
  Search, Bell, User, TrendingUp, Users, DollarSign,
  Sparkles, Zap, ChevronRight, LayoutGrid
} from 'lucide-react'
import { GlassCard, StatCard } from './components/PremiumUI'
import { MiniChart } from './components/MiniChart'
import { SaadeePOS } from './modules/SaadeePOS'
import { CEODashboard } from './modules/CEODashboard'
import { InventoryModule } from './modules/InventoryModule';
import { ConfigurationModule } from './modules/ConfigurationModule';
import { motion, AnimatePresence } from 'framer-motion'
import { AppProvider, useApp } from './lib/context'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './lib/db'

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <motion.div
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-300 rounded-xl group ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-white/5 text-white/60 hover:text-white'}`}
  >
    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
    <span className="font-medium">{label}</span>
    {active && <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-glow" />}
  </motion.div>
)

const Layout = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-4 gap-8 bg-surface/20 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/30">V</div>
          <div>
            <h1 className="text-sm font-bold leading-none">VILLA NO BAD DAYS</h1>
            <span className="text-[10px] text-primary font-mono uppercase tracking-widest">Premium POS Engine</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
          <SidebarItem icon={Home} label="Tableau de bord" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
          <SidebarItem icon={ShoppingCart} label="CAISSE (Ventes)" active={activeTab === 'Ventes'} onClick={() => setActiveTab('Ventes')} />
          <SidebarItem icon={LayoutGrid} label="ESPACE CEO" active={activeTab === 'CEO'} onClick={() => setActiveTab('CEO')} />
          <SidebarItem icon={Package} label="Stocks" active={activeTab === 'Inventaire'} onClick={() => setActiveTab('Inventaire')} />

          <div className="mt-auto border-t border-white/5 pt-4">
            <SidebarItem icon={Settings} label="Configuration" active={activeTab === 'Paramètres'} onClick={() => setActiveTab('Paramètres')} />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center px-8 justify-between bg-surface/10 backdrop-blur-md">
          <div className="flex items-center gap-6 flex-1 max-w-xl">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Rechercher partout... (Ctrl+K)"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-primary/50 focus:ring-4 ring-primary/5 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl hover:bg-white/5 text-white/60 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-background" />
            </button>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Admin</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Super Utilisateur</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
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
  const { toggleModule } = useApp();

  // Live queries for real statistics
  const sales = useLiveQuery(() => db.sales.toArray());
  const clients = useLiveQuery(() => db.clients.toArray());
  const repairs = useLiveQuery(() => db.repairs.where('status').notEqual('DELIVERED').toArray());
  const stockAlerts = useLiveQuery(() => db.products.filter(p => p.stock <= p.minStock).toArray());

  const totalTurnover = sales?.reduce((acc: number, s) => acc + s.total, 0) || 0;
  const clientCount = clients?.length || 0;
  const repairCount = repairs?.length || 0;
  const stockAlertCount = stockAlerts?.length || 0;


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vue d'ensemble</h2>
          <p className="text-white/40 mt-1">Bienvenue dans votre centre de contrôle intelligent.</p>
        </div>
        <div className="flex gap-3">
          <button className="neo-button flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Nouvelle Vente
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Chiffre d'Affaires" value={`${totalTurnover.toLocaleString()} F`} trend={{ value: 0, isUp: true }} icon={TrendingUp} color="primary" />
        <StatCard label="Nouveaux Clients" value={clientCount.toString()} trend={{ value: 0, isUp: true }} icon={Users} color="accent" />
        <StatCard label="Réparations en cours" value={repairCount.toString()} icon={Wrench} color="orange-400" />
        <StatCard label="Ruptures de stock" value={stockAlertCount.toString()} trend={{ value: 0, isUp: false }} icon={Package} color="red-400" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <GlassCard className="lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold">Performances Hebdomadaires</h3>
              <p className="text-sm text-white/40">Ventes cumulées par jour</p>
            </div>
            <select className="bg-white/5 border border-white/10 rounded-lg text-xs p-2 focus:outline-none">
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
            <p className="text-sm text-white/70 leading-relaxed">
              Vos ventes de <span className="text-white font-bold">Vêtements d'été</span> ont augmenté de 25% cette semaine. Pensez à réorganiser l'étalage principal.
            </p>
            <button className="mt-4 text-xs font-bold text-accent flex items-center gap-1 hover:gap-2 transition-all">
              Voir l'analyse complète <ChevronRight className="w-3 h-3" />
            </button>
          </GlassCard>

          <GlassCard>
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" /> Actions Rapides
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => toggleModule('REPAIR')}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-400/10 text-orange-400 flex items-center justify-center">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Activer Module Réparation</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
              </button>
              <button
                onClick={() => toggleModule('FASHION')}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-400/10 text-pink-400 flex items-center justify-center">
                    <Shirt className="w-4 h-4" />
                  </div>
                  <span className="text-sm">Activer Module Mode</span>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
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
