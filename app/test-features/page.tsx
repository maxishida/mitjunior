'use client'

import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { Button } from '@/components/ui/button';

export default function TestFeaturesPage() {
  const handleCtaClick = () => {
    alert('CTA clicado! Funcionando perfeitamente.');
  };

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Header */}
      <div className="py-8 text-center">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          Teste da Features Section
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto px-4">
          Página de teste para verificar a funcionalidade da FeaturesSection com animações,
          responsividade e acessibilidade.
        </p>
      </div>

      {/* Features Section */}
      <FeaturesSection
        showCta={true}
        ctaText="Testar CTA Agora"
        onCtaClick={handleCtaClick}
      />

      {/* Additional test content */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Teste de Funcionalidades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background-secondary p-6 rounded-lg border border-border-primary">
              <h3 className="text-lg font-semibold text-text-primary mb-2">✅ Animações</h3>
              <p className="text-text-tertiary text-sm">
                Verifique se os cards aparecem com animação suave ao rolar a página
              </p>
            </div>
            <div className="bg-background-secondary p-6 rounded-lg border border-border-primary">
              <h3 className="text-lg font-semibold text-text-primary mb-2">✅ Hover Effects</h3>
              <p className="text-text-tertiary text-sm">
                Passe o mouse sobre os cards para ver os efeitos de hover
              </p>
            </div>
            <div className="bg-background-secondary p-6 rounded-lg border border-border-primary">
              <h3 className="text-lg font-semibold text-text-primary mb-2">✅ Responsividade</h3>
              <p className="text-text-tertiary text-sm">
                Redimensione o navegador para testar diferentes tamanhos de tela
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              variant="outline"
              className="mx-auto"
            >
              Voltar ao Topo
            </Button>
          </div>
        </div>
      </div>

      {/* Accessibility Test Info */}
      <div className="py-8 px-4 bg-background-secondary">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-text-primary mb-4">Teste de Acessibilidade</h3>
          <ul className="text-text-tertiary space-y-2">
            <li>• Use Tab para navegar pelos elementos</li>
            <li>• Verifique se os cards têm foco visível</li>
            <li>• Teste o leitor de tela (screen reader)</li>
            <li>• Confirme se os ícones têm aria-hidden="true"</li>
            <li>• Verifique se o CTA tem descrição apropriada</li>
          </ul>
        </div>
      </div>
    </div>
  );
}