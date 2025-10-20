'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Trophy,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  PlayCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type AuthorityBadge = {
  icon: typeof ShieldCheck;
  title: string;
  subtitle: string;
};

const AUTHORITY_BADGES: AuthorityBadge[] = [
  {
    icon: ShieldCheck,
    title: 'Especialista em IR',
    subtitle: 'na Me Poupe!',
  },
  {
    icon: Trophy,
    title: 'Top 40 influenciadores',
    subtitle: 'de finanças no Brasil',
  },
  {
    icon: BookOpen,
    title: 'Autor do e-book',
    subtitle: '3 passos para começar a investir',
  },
];

const SUPPORT_POINTS = [
  {
    icon: CheckCircle2,
    label: 'Acesso imediato',
  },
  {
    icon: Sparkles,
    label: 'Garantia de 7 dias',
  },
];

const HIGHLIGHTS = [
  {
    title: '+10.000 alunos',
    description: 'transformados com a metodologia',
  },
  {
    title: '+85 mil seguidores',
    description: 'acompanhando dicas de finanças',
  },
];

export default function HeroSection() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsReady(true), 100);
    return () => window.clearTimeout(timeout);
  }, []);

  const transitionBase =
    'transform transition-all duration-700 ease-out will-change-transform';

  return (
    <section
      id="hero"
      aria-label="Seção principal da landing page de Mitsuo Ishida"
      className="relative overflow-hidden bg-gradient-to-b from-background via-background/85 to-background-secondary/80"
    >
      {/* Background decoration */}
      <div aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#111823] to-[#0c1017]" />
        <div className="pointer-events-none absolute -left-1/4 top-1/3 h-[32rem] w-[32rem] rounded-full bg-primary/20 blur-[140px]" />
        <div className="pointer-events-none absolute -right-1/3 top-0 h-[36rem] w-[36rem] rounded-full bg-primary/10 blur-[160px]" />
        <div className="pointer-events-none absolute left-1/2 top-2/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/5 blur-[200px]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-16 px-6 pb-24 pt-28 md:px-10 lg:px-12 xl:pt-36">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
          {/* Copy */}
          <div className="flex flex-col">
            <div
              className={`${transitionBase} mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 backdrop-blur-sm ${
                isReady ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '80ms' }}
            >
              <Sparkles size={16} className="text-primary" aria-hidden="true" />
              +10.000 alunos transformados
            </div>

            <h1
              className={`${transitionBase} text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.65rem] ${
                isReady ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '120ms' }}
            >
              Domine seu dinheiro em{' '}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                30 dias
              </span>{' '}
              com o personal financeiro que domou o leão.
            </h1>

            <p
              className={`${transitionBase} mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl ${
                isReady ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '160ms' }}
            >
              A metodologia prática de <span className="text-primary">Mitsuo Ishida</span>,
              especialista em Imposto de Renda e MBA em investimentos, ensina a anotar,
              entender e planejar seu dinheiro para eliminar dívidas e investir com clareza.
            </p>

            <div
              className={`${transitionBase} mt-10 flex flex-col gap-4 sm:flex-row sm:items-center ${
                isReady ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <Button
                onClick={() => {
                  const target = document.getElementById('pricing');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                size="lg"
                variant="primary"
                className="group flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/45"
                aria-label="Começar agora sua transformação financeira"
              >
                Começar agora
                <ArrowRight
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                  size={18}
                />
              </Button>
              <button
                onClick={() => {
                  const target = document.getElementById('programas');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group inline-flex items-center gap-2 rounded-xl border border-white/10 px-7 py-4 text-base font-semibold text-gray-200 transition-colors duration-300 hover:border-primary hover:bg-primary/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Ver programas e consultoria disponíveis"
              >
                Ver programas e consultoria
                <PlayCircle
                  size={18}
                  className="text-primary transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
              </button>
            </div>

            <div
              className={`${transitionBase} mt-10 flex flex-col gap-4 text-sm text-gray-400 sm:flex-row sm:items-center sm:gap-6 ${
                isReady ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '240ms' }}
            >
              {SUPPORT_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.label} className="flex items-center gap-2">
                    <Icon size={18} className="text-primary" aria-hidden="true" />
                    <span>{point.label}</span>
                  </div>
                );
              })}
            </div>

            <div
              className={`${transitionBase} mt-12 grid gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-3 ${
                isReady ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              {AUTHORITY_BADGES.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.title}
                    className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-white/10"
                  >
                    <div className="rounded-full bg-primary/15 p-2 text-primary transition-transform duration-300 group-hover:scale-110">
                      <Icon size={22} aria-hidden="true" />
                    </div>
                    <div className="text-sm leading-snug text-gray-200">
                      <strong className="block font-semibold text-white">{badge.title}</strong>
                      <span className="text-gray-400">{badge.subtitle}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual column */}
          <div
            className={`${transitionBase} relative mx-auto w-full max-w-xl ${
              isReady ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/25 via-primary/5 to-transparent blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-xl shadow-black/30 backdrop-blur">
              <Image
                src="/hero-section.png"
                alt="Visão geral da plataforma Mitsuo Ishida"
                width={1000}
                height={1200}
                className="h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-white/10 bg-neutral-900/90 p-6 text-left shadow-lg shadow-black/40 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.3em] text-primary">
                  Transformação financeira
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {HIGHLIGHTS.map((highlight) => (
                    <div key={highlight.title} className="rounded-xl bg-white/5 p-4">
                      <p className="text-lg font-semibold text-white">{highlight.title}</p>
                      <p className="text-sm text-gray-400">{highlight.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
