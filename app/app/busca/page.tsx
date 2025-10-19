'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import InternalNavigation from '@/components/layout/InternalNavigation';
import ContentCarousel from '@/components/content/ContentCarousel';
import {
  Search,
  Filter,
  X,
  Clock,
  Star,
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  Calendar,
  ChevronDown,
  Grid,
  List
} from 'lucide-react';
import type { Course, CourseSearchFilters } from '@/types/course';

// Mock data - substituir com chamadas de API
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Investimentos do Zero ao Milhão',
    description: 'Aprenda a construir uma carteira de investimentos sólida e rentável do zero',
    thumbnail: '/courses/investments-hero.jpg',
    duration: 1200,
    level: 'iniciante',
    instructor: {
      id: '1',
      name: 'Mitsuo Ishida',
      bio: 'Especialista em finanças pessoais com 15 anos de experiência'
    },
    category: 'investimentos',
    tags: ['investimentos', 'Renda Variável', 'FIIs'],
    rating: 4.9,
    studentsCount: 15420,
    price: 297,
    promotionalPrice: 197,
    isFeatured: true,
    isNew: false,
    totalLessons: 45,
    completedLessons: 0,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Declaração de Imposto de Renda Completa',
    description: 'Guia completo para declarar seu imposto de renda sem erros',
    thumbnail: '/courses/tax-declaration.jpg',
    duration: 900,
    level: 'iniciante',
    instructor: {
      id: '1',
      name: 'Mitsuo Ishida',
      bio: 'Especialista em finanças pessoais com 15 anos de experiência'
    },
    category: 'impostos',
    tags: ['IR', 'Declaração', 'Malha Fina'],
    rating: 4.8,
    studentsCount: 8930,
    price: 147,
    promotionalPrice: 97,
    isFeatured: false,
    isNew: true,
    totalLessons: 25,
    completedLessons: 0,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01'
  },
  // Adicionar mais cursos mockados...
];

const categories = [
  { id: 'investimentos', name: 'Investimentos', count: 45 },
  { id: 'impostos', name: 'Impostos', name: 23 },
  { id: 'financas-pessoais', name: 'Finanças Pessoais', count: 32 },
  { id: 'empreendedorismo', name: 'Empreendedorismo', count: 18 },
  { id: 'crypto', name: 'Criptomoedas', count: 15 },
  { id: 'previdencia', name: 'Previdência', count: 12 }
];

const levels = [
  { id: 'iniciante', name: 'Iniciante' },
  { id: 'intermediario', name: 'Intermediário' },
  { id: 'avancado', name: 'Avançado' }
];

