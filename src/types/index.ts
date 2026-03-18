export type BusinessModule = 'RESTAURANT' | 'BAKERY' | 'DELIVERY';

export interface Product {
    id: string;
    name: string;
    category: 'Matières Premières' | 'Pâtisserie' | 'Restaurant' | 'Boissons';
    price: number;
    costPrice: number;
    stock: number;
    minStock: number;
    barcode?: string;
    description?: string;
    image?: string;
    createdAt: number;
    updatedAt: number;

    features: {
        unit: 'piece' | 'kg' | 'g' | 'l' | 'ml' | 'sac' | 'bout' | 'paquet';
        shelfLocation?: string;
        recipeId?: string; // Link to a recipe for cost calculation
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
    selectedOptions?: string[]; // e.g., "Sans oignons", "Bien cuit"
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
    module: BusinessModule;
}

export interface SpecialOrder {
    id: string;
    clientId: string;
    orderType: 'CAKE' | 'EVENT' | 'CATERING';
    description: string;
    status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED';
    totalPrice: number;
    deposit: number;
    createdAt: number;
    deadline: number; // For cakes, the pickup date
    specifications?: {
        flavors?: string[];
        servings?: number;
        message?: string;
    };
}

export interface Recipe {
    id: string;
    productId: string; // The product this recipe makes (e.g., Croissant)
    ingredients: {
        ingredientId: string; // Product of category 'Matières Premières'
        quantity: number;
        unit: string;
    }[];
    totalCost: number;
    lastUpdated: number;
}
