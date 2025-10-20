'use client';

import { useState } from 'react';
import InternalNavigation from '@/components/layout/InternalNavigation';
import ContentCarousel from '@/components/content/ContentCarousel';
import ContinueWatching from '@/components/content/ContinueWatching';
import { DashboardHero } from '@/components/app/DashboardHero';
import { DashboardStatsRow, type DashboardStat } from '@/components/app/DashboardStatsRow';
import type { Course, Video } from '@/types/course';

const mockFeaturedCourse: Course = {
  id: '1',
  title: 'Investimentos do Zero ao Milhão',
  description:
    'Aprenda a construir uma carteira de investimentos sólida e rentável do zero com as estratégias que transformaram milhares de alunos.',
  thumbnail: '/landing-page-full.png',
  thumbnailBlur: '',
  duration: 1200,
  level: 'iniciante',
  instructor: {
    id: '1',
    name: 'Mitsuo Ishida',
    avatar: '/instructors/mitsuo.jpg',
    bio: 'Especialista em finanças pessoais com 15 anos de experiência',
  },
  category: 'Investimentos',
  tags: ['investimentos', 'renda-variavel', 'planejamento'],
  rating: 4.9,
  studentsCount: 15420,
  price: 297,
  promotionalPrice: 197,
  isFeatured: true,
  isNew: false,
  progress: 42,
  totalLessons: 45,
  completedLessons: 12,
  certificateAvailable: true,
  createdAt: '2024-01-15',
  updatedAt: '2024-01-15',
};

const mockContinueWatching: (Video & { course: Course })[] = [
  {
    id: 'v1',
    title: 'Introdução ao Mercado de Ações',
    description: 'Entenda os fundamentos do mercado de ações brasileiro',
    duration: 1800,
    thumbnail: '/videos/intro-stock-market.jpg',
    thumbnailBlur: '',
    courseId: '1',
    lessonNumber: 1,
    order: 1,
    course: mockFeaturedCourse,
    watchTime: 900,
    completed: false,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'v2',
    title: 'Análise Fundamentalista na Prática',
    description: 'Aprenda a analisar empresas como um profissional',
    duration: 2400,
    thumbnail: '/videos/fundamental-analysis.jpg',
    thumbnailBlur: '',
    courseId: '2',
    lessonNumber: 5,
    order: 5,
    course: {
      ...mockFeaturedCourse,
      id: '2',
      title: 'Análise de Investimentos Avançada',
    },
    watchTime: 1200,
    completed: false,
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14',
  },
];

const mockCategories = [
  {
    id: 'investimentos',
    title: 'Trilhas de Investimentos',
    courses: [
      { ...mockFeaturedCourse, id: '1' },
      { ...mockFeaturedCourse, id: '2', title: 'Fundos Imobiliários', category: 'Fundos' },
      { ...mockFeaturedCourse, id: '3', title: 'Tesouro Direto', category: 'Renda Fixa' },
      { ...mockFeaturedCourse, id: '4', title: 'Criptomoedas', category: 'Cripto' },
      { ...mockFeaturedCourse, id: '5', title: 'Ações Internacionais', category: 'Ações' },
    ],
  },
  {
    id: 'impostos',
    title: 'Especial IR & Tributos',
    courses: [
      { ...mockFeaturedCourse, id: '6', title: 'Declaração de IR 2025', category: 'Impostos' },
      { ...mockFeaturedCourse, id: '7', title: 'Planejamento Tributário', category: 'Impostos' },
      { ...mockFeaturedCourse, id: '8', title: 'Empresas & CNPJ', category: 'Empreendedorismo' },
      { ...mockFeaturedCourse, id: '9', title: 'Investimentos e IR', category: 'Investimentos' },
    ],
  },
  {
    id: 'financas-pessoais',
    title: 'Playlists Financeiras',
    courses: [
      { ...mockFeaturedCourse, id: '10', title: 'Orçamento Mensal', category: 'Finanças' },
      { ...mockFeaturedCourse, id: '11', title: 'Reserva de Emergência', category: 'Finanças' },
      { ...mockFeaturedCourse, id: '12', title: 'Dívidas & Crédito', category: 'Finanças' },
      { ...mockFeaturedCourse, id: '13', title: 'Metas Financeiras', category: 'Finanças' },
    ],
  },
];

