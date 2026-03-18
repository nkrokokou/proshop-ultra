import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type BusinessModule = 'RESTAURANT' | 'BAKERY' | 'DELIVERY' | 'GENERAL_RETAIL';

interface AppState {
    activeModules: BusinessModule[];
    shopName: string;
    isDarkMode: boolean;
}

interface AppContextType {
    state: AppState;
    toggleModule: (module: BusinessModule) => void;
    setShopName: (name: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'saade-state';

const loadState = (): AppState => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load state', e);
        }
    }
    return {
        activeModules: ['RESTAURANT', 'BAKERY'],
        shopName: 'Saadé',
        isDarkMode: true,
    };
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AppState>(loadState());

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const toggleModule = (module: BusinessModule) => {
        setState(prev => ({
            ...prev,
            activeModules: prev.activeModules.includes(module)
                ? prev.activeModules.filter(m => m !== module)
                : [...prev.activeModules, module]
        }));
    };

    const setShopName = (name: string) => {
        setState(prev => ({ ...prev, shopName: name }));
    };

    return (
        <AppContext.Provider value={{ state, toggleModule, setShopName }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within an AppProvider');
    return context;
};
