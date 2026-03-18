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
        console.log('Seeding initial SAADEE data...');
        await db.products.bulkAdd([
            {
                id: 'p1',
                name: 'Farine T45 (Sac de 25kg)',
                category: 'Matières Premières',
                price: 12500,
                costPrice: 12500,
                stock: 10,
                minStock: 2,
                barcode: 'MAT-FAR-001',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                features: {
                    unit: 'sac'
                }
            },
            {
                id: 'p2',
                name: 'Beurre Gastronomique (Plat 1kg)',
                category: 'Matières Premières',
                price: 7500,
                costPrice: 7500,
                stock: 15,
                minStock: 5,
                barcode: 'MAT-BEU-001',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                features: {
                    unit: 'kg'
                }
            },
            {
                id: 'p3',
                name: 'Hot Dog Moms',
                category: 'Produits Finis',
                price: 3000,
                costPrice: 1200,
                stock: 0, // Stock non suivi car préparé à la commande
                minStock: 0,
                barcode: 'OMD-HD-001',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                features: {
                    unit: 'piece'
                }
            },
            {
                id: 'p4',
                name: 'Croissant Beurre',
                category: 'Pâtisserie',
                price: 1500,
                costPrice: 450,
                stock: 40,
                minStock: 10,
                barcode: 'SAA-PAT-001',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                features: {
                    unit: 'piece'
                }
            }
        ]);
    }
};

