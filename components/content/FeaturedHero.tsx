'use client';

import { useState, useEffect } from 'react';
import { Play, Info, Plus, Volume2, VolumeX, Star, Users, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Course } from '@/types/course';

interface FeaturedHeroProps {
  course: Course;
  autoPlay?: boolean;
}

export default function FeaturedHero({ course, autoPlay = false }: FeaturedHeroProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    // Here you would typically start video playback
  };

  const handleInfo = () => {
    // Navigate to course details or open modal
    window.location.href = `/app/cursos/${course.id}`;
  };

  const handleAddToList = () => {
    // Add course to user's watchlist
    console.log('Added to watchlist:', course.id);
  };

  return (
    <section className={`
      relative h-[70vh] min-h-[600px] overflow-hidden
      transition-all duration-1000 ease-out
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    `}>
      {/* Background Layers */}
      <div className="absolute inset-0">
        {/* Base Background Image */}
        <div className="absolute inset-0">
          <Image
            src={course.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&h=1080&fit=crop'}
            alt={course.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />

          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3">
                {course.isNew && (
                  <span className="inline-flex items-center px-3 py-1 bg-brand-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                    Lançamento
                  </span>
                )}
                {course.isFeatured && (
                  <span className="inline-flex items-center px-3 py-1 bg-yellow-500 text-black text-xs font-bold uppercase tracking-wider rounded-full">
                    Em Destaque
                  </span>
                )}
                <span className="inline-flex items-center px-3 py-1 bg-neutral-700/50 backdrop-blur-sm text-neutral-300 text-xs font-medium rounded-full border border-neutral-600">
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight">
                {course.title}
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-neutral-200 leading-relaxed max-w-lg">
                {course.description}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {course.rating && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span className="text-white font-medium">{course.rating}</span>
                    <span className="text-neutral-400">média</span>
                  </div>
                )}

                <div className="flex items-center space-x-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg">
                  <Users className="w-4 h-4 text-neutral-400" />
                  <span className="text-white">{course.studentsCount.toLocaleString('pt-BR')}</span>
                  <span className="text-neutral-400">alunos</span>
                </div>

                <div className="flex items-center space-x-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <span className="text-white">
                    {Math.floor(course.duration / 60)}h {course.duration % 60}min
                  </span>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {course.instructor.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{course.instructor.name}</p>
                  <p className="text-neutral-400 text-sm">{course.instructor.bio}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link href={`/app/cursos/${course.id}/aula/1`}>
                  <button
                    onClick={handlePlay}
                    className="group flex items-center space-x-3 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-brand-500/25"
                  >
                    <div className="p-2 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-lg">Assistir Agora</span>
                  </button>
                </Link>

                <button
                  onClick={handleInfo}
                  className="flex items-center space-x-3 px-8 py-4 bg-neutral-700/50 hover:bg-neutral-700 text-white font-semibold rounded-lg transition-all duration-300 backdrop-blur-sm border border-neutral-600 hover:border-neutral-500"
                >
                  <Info className="w-5 h-5" />
                  <span className="text-lg">Mais Informações</span>
                </button>

                <button
                  onClick={handleAddToList}
                  className="p-4 bg-neutral-700/50 hover:bg-neutral-700 text-white rounded-lg transition-all duration-300 backdrop-blur-sm border border-neutral-600 hover:border-neutral-500"
                  title="Adicionar à minha lista"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Pricing */}
              <div className="flex items-center space-x-3">
                {course.promotionalPrice ? (
                  <>
                    <span className="text-2xl font-bold text-brand-400">
                      R$ {course.promotionalPrice.toFixed(2)}
                    </span>
                    <span className="text-lg text-neutral-400 line-through">
                      R$ {course.price.toFixed(2)}
                    </span>
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">
                      {Math.round((1 - course.promotionalPrice / course.price) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-white">
                    R$ {course.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Right Column - Visual Element (Optional) */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Course Visual Card */}
                <div className="relative bg-neutral-800/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-700 hover:border-brand-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/10">
                  {/* Preview Thumbnail */}
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                    <Image
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop'}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <button
                        onClick={handlePlay}
                        className="p-4 bg-brand-500 rounded-full hover:scale-110 transition-transform"
                      >
                        <Play className="w-8 h-8 text-white fill-current ml-1" />
                      </button>
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-neutral-700/50 rounded-lg">
                      <p className="text-2xl font-bold text-white">{course.totalLessons}</p>
                      <p className="text-xs text-neutral-400">Aulas</p>
                    </div>
                    <div className="p-3 bg-neutral-700/50 rounded-lg">
                      <p className="text-2xl font-bold text-white">{course.certificateAvailable ? '✓' : '-'}</p>
                      <p className="text-xs text-neutral-400">Certificado</p>
                    </div>
                    <div className="p-3 bg-neutral-700/50 rounded-lg">
                      <p className="text-2xl font-bold text-white">{course.rating}</p>
                      <p className="text-xs text-neutral-400">Avaliação</p>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-brand-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mute Control */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-8 right-8 z-30 p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110"
        title={isMuted ? "Ativar som" : "Desativar som"}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-900 to-transparent pointer-events-none"></div>
    </section>
  );
}