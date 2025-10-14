export default function Authority() {
  const stats = [
    {
      icon: '👥',
      value: '+10.000',
      label: 'Alunos Impactados',
      color: 'from-[#00C896] to-[#00E5A8]'
    },
    {
      icon: '📱',
      value: '+85 mil',
      label: 'Seguidores nas Redes',
      color: 'from-[#00E5A8] to-[#00C896]'
    },
    {
      icon: '🎓',
      value: 'MBA',
      label: 'Investimentos',
      color: 'from-[#00C896] to-[#00E5A8]'
    },
    {
      icon: '💼',
      value: 'Me Poupe!',
      label: 'Professor de IR',
      color: 'from-[#00E5A8] to-[#00C896]'
    }
  ]

  const credentials = [
    '✓ Contador CRC-SP',
    '✓ MBA Investimentos',
    '✓ Professor Me Poupe!',
    '✓ Top 40 Influencer'
  ]

  return (
    <section className="bg-gradient-to-b from-[#0F1419] to-[#1A1F26] py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image & Stats */}
          <div className="relative animate-fadeInLeft">
            {/* Avatar Container with Gradient Border */}
            <div className="aspect-square max-w-lg mx-auto rounded-3xl bg-gradient-to-br from-[#00C896]/30 to-[#00E5A8]/10 p-1">
              <div className="w-full h-full rounded-3xl bg-[#1A1F26] overflow-hidden flex items-center justify-center relative group">
                {/* Placeholder - substituir por imagem real */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00C896]/10 to-transparent group-hover:from-[#00C896]/20 transition-all duration-300"></div>
                <div className="text-9xl z-10">👨‍💼</div>
              </div>
            </div>

            {/* Floating Stats Badges */}
            <div className="absolute -bottom-6 -right-6 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#00C896] to-[#00E5A8] text-transparent bg-clip-text">
                +85k
              </div>
              <div className="text-sm text-gray-300 font-medium">Seguidores</div>
            </div>

            <div className="absolute -top-6 -left-6 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#00E5A8] to-[#00C896] text-transparent bg-clip-text">
                Top 40
              </div>
              <div className="text-sm text-gray-300 font-medium">Influencer</div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="animate-fadeInRight">
            {/* Badge */}
            <span className="inline-block px-4 py-2 rounded-full bg-[#00C896]/10 border border-[#00C896]/20 text-[#00C896] text-sm font-semibold uppercase tracking-wide mb-6">
              Sobre o Instrutor
            </span>

            {/* Title */}
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Mitsuo Ishida
              <br />
              <span className="bg-gradient-to-r from-[#00C896] to-[#00E5A8] text-transparent bg-clip-text">
                (mitjunior)
              </span>
            </h2>

            {/* Description */}
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              <strong className="text-white">Contador, especialista em finanças pessoais e IR, MBA em investimentos</strong>, professor na <strong className="text-[#00C896]">Me Poupe!</strong> e criador de conteúdos sobre aposentadoria, imposto de renda e investimentos.
            </p>

            <p className="text-lg text-gray-400 leading-relaxed mb-8">
              Já ensinou <strong className="text-white">+10.000 alunos</strong> e alcança <strong className="text-white">+85 mil pessoas</strong> nas redes, levando educação financeira prática, leve e didática.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-[#00C896]/30 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                  <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} text-transparent bg-clip-text mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#00C896]/10 to-[#00E5A8]/5 border border-[#00C896]/20 mb-8">
              <p className="text-gray-300 italic mb-3 text-lg leading-relaxed">
                "Transformar conhecimento financeiro em ação prática é a chave para a liberdade financeira."
              </p>
              <p className="text-[#00C896] font-semibold">
                — Mitsuo Ishida
              </p>
            </div>

            {/* Credentials Pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {credentials.map((credential, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-gray-300 text-sm hover:bg-white/10 hover:border-[#00C896]/30 transition-all duration-300"
                >
                  {credential}
                </span>
              ))}
            </div>

            {/* CTA Button */}
            <button className="px-8 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/10 text-white font-semibold rounded-2xl hover:bg-white/10 hover:border-[#00C896]/50 transition-all duration-300 group">
              Conheça Mais
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
