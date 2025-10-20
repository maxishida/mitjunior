'use client';

import Image from 'next/image';
import {
  Play,
  Info,
  BookmarkPlus,
  Volume2,
  VolumeX,
  Users,
  Star,
  Clock,
} from 'lucide-react';
import type { Course } from '@/types/course';

interface HeroHighlight {
  label: string;
  value: string;
  icon: 'users' | 'rating' | 'duration' | 'custom';
  description?: string;
}

interface DashboardHeroProps {
  course: Course;
  highlights: HeroHighlight[];
  isMuted: boolean;
  onToggleMuted: () => void;
  onPlay: () => void;
  onMoreInfo?: () => void;
  onSaveCourse?: () => void;
}

const iconMap: Record<HeroHighlight['icon'], JSX.Element> = {
  users: <Users className="h-4 w-4 text-primary-400" aria-hidden="true" />,
  rating: <Star className="h-4 w-4 text-yellow-400" aria-hidden="true" />,
  duration: <Clock className="h-4 w-4 text-blue-300" aria-hidden="true" />,
  custom: <Users className="h-4 w-4 text-primary-400" aria-hidden="true" />,
};

export function DashboardHero({
  course,
  highlights,
  isMuted,
  onToggleMuted,
  onPlay,
  onMoreInfo,
  onSaveCourse,
}: DashboardHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#0b1018] via-[#0f1726] to-[#05080e] shadow-[0_35px_120px_-60px_rgba(0,0,0,0.9)]">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={course.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&h=1080&fit=crop'}
          alt={`Imagem do curso ${course.title}`}
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05080e] via-[#0b1321]/85 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,200,150,0.35),_transparent_55%)] opacity-80" />
        <div className="absolute -right-20 top-10 h-[32rem] w-[32rem] rounded-full bg-primary/15 blur-[120px]" />
      </div>

      <div className="relative z-10 layout-container py-16 sm:py-20 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
          {/* Copy */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="inline-flex items-center gap-3 self-start rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold tracking-[0.32em] uppercase text-primary">
              Curso destaque
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {course.category}
            </div>

            <div className="space-y-5">
              <h1 className="text-4xl font-black leading-tight text-white sm:text-[3.25rem]">
                {course.title}
              </h1>
              <p className="max-w-2xl text-base text-neutral-200 sm:text-lg">
                {course.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onPlay}
                className="group inline-flex items-center gap-3 rounded-2xl bg-primary px-7 py-3 text-base font-semibold text-white shadow-[0_22px_35px_-20px_rgba(0,200,150,0.7)] transition-transform duration-300 hover:translate-x-1 hover:shadow-[0_25px_45px_-20px_rgba(0,200,150,0.85)]"
                type="button"
                aria-label="Assistir agora"
              >
                <Play className="h-5 w-5 fill-white" aria-hidden="true" />
                Assistir agora
              </button>

              <button
                onClick={onMoreInfo}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-primary/60 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#05080e]"
                type="button"
              >
                <Info className="h-5 w-5 text-primary" aria-hidden="true" />
                Mais detalhes
              </button>

              <button
                onClick={onSaveCourse}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-neutral-200 transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                type="button"
              >
                <BookmarkPlus className="h-5 w-5 text-neutral-300" aria-hidden="true" />
                Salvar
              </button>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {highlights.map((highlight) => (
                <div
                  key={highlight.label}
                  className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 backdrop-blur transition-colors duration-300 hover:border-primary/40 hover:bg-black/40"
                >
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-neutral-400">
                    {iconMap[highlight.icon]}
                    {highlight.label}
                  </dt>
                  <dd className="mt-2 text-2xl font-semibold text-white">
                    {highlight.value}
                    {highlight.description && (
                      <span className="block text-xs font-medium text-neutral-400">
                        {highlight.description}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual Panel */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-white/5 blur-3xl" />

            <div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-black/55 p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.75)] backdrop-blur">
              <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10">
                <Image
                  src="/mobile-view.png"
                  alt="Visão da plataforma no mobile"
                  width={600}
                  height={1200}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/10 bg-black/80 p-4 shadow-lg shadow-black/50">
                  <p className="text-xs uppercase tracking-[0.24em] text-primary">
                    Próximo módulo
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {course.instructor?.name ?? 'Mentor convidado'}
                  </p>
                  <p className="text-xs text-neutral-400">
                    Estratégias para acelerar resultados em 30 dias
                  </p>
                </div>
              </div>

              <button
                onClick={onToggleMuted}
                className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition-colors duration-200 hover:border-primary/70 hover:bg-primary/20"
                type="button"
                aria-label={isMuted ? 'Ativar áudio' : 'Mutar áudio'}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardHero;
