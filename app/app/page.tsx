'use client';

import { useState, useEffect } from 'react';
import InternalNavigation from '@/components/layout/InternalNavigation';
import ContentCarousel from '@/components/content/ContentCarousel';
import FeaturedHero from '@/components/content/FeaturedHero';
import ContinueWatching from '@/components/content/ContinueWatching';
import { Play, Info, Plus, ThumbsUp, Volume2, VolumeX } from 'lucide-react';
import type { Course, Video, Progress } from '@/types/course';

// Mock data - substituir com dados reais da API
const mockFeaturedCourse: Course = {
  id: '1',
  title: 'Investimentos do Zero ao Milhão',
  description: 'Aprenda a construir uma carteira de investimentos sólida e rentável do zero',
  thumbnail: '/courses/investments-hero.jpg',
  thumbnailBlur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
  duration: 1200, // 20 horas em minutos
  level: 'iniciante',
  instructor: {
    id: '1',
    name: 'Mitsuo Ishida',
    avatar: '/instructors/mitsuo.jpg',
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
  progress: 0,
  totalLessons: 45,
  completedLessons: 0,
  certificateAvailable: false,
  createdAt: '2024-01-15',
  updatedAt: '2024-01-15'
};

const mockContinueWatching: (Video & { course: Course })[] = [
  {
    id: 'v1',
    title: 'Introdução ao Mercado de Ações',
    description: 'Entenda os fundamentos do mercado de ações brasileiro',
    duration: 1800, // 30 minutos
    thumbnail: '/videos/intro-stock-market.jpg',
    thumbnailBlur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    courseId: '1',
    lessonNumber: 1,
    order: 1,
    course: mockFeaturedCourse,
    watchTime: 900, // 15 minutos assistidos
    completed: false,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 'v2',
    title: 'Análise Fundamentalista na Prática',
    description: 'Aprenda a analisar empresas como um profissional',
    duration: 2400, // 40 minutos
    thumbnail: '/videos/fundamental-analysis.jpg',
    thumbnailBlur: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    courseId: '2',
    lessonNumber: 5,
    order: 5,
    course: {
      ...mockFeaturedCourse,
      id: '2',
      title: 'Análise de Investimentos Avançada'
    },
    watchTime: 1200, // 20 minutos assistidos
    completed: false,
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14'
  }
];

const mockCategories = [
  {
    id: 'investimentos',
    title: 'Investimentos',
    courses: [
      { ...mockFeaturedCourse, id: '1' },
      { ...mockFeaturedCourse, id: '2', title: 'Fundos Imobiliários', category: 'fundos' },
      { ...mockFeaturedCourse, id: '3', title: 'Tesouro Direto', category: 'renda-fixa' },
      { ...mockFeaturedCourse, id: '4', title: 'Criptomoedas', category: 'crypto' },
      { ...mockFeaturedCourse, id: '5', title: 'Ações Internacionais', category: 'acoes' },
    ]
  },
  {
    id: 'impostos',
    title: 'Impostos e Tributação',
    courses: [
      { ...mockFeaturedCourse, id: '6', title: 'Declaração de IR', category: 'impostos' },
      { ...mockFeaturedCourse, id: '7', title: 'Planejamento Tributário', category: 'impostos' },
      { ...mockFeaturedCourse, id: '8', title: 'Empresas e CNPJ', category: 'impostos' },
      { ...mockFeaturedCourse, id: '9', title: 'Investimentos e IR', category: 'impostos' },
    ]
  },
  {
    id: 'financas-pessoais',
    title: 'Finanças Pessoais',
    courses: [
      { ...mockFeaturedCourse, id: '10', title: 'Orçamento Mensal', category: 'financas' },
      { ...mockFeaturedCourse, id: '11', title: 'Emergência Financeira', category: 'financas' },
      { ...mockFeaturedCourse, id: '12', title: 'Dívidas e Crédito', category: 'financas' },
      { ...mockFeaturedCourse, id: '13', title: 'Metas Financeiras', category: 'financas' },
    ]
  }
];

export default function DashboardPage() {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <InternalNavigation />

      {/* Featured Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/50 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent z-10"></div>

          {/* Hero Background Image/Video */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&h=1080&fit=crop"
              alt="Featured course background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-transparent"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 h-full flex items-end">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-500/20 border border-brand-500/50 rounded-full mb-4">
                <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">Curso Destaque</span>
                <span className="text-brand-300 text-xs">•</span>
                <span className="text-brand-400 text-xs font-semibold">Novo</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight">
                {mockFeaturedCourse.title}
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-neutral-200 mb-6 leading-relaxed max-w-xl">
                {mockFeaturedCourse.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-300 mb-8">
                <span className="flex items-center space-x-1">
                  <span className="text-brand-400">⭐</span>
                  <span>{mockFeaturedCourse.rating}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>{mockFeaturedCourse.studentsCount.toLocaleString('pt-BR')} alunos</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>{Math.floor(mockFeaturedCourse.duration / 60)}h {mockFeaturedCourse.duration % 60}min</span>
                </span>
                <span className="px-2 py-1 bg-neutral-700/50 rounded-md text-xs font-medium uppercase">
                  {mockFeaturedCourse.level}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center space-x-2 px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-brand-500/25"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Assistir Agora</span>
                </button>

                <button className="flex items-center space-x-2 px-8 py-3 bg-neutral-700/50 hover:bg-neutral-700 text-white font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm border border-neutral-600">
                  <Info className="w-5 h-5" />
                  <span>Mais Informações</span>
                </button>

                <button className="p-3 bg-neutral-700/50 hover:bg-neutral-700 text-white rounded-lg transition-all duration-300 backdrop-blur-sm border border-neutral-600">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Controls (optional for background video) */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-8 right-8 z-30 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </section>

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Continue Watching Section */}
        {mockContinueWatching.length > 0 && (
          <section className="mb-12">
            <ContinueWatching videos={mockContinueWatching} />
          </section>
        )}

        {/* Course Categories */}
        {mockCategories.map((category, index) => (
          <section key={category.id} className={`mb-12 ${index === 0 ? '' : ''}`}>
            <ContentCarousel
              title={category.title}
              courses={category.courses}
              seeAllHref={`/app/cursos?categoria=${category.id}`}
            />
          </section>
        ))}

        {/* Recommendations Section */}
        <section className="mb-12">
          <ContentCarousel
            title="Recomendados Para Você"
            courses={mockCategories.flatMap(cat => cat.courses).slice(0, 6)}
            seeAllHref="/app/cursos"
          />
        </section>

        {/* Popular This Week */}
        <section className="mb-12">
          <ContentCarousel
            title="Populares Esta Semana"
            courses={mockCategories.flatMap(cat => cat.courses).slice(6, 12)}
            seeAllHref="/app/cursos?ordenar=popularidade"
          />
        </section>
      </main>

      {/* Footer spacing */}
      <div className="h-8"></div>
    </div>
  );
}