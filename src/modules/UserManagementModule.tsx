import React, { useState, useEffect } from "react";
import type { User, Role } from "../types";
import { db } from "../lib/db";
import { 
  Shield, Edit2, Trash2,
  Lock, Key, UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "../components/PremiumUI";

export const UserManagementModule: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [uData, rData] = await Promise.all([
            db.getUsers(),
            db.getRoles()
        ]);
        setUsers(uData);
        setRoles(rData);
    };

    const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        
        const user: User = {
            id: selectedUser?.id || `USR-${Date.now()}`,
            username: fd.get('username') as string,
            fullName: fd.get('fullName') as string,
            roleId: fd.get('roleId') as string,
            status: 'ACTIVE',
            lastLogin: selectedUser?.lastLogin
        };

        await db.saveUser(user);
        setShowUserModal(false);
        setSelectedUser(null);
        loadData();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-primary uppercase italic">Sécurité Saadé</h2>
                    <p className="text-zinc-500 font-medium mt-1">Gestion des comptes, privilèges et sécurité du moteur Saadé.</p>
                </div>
                <button 
                    onClick={() => { setSelectedUser(null); setShowUserModal(true); }}
                    className="neo-button flex items-center gap-2"
                >
                    <UserPlus className="w-4 h-4" /> Nouvel Utilisateur
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <GlassCard className="p-6 bg-zinc-950 text-white border-none shadow-2xl">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Staff</p>
                    <h3 className="text-3xl font-black text-primary tracking-tighter">{users.length}</h3>
                    <div className="flex gap-1 mt-4">
                         {roles.map(r => (
                             <span key={r.id} className="w-2 h-2 rounded-full bg-primary/40" />
                         ))}
                    </div>
                </GlassCard>
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassCard className="p-6 border-none shadow-xl shadow-zinc-100 flex items-center justify-between">
                         <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Roles Définis</p>
                            <h3 className="text-2xl font-black text-zinc-800">{roles.length}</h3>
                         </div>
                         <Shield className="w-8 h-8 text-zinc-100" />
                    </GlassCard>
                    <GlassCard className="p-6 border-none bg-zinc-50/50 flex items-center justify-between">
                         <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Derniere Connexion</p>
                            <h3 className="text-sm font-black text-zinc-800">Il y a 2 min</h3>
                         </div>
                         <Key className="w-8 h-8 text-zinc-100" />
                    </GlassCard>
                    <GlassCard className="p-6 border-none bg-zinc-50/50 flex items-center justify-between">
                         <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Accès Sécurisés</p>
                            <h3 className="text-2xl font-black text-green-500">SSL v3</h3>
                         </div>
                         <Lock className="w-8 h-8 text-green-100" />
                    </GlassCard>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <GlassCard className="p-0 overflow-hidden border-none shadow-xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-zinc-100 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                                <th className="px-8 py-6">ID / Utilisateur</th>
                                <th className="px-8 py-6">Role</th>
                                <th className="px-8 py-6">Statut</th>
                                <th className="px-8 py-6">Activité</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {users.map(user => {
                                const role = roles.find(r => r.id === user.roleId);
                                return (
                                    <tr key={user.id} className="group hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center font-black text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all capitalize">
                                                    {user.username.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-zinc-800 mb-0.5">{user.fullName}</p>
                                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">@{user.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-primary/5 text-primary border border-primary/10 rounded-lg text-[9px] font-bold uppercase tracking-widest">
                                                {role?.name || 'Inconnu'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-wider">{user.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-[10px] font-bold text-zinc-400 italic">
                                                {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Jamais connecté'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => { setSelectedUser(user); setShowUserModal(true); }}
                                                    className="p-2 bg-white border border-zinc-200 text-zinc-400 rounded-lg hover:text-primary transition-colors"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button className="p-2 bg-white border border-zinc-200 text-zinc-400 rounded-lg hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </GlassCard>
            </div>

            {/* User Modal */}
            <AnimatePresence>
                {showUserModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUserModal(false)} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="relative bg-white w-full max-w-sm rounded-[3rem] p-12 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
                            <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter text-zinc-800">Compte Utilisateur</h3>
                            <form onSubmit={handleSaveUser} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2 ml-2">Nom Complet</label>
                                    <input name="fullName" defaultValue={selectedUser?.fullName} required className="w-full p-4 bg-zinc-100 border-none rounded-2xl font-bold text-xs" placeholder="Ex: Jean Paul" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2 ml-2">Identifiant (Username)</label>
                                    <input name="username" defaultValue={selectedUser?.username} required className="w-full p-4 bg-zinc-100 border-none rounded-2xl font-bold text-xs" placeholder="Ex: paul228" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2 ml-2">Rôle Attribué</label>
                                    <select name="roleId" defaultValue={selectedUser?.roleId} className="w-full p-4 bg-zinc-100 border-none rounded-2xl font-bold text-xs">
                                        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                </div>
                                <button type="submit" className="w-full py-5 bg-zinc-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-zinc-950/20 mt-4 transition-transform active:scale-95">
                                    Enregistrer l'accès
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
