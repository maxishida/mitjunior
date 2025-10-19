'use client';

import * as React from "react";
import { Search, Target, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stepsData = [
  {
    icon: Search,
    title: "Diagnóstico simples",
    description: "Veja onde o dinheiro está indo com nosso método prático de acompanhamento.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Target,
    title: "Plano prático",
    description: "Elimine vazamentos e dívidas pequenas que drenam seu orçamento mensalmente.",
    color: "from-brand-500 to-brand-600"
  },
  {
    icon: TrendingUp,
    title: "Evolução contínua",
    description: "Planeje meses à frente e dê os primeiros passos nos investimentos com segurança.",
    color: "from-brand-600 to-brand-700"
  }
];

export interface HowItWorksSectionProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  showCta?: boolean;
  ctaText?: string;
  onCtaClick?: () => void;
}

const HowItWorksSection = React.forwardRef<HTMLElement, HowItWorksSectionProps>(
  ({
    className,
    showCta = true,
    ctaText = "Quero Começar Minha Transformação",
    onCtaClick,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const sectionRef = React.useRef<HTMLElement>(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        {
          threshold: 0.1,
          rootMargin: "50px 0px -50px 0px",
        }
      );

      const currentRef = sectionRef.current;
      if (currentRef) {
        observer.observe(currentRef);
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, []);

    const handleCtaClick = () => {
      if (onCtaClick) {
        onCtaClick();
      } else {
        const heroSection = document.getElementById('hero');
        if (heroSection) {
          heroSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    return (
      <section
        ref={sectionRef || ref}
        id="how-it-works"
        className={cn(
          "py-16 md:py-24 lg:py-32 relative overflow-hidden",
          "bg-gradient-to-b from-[#0F1419] to-[#1A1F26]",
          className
        )}
        {...props}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand/5 to-transparent pointer-events-none" />

        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-50" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 mb-6",
              "opacity-0 translate-y-4 transition-all duration-700 ease-out",
              isVisible && "opacity-100 translate-y-0"
            )}>
              <CheckCircle2 className="w-4 h-4 text-brand" />
              <span className="text-sm font-medium text-brand">Método Comprovado</span>
            </div>

            <h2 className={cn(
              "text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-6",
              "opacity-0 translate-y-4 transition-all duration-700 ease-out delay-100",
              isVisible && "opacity-100 translate-y-0"
            )}>
              Como Funciona
              <span className="block text-brand">Nossa Metodologia</span>
            </h2>

            <p className={cn(
              "text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed",
              "opacity-0 translate-y-4 transition-all duration-700 ease-out delay-200",
              isVisible && "opacity-100 translate-y-0"
            )}>
              Um processo simples em 3 passos para transformar completamente sua relação com o dinheiro
              e construir um futuro financeiro mais seguro.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
            {stepsData.map((step, index) => (
              <div
                key={step.title}
                className={cn(
                  "relative group",
                  "opacity-0 translate-y-8 transition-all duration-700 ease-out",
                  isVisible && "opacity-100 translate-y-0"
                )}
                style={{ transitionDelay: `${300 + index * 150}ms` }}
              >
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>

                {/* Step card */}
                <div className="relative h-full p-8 rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-brand/30 hover:-translate-y-2 transition-all duration-300">
                  {/* Icon */}
                  <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-100 mb-4">
                    {step.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Visual indicator */}
                  <div className="flex items-center gap-2 text-brand text-sm font-medium">
                    <span>Passo {index + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Connection line (desktop only) */}
                {index < stepsData.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-brand/50 to-transparent transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>

          {/* Result Section */}
          <div className={cn(
            "text-center max-w-4xl mx-auto",
            "opacity-0 translate-y-8 transition-all duration-700 ease-out",
            isVisible && "opacity-100 translate-y-0"
          )}
            style={{ transitionDelay: '750ms' }}
          >
            <div className="p-8 rounded-3xl bg-gradient-to-r from-brand/10 to-brand/5 border border-brand/20 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-4">
                Resultado: Mais Controle, Menos Ansiedade
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Transforme sua relação com o dinheiro e tome decisões financeiras com
                confiança e segurança. Nosso método já ajudou milhares de pessoas a
                alcançar a tranquilidade financeira.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/30">
                  <CheckCircle2 className="w-5 h-5 text-brand-400" />
                  <span className="text-brand-400 font-medium">Dívidas Eliminadas</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30">
                  <CheckCircle2 className="w-5 h-5 text-success-400" />
                  <span className="text-success-400 font-medium">Controle Total</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/30">
                  <CheckCircle2 className="w-5 h-5 text-warning-400" />
                  <span className="text-warning-400 font-medium">Investimentos Inteligentes</span>
                </div>
              </div>

              {showCta && (
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
              )}
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F1419] to-transparent pointer-events-none" />
      </section>
    )
  }
);

HowItWorksSection.displayName = "HowItWorksSection";

export { HowItWorksSection };