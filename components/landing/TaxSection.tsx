'use client'

export default function TaxSection() {
  const handleCTA = () => {
    console.log('CTA: Quero fazer meu IR do jeito certo')
  }

  return (
    <section className="bg-gradient-to-br from-[#007456] via-[#008966] to-[#009E76] py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Icon & Title */}
          <div className="text-center lg:text-left">
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full p-8 mb-6">
              <div className="text-8xl">🦁</div>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Domador do Leão
            </h2>
            <div className="w-24 h-1 bg-white/50 rounded-full mx-auto lg:mx-0"></div>
          </div>

          {/* Right Side: Content */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-4">
                Imposto de Renda sem pânico.
              </h3>
              <p className="text-white/90 text-lg leading-relaxed">
                Chega de adiar: aprenda como declarar corretamente, evitar erros e otimizar sua restituição com quem vive isso todos os dias.
              </p>
            </div>

            <div className="mb-6">
              <p className="text-white/90 text-base leading-relaxed">
                Conteúdos, aulas e consultoria para você ficar em dia com o Leão e proteger seu bolso.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="text-2xl">✓</div>
                <div>
                  <p className="text-white font-semibold text-sm">Declaração Correta</p>
                  <p className="text-white/70 text-xs">Evite erros e multas</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">✓</div>
                <div>
                  <p className="text-white font-semibold text-sm">Restituição Máxima</p>
                  <p className="text-white/70 text-xs">Recupere mais dinheiro</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">✓</div>
                <div>
                  <p className="text-white font-semibold text-sm">Consultoria Especializada</p>
                  <p className="text-white/70 text-xs">Atendimento 1:1</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">✓</div>
                <div>
                  <p className="text-white font-semibold text-sm">Acompanhamento</p>
                  <p className="text-white/70 text-xs">Durante todo o processo</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleCTA}
              className="w-full bg-white text-[#008966] font-bold text-lg py-4 px-6 rounded-lg hover:bg-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Quero fazer meu IR do jeito certo
            </button>

            <p className="text-white/60 text-xs text-center mt-4">
              Especialista certificado • Professor Me Poupe! • +10.000 declarações
            </p>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">+10k</div>
            <div className="text-white/70 text-sm">Declarações Feitas</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">100%</div>
            <div className="text-white/70 text-sm">Sem Erros</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">15+</div>
            <div className="text-white/70 text-sm">Anos de Experiência</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">★ 4.9</div>
            <div className="text-white/70 text-sm">Avaliação Média</div>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
      </div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>
    </section>
  )
}
