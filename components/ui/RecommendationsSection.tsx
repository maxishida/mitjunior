'use client';

import React, { useState } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  Sparkles,
  PlayCircle,
  ThumbsUp,
  ThumbsDown,
  X,
  Search,
  Filter,
  RefreshCw,
  Star,
  Eye,
  Clock,
  Users,
  BookOpen,
  Video,
  ChevronRight,
  Heart,
  Share2,
  MoreVertical,
  Zap,
  Fire,
  Trophy,
  Target
} from 'lucide-react';
import type { RecommendationItem } from '@/types';

interface RecommendationsSectionProps {
  items: RecommendationItem[];
  loading?: boolean;
  lastRefresh?: Date | null;
  className?: string;
  onItemClick?: (item: RecommendationItem) => void;
  onInteraction?: (itemId: string, interaction: 'click' | 'dismiss' | 'not_interested') => void;
  onRefresh?: () => void;
  onShare?: (item: RecommendationItem) => void;
  maxItems?: number;
  showViewAll?: boolean;
  compact?: boolean;
  gridCols?: 2 | 3 | 4 | 5;
  showReasons?: boolean;
  showScores?: boolean;
}

type FilterType = 'all' | 'trending' | 'similar' | 'continue' | 'new' | 'recommended';
type ViewMode = 'grid' | 'list' | 'carousel';

