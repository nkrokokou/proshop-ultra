export type BusinessModule = 'RESTAURANT' | 'BAKERY' | 'DELIVERY';

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

    features: {
        unit: string;
        shelfLocation?: string;
        recipeId?: string;
    };
    type: 'PRODUCT' | 'INGREDIENT';
}

export interface Client {
    id: string;
    name: string;
    fullName?: string; // For consistency with other types
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
    selectedOptions?: string[];
}

export interface Sale {
    id: string;
    clientId?: string;
    clientName?: string;
    items: SaleItem[];
    subtotal: number;
    discount: number;
    total: number;
    profit: number; 
    paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'CARD' | 'CREDIT';
    status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
    createdAt: number;
    module: BusinessModule;
}

export interface RepairPayment {
    id: string;
    amount: number;
    date: number;
    method: string;
    note?: string;
}

export interface SpecialOrder {
    id: string;
    clientId: string;
    clientName: string;
    clientPhone: string;
    orderType: 'CAKE' | 'EVENT' | 'CATERING' | 'SPECIAL';
    description: string;
    status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
    totalPrice: number;
    deposit: number;
    payments: RepairPayment[];
    createdAt: number;
    deadline: number;
    dateFinished?: number;
    specifications?: {
        flavors?: string[];
        servings?: number;
        message?: string;
        design?: string;
    };
}

export interface Recipe {
    id: string;
    productId: string; 
    productName: string;
    yield: number; // Output quantity per batch
    unit: string;
    ingredients: {
        ingredientId: string; 
        ingredientName: string;
        quantity: number;
        unit: string;
    }[];
    totalCost: number;
    lastUpdated: number;
}

export interface ProductionBatch {
    id: string;
    recipeId: string;
    productName: string;
    plannedQuantity: number;
    actualQuantity?: number;
    startDate: number;
    endDate?: number;
    status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    agentId: string;
    notes?: string;
}

export interface StockMovement {
    id: string;
    productId?: string;
    productName: string;
    type: 'IN' | 'OUT';
    quantity: number;
    reason: string;
    date: number;
    agentName: string;
    previousStock: number;
    newStock: number;
    totalPrice?: number;
    costPricePerUnit?: number;
}

export interface SaadeLoyalty {
    id: string;
    clientId: string;
    clientName: string;
    agentId?: string;
    carnetNumber?: string;
    mode: 'EPARGNE' | 'ABONNEMENT' | 'TONTINE';
    targetAmount?: number;
    currentAmount: number;
    contributionAmount: number;
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    startDate: number;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    isProductDelivered: boolean;
    createdAt: number;
    updatedAt: number;
}

export interface LoyaltyCotisation {
    id: string;
    carnetId: string;
    clientId: string;
    agentId: string;
    amount: number;
    date: number;
    paymentMethod?: 'CASH' | 'MOBILE_MONEY';
    status: 'PENDING' | 'VALIDATED' | 'CANCELLED';
    createdAt: number;
}

export interface LoyaltyAgent {
    id: string;
    fullName: string;
    phone: string;
    zone?: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: number;
}

export interface Expense {
    id: string;
    category: 'LOYER' | 'SALAIRES' | 'MATIERES_PREMIERES' | 'ELECTRICITE' | 'AUTRE';
    amount: number;
    description: string;
    date: number;
    paymentMethod: 'CASH' | 'ORANGE_MONEY' | 'WAVE' | 'BANK';
    agentName: string;
}

export interface Learner {
    id: string;
    fullName: string;
    phone: string;
    whatsapp?: string;
    address?: string;
    photo?: string;
    registrationDate: number;
    status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED';
}

export interface Course {
    id: string;
    title: string;
    description: string;
    duration: number; // in months or weeks
    price: number;
    startDate: number;
    status: 'OPEN' | 'CLOSED' | 'ONGOING';
}

export interface Enrollment {
    id: string;
    learnerId: string;
    courseId: string;
    enrollmentDate: number;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    totalFee: number;
    paidAmount: number;
    payments: {
        id: string;
        amount: number;
        date: number;
        method: string;
        collector: string;
    }[];
}

export interface Attendance {
    id: string;
    courseId: string;
    date: number;
    records: {
        learnerId: string;
        status: 'PRESENT' | 'ABSENT' | 'LATE';
        arrivalTime?: string;
        departureTime?: string;
        note?: string;
    }[];
}

export interface User {
    id: string;
    username: string;
    password?: string; // Hashed/Encrypted in a real app
    fullName: string;
    roleId: string;
    status: 'ACTIVE' | 'INACTIVE';
    lastLogin?: number;
}

export interface Role {
    id: string;
    name: string;
    permissions: string[];
    isSystem: boolean;
}

export interface DocumentConfig {
    logo?: string;
    header?: string;
    footer?: string;
    shopName?: string;
    address?: string;
    email?: string;
    legalText?: string;
}

export interface AppSettings {
    id: string;
    shopName: string;
    shopAddress: string;
    shopPhone: string;
    shopEmail: string;
    currency: string;
    taxRate: number;
    lowStockThreshold: number;
    enableNotifications: boolean;
    documents: {
        sales: DocumentConfig;
        production: DocumentConfig;
        inventory: DocumentConfig;
        specialOrders: DocumentConfig;
        loyalty: DocumentConfig;
        training: DocumentConfig;
    };
}
