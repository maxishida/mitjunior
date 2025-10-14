export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      icon: '📊',
      title: 'Diagnóstico simples',
      description: 'Veja onde o dinheiro está indo.',
      details: 'Aprenda a mapear seus gastos e identificar vazamentos financeiros de forma clara e objetiva.',
      gradient: 'from-[#00C896]/20 to-[#00E5A8]/10'
    },
    {
      id: 2,
      icon: '🎯',
      title: 'Plano prático',
      description: 'Elimine vazamentos e dívidas pequenas.',
      details: 'Estratégias comprovadas para organizar suas finanças e eliminar as dívidas que mais pesam no seu bolso.',
      gradient: 'from-[#00C896]/15 to-[#00E5A8]/5'
    },
    {
      id: 3,
      icon: '📈',
      title: 'Evolução contínua',
      description: 'Planeje meses à frente e dê os primeiros passos nos investimentos.',
      details: 'Construa um futuro financeiro sólido com planejamento de longo prazo e investimentos seguros.',
      gradient: 'from-[#00C896]/20 to-[#00E5A8]/10'
    }
  ]

  const resultStats = [
    {
      value: '30 dias',
      label: 'Para ver resultados',
      icon: '⏱️'
    },
    {
      value: '100%',
      label: 'Prático e aplicável',
      icon: '✅'
    },
    {
      value: '+10k',
      label: 'Alunos transformados',
      icon: '🎓'
    }
  ]

  return (
    <section className="bg-[#0F1419] py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-[#00C896]/10 border border-[#00C896]/20 text-[#00C896] text-sm font-semibold uppercase tracking-wide mb-6 animate-fadeIn">
            Metodologia Comprovada
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            Como Funciona
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            3 passos simples para transformar suas finanças
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00C896]/50 to-transparent z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="relative animate-scaleIn"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Step Card - Glassmorphism */}
                <div className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-[#00C896]/30 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="relative z-10">
                    {/* Step Number Badge */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gradient-to-br from-[#00C896] to-[#00E5A8] text-white w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-2xl shadow-[#00C896]/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      {step.id}
                    </div>

                    {/* Icon */}
                    <div className="text-6xl mb-6 text-center group-hover:scale-110 transition-transform duration-300 mt-4">
                      {step.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-3 text-center">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[#00C896] text-lg font-semibold mb-4 text-center leading-snug">
                      {step.description}
                    </p>

                    {/* Details */}
                    <p className="text-gray-400 text-base text-center leading-relaxed">
                      {step.details}
                    </p>
                  </div>

                  {/* Arrow Indicator (Desktop) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-12 top-1/2 transform -translate-y-1/2 text-[#00C896] text-4xl animate-pulse">
                      →
                    </div>
                  )}
                </div>

                {/* Mobile Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center py-6 text-[#00C896] text-4xl animate-pulse">
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Result Banner */}
        <div className="mt-24 relative animate-fadeIn" style={{ animationDelay: '0.8s' }}>
          <div className="rounded-3xl bg-gradient-to-br from-[#00C896]/20 to-[#00E5A8]/10 border-2 border-[#00C896] p-12 text-center hover:border-[#00E5A8] transition-all duration-300 relative overflow-hidden group">
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00C896]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <div className="relative z-10">
              <div className="text-6xl mb-6 inline-block animate-bounce">✨</div>

              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Resultado Garantido
              </h3>

              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-12">
                <strong className="text-[#00C896]">Mais controle</strong>, <strong className="text-[#00C896]">menos ansiedade</strong> e <strong className="text-[#00C896]">decisões seguras</strong>. Você terá clareza total sobre seu dinheiro e saberá exatamente o que fazer para alcançar seus objetivos financeiros.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {resultStats.map((stat, index) => (
                  <div
                    key={index}
                    className="group/stat p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-[#00C896]/50 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="text-4xl mb-3 group-hover/stat:scale-110 transition-transform">
                      {stat.icon}
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-[#00C896] to-[#00E5A8] text-transparent bg-clip-text mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-300 text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Final CTA */}
              <div className="mt-12">
                <button className="px-8 py-4 bg-gradient-to-r from-[#00C896] to-[#00E5A8] text-white text-lg font-bold rounded-2xl shadow-2xl shadow-[#00C896]/50 hover:shadow-[#00C896]/70 hover:scale-105 transition-all duration-300">
                  Começar Minha Transformação →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
