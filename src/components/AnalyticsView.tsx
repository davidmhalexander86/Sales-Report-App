import React from 'react';
import { SalesReportSummary } from '../types/sales';
import { formatCurrency, formatNumber, formatPercent } from '../utils/salesCalculator';
import { Trophy, Layers, TrendingUp } from 'lucide-react';

interface AnalyticsViewProps {
  summary: SalesReportSummary;
  onNavigateToReport: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ summary, onNavigateToReport }) => {
  const { products, categories, totalRevenue, bestSellingByQuantity, bestSellingByRevenue } = summary;

  if (products.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-12 text-center">
        <h3 className="text-base font-semibold text-stone-900 mb-1">No sales data to analyze</h3>
        <p className="text-sm text-stone-500 mb-4">
          Add sales transactions to generate visual revenue and product volume insights.
        </p>
      </div>
    );
  }

  // Top 5 products by revenue
  const topRevenueProducts = [...products].sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5);

  // Top 5 products by quantity
  const topVolumeProducts = [...products].sort((a, b) => b.totalQuantity - a.totalQuantity).slice(0, 5);

  const maxRevenueVal = topRevenueProducts[0]?.totalRevenue || 1;
  const maxVolumeVal = topVolumeProducts[0]?.totalQuantity || 1;

  return (
    <div className="space-y-6">
      {/* Best-Selling Spotlight Section */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900">Commercial Leadership Spotlight</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Comparative analysis between highest revenue generator and highest volume seller
            </p>
          </div>
          <button
            onClick={onNavigateToReport}
            className="text-xs font-medium text-emerald-800 hover:text-emerald-900 underline underline-offset-4 cursor-pointer"
          >
            View Complete Executive Report →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
          {/* Best Seller by Revenue */}
          <div className="bg-stone-50 rounded-xl p-5 border border-stone-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
              <Trophy className="w-4 h-4 text-emerald-700" />
              <span>Highest Grossing Product</span>
            </div>
            {bestSellingByRevenue ? (
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">{bestSellingByRevenue.product}</h3>
                <div className="text-2xl font-bold font-mono text-emerald-800 tabular-nums mb-3">
                  {formatCurrency(bestSellingByRevenue.totalRevenue)}
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs bg-white p-3 rounded-lg border border-stone-200">
                  <div>
                    <span className="text-stone-500 block">Units Sold</span>
                    <span className="font-semibold text-stone-800 font-mono tabular-nums">
                      {formatNumber(bestSellingByRevenue.totalQuantity)}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Catalog Share</span>
                    <span className="font-semibold text-emerald-800 font-mono tabular-nums">
                      {formatPercent(bestSellingByRevenue.percentageOfRevenue)}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Avg Price</span>
                    <span className="font-semibold text-stone-800 font-mono tabular-nums">
                      {formatCurrency(bestSellingByRevenue.averageUnitPrice)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Best Seller by Quantity */}
          <div className="bg-stone-50 rounded-xl p-5 border border-stone-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Highest Volume Product</span>
            </div>
            {bestSellingByQuantity ? (
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">{bestSellingByQuantity.product}</h3>
                <div className="text-2xl font-bold font-mono text-emerald-800 tabular-nums mb-3">
                  {formatNumber(bestSellingByQuantity.totalQuantity)} <span className="text-xs font-normal text-stone-600">units</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs bg-white p-3 rounded-lg border border-stone-200">
                  <div>
                    <span className="text-stone-500 block">Total Revenue</span>
                    <span className="font-semibold text-stone-800 font-mono tabular-nums">
                      {formatCurrency(bestSellingByQuantity.totalRevenue)}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Orders</span>
                    <span className="font-semibold text-stone-800 font-mono tabular-nums">
                      {bestSellingByQuantity.transactionCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Avg Price</span>
                    <span className="font-semibold text-stone-800 font-mono tabular-nums">
                      {formatCurrency(bestSellingByQuantity.averageUnitPrice)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Top Revenue vs Top Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products by Revenue */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Top Revenue Generators</h3>
              <p className="text-xs text-stone-500 mt-0.5">Ranked by gross sales contribution</p>
            </div>
            <span className="text-xs text-stone-500 font-mono">Gross Total</span>
          </div>

          <div className="mt-4 space-y-4">
            {topRevenueProducts.map((p, idx) => {
              const widthPct = Math.max(8, (p.totalRevenue / maxRevenueVal) * 100);
              return (
                <div key={p.product} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-800 truncate max-w-[240px]">
                      {idx + 1}. {p.product}
                    </span>
                    <div className="flex items-center gap-3 font-mono tabular-nums">
                      <span className="text-stone-500">{formatPercent(p.percentageOfRevenue)}</span>
                      <span className="font-bold text-emerald-900">{formatCurrency(p.totalRevenue)}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-700 rounded-full transition-all duration-300"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products by Units Sold */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Top Volume Leaders</h3>
              <p className="text-xs text-stone-500 mt-0.5">Ranked by total units delivered</p>
            </div>
            <span className="text-xs text-stone-500 font-mono">Units Sold</span>
          </div>

          <div className="mt-4 space-y-4">
            {topVolumeProducts.map((p, idx) => {
              const widthPct = Math.max(8, (p.totalQuantity / maxVolumeVal) * 100);
              return (
                <div key={p.product} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-800 truncate max-w-[240px]">
                      {idx + 1}. {p.product}
                    </span>
                    <div className="flex items-center gap-3 font-mono tabular-nums">
                      <span className="text-stone-500">{formatCurrency(p.averageUnitPrice)}/unit</span>
                      <span className="font-bold text-stone-900">{formatNumber(p.totalQuantity)} units</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Performance Breakdown */}
      {categories.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <div>
                <h3 className="text-sm font-bold text-stone-900">Revenue Distribution by Category</h3>
                <p className="text-xs text-stone-500 mt-0.5">Aggregate breakdown by product classification</p>
              </div>
            </div>
            <div className="text-xs text-stone-500">
              Total Revenue: <span className="font-mono font-semibold text-stone-800">{formatCurrency(totalRevenue)}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <div
                key={cat.category}
                className="bg-stone-50 border border-stone-200 rounded-lg p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-stone-900">{cat.category}</span>
                    <span className="font-mono font-semibold text-emerald-800">
                      {formatPercent(cat.percentageOfRevenue)}
                    </span>
                  </div>
                  <div className="text-lg font-bold font-mono text-stone-900 tabular-nums">
                    {formatCurrency(cat.totalRevenue)}
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between font-mono tabular-nums">
                  <span>Volume:</span>
                  <span>{formatNumber(cat.totalQuantity)} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
