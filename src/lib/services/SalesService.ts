import { db } from '../db';
import type { Sale, SaleItem, BusinessModule } from '../../types';
import { v4 as uuidv4 } from 'uuid';


export const SalesService = {
    async getAll() {
        return await db.sales.toArray();
    },

    async finalizeSale(
        items: SaleItem[],
        paymentMethod: Sale['paymentMethod'],
        module: BusinessModule,
        clientId?: string
    ) {
        const subtotal = items.reduce((acc, item) => acc + item.total, 0);
        const total = subtotal; // For now no discount logic

        const sale: Sale = {
            id: uuidv4(),
            clientId,
            items,
            subtotal,
            discount: 0,
            total,
            paymentMethod,
            status: 'COMPLETED',
            createdAt: Date.now(),
            module,
        };

        // 1. Transaction to ensure data integrity
        return await db.transaction('rw', [db.sales, db.products], async () => {
            // 2. Add Sale record
            await db.sales.add(sale);

            // 3. Decrement Stock for each item
            for (const item of items) {
                const product = await db.products.get(item.productId);
                if (product) {
                    await db.products.update(item.productId, {
                        stock: product.stock - item.quantity,
                        updatedAt: Date.now()
                    });
                }
            }

            return sale;
        });
    }
};
