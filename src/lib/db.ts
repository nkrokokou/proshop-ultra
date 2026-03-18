import Dexie, { type Table } from 'dexie';
import type { 
    Product, Sale, Client, SpecialOrder, 
    Recipe, StockMovement, AppSettings,
    SaadeLoyalty, LoyaltyCotisation, LoyaltyAgent,
    Expense, Learner, Course, Enrollment, Attendance,
    User, Role, ProductionBatch
} from '../types';
import { SAADE_MENU, RAW_MATERIALS } from '../data/saadeMenu';

export class SaadeDatabase extends Dexie {
    products!: Table<Product>;
    sales!: Table<Sale>;
    clients!: Table<Client>;
    specialOrders!: Table<SpecialOrder>;
    recipes!: Table<Recipe>;
    stockMovements!: Table<StockMovement>;
    settings!: Table<AppSettings>;
    loyalty!: Table<SaadeLoyalty>;
    loyaltyCotisations!: Table<LoyaltyCotisation>;
    loyaltyAgents!: Table<LoyaltyAgent>;
    expenses!: Table<Expense>;
    learners!: Table<Learner>;
    courses!: Table<Course>;
    enrollments!: Table<Enrollment>;
    attendance!: Table<Attendance>;
    users!: Table<User>;
    roles!: Table<Role>;
    productionBatches!: Table<ProductionBatch>;

    constructor() {
        super('SaadeDB_V5'); 
        this.version(5).stores({
            products: 'id, name, category, barcode, createdAt',
            sales: 'id, clientId, status, createdAt, module',
            clients: 'id, name, phone, email, createdAt',
            specialOrders: 'id, clientId, status, deadline, createdAt',
            recipes: 'id, productId, lastUpdated',
            stockMovements: 'id, productId, type, date',
            settings: 'id',
            loyalty: 'id, clientId, status, mode, carnetNumber',
            loyaltyCotisations: 'id, carnetId, agentId, date',
            loyaltyAgents: 'id, status',
            expenses: 'id, category, date',
            learners: 'id, status, registrationDate',
            courses: 'id, status',
            enrollments: 'id, learnerId, courseId',
            attendance: 'id, courseId, date',
            users: 'id, username, roleId',
            roles: 'id, name',
            productionBatches: 'id, recipeId, status, startDate'
        });
    }

    // Generic CRUD Helpers
    async getSpecialOrders() { return this.specialOrders.toArray(); }
    async saveSpecialOrder(order: SpecialOrder) { return this.specialOrders.put(order); }
    async deleteSpecialOrder(id: string) { return this.specialOrders.delete(id); }

    async getProducts() { return this.products.toArray(); }
    async saveProduct(p: Product) { return this.products.put(p); }
    async deleteProduct(id: string) { return this.products.delete(id); }

    async getClients() { return this.clients.toArray(); }
    async saveClient(c: Client) { return this.clients.put(c); }
    async deleteClient(id: string) { return this.clients.delete(id); }

    async getSales() { return this.sales.orderBy('createdAt').reverse().toArray(); }
    async saveSale(s: Sale) { 
        return this.transaction('rw', [this.sales, this.products, this.stockMovements], async () => {
            await this.sales.put(s);
            for (const item of s.items) {
                await this.simpleUpdateStock(item.productId, -item.quantity, `Vente ${s.id}`);
            }
        });
    }

    async getStockMovements() { return this.stockMovements.orderBy('date').reverse().toArray(); }
    async saveStockMovement(m: StockMovement) { return this.stockMovements.put(m); }

    // Loyalty / Tontine
    async getLoyalty() { return this.loyalty.toArray(); }
    async saveLoyalty(l: SaadeLoyalty) { return this.loyalty.put(l); }
    async getLoyaltyAgents() { return this.loyaltyAgents.toArray(); }
    async saveLoyaltyAgent(a: LoyaltyAgent) { return this.loyaltyAgents.put(a); }
    async getLoyaltyCotisations() { return this.loyaltyCotisations.toArray(); }
    async saveLoyaltyCotisation(c: LoyaltyCotisation) { return this.loyaltyCotisations.put(c); }

