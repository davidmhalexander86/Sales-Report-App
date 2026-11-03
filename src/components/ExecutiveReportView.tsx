import React, { useState } from 'react';
import { Printer, Download, Copy, Check, FileText } from 'lucide-react';
import { SalesReportSummary, SaleItem } from '../types/sales';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  generateExecutiveNarrative,
} from '../utils/salesCalculator';

interface ExecutiveReportViewProps {
  summary: SalesReportSummary;
  sales: SaleItem[];
  onPrint: () => void;
  onExportCSV: () => void;
}

export const ExecutiveReportView: React.FC<ExecutiveReportViewProps> = ({
  summary,
  sales,
  onPrint,
  onExportCSV,
}) => {
  const [copied, setCopied] = useState(false);
  const [companyName, setCompanyName] = useState('Verdant Commerce Group');
  const [reportTitle, setReportTitle] = useState('Comprehensive Sales & Revenue Performance Report');

  const narrative = generateExecutiveNarrative(summary);

  const handleCopySummary = async () => {
    try {
      const summaryText = `${reportTitle}
Organization: ${companyName}
Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

KEY METRICS
- Total Revenue: ${formatCurrency(summary.totalRevenue)}
- Best-Selling Product: ${summary.bestSellingByQuantity ? `${summary.bestSellingByQuantity.product} (${summary.bestSellingByQuantity.totalQuantity} units, ${formatCurrency(summary.bestSellingByQuantity.totalRevenue)})` : 'N/A'}
- Average Sale Amount: ${formatCurrency(summary.averageSaleAmount)}
- Total Units Sold: ${formatNumber(summary.totalUnitsSold)}
- Total Transactions: ${formatNumber(summary.totalTransactions)}

EXECUTIVE NARRATIVE
${narrative}
`;
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (hidden when printing) */}
      <div className="no-print bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700" />
            <span>Executive Sales Report</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Publication-ready formal summary formatted for printing or PDF export
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Formal Printable Document Sheet */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-xs p-8 sm:p-12 print-page">
        {/* Document Header */}
        <div className="border-b-2 border-stone-900 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs tracking-wider uppercase mb-1">
              <span>Financial & Commercial Report</span>
            </div>
            <input
              type="text"
              value={reportTitle}
              onChange={e => setReportTitle(e.target.value)}
              className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight bg-transparent border-none p-0 focus:outline-none focus:ring-1 focus:ring-emerald-600 rounded w-full"
            />
            <input
              type="text"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              className="text-sm font-medium text-stone-600 bg-transparent border-none p-0 focus:outline-none focus:ring-1 focus:ring-emerald-600 rounded mt-1"
            />
          </div>

          <div className="text-left md:text-right text-xs text-stone-600 space-y-1 font-mono">
            <div>
              <span className="text-stone-400">Date Generated: </span>
              <span className="font-semibold text-stone-900">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            {summary.startDate && summary.endDate && (
              <div>
                <span className="text-stone-400">Coverage Period: </span>
                <span className="text-stone-900">
                  {summary.startDate} to {summary.endDate}
                </span>
              </div>
            )}
            <div>
              <span className="text-stone-400">Report Status: </span>
              <span className="text-emerald-700 font-semibold">Audited & Finalized</span>
            </div>
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="mb-8 bg-stone-50/80 border border-stone-200 rounded-xl p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
            Executive Summary
          </h3>
          <p className="text-sm text-stone-700 leading-relaxed font-sans">{narrative}</p>
        </div>

        {/* Key Performance Indicators (3 core metrics requested) */}
        <div className="mb-10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
            Core Commercial Metrics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Revenue */}
            <div className="p-4 rounded-lg border border-stone-200 bg-white">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs text-stone-500 block">Total Revenue</span>
                {summary.monthlyComparison && summary.monthlyComparison.hasPreviousMonthData && (
                  <span
                    className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded font-mono tabular-nums ${
                      summary.monthlyComparison.isGrowth
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-rose-50 text-rose-800'
                    }`}
                  >
                    {summary.monthlyComparison.isGrowth ? '+' : ''}
                    {formatPercent(summary.monthlyComparison.percentageChange)} MoM
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                {formatCurrency(summary.totalRevenue)}
              </div>
              <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1.5 flex-wrap">
                <span>{summary.totalTransactions} transactions</span>
                <span aria-hidden="true">·</span>
                <span>{summary.totalUnitsSold} units</span>
                {summary.monthlyComparison && summary.monthlyComparison.hasPreviousMonthData && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>vs {summary.monthlyComparison.previousMonthLabel}</span>
                  </>
                )}
              </div>
            </div>

            {/* Best-Selling Product */}
            <div className="p-4 rounded-lg border border-stone-200 bg-white">
              <span className="text-xs text-stone-500 block mb-1">Best-Selling Product (Units)</span>
              <div className="text-base font-bold text-stone-900 truncate mb-1">
                {summary.bestSellingByQuantity?.product || 'None'}
              </div>
              <div className="text-sm font-semibold font-mono text-emerald-800 tabular-nums">
                {summary.bestSellingByQuantity
                  ? `${formatNumber(summary.bestSellingByQuantity.totalQuantity)} units sold`
                  : '—'}
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                {summary.bestSellingByQuantity
                  ? `${formatCurrency(summary.bestSellingByQuantity.totalRevenue)} gross revenue`
                  : ''}
              </div>
            </div>

            {/* Average Sale Amount */}
            <div className="p-4 rounded-lg border border-stone-200 bg-white">
              <span className="text-xs text-stone-500 block mb-1">Average Sale Amount</span>
              <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                {formatCurrency(summary.averageSaleAmount)}
              </div>
              <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1.5">
                <span>Per transaction</span>
                <span aria-hidden="true">·</span>
                <span>{formatCurrency(summary.averagePricePerUnit)} per unit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Breakdown Ledger */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Product-Level Revenue & Volume Contribution
            </h3>
            <span className="text-xs text-stone-500 font-mono">
              {summary.products.length} catalog items
            </span>
          </div>

          <div className="border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/75 border-b border-stone-200 text-stone-700 font-semibold">
                <tr>
                  <th className="px-4 py-2.5">Product Name</th>
                  <th className="px-4 py-2.5">Category</th>
                  <th className="px-4 py-2.5 text-right">Avg Unit Price</th>
                  <th className="px-4 py-2.5 text-right">Units Sold</th>
                  <th className="px-4 py-2.5 text-right">Gross Revenue</th>
                  <th className="px-4 py-2.5 text-right">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {summary.products.map(p => (
                  <tr key={p.product} className="hover:bg-stone-50">
                    <td className="px-4 py-2.5 font-medium text-stone-900">{p.product}</td>
                    <td className="px-4 py-2.5 text-stone-500">{p.category}</td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums text-stone-600">
                      {formatCurrency(p.averageUnitPrice)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums text-stone-800">
                      {formatNumber(p.totalQuantity)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-semibold text-emerald-800 tabular-nums">
                      {formatCurrency(p.totalRevenue)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums text-stone-600">
                      {formatPercent(p.percentageOfRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-stone-50 border-t-2 border-stone-200 font-semibold text-stone-900">
                <tr>
                  <td className="px-4 py-2.5" colSpan={2}>
                    Total Ledger
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums text-stone-600">
                    {formatCurrency(summary.averagePricePerUnit)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums">
                    {formatNumber(summary.totalUnitsSold)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums text-emerald-800 text-sm">
                    {formatCurrency(summary.totalRevenue)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums">100.0%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Detailed Itemized Sales Log */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Itemized Transaction Register
            </h3>
            <span className="text-xs text-stone-500 font-mono">
              {sales.length} logged records
            </span>
          </div>

          <div className="border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/75 border-b border-stone-200 text-stone-700 font-semibold">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Product Description</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2 text-right">Unit Cost</th>
                  <th className="px-3 py-2 text-right">Qty</th>
                  <th className="px-3 py-2 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sales.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="px-3 py-2 font-mono tabular-nums text-stone-500">
                      {item.date || '—'}
                    </td>
                    <td className="px-3 py-2 text-stone-900 font-medium">{item.product}</td>
                    <td className="px-3 py-2 text-stone-500">{item.category || 'General'}</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums text-stone-600">
                      {formatCurrency(item.cost)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums text-stone-700">
                      {formatNumber(item.quantitySold)}
                    </td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums font-semibold text-emerald-800">
                      {formatCurrency(item.cost * item.quantitySold)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Document Footer Signoff */}
        <div className="mt-12 pt-6 border-t border-stone-200 text-xs text-stone-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span>Generated via Verdant Sales Report Generator</span>
            <span className="mx-2">·</span>
            <span>All currency stated in USD</span>
          </div>
          <div className="font-mono text-stone-400">
            Signoff: ________________________
          </div>
        </div>
      </div>
    </div>
  );
};
