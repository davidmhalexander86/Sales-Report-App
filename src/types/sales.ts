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

export interface MonthlyComparison {
  currentMonthKey: string; // e.g. "2026-11"
  previousMonthKey: string; // e.g. "2026-10"
  currentMonthLabel: string; // e.g. "November 2026" or "Nov"
  previousMonthLabel: string; // e.g. "October 2026" or "Oct"
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  percentageChange: number; // e.g. +14.8 or -8.2
  absoluteChange: number; // current - prev
  isGrowth: boolean;
  hasPreviousMonthData: boolean;
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
  monthlyComparison: MonthlyComparison | null;
  startDate: string;
  endDate: string;
}
