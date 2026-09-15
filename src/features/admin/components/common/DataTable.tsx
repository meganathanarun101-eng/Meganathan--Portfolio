import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  Search,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from './EmptyState';
import { SkeletonTable } from './Skeletons';
import { cn } from '@/lib/utils';

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  hideable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  getItemId: (item: T) => string;
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  filterKey?: keyof T;
  filterOptions?: { label: string; value: string }[];
  onBulkDelete?: (ids: string[]) => void;
  onBulkPublish?: (ids: string[]) => void;
  renderMobileCard?: (item: T, isSelected: boolean, toggleSelect: () => void) => React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  isLoading?: boolean;
  pageSizeDefault?: number;
}

export function DataTable<T>({
  data,
  columns,
  getItemId,
  searchPlaceholder = 'Search records...',
  searchFilter,
  filterKey,
  filterOptions,
  onBulkDelete,
  onBulkPublish,
  renderMobileCard,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items matching your criteria.',
  emptyActionLabel,
  onEmptyAction,
  isLoading = false,
  pageSizeDefault = 8,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeDefault);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    columns.forEach((c) => {
      initial[c.id] = true;
    });
    return initial;
  });

  // Filter and search
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Category / status filter
      if (filterKey && selectedFilter !== 'all') {
        const itemVal = String(item[filterKey] ?? '');
        if (itemVal.toLowerCase() !== selectedFilter.toLowerCase()) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        if (searchFilter) {
          return searchFilter(item, searchQuery);
        }
        // Default text match across all string values
        const strValues = Object.values(item as Record<string, unknown>)
          .filter((v) => typeof v === 'string' || typeof v === 'number')
          .join(' ')
          .toLowerCase();
        return strValues.includes(searchQuery.toLowerCase());
      }

      return true;
    });
  }, [data, filterKey, selectedFilter, searchQuery, searchFilter]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    const col = columns.find((c) => c.id === sortColumn);
    if (!col || !col.accessorKey) return filteredData;

    const key = col.accessorKey;
    return [...filteredData].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (valA === valB) return 0;
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortDirection === 'asc'
        ? Number(valA) - Number(valB)
        : Number(valB) - Number(valA);
    });
  }, [filteredData, sortColumn, sortDirection, columns]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (colId: string) => {
    if (sortColumn === colId) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(colId);
      setSortDirection('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length && paginatedData.length > 0) {
      setSelectedIds(new Set());
    } else {
      const allIds = new Set(paginatedData.map((item) => getItemId(item)));
      setSelectedIds(allIds);
    }
  };

  const toggleSelectItem = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const visibleColumns = columns.filter((c) => columnVisibility[c.id] !== false);

  if (isLoading) {
    return <SkeletonTable rows={pageSizeDefault} />;
  }

  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-card/60 p-4 md:p-6 backdrop-blur-xl">
      {/* Top Controls: Search, Filter, Column Visibility, Bulk Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative min-w-[200px] max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="h-10 rounded-xl border-white/10 bg-white/[0.03] pl-9 text-xs focus:border-primary"
            />
          </div>

          {/* Optional Category/Status Filter */}
          {filterOptions && filterOptions.length > 0 && (
            <div className="flex items-center gap-1 overflow-x-auto py-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedFilter('all');
                  setCurrentPage(1);
                }}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors',
                  selectedFilter === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground',
                )}
              >
                All
              </button>
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSelectedFilter(opt.value);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    'rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors',
                    selectedFilter.toLowerCase() === opt.value.toLowerCase()
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Column visibility dropdown & bulk actions */}
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5">
              <span className="font-mono text-xs font-bold text-primary">
                {selectedIds.size} selected
              </span>
              {onBulkPublish && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onBulkPublish(Array.from(selectedIds));
                    setSelectedIds(new Set());
                  }}
                  className="h-7 border-white/10 text-[0.7rem]"
                >
                  Publish
                </Button>
              )}
              {onBulkDelete && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    onBulkDelete(Array.from(selectedIds));
                    setSelectedIds(new Set());
                  }}
                  className="h-7 text-[0.7rem]"
                >
                  <Trash2 className="mr-1 h-3 w-3" /> Delete
                </Button>
              )}
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-xl border-white/10 bg-white/[0.03] text-xs font-medium text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
              >
                <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" /> Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-2xl border-white/10 bg-card/95 backdrop-blur-2xl">
              <DropdownMenuLabel className="text-xs">Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              {columns
                .filter((c) => c.hideable !== false)
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={columnVisibility[col.id] !== false}
                    onCheckedChange={(checked) =>
                      setColumnVisibility((prev) => ({ ...prev, [col.id]: checked }))
                    }
                    className="cursor-pointer text-xs"
                  >
                    {col.header}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Table: Desktop view */}
      {paginatedData.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
        />
      ) : (
        <>
          <div className="hidden md:block overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 bg-white/[0.03] uppercase tracking-wider text-muted-foreground font-mono text-[0.65rem]">
                  <tr>
                    <th className="w-10 px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.size === paginatedData.length && paginatedData.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                      />
                    </th>
                    {visibleColumns.map((col) => (
                      <th
                        key={col.id}
                        onClick={() => col.sortable && handleSort(col.id)}
                        className={cn(
                          'px-4 py-3.5 font-semibold transition-colors',
                          col.sortable ? 'cursor-pointer select-none hover:text-foreground' : '',
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{col.header}</span>
                          {col.sortable && (
                            <span className="text-muted-foreground/60">
                              {sortColumn === col.id ? (
                                sortDirection === 'asc' ? (
                                  <ArrowUp className="h-3 w-3 text-primary" />
                                ) : (
                                  <ArrowDown className="h-3 w-3 text-primary" />
                                )
                              ) : (
                                <ArrowUpDown className="h-3 w-3" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedData.map((item) => {
                    const id = getItemId(item);
                    const isSelected = selectedIds.has(id);

                    return (
                      <tr
                        key={id}
                        className={cn(
                          'transition-colors hover:bg-white/[0.04]',
                          isSelected ? 'bg-primary/[0.06]' : '',
                        )}
                      >
                        <td className="w-10 px-4 py-3.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectItem(id)}
                            className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                          />
                        </td>
                        {visibleColumns.map((col) => (
                          <td key={col.id} className="px-4 py-3.5 text-foreground/90">
                            {col.cell ? col.cell(item) : String(col.accessorKey ? item[col.accessorKey] ?? '' : '')}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Transformation: Mobile View */}
          <div className="space-y-3 md:hidden">
            {paginatedData.map((item) => {
              const id = getItemId(item);
              const isSelected = selectedIds.has(id);

              if (renderMobileCard) {
                return (
                  <div key={id}>
                    {renderMobileCard(item, isSelected, () => toggleSelectItem(id))}
                  </div>
                );
              }

              // Default responsive card fallback
              return (
                <div
                  key={id}
                  className={cn(
                    'rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all',
                    isSelected ? 'border-primary/50 bg-primary/[0.05]' : '',
                  )}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectItem(id)}
                      className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary"
                    />
                    <span className="font-mono text-[0.65rem] text-muted-foreground">ID: {id}</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {visibleColumns.map((col) => (
                      <div key={col.id} className="flex items-start justify-between gap-2 text-xs">
                        <span className="font-medium text-muted-foreground">{col.header}:</span>
                        <div className="text-right text-foreground font-medium">
                          {col.cell ? col.cell(item) : String(col.accessorKey ? item[col.accessorKey] ?? '' : '')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between border-t border-white/5">
            <p className="text-xs text-muted-foreground font-mono">
              Showing <span className="text-foreground font-semibold">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="text-foreground font-semibold">
                {Math.min(currentPage * pageSize, sortedData.length)}
              </span>{' '}
              of <span className="text-foreground font-semibold">{sortedData.length}</span> results
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-8 rounded-xl border-white/10 text-xs disabled:opacity-30"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
              </Button>

              <span className="px-2 font-mono text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 rounded-xl border-white/10 text-xs disabled:opacity-30"
              >
                Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
