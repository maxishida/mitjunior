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
  itemsPerPage = 6
}: ContentCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex + itemsPerPage < courses.length;

  const scrollLeft = () => {
    if (canScrollLeft) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const scrollRight = () => {
    if (canScrollRight) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const visibleCourses = courses.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
            >
              Ver todos →
            </Link>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`
              p-2 rounded-full transition-all duration-200
              ${canScrollLeft
                ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                : 'bg-neutral-800/30 text-neutral-600 cursor-not-allowed'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`
              p-2 rounded-full transition-all duration-200
              ${canScrollRight
                ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                : 'bg-neutral-800/30 text-neutral-600 cursor-not-allowed'
              }
            `}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div className="flex space-x-4 transition-transform duration-300 ease-out">
          {visibleCourses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      </div>

      {/* Gradient Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-neutral-900 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-neutral-900 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
}

interface CourseCardProps {
  course: Course;
  index: number;
}

function CourseCard({ course, index }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const progressPercentage = course.totalLessons > 0 ? (course.completedLessons / course.totalLessons) * 100 : 0;

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 100}ms`
      }}
    >
      <Link href={`/app/cursos/${course.id}`}>
        <div className="relative">
          {/* Card Container */}
          <div className={`
            relative overflow-hidden rounded-lg transition-all duration-300 ease-out
            ${isHovered ? 'scale-105 shadow-2xl z-20' : 'scale-100 shadow-lg'}
          `}>
            {/* Thumbnail */}
            <div className="relative aspect-video w-64 sm:w-72 lg:w-80">
              <Image
                src={course.thumbnail || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop'}
                alt={course.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 16rem, (max-width: 1024px) 18rem, 20rem"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Duration Badge */}
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs text-white">
                {Math.floor(course.duration / 60)}h {course.duration % 60}min
              </div>

              {/* New/Featured Badges */}
              <div className="absolute top-2 left-2 flex flex-col space-y-1">
                {course.isNew && (
                  <span className="px-2 py-1 bg-brand-500 text-white text-xs font-bold rounded">
                    NOVO
                  </span>
                )}
                {course.isFeatured && (
                  <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded">
                    DESTAQUE
                  </span>
                )}
              </div>

              {/* Play Button on Hover */}
              <div className={`
                absolute inset-0 flex items-center justify-center
                transition-all duration-300 transform
                ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
              `}>
                <div className="p-4 bg-brand-500 rounded-full shadow-xl">
                  <Play className="w-8 h-8 text-white fill-current ml-1" />
                </div>
              </div>

              {/* Progress Bar */}
              {course.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                  <div
                    className="h-full bg-brand-500 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              )}
            </div>

            {/* Quick Info Overlay on Hover */}
            <div className={`
              absolute bottom-0 left-0 right-0 p-4
              bg-gradient-to-t from-black/90 to-transparent
              transition-all duration-300 transform
              ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}
            `}>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white line-clamp-1">{course.title}</h3>
                <p className="text-sm text-neutral-200 line-clamp-2">{course.description}</p>

                <div className="flex items-center justify-between text-xs text-neutral-300">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current text-yellow-400" />
                      <span>{course.rating}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{course.studentsCount.toLocaleString('pt-BR')}</span>
                    </span>
                  </div>

                  {course.completedLessons > 0 && (
                    <span className="flex items-center space-x-1">
                      <Check className="w-3 h-3 text-brand-400" />
                      <span>{course.completedLessons}/{course.totalLessons}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {course.promotionalPrice ? (
                    <>
                      <span className="text-lg font-bold text-brand-400">
                        R$ {course.promotionalPrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-neutral-400 line-through">
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

          {/* Default Info (Not Hovered) */}
          <div className="mt-3 px-1">
            <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-brand-400 transition-colors">
              {course.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-neutral-400">{course.category}</span>
              {course.rating && (
                <>
                  <span className="text-neutral-600">•</span>
                  <span className="text-xs text-neutral-400 flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
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