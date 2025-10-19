'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  Download,
  RefreshCw,
  Plus
} from 'lucide-react';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

interface Action<T> {
  label: string;
  icon: React.ReactNode;
  onClick: (item: T) => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface AdminDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title: string;
  searchPlaceholder?: string;
  searchableFields?: (keyof T)[];
  actions?: Action<T>[];
  loading?: boolean;
  onRefresh?: () => void;
  onAdd?: () => void;
  addLabel?: string;
  emptyMessage?: string;
  className?: string;
}

export default function AdminDataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  searchPlaceholder = "Pesquisar...",
  searchableFields = [],
  actions = [],
  loading = false,
  onRefresh,
  onAdd,
  addLabel = "Adicionar",
  emptyMessage = "Nenhum dado encontrado",
  className = ""
}: AdminDataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];

    // Apply search filter
    if (searchTerm && searchableFields.length > 0) {
      filtered = filtered.filter(item =>
        searchableFields.some(field =>
          String(item[field] || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, searchableFields, sortConfig]);

  const handleSort = (key: keyof T) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: keyof T) => {
    if (sortConfig.key !== key) {
      return <ChevronDown className="w-4 h-4 text-[#64748B]" />;
    }
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="w-4 h-4 text-[#00C896]" />
      : <ChevronDown className="w-4 h-4 text-[#00C896]" />;
  };

  if (loading) {
    return (
      <div className={`bg-[#1A1F2E] border border-[#2D333B] rounded-2xl p-6 ${className}`}>
        <div className="space-y-4">
          <div className="h-8 bg-[#242931] rounded-lg w-1/3 animate-pulse"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-[#242931] rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#1A1F2E] border border-[#2D333B] rounded-2xl ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-[#2D333B]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-[#F8FAFC]">{title}</h3>
            <p className="text-sm text-[#64748B] mt-1">
              {filteredAndSortedData.length} de {data.length} registros
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 hover:bg-[#242931] rounded-lg transition-colors"
                title="Atualizar"
              >
                <RefreshCw className="w-4 h-4 text-[#64748B]" />
              </button>
            )}
            {onAdd && (
              <button
                onClick={onAdd}
                className="px-4 py-2 bg-[#00C896] text-[#0F1419] rounded-lg hover:bg-[#00A67C] transition-colors font-semibold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{addLabel}</span>
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-[#242931] border border-[#2D333B] rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#00C896] focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 bg-[#242931] border border-[#2D333B] rounded-lg hover:bg-[#2D333B] transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#64748B]" />
            <span className="text-[#F8FAFC]">Filtros</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#242931] border-b border-[#2D333B]">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-3 text-left"
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-2 text-sm font-semibold text-[#F8FAFC] hover:text-[#00C896] transition-colors"
                    >
                      {column.label}
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    <span className="text-sm font-semibold text-[#F8FAFC]">
                      {column.label}
                    </span>
                  )}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right">
                  <span className="sr-only">Ações</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2D333B]">
            {filteredAndSortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="px-6 py-12 text-center"
                >
                  <div className="text-center">
                    <p className="text-[#64748B] mb-2">{emptyMessage}</p>
                    {onAdd && (
                      <button
                        onClick={onAdd}
                        className="text-[#00C896] hover:text-[#00A67C] font-medium"
                      >
                        {addLabel}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSortedData.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="hover:bg-[#242931] transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 text-sm"
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || '-')
                      }
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(item)}
                            className={`
                              p-2 rounded-lg transition-colors flex items-center gap-1
                              ${action.variant === 'danger'
                                ? 'hover:bg-[#EF4444]/10 text-[#EF4444]'
                                : action.variant === 'primary'
                                ? 'hover:bg-[#00C896]/10 text-[#00C896]'
                                : 'hover:bg-[#242931] text-[#64748B]'
                              }
                            `}
                            title={action.label}
                          >
                            {action.icon}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with pagination (placeholder) */}
      {filteredAndSortedData.length > 10 && (
        <div className="p-4 border-t border-[#2D333B] flex items-center justify-between">
          <p className="text-sm text-[#64748B]">
            Mostrando 1-10 de {filteredAndSortedData.length} resultados
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-[#242931] border border-[#2D333B] rounded-lg text-sm text-[#64748B] hover:bg-[#2D333B] transition-colors">
              Anterior
            </button>
            <button className="px-3 py-1 bg-[#00C896] text-[#0F1419] rounded-lg text-sm font-semibold">
              1
            </button>
            <button className="px-3 py-1 bg-[#242931] border border-[#2D333B] rounded-lg text-sm text-[#F8FAFC] hover:bg-[#2D333B] transition-colors">
              2
            </button>
            <button className="px-3 py-1 bg-[#242931] border border-[#2D333B] rounded-lg text-sm text-[#F8FAFC] hover:bg-[#2D333B] transition-colors">
              3
            </button>
            <button className="px-3 py-1 bg-[#242931] border border-[#2D333B] rounded-lg text-sm text-[#F8FAFC] hover:bg-[#2D333B] transition-colors">
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}