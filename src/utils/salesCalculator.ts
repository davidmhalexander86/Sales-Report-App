import { SaleItem, SalesReportSummary, ProductPerformance, CategoryPerformance } from '../types/sales';

export function calculateReportSummary(sales: SaleItem[]): SalesReportSummary {
  if (!sales || sales.length === 0) {
    return {
      totalRevenue: 0,
      totalUnitsSold: 0,
      totalTransactions: 0,
      averageSaleAmount: 0,
      averagePricePerUnit: 0,
      bestSellingByQuantity: null,
      bestSellingByRevenue: null,
      products: [],
      categories: [],
      maxSale: null,
      minSale: null,
      startDate: '',
      endDate: '',
    };
  }

  let totalRevenue = 0;
  let totalUnitsSold = 0;

  // Track product aggregates
  const productMap = new Map<string, {
    category: string;
    totalQuantity: number;
    totalRevenue: number;
    transactionCount: number;
  }>();

  // Track category aggregates
  const categoryMap = new Map<string, {
    totalRevenue: number;
    totalQuantity: number;
  }>();

  let maxSale: { product: string; amount: number; quantity: number } | null = null;
  let minSale: { product: string; amount: number; quantity: number } | null = null;

  const validDates: string[] = [];

  for (const item of sales) {
    const cost = Math.max(0, Number(item.cost) || 0);
    const quantity = Math.max(0, Number(item.quantitySold) || 0);
    const lineTotal = cost * quantity;

    totalRevenue += lineTotal;
    totalUnitsSold += quantity;

    const trimmedProduct = (item.product || 'Unnamed Item').trim();
    const category = (item.category || 'General').trim();

    if (item.date) {
      validDates.push(item.date);
    }

    // Min / Max single transaction tracking
    if (!maxSale || lineTotal > maxSale.amount) {
      maxSale = { product: trimmedProduct, amount: lineTotal, quantity };
    }
    if (!minSale || lineTotal < minSale.amount) {
      minSale = { product: trimmedProduct, amount: lineTotal, quantity };
    }

    // Aggregate Product
    const existingProd = productMap.get(trimmedProduct) || {
      category,
      totalQuantity: 0,
      totalRevenue: 0,
      transactionCount: 0,
    };
    existingProd.totalQuantity += quantity;
    existingProd.totalRevenue += lineTotal;
    existingProd.transactionCount += 1;
    productMap.set(trimmedProduct, existingProd);

    // Aggregate Category
    const existingCat = categoryMap.get(category) || {
      totalRevenue: 0,
      totalQuantity: 0,
    };
    existingCat.totalRevenue += lineTotal;
    existingCat.totalQuantity += quantity;
    categoryMap.set(category, existingCat);
  }

  const totalTransactions = sales.length;
  const averageSaleAmount = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
  const averagePricePerUnit = totalUnitsSold > 0 ? totalRevenue / totalUnitsSold : 0;

  // Convert Product Map to sorted array
  const products: ProductPerformance[] = Array.from(productMap.entries()).map(([product, data]) => {
    return {
      product,
      category: data.category,
      totalQuantity: data.totalQuantity,
      totalRevenue: data.totalRevenue,
      transactionCount: data.transactionCount,
      averageUnitPrice: data.totalQuantity > 0 ? data.totalRevenue / data.totalQuantity : 0,
      percentageOfRevenue: totalRevenue > 0 ? (data.totalRevenue / totalRevenue) * 100 : 0,
    };
  });

  // Find best sellers
  let bestSellingByQuantity: ProductPerformance | null = null;
  let bestSellingByRevenue: ProductPerformance | null = null;

  for (const p of products) {
    if (!bestSellingByQuantity || p.totalQuantity > bestSellingByQuantity.totalQuantity) {
      bestSellingByQuantity = p;
    }
    if (!bestSellingByRevenue || p.totalRevenue > bestSellingByRevenue.totalRevenue) {
      bestSellingByRevenue = p;
    }
  }

  // Sort products primarily by revenue descending
  products.sort((a, b) => b.totalRevenue - a.totalRevenue);

  // Convert Category Map to sorted array
  const categories: CategoryPerformance[] = Array.from(categoryMap.entries()).map(([category, data]) => {
    return {
      category,
      totalRevenue: data.totalRevenue,
      totalQuantity: data.totalQuantity,
      percentageOfRevenue: totalRevenue > 0 ? (data.totalRevenue / totalRevenue) * 100 : 0,
    };
  }).sort((a, b) => b.totalRevenue - a.totalRevenue);

  validDates.sort();
  const startDate = validDates.length > 0 ? validDates[0] : '';
  const endDate = validDates.length > 0 ? validDates[validDates.length - 1] : '';

  return {
    totalRevenue,
    totalUnitsSold,
    totalTransactions,
    averageSaleAmount,
    averagePricePerUnit,
    bestSellingByQuantity,
    bestSellingByRevenue,
    products,
    categories,
    maxSale,
    minSale,
    startDate,
    endDate,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-US').format(val);
}

export function formatPercent(val: number): string {
  return `${val.toFixed(1)}%`;
}

/**
 * Parses raw text input (CSV or Tab-delimited TSV from spreadsheets)
 */
export function parseSalesText(rawText: string): SaleItem[] {
  const lines = rawText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];

  const firstLine = lines[0];
  const isHeader = /product|cost|price|quantity|qty|revenue|item/i.test(firstLine);

  const startIndex = isHeader ? 1 : 0;
  const items: SaleItem[] = [];

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    // Split by comma or tab, taking care of quoted values
    const cols = splitDelimitedLine(line);
    if (cols.length < 2) continue;

    // Detect column roles:
    // Standard expectation: Product, Cost/Price, Quantity Sold, [Category], [Date]
    const product = cols[0]?.trim() || `Item ${i + 1}`;
    
    // Find numbers for cost and quantity
    let cost = 0;
    let quantity = 1;
    let category = 'General';
    let date = new Date().toISOString().slice(0, 10);

    const numericCols: number[] = [];
    const nonNumericCols: string[] = [];

    for (let c = 1; c < cols.length; c++) {
      const val = cols[c].replace(/[$,\s]/g, '');
      const parsedNum = parseFloat(val);
      if (!isNaN(parsedNum) && !cols[c].includes('-')) {
        numericCols.push(parsedNum);
      } else {
        nonNumericCols.push(cols[c].trim());
      }
    }

    if (numericCols.length >= 2) {
      // First numeric usually cost/price, second quantity (or vice-versa if quantity is integer)
      cost = numericCols[0];
      quantity = numericCols[1];
    } else if (numericCols.length === 1) {
      cost = numericCols[0];
      quantity = 1;
    }

    // Check for category or date in non-numerics
    for (const val of nonNumericCols) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        date = val;
      } else if (val.length > 0 && category === 'General') {
        category = val;
      }
    }

    items.push({
      id: `imported-${Date.now()}-${i}`,
      product,
      cost: Math.max(0, cost),
      quantitySold: Math.max(1, Math.round(quantity)),
      category,
      date,
    });
  }

  return items;
}

