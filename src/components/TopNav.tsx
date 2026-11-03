import React from 'react';
import { FileText, Plus } from 'lucide-react';

interface TopNavProps {
  activeTab: 'overview' | 'ledger' | 'analytics' | 'report';
  setActiveTab: (tab: 'overview' | 'ledger' | 'analytics' | 'report') => void;
  onOpenAddModal: () => void;
  onPrintReport: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onPrintReport,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-semibold text-sm shadow-xs">
              V
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className="text-left font-bold tracking-tight text-stone-900 text-lg hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0"
            >
              Verdant Sales
            </button>
          </div>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'overview'
                  ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                  : 'hover:text-stone-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`pb-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'ledger'
                  ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                  : 'hover:text-stone-900'
              }`}
            >
              Sales Ledger
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'analytics'
                  ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                  : 'hover:text-stone-900'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`pb-1 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'report'
                  ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                  : 'hover:text-stone-900'
              }`}
            >
              Executive Report
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={activeTab === 'report' ? onPrintReport : onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {activeTab === 'report' ? (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Print Report</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Sale</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
