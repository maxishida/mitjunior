'use client'

export default function Products() {
  const products = [
    {
      id: 1,
      title: 'Academia de Finanças: 30 Dias pra Virar o Jogo',
      description: 'Desafio prático com exercícios diários.',
      features: [
        'Anote e entenda seus gastos',
        'Elimine dívidas pequenas que drenam sua renda',
        'Planeje os próximos meses com clareza',
        'Comece sua renda extra com estratégia'
      ],
      cta: 'Quero entrar no desafio',
      badge: '🚀',
      highlight: true,
      gradient: 'from-[#00C896]/30 to-[#00E5A8]/20'
    },
    {
      id: 2,
      title: 'Projeto Verão Seca Dívidas',
      description: 'Treinamento direto e mão na massa para construir sua base financeira.',
      features: [
        'Passo a passo simples e aplicável',
        'Começa com o essencial: anotar para poder mudar',
        'Pare de "ganhar tempo" e ataque o que pesa'
      ],
      cta: 'Quero secar minhas dívidas',
      badge: '💪',
      highlight: false,
      gradient: 'from-[#00C896]/20 to-[#00E5A8]/10'
    },
    {
      id: 3,
      title: 'Consultoria de Finanças & Impostos (Online)',
      description: 'Tire dúvidas, organize sua vida financeira e faça seu IR com ajuda profissional.',
      features: [
        'Atendimento 1:1',
        'Orientação para declaração do Imposto de Renda',
        'R$ 290/h — foco em clareza e decisão'
      ],
      cta: 'Agendar minha consultoria',
      badge: '💼',
      highlight: false,
      gradient: 'from-[#00C896]/15 to-[#00E5A8]/5'
    },
    {
      id: 4,
      title: 'E-book "3 passos para começar a investir"',
      description: 'Comece do jeito certo, sem complicar.',
      features: [
        'Fundamentos práticos',
        'Estrutura para dar o primeiro passo com confiança'
      ],
      cta: 'Quero meu e-book',
      badge: '📚',
      highlight: false,
      gradient: 'from-[#00C896]/20 to-[#00E5A8]/10'
    }
  ]

  const handleCTAClick = (productTitle: string) => {
    console.log(`CTA clicado: ${productTitle}`)
  }

  return (
    <section id="programas" className="bg-[#0F1419] py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-[#00C896]/10 border border-[#00C896]/20 text-[#00C896] text-sm font-semibold uppercase tracking-wide mb-6 animate-fadeIn">
            Programas & Consultoria
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            Escolha Seu Caminho
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Diferentes soluções para diferentes momentos da sua jornada financeira
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`
                group relative rounded-3xl p-8
                flex flex-col animate-slideUp
                transition-all duration-500
                ${product.highlight
                  ? 'bg-gradient-to-br from-[#00C896]/20 to-[#00E5A8]/10 border-2 border-[#00C896] hover:border-[#00E5A8] hover:shadow-2xl hover:shadow-[#00C896]/30 hover:-translate-y-3 hover:scale-[1.02]'
                  : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-[#00C896]/30 hover:-translate-y-2'
                }
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              {/* Highlight Badge */}
              {product.highlight && (
                <div className="absolute -top-4 -right-4 px-4 py-2 rounded-full bg-gradient-to-r from-[#00C896] to-[#00E5A8] text-white text-xs font-bold shadow-xl animate-pulse">
                  Mais Popular
                </div>
              )}

              <div className="relative z-10 flex flex-col h-full">
                {/* Product Badge */}
                <div className={`text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 ${product.highlight ? 'animate-bounce' : ''}`}>
                  {product.badge}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 min-h-[4rem] leading-tight">
                  {product.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Features */}
                <ul className="flex-grow mb-6 space-y-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                      <span className="text-[#00C896] mt-0.5 flex-shrink-0 text-lg font-bold">✓</span>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleCTAClick(product.title)}
                  className={`
                    w-full py-4 px-4 rounded-2xl font-semibold text-sm
                    transition-all duration-300
                    ${product.highlight
                      ? 'bg-gradient-to-r from-[#00C896] to-[#00E5A8] text-white shadow-xl shadow-[#00C896]/50 hover:shadow-2xl hover:shadow-[#00C896]/70 hover:scale-105'
                      : 'bg-transparent border-2 border-[#00C896] text-[#00C896] hover:bg-[#00C896] hover:text-white hover:scale-105'
                    }
                  `}
                >
                  {product.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Card */}
        <div className="mt-16 text-center animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          <div className="inline-block p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-[#00C896]/30 transition-all duration-300">
            <p className="text-gray-400 text-lg mb-4">
              Dúvidas sobre qual programa escolher?
            </p>
            <button
              onClick={() => console.log('Contato clicado')}
              className="px-6 py-3 bg-transparent border-2 border-[#00C896] text-[#00C896] rounded-2xl hover:bg-[#00C896] hover:text-white transition-all duration-300 font-semibold"
            >
              Fale Conosco →
            </button>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center hover:bg-white/10 hover:border-[#00C896]/30 transition-all duration-300">
            <div className="text-4xl mb-3">🔒</div>
            <p className="text-white font-semibold mb-2">Garantia de 7 Dias</p>
            <p className="text-gray-400 text-sm">Satisfação garantida ou seu dinheiro de volta</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center hover:bg-white/10 hover:border-[#00C896]/30 transition-all duration-300">
            <div className="text-4xl mb-3">⚡</div>
            <p className="text-white font-semibold mb-2">Acesso Imediato</p>
            <p className="text-gray-400 text-sm">Comece agora mesmo após a compra</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center hover:bg-white/10 hover:border-[#00C896]/30 transition-all duration-300">
            <div className="text-4xl mb-3">🎓</div>
            <p className="text-white font-semibold mb-2">Conteúdo Atualizado</p>
            <p className="text-gray-400 text-sm">Material sempre revisado e melhorado</p>
          </div>
        </div>
      </div>
    </section>
  )
}
