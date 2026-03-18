import { db } from './db';
import { Product, Client } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const migrationService = {
    /**
     * Import products from the legacy Phone Shop Manager
     */
    importFromPhoneShop: async (data: any[]) => {
        const products: Product[] = data.map(item => ({
            id: uuidv4(),
            name: item.name || item.designation || 'Sans nom',
            category: 'Téléphonie',
            price: item.price || item.prix_vente || 0,
            costPrice: item.costPrice || item.prix_achat || 0,
            stock: item.stock || 0,
            minStock: item.minStock || 5,
            barcode: item.barcode || '',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            features: {
                imeis: item.imeis || [],
                unit: 'piece'
            }
        }));
        return await db.products.bulkAdd(products);
    },

    /**
     * Import products from the legacy Fashion Shop Manager
     */
    importFromFashionShop: async (data: any[]) => {
        const products: Product[] = data.map(item => ({
            id: uuidv4(),
            name: item.name || 'Article Mode',
            category: item.category || 'Vêtement',
            price: item.price || 0,
            costPrice: item.costPrice || 0,
            stock: item.stock || 0,
            minStock: item.minStock || 2,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            features: {
                sizes: item.sizes || [],
                colors: item.colors || [],
                unit: 'piece'
            }
        }));
        return await db.products.bulkAdd(products);
    }
};
