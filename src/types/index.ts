export type BusinessModule = 'REPAIR' | 'FASHION' | 'HARDWARE' | 'GENERAL_RETAIL';

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    costPrice: number;
    stock: number;
    minStock: number;
    barcode?: string;
    description?: string;
    image?: string;
    createdAt: number;
    updatedAt: number;

    // Dynamic features based on active modules
    features: {
        imeis?: string[];        // REPAIR
        sizes?: string[];        // FASHION
        colors?: string[];       // FASHION
        brand?: string;          // GENERAL
        model?: string;          // GENERAL
        weight?: number;         // HARDWARE
        unit: 'piece' | 'kg' | 'm' | 'l' | 'pack';
        shelfLocation?: string;
    };
}

export interface Client {
    id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    loyaltyPoints: number;
    totalSpent: number;
    createdAt: number;
}

export interface SaleItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
    // Specific attributes captured at sale time
    selectedImeis?: string[];
    selectedSize?: string;
    selectedColor?: string;
}

export interface Sale {
    id: string;
    clientId?: string;
    items: SaleItem[];
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'CARD' | 'CREDIT';
    status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
    createdAt: number;
    module: BusinessModule; // Which module initiated the sale
}

export interface Repair {
    id: string;
    clientId: string;
    deviceName: string;
    imei?: string;
    problem: string;
    solution?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED';
    cost: number;
    price: number;
    deposit: number;
    spareParts: string[];
    unlockCode?: string; // Pattern or PIN
    createdAt: number;
    deadline?: number;
}

export interface FashionOrder {
    id: string;
    clientId: string;
    type: 'RETOUCHE' | 'CONFECTION';
    description: string;
    measurements?: {
        [key: string]: string; // e.g., "Epaule": "45cm"
    };
    status: 'PENDING' | 'CUTTING' | 'SEWING' | 'READY' | 'DELIVERED';
    price: number;
    deposit: number;
    createdAt: number;
    deadline?: number;
}