function splitDelimitedLine(line: string): string[] {
  const delimiter = line.includes('\t') ? '\t' : ',';
  if (delimiter === '\t') {
    return line.split('\t');
  }

  // Handle standard CSV with quotes
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function generateCSV(sales: SaleItem[]): string {
  const headers = ['Product', 'Unit Cost / Price', 'Quantity Sold', 'Total Revenue', 'Category', 'Date', 'Notes'];
  const rows = sales.map(s => {
    const total = (s.cost * s.quantitySold).toFixed(2);
    const escapedProduct = `"${s.product.replace(/"/g, '""')}"`;
    const escapedCategory = `"${(s.category || '').replace(/"/g, '""')}"`;
    const escapedNotes = `"${(s.notes || '').replace(/"/g, '""')}"`;
    return [
      escapedProduct,
      s.cost.toFixed(2),
      s.quantitySold,
      total,
      escapedCategory,
      s.date || '',
      escapedNotes,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Builds an articulate, executive summary narrative based on real numbers.
 */
export function generateExecutiveNarrative(summary: SalesReportSummary): string {
  if (summary.totalTransactions === 0) {
    return 'No sales data is currently recorded. Add sales transactions to generate the analytical executive report.';
  }

  const {
    totalRevenue,
    totalUnitsSold,
    totalTransactions,
    averageSaleAmount,
    bestSellingByQuantity,
    bestSellingByRevenue,
    categories,
    products,
  } = summary;

  let narrative = `This sales cycle recorded a total gross revenue of ${formatCurrency(totalRevenue)} across ${formatNumber(totalTransactions)} transaction${totalTransactions > 1 ? 's' : ''}, representing ${formatNumber(totalUnitsSold)} total product units delivered. The average transaction value stood at ${formatCurrency(averageSaleAmount)}.`;

  if (bestSellingByRevenue) {
    narrative += ` Top financial performance was led by "${bestSellingByRevenue.product}", generating ${formatCurrency(bestSellingByRevenue.totalRevenue)} (${formatPercent(bestSellingByRevenue.percentageOfRevenue)} of overall volume) with ${formatNumber(bestSellingByRevenue.totalQuantity)} units sold.`;
  }

  if (bestSellingByQuantity && bestSellingByQuantity.product !== bestSellingByRevenue?.product) {
    narrative += ` By volume, "${bestSellingByQuantity.product}" was the best-selling product with ${formatNumber(bestSellingByQuantity.totalQuantity)} units sold (${formatCurrency(bestSellingByQuantity.totalRevenue)}).`;
  }

  if (categories.length > 1) {
    const topCategory = categories[0];
    narrative += ` The leading product segment was ${topCategory.category}, accounting for ${formatCurrency(topCategory.totalRevenue)} (${formatPercent(topCategory.percentageOfRevenue)} of aggregate sales).`;
  }

  if (products.length >= 3) {
    narrative += ` The catalog demonstrated balanced commercial engagement across ${products.length} distinct product lines.`;
  }

  return narrative;
}
