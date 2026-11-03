import React from 'react';
import { Sparkles, Trash2, RotateCcw } from 'lucide-react';
import { SaleItem } from '../types/sales';
import { BOTANICAL_SAMPLE_SALES, TECH_SAMPLE_SALES, BAKERY_SAMPLE_SALES } from '../data/sampleData';

interface SampleDataPickerProps {
  onLoadDataset: (dataset: SaleItem[]) => void;
  onClearAll: () => void;
  currentCount: number;
}

export const SampleDataPicker: React.FC<SampleDataPickerProps> = ({
  onLoadDataset,
  onClearAll,
  currentCount,
}) => {
  return (
    <div className="no-print bg-white border border-stone-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-stone-900 block">
            Load Quick Datasets or Start Fresh
          </span>
          <span className="text-xs text-stone-500">
            {currentCount} sales items currently active in session
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-stone-400 font-medium mr-1 hidden sm:inline">Presets:</span>
        <button
          onClick={() => onLoadDataset(BOTANICAL_SAMPLE_SALES)}
          className="px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/60 rounded-lg transition-colors cursor-pointer"
        >
          Botanicals & Eco ({BOTANICAL_SAMPLE_SALES.length})
        </button>
        <button
          onClick={() => onLoadDataset(TECH_SAMPLE_SALES)}
          className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
        >
          Tech & Hardware ({TECH_SAMPLE_SALES.length})
        </button>
        <button
          onClick={() => onLoadDataset(BAKERY_SAMPLE_SALES)}
          className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
        >
          Artisan Bakery ({BAKERY_SAMPLE_SALES.length})
        </button>

        {currentCount > 0 && (
          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer ml-1"
            title="Clear all sales data"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>
    </div>
  );
};