    // Training
    async getLearners() { return this.learners.toArray(); }
    async saveLearner(l: Learner) { return this.learners.put(l); }
    async getCourses() { return this.courses.toArray(); }
    async saveCourse(c: Course) { return this.courses.put(c); }
    async getEnrollments() { return this.enrollments.toArray(); }
    async saveEnrollment(e: Enrollment) { return this.enrollments.put(e); }
    async getAttendance() { return this.attendance.toArray(); }
    async saveAttendance(a: Attendance) { return this.attendance.put(a); }

    // RBAC
    async getUsers() { return this.users.toArray(); }
    async saveUser(u: User) { return this.users.put(u); }
    async getRoles() { return this.roles.toArray(); }
    async saveRole(r: Role) { return this.roles.put(r); }

    async getProductionBatches() { return this.productionBatches.orderBy('startDate').reverse().toArray(); }
    async saveProductionBatch(b: ProductionBatch) { return this.productionBatches.put(b); }

    async getExpenses() { return this.expenses.orderBy('date').reverse().toArray(); }
    async saveExpense(e: Expense) { return this.expenses.put(e); }
    async deleteExpense(id: string) { return this.expenses.delete(id); }

    async getRecipes() { return this.recipes.toArray(); }
    async saveRecipe(r: Recipe) { return this.recipes.put(r); }

    async simpleUpdateStock(productId: string, quantityChange: number, reason: string) {
        const product = await this.products.get(productId);
        if (!product) return;

        const previousStock = product.stock;
        const newStock = previousStock + quantityChange;

        await this.products.update(productId, { 
            stock: newStock,
            updatedAt: Date.now()
        });

        await this.stockMovements.add({
            id: crypto.randomUUID(),
            productId,
            productName: product.name,
            previousStock,
            newStock,
            quantity: Math.abs(quantityChange),
            type: quantityChange > 0 ? 'IN' : 'OUT',
            reason,
            agentName: 'Système',
            date: Date.now()
        } as StockMovement);
    }

    async updateStock(productId: string, quantityChange: number, movement: Omit<StockMovement, 'id' | 'productId' | 'previousStock' | 'newStock' | 'productName' | 'quantity' | 'type' | 'date'>) {
        const product = await this.products.get(productId);
        if (!product) return;

        const previousStock = product.stock;
        const newStock = previousStock + quantityChange;

        await this.products.update(productId, { 
            stock: newStock,
            updatedAt: Date.now()
        });

        await this.stockMovements.add({
            id: crypto.randomUUID(),
            productId,
            productName: product.name,
            previousStock,
            newStock,
            quantity: Math.abs(quantityChange),
            type: quantityChange > 0 ? 'IN' : 'OUT',
            date: Date.now(),
            ...movement
        } as StockMovement);
    }

    // Data Management
    async exportData() {
        const data: any = {};
        const tables = this.tables.map(t => t.name);
        for (const table of tables) {
            data[table] = await (this as any)[table].toArray();
        }
        return JSON.stringify(data, null, 2);
    }

