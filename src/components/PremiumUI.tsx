import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hover = true, ...props }) => (
    <motion.div
        whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
        className={`glass-panel p-6 overflow-hidden relative group ${className}`}
        {...(props as any)}
    >
        {/* Animated background glow on hover */}
        {hover && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
        <div className="relative z-10">
            {children}
        </div>
    </motion.div>
);

interface StatCardProps {
    label: string;
    value: string | number;
    trend?: {
        value: number;
        isUp: boolean;
    };
    icon: any;
    color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, trend, icon: Icon, color = 'primary' }) => (
    <GlassCard>
        <div className="flex justify-between items-start">
            <div>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</p>
                <h3 className="text-2xl font-black text-primary">{value}</h3>
                {trend && (
                    <div className={`flex items-center gap-1 mt-2 text-[10px] font-bold ${trend.isUp ? 'text-green-600' : 'text-red-500'}`}>
                        <span>{trend.isUp ? '↑' : '↓'}</span>
                        <span>{Math.abs(trend.value)}%</span>
                        <span className="text-zinc-300 ml-1">vs mois dernier</span>
                    </div>
                )}
            </div>
            <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </GlassCard>
);
