'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Clock, Star, Users, Lock, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Course } from '@/types/course';

interface ContentCarouselProps {
  title: string;
  courses: Course[];
  seeAllHref?: string;
  itemsPerPage?: number;
}

export default function ContentCarousel({
  title,
  courses,
  seeAllHref,
  itemsPerPage = 6,
}: ContentCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex + itemsPerPage < courses.length;

  const scrollLeft = () => {
    if (canScrollLeft) {
      setCurrentIndex((value) => value - 1);
    }
  };

  const scrollRight = () => {
    if (canScrollRight) {
      setCurrentIndex((value) => value + 1);
    }
  };

  const visibleCourses = courses.slice(currentIndex, currentIndex + itemsPerPage);
  const showHeader = Boolean(title?.trim()) || Boolean(seeAllHref);

  return (
    <div className="relative">
      {showHeader ? (
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {title?.trim() && <h2 className="text-2xl font-bold text-white">{title}</h2>}
            {seeAllHref && (
              <Link
                href={seeAllHref}
                className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
              >
                Ver todos �+'
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <CarouselButton direction="left" disabled={!canScrollLeft} onClick={scrollLeft} />
            <CarouselButton direction="right" disabled={!canScrollRight} onClick={scrollRight} />
          </div>
        </div>
      ) : (
        <div className="mb-4 flex items-center justify-end gap-2">
          <CarouselButton direction="left" disabled={!canScrollLeft} onClick={scrollLeft} />
          <CarouselButton direction="right" disabled={!canScrollRight} onClick={scrollRight} />
        </div>
      )}

      <div className="relative overflow-hidden">
        <div className="flex space-x-4 transition-transform duration-300 ease-out">
          {visibleCourses.map((course, index) => (
            <CourseCard key={`${course.id}-${index}`} course={course} index={index} />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-900 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-neutral-900 to-transparent" />
    </div>
  );
}

interface CarouselButtonProps {
  direction: 'left' | 'right';
  disabled: boolean;
  onClick: () => void;
}

function CarouselButton({ direction, disabled, onClick }: CarouselButtonProps) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        p-2 rounded-full transition-all duration-200
        ${disabled ? 'bg-neutral-800/30 text-neutral-600 cursor-not-allowed' : 'bg-neutral-800 hover:bg-neutral-700 text-white'}
      `}
      type="button"
      aria-label={direction === 'left' ? 'Cursos anteriores' : 'Próximos cursos'}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

interface CourseCardProps {
  course: Course;
  index: number;
}

function CourseCard({ course, index }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const progressPercentage =
    course.totalLessons > 0 ? (course.completedLessons / course.totalLessons) * 100 : 0;

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link href={`/app/cursos/${course.id}`}>
        <div className="relative">
          <div
            className={`relative overflow-hidden rounded-3xl transition-all duration-300 ease-out ${
              isHovered ? 'scale-105 shadow-2xl shadow-black/40' : 'scale-100 shadow-lg shadow-black/20'
            }`}
          >
            <div className="relative aspect-video w-64 sm:w-72 lg:w-80">
              <Image
                src={
                  course.thumbnail ||
                  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop'
                }
                alt={course.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 16rem, (max-width: 1024px) 18rem, 20rem"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="absolute top-2 right-2 rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur">
                {Math.floor(course.duration / 60)}h {course.duration % 60}min
              </div>

              <div className="absolute top-2 left-2 flex flex-col space-y-1">
                {course.isNew && (
                  <span className="rounded-full bg-primary px-2 py-1 text-xs font-bold text-black">NOVO</span>
                )}
                {course.isFeatured && (
                  <span className="rounded-full bg-yellow-400 px-2 py-1 text-xs font-bold text-black">
                    DESTAQUE
                  </span>
                )}
                {course.isLocked && (
                  <span className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white">
                    <Lock className="h-3 w-3" />
                    Premium
                  </span>
                )}
              </div>

              <div
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                  isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
              >
                <div className="rounded-full bg-primary p-4 shadow-xl shadow-primary/40">
                  <Play className="h-8 w-8 text-white" aria-hidden="true" />
                </div>
              </div>

              {course.progress && course.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              )}
            </div>

            <div
              className={`absolute bottom-0 left-0 right-0 translate-y-4 bg-gradient-to-t from-black/90 to-transparent p-4 transition-all duration-300 ${
                isHovered ? 'translate-y-0 opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="space-y-2">
                <h3 className="line-clamp-1 text-lg font-bold text-white">{course.title}</h3>
                <p className="line-clamp-2 text-sm text-neutral-200">{course.description}</p>
                <div className="flex items-center justify-between text-xs text-neutral-300">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{course.studentsCount.toLocaleString('pt-BR')}</span>
                    </span>
                  </div>
                  {course.completedLessons > 0 && (
                    <span className="flex items-center space-x-1">
                      <Check className="h-3 w-3 text-primary" />
                      <span>
                        {course.completedLessons}/{course.totalLessons}
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {course.promotionalPrice ? (
                    <>
                      <span className="text-lg font-bold text-primary">
                        R$ {course.promotionalPrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-neutral-400 line-through">
                        R$ {course.price.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-white">R$ {course.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 px-1">
            <h3 className="text-sm font-semibold text-white line-clamp-2 transition-colors group-hover:text-primary">
              {course.title}
            </h3>
            <div className="mt-1 flex items-center space-x-2">
              <span className="text-xs text-neutral-400">{course.category}</span>
              {course.rating && (
                <>
                  <span className="text-neutral-600">•</span>
                  <span className="flex items-center space-x-1 text-xs text-neutral-400">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
