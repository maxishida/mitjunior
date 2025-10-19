'use client'

import * as React from "react"
import { ChevronLeft, ChevronRight, Star, Users, TrendingUp, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface Testimonial {
  id: number
  name: string
  role: string
  avatar: string
  content: string
  rating: number
  transformationTime: string
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Maria Silva",
    role: "Empreendedora",
    avatar: "https://picsum.photos/seed/maria-silva/64/64.jpg",
    content: "O método do Mitsuo me ajudou a eliminar minhas dívidas em 60 dias! Senti um alívio imenso e finalmente consigo dormir tranquila.",
    rating: 5,
    transformationTime: "Dívidas eliminadas em 60 dias"
  },
  {
    id: 2,
    name: "João Santos",
    role: "Analista Financeiro",
    avatar: "https://picsum.photos/seed/joao-santos/64/64.jpg",
    content: "Finalmente entendo de investimentos. Recomendo muito! O Mitsuo tem uma didática incrível que torna tudo simples.",
    rating: 5,
    transformationTime: "Primeiro investimento em 30 dias"
  },
  {
    id: 3,
    name: "Ana Costa",
    role: "Coordenadora de RH",
    avatar: "https://picsum.photos/seed/ana-costa/64/64.jpg",
    content: "A consultoria de IR valeu cada centavo. Economizei R$ 2.000 em impostos que eu nem sabia que poderia recuperar.",
    rating: 5,
    transformationTime: "Economia de R$ 2.000"
  },
  {
    id: 4,
    name: "Pedro Lima",
    role: "Gerente de Vendas",
    avatar: "https://picsum.photos/seed/pedro-lima/64/64.jpg",
    content: "Os exercícios diários mudaram completamente meu relacionamento com dinheiro. Hoje tenho controle total das minhas finanças.",
    rating: 5,
    transformationTime: "Controle financeiro em 45 dias"
  },
  {
    id: 5,
    name: "Carlos Dias",
    role: "Programador",
    avatar: "https://picsum.photos/seed/carlos-dias/64/64.jpg",
    content: "Em 30 dias já vejo resultados! O método do Mitsuo é simples e funciona de verdade. Recomendo para todos!",
    rating: 5,
    transformationTime: "Resultados em 30 dias"
  }
]

const statsData = [
  {
    icon: Users,
    number: "+10.000",
    label: "vidas transformadas"
  },
  {
    icon: TrendingUp,
    number: "+85 mil",
    label: "seguidores nas redes"
  },
  {
    icon: Heart,
    number: "95%",
    label: "satisfação"
  }
]

export interface SocialProofProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
  autoPlay?: boolean
  autoPlayInterval?: number
}