    async importData(json: string) {
        try {
            const data = JSON.parse(json);
            return this.transaction('rw', this.tables, async () => {
                for (const table of this.tables) {
                    if (data[table.name]) {
                        await table.clear();
                        await table.bulkAdd(data[table.name]);
                    }
                }
            });
        } catch (e) {
            console.error('Import failed', e);
            throw e;
        }
    }
    // Seeding Logic
    async seedInitialData() {
        console.log('🌱 Seeding Saadé Restaurant & Bakery Data...');
        
        // Settings
        await this.settings.add({
            id: 'current',
            shopName: 'Saadé',
            shopAddress: 'Villa No Bad Days, Lomé',
            shopPhone: '+228 90 00 00 00',
            shopEmail: 'hello@saade.tg',
            currency: 'FCFA',
            taxRate: 0,
            lowStockThreshold: 5,
            enableNotifications: true,
            documents: {
                sales: { header: 'Merci de votre visite chez Saadé !', footer: 'À bientôt !' },
                production: { header: 'Fiche de Production Saadé', footer: 'Cuisine Artisanale' },
                inventory: { header: 'Inventaire Physique Saadé', footer: 'Contrôle Interne' },
                specialOrders: { header: 'Fiche Commande Spéciale Saadé', footer: 'Qualité Exceptionnelle' },
                loyalty: { header: 'Carnet de Fidélité Saadé', footer: 'Merci de votre fidélité' },
                training: { header: 'Centre de Formation Saadé', footer: 'Excellence Culinaire' }
            }
        });

        // Convert SAADE_MENU to Products
        const initialProducts: Product[] = SAADE_MENU.map(item => ({
            id: item.id,
            name: item.name,
            category: item.section,
            price: item.price,
            costPrice: item.price * 0.4,
            stock: 100,
            minStock: 10,
            barcode: item.id.toUpperCase(),
            description: item.description,
            image: item.image,
            type: 'PRODUCT',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            features: { unit: 'portion' }
        }));

        // Add raw materials
        RAW_MATERIALS.forEach(mat => {
            initialProducts.push({
                id: mat.id,
                name: mat.name,
                category: 'Matières Premières',
                price: mat.pricePerUnit,
                costPrice: mat.pricePerUnit,
                stock: 50, // Some initial stock for tests
                minStock: 5,
                barcode: mat.id.toUpperCase(),
                type: 'INGREDIENT',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                features: { unit: mat.unit }
            });
        });

        await this.products.bulkAdd(initialProducts);
        
        // Seed default roles
        await this.roles.bulkAdd([
            { id: 'role-admin', name: 'Administrateur', permissions: ['*'], isSystem: true },
            { id: 'role-manager', name: 'Gérant', permissions: ['sales.*', 'inventory.*', 'loyalty.*'], isSystem: true },
            { id: 'role-cashier', name: 'Caissier', permissions: ['sales.create', 'sales.view'], isSystem: true }
        ]);

        // Seed initial clients
        await this.clients.bulkAdd([
            { id: 'c1', name: 'Passant VIP', phone: '00000000', loyaltyPoints: 0, totalSpent: 0, createdAt: Date.now() },
            { id: 'c2', name: 'Jean Dupont', phone: '90112233', loyaltyPoints: 100, totalSpent: 50000, createdAt: Date.now() },
            { id: 'c3', name: 'Marie Koné', phone: '91556677', loyaltyPoints: 500, totalSpent: 150000, createdAt: Date.now() }
        ]);

        // Seed Mock Sales
        const now = Date.now();
        await this.sales.bulkAdd([
            { 
              id: 's1', clientId: 'c2', clientName: 'Jean Dupont', items: [{ productId: 'bg-1', name: 'Cheese Burger', quantity: 2, price: 4500, total: 9000 }], 
              subtotal: 9000, discount: 0, total: 9000, profit: 3600, paymentMethod: 'CASH', status: 'COMPLETED', 
              createdAt: now - 86400000 * 2, module: 'BAKERY' 
            },
            { 
              id: 's2', clientId: 'c3', clientName: 'Marie Koné', items: [{ productId: 'sig-1', name: 'Frapidonut', quantity: 3, price: 3500, total: 10500 }], 
              subtotal: 10500, discount: 500, total: 10000, profit: 4000, paymentMethod: 'MOBILE_MONEY', status: 'COMPLETED', 
              createdAt: now - 86400000, module: 'BAKERY' 
            },
            { 
              id: 's3', clientId: 'c1', clientName: 'Passant VIP', items: [{ productId: 'pdj-1', name: 'Omelette Nature', quantity: 1, price: 2000, total: 2000 }], 
              subtotal: 2000, discount: 0, total: 2000, profit: 800, paymentMethod: 'CASH', status: 'COMPLETED', 
              createdAt: now, module: 'BAKERY' 
            }
        ]);

        // Seed Mock Expenses
        await this.expenses.bulkAdd([
            { id: 'e1', category: 'LOYER', amount: 250000, description: 'Loyer Villa Forever - Mars', date: now - 86400000 * 5, paymentMethod: 'BANK', agentName: 'Saadé Boss' },
            { id: 'e2', category: 'SALAIRES', amount: 150000, description: 'Salaire Apprenti Chef', date: now - 86400000 * 3, paymentMethod: 'CASH', agentName: 'Saadé Boss' },
            { id: 'e3', category: 'MATIERES_PREMIERES', amount: 45000, description: 'Achat Farine T45 (50kg)', date: now, paymentMethod: 'CASH', agentName: 'Saadé Boss' }
        ]);

        // Seed Mock Special Orders
        await this.specialOrders.bulkAdd([
            { 
                id: 'ord-1', clientId: 'c3', clientName: 'Mme Lawson', clientPhone: '90223344', orderType: 'CAKE',
                description: 'Gâteau d\'anniversaire 20 parts - Thème Rose', totalPrice: 35000, deposit: 15000, 
                status: 'PENDING', deadline: now + 86400000 * 3, createdAt: now, payments: []
            },
            { 
                id: 'ord-2', clientId: 'c2', clientName: 'Alpha SARL', clientPhone: '98776655', orderType: 'EVENT',
                description: '50 Hot Dogs pour événement corporatif', totalPrice: 100000, deposit: 50000, 
                status: 'PREPARING', deadline: now + 86400000, createdAt: now, payments: []
            }
        ]);

        // Seed Mock Production Batches
        await this.productionBatches.bulkAdd([
            { id: 'pb1', recipeId: 'rec-baguette', productName: 'Baguette Tradition', plannedQuantity: 50, actualQuantity: 50, status: 'COMPLETED', startDate: now - 3600000 * 5, endDate: now - 3600000 * 4, agentId: 'admin-1' },
            { id: 'pb2', recipeId: 'rec-croissant', productName: 'Croissant Beurre', plannedQuantity: 30, actualQuantity: 0, status: 'IN_PROGRESS', startDate: now - 3600000, agentId: 'admin-1' }
        ]);

        // Seed Mock Learners & Courses
        await this.learners.bulkAdd([
            { id: 'l1', fullName: 'Koffi Mensah', phone: '92001122', registrationDate: now - 86400000 * 30, status: 'ACTIVE' },
            { id: 'l2', fullName: 'Abla Amévi', phone: '93004455', registrationDate: now - 86400000 * 15, status: 'ACTIVE' }
        ]);

        await this.courses.bulkAdd([
            { id: 'course-1', title: 'Pâtisserie Boulangère Supérieure', description: 'Maîtrise des pâtes levées et feuilletées', duration: 3, price: 150000, startDate: now - 86400000 * 10, status: 'ONGOING' },
            { id: 'course-2', title: 'Gestion de Fast-Food', description: 'Optimisation des stocks et service client', duration: 1, price: 50000, startDate: now + 86400000 * 5, status: 'OPEN' }
        ]);

        // Seed Mock Loyalty
        await this.loyaltyAgents.add({ id: 'la1', fullName: 'Agent Roger', phone: '99008877', status: 'ACTIVE', createdAt: now });
        await this.loyalty.add({ 
            id: 'carnet1', clientId: 'c3', clientName: 'Marie Koné', mode: 'TONTINE', currentAmount: 25000, 
            contributionAmount: 5000, frequency: 'WEEKLY', startDate: now - 86400000 * 40, status: 'ACTIVE', 
            isProductDelivered: false, createdAt: now - 86400000 * 40, updatedAt: now 
        });
    }
}

export const db = new SaadeDatabase();

export const resetEntireDatabase = async () => {
    try {
        await db.delete();
        window.location.reload();
    } catch (err) {
        console.error("Failed to delete database", err);
    }
};

export const seedDatabase = async () => {
    const settingsCount = await db.settings.count();
    if (settingsCount === 0) {
        await db.seedInitialData();
    }
};