export function RecommendationsSection({
  items,
  loading = false,
  lastRefresh = null,
  className,
  onItemClick,
  onInteraction,
  onRefresh,
  onShare,
  maxItems = 12,
  showViewAll = true,
  compact = false,
  gridCols = 4,
  showReasons = true,
  showScores = false
}: RecommendationsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [dismissedItems, setDismissedItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter items
  const filteredItems = items
    .filter(item => !dismissedItems.has(item.itemId))
    .filter(item => {
      // Reason filter
      const matchesReason = filterType === 'all' || item.reason === filterType;

      // Search filter
      const matchesSearch = !searchTerm ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.instructor?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = !selectedCategory || item.category === selectedCategory;

      return matchesReason && matchesSearch && matchesCategory;
    })
    .slice(0, maxItems);

  // Get unique categories
  const categories = Array.from(new Set(items.map(item => item.category).filter(Boolean)));

  // Group items by reason for display
  const itemsByReason = items.reduce((acc, item) => {
    if (!acc[item.reason]) {
      acc[item.reason] = [];
    }
    acc[item.reason].push(item);
    return acc;
  }, {} as Record<string, RecommendationItem[]>);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const getReasonIcon = (reason: RecommendationItem['reason']) => {
    switch (reason) {
      case 'trending':
        return <Fire className="w-4 h-4 text-orange-500" />;
      case 'similar':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'continue':
        return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'new':
        return <Zap className="w-4 h-4 text-green-500" />;
      case 'recommended':
        return <Target className="w-4 h-4 text-red-500" />;
      default:
        return <Star className="w-4 h-4 text-gray-500" />;
    }
  };

  const getReasonLabel = (reason: RecommendationItem['reason']) => {
    switch (reason) {
      case 'trending':
        return 'Em Alta';
      case 'similar':
        return 'Similares';
      case 'continue':
        return 'Continuar';
      case 'new':
        return 'Novidades';
      case 'recommended':
        return 'Recomendados';
      default:
        return 'Para Você';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600 bg-green-100';
    if (score >= 0.7) return 'text-blue-600 bg-blue-100';
    if (score >= 0.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const handleDismiss = (itemId: string) => {
    setDismissedItems(prev => new Set([...prev, itemId]));
    onInteraction?.(itemId, 'dismiss');
  };

  const handleNotInterested = (itemId: string) => {
    setDismissedItems(prev => new Set([...prev, itemId]));
    onInteraction?.(itemId, 'not_interested');
  };

  const gridColsClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
  };

  // Loading state
  if (loading && items.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recomendados para Você</h2>
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
        <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Sem recomendações no momento</h3>
        <p className="text-sm">
          Assista a mais conteúdo para receber recomendações personalizadas
        </p>
      </div>
    );
  }

  // No results after filtering
  if (filteredItems.length === 0 && !loading) {
    return (
      <div className={cn('text-center py-8 text-gray-500', className)}>
        <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <h3 className="text-lg font-medium mb-2">Nenhuma recomendação encontrada</h3>
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
          <Target className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">Recomendados para Você</h2>
          {lastRefresh && (
            <span className="text-sm text-gray-500">
              Atualizado {new Date(lastRefresh).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </Button>

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm" />
                <div className="bg-current rounded-sm" />
                <div className="bg-current rounded-sm" />
                <div className="bg-current rounded-sm" />
              </div>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <div className="w-4 h-4 space-y-1">
                <div className="bg-current h-0.5 rounded" />
                <div className="bg-current h-0.5 rounded" />
                <div className="bg-current h-0.5 rounded" />
              </div>
            </Button>
          </div>

          {showViewAll && items.length > maxItems && (
            <Button variant="outline" size="sm">
              Ver todos
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar recomendações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todas categorias</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}

          {/* Reason Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todos os tipos</option>
            <option value="trending">Em Alta</option>
            <option value="similar">Similares</option>
            <option value="continue">Continuar</option>
            <option value="new">Novidades</option>
            <option value="recommended">Recomendados</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Explorar por categoria:</span>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-purple-100"
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      )}

      {/* Recommendations by Reason Groups */}
      {viewMode === 'grid' && showReasons && filterType === 'all' ? (
        <div className="space-y-8">
          {Object.entries(itemsByReason).map(([reason, reasonItems]) => {
            const visibleItems = reasonItems
              .filter(item => !dismissedItems.has(item.itemId))
              .slice(0, 6);

            if (visibleItems.length === 0) return null;

            return (
              <div key={reason} className="space-y-4">
                <div className="flex items-center gap-2">
                  {getReasonIcon(reason as RecommendationItem['reason'])}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getReasonLabel(reason as RecommendationItem['reason'])}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {reasonItems.length}
                  </Badge>
                </div>

                <div className={cn('grid gap-4', 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3')}>
                  {visibleItems.map((item) => (
                    <RecommendationCard
                      key={item.id}
                      item={item}
                      onItemClick={onItemClick}
                      onInteraction={onInteraction}
                      onDismiss={handleDismiss}
                      onNotInterested={handleNotInterested}
                      onShare={onShare}
                      showScore={showScores}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : viewMode === 'grid' ? (
        // Regular Grid View
        <div className={cn('grid gap-4', gridColsClass[gridCols])}>
          {filteredItems.map((item) => (
            <RecommendationCard
              key={item.id}
              item={item}
              onItemClick={onItemClick}
              onInteraction={onInteraction}
              onDismiss={handleDismiss}
              onNotInterested={handleNotInterested}
              onShare={onShare}
              showScore={showScores}
            />
          ))}
        </div>
      ) : (
        // List View
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <RecommendationListItem
              key={item.id}
              item={item}
              onItemClick={onItemClick}
              onInteraction={onInteraction}
              onDismiss={handleDismiss}
              onNotInterested={handleNotInterested}
              onShare={onShare}
              showScore={showScores}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {items.length > maxItems && (
        <div className="text-center pt-4">
          <Button variant="outline" className="flex items-center gap-2 mx-auto">
            Ver mais recomendações
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Individual Recommendation Card Component
function RecommendationCard({
  item,
  onItemClick,
  onInteraction,
  onDismiss,
  onNotInterested,
  onShare,
  showScore = false
}: {
  item: RecommendationItem;
  onItemClick?: (item: RecommendationItem) => void;
  onInteraction?: (itemId: string, interaction: 'click' | 'dismiss' | 'not_interested') => void;
  onDismiss?: (itemId: string) => void;
  onNotInterested?: (itemId: string) => void;
  onShare?: (item: RecommendationItem) => void;
  showScore?: boolean;
}) {
  const getReasonIcon = (reason: RecommendationItem['reason']) => {
    switch (reason) {
      case 'trending':
        return <Fire className="w-4 h-4 text-orange-500" />;
      case 'similar':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'continue':
        return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'new':
        return <Zap className="w-4 h-4 text-green-500" />;
      case 'recommended':
        return <Target className="w-4 h-4 text-red-500" />;
      default:
        return <Star className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer relative">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Target className="w-12 h-12 text-white opacity-50" />
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

        {/* Reason Badge */}
        <div className="absolute top-2 right-2">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            {getReasonIcon(item.reason)}
          </div>
        </div>

        {/* Duration */}
        {item.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(item.duration)}
          </div>
        )}

        {/* Score Badge */}
        {showScore && (
          <div className="absolute bottom-2 left-2">
            <Badge
              variant="outline"
              className={cn(
                'text-xs bg-white/90 backdrop-blur-sm',
                item.score >= 0.8 ? 'text-green-600 border-green-600' :
                item.score >= 0.6 ? 'text-blue-600 border-blue-600' :
                'text-gray-600 border-gray-600'
              )}
            >
              {Math.round(item.score * 100)}% match
            </Badge>
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
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Title */}
        <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
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
          {item.category && (
            <Badge variant="outline" className="text-xs">
              {item.category}
            </Badge>
          )}

          {/* Instructor */}
          {item.instructor && (
            <div className="text-xs text-gray-500">
              {item.instructor}
            </div>
          )}

          {/* Additional Stats */}
          {item.metadata && (
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {item.metadata.viewsCount && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{item.metadata.viewsCount.toLocaleString('pt-BR')}</span>
                </div>
              )}
              {item.metadata.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span>{item.metadata.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1 pt-2">
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 text-xs"
            onClick={() => onItemClick?.(item)}
          >
            <ThumbsUp className="w-3 h-3 mr-1" />
            Interessante
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 text-xs text-red-600"
            onClick={() => onNotInterested?.(item.itemId)}
          >
            <ThumbsDown className="w-3 h-3 mr-1" />
            Não quero
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={() => onDismiss?.(item.itemId)}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

// List Item Component
function RecommendationListItem({
  item,
  onItemClick,
  onInteraction,
  onDismiss,
  onNotInterested,
  onShare,
  showScore = false
}: {
  item: RecommendationItem;
  onItemClick?: (item: RecommendationItem) => void;
  onInteraction?: (itemId: string, interaction: 'click' | 'dismiss' | 'not_interested') => void;
  onDismiss?: (itemId: string) => void;
  onNotInterested?: (itemId: string) => void;
  onShare?: (item: RecommendationItem) => void;
  showScore?: boolean;
}) {
  const getReasonIcon = (reason: RecommendationItem['reason']) => {
    switch (reason) {
      case 'trending':
        return <Fire className="w-4 h-4 text-orange-500" />;
      case 'similar':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'continue':
        return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'new':
        return <Zap className="w-4 h-4 text-green-500" />;
      case 'recommended':
        return <Target className="w-4 h-4 text-red-500" />;
      default:
        return <Star className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-all cursor-pointer">
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
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Target className="w-6 h-6 text-white opacity-50" />
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
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                  {item.description}
                </p>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  {getReasonIcon(item.reason)}
                </div>
                {item.category && (
                  <span>{item.category}</span>
                )}
                {item.instructor && (
                  <span>{item.instructor}</span>
                )}
                {item.duration && (
                  <span>{formatDuration(item.duration)}</span>
                )}
              </div>
            </div>

            {/* Score and Actions */}
            <div className="flex items-center gap-2">
              {showScore && (
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    item.score >= 0.8 ? 'text-green-600 border-green-600' :
                    item.score >= 0.6 ? 'text-blue-600 border-blue-600' :
                    'text-gray-600 border-gray-600'
                  )}
                >
                  {Math.round(item.score * 100)}%
                </Badge>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onShare?.(item)}
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDismiss?.(item.itemId)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Compact version for sidebars
export function RecommendationsCompact({
  items,
  onItemClick,
  className,
  maxItems = 5
}: {
  items: RecommendationItem[];
  onItemClick?: (item: RecommendationItem) => void;
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
        <Target className="w-4 h-4 text-purple-600" />
        <h3 className="font-medium text-gray-900 text-sm">Recomendados</h3>
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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded flex-shrink-0 flex items-center justify-center">
              <Target className="w-6 h-6 text-white opacity-50" />
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