const SocialProof = React.forwardRef<HTMLElement, SocialProofProps>(
  ({
    className,
    autoPlay = false,
    autoPlayInterval = 5000,
    ...props
  }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [isVisible, setIsVisible] = React.useState(false)
    const [isDragging, setIsDragging] = React.useState(false)
    const [startX, setStartX] = React.useState(0)
    const sectionRef = React.useRef<HTMLElement>(null)
    const carouselRef = React.useRef<HTMLDivElement>(null)
    const autoPlayRef = React.useRef<NodeJS.Timeout | null>(null)

    // Auto-play functionality
    React.useEffect(() => {
      if (autoPlay && isVisible) {
        autoPlayRef.current = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % testimonialsData.length)
        }, autoPlayInterval)
      }

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current)
        }
      }
    }, [autoPlay, autoPlayInterval, isVisible])

    // Intersection Observer for animations
    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        },
        {
          threshold: 0.1,
          rootMargin: "50px 0px -50px 0px",
        }
      )

      const currentRef = sectionRef.current
      if (currentRef) {
        observer.observe(currentRef)
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef)
        }
      }
    }, [])

    const goToPrevious = () => {
      handleUserInteraction()
      setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length)
    }

    const goToNext = () => {
      handleUserInteraction()
      setCurrentIndex((prev) => (prev + 1) % testimonialsData.length)
    }

    const goToSlide = (index: number) => {
      handleUserInteraction()
      setCurrentIndex(index)
    }

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true)
      setStartX(e.clientX)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return

      const diff = startX - e.clientX
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToNext()
        } else {
          goToPrevious()
        }
        setIsDragging(false)
      }
    }

    const handleTouchStart = (e: React.TouchEvent) => {
      setIsDragging(true)
      setStartX(e.touches[0].clientX)
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging) return

      const diff = startX - e.touches[0].clientX
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToNext()
        } else {
          goToPrevious()
        }
        setIsDragging(false)
      }
    }

    const handleUserInteraction = () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }

    const getVisibleTestimonials = () => {
      const items = []
      for (let i = 0; i < 3; i++) {
        items.push(testimonialsData[(currentIndex + i) % testimonialsData.length])
      }
      return items
    }

    return (
      <section
        ref={sectionRef}
        id="social-proof"
        className={cn(
          "py-16 md:py-24 lg:py-32 relative overflow-hidden",
          "bg-gradient-to-b from-[#1A1F26] to-[#0F1419]",
          className
        )}
        {...props}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent pointer-events-none" />

        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6",
              "opacity-0 translate-y-4 transition-all duration-700 ease-out",
              isVisible && "opacity-100 translate-y-0"
            )}>
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Transformações Reais</span>
            </div>

            <h2 className={cn(
              "text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-6",
              "opacity-0 translate-y-4 transition-all duration-700 ease-out delay-100",
              isVisible && "opacity-100 translate-y-0"
            )}>
              O Que Nossos Alunos
              <span className="block text-primary">Dizem</span>
            </h2>

            <p className={cn(
              "text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed",
              "opacity-0 translate-y-4 transition-all duration-700 ease-out delay-200",
              isVisible && "opacity-100 translate-y-0"
            )}>
              Transformação real com resultados comprovados. Veja como milhares de alunos
              já mudaram sua vida financeira com nosso método.
            </p>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative max-w-6xl mx-auto mb-16">
            <div
              ref={carouselRef}
              className="relative overflow-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
            >
              {/* Carousel Track */}
              <div className="flex transition-transform duration-500 ease-out">
                {getVisibleTestimonials().map((testimonial, index) => (
                  <div
                    key={`${testimonial.id}-${index}`}
                    className={cn(
                      "w-full md:w-1/2 lg:w-1/3 px-4",
                      "opacity-0 translate-y-8 transition-all duration-700 ease-out",
                      isVisible && "opacity-100 translate-y-0"
                    )}
                    style={{ transitionDelay: `${300 + index * 100}ms` }}
                  >
                    <div className="group h-full p-6 rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                      {/* Avatar and Info */}
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-primary/30 group-hover:scale-110 transition-transform">
                          <img
                            src={testimonial.avatar}
                            alt={`Foto de ${testimonial.name}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-100 mb-1">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {testimonial.role}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="flex justify-center gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 fill-yellow-400 text-yellow-400"
                            aria-hidden="true"
                          />
                        ))}
                      </div>

                      {/* Testimonial Content */}
                      <blockquote className="text-gray-300 text-sm leading-relaxed mb-4 italic relative">
                        <span className="text-2xl text-primary/20 absolute -top-2 -left-1">"</span>
                        <span className="relative z-10">{testimonial.content}</span>
                        <span className="text-2xl text-primary/20 absolute -bottom-4 -right-1">"</span>
                      </blockquote>

                      {/* Transformation Time */}
                      <div className="text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                          <span className="text-xs font-medium text-primary">
                            Transformação em {testimonial.transformationTime}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 pointer-events-none">
              <button
                onClick={goToPrevious}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-gray-300 hover:bg-primary/20 hover:border-primary/40 hover:text-primary transition-all duration-300 pointer-events-auto hover:scale-110"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-gray-300 hover:bg-primary/20 hover:border-primary/40 hover:text-primary transition-all duration-300 pointer-events-auto hover:scale-110"
                aria-label="Próximo depoimento"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center gap-2 mb-16">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  currentIndex === index
                    ? "w-8 bg-primary"
                    : "bg-white/20 hover:bg-white/40"
                )}
                aria-label={`Ir para depoimento ${index + 1}`}
              />
            ))}
          </div>

          {/* Social Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {statsData.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "text-center group",
                  "opacity-0 translate-y-4 transition-all duration-700 ease-out",
                  isVisible && "opacity-100 translate-y-0"
                )}
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-100 mb-2 group-hover:text-primary transition-colors">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F1419] to-transparent pointer-events-none" />
      </section>
    )
  }
)
SocialProof.displayName = "SocialProof"

export { SocialProof }