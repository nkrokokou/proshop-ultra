import React from 'react';
import { motion } from 'framer-motion';

interface ChartBarProps {
    height: string;
    label: string;
    delay?: number;
}

const ChartBar: React.FC<ChartBarProps> = ({ height, label, delay = 0 }) => (
    <div className="flex flex-col items-center gap-2 flex-1 group">
        <div className="w-full bg-white/5 rounded-t-lg relative flex items-end h-32 overflow-hidden">
            <motion.div
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{ delay, duration: 1, ease: "easeOut" }}
                className="w-full bg-gradient-to-t from-primary/80 to-primary rounded-t-lg group-hover:from-accent/80 group-hover:to-accent transition-all duration-500"
            />
        </div>
        <span className="text-[10px] text-white/30 truncate w-full text-center">{label}</span>
    </div>
);

export const MiniChart: React.FC = () => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const values = ['40%', '65%', '45%', '90%', '55%', '85%', '70%'];

    return (
        <div className="flex items-end gap-2 h-40 pt-4">
            {days.map((day, i) => (
                <ChartBar key={day} label={day} height={values[i]} delay={i * 0.1} />
            ))}
        </div>
    );
};