export default function DashboardPage() {
  const [isMuted, setIsMuted] = useState(true);
  const heroHighlights = [
    {
      label: 'Alunos ativos',
      value: `+${Math.floor(mockFeaturedCourse.studentsCount / 1000)}k`,
      icon: 'users' as const,
      description: 'Com desafios semanais',
    },
    {
      label: 'Avaliação média',
      value: `${mockFeaturedCourse.rating?.toFixed(1) ?? '4.9'}`,
      icon: 'rating' as const,
      description: 'Baseada em feedbacks reais',
    },
    {
      label: 'Carga horária',
      value: `${Math.floor(mockFeaturedCourse.duration / 60)}h`,
      icon: 'duration' as const,
      description: `${mockFeaturedCourse.totalLessons} aulas e materiais`,
    },
  ];

  const dashboardStats: DashboardStat[] = [
    {
      label: 'Progresso geral',
      value: '62%',
      description: 'Cursos em andamento',
      icon: 'trend',
    },
    {
      label: 'Tempo assistido',
      value: '24h',
      description: 'Últimas 4 semanas',
      icon: 'clock',
    },
    {
      label: 'Sequência ativa',
      value: '12 dias',
      description: 'Rumo ao novo recorde',
      icon: 'streak',
    },
    {
      label: 'Meta do mês',
      value: '5 módulos',
      description: '2 concluídos até agora',
      icon: 'target',
    },
  ];

  const handlePlayFeatured = () => {
    /* TODO: integrar player */
    console.log('Assistir módulo destaque');
  };

  const handleMoreInfo = () => {
    console.log('Abrir modal de detalhes');
  };

  const handleSaveCourse = () => {
    console.log('Salvar curso na lista');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#040608] via-[#05080d] to-[#020305] text-white">
      <InternalNavigation />

      <div className="mx-auto w-full max-w-7xl space-y-16 px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <DashboardHero
          course={mockFeaturedCourse}
          highlights={heroHighlights}
          isMuted={isMuted}
          onToggleMuted={() => setIsMuted((prev) => !prev)}
          onPlay={handlePlayFeatured}
          onMoreInfo={handleMoreInfo}
          onSaveCourse={handleSaveCourse}
        />

        <DashboardStatsRow stats={dashboardStats} />

        {mockContinueWatching.length > 0 && (
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_-50px_rgba(0,0,0,0.85)] backdrop-blur">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-primary">Continue de onde parou</p>
                <h2 className="text-2xl font-bold text-white">Retomar suas aulas</h2>
              </div>
              <button
                type="button"
                className="self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-300 transition-colors duration-200 hover:border-primary/40 hover:text-white"
              >
                Ver histórico
              </button>
            </div>
            <ContinueWatching videos={mockContinueWatching} />
          </section>
        )}

        {mockCategories.map((category, index) => (
          <section
            key={category.id}
            className="rounded-[2.25rem] border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent p-6 shadow-[0_25px_80px_-60px_rgba(0,0,0,0.85)] backdrop-blur"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-primary">
                  {index === 0 ? 'Trilhas para acelerar' : index === 1 ? 'Especialista responde' : 'Para o seu momento'}
                </p>
                <h2 className="text-2xl font-bold text-white">{category.title}</h2>
              </div>
              <a
                href={`/app/cursos?categoria=${category.id}`}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-300 transition-colors duration-200 hover:border-primary/40 hover:text-white"
              >
                Ver tudo
              </a>
            </div>
            <ContentCarousel
              title=""
              courses={category.courses}
              itemsPerPage={4}
            />
          </section>
        ))}

        <section className="rounded-[2.25rem] border border-white/10 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-6 shadow-[0_25px_80px_-65px_rgba(0,200,150,0.65)] backdrop-blur">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-primary">Recomendações 360º</p>
              <h2 className="text-2xl font-bold text-white">Feito para você</h2>
            </div>
            <a
              href="/app/cursos"
              className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary transition-colors duration-200 hover:bg-primary/20 hover:text-white"
            >
              Explorar catálogo
            </a>
          </div>
          <ContentCarousel
            title=""
            courses={mockCategories.flatMap((cat) => cat.courses).slice(0, 6)}
            itemsPerPage={4}
          />
        </section>
      </div>
    </div>
  );
}
