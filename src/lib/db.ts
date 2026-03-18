import Dexie, { type Table } from 'dexie';
import type { Product, Sale, Client, Repair, FashionOrder } from '../types';


export class ProShopDatabase extends Dexie {
    products!: Table<Product>;
    sales!: Table<Sale>;
    clients!: Table<Client>;
    repairs!: Table<Repair>;
    fashionOrders!: Table<FashionOrder>;

    constructor() {
        super('ProShopUltraDB');
        this.version(1).stores({
            products: 'id, name, category, barcode, createdAt',
            sales: 'id, clientId, status, createdAt, module',
            clients: 'id, name, phone, email, createdAt',
            repairs: 'id, clientId, status, imei, createdAt',
            fashionOrders: 'id, clientId, status, type, createdAt',
        });
    }
}

export const db = new ProShopDatabase();

// Helper to seed initial data if needed
export const seedDatabase = async () => {
    const productCount = await db.products.count();
    if (productCount === 0) {
        console.log('Seeding initial data...');
        await db.products.bulkAdd([
            {
                id: 'p1',
                name: 'iPhone 15 Pro',
                category: 'Téléphonie',
                price: 850000,
                costPrice: 750000,
                stock: 12,
                minStock: 5,
                barcode: '123456789',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                features: {
                    imeis: ['IMEI001', 'IMEI002'],
                    unit: 'piece'
                }
            },
            {
                id: 'p2',
                name: 'T-Shirt Premium',
                category: 'Mode',
                price: 18500,
                costPrice: 8000,
                stock: 25,
                minStock: 10,
                barcode: '987654321',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                features: {
                    sizes: ['M', 'L', 'XL'],
                    colors: ['Noir', 'Bleu'],
                    unit: 'piece'
                }
            },
            {
                id: 'p3',
                name: 'Chargeur Ultra-Fast',
                category: 'Accessoires',
                price: 15000,
                costPrice: 5000,
                stock: 50,
                minStock: 15,
                barcode: '456123789',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                features: {
                    unit: 'piece'
                }
            }
        ]);
    }
};

