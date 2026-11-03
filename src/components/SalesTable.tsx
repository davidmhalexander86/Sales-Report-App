import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Trash2, Edit2, Check, X, Plus, Filter, Download } from 'lucide-react';
import { SaleItem } from '../types/sales';
import { formatCurrency, formatNumber } from '../utils/salesCalculator';

interface SalesTableProps {
  sales: SaleItem[];
  onAddSale: () => void;
  onUpdateSale: (updated: SaleItem) => void;
  onDeleteSale: (id: string) => void;
  onDeleteSelected: (ids: string[]) => void;
  onExportCSV: () => void;
}

type SortField = 'product' | 'cost' | 'quantitySold' | 'total' | 'date';
type SortOrder = 'asc' | 'desc';

export const SalesTable: React.FC<SalesTableProps> = ({
  sales,
  onAddSale,
  onUpdateSale,
  onDeleteSale,
  onDeleteSelected,
  onExportCSV,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<SaleItem | null>(null);

  // Available unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    sales.forEach(s => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set).sort();
  }, [sales]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedSales = useMemo(() => {
    return sales
      .filter(item => {
        const matchesSearch =
          item.product.toLowerCase().includes(search.toLowerCase()) ||
          (item.category && item.category.toLowerCase().includes(search.toLowerCase())) ||
          (item.notes && item.notes.toLowerCase().includes(search.toLowerCase()));

        const matchesCat =
          selectedCategory === 'all' || item.category === selectedCategory;

        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        let valA: string | number = 0;
        let valB: string | number = 0;

        switch (sortField) {
          case 'product':
            valA = a.product.toLowerCase();
            valB = b.product.toLowerCase();
            break;
          case 'cost':
            valA = a.cost;
            valB = b.cost;
            break;
          case 'quantitySold':
            valA = a.quantitySold;
            valB = b.quantitySold;
            break;
          case 'total':
            valA = a.cost * a.quantitySold;
            valB = b.cost * b.quantitySold;
            break;
          case 'date':
            valA = a.date || '';
            valB = b.date || '';
            break;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [sales, search, selectedCategory, sortField, sortOrder]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedSales.length && filteredAndSortedSales.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedSales.map(s => s.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const startEdit = (item: SaleItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const saveEdit = () => {
    if (editForm) {
      onUpdateSale(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by product name or notes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-stone-900"
            />
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                <option value="all">All Categories ({sales.length})</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {selectedIds.size > 0 && (
            <button
              onClick={() => {
                onDeleteSelected(Array.from(selectedIds));
                setSelectedIds(new Set());
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIds.size})</span>
            </button>
          )}

          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onAddSale}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-stone-50/75 border-b border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    filteredAndSortedSales.length > 0 &&
                    selectedIds.size === filteredAndSortedSales.length
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort('product')}>
                <div className="flex items-center gap-1.5">
                  <span>Product Name</span>
                  <ArrowUpDown className="w-3 h-3 text-stone-400" />
                </div>
              </th>
              <th className="px-4 py-3 cursor-pointer select-none text-right" onClick={() => handleSort('cost')}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>Unit Cost / Price</span>
                  <ArrowUpDown className="w-3 h-3 text-stone-400" />
                </div>
              </th>
              <th className="px-4 py-3 cursor-pointer select-none text-right" onClick={() => handleSort('quantitySold')}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>Quantity Sold</span>
                  <ArrowUpDown className="w-3 h-3 text-stone-400" />
                </div>
              </th>
              <th className="px-4 py-3 cursor-pointer select-none text-right" onClick={() => handleSort('total')}>
                <div className="flex items-center justify-end gap-1.5 text-emerald-800 font-bold">
                  <span>Total Revenue</span>
                  <ArrowUpDown className="w-3 h-3 text-emerald-700" />
                </div>
              </th>
              <th className="px-4 py-3 hidden sm:table-cell">Category</th>
              <th className="px-4 py-3 cursor-pointer select-none hidden md:table-cell" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-1.5">
                  <span>Sale Date</span>
                  <ArrowUpDown className="w-3 h-3 text-stone-400" />
                </div>
              </th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredAndSortedSales.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-stone-400 text-sm">
                  {sales.length === 0
                    ? 'No sales records yet. Click "Add Row" or load a sample dataset above to begin.'
                    : 'No sales match your current search or category filter.'}
                </td>
              </tr>
            ) : (
              filteredAndSortedSales.map(item => {
                const isEditing = editingId === item.id;
                const isSelected = selectedIds.has(item.id);
                const lineTotal = item.cost * item.quantitySold;

                if (isEditing && editForm) {
                  return (
                    <tr key={item.id} className="bg-emerald-50/50">
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editForm.product}
                          onChange={e => setEditForm({ ...editForm, product: e.target.value })}
                          className="w-full text-xs font-medium px-2 py-1.5 bg-white border border-stone-300 rounded focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editForm.cost}
                          onChange={e =>
                            setEditForm({ ...editForm, cost: parseFloat(e.target.value) || 0 })
                          }
                          className="w-24 text-right text-xs font-mono px-2 py-1.5 bg-white border border-stone-300 rounded focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <input
                          type="number"
                          step="1"
                          min="1"
                          value={editForm.quantitySold}
                          onChange={e =>
                            setEditForm({
                              ...editForm,
                              quantitySold: parseInt(e.target.value, 10) || 1,
                            })
                          }
                          className="w-20 text-right text-xs font-mono px-2 py-1.5 bg-white border border-stone-300 rounded focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-800 tabular-nums">
                        {formatCurrency(editForm.cost * editForm.quantitySold)}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <input
                          type="text"
                          value={editForm.category || ''}
                          onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                          className="w-28 text-xs px-2 py-1.5 bg-white border border-stone-300 rounded focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                          className="text-xs px-2 py-1.5 bg-white border border-stone-300 rounded focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={saveEdit}
                            className="p-1 text-emerald-700 hover:bg-emerald-100 rounded transition-colors"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-stone-500 hover:bg-stone-200 rounded transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-stone-50/80 transition-colors ${
                      isSelected ? 'bg-emerald-50/40' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(item.id)}
                        className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-stone-900">
                      <div>{item.product}</div>
                      {item.notes && (
                        <div className="text-xs text-stone-400 font-normal line-clamp-1">
                          {item.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-stone-700">
                      {formatCurrency(item.cost)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-stone-700">
                      {formatNumber(item.quantitySold)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-800 tabular-nums">
                      {formatCurrency(lineTotal)}
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs hidden sm:table-cell">
                      {item.category || 'General'}
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs font-mono tabular-nums hidden md:table-cell">
                      {item.date || '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => startEdit(item)}
                          className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteSale(item.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {filteredAndSortedSales.length > 0 && (
            <tfoot>
              <tr className="bg-stone-50 border-t-2 border-stone-200 font-semibold text-stone-800 text-xs">
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 uppercase tracking-wider text-stone-500">
                  Subtotal ({filteredAndSortedSales.length} items)
                </td>
                <td className="px-4 py-3 text-right text-stone-500">—</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">
                  {formatNumber(
                    filteredAndSortedSales.reduce((sum, i) => sum + i.quantitySold, 0)
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-emerald-800 text-sm">
                  {formatCurrency(
                    filteredAndSortedSales.reduce((sum, i) => sum + i.cost * i.quantitySold, 0)
                  )}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell"></td>
                <td className="px-4 py-3 hidden md:table-cell"></td>
                <td className="px-4 py-3"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
