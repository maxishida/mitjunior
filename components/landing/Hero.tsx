'use client'

export default function Hero() {
  const handlePrimaryCTA = () => {
    console.log('CTA: Quero Virar o Jogo Agora')
  }

  const handleSecondaryCTA = () => {
    console.log('CTA: Ver Programas & Consultoria')
    const productsSection = document.getElementById('programas')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Gradient + Blur Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F1419] via-[#1A1F26] to-[#0F1419]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00C896]/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00E5A8]/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge/Social Proof */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8 hover:bg-white/10 transition-all duration-300 animate-fadeIn">
            <span className="text-[#00C896] text-lg">✓</span>
            <span className="text-sm text-gray-300 font-medium">+10.000 alunos transformados</span>
          </div>

          {/* Headline - 80px, bold, kerning apertado */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.1] tracking-tight mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            Domine Seu Dinheiro em{' '}
            <span className="bg-gradient-to-r from-[#00C896] to-[#00E5A8] text-transparent bg-clip-text">
              30 Dias
            </span>{' '}
            <span className="inline-block" role="img" aria-label="Leao">🦁</span>
          </h1>

          {/* Subheadline - 20px, line-height 1.7 */}
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12 max-w-3xl mx-auto animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            A metodologia prática do <strong className="text-[#00C896]">Mitsuo Ishida (mitjunior)</strong> — especialista em Imposto de Renda na Me Poupe!, contador e MBA em investimentos — já impactou <strong className="text-white">+10.000 alunos</strong> e uma audiência de <strong className="text-white">+85 mil seguidores</strong>.
          </p>

          {/* CTAs - 56px altura, sombras fortes */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={handlePrimaryCTA}
              className="group px-8 py-4 bg-gradient-to-r from-[#00C896] to-[#00E5A8] text-white text-lg font-bold rounded-2xl shadow-2xl shadow-[#00C896]/50 hover:shadow-[#00C896]/70 hover:scale-105 transition-all duration-300 min-h-[56px] focus:outline-none focus:ring-4 focus:ring-[#00C896]/50"
              aria-label="Começar agora com ComunidadeFlix"
            >
              Quero Virar o Jogo Agora
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button
              onClick={handleSecondaryCTA}
              className="px-8 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/10 text-white text-lg font-semibold rounded-2xl hover:bg-white/10 hover:border-[#00C896]/50 transition-all duration-300 min-h-[56px] focus:outline-none focus:ring-4 focus:ring-white/20"
              aria-label="Ver programas e consultoria disponíveis"
            >
              Ver Programas & Consultoria
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400 mb-12 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 group hover:text-[#00C896] transition-colors cursor-default">
              <span className="text-lg">⚡</span>
              <span className="font-medium">Acesso Imediato</span>
            </div>
            <div className="flex items-center gap-2 group hover:text-[#00C896] transition-colors cursor-default">
              <span className="text-lg">🔒</span>
              <span className="font-medium">Garantia 7 Dias</span>
            </div>
            <div className="flex items-center gap-2 group hover:text-[#00C896] transition-colors cursor-default">
              <span className="text-lg">⭐</span>
              <span className="font-medium">4.9/5 (2.340 avaliações)</span>
            </div>
          </div>

          {/* Social Proof Cards - Glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            <div className="group p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-[#00C896]/30 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="text-3xl group-hover:scale-110 transition-transform" role="img" aria-label="Verificado">✅</div>
                <p className="text-sm text-gray-300 text-left leading-snug">
                  <strong className="text-[#00C896]">Especialista de IR</strong> na Me Poupe!
                </p>
              </div>
            </div>

            <div className="group p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-[#00C896]/30 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="text-3xl group-hover:scale-110 transition-transform" role="img" aria-label="Trofeu">🏆</div>
                <p className="text-sm text-gray-300 text-left leading-snug">
                  <strong className="text-[#00C896]">Top 40 influenciadores</strong> de finanças no Brasil
                </p>
              </div>
            </div>

            <div className="group p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-[#00C896]/30 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="text-3xl group-hover:scale-110 transition-transform" role="img" aria-label="Livros">📚</div>
                <p className="text-sm text-gray-300 text-left leading-snug">
                  Autor do e-book <strong className="text-[#00C896]">3 passos para começar a investir</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Effects - Hidden for accessibility */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30" aria-hidden="true">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00C896]/20 rounded-full blur-3xl will-change-transform"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00C896]/10 rounded-full blur-3xl will-change-transform"></div>
      </div>
    </section>
  )
}
