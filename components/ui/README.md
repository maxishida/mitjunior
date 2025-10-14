# shadcn/ui Components - Guia de Uso

Componentes instalados e prontos para uso no projeto ComunidadeFlix.

---

## Componentes Disponíveis

### 1. Button

Componente de botão com múltiplas variantes e tamanhos.

**Importação:**
```tsx
import { Button } from "@/components/ui/button"
// ou
import { Button } from "@/components/ui"
```

**Exemplo de Uso:**
```tsx
// Variantes
<Button variant="default">Primary Button</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link Button</Button>

// Tamanhos
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔥</Button>

// Combinações
<Button variant="outline" size="lg">
  Large Outline Button
</Button>

// Disabled
<Button disabled>Disabled Button</Button>
```

**Props:**
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"
- `className`: string (classes Tailwind adicionais)
- Todas as props nativas de `<button>` (onClick, type, etc.)

---

### 2. Input

Campo de input estilizado e acessível.

**Importação:**
```tsx
import { Input } from "@/components/ui/input"
// ou
import { Input } from "@/components/ui"
```

**Exemplo de Uso:**
```tsx
// Input básico
<Input type="text" placeholder="Digite seu nome" />

// Com estado controlado
const [email, setEmail] = useState("")
<Input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="seu@email.com"
/>

// Diferentes tipos
<Input type="password" placeholder="Senha" />
<Input type="number" placeholder="Idade" />
<Input type="file" />
<Input type="search" placeholder="Buscar..." />

// Disabled
<Input disabled placeholder="Disabled input" />
```

**Props:**
- `type`: "text" | "email" | "password" | "number" | "file" | "search" | etc.
- `placeholder`: string
- `className`: string
- Todas as props nativas de `<input>`

---

### 3. Card

Componente composable para cards/painéis.

**Importação:**
```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card"
// ou
import { Card, CardHeader, CardTitle /* ... */ } from "@/components/ui"
```

**Exemplo de Uso:**
```tsx
// Card completo
<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição ou subtítulo</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Conteúdo principal do card aqui.</p>
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>

// Card simples
<Card>
  <CardContent>
    <p>Card sem header ou footer</p>
  </CardContent>
</Card>

// Card de curso (exemplo ComunidadeFlix)
<Card className="overflow-hidden hover:shadow-netflix transition-shadow">
  <div className="aspect-video bg-gray-800">
    <img src="/course-thumbnail.jpg" alt="Curso" />
  </div>
  <CardHeader>
    <CardTitle className="text-lg">Next.js Avançado</CardTitle>
    <CardDescription>12 aulas • 4h30min</CardDescription>
  </CardHeader>
  <CardContent>
    <Badge variant="success">Em Andamento</Badge>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Continuar Assistindo</Button>
  </CardFooter>
</Card>
```

**Componentes:**
- `Card`: Container principal
- `CardHeader`: Cabeçalho (título + descrição)
- `CardTitle`: Título do card (h3)
- `CardDescription`: Descrição/subtítulo
- `CardContent`: Conteúdo principal
- `CardFooter`: Rodapé (ações, botões)

---

### 4. Badge

Componente para badges/tags/status.

**Importação:**
```tsx
import { Badge } from "@/components/ui/badge"
// ou
import { Badge } from "@/components/ui"
```

**Exemplo de Uso:**
```tsx
// Variantes
<Badge>Default Badge</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Concluído</Badge>

// Status de curso
<Badge variant="success">Ativo</Badge>
<Badge variant="destructive">Inativo</Badge>
<Badge variant="outline">Rascunho</Badge>

// Lista de tags
<div className="flex gap-2">
  <Badge>React</Badge>
  <Badge>Next.js</Badge>
  <Badge>TypeScript</Badge>
</div>
```

**Props:**
- `variant`: "default" | "secondary" | "destructive" | "outline" | "success"
- `className`: string

---

## Utilitário `cn()`

Função auxiliar para merge de classNames (clsx + tailwind-merge).

**Importação:**
```tsx
import { cn } from "@/lib/utils"
```

**Exemplo de Uso:**
```tsx
// Mesclar classes condicionalmente
<div className={cn(
  "base-class",
  isActive && "active-class",
  isPrimary ? "primary-class" : "secondary-class"
)}>
  Content
</div>

// Sobrescrever classes Tailwind
<Button className={cn("bg-blue-500", "bg-red-500")}>
  {/* Resultado: bg-red-500 (último ganha) */}
  Red Button
</Button>

// Com componentes shadcn/ui
<Card className={cn("border-2", isDarkMode && "border-white")}>
  ...
</Card>
```

---

## Classes Utilitárias Customizadas

### Animações
```tsx
<div className="animate-fade-in">Fade in suave</div>
<div className="animate-slide-up">Slide up</div>
<div className="animate-scale-in">Scale in</div>
```

### Efeitos
```tsx
// Glassmorphism
<div className="glass">Efeito vidro</div>

// Gradientes
<div className="gradient-primary">Gradiente primary</div>
<div className="gradient-dark">Gradiente escuro</div>

// Texto com gradiente
<h1 className="text-gradient">Texto Colorido</h1>
```

### Scrollbar Customizada
```tsx
<div className="custom-scrollbar overflow-y-auto h-64">
  Conteúdo com scroll estilizado
</div>
```

---

## Exemplos Práticos - ComunidadeFlix

### 1. Formulário de Login
```tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Fazer Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </CardContent>
      <CardFooter>
        <Button className="w-full">Entrar</Button>
      </CardFooter>
    </Card>
  )
}
```

### 2. Card de Curso
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function CourseCard({ course }) {
  return (
    <Card className="overflow-hidden hover:scale-105 transition-transform">
      <div className="aspect-video bg-gray-900 relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="object-cover w-full h-full"
        />
        <Badge className="absolute top-2 right-2" variant="success">
          {course.progress}% Concluído
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{course.title}</CardTitle>
        <CardDescription>
          {course.lessons} aulas • {course.duration}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          {course.tags.map(tag => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" className="flex-1">
          Detalhes
        </Button>
        <Button className="flex-1">
          Continuar
        </Button>
      </CardFooter>
    </Card>
  )
}
```

### 3. Dashboard Stats Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function StatCard({ title, value, change, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <span className="text-2xl">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {change > 0 ? "+" : ""}{change}% em relação ao mês anterior
        </p>
      </CardContent>
    </Card>
  )
}

// Uso
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <StatCard title="Cursos Ativos" value={12} change={8} icon="📚" />
  <StatCard title="Alunos" value={350} change={15} icon="👥" />
  <StatCard title="Vídeos" value={48} change={5} icon="🎥" />
</div>
```

---

## Próximos Componentes a Adicionar (FASE 2)

- [ ] Dialog/Modal
- [ ] Dropdown Menu
- [ ] Select
- [ ] Textarea
- [ ] Toast/Notification
- [ ] Tabs
- [ ] Avatar
- [ ] Skeleton
- [ ] Progress
- [ ] Switch (toggle)
- [ ] Checkbox
- [ ] Radio Group
- [ ] Label
- [ ] Form (com validação)

---

## Recursos

- **shadcn/ui Docs:** https://ui.shadcn.com/docs/components
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **Class Variance Authority:** https://cva.style/docs

---

**Criado em:** 2025-10-11
**Atualizado em:** 2025-10-11
