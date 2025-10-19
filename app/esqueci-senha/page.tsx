'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import PasswordRecovery from '@/components/auth/PasswordRecovery';

export default function EsqueciSenhaPage() {
  const [emailSent, setEmailSent] = useState(false);

  const handleBack = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o login
        </button>

        {/* Main card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Recuperação de senha
            </h1>
            <p className="text-gray-400">
              Enviaremos um link para você redefinir sua senha
            </p>
          </div>

          <PasswordRecovery onBack={handleBack} className="max-w-full" />

          {/* Security notice */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">
                Link seguro e único uso
              </span>
            </div>
          </div>
        </div>

        {/* Help section */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Precisa de ajuda? Entre em contato com nosso suporte
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="mailto:suporte@comunidadeflix.com"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              suporte@comunidadeflix.com
            </a>
            <span className="text-gray-500">•</span>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}