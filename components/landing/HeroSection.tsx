'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState, useMemo } from 'react'

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Priority hint para indicar importância do componente
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        setIsLoaded(true)
      })
    } else {
      // Fallback para browsers que não suportam requestIdleCallback
      setTimeout(() => setIsLoaded(true), 100)
    }
  }, [])

  // Memoizar os selos de autoridade para evitar re-renders desnecessários
  const authorityBadges = useMemo(() => [
    {
      icon: '✅',
      title: 'Especialista de IR',
      subtitle: 'na Me Poupe!',
      ariaLabel: 'Verificado'
    },
    {
      icon: '🏆',
      title: 'Top 40 influenciadores',
      subtitle: 'de finanças no Brasil',
      ariaLabel: 'Troféu'
    },
    {
      icon: '📚',
      title: 'Autor do e-book',
      subtitle: '3 passos para começar a investir',
      ariaLabel: 'Livros'
    }
  ], [])

  const handlePrimaryCTA = () => {
    console.log('CTA: Quero Virar o Jogo Agora')
    // Redireciona para a seção de programas ou pode ser configurado para checkout/lead
    const productsSection = document.getElementById('programas')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
    // TODO: Implementar lógica de conversão/redirecionamento para checkout
  }

  const handleSecondaryCTA = () => {
    console.log('CTA: Ver Programas & Consultoria')
    const productsSection = document.getElementById('programas')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0F1419]"
      aria-label="Seção principal da landing page de Mitsuo Ishida"
      id="hero"
    >
      {/* Background Digital Serenity - Fallback gradiente animado */}
      <div className="absolute inset-0">
        {/* Gradiente base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F1419] via-[#1A1F26] to-[#0F1419]" />

        {/* Efeitos de partículas verdes flutuando */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00C896]/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00E5A8]/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#00C896]/5 rounded-full blur-[200px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Overlay gradiente para profundidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1419] via-transparent to-[#0F1419]/50" />
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
        <div className="text-center max-w-5xl mx-auto">

          {/* Badge de prova social */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8 hover:bg-white/10 transition-all duration-300 ${
              isLoaded ? 'animate-fadeIn' : 'opacity-0'
            }`}
          >
            <span className="text-[#00C896] text-lg">✓</span>
            <span className="text-sm text-gray-300 font-medium">+10.000 alunos transformados</span>
          </div>

          {/* Headline Principal */}
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white leading-[1.1] tracking-tight mb-6 ${
              isLoaded ? 'animate-fadeIn' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            Domine Seu Dinheiro em{' '}
            <span className="bg-gradient-to-r from-[#00C896] to-[#00E5A8] text-transparent bg-clip-text">
              30 Dias
            </span>
            {' '}— com o{' '}
            <span className="bg-gradient-to-r from-[#00C896] to-[#00E5A8] text-transparent bg-clip-text">
              Personal Financeiro
            </span>
            {' '}que Domou o Leão{' '}
            <span className="inline-block" role="img" aria-label="Leão">🦁</span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed mb-12 max-w-4xl mx-auto ${
              isLoaded ? 'animate-fadeIn' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            A metodologia prática do{' '}
            <strong className="text-[#00C896]">Mitsuo Ishida</strong> — especialista em Imposto de Renda na Me Poupe!, contador e MBA em investimentos — já impactou{' '}
            <strong className="text-white">+10.000 alunos</strong> e uma audiência de{' '}
            <strong className="text-white">+85 mil seguidores</strong>.
            Aprenda a anotar, entender e planejar seu dinheiro, eliminar dívidas e investir com clareza.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 px-4 sm:px-0 ${
              isLoaded ? 'animate-fadeIn' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.3s' }}
          >
            <button
              onClick={handlePrimaryCTA}
              className="group sm:px-8 px-6 py-4 text-lg font-bold bg-[#00C896] text-white rounded-lg shadow-2xl shadow-[#00C896]/50 hover:shadow-[#00C896]/70 hover:bg-[#00C896]/90 min-h-[56px] focus:outline-none focus:ring-4 focus:ring-[#00C896]/50 transition-all duration-200 max-w-full"
              aria-label="Começar transformação financeira agora"
              style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
            >
              Quero Virar o Jogo Agora
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <button
              onClick={handleSecondaryCTA}
              className="sm:px-8 px-6 py-4 text-lg font-semibold bg-transparent border-2 border-[#00C896] text-[#00C896] rounded-lg hover:bg-[#00C896] hover:text-white min-h-[56px] focus:outline-none focus:ring-4 focus:ring-white/20 transition-all duration-200 max-w-full"
              aria-label="Ver programas e consultoria disponíveis"
              style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
            >
              Ver Programas & Consultoria
              <span className="inline-block ml-2">↓</span>
            </button>
          </div>

          {/* Microcopy dos CTAs */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 text-sm ${
              isLoaded ? 'animate-fadeIn' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.35s' }}
          >
            <div className="text-gray-400">
              <span className="text-[#00C896]">⚡</span> acesso imediato
            </div>
            <div className="text-gray-400">
              <span className="text-[#00C896]">🔒</span> garantia de 7 dias
            </div>
          </div>

          {/* Selos de Autoridade */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto ${
              isLoaded ? 'animate-fadeIn' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.5s' }}
          >
            {authorityBadges.map((badge, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-[#00C896]/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="text-3xl group-hover:scale-110 transition-transform"
                    role="img"
                    aria-label={badge.ariaLabel}
                  >
                    {badge.icon}
                  </div>
                  <p className="text-sm text-gray-300 text-left leading-snug">
                    <strong className="text-[#00C896]">{badge.title}</strong>
                    {badge.subtitle && <><br />{badge.subtitle}</>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 animate-bounce ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ animationDelay: '1s' }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm">Scroll para explorar</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      {/* Efeitos adicionais de background (ocultos para acessibilidade) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30" aria-hidden="true">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00C896]/20 rounded-full blur-3xl will-change-transform" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00C896]/10 rounded-full blur-3xl will-change-transform" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-[#00E5A8]/15 rounded-full blur-3xl will-change-transform" />
      </div>

      {/* CSS para animações customizadas */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  )
}