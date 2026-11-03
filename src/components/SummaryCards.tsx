import React from 'react';
import { TrendingUp, TrendingDown, Award, DollarSign, PackageCheck } from 'lucide-react';
import { SalesReportSummary } from '../types/sales';
import { formatCurrency, formatNumber, formatPercent } from '../utils/salesCalculator';

interface SummaryCardsProps {
  summary: SalesReportSummary;
  onViewProductBreakdown?: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, onViewProductBreakdown }) => {
  const {
    totalRevenue,
    bestSellingByQuantity,
    bestSellingByRevenue,
    averageSaleAmount,
    averagePricePerUnit,
    totalUnitsSold,
    totalTransactions,
    monthlyComparison,
  } = summary;

  const hasSales = totalTransactions > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Total Revenue Card with Visual Month-over-Month Growth/Decline Indicator */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs relative overflow-hidden transition-all duration-200 hover:border-emerald-300">
        <div className="flex items-center justify-between gap-3 text-stone-600 mb-2">
          <span className="text-xs font-semibold tracking-wider text-emerald-800 uppercase">
            Total Revenue
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-2 mb-2 flex-wrap">
          <div className="text-2xl lg:text-3xl font-bold tracking-tight text-stone-900 font-mono tabular-nums">
            {formatCurrency(totalRevenue)}
          </div>

          {/* Visual Month-over-Month Growth or Decline Indicator */}
          {hasSales && monthlyComparison && monthlyComparison.hasPreviousMonthData && (
            <div
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md font-mono tabular-nums select-none ${
                monthlyComparison.isGrowth
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                  : 'bg-rose-50 text-rose-800 border border-rose-200/80'
              }`}
              title={`${monthlyComparison.currentMonthLabel} (${formatCurrency(
                monthlyComparison.currentMonthRevenue
              )}) vs ${monthlyComparison.previousMonthLabel} (${formatCurrency(
                monthlyComparison.previousMonthRevenue
              )})`}
            >
              {monthlyComparison.isGrowth ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-label="Revenue Growth" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-rose-700 shrink-0" aria-label="Revenue Decline" />
              )}
              <span>
                {monthlyComparison.isGrowth ? '+' : ''}
                {formatPercent(monthlyComparison.percentageChange)}
              </span>
            </div>
          )}
        </div>

        <div className="text-xs text-stone-500 flex items-center gap-1.5 flex-wrap">
          <span>{formatNumber(totalTransactions)} transactions</span>
          <span aria-hidden="true">·</span>
          <span>{formatNumber(totalUnitsSold)} units</span>
          {monthlyComparison && monthlyComparison.hasPreviousMonthData ? (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-stone-600">
                vs {monthlyComparison.previousMonthLabel}
              </span>
            </>
          ) : monthlyComparison ? (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-stone-400 font-mono">
                {monthlyComparison.currentMonthLabel}
              </span>
            </>
          ) : null}
        </div>
      </div>

      {/* 2. Best-Selling Product Card */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs relative overflow-hidden transition-all duration-200 hover:border-emerald-300">
        <div className="flex items-center justify-between gap-3 text-stone-600 mb-2">
          <span className="text-xs font-semibold tracking-wider text-emerald-800 uppercase">
            Best-Selling Product
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
        </div>

        {hasSales && bestSellingByQuantity ? (
          <div>
            <div
              className="text-base font-bold text-stone-900 line-clamp-1 mb-1"
              title={bestSellingByQuantity.product}
            >
              {bestSellingByQuantity.product}
            </div>
            <div className="text-xl font-bold text-emerald-700 font-mono tabular-nums mb-1">
              {formatNumber(bestSellingByQuantity.totalQuantity)}{' '}
              <span className="text-xs font-normal text-stone-600">units</span>
            </div>
            <div className="text-xs text-stone-500 flex items-center gap-1.5 flex-wrap">
              <span>{formatCurrency(bestSellingByQuantity.totalRevenue)} revenue</span>
              <span aria-hidden="true">·</span>
              <span>{formatPercent(bestSellingByQuantity.percentageOfRevenue)} share</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-stone-400 py-3">No sales recorded yet</div>
        )}
      </div>

      {/* 3. Average Sale Amount Card */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs relative overflow-hidden transition-all duration-200 hover:border-emerald-300">
        <div className="flex items-center justify-between gap-3 text-stone-600 mb-2">
          <span className="text-xs font-semibold tracking-wider text-emerald-800 uppercase">
            Average Sale Amount
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl lg:text-3xl font-bold tracking-tight text-stone-900 font-mono tabular-nums mb-2">
          {formatCurrency(averageSaleAmount)}
        </div>
        <div className="text-xs text-stone-500 flex items-center gap-1.5 flex-wrap">
          <span>Per transaction</span>
          <span aria-hidden="true">·</span>
          <span>{formatCurrency(averagePricePerUnit)} per unit</span>
        </div>
      </div>

      {/* 4. Top Revenue Driver Card */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs relative overflow-hidden transition-all duration-200 hover:border-emerald-300">
        <div className="flex items-center justify-between gap-3 text-stone-600 mb-2">
          <span className="text-xs font-semibold tracking-wider text-emerald-800 uppercase">
            Top Revenue Driver
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <PackageCheck className="w-4 h-4" />
          </div>
        </div>

        {hasSales && bestSellingByRevenue ? (
          <div>
            <div
              className="text-base font-bold text-stone-900 line-clamp-1 mb-1"
              title={bestSellingByRevenue.product}
            >
              {bestSellingByRevenue.product}
            </div>
            <div className="text-xl font-bold text-emerald-700 font-mono tabular-nums mb-1">
              {formatCurrency(bestSellingByRevenue.totalRevenue)}
            </div>
            <div className="text-xs text-stone-500 flex items-center gap-1.5 flex-wrap">
              <span>{formatNumber(bestSellingByRevenue.totalQuantity)} units sold</span>
              <span aria-hidden="true">·</span>
              <span>{bestSellingByRevenue.category}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-stone-400 py-3">No sales recorded yet</div>
        )}
      </div>
    </div>
  );
};
