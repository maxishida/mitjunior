'use client';

import * as React from "react";
import { Calculator, FileText, Shield, TrendingUp, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const taxFeatures = [
  {
    icon: Calculator,
    title: "Declaração sem Pânico",
    description: "Aprenda como declarar corretamente, evitar erros e otimizar sua restituição com quem vive isso todos os dias."
  },
  {
    icon: FileText,
    title: "Organização Garantida",
    description: "Método passo a passo para juntar documentos, organizar comprovantes e nunca mais perder prazos."
  },
  {
    icon: Shield,
    title: "Proteção Total",
    description: "Evite multas e problemas com a Receita Federal. Esteja sempre em dia com suas obrigações fiscais."
  },
  {
    icon: TrendingUp,
    title: "Recupere Dinheiro",
    description: "Descubra deduções e créditos que muitos deixam de aproveitar. Recupere mais dinheiro na restituição."
  }
];

const statsData = [
  {
    icon: Star,
    number: "R$ 2.000+",
    label: "economia média por aluno"
  },
  {
    icon: FileText,
    number: "1.500+",
    label: "declarações otimizadas"
  },
  {
    icon: Shield,
    number: "0%",
    label: "problemas com a Receita"
  }
];

export interface TaxAuthoritySectionProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  showCta?: boolean;
  ctaText?: string;
  onCtaClick?: () => void;
}

const TaxAuthoritySection = React.forwardRef<HTMLElement, TaxAuthoritySectionProps>(
  ({
    className,
    showCta = true,
    ctaText = "Quero Fazer Meu IR do Jeito Certo",
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
        const contactSection = document.getElementById('contato');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    return (
      <section
        ref={sectionRef || ref}
        id="tax-authority"
        className={cn(
          "py-16 md:py-24 lg:py-32 relative overflow-hidden",
          "bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900",
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
              <span className="text-2xl mr-2">🦁</span>
              <span className="text-sm font-medium text-brand">Especialista em Imposto de Renda</span>
            </div>

            <h2 className={cn(
              "text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-6",
              "opacity-0 translate-y-4 transition-all duration-700 ease-out delay-100",
              isVisible && "opacity-100 translate-y-0"
            )}>
              <span className="block text-brand mb-2">Domador do Leão</span>
              Imposto de Renda sem Dor de Cabeça
            </h2>

            <p className={cn(
              "text-lg md:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed",
              "opacity-0 translate-y-4 transition-all duration-700 ease-out delay-200",
              isVisible && "opacity-100 translate-y-0"
            )}>
              Chega de adiar! Aprenda como declarar corretamente, evitar erros e otimizar sua restituição
              com quem vive isso todos os dias. Conteúdos, aulas e consultoria para você ficar em dia
              com o Leão e proteger seu bolso.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
            {/* Features List */}
            <div className={cn(
              "space-y-6",
              "opacity-0 translate-y-8 transition-all duration-700 ease-out delay-300",
              isVisible && "opacity-100 translate-y-0"
            )}>
              <h3 className="text-2xl font-bold text-white mb-8">
                O Que Você Vai Aprender
              </h3>

              {taxFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-brand/30 transition-all duration-300"
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-brand/20 flex items-center justify-center group-hover:bg-brand/30 transition-colors">
                    <feature.icon className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Authority Card */}
            <div className={cn(
              "flex flex-col justify-center",
              "opacity-0 translate-y-8 transition-all duration-700 ease-out delay-500",
              isVisible && "opacity-100 translate-y-0"
            )}>
              <div className="p-8 rounded-2xl bg-gradient-to-br from-brand/10 to-brand/5 border border-brand/20 backdrop-blur-md">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-brand-600 flex items-center justify-center">
                    <span className="text-3xl">🦁</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Autoridade em IR
                    </h3>
                    <p className="text-brand font-medium">
                      Especialista na Me Poupe!
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-gray-300 leading-relaxed">
                    Como especialista em Imposto de Renda na Me Poupe!, ajudo milhares de brasileiros
                    a transformarem o medo do Leão em tranquilidade financeira. Minha metodologia é
                    prática, direta e focada em resultados reais.
                  </p>

                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-gray-400 text-sm italic">
                      "O segredo é organizar-se durante o ano inteiro, não só na época da declaração.
                      Com o método certo, você não só evita problemas como ainda recupera mais dinheiro."
                    </p>
                  </div>
                </div>

                {showCta && (
                  <Button
                    onClick={handleCtaClick}
                    variant="primary"
                    size="lg"
                    className="w-full shadow-lg shadow-brand/25 hover:shadow-brand/40 group"
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto",
            "opacity-0 translate-y-8 transition-all duration-700 ease-out",
            isVisible && "opacity-100 translate-y-0"
          )}
            style={{ transitionDelay: '700ms' }}
          >
            {statsData.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-brand/30 transition-all duration-300"
                style={{ transitionDelay: `${800 + index * 100}ms` }}
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-brand/20 flex items-center justify-center group-hover:bg-brand/30 transition-colors">
                  <stat.icon className="w-6 h-6 text-brand" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-900 to-transparent pointer-events-none" />
      </section>
    )
  }
);

TaxAuthoritySection.displayName = "TaxAuthoritySection";

export { TaxAuthoritySection };