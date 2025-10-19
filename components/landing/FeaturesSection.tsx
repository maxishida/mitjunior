'use client'

import * as React from "react"
import {
  BookOpen,
  Target,
  TrendingUp,
  Calendar,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { FeatureCard } from "@/components/ui/FeatureCard"
import { cn } from "@/lib/utils"

const featuresData = [
  {
    icon: BookOpen,
    title: "Simples e direto",
    description: "Passo a passo sem 'financês' - aprenda do jeito fácil, sem complicação.",
  },
  {
    icon: Target,
    title: "Disciplina guiada",
    description: "Você aprende a anotar gastos e acompanhar sem sofrer, com método validado.",
  },
  {
    icon: TrendingUp,
    title: "Resultados visíveis",
    description: "Elimine dívidas pequenas que pesam no orçamento e veja a diferença rápido.",
  },
  {
    icon: Calendar,
    title: "Planejamento que funciona",
    description: "Organize os próximos meses com clareza e tome decisões com segurança.",
  },
  {
    icon: FileText,
    title: "Foco no IR",
    description: "Pare de temer o Leão; faça certo e recupere tempo e dinheiro.",
  },
  {
    icon: Sparkles,
    title: "Comece a investir",
    description: "Dê os primeiros passos nos investimentos com segurança e confiança.",
  },
]

export interface FeaturesSectionProps extends React.HTMLAttributes<HTMLElement> {
  className?: string
  showCta?: boolean
  ctaText?: string
  onCtaClick?: () => void
}

const FeaturesSection = React.forwardRef<HTMLElement, FeaturesSectionProps>(
  ({
    className,
    showCta = true,
    ctaText = "Quero Começar Agora",
    onCtaClick,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const sectionRef = React.useRef<HTMLElement>(null)

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

    const handleCtaClick = () => {
      if (onCtaClick) {
        onCtaClick()
      } else {
        // Default behavior - scroll to hero or contact
        const heroSection = document.getElementById('hero')
        if (heroSection) {
          heroSection.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    return (
      <section
        ref={sectionRef}
        id="features"
        className={cn(
          "py-16 md:py-24 lg:py-32 relative overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6",
              "opacity-0 translate-y-4 transition-all duration-700 ease-out",
              isVisible && "opacity-100 translate-y-0"
            )}>
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Recursos Principais</span>
            </div>

            <h2 className={cn(
              "text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-6",
              "opacity-0 translate-y-4 transition-all duration-700 ease-out delay-100",
              isVisible && "opacity-100 translate-y-0"
            )}>
              Tudo que Você Precisa
              <span className="block text-primary">em Um Só Lugar</span>
            </h2>

            <p className={cn(
              "text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed",
              "opacity-0 translate-y-4 transition-all duration-700 ease-out delay-200",
              isVisible && "opacity-100 translate-y-0"
            )}>
              Uma solução completa para organizar suas finanças, eliminar dívidas e
              construir um futuro financeiro mais seguro e tranquilo.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {featuresData.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                variant="elevated"
                padding="lg"
                animation="fade"
                animationDelay={index * 100}
                className="h-full"
              />
            ))}
          </div>

          {/* CTA Section */}
          {showCta && (
            <div className={cn(
              "text-center",
              "opacity-0 translate-y-4 transition-all duration-700 ease-out delay-500",
              isVisible && "opacity-100 translate-y-0"
            )}>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 mb-6">
                <span className="text-sm font-medium text-primary">Pronto para transformar suas finanças?</span>
              </div>

              <Button
                onClick={handleCtaClick}
                variant="primary"
                size="lg"
                className="group inline-flex items-center gap-2 mx-auto"
                aria-label={ctaText}
              >
                {ctaText}
                <ArrowRight
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>

              <p className="text-sm text-gray-500 mt-4">
                Comece sem compromisso. Garantia de 7 dias.
              </p>
            </div>
          )}
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>
    )
  }
)
FeaturesSection.displayName = "FeaturesSection"

export { FeaturesSection }