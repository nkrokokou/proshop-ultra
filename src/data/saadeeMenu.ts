export interface SaadeeItem {
  id: string;
  name: string;
  price: number;
  category: string;
  section: string;
  printer: 'KITCHEN' | 'BAR';
}

export const SAADEE_MENU: SaadeeItem[] = [
  // PTIT DEJ
  { id: 'pdj-1', name: 'Omelette Nature', price: 2000, category: 'Ô My Dog', section: 'Ptit Dej', printer: 'KITCHEN' },
  { id: 'pdj-2', name: 'Omelette Cheese', price: 2500, category: 'Ô My Dog', section: 'Ptit Dej', printer: 'KITCHEN' },
  { id: 'pdj-3', name: 'Omelette du Chef', price: 3000, category: 'Ô My Dog', section: 'Ptit Dej', printer: 'KITCHEN' },
  { id: 'pdj-4', name: 'Hot Omelette', price: 3500, category: 'Ô My Dog', section: 'Ptit Dej', printer: 'KITCHEN' },
  { id: 'pdj-5', name: 'Halloumi Toast', price: 5500, category: 'Ô My Dog', section: 'Ptit Dej', printer: 'KITCHEN' },
  { id: 'f-exp', name: 'Formule Express', price: 3500, category: 'Ô My Dog', section: 'Formules', printer: 'BAR' },

  // PANCAKES / CREPES
  { id: 'pan-1', name: 'Pancake Caramel/Nutella', price: 4000, category: 'Ô My Dog', section: 'Sucré', printer: 'KITCHEN' },
  { id: 'cre-1', name: 'Crêpe Sucre/Nutella', price: 4000, category: 'Ô My Dog', section: 'Sucré', printer: 'KITCHEN' },
  { id: 'f-gout', name: 'Formule Goûter', price: 4000, category: 'Ô My Dog', section: 'Formules', printer: 'BAR' },

  // HOT DOGS
  { id: 'hd-1', name: 'Hot Dog Classique', price: 2000, category: 'Ô My Dog', section: 'Hot Dogs', printer: 'KITCHEN' },
  { id: 'hd-2', name: 'Hot Dog Moms', price: 3000, category: 'Ô My Dog', section: 'Hot Dogs', printer: 'KITCHEN' },
  { id: 'hd-3', name: 'Hot Dog Cheesy Moms', price: 3500, category: 'Ô My Dog', section: 'Hot Dogs', printer: 'KITCHEN' },
  { id: 'hd-4', name: 'Hot Dog Spicy', price: 3500, category: 'Ô My Dog', section: 'Hot Dogs', printer: 'KITCHEN' },
  { id: 'hd-5', name: 'Hot Dog Mama', price: 3500, category: 'Ô My Dog', section: 'Hot Dogs', printer: 'KITCHEN' },
  { id: 'hd-6', name: 'Hot Dog Locos', price: 3500, category: 'Ô My Dog', section: 'Hot Dogs', printer: 'KITCHEN' },
  { id: 'f-snack', name: 'Formule Snack', price: 5000, category: 'Ô My Dog', section: 'Formules', printer: 'KITCHEN' },

  // BURGERS
  { id: 'bg-1', name: 'Cheese Burger', price: 4500, category: 'Ô My Dog', section: 'Burgers', printer: 'KITCHEN' },
  { id: 'bg-2', name: 'Chicken Burger', price: 4500, category: 'Ô My Dog', section: 'Burgers', printer: 'KITCHEN' },
  { id: 'bg-3', name: 'Burger Crea', price: 5000, category: 'Ô My Dog', section: 'Burgers', printer: 'KITCHEN' },
  { id: 'f-burger', name: 'Formule Burger', price: 6000, category: 'Ô My Dog', section: 'Formules', printer: 'KITCHEN' },

  // DOGELS / PIZZA
  { id: 'dg-1', name: 'Dogel (Donut Salé)', price: 3000, category: 'Ô My Dog', section: 'Dogels', printer: 'KITCHEN' },
  { id: 'pz-1', name: 'Pizza Individuelle', price: 3000, category: 'Ô My Dog', section: 'Pizzas', printer: 'KITCHEN' },

  // FRITES
  { id: 'fr-1', name: 'Frites Portions', price: 1500, category: 'Ô My Dog', section: 'Accompagnement', printer: 'KITCHEN' },
  { id: 'fr-2', name: 'Frites Cheddar', price: 2000, category: 'Ô My Dog', section: 'Accompagnement', printer: 'KITCHEN' },

  // BOISSONS CHAUDES
  { id: 'bc-1', name: 'Espresso / Allongé', price: 1500, category: 'Boissons', section: 'Chaudes', printer: 'BAR' },
  { id: 'bc-2', name: 'Cappuccino', price: 2000, category: 'Boissons', section: 'Chaudes', printer: 'BAR' },
  { id: 'bc-3', name: 'Choco Chaud Maison', price: 3000, category: 'Boissons', section: 'Chaudes', printer: 'BAR' },
  { id: 'bc-4', name: 'Thé', price: 2000, category: 'Boissons', section: 'Chaudes', printer: 'BAR' },

  // BOISSONS FRAICHES
  { id: 'bf-1', name: 'Eau Plate', price: 500, category: 'Boissons', section: 'Fraîches', printer: 'BAR' },
  { id: 'bf-2', name: 'Soft (Coca/Youki)', price: 1500, category: 'Boissons', section: 'Fraîches', printer: 'BAR' },
  { id: 'bf-3', name: 'Red Bull', price: 2000, category: 'Boissons', section: 'Fraîches', printer: 'BAR' },
  { id: 'bf-4', name: 'Jus Hugs', price: 2000, category: 'Boissons', section: 'Fraîches', printer: 'BAR' },
  { id: 'bf-5', name: 'Limonade Maison', price: 2000, category: 'Boissons', section: 'Fraîches', printer: 'BAR' },

  // SIGNATURES
  { id: 'sig-1', name: 'Frapidonut', price: 3500, category: 'Boissons', section: 'Signatures', printer: 'BAR' },
  { id: 'sig-2', name: 'Milkydonut', price: 3500, category: 'Boissons', section: 'Signatures', printer: 'BAR' },

  // ENFANT
  { id: 'enf-1', name: 'Menu Special Enfant', price: 5000, category: 'Ô My Dog', section: 'Formules', printer: 'KITCHEN' },
];

export const RAW_MATERIALS = [
  { id: 'mat-1', name: 'Farine T45', unit: 'kg', pricePerUnit: 800 },
  { id: 'mat-2', name: 'Beurre Gastronomique', unit: 'kg', pricePerUnit: 7500 },
  { id: 'mat-3', name: 'Sucre', unit: 'kg', pricePerUnit: 650 },
  { id: 'mat-4', name: 'Oeuf', unit: 'unité', pricePerUnit: 100 },
  { id: 'mat-5', name: 'Chocolat Noir', unit: 'kg', pricePerUnit: 12000 },
];
