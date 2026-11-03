export interface SaleItem {
  id: string;
  product: string;
  cost: number; // Unit Cost / Sale Price per unit
  quantitySold: number;
  category?: string;
  date: string; // YYYY-MM-DD
  notes?: string;
}

export interface ProductPerformance {
  product: string;
  category: string;
  totalQuantity: number;
  totalRevenue: number;
  transactionCount: number;
  averageUnitPrice: number;
  percentageOfRevenue: number;
}

export interface CategoryPerformance {
  category: string;
  totalRevenue: number;
  totalQuantity: number;
  percentageOfRevenue: number;
}

export interface SalesReportSummary {
  totalRevenue: number;
  totalUnitsSold: number;
  totalTransactions: number;
  averageSaleAmount: number; // totalRevenue / totalTransactions
  averagePricePerUnit: number; // totalRevenue / totalUnitsSold
  bestSellingByQuantity: ProductPerformance | null;
  bestSellingByRevenue: ProductPerformance | null;
  products: ProductPerformance[];
  categories: CategoryPerformance[];
  maxSale: { product: string; amount: number; quantity: number } | null;
  minSale: { product: string; amount: number; quantity: number } | null;
  startDate: string;
  endDate: string;
}
