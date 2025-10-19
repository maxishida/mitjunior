'use client';

import React, { useState } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { cn } from '@/lib/utils';
import {
  Heart,
  PlayCircle,
  MoreVertical,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Clock,
  BookOpen,
  Video,
  SortAsc,
  SortDesc,
  X,
  Share2,
  Download
} from 'lucide-react';
import type { FavoriteItem } from '@/types';

interface FavoritesSectionProps {
  items: FavoriteItem[];
  loading?: boolean;
  className?: string;
  onItemClick?: (item: FavoriteItem) => void;
  onItemRemove?: (itemId: string) => void;
  onShare?: (item: FavoriteItem) => void;
  onDownload?: (item: FavoriteItem) => void;
  maxItems?: number;
  showViewAll?: boolean;
  compact?: boolean;
  gridCols?: 1 | 2 | 3 | 4;
  showCategories?: boolean;
  showInstructors?: boolean;
}

type SortOption = 'addedAt' | 'title' | 'duration' | 'category';
type FilterType = 'all' | 'course' | 'video';
type ViewMode = 'grid' | 'list';

export function FavoritesSection({
  items,
  loading = false,
  className,
  onItemClick,
  onItemRemove,
  onShare,
  onDownload,
  maxItems = 12,
  showViewAll = true,
  compact = false,
  gridCols = 3,
  showCategories = true,
  showInstructors = true
}: FavoritesSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('addedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedItem, setSelectedItem] = useState<FavoriteItem | null>(null);

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      // Search filter
      const matchesSearch = !searchTerm ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.instructor?.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType = filterType === 'all' || item.type === filterType;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'addedAt':
          comparison = a.addedAt.getTime() - b.addedAt.getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'duration':
          comparison = (a.duration || 0) - (b.duration || 0);
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '');
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const displayItems = filteredItems.slice(0, maxItems);

  // Get unique categories for filter
  const categories = Array.from(new Set(items.map(item => item.category).filter(Boolean)));

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
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `Há ${diffDays} dias`;
    if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} sem`;
    return `Há ${Math.floor(diffDays / 30)} meses`;
  };

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  // Loading state
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Meus Favoritos</h2>
          <div className="animate-pulse bg-gray-200 h-6 w-20 rounded" />
        </div>
        <div className={cn('grid gap-4', gridColsClass[gridCols])}>
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-lg mb-3" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
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
        <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Nenhum favorito ainda</h3>
        <p className="text-sm mb-4">
          Adicione cursos e vídeos aos favoritos para encontrá-los facilmente
        </p>
      </div>
    );
  }

  // No results after filtering
  if (filteredItems.length === 0) {
    return (
      <div className={cn('text-center py-8 text-gray-500', className)}>
        <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado</h3>
        <p className="text-sm">
          Tente ajustar seus filtros ou termos de busca
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500 fill-current" />
          <h2 className="text-xl font-semibold text-gray-900">Meus Favoritos</h2>
          <Badge variant="secondary">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {showViewAll && items.length > maxItems && (
            <Button variant="outline" size="sm">
              Ver todos
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar favoritos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Type Filter */}
          <div className="flex items-center border rounded-lg">
            <Button
              variant={filterType === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilterType('all')}
              className="rounded-r-none"
            >
              Todos
            </Button>
            <Button
              variant={filterType === 'course' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilterType('course')}
              className="rounded-none border-l"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Cursos
            </Button>
            <Button
              variant={filterType === 'video' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilterType('video')}
              className="rounded-l-none border-l"
            >
              <Video className="w-4 h-4 mr-1" />
              Vídeos
            </Button>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="addedAt">Data adicionado</option>
            <option value="title">Título</option>
            <option value="duration">Duração</option>
            <option value="category">Categoria</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Category Pills */}
      {showCategories && categories.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Filtrar por categoria:</span>
          {categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setSearchTerm(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      )}

      {/* Items Grid/List */}
      {viewMode === 'grid' ? (
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
                  <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                    <Heart className="w-12 h-12 text-white opacity-50" />
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

                {/* Duration Badge */}
                {item.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(item.duration)}
                  </div>
                )}

                {/* Action Buttons Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary">
                      <PlayCircle className="w-4 h-4 mr-1" />
                      Assistir
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare?.(item);
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
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

              {/* Content */}
              <div className="p-4 space-y-2">
                {/* Title */}
                <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Metadata */}
                <div className="space-y-1">
                  {/* Category */}
                  {showCategories && item.category && (
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  )}

                  {/* Instructor */}
                  {showInstructors && item.instructor && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="w-3 h-3" />
                      <span>{item.instructor}</span>
                    </div>
                  )}

                  {/* Added Date */}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Adicionado {formatDate(item.addedAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-2">
          {displayItems.map((item) => (
            <Card
              key={item.id}
              className="p-4 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => onItemClick?.(item)}
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-white opacity-50" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
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
                      </div>

                      {/* Description */}
                      {item.description && (
                        <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                          {item.description}
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {showCategories && item.category && (
                          <span>{item.category}</span>
                        )}
                        {showInstructors && item.instructor && (
                          <span>{item.instructor}</span>
                        )}
                        {item.duration && (
                          <span>{formatDuration(item.duration)}</span>
                        )}
                        <span>Adicionado {formatDate(item.addedAt)}</span>
                      </div>
                    </div>

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
      )}

      {/* View All Button */}
      {showViewAll && filteredItems.length > maxItems && (
        <div className="text-center pt-4">
          <Button variant="outline" className="flex items-center gap-2 mx-auto">
            Ver todos os {filteredItems.length} favoritos
          </Button>
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
                  onShare?.(selectedItem);
                  setSelectedItem(null);
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>

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

              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={() => {
                  onItemRemove?.(selectedItem.itemId);
                  setSelectedItem(null);
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Remover dos favoritos
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for sidebars
export function FavoritesCompact({
  items,
  onItemClick,
  className,
  maxItems = 5
}: {
  items: FavoriteItem[];
  onItemClick?: (item: FavoriteItem) => void;
  className?: string;
  maxItems?: number;
}) {
  const displayItems = items.slice(0, maxItems);

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 px-1">
        <Heart className="w-4 h-4 text-red-500 fill-current" />
        <h3 className="font-medium text-gray-900 text-sm">Favoritos</h3>
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
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded flex-shrink-0 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white opacity-50" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
              {item.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Badge
                variant={item.type === 'course' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {item.type === 'course' ? 'Curso' : 'Vídeo'}
              </Badge>
              {item.category && (
                <span>{item.category}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}