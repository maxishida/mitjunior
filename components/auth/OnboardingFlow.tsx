'use client';

import { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  BookOpen,
  Target,
  Zap,
  Users,
  Award,
  Clock,
  TrendingUp,
  PlayCircle,
  Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase.config';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface OnboardingData {
  goals: string[];
  experience: string;
  timeCommitment: string;
  interests: string[];
  notifications: boolean;
}

const OnboardingFlow = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    goals: [],
    experience: '',
    timeCommitment: '',
    interests: [],
    notifications: true
  });
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const goals = [
    { id: 'investir', label: 'Começar a investir', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'dividas', label: 'Sair das dívidas', icon: <Target className="h-4 w-4" /> },
    { id: 'emergencia', label: 'Criar reserva de emergência', icon: <Award className="h-4 w-4" /> },
    { id: 'aposentadoria', label: 'Planejar aposentadoria', icon: <Clock className="h-4 w-4" /> },
    { id: 'educacao', label: 'Educação financeira', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'empreender', label: 'Empreender', icon: <Zap className="h-4 w-4" /> }
  ];

  const experiences = [
    { id: 'iniciante', label: 'Iniciante', description: 'Não tenho experiência com investimentos' },
    { id: 'basico', label: 'Básico', description: 'Conheço o básico, quero aprofundar' },
    { id: 'intermediario', label: 'Intermediário', description: 'Já invisto, quero otimizar' },
    { id: 'avancado', label: 'Avançado', description: 'Busco estratégias sofisticadas' }
  ];

  const timeCommitments = [
    { id: '15min', label: '15 min/dia', description: 'Quick wins e estratégias rápidas' },
    { id: '30min', label: '30 min/dia', description: 'Equilíbrio entre teoria e prática' },
    { id: '1hora', label: '1 hora/dia', description: 'Aprofundamento completo' },
    { id: 'flexivel', label: 'Flexível', description: 'Aprendo no meu ritmo' }
  ];

  const interests = [
    { id: 'acoes', label: 'Ações', icon: '📈' },
    { id: 'criptomoedas', label: 'Criptomoedas', icon: '₿' },
    { id: 'imoveis', label: 'Imóveis', icon: '🏠' },
    { id: 'rendafixa', label: 'Renda Fixa', icon: '💰' },
    { id: 'fundos', label: 'Fundos', icon: '📊' },
    { id: 'poupanca', label: 'Poupança', icon: '💎' }
  ];

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bem-vindo à Comunidade Flix!',
      description: 'Sua jornada para liberdade financeira começa aqui',
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      content: null // Will be rendered separately
    },
    {
      id: 'goals',
      title: 'Quais são seus objetivos financeiros?',
      description: 'Selecione tudo que se aplica ao seu momento atual',
      icon: <Target className="h-8 w-8 text-blue-500" />,
      content: null // Will be rendered separately
    },
    {
      id: 'experience',
      title: 'Como você avalia seu conhecimento?',
      description: 'Isso nos ajudará a personalizar seu conteúdo',
      icon: <BookOpen className="h-8 w-8 text-green-500" />,
      content: null // Will be rendered separately
    },
    {
      id: 'time',
      title: 'Quanto tempo pode dedicar?',
      description: 'Criaremos um plano que se encaixa na sua rotina',
      icon: <Clock className="h-8 w-8 text-purple-500" />,
      content: null // Will be rendered separately
    },
    {
      id: 'interests',
      title: 'Quais temas te interessam mais?',
      description: 'Personalizaremos seu feed de conteúdo',
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      content: null // Will be rendered separately
    },
    {
      id: 'completion',
      title: 'Tudo pronto para começar!',
      description: 'Configuramos tudo para você ter sucesso',
      icon: <Check className="h-8 w-8 text-green-500" />,
      content: null // Will be rendered separately
    }
  ];

  const saveOnboardingData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        onboardingCompleted: true,
        onboardingData,
        completedAt: new Date(),
        profileSetup: true
      });

      // Save goals and interests for personalization
      await updateDoc(userRef, {
        goals: onboardingData.goals,
        interests: onboardingData.interests,
        experience: onboardingData.experience,
        timeCommitment: onboardingData.timeCommitment,
        preferences: {
          notifications: onboardingData.notifications,
          onboardingVersion: '1.0'
        }
      });

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      saveOnboardingData();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const toggleGoal = (goalId: string) => {
    setOnboardingData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const toggleInterest = (interestId: string) => {
    setOnboardingData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(i => i !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const setExperience = (exp: string) => {
    setOnboardingData(prev => ({ ...prev, experience: exp }));
  };

  const setTimeCommitment = (time: string) => {
    setOnboardingData(prev => ({ ...prev, timeCommitment: time }));
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <div className="text-center py-8">
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Star className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <PlayCircle className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Aprenda de forma prática</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Vídeos curtos e exercícios práticos para aplicar imediatamente
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Users className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Comunidade ativa</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Troque experiências com milhares de alunos em mesma jornada
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Award className="h-6 w-6 text-purple-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Gamificação</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Conquiste badges e avance de nível enquanto aprende
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-6 w-6 text-orange-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Resultados reais</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Acompanhe seu progresso e veja sua evolução financeira
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-bold text-lg mb-2">Vamos começar?</h3>
              <p className="text-sm opacity-90 mb-4">
                Este questionário rápido (2 min) nos ajudará a personalizar sua experiência
              </p>
              <button
                onClick={() => setShowWelcome(false)}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Começar agora
              </button>
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600 text-center mb-8">
              {steps[currentStep].description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {goals.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    onboardingData.goals.includes(goal.id)
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className={`mr-3 ${
                      onboardingData.goals.includes(goal.id)
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    }`}>
                      {goal.icon}
                    </div>
                    <span className="font-medium">{goal.label}</span>
                  </div>
                  {onboardingData.goals.includes(goal.id) && (
                    <Check className="h-4 w-4 text-blue-600 ml-auto" />
                  )}
                </button>
              ))}
            </div>
            {onboardingData.goals.length === 0 && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Selecione pelo menos um objetivo para continuar
              </p>
            )}
          </div>
        );

      case 'experience':
        return (
          <div className="py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600 text-center mb-8">
              {steps[currentStep].description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {experiences.map(exp => (
                <button
                  key={exp.id}
                  onClick={() => setExperience(exp.id)}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                    onboardingData.experience === exp.id
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      onboardingData.experience === exp.id
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{exp.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{exp.description}</p>
                  {onboardingData.experience === exp.id && (
                    <Check className="h-5 w-5 text-green-600 mt-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'time':
        return (
          <div className="py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600 text-center mb-8">
              {steps[currentStep].description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {timeCommitments.map(time => (
                <button
                  key={time.id}
                  onClick={() => setTimeCommitment(time.id)}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                    onboardingData.timeCommitment === time.id
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      onboardingData.timeCommitment === time.id
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Clock className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{time.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{time.description}</p>
                  {onboardingData.timeCommitment === time.id && (
                    <Check className="h-5 w-5 text-purple-600 mt-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'interests':
        return (
          <div className="py-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600 text-center mb-8">
              {steps[currentStep].description}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {interests.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-center ${
                    onboardingData.interests.includes(interest.id)
                      ? 'border-orange-500 bg-orange-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-3xl mb-2">{interest.icon}</div>
                  <p className="text-sm font-medium">{interest.label}</p>
                  {onboardingData.interests.includes(interest.id) && (
                    <Check className="h-4 w-4 text-orange-600 mx-auto mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'completion':
        return (
          <div className="text-center py-8">
            <div className="mb-8">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Seu perfil personalizado</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start">
                  <Target className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Objetivos selecionados</p>
                    <p className="text-xs text-gray-600">
                      {onboardingData.goals.length} focos de aprendizado
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BookOpen className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Nível: {
                      experiences.find(e => e.id === onboardingData.experience)?.label
                    }</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Compromisso: {
                      timeCommitments.find(t => t.id === onboardingData.timeCommitment)?.label
                    }</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Zap className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Interesses</p>
                    <p className="text-xs text-gray-600">
                      {onboardingData.interests.length} temas selecionados
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-6 max-w-md mx-auto">
              <Award className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2">🎉 Parabéns!</h3>
              <p className="text-sm opacity-90">
                Você ganhou seu primeiro badge e já pode começar sua jornada!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return !showWelcome;
      case 'goals':
        return onboardingData.goals.length > 0;
      case 'experience':
        return onboardingData.experience !== '';
      case 'time':
        return onboardingData.timeCommitment !== '';
      case 'interests':
        return true; // Optional step
      case 'completion':
        return true;
      default:
        return true;
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-center text-sm text-gray-600">
            Passo {currentStep + 1} de {steps.length}
          </p>
        </div>

        {/* Current step icon */}
        <div className="flex justify-center mb-8">
          <div className={`p-4 rounded-full bg-white shadow-lg ${
            steps[currentStep].id === 'completion' ? 'bg-green-50' : ''
          }`}>
            {steps[currentStep].icon}
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {renderStepContent()}

          {/* Navigation */}
          {!showWelcome && steps[currentStep].id !== 'completion' && (
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0 || loading}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </button>

                <button
                  onClick={handleNext}
                  disabled={!canProceed() || loading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processando...
                    </>
                  ) : isLastStep ? (
                    <>
                      Concluir
                      <Check className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Próximo
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Skip option for welcome */}
        {showWelcome && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowWelcome(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Pular introdução →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;