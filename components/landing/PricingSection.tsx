"use client"

import React, { useState } from "react"
import { Check, Star, ArrowRight, Calendar, CreditCard, BookOpen, User } from "lucide-react"
import { Button } from "@/components/ui"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardActions,
} from "@/components/ui"

// Tipagem para os produtos
interface Product {
  id: string
  title: string
  subtitle: string
  price?: string
  features: string[]
  icon: React.ReactNode
  cta: string
  popular?: boolean
  color: string
}

// Produtos configurados conforme copy.md
const products: Product[] = [
  {
    id: "academia-financas",
    title: "Academia de Finanças",
    subtitle: "30 Dias pra Virar o Jogo",
    features: [
      "Anote e entenda seus gastos",
      "Elimine dívidas pequenas que drenam sua renda",
      "Planeje os próximos meses com clareza",
      "Comece sua renda extra com estratégia"
    ],
    icon: <Calendar className="w-6 h-6" />,
    cta: "Quero entrar no desafio",
    color: "from-brand-500 to-brand-600"
  },
  {
    id: "projeto-verao",
    title: "Projeto Verão",
    subtitle: "Seca Dívidas",
    features: [
      "Passo a passo simples e aplicável",
      "Começa com o essencial: anotar para poder mudar",
      "Pare de \"ganhar tempo\" e ataque o que pesa"
    ],
    icon: <CreditCard className="w-6 h-6" />,
    cta: "Quero secar minhas dívidas",
    color: "from-brand-600 to-brand-700"
  },
  {
    id: "consultoria",
    title: "Consultoria de Finanças & Impostos",
    subtitle: "Atendimento Online",
    price: "R$ 290/h",
    features: [
      "Atendimento 1:1 personalizado",
      "Orientação para declaração do Imposto de Renda",
      "Foco em clareza e decisão",
      "Resolução de dúvidas específicas"
    ],
    icon: <User className="w-6 h-6" />,
    cta: "Agendar minha consultoria",
    popular: true,
    color: "from-brand-500 to-brand-600"
  },
  {
    id: "ebook",
    title: "E-book",
    subtitle: "3 passos para começar a investir",
    features: [
      "Fundamentos práticos",
      "Estrutura para dar o primeiro passo com confiança",
      "Linguagem simples e direta",
      "Guia completo para iniciantes"
    ],
    icon: <BookOpen className="w-6 h-6" />,
    cta: "Quero meu e-book",
    color: "from-brand-600 to-brand-700"
  }
]

// Componente para feature list com checkmarks
const FeatureList: React.FC<{ features: string[] }> = ({ features }) => (
  <ul className="space-y-3" role="list">
    {features.map((feature, index) => (
      <li
        key={index}
        className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed"
        role="listitem"
      >
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center mt-0.5">
          <Check className="w-3 h-3 text-brand-400" aria-hidden="true" />
        </div>
        <span>{feature}</span>
      </li>
    ))}
  </ul>
)

// Componente principal PricingSection
export const PricingSection: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  // Handlers para CTAs
  const handleCTAClick = (productId: string) => {
    setSelectedProduct(productId)

    // Lógica de redirecionamento ou ação baseada no produto
    switch (productId) {
      case "academia-financas":
        // Redirecionar para página da academia ou abrir modal
        console.log("Redirecionar para: Academia de Finanças")
        window.open("#contato", "_self")
        break
      case "projeto-verao":
        // Redirecionar para página do projeto
        console.log("Redirecionar para: Projeto Verão")
        window.open("#contato", "_self")
        break
      case "consultoria":
        // Redirecionar para agendamento
        console.log("Redirecionar para: Agendamento de Consultoria")
        window.open("#contato", "_self")
        break
      case "ebook":
        // Redirecionar para download/pagina do e-book
        console.log("Redirecionar para: Download E-book")
        window.open("#contato", "_self")
        break
      default:
        console.log("Produto não encontrado:", productId)
    }
  }

  return (
    <section className="relative py-20 px-4 overflow-hidden" id="pricing">
      {/* Background com gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#00C896_0%,_transparent_50%)] opacity-5" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 mb-6">
            <Star className="w-4 h-4 text-brand-400" />
            <span className="text-sm font-medium text-brand-300">Planos e Produtos</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Comece Sua Jornada Financeira Hoje
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Escolha o caminho ideal para transformar sua relação com o dinheiro.
            Do primeiro passo à liberdade financeira.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <div key={product.id} className="relative group">
              {/* Badge de popular para consultoria */}
              {product.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="px-3 py-1 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full">
                    <span className="text-xs font-semibold text-white flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Mais Popular
                    </span>
                  </div>
                </div>
              )}

              <Card
                variant={product.popular ? "elevated" : "default"}
                className={`
                  relative h-full flex flex-col
                  border-gray-800 bg-neutral-800/50 backdrop-blur-sm
                  hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand/10
                  transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1
                  ${product.popular ? 'ring-2 ring-brand-500/20 shadow-lg shadow-brand/5' : ''}
                `}
                role="article"
                aria-labelledby={`${product.id}-title`}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex w-12 h-12 rounded-xl bg-gradient-to-r ${product.color} items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {product.icon}
                    </div>
                  </div>

                  <CardTitle
                    id={`${product.id}-title`}
                    className="text-xl font-bold text-white mb-2"
                  >
                    {product.title}
                  </CardTitle>

                  <CardDescription className="text-brand-400 font-medium text-sm">
                    {product.subtitle}
                  </CardDescription>

                  {product.price && (
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-white">{product.price}</span>
                      <span className="text-gray-400 ml-2">/hora</span>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="flex-1">
                  <FeatureList features={product.features} />
                </CardContent>

                <CardActions className="pt-6">
                  <Button
                    variant={product.popular ? "primary" : "outline"}
                    size="lg"
                    className={`
                      w-full font-semibold
                      ${product.popular
                        ? 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-lg shadow-brand/25'
                        : 'border-brand-500 text-brand-400 hover:bg-brand-500 hover:text-white'
                      }
                      transition-all duration-300 group
                    `}
                    onClick={() => handleCTAClick(product.id)}
                    aria-describedby={`${product.id}-description`}
                  >
                    <span>{product.cta}</span>
                    <ArrowRight
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Button>
                </CardActions>
              </Card>
            </div>
          ))}
        </div>

        {/* Seção de garantia/mensagem final */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4 p-6 rounded-2xl border border-gray-800 bg-neutral-800/30 backdrop-blur-sm max-w-2xl mx-auto">
            <div className="flex items-center gap-2 text-green-400">
              <Check className="w-5 h-5" />
              <span className="font-semibold">Garantia de Satisfação</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Todos os produtos incluem garantia de 7 dias.
              Se não ficar satisfeito, reembolsamos 100% do seu investimento.
            </p>
          </div>
        </div>

        {/* Call-to-action final */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Precisa de ajuda para escolher o plano ideal?
          </p>
          <Button
            variant="ghost"
            size="md"
            className="text-brand-400 hover:text-brand-300 hover:bg-brand-500/10"
            onClick={() => window.open("#contato", "_self")}
          >
            Falar com especialista
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default PricingSection