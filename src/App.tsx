import React, { useState, useMemo, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { SummaryCards } from './components/SummaryCards';
import { SalesTable } from './components/SalesTable';
import { AnalyticsView } from './components/AnalyticsView';
import { ExecutiveReportView } from './components/ExecutiveReportView';
import { AddSaleModal } from './components/AddSaleModal';
import { SampleDataPicker } from './components/SampleDataPicker';
import { SaleItem } from './types/sales';
import { BOTANICAL_SAMPLE_SALES } from './data/sampleData';
import { calculateReportSummary, generateCSV, formatCurrency } from './utils/salesCalculator';
import { ArrowRight, Plus, FileSpreadsheet, BarChart3, ReceiptText } from 'lucide-react';

const STORAGE_KEY = 'verdant_sales_data_v2';

export default function App() {
  const [sales, setSales] = useState<SaleItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return BOTANICAL_SAMPLE_SALES;
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'ledger' | 'analytics' | 'report'>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync to local storage for persistence across reloads
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
    } catch {
      // Ignore quota errors
    }
  }, [sales]);

  // Recalculate summary metrics dynamically
  const summary = useMemo(() => calculateReportSummary(sales), [sales]);

  // Handlers
  const handleAddSingle = (newSale: Omit<SaleItem, 'id'>) => {
    const item: SaleItem = {
      ...newSale,
      id: `sale-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    };
    setSales(prev => [item, ...prev]);
  };

  const handleBatchAdd = (newItems: SaleItem[]) => {
    setSales(prev => [...newItems, ...prev]);
  };

  const handleUpdateSale = (updated: SaleItem) => {
    setSales(prev => prev.map(s => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteSale = (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
  };

  const handleDeleteSelected = (ids: string[]) => {
    const idSet = new Set(ids);
    setSales(prev => prev.filter(s => !idSet.has(s.id)));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all sales records?')) {
      setSales([]);
    }
  };

  const handleLoadDataset = (dataset: SaleItem[]) => {
    setSales(dataset);
  };

  const handleExportCSV = () => {
    const csvContent = generateCSV(sales);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sales_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintReport = () => {
    setActiveTab('report');
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onPrintReport={handlePrintReport}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Sample dataset selector banner (no-print) */}
        <SampleDataPicker
          onLoadDataset={handleLoadDataset}
          onClearAll={handleClearAll}
          currentCount={sales.length}
        />

        {/* Dynamic Tab Views */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Core Metric Cards */}
            <SummaryCards
              summary={summary}
              onViewProductBreakdown={() => setActiveTab('analytics')}
            />

            {/* Quick Actions & Navigation Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setIsAddModalOpen(true)}
                className="bg-white border border-stone-200 rounded-xl p-5 hover:border-emerald-500/80 hover:shadow-xs transition-all cursor-pointer group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-0.5">Record New Sale</h3>
                  <p className="text-xs text-stone-500">
                    Add single items, paste rows from spreadsheets, or import CSV.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('ledger')}
                className="bg-white border border-stone-200 rounded-xl p-5 hover:border-emerald-500/80 hover:shadow-xs transition-all cursor-pointer group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                  <ReceiptText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-0.5">Sales Register & Table</h3>
                  <p className="text-xs text-stone-500">
                    Search, filter, inline-edit prices, or sort line items.
                  </p>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('report')}
                className="bg-white border border-stone-200 rounded-xl p-5 hover:border-emerald-500/80 hover:shadow-xs transition-all cursor-pointer group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-0.5">Generate Executive Report</h3>
                  <p className="text-xs text-stone-500">
                    View narrative summary and export formal PDF for stakeholders.
                  </p>
                </div>
              </div>
            </div>

            {/* Overview Preview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product Leaderboard Preview */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs lg:col-span-1">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Top Grossing Products
                  </h3>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 cursor-pointer"
                  >
                    All Analytics →
                  </button>
                </div>
                <div className="divide-y divide-stone-100 mt-2">
                  {summary.products.slice(0, 4).map((p, idx) => (
                    <div key={p.product} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="truncate max-w-[170px]">
                        <span className="font-semibold text-stone-800 block truncate">{p.product}</span>
                        <span className="text-[11px] text-stone-400 font-mono">
                          {p.totalQuantity} units sold
                        </span>
                      </div>
                      <span className="font-mono font-bold text-emerald-800 tabular-nums">
                        {formatCurrency(p.totalRevenue)}
                      </span>
                    </div>
                  ))}
                  {summary.products.length === 0 && (
                    <p className="py-6 text-center text-xs text-stone-400">No products recorded</p>
                  )}
                </div>
              </div>

              {/* Recent Ledger Snapshot */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs lg:col-span-2">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Recent Transactions
                  </h3>
                  <button
                    onClick={() => setActiveTab('ledger')}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 cursor-pointer flex items-center gap-1"
                  >
                    <span>Full Ledger ({sales.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-stone-100 mt-2">
                  {sales.slice(0, 5).map(item => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-stone-800">{item.product}</span>
                        <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                          <span>{item.category || 'General'}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{item.date || '—'}</span>
                        </div>
                      </div>
                      <div className="text-right font-mono tabular-nums">
                        <div className="font-bold text-emerald-800">
                          {formatCurrency(item.cost * item.quantitySold)}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {formatCurrency(item.cost)} × {item.quantitySold}
                        </div>
                      </div>
                    </div>
                  ))}
                  {sales.length === 0 && (
                    <p className="py-6 text-center text-xs text-stone-400">No transactions recorded</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ledger' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-stone-900">Sales Transaction Ledger</h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Detailed register of all recorded sales with unit costs and quantities
                </p>
              </div>
            </div>

            <SalesTable
              sales={sales}
              onAddSale={() => setIsAddModalOpen(true)}
              onUpdateSale={handleUpdateSale}
              onDeleteSale={handleDeleteSale}
              onDeleteSelected={handleDeleteSelected}
              onExportCSV={handleExportCSV}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            summary={summary}
            onNavigateToReport={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'report' && (
          <ExecutiveReportView
            summary={summary}
            sales={sales}
            onPrint={handlePrintReport}
            onExportCSV={handleExportCSV}
          />
        )}
      </main>

      {/* Add Sale Modal */}
      <AddSaleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSingle={handleAddSingle}
        onBatchAdd={handleBatchAdd}
      />

      {/* Footer */}
      <footer className="no-print border-t border-stone-200 bg-white py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">Verdant Sales</span>
            <span>·</span>
            <span>Report & Revenue Analyzer</span>
          </div>
          <div>
            <span>Deterministic financial calculations · Export & Print ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