const sortOptions = [
  { id: 'recent', name: 'Mais Recentes' },
  { id: 'popular', name: 'Mais Populares' },
  { id: 'rating', name: 'Melhor Avaliados' },
  { id: 'price-low', name: 'Menor Preço' },
  { id: 'price-high', name: 'Maior Preço' },
  { id: 'duration', name: 'Duração' }
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<CourseSearchFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hasCertificate, setHasCertificate] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState('popular');

  // Search and filter logic
  const filteredCourses = useMemo(() => {
    let filtered = [...mockCourses];

    // Text search
    if (query) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower) ||
        course.instructor.name.toLowerCase().includes(searchLower) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(course =>
        selectedCategories.includes(course.category)
      );
    }

    // Level filter
    if (selectedLevel) {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    // Price filter
    filtered = filtered.filter(course => {
      const price = course.promotionalPrice || course.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Rating filter
    if (selectedRating > 0) {
      filtered = filtered.filter(course =>
        course.rating && course.rating >= selectedRating
      );
    }

    // Certificate filter
    if (hasCertificate !== null) {
      filtered = filtered.filter(course =>
        course.certificateAvailable === hasCertificate
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'popular':
          return b.studentsCount - a.studentsCount;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'price-low':
          return (a.promotionalPrice || a.price) - (b.promotionalPrice || b.price);
        case 'price-high':
          return (b.promotionalPrice || b.price) - (a.promotionalPrice || a.price);
        case 'duration':
          return a.duration - b.duration;
        default:
          return 0;
      }
    });

    return filtered;
  }, [query, selectedCategories, selectedLevel, priceRange, selectedRating, hasCertificate, sortBy]);

  const performSearch = () => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLevel('');
    setPriceRange([0, 1000]);
    setSelectedRating(0);
    setHasCertificate(null);
    setSortBy('popular');
  };

  const activeFiltersCount =
    selectedCategories.length +
    (selectedLevel ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0) +
    (selectedRating > 0 ? 1 : 0) +
    (hasCertificate !== null ? 1 : 0);

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <InternalNavigation />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Header */}
        <div className="bg-neutral-800 rounded-lg p-6 mb-6 border border-neutral-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                placeholder="Buscar cursos, aulas, instrutores..."
                className="w-full pl-10 pr-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Search and Filter Buttons */}
            <div className="flex gap-3">
              <button
                onClick={performSearch}
                className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors"
              >
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
              >
                <Filter className="w-5 h-5" />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 bg-brand-500 rounded-full text-xs">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="px-4 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-700">
            <p className="text-neutral-300">
              {query ? `"${query}"` : 'Todos os cursos'} •{' '}
              <span className="text-white font-semibold">{filteredCourses.length}</span> resultado{filteredCourses.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-neutral-800 rounded-lg p-6 mb-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Filtros</h3>
              <button
                onClick={clearFilters}
                className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
              >
                Limpar todos
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Categories */}
              <div>
                <h4 className="text-white font-medium mb-3">Categorias</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, category.id]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                          }
                        }}
                        className="w-4 h-4 text-brand-500 rounded focus:ring-brand-500"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-neutral-300">{category.name}</span>
                        <span className="text-xs text-neutral-500">({category.count})</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level */}
              <div>
                <h4 className="text-white font-medium mb-3">Nível</h4>
                <div className="space-y-2">
                  {levels.map(level => (
                    <label key={level.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="level"
                        checked={selectedLevel === level.id}
                        onChange={() => setSelectedLevel(level.id)}
                        className="w-4 h-4 text-brand-500 focus:ring-brand-500"
                      />
                      <span className="text-neutral-300">{level.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-white font-medium mb-3">Faixa de Preço</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-neutral-400">R$</span>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="flex-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Mínimo"
                    />
                    <span className="text-neutral-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                      className="flex-1 px-3 py-2 bg-neutral-700 border border-neutral-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Máximo"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={priceRange[0] === 0 && priceRange[1] === 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPriceRange([0, 0]);
                          }
                        }}
                        className="w-4 h-4 text-brand-500 rounded focus:ring-brand-500"
                      />
                      <span className="text-neutral-300">Grátis</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="text-white font-medium mb-3">Avaliação Mínima</h4>
                <div className="space-y-2">
                  {[0, 3, 4, 4.5].map(rating => (
                    <label key={rating} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rating}
                        onChange={() => setSelectedRating(rating)}
                        className="w-4 h-4 text-brand-500 focus:ring-brand-500"
                      />
                      <div className="flex items-center space-x-1">
                        {rating > 0 ? (
                          <>
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= rating ? 'fill-current text-yellow-400' : 'text-neutral-600'
                                }`}
                              />
                            ))}
                            <span className="text-neutral-300 ml-2">
                              {rating === 3 ? '3+ estrelas' : rating === 4 ? '4+ estrelas' : '4.5+ estrelas'}
                            </span>
                          </>
                        ) : (
                          <span className="text-neutral-300">Qualquer avaliação</span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Options */}
              <div>
                <h4 className="text-white font-medium mb-3">Opções</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasCertificate === true}
                      onChange={(e) => setHasCertificate(e.target.checked ? true : null)}
                      className="w-4 h-4 text-brand-500 rounded focus:ring-brand-500"
                    />
                    <span className="text-neutral-300">Com certificado</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasCertificate === false}
                      onChange={(e) => setHasCertificate(e.target.checked ? false : null)}
                      className="w-4 h-4 text-brand-500 rounded focus:ring-brand-500"
                    />
                    <span className="text-neutral-300">Sem certificado</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="space-y-6">
          {filteredCourses.length === 0 ? (
            <div className="bg-neutral-800 rounded-lg p-12 text-center border border-neutral-700">
              <div className="max-w-md mx-auto">
                <Search className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum resultado encontrado</h3>
                <p className="text-neutral-400 mb-4">
                  {query
                    ? `Não encontramos cursos para "${query}". Tente usar termos diferentes ou ajustar os filtros.`
                    : 'Não há cursos correspondentes aos filtros selecionados.'
                  }
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Results Grid/List */}
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {filteredCourses.map((course) => (
                  viewMode === 'grid' ? (
                    <CourseCard key={course.id} course={course} />
                  ) : (
                    <CourseListItem key={course.id} course={course} />
                  )
                ))}
              </div>

              {/* Pagination */}
              {filteredCourses.length > 0 && (
                <div className="flex items-center justify-center space-x-2 pt-6">
                  <button className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors">
                    Anterior
                  </button>
                  <span className="px-4 py-2 text-neutral-300">Página 1 de 1</span>
                  <button className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors">
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Course Card Component
function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 hover:border-brand-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/50 group cursor-pointer">
      <div className="relative aspect-video">
        <img
          src={course.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop'}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300"></div>

        <div className="absolute top-2 left-2 flex space-x-2">
          {course.isNew && (
            <span className="px-2 py-1 bg-brand-500 text-white text-xs font-bold rounded">NOVO</span>
          )}
          {course.isFeatured && (
            <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">DESTAQUE</span>
          )}
        </div>

        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-white">
          {Math.floor(course.duration / 60)}h {course.duration % 60}min
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-brand-400 transition-colors">
          {course.title}
        </h3>
        <p className="text-neutral-400 text-sm mb-3 line-clamp-2">{course.description}</p>

        <div className="flex items-center justify-between text-sm text-neutral-400 mb-3">
          <span className="flex items-center space-x-1">
            <Star className="w-3 h-3 fill-current text-yellow-400" />
            <span>{course.rating}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{course.studentsCount.toLocaleString('pt-BR')}</span>
          </span>
          <span className="capitalize">{course.level}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {course.promotionalPrice ? (
              <>
                <span className="text-lg font-bold text-brand-400">
                  R$ {course.promotionalPrice.toFixed(2)}
                </span>
                <span className="text-sm text-neutral-500 line-through">
                  R$ {course.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-white">
                R$ {course.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Course List Item Component
function CourseListItem({ course }: { course: Course }) {
  return (
    <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 hover:border-brand-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-black/50 group">
      <div className="flex space-x-4">
        <div className="relative w-48 h-28 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={course.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=112&fit=crop'}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300"></div>
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-white">
            {Math.floor(course.duration / 60)}h {course.duration % 60}min
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-white group-hover:text-brand-400 transition-colors">
                  {course.title}
                </h3>
                {course.isNew && (
                  <span className="px-2 py-1 bg-brand-500 text-white text-xs font-bold rounded">NOVO</span>
                )}
                {course.isFeatured && (
                  <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">DESTAQUE</span>
                )}
              </div>
              <p className="text-neutral-300 mb-3 line-clamp-2">{course.description}</p>

              <div className="flex items-center space-x-4 text-sm text-neutral-400">
                <span className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  <span>{course.rating}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{course.studentsCount.toLocaleString('pt-BR')} alunos</span>
                </span>
                <span className="capitalize">{course.level}</span>
                <span>{course.totalLessons} aulas</span>
              </div>
            </div>

            <div className="text-right ml-6">
              <div className="flex items-center space-x-2 mb-2">
                {course.promotionalPrice ? (
                  <>
                    <span className="text-2xl font-bold text-brand-400">
                      R$ {course.promotionalPrice.toFixed(2)}
                    </span>
                    <span className="text-lg text-neutral-500 line-through">
                      R$ {course.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-white">
                    R$ {course.price.toFixed(2)}
                  </span>
                )}
              </div>
              <button className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors">
                Ver Curso
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}