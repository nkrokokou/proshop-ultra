import Dexie, { type Table } from 'dexie';
import type { Product, Sale, Client, SpecialOrder, Recipe } from '../types';

export class SaadeeDatabase extends Dexie {
    products!: Table<Product>;
    sales!: Table<Sale>;
    clients!: Table<Client>;
    specialOrders!: Table<SpecialOrder>;
    recipes!: Table<Recipe>;

    constructor() {
        // Version 2 with a new name to force a complete clean reset and avoid stale "iPhone" data
        super('SaadeeEliteDB_V2'); 
        this.version(1).stores({
            products: 'id, name, category, barcode, createdAt',
            sales: 'id, clientId, status, createdAt, module',
            clients: 'id, name, phone, email, createdAt',
            specialOrders: 'id, clientId, status, deadline, createdAt',
            recipes: 'id, productId, lastUpdated',
        });
    }
}

export const db = new SaadeeDatabase();

export const seedDatabase = async () => {
    const productCount = await db.products.count();
    if (productCount === 0) {
        console.log('🌱 Seeding SAADEE Restaurant & Bakery Data...');
        
        // 1. Matières Premières
        await db.products.bulkAdd([
            {
                id: 'mat1',
                name: 'Farine T45 (Sac de 25kg)',
                category: 'Matières Premières',
                price: 15000,
                costPrice: 15000,
                stock: 20,
                minStock: 5,
                barcode: 'MAT-FAR-001',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                features: { unit: 'sac' }
            },
            {
                id: 'mat2',
                name: 'Beurre d\'Incorporation (1kg)',
                category: 'Matières Premières',
                price: 8500,
                costPrice: 8500,
                stock: 30,
                minStock: 10,
                barcode: 'MAT-BEU-001',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                features: { unit: 'kg' }
            },
            {
                id: 'mat3',
                name: 'Sucre de Canne (1kg)',
                category: 'Matières Premières',
                price: 1200,
                costPrice: 1200,
                stock: 50,
                minStock: 10,
                barcode: 'MAT-SUC-001',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                features: { unit: 'kg' }
            }
        ]);

        // 2. Les Pâtisseries
        await db.products.bulkAdd([
            {
                id: 'pat1',
                name: 'Croissant Pur Beurre',
                category: 'Pâtisserie',
                price: 1500,
                costPrice: 450,
                stock: 60,
                minStock: 15,
                barcode: 'SAA-CRO-001',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                features: { unit: 'piece' }
            },
            {
                id: 'pat2',
                name: 'Pain au Chocolat',
                category: 'Pâtisserie',
                price: 1700,
                costPrice: 550,
                stock: 45,
                minStock: 10,
                barcode: 'SAA-PAC-001',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                features: { unit: 'piece' }
            }
        ]);

        // 3. Restaurant (Ô My Dog! & more)
        await db.products.bulkAdd([
            {
                id: 'rest1',
                name: 'Hot Dog Moms',
                category: 'Restaurant',
                price: 3500,
                costPrice: 1500,
                stock: 0,
                minStock: 0,
                barcode: 'OMD-HD-001',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                features: { unit: 'piece' }
            },
            {
                id: 'rest2',
                name: 'Burger Villa No Bad Days',
                category: 'Restaurant',
                price: 4500,
                costPrice: 2000,
                stock: 0,
                minStock: 0,
                barcode: 'VNB-BRG-001',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                features: { unit: 'piece' }
            }
        ]);

        // 4. Client initial
        await db.clients.add({
            id: 'c1',
            name: 'Client Fidèle SAADEE',
            phone: '+228 90 00 00 00',
            email: 'fidele@saadee.tg',
            loyaltyPoints: 150,
            totalSpent: 45000,
            createdAt: Date.now()
        });

        console.log('✅ Seeding complete.');
    }
};
