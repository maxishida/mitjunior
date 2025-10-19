'use client'

import React from "react"
import {
  Button,
  Input,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  FeatureCard,
  TestimonialCard,
  PricingCard,
  StatsCard
} from "@/components/ui"
import {
  Star,
  Check,
  TrendingUp,
  Users,
  Award,
  BookOpen,
  Target,
  Zap,
  Shield,
  ArrowRight
} from "lucide-react"

export default function UIComponentsDemo() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-100">
            Componentes UI Mitsuo Ishida
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Demonstração dos componentes modernos e profissionais criados para a landing page
          </p>
        </div>

        {/* Buttons Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-100">Button Components</h2>
            <p className="text-gray-400">Múltiplas variantes com design consistente</p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="primary">Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button loading>Loading</Button>
            <Button leftIcon={<Star className="w-4 h-4" />}>
              Com Ícone
            </Button>
            <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
              Com Setinha
            </Button>
          </div>
        </section>

        {/* Badge Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-100">Badge Components</h2>
            <p className="text-gray-400">Selos e status com múltiplas variantes</p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Badge>Default</Badge>
            <Badge variant="brand">Brand</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="featured" animation="pulse">Featured</Badge>
            <Badge variant="popular">Popular</Badge>
            <Badge dot variant="success">Com Dot</Badge>
            <Badge leftIcon={<Star className="w-3 h-3" />} variant="brand">
              Com Ícone
            </Badge>
          </div>
        </section>

        {/* Input Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-100">Input Components</h2>
            <p className="text-gray-400">Campos de formulário modernos</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Input
              label="Nome completo"
              placeholder="Digite seu nome"
              helperText="Use seu nome real"
            />
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              leftIcon={<Star className="w-4 h-4" />}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              showPasswordToggle
            />
            <Input
              label="Telefone"
              placeholder="(00) 00000-0000"
              success="Número válido"
            />
            <Input
              label="Website"
              placeholder="https://seusite.com"
              error="URL inválida"
            />
            <Input
              label="Valor"
              placeholder="R$ 0,00"
              leftIcon={<TrendingUp className="w-4 h-4" />}
              variant="success"
            />
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-100">Feature Cards</h2>
            <p className="text-gray-400">Cards para destaque de benefícios</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Zap}
              title="Performance"
              description="Otimização avançada para máxima velocidade e experiência do usuário"
              variant="default"
            />
            <FeatureCard
              icon={Shield}
              title="Segurança"
              description="Proteção de dados com criptografia de ponta a ponta e monitoramento 24/7"
              variant="elevated"
            />
            <FeatureCard
              icon={Award}
              title="Qualidade Premium"
              description="Soluções enterprise com suporte dedicado e SLAs garantidos"
              variant="interactive"
            />
          </div>
        </section>

        {/* Testimonial Cards Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-100">Testimonial Cards</h2>
            <p className="text-gray-400">Depoimentos de clientes com design profissional</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="A qualidade do serviço superou todas as expectativas. Recomendo sem dúvidas!"
              author="Ana Silva"
              role="CEO"
              company="TechCorp"
              rating={5}
              verified={true}
            />
            <TestimonialCard
              quote="Excelente equipe profissional. Transformaram completamente nossa presença digital."
              author="Carlos Santos"
              role="Diretor de Marketing"
              company="Digital Agency"
              rating={5}
              featured={true}
            />
            <TestimonialCard
              quote="Resultados incríveis em pouco tempo. O ROI foi muito superior ao esperado."
              author="Maria Oliveira"
              role="Fundadora"
              company="StartupX"
              rating={4}
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=maria"
            />
          </div>
        </section>

        {/* Pricing Cards Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-100">Pricing Cards</h2>
            <p className="text-gray-400">Planos de preços com design atrativo</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              title="Starter"
              description="Perfeito para pequenos projetos"
              price="99"
              features={[
                { name: "5 projetos", included: true },
                { name: "10GB armazenamento", included: true },
                { name: "Suporte por email", included: true },
                { name: "API acessível", included: false },
                { name: "Relatórios avançados", included: false },
              ]}
              buttonVariant="outline"
            />
            <PricingCard
              title="Professional"
              description="Ideal para equipes em crescimento"
              price="299"
              originalPrice="399"
              features={[
                { name: "Projetos ilimitados", included: true },
                { name: "100GB armazenamento", included: true },
                { name: "Suporte prioritário", included: true },
                { name: "API completa", included: true },
                { name: "Relatórios avançados", included: true },
              ]}
              variant="popular"
              buttonText="Começar agora"
            />
            <PricingCard
              title="Enterprise"
              description="Soluções personalizadas para grandes empresas"
              price="999"
              features={[
                { name: "Projetos ilimitados", included: true, description: "Sem limites" },
                { name: "Armazenamento ilimitado", included: true },
                { name: "Suporte 24/7", included: true, description: "Dedicado" },
                { name: "API personalizada", included: true },
                { name: "SLA garantido", included: true },
                { name: "Treinamento da equipe", included: true },
              ]}
              variant="enterprise"
              buttonVariant="outline"
            />
          </div>
        </section>

        {/* Stats Cards Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-100">Stats Cards</h2>
            <p className="text-gray-400">Estatísticas com animações suaves</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <StatsCard
              title="Clientes Ativos"
              value={1250}
              description="Empresas confiam em nós"
              icon={<Users />}
              trend={{ value: "+12%", direction: "up", period: "este mês" }}
              animated={true}
            />
            <StatsCard
              title="Taxa de Sucesso"
              value={98.5}
              suffix="%"
              description="De entregas no prazo"
              icon={<Check />}
              variant="gradient"
              animated={true}
              animationDelay={200}
            />
            <StatsCard
              title="Projetos Concluídos"
              value={3420}
              description="Em diversos setores"
              icon={<Target />}
              trend={{ value: "+8%", direction: "up", period: "trimestre" }}
              animated={true}
              animationDelay={400}
            />
            <StatsCard
              title="Anos de Experiência"
              value={15}
              description="No mercado digital"
              icon={<Award />}
              variant="elevated"
              animated={true}
              animationDelay={600}
            />
          </div>
        </section>

        {/* Regular Cards Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-100">Card Components</h2>
            <p className="text-gray-400">Cards versáteis para diferentes usos</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="default">
              <CardHeader centered>
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-brand" />
                <CardTitle>Aprendizado Contínuo</CardTitle>
                <CardDescription>
                  Mantenha-se atualizado com as últimas tendências do mercado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Acesso a conteúdo exclusivo, workshops e eventos especiais.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Card Elevado</CardTitle>
                <CardDescription>
                  Com sombras mais pronunciadas para destaque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Ideal para conteúdo que precisa de maior visibilidade na página.
                </p>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>Card Glass</CardTitle>
                <CardDescription>
                  Efeito de vidro com transparência
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Design moderno com efeito de desfoque no fundo.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-800">
          <p className="text-gray-500">
            Componentes UI Mitsuo Ishida • Build otimizado e responsivo •
            <span className="text-brand"> Verde #00C896</span> como cor primária
          </p>
        </div>
      </div>
    </div>
  )
}