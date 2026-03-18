import { db } from '../db';
import type { Product } from '../../types';
import { v4 as uuidv4 } from 'uuid';


export const ProductService = {
    async getAll() {
        return await db.products.toArray();
    },

    async getByCategory(category: string) {
        return await db.products.where('category').equals(category).toArray();
    },

    async add(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
        const newProduct: Product = {
            ...product,
            id: uuidv4(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        return await db.products.add(newProduct);
    },

    async update(id: string, updates: Partial<Product>) {
        return await db.products.update(id, {
            ...updates,
            updatedAt: Date.now(),
        });
    },

    async delete(id: string) {
        return await db.products.delete(id);
    },

    async addImei(productId: string, imei: string) {
        const product = await db.products.get(productId);
        if (product) {
            const imeis = product.features.imeis || [];
            if (!imeis.includes(imei)) {
                await db.products.update(productId, {
                    'features.imeis': [...imeis, imei],
                    updatedAt: Date.now(),
                });
            }
        }
    },

    async updateStock(id: string, newStock: number) {
        return await db.products.update(id, {
            stock: newStock,
            updatedAt: Date.now(),
        });
    }
};
