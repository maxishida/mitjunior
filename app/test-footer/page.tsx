import Footer from '@/components/layout/Footer';

export default function TestFooterPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Teste do Componente Footer
        </h1>

        <div className="bg-gray-800 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Funcionalidades Implementadas:
          </h2>

          <ul className="space-y-2 text-gray-300">
            <li>✅ Logo Mitsuo Ishida com gradiente verde</li>
            <li>✅ Links organizados por categorias (Produtos, Recursos, Empresa, Legal)</li>
            <li>✅ Redes sociais com ícones (Instagram, YouTube, LinkedIn, WhatsApp)</li>
            <li>✅ Formulário de newsletter funcional com validação</li>
            <li>✅ Layout responsivo (1 coluna mobile, 4+ desktop)</li>
            <li>✅ Acessibilidade completa com ARIA labels</li>
            <li>✅ Animações e efeitos hover</li>
            <li>✅ Links externos com target="_blank"</li>
            <li>✅ Semântica HTML5 correta</li>
            <li>✅ Tema dark consistente com verde principal (#00C896)</li>
          </ul>
        </div>

        <p className="text-center text-gray-400 mb-8">
          Role para baixo para ver o Footer completo
        </p>
      </div>

      <Footer />
    </div>
  );
}