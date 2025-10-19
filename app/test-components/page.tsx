"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardMedia, CardActions } from "@/components/ui/card"
import { Mail, Lock, User, Search, Check, X, Plus, Heart, Star } from "lucide-react" // eslint-disable-line no-unused-vars

export default function ComponentTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    search: "",
    message: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'email':
        if (!value) {
          newErrors.email = "Email é obrigatório"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Email inválido"
        } else {
          delete newErrors.email
        }
        break
      case 'password':
        if (!value) {
          newErrors.password = "Senha é obrigatória"
        } else if (value.length < 6) {
          newErrors.password = "Senha deve ter pelo menos 6 caracteres"
        } else {
          delete newErrors.password
        }
        break
      case 'name':
        if (!value) {
          newErrors.name = "Nome é obrigatório"
        } else if (value.length < 3) {
          newErrors.name = "Nome deve ter pelo menos 3 caracteres"
        } else {
          delete newErrors.name
        }
        break
      default:
        break
    }

    setErrors(newErrors)
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      validateField(name, value)
    }
  }

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, formData[name as keyof typeof formData])
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background text-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Mitsuo Ishida - UI Components</h1>
          <p className="text-gray-400 text-lg">Componentes reutilizáveis following Mitsuo Ishida design system</p>
        </div>

        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-100">Buttons</h2>

          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Variantes de Botões</CardTitle>
              <CardDescription>
                Testando todas as variantes, tamanhos e estados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Primary Variants */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-200">Variantes</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Danger</Button>
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-200">Tamanhos</h3>
                <div className="flex items-center gap-4">
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary" size="md">Medium</Button>
                  <Button variant="primary" size="lg">Large</Button>
                  <Button variant="primary" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* States */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-200">Estados</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Normal</Button>
                  <Button variant="primary" disabled>Disabled</Button>
                  <Button
                    variant="primary"
                    loading={isLoading}
                    onClick={handleSubmit}
                  >
                    {isLoading ? "Loading..." : "Click to Load"}
                  </Button>
                </div>
              </div>

              {/* With Icons */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-200">Com Ícones</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" leftIcon={<Mail className="h-4 w-4" />}>
                    Enviar Email
                  </Button>
                  <Button variant="outline" rightIcon={<Search className="h-4 w-4" />}>
                    Pesquisar
                  </Button>
                  <Button variant="ghost" leftIcon={<Heart className="h-4 w-4" />}>
                    Favoritar
                  </Button>
                  <Button variant="destructive" leftIcon={<X className="h-4 w-4" />}>
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Inputs Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-100">Inputs & Forms</h2>

          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Campos de Input</CardTitle>
              <CardDescription>
                Testando validação, estados e diferentes tipos de input
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Text Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    type="text"
                    label="Nome Completo"
                    placeholder="Digite seu nome"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    error={touched.name ? errors.name : undefined}
                    success={touched.name && !errors.name && formData.name ? "Nome válido!" : undefined}
                    leftIcon={<User className="h-4 w-4" />}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    label="Email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    error={touched.email ? errors.email : undefined}
                    success={touched.email && !errors.email && formData.email ? "Email válido!" : undefined}
                    leftIcon={<Mail className="h-4 w-4" />}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    type="password"
                    label="Senha"
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    error={touched.password ? errors.password : undefined}
                    leftIcon={<Lock className="h-4 w-4" />}
                    showPasswordToggle
                    helperText="Mínimo 6 caracteres"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    label="Pesquisa"
                    placeholder="Buscar conteúdo..."
                    value={formData.search}
                    onChange={(e) => handleInputChange('search', e.target.value)}
                    leftIcon={<Search className="h-4 w-4" />}
                    rightIcon={<Star className="h-4 w-4 text-yellow-500" />}
                    helperText="Busque por cursos, vídeos ou posts"
                  />
                </div>
              </div>

              {/* Textarea */}
              <div>
                <Textarea
                  label="Mensagem"
                  placeholder="Digite sua mensagem aqui..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  helperText="Máximo 500 caracteres"
                  rows={4}
                />
              </div>

              {/* Input Sizes */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-200">Tamanhos de Input</h3>
                <div className="space-y-4">
                  <Input size="sm" label="Input Pequeno" placeholder="Tamanho small" />
                  <Input size="md" label="Input Médio" placeholder="Tamanho medium" />
                  <Input size="lg" label="Input Grande" placeholder="Tamanho large" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-100">Cards</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default Card */}
            <Card variant="default">
              <CardHeader centered>
                <CardTitle>Card Default</CardTitle>
                <CardDescription>
                  Card padrão com borda simples e sombra suave
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300">
                  Este é o card padrão do sistema. Ideal para conteúdo informativo geral.
                </p>
              </CardContent>
              <CardFooter justify="center">
                <Button variant="outline" size="sm">Saiba Mais</Button>
              </CardFooter>
            </Card>

            {/* Elevated Card */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Card Elevated</CardTitle>
                <CardDescription>
                  Card com sombra mais pronunciada para destaque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Card elevado com sombra intensa. Perfeito para destacar conteúdo importante.
                </p>
              </CardContent>
              <CardFooter justify="between">
                <Button variant="ghost" size="sm">Cancelar</Button>
                <Button variant="primary" size="sm">Confirmar</Button>
              </CardFooter>
            </Card>

            {/* Outlined Card */}
            <Card variant="outlined">
              <CardHeader>
                <CardTitle>Card Outlined</CardTitle>
                <CardDescription>
                  Card com borda destacada e fundo transparente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Card com borda grossa e fundo transparente. Excelente para conteúdo secundário.
                </p>
              </CardContent>
              <CardFooter justify="end">
                <Button variant="primary" size="sm">Ver Detalhes</Button>
              </CardFooter>
            </Card>

            {/* Interactive Card */}
            <Card variant="interactive" onClick={() => console.log('Card clicked!')}>
              <CardMedia aspectRatio="video" overlay>
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <PlayIcon className="h-12 w-12 text-white" />
                </div>
              </CardMedia>
              <CardHeader>
                <CardTitle>Card Interactive</CardTitle>
                <CardDescription>
                  Card interativo com efeito hover e click
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Card com efeito hover (scale 1.05) e borda verde. Clique para interagir!
                </p>
              </CardContent>
              <CardActions direction="row" spacing="sm">
                <Button variant="outline" size="sm" leftIcon={<Heart className="h-3 w-3" />}>
                  Curtir
                </Button>
                <Button variant="primary" size="sm" leftIcon={<PlayIcon className="h-3 w-3" />}>
                  Assistir
                </Button>
              </CardActions>
            </Card>
          </div>

          {/* Card with different paddings */}
          <Card variant="elevated" padding="lg">
            <CardHeader>
              <CardTitle>Card com Padding Grande</CardTitle>
              <CardDescription>
                Demonstrando diferentes tamanhos de padding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card variant="outlined" padding="sm">
                  <CardHeader centered>
                    <CardTitle className="text-base">Padding Small</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm">
                    Conteúdo com espaçamento reduzido
                  </CardContent>
                </Card>
                <Card variant="outlined" padding="md">
                  <CardHeader centered>
                    <CardTitle className="text-base">Padding Medium</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm">
                    Conteúdo com espaçamento médio
                  </CardContent>
                </Card>
                <Card variant="outlined" padding="lg">
                  <CardHeader centered>
                    <CardTitle className="text-base">Padding Large</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-sm">
                    Conteúdo com espaçamento amplo
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Accessibility Tests */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-100">Acessibilidade</h2>

          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Testes de Acessibilidade</CardTitle>
              <CardDescription>
                Verificando atributos ARIA e navegação por teclado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-200 mb-4">Navegação por Teclado</h3>
                  <p className="text-gray-400 mb-4">
                    Use Tab para navegar entre os elementos e Enter/Space para ativar:
                  </p>
                  <div className="space-y-3">
                    <Button variant="primary" tabIndex={0}>
                      Botão 1 (Tab order 0)
                    </Button>
                    <Button variant="outline" tabIndex={1}>
                      Botão 2 (Tab order 1)
                    </Button>
                    <Input
                      type="text"
                      label="Input com navegação"
                      placeholder="Use Tab para focar"
                      tabIndex={2}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-200 mb-4">Atributos ARIA</h3>
                  <p className="text-gray-400 mb-4">
                    Elementos com labels e estados para screen readers:
                  </p>
                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      loading={isLoading}
                      onClick={handleSubmit}
                      aria-label="Botão de carregamento"
                    >
                      {isLoading ? "Carregando..." : "Testar Loading"}
                    </Button>
                    <Input
                      type="email"
                      label="Email acessível"
                      placeholder="email@exemplo.com"
                      aria-label="Endereço de email para contato"
                      required
                      error="Email inválido para teste"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Responsive Tests */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-100">Responsividade</h2>

          <Card variant="default" padding="lg">
            <CardHeader>
              <CardTitle>Testes de Breakpoints</CardTitle>
              <CardDescription>
                Redimensione o navegador para testar responsividade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card variant="outlined" padding="sm">
                  <CardHeader centered>
                    <CardTitle className="text-sm">Mobile</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-xs">
                    1 coluna em mobile
                  </CardContent>
                </Card>
                <Card variant="outlined" padding="sm">
                  <CardHeader centered>
                    <CardTitle className="text-sm">Small</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-xs">
                    2 colunas em sm
                  </CardContent>
                </Card>
                <Card variant="outlined" padding="sm">
                  <CardHeader centered>
                    <CardTitle className="text-sm">Large</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-xs">
                    4 colunas em lg
                  </CardContent>
                </Card>
                <Card variant="outlined" padding="sm">
                  <CardHeader centered>
                    <CardTitle className="text-sm">XL</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-xs">
                    Mantém 4 colunas
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-800">
          <p className="text-gray-400">
            Todos os componentes testados ✅ | TypeScript ✅ | Acessibilidade ✅
          </p>
        </div>
      </div>
    </div>
  )
}

// Icon component para demonstração
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}