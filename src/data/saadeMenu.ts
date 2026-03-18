export interface SaadeItem {
  id: string;
  name: string;
  price: number;
  category: string;
  section: string;
  printer: 'KITCHEN' | 'BAR';
  description?: string;
  image?: string;
}

const IMG_BASE = 'C:/Users/nkro0/.gemini/antigravity/scratch/saadé/';

export const SAADE_MENU: SaadeItem[] = [
  // PTIT DEJ
  { 
    id: 'pdj-1', name: 'Omelette Nature', price: 2000, category: 'Ô My Dog', section: 'Ptit Dej', printer: 'KITCHEN',
    description: 'Une omelette classique et onctueuse, préparée avec des œufs frais.',
    image: `${IMG_BASE}WhatsApp Image 2026-03-18 at 09.52.03.jpeg`
  },
  { 
    id: 'pdj-2', name: 'Omelette Cheese', price: 2500, category: 'Ô My Dog', section: 'Ptit Dej', printer: 'KITCHEN',
    description: 'Omelette gourmande avec un cœur fondant de fromage.',
    image: `${IMG_BASE}WhatsApp Image 2026-03-18 at 09.52.03 (1).jpeg`
  },
  { 
    id: 'pdj-3', name: 'Omelette du Chef', price: 3000, category: 'Ô My Dog', section: 'Ptit Dej', printer: 'KITCHEN',
    description: 'La spécialité du chef : une explosion de saveurs matinales.',
    image: `${IMG_BASE}WhatsApp Image 2026-03-18 at 09.52.03 (2).jpeg`
  },

  // PANCAKES / CREPES
  { 
    id: 'pan-1', name: 'Pancake Caramel/Nutella', price: 4000, category: 'Ô My Dog', section: 'Sucré', printer: 'KITCHEN',
    description: 'Pancakes moelleux nappés de caramel onctueux ou de Nutella.',
    image: `${IMG_BASE}WhatsApp Image 2026-03-18 at 09.52.04.jpeg`
  },
  { 
    id: 'cre-1', name: 'Crêpe Sucre/Nutella', price: 4000, category: 'Ô My Dog', section: 'Sucré', printer: 'KITCHEN',
    description: 'Crêpes fines et légères pour un moment de douceur.',
    image: `${IMG_BASE}WhatsApp Image 2026-03-18 at 09.52.04 (1).jpeg`
  },

  // HOT DOGS
  { 
    id: 'hd-1', name: 'Hot Dog Classique', price: 2000, category: 'Ô My Dog', section: 'Hot Dogs', printer: 'KITCHEN',
    description: 'Pain brioché, saucisse premium et sauces traditionnelles.',
    image: `${IMG_BASE}WhatsApp Image 2026-03-18 at 09.52.05.jpeg`
  },
  { 
    id: 'hd-2', name: 'Hot Dog Moms', price: 3000, category: 'Ô My Dog', section: 'Hot Dogs', printer: 'KITCHEN',
    description: 'Le goût réconfortant du hot dog fait maison.',
    image: `${IMG_BASE}WhatsApp Image 2026-03-18 at 09.52.05 (1).jpeg`
  },

  // BURGERS
  { 
    id: 'bg-1', name: 'Cheese Burger', price: 4500, category: 'Ô My Dog', section: 'Burgers', printer: 'KITCHEN',
    description: 'Steak juteux, cheddar fondu et oignons caramélisés.',
    image: `${IMG_BASE}WhatsApp Image 2026-03-18 at 09.52.06.jpeg`
  },
  { 
    id: 'bg-2', name: 'Chicken Burger', price: 4500, category: 'Ô My Dog', section: 'Burgers', printer: 'KITCHEN',
    description: 'Poulet croustillant et sauce secrète Saadé.',
    image: `${IMG_BASE}WhatsApp Image 2026-03-18 at 09.52.06 (1).jpeg`
  },

  // DOGELS / PIZZA
  { 
    id: 'dg-1', name: 'Dogel (Donut Salé)', price: 3000, category: 'Ô My Dog', section: 'Dogels', printer: 'KITCHEN',
    description: 'Une fusion unique entre un donut et un snack salé.',
    image: `${IMG_BASE}WhatsApp Image 2026-03-18 at 09.52.06 (2).jpeg`
  },
  { 
    id: 'pz-1', name: 'Pizza Individuelle', price: 3000, category: 'Ô My Dog', section: 'Pizzas', printer: 'KITCHEN',
    description: 'Pizza artisanale aux herbes de Provence.',
    image: `${IMG_BASE}WhatsApp Image 2026-03-18 at 09.52.07.jpeg`
  },

  // BOISSONS
  { 
    id: 'bc-1', name: 'Espresso / Allongé', price: 1500, category: 'Boissons', section: 'Chaudes', printer: 'BAR',
    image: `${IMG_BASE}WhatsApp Image 2026-03-18 at 09.52.09.jpeg`
  },
  { 
    id: 'sig-1', name: 'Frapidonut', price: 3500, category: 'Boissons', section: 'Signatures', printer: 'BAR',
    description: 'Le mariage parfait entre un frappé et un donut fondant.',
    image: `${IMG_BASE}WhatsApp Image 2026-03-18 at 09.52.03.jpeg` // Duplicate image for sign
  },
];

export const RAW_MATERIALS = [
  { id: 'mat-1', name: 'Farine T45', unit: 'kg', pricePerUnit: 800 },
  { id: 'mat-2', name: 'Beurre Gastronomique', unit: 'kg', pricePerUnit: 7500 },
  { id: 'mat-3', name: 'Sucre', unit: 'kg', pricePerUnit: 650 },
  { id: 'mat-4', name: 'Oeuf', unit: 'unité', pricePerUnit: 100 },
  { id: 'mat-5', name: 'Chocolat Noir', unit: 'kg', pricePerUnit: 12000 },
];
