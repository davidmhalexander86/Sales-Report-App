import { SaleItem } from '../types/sales';

export const BOTANICAL_SAMPLE_SALES: SaleItem[] = [
  // October 2026 Sales ($8,154.50 total)
  {
    id: 's-101',
    product: 'Bamboo Fiber Tumbler (500ml)',
    cost: 24.50,
    quantitySold: 48,
    category: 'Drinkware',
    date: '2026-10-04',
    notes: 'Eco-line corporate order'
  },
  {
    id: 's-102',
    product: 'Cold-Pressed Jojoba Oil (100ml)',
    cost: 18.00,
    quantitySold: 62,
    category: 'Skincare',
    date: '2026-10-07',
    notes: 'Seasonal replenishment'
  },
  {
    id: 's-103',
    product: 'Ceremonial Matcha Green Tea',
    cost: 32.00,
    quantitySold: 45,
    category: 'Beverages',
    date: '2026-10-11',
    notes: 'Spring harvest grade A'
  },
  {
    id: 's-104',
    product: 'Natural Linen Market Tote',
    cost: 15.00,
    quantitySold: 80,
    category: 'Accessories',
    date: '2026-10-14',
    notes: 'Farmer market best seller'
  },
  {
    id: 's-105',
    product: 'Cedarwood & Sage Soy Candle',
    cost: 22.00,
    quantitySold: 54,
    category: 'Home & Living',
    date: '2026-10-18',
    notes: 'Hand-poured artisan batch'
  },
  {
    id: 's-106',
    product: 'Stainless Steel Reusable Straw Set',
    cost: 9.50,
    quantitySold: 90,
    category: 'Drinkware',
    date: '2026-10-21',
    notes: 'Checkout add-on'
  },
  {
    id: 's-107',
    product: 'Organic Lavender Essential Oil',
    cost: 16.50,
    quantitySold: 52,
    category: 'Skincare',
    date: '2026-10-25',
    notes: 'French highland certified'
  },

  // November 2026 Sales ($9,726.50 total -> +19.3% month-over-month growth)
  {
    id: 's-108',
    product: 'Bamboo Fiber Tumbler (500ml)',
    cost: 24.50,
    quantitySold: 85,
    category: 'Drinkware',
    date: '2026-11-01',
    notes: 'Holiday gift pre-orders'
  },
  {
    id: 's-109',
    product: 'Ceremonial Matcha Green Tea',
    cost: 32.00,
    quantitySold: 75,
    category: 'Beverages',
    date: '2026-11-01',
    notes: 'Subscription box shipment'
  },
  {
    id: 's-110',
    product: 'Recycled Hemp Journal (A5)',
    cost: 14.00,
    quantitySold: 110,
    category: 'Stationery',
    date: '2026-11-02',
    notes: 'Unbleached acid-free pages'
  },
  {
    id: 's-111',
    product: 'Cold-Pressed Jojoba Oil (100ml)',
    cost: 18.00,
    quantitySold: 90,
    category: 'Skincare',
    date: '2026-11-02',
    notes: 'Wholesale salon shipment'
  },
  {
    id: 's-112',
    product: 'Cedarwood & Sage Soy Candle',
    cost: 22.00,
    quantitySold: 72,
    category: 'Home & Living',
    date: '2026-11-02',
    notes: 'Winter catalog launch'
  },
  {
    id: 's-113',
    product: 'Natural Linen Market Tote',
    cost: 15.00,
    quantitySold: 32,
    category: 'Accessories',
    date: '2026-11-02',
  }
];

// Tech dataset: demonstrates a decline scenario (-18.2% decline in October vs September)
export const TECH_SAMPLE_SALES: SaleItem[] = [
  // September 2026 ($12,480.00 total)
  {
    id: 't-201',
    product: 'Ergonomic Vertical Mouse',
    cost: 45.00,
    quantitySold: 55,
    category: 'Peripherals',
    date: '2026-09-12',
  },
  {
    id: 't-202',
    product: 'Compact Mechanical Keyboard 75%',
    cost: 89.00,
    quantitySold: 48,
    category: 'Peripherals',
    date: '2026-09-18',
  },
  {
    id: 't-203',
    product: 'Active Noise-Cancelling Earbuds',
    cost: 129.00,
    quantitySold: 42,
    category: 'Audio',
    date: '2026-09-24',
  },

  // October 2026 ($10,210.00 total -> -18.2% decline)
  {
    id: 't-204',
    product: 'GaN 65W Multi-Port Fast Charger',
    cost: 34.00,
    quantitySold: 95,
    category: 'Power & Cables',
    date: '2026-10-08',
  },
  {
    id: 't-205',
    product: 'Braided 100W USB-C Cable (2m)',
    cost: 14.50,
    quantitySold: 180,
    category: 'Power & Cables',
    date: '2026-10-15',
  },
  {
    id: 't-206',
    product: 'Anodized Aluminum Laptop Riser',
    cost: 38.00,
    quantitySold: 52,
    category: 'Desk Accessories',
    date: '2026-10-22',
  },
  {
    id: 't-207',
    product: 'Ergonomic Vertical Mouse',
    cost: 45.00,
    quantitySold: 31,
    category: 'Peripherals',
    date: '2026-10-29',
  }
];

export const BAKERY_SAMPLE_SALES: SaleItem[] = [
  // October 2026 ($3,120.00)
  {
    id: 'b-301',
    product: 'Wild Sourdough Country Loaf',
    cost: 8.50,
    quantitySold: 110,
    category: 'Artisan Bread',
    date: '2026-10-28',
  },
  {
    id: 'b-302',
    product: 'Pistachio Cardamom Croissant',
    cost: 5.25,
    quantitySold: 160,
    category: 'Pastry',
    date: '2026-10-29',
  },
  {
    id: 'b-303',
    product: 'Single-Origin Ethiopian Cold Brew',
    cost: 4.75,
    quantitySold: 283,
    category: 'Coffee & Drinks',
    date: '2026-10-31',
  },

  // November 2026 ($3,497.50 -> +12.1% growth)
  {
    id: 'b-304',
    product: 'Wild Sourdough Country Loaf',
    cost: 8.50,
    quantitySold: 145,
    category: 'Artisan Bread',
    date: '2026-11-01',
  },
  {
    id: 'b-305',
    product: 'Pistachio Cardamom Croissant',
    cost: 5.25,
    quantitySold: 210,
    category: 'Pastry',
    date: '2026-11-01',
  },
  {
    id: 'b-306',
    product: 'Dark Chocolate Sea Salt Scone',
    cost: 4.50,
    quantitySold: 115,
    category: 'Pastry',
    date: '2026-11-02',
  },
  {
    id: 'b-307',
    product: 'Matcha Oat Milk Latte (16oz)',
    cost: 6.00,
    quantitySold: 108,
    category: 'Coffee & Drinks',
    date: '2026-11-02',
  }
];
