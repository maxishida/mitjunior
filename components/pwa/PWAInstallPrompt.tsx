'use client';

import { useState } from 'react';
import { X, Download, Smartphone, Star, Zap, Shield } from 'lucide-react';
import { usePWA, useDevice } from '@/hooks/usePWA';

export default function PWAInstallPrompt() {
  const { canInstall, isLoading, showInstallPrompt, install, dismiss } = usePWA();
  const [isMinimized, setIsMinimized] = useState(false);
  const { isMobile, isIOS, isAndroid } = useDevice();

  if (!showInstallPrompt || !canInstall) {
    return null;
  }

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      // Track successful installation
      if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install', {
          event_category: 'engagement',
          event_label: 'pwa_installed'
        });
      }
    }
  };

  const handleDismiss = () => {
    dismiss();
    setIsMinimized(false);
  };

  const getInstallInstructions = () => {
    if (isIOS) {
      return {
        title: 'Instale o App',
        description: 'Toque em Compartilhar e depois "Adicionar à Tela de Início"',
        steps: [
          'Toque no ícone de Compartilhar',
          'Role para baixo e toque em "Adicionar à Tela de Início"',
          'Toque em "Adicionar" para instalar'
        ]
      };
    }

    if (isAndroid) {
      return {
        title: 'Instale o App',
        description: 'Toque no botão instalar para adicionar à sua tela inicial',
        steps: [
          'Toque no botão "Instalar App"',
          'Confirme a instalação',
          'Acesse diretamente da sua tela inicial'
        ]
      };
    }

    return {
      title: 'Instale o App',
      description: 'Instale nosso aplicativo para uma experiência melhor',
      steps: [
        'Acesso rápido e offline',
        'Notificações personalizadas',
        'Experiência nativa',
        'Uso menos dados móveis'
      ]
    };
  };

  const instructions = getInstallInstructions();

  return (
    <>
      {!isMinimized ? (
        <div className="pwa-install-prompt animate-mitsuo-slideInUp">
          <div className="flex items-start space-x-4">
            {/* App Icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <span>{instructions.title}</span>
                    <span className="inline-flex items-center px-2 py-1 bg-brand-500/20 text-brand-400 text-xs font-medium rounded-full">
                      NOVO
                    </span>
                  </h3>
                  <p className="text-sm text-neutral-300 mt-1">
                    {instructions.description}
                  </p>
                </div>

                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 hover:bg-neutral-700 rounded-lg transition-colors touch-target"
                  aria-label="Minimizar"
                >
                  <X className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center space-x-2 text-xs text-neutral-400">
                  <Zap className="w-3 h-3 text-brand-400" />
                  <span>Rápido e Offline</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-neutral-400">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span>Sem Anúncios</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-neutral-400">
                  <Shield className="w-3 h-3 text-green-400" />
                  <span>100% Seguro</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-neutral-400">
                  <Download className="w-3 h-3 text-blue-400" />
                  <span>Grátis</span>
                </div>
              </div>

              {/* Install Instructions */}
              {isIOS || isAndroid ? (
                <div className="space-y-2 mb-3">
                  {instructions.steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs text-neutral-300">
                      <span className="flex-shrink-0 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {!isIOS && (
                  <button
                    onClick={handleInstall}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white font-medium rounded-lg transition-colors touch-target"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isLoading ? 'Instalando...' : 'Instalar App'}</span>
                  </button>
                )}

                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white font-medium rounded-lg transition-colors touch-target"
                >
                  Agora não
                </button>

                {isIOS && (
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white font-medium rounded-lg transition-colors touch-target"
                  >
                    Lembrar depois
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Minimized Banner */
        <div className="fixed bottom-4 left-4 right-4 bg-brand-500 text-white p-3 rounded-lg shadow-lg z-50 animate-mitsuo-slideInUp flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-5 h-5" />
            <span className="text-sm font-medium">Instale o app para uma experiência melhor</span>
          </div>
          <div className="flex items-center space-x-2">
            {!isIOS && (
              <button
                onClick={handleInstall}
                disabled={isLoading}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white text-sm font-medium rounded transition-colors touch-target"
              >
                {isLoading ? 'Instalando...' : 'Instalar'}
              </button>
            )}
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors touch-target"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// PWA Install Button for custom placement
export function PWAInstallButton({
  className = '',
  children = 'Instalar App',
  variant = 'primary' // 'primary' | 'secondary' | 'ghost'
}: {
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}) {
  const { canInstall, isLoading, install } = usePWA();

  if (!canInstall) {
    return null;
  }

  const buttonStyles = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white',
    secondary: 'bg-neutral-700 hover:bg-neutral-600 text-white',
    ghost: 'bg-transparent hover:bg-neutral-700 text-brand-400 hover:text-white border border-brand-500 hover:border-transparent'
  };

  return (
    <button
      onClick={install}
      disabled={isLoading}
      className={`
        flex items-center space-x-2 px-4 py-2 font-medium rounded-lg transition-all duration-200
        ${buttonStyles[variant]}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <Download className="w-4 h-4" />
      <span>{isLoading ? 'Instalando...' : children}</span>
    </button>
  );
}

// Offline Indicator Component
export function OfflineIndicator() {
  const { isOffline, isOnline } = usePWA();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 bg-warning border-b border-warning/20 p-3 z-40 safe-area-inset-top">
      <div className="max-w-screen-2xl mx-auto px-4 flex items-center space-x-3">
        <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
        <p className="text-sm text-warning font-medium">
          Você está offline. Algumas funcionalidades podem não estar disponíveis.
        </p>
      </div>
    </div>
  );
}

// Install Guide for iOS
export function IOSInstallGuide({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 safe-area-inset-top">
      <div className="bg-neutral-800 rounded-2xl max-w-sm w-full p-6 border border-neutral-700 animate-mitsuo-scaleIn">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Como Instalar no iOS</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm text-neutral-300">
              Instale nosso app para acessar offline e receber notificações
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                1
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">Toque no ícone de compartilhar</p>
                <p className="text-xs text-neutral-400">
                  Localizado na barra inferior do Safari
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                2
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">Role e toque em "Adicionar à Tela de Início"</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                3
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">Toque em "Adicionar"</p>
                <p className="text-xs text-neutral-400">
                  O app será instalado na sua tela inicial
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors touch-target"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}