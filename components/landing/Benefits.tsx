export default function Benefits() {
  const benefits = [
    {
      id: 1,
      text: 'Simples e direto: passo a passo sem "financês".',
      icon: '💡',
      gradient: 'from-[#00C896]/20 to-[#00E5A8]/10'
    },
    {
      id: 2,
      text: 'Disciplina guiada: você aprende a anotar gastos e acompanhar sem sofrer.',
      icon: '🎯',
      gradient: 'from-[#00C896]/15 to-[#00E5A8]/5'
    },
    {
      id: 3,
      text: 'Resultados visíveis: elimine dívidas pequenas que pesam no orçamento.',
      icon: '📈',
      gradient: 'from-[#00C896]/20 to-[#00E5A8]/10'
    },
    {
      id: 4,
      text: 'Planejamento que funciona: organize os próximos meses com clareza.',
      icon: '🗓️',
      gradient: 'from-[#00C896]/15 to-[#00E5A8]/5'
    },
    {
      id: 5,
      text: 'Foco no IR: pare de temer o Leão; faça certo e recupere tempo e dinheiro.',
      icon: '🦁',
      gradient: 'from-[#00C896]/20 to-[#00E5A8]/10'
    },
    {
      id: 6,
      text: 'Suporte contínuo: comunidade ativa e conteúdos atualizados regularmente.',
      icon: '🤝',
      gradient: 'from-[#00C896]/15 to-[#00E5A8]/5'
    }
  ]

  return (
    <section className="bg-[#0F1419] py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-[#00C896]/10 border border-[#00C896]/20 text-[#00C896] text-sm font-semibold uppercase tracking-wide mb-6 animate-fadeIn">
            Benefícios
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            Por Que Escolher Nossa Metodologia?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Resultados práticos com uma abordagem que realmente funciona
          </p>
        </div>

        {/* Cards Grid - Glassmorphism */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-[#00C896]/30 hover:-translate-y-2 transition-all duration-300 animate-slideUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative z-10">
                {/* Ícone - 56px, gradient background */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00C896] to-[#00E5A8] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-[#00C896]/20">
                  <span className="text-3xl">{benefit.icon}</span>
                </div>

                {/* Descrição */}
                <p className="text-gray-300 text-lg leading-relaxed">
                  {benefit.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center animate-fadeIn" style={{ animationDelay: '0.8s' }}>
          <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-[#00C896]/20 to-[#00E5A8]/10 border-2 border-[#00C896] hover:border-[#00E5A8] transition-all duration-300">
            <div className="text-5xl mb-4">🚀</div>
            <p className="text-2xl font-bold text-white mb-2">
              Comece Sua Transformação
            </p>
            <p className="text-gray-300 mb-6 max-w-md">
              Junte-se a mais de 10.000 alunos que já dominaram suas finanças
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-[#00C896] to-[#00E5A8] text-white font-bold rounded-2xl shadow-2xl shadow-[#00C896]/50 hover:shadow-[#00C896]/70 hover:scale-105 transition-all duration-300">
              Começar Agora
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
