'use client';

import React, { useState } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { cn } from '@/lib/utils';
import {
  Clock,
  PlayCircle,
  Search,
  Filter,
  Trash2,
  Calendar,
  BarChart3,
  TrendingUp,
  Eye,
  CheckCircle,
  List,
  Grid3X3,
  Download,
  Share2,
  MoreVertical,
  X,
  History,
  Video,
  BookOpen,
  User,
  Timer
} from 'lucide-react';
import type { ViewHistoryItem } from '@/types';

interface ViewHistorySectionProps {
  items: ViewHistoryItem[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
  onItemClick?: (item: ViewHistoryItem) => void;
  onClearHistory?: (type?: 'all' | 'course' | 'video') => void;
  onShare?: (item: ViewHistoryItem) => void;
  onDownload?: (item: ViewHistoryItem) => void;
  maxItems?: number;
  showViewAll?: boolean;
  compact?: boolean;
  gridCols?: 1 | 2 | 3 | 4;
  showStats?: boolean;
}

type SortOption = 'viewedAt' | 'title' | 'watchDuration' | 'completion';
type FilterType = 'all' | 'course' | 'video' | 'completed' | 'incomplete';
type TimeFrame = 'all' | 'today' | 'week' | 'month';
type ViewMode = 'grid' | 'list';

export function ViewHistorySection({
  items,
  loading = false,
  hasMore = false,
  onLoadMore,
  className,
  onItemClick,
  onClearHistory,
  onShare,
  onDownload,
  maxItems = 20,
  showViewAll = true,
  compact = false,
  gridCols = 3,
  showStats = true
}: ViewHistorySectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('all');
  const [sortBy, setSortBy] = useState<SortOption>('viewedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedItem, setSelectedItem] = useState<ViewHistoryItem | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Calculate view statistics
  const getViewStats = () => {
    const totalViews = items.length;
    const totalWatchTime = items.reduce((sum, item) => sum + item.watchDuration, 0);
    const completedVideos = items.filter(item => item.completed).length;
    const completionRate = totalViews > 0 ? (completedVideos / totalViews) * 100 : 0;
    const averageWatchTime = totalViews > 0 ? totalWatchTime / totalViews : 0;

    // Most viewed category
    const categoryCounts = items.reduce((acc, item) => {
      if (item.category) {
        acc[item.category] = (acc[item.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const mostViewedCategory = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    return {
      totalViews,
      totalWatchTime,
      completedVideos,
      completionRate,
      averageWatchTime,
      mostViewedCategory
    };
  };

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      // Time frame filter
      const now = new Date();
      let dateFilter = true;

      switch (timeFrame) {
        case 'today':
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          dateFilter = item.viewedAt >= today;
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateFilter = item.viewedAt >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          dateFilter = item.viewedAt >= monthAgo;
          break;
      }

      // Search filter
      const matchesSearch = !searchTerm ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.instructor?.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      let matchesType = true;
      switch (filterType) {
        case 'course':
          matchesType = item.type === 'course';
          break;
        case 'video':
          matchesType = item.type === 'video';
          break;
        case 'completed':
          matchesType = item.completed;
          break;
        case 'incomplete':
          matchesType = !item.completed;
          break;
      }

      return dateFilter && matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'viewedAt':
          comparison = a.viewedAt.getTime() - b.viewedAt.getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'watchDuration':
          comparison = a.watchDuration - b.watchDuration;
          break;
        case 'completion':
          comparison = (a.completed ? 1 : 0) - (b.completed ? 1 : 0);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const displayItems = filteredItems.slice(0, maxItems);

  const stats = getViewStats();

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    if (date >= today) {
      return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date >= yesterday) {
      return `Ontem, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  // Loading state
  if (loading && items.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Histórico de Visualização</h2>
          <div className="animate-pulse bg-gray-200 h-6 w-20 rounded" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <Card key={index} className="p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-16 h-12 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className={cn('text-center py-12 text-gray-500', className)}>
        <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Nenhum histórico ainda</h3>
        <p className="text-sm">
          Seu histórico de vídeos assistidos aparecerá aqui
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Histórico de Visualização</h2>
          <Badge variant="secondary">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Clear History */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowClearConfirm(true)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Limpar
          </Button>

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-r-none"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-l-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                <p className="text-sm text-gray-600">Total Visualizações</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Timer className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(stats.totalWatchTime)}</p>
                <p className="text-sm text-gray-600">Tempo Assistido</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{Math.round(stats.completionRate)}%</p>
                <p className="text-sm text-gray-600">Taxa de Conclusão</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 truncate">{stats.mostViewedCategory}</p>
                <p className="text-sm text-gray-600">Categoria Mais Vista</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar no histórico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Time Frame Filter */}
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todo o período</option>
            <option value="today">Hoje</option>
            <option value="week">Última semana</option>
            <option value="month">Último mês</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os tipos</option>
            <option value="course">Cursos</option>
            <option value="video">Vídeos</option>
            <option value="completed">Concluídos</option>
            <option value="incomplete">Não concluídos</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="viewedAt">Data de visualização</option>
            <option value="title">Título</option>
            <option value="watchDuration">Duração assistida</option>
            <option value="completion">Status de conclusão</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            <TrendingUp className={cn(
              "w-4 h-4 transition-transform",
              sortOrder === 'desc' ? "rotate-180" : ""
            )} />
          </Button>
        </div>
      </div>

      {/* Items */}
      {filteredItems.length === 0 ? (
        <div className={cn('text-center py-8 text-gray-500', className)}>
          <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado</h3>
          <p className="text-sm">
            Tente ajustar seus filtros ou termos de busca
          </p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="space-y-3">
          {displayItems.map((item) => (
            <Card
              key={item.id}
              className="p-4 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => onItemClick?.(item)}
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-14 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <PlayCircle className="w-6 h-6 text-white opacity-50" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      {/* Title and Type */}
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <Badge
                          variant={item.type === 'course' ? 'default' : 'secondary'}
                          className="text-xs flex-shrink-0"
                        >
                          {item.type === 'course' ? 'Curso' : 'Vídeo'}
                        </Badge>
                        {item.completed && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Concluído
                          </Badge>
                        )}
                      </div>

                      {/* Description */}
                      {item.description && (
                        <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                          {item.description}
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {item.category && (
                          <span>{item.category}</span>
                        )}
                        {item.instructor && (
                          <span>{item.instructor}</span>
                        )}
                        <span>{formatDuration(item.watchDuration)} assistidos</span>
                        {item.duration && (
                          <span>de {formatDuration(item.duration)}</span>
                        )}
                        <span>{formatDate(item.viewedAt)}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {item.duration > 0 && (
                      <div className="w-24 flex flex-col items-end gap-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all duration-300",
                              item.completed ? "bg-green-500" : "bg-blue-500"
                            )}
                            style={{
                              width: `${Math.min((item.watchDuration / item.duration) * 100, 100)}%`
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round((item.watchDuration / item.duration) * 100)}%
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShare?.(item);
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        // Grid View
        <div className={cn('grid gap-4', gridColsClass[gridCols])}>
          {displayItems.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => onItemClick?.(item)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-white opacity-50" />
                  </div>
                )}

                {/* Type Badge */}
                <div className="absolute top-2 left-2">
                  <Badge
                    variant={item.type === 'course' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {item.type === 'course' ? 'Curso' : 'Vídeo'}
                  </Badge>
                </div>

                {/* Completion Status */}
                {item.completed && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-green-500 text-white p-1 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                {item.duration > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-30">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        item.completed ? "bg-green-500" : "bg-blue-500"
                      )}
                      style={{
                        width: `${Math.min((item.watchDuration / item.duration) * 100, 100)}%`
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                {/* Title */}
                <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                {/* Metadata */}
                <div className="space-y-1 text-xs text-gray-500">
                  {item.category && (
                    <div>{item.category}</div>
                  )}
                  {item.instructor && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{item.instructor}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Timer className="w-3 h-3" />
                    <span>{formatDuration(item.watchDuration)}</span>
                    {item.duration && (
                      <span>de {formatDuration(item.duration)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.viewedAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && filteredItems.length >= maxItems && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            className="flex items-center gap-2 mx-auto"
          >
            {loading ? 'Carregando...' : 'Carregar mais'}
          </Button>
        </div>
      )}

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Limpar Histórico?</h3>
                <p className="text-sm text-gray-600">Esta ação não pode ser desfeita</p>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onClearHistory?.('video')}
              >
                Limpar apenas vídeos
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onClearHistory?.('course')}
              >
                Limpar apenas cursos
              </Button>
              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => {
                  onClearHistory?.('all');
                  setShowClearConfirm(false);
                }}
              >
                Limpar tudo
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Item Actions Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Ações</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  onItemClick?.(selectedItem);
                  setSelectedItem(null);
                }}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Assistir novamente
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  onShare?.(selectedItem);
                  setSelectedItem(null);
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>

              {selectedItem.type === 'video' && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    onDownload?.(selectedItem);
                    setSelectedItem(null);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for sidebars
export function ViewHistoryCompact({
  items,
  onItemClick,
  className,
  maxItems = 5
}: {
  items: ViewHistoryItem[];
  onItemClick?: (item: ViewHistoryItem) => void;
  className?: string;
  maxItems?: number;
}) {
  const displayItems = items.slice(0, maxItems);

  if (displayItems.length === 0) {
    return null;
  }

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}d`;
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 px-1">
        <Clock className="w-4 h-4 text-blue-600" />
        <h3 className="font-medium text-gray-900 text-sm">Recentes</h3>
      </div>

      {displayItems.map((item) => (
        <div
          key={item.id}
          className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => onItemClick?.(item)}
        >
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-12 h-12 object-cover rounded flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex-shrink-0 flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-white opacity-50" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
              {item.title}
            </h4>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatTime(item.viewedAt)}</span>
              {item.completed && (
                <CheckCircle className="w-3 h-3 text-green-500" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}