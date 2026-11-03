import React, { useState } from 'react';
import { X, Plus, FileSpreadsheet, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SaleItem } from '../types/sales';
import { parseSalesText, formatCurrency } from '../utils/salesCalculator';

interface AddSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSingle: (sale: Omit<SaleItem, 'id'>) => void;
  onBatchAdd: (sales: SaleItem[]) => void;
}

export const AddSaleModal: React.FC<AddSaleModalProps> = ({
  isOpen,
  onClose,
  onAddSingle,
  onBatchAdd,
}) => {
  const [mode, setMode] = useState<'single' | 'batch' | 'file'>('single');

  // Single form states
  const [product, setProduct] = useState('');
  const [cost, setCost] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [singleError, setSingleError] = useState('');

  // Batch paste states
  const [pasteText, setPasteText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<SaleItem[]>([]);
  const [batchError, setBatchError] = useState('');

  if (!isOpen) return null;

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSingleError('');

    if (!product.trim()) {
      setSingleError('Please enter a product name');
      return;
    }

    const numCost = parseFloat(cost);
    if (isNaN(numCost) || numCost < 0) {
      setSingleError('Please enter a valid unit cost/price (positive number)');
      return;
    }

    const numQty = parseInt(quantity, 10);
    if (isNaN(numQty) || numQty <= 0) {
      setSingleError('Please enter a valid quantity sold (at least 1)');
      return;
    }

    onAddSingle({
      product: product.trim(),
      cost: numCost,
      quantitySold: numQty,
      category: category.trim() || 'General',
      date: date || new Date().toISOString().slice(0, 10),
      notes: notes.trim(),
    });

    // Reset form
    setProduct('');
    setCost('');
    setQuantity('1');
    setCategory('');
    setNotes('');
    onClose();
  };

  const handlePasteChange = (text: string) => {
    setPasteText(text);
    setBatchError('');
    if (!text.trim()) {
      setParsedPreview([]);
      return;
    }

    try {
      const items = parseSalesText(text);
      setParsedPreview(items);
      if (items.length === 0) {
        setBatchError('Could not detect sales rows. Please ensure rows have "Product, Cost, Quantity".');
      }
    } catch {
      setBatchError('Error parsing pasted data. Check formatting.');
    }
  };

  const handleBatchSubmit = () => {
    if (parsedPreview.length === 0) {
      setBatchError('No valid sales items to import.');
      return;
    }

    onBatchAdd(parsedPreview);
    setPasteText('');
    setParsedPreview([]);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        handlePasteChange(content);
        setMode('batch');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-stone-200 max-w-xl w-full overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900">Add Sales Data</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Record new transactions or import multiple records
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs (Functional segmented buttons) */}
        <div className="px-6 pt-4 pb-2 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-lg text-xs font-medium">
            <button
              onClick={() => setMode('single')}
              className={`flex-1 py-1.5 text-center rounded-md transition-all whitespace-nowrap cursor-pointer ${
                mode === 'single'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Single Entry
            </button>
            <button
              onClick={() => setMode('batch')}
              className={`flex-1 py-1.5 text-center rounded-md transition-all whitespace-nowrap cursor-pointer ${
                mode === 'batch'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Paste Rows / CSV
            </button>
            <button
              onClick={() => setMode('file')}
              className={`flex-1 py-1.5 text-center rounded-md transition-all whitespace-nowrap cursor-pointer ${
                mode === 'file'
                  ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Upload File
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {mode === 'single' && (
            <form onSubmit={handleSingleSubmit} className="space-y-4">
              {singleError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{singleError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Organic Matcha Ceremonial Grade"
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cost / Price per Unit ($) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="24.50"
                    value={cost}
                    onChange={e => setCost(e.target.value)}
                    className="w-full text-sm font-mono px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Quantity Sold <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    placeholder="50"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full text-sm font-mono px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900"
                    required
                  />
                </div>
              </div>

              {cost && quantity && !isNaN(parseFloat(cost)) && !isNaN(parseInt(quantity, 10)) && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs">
                  <span className="text-emerald-800 font-medium">Calculated Line Revenue:</span>
                  <span className="font-mono font-bold text-emerald-900 text-sm tabular-nums">
                    {formatCurrency(parseFloat(cost) * parseInt(quantity, 10))}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Beverages, Tech, Apparel"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Sale Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full text-sm px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Notes / Order Details (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Retail batch #402"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Sale</span>
                </button>
              </div>
            </form>
          )}

          {mode === 'batch' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-stone-700">
                    Paste Tabular Data or CSV
                  </label>
                  <span className="text-[11px] text-stone-500">
                    Format: Product, Cost, Quantity, [Category]
                  </span>
                </div>
                <textarea
                  rows={5}
                  placeholder={`Bamboo Tumbler, 24.50, 40, Drinkware\nCold Brew, 4.50, 120, Beverages\nEco Tote Bag, 15.00, 60, Accessories`}
                  value={pasteText}
                  onChange={e => handlePasteChange(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-stone-900 leading-relaxed"
                />
              </div>

              {batchError && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{batchError}</span>
                </div>
              )}

              {parsedPreview.length > 0 && (
                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <div className="bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 border-b border-stone-200 flex items-center justify-between">
                    <span>Parsed Preview ({parsedPreview.length} items ready)</span>
                    <span className="text-emerald-700 font-mono font-bold">
                      {formatCurrency(
                        parsedPreview.reduce((sum, p) => sum + p.cost * p.quantitySold, 0)
                      )}
                    </span>
                  </div>
                  <div className="max-h-36 overflow-y-auto divide-y divide-stone-100 text-xs">
                    {parsedPreview.map((item, idx) => (
                      <div key={idx} className="p-2 flex items-center justify-between">
                        <span className="font-medium text-stone-800 truncate max-w-[200px]">
                          {item.product}
                        </span>
                        <div className="flex items-center gap-3 text-stone-500 font-mono tabular-nums">
                          <span>${item.cost.toFixed(2)} × {item.quantitySold}</span>
                          <span className="font-semibold text-emerald-800">
                            ${(item.cost * item.quantitySold).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBatchSubmit}
                  disabled={parsedPreview.length === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Import {parsedPreview.length} Items</span>
                </button>
              </div>
            </div>
          )}

          {mode === 'file' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors bg-stone-50/50">
                <Upload className="w-8 h-8 text-stone-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-stone-800 mb-1">
                  Upload CSV or Excel Export
                </p>
                <p className="text-xs text-stone-500 mb-4 max-w-sm mx-auto">
                  Select a CSV file containing columns for Product Name, Unit Cost/Price, and Quantity Sold.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs cursor-pointer transition-colors">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Choose File (.csv)</span>
                  <input
                    type="file"
                    accept=".csv,text/csv,text/plain"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-lg border border-stone-200">
                <div className="font-semibold text-stone-700 mb-1">Recommended CSV Header Format:</div>
                <code className="text-emerald-800 font-mono text-[11px] block">
                  Product, Cost, Quantity Sold, Category, Date
                </code>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
