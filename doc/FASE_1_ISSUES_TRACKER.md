# FASE 1 - Issues Tracker

**Projeto:** ComunidadeFlix
**Data:** 12 de outubro de 2025
**Status:** 4 resolvidos | 6 pendentes | 0 bloqueadores

---

## Issues Criticos (RESOLVIDOS)

### ✅ #1 - Incompatibilidade Tailwind CSS v4
**Status:** RESOLVIDO
**Prioridade:** CRITICA
**Arquivo:** `/app/globals.css`
**Assignee:** Code Review Agent

**Problema:**
Build falhava com erro `Cannot apply unknown utility class` devido a uso de `@apply` com Tailwind v4.

**Solucao Aplicada:**
- Refatorado CSS para usar propriedades nativas ao inves de `@apply`
- Animacoes movidas para `@layer utilities`
- Build agora passa sem erros

**Commit:** Durante code review session
**Tempo:** 45 min

---

### ✅ #2 - Styled-JSX em Server Components
**Status:** RESOLVIDO
**Prioridade:** CRITICA
**Arquivos:** `/components/landing/*.tsx`
**Assignee:** Code Review Agent

**Problema:**
Componentes landing usavam `<style jsx>` sem diretiva `'use client'`, causando erro de build.

**Solucao Aplicada:**
- Removido styled-jsx de todos componentes landing
- Animacoes migradas para globals.css
- Componentes agora Server Components puros

**Commit:** Durante code review session
**Tempo:** 30 min

---

### ✅ #3 - Metadata SEO Incompleta
**Status:** RESOLVIDO
**Prioridade:** ALTA
**Arquivo:** `/app/layout.tsx`
**Assignee:** Code Review Agent

**Problema:**
Faltavam tags Open Graph, Twitter Cards e structured data para SEO.

**Solucao Aplicada:**
- Adicionado metadata completo em layout.tsx
- Structured data (JSON-LD) implementado em page.tsx
- Tags OG e Twitter configuradas

**Commit:** Durante code review session
**Tempo:** 20 min

---

### ✅ #4 - Acessibilidade - Skip Link
**Status:** RESOLVIDO
**Prioridade:** MEDIA
**Arquivo:** `/app/page.tsx`
**Assignee:** Code Review Agent

**Problema:**
Faltava skip link para navegacao por teclado.

**Solucao Aplicada:**
- Adicionado skip link com classes sr-only
- Implementado foco visivel ao ativar
- Testado com navegacao por teclado

**Commit:** Durante code review session
**Tempo:** 15 min

---

## Issues Pendentes (NAO-BLOCANTES)

### ⚠️ #5 - Console.logs em Producao
**Status:** ABERTO
**Prioridade:** MEDIA
**Arquivos:**
- `/components/landing/Hero.tsx` (linhas 5, 9)
- `/components/landing/Products.tsx` (linha 60, 150)
- `/components/landing/TaxSection.tsx` (linha 5)
- `/components/layout/Navbar.tsx` (linha 90)

**Problema:**
Console.logs presentes em codigo de producao podem:
- Expor informacoes sensiveis
- Degradar performance
- Poluir console do usuario

**Solucao Proposta:**
```typescript
// Opcao 1: Remover completamente
// console.log('CTA clicado')

// Opcao 2: Condicionar a ambiente
if (process.env.NODE_ENV === 'development') {
  console.log('CTA clicado')
}

// Opcao 3: Usar sistema de analytics
trackEvent('cta_clicked', { location: 'hero' })
```

**Estimativa:** 15 min
**Prioridade Deploy:** ALTA (deve ser feito antes do deploy)

**Comando para corrigir:**
```bash
# Remover todos console.logs
find components -name "*.tsx" -exec sed -i '/console\.log/d' {} +

# OU configurar ESLint
npx eslint --fix --rule 'no-console: error' components/
```

---

### ⚠️ #6 - Import Bootstrap Desnecessario
**Status:** ABERTO
**Prioridade:** MEDIA
**Arquivo:** `/app/layout.tsx` (linha 3)
**Impacto Bundle:** +200 KB

**Problema:**
```typescript
import "bootstrap/dist/css/bootstrap.min.css";
```

Projeto usa Tailwind CSS mas importa Bootstrap completo, aumentando bundle size desnecessariamente.

**Solucao Proposta:**
```typescript
// Remover linha completamente
// import "bootstrap/dist/css/bootstrap.min.css";

// OU se houver uso de componentes Bootstrap:
import 'bootstrap/dist/css/bootstrap-grid.min.css'; // Apenas grid
```

**Estimativa:** 5 min
**Prioridade Deploy:** MEDIA

**Comando para corrigir:**
```bash
# Editar app/layout.tsx e remover linha 3
```

---

### ⚠️ #7 - Navbar Duplicada
**Status:** ABERTO
**Prioridade:** BAIXA
**Arquivo:** `/components/Navbar.tsx` (nao usado)

**Problema:**
Existem dois arquivos Navbar:
- `/components/Navbar.tsx` (nao usado)
- `/components/layout/Navbar.tsx` (em uso)

Isso causa confusao no codebase.

**Solucao Proposta:**
```bash
# Deletar arquivo nao usado
rm /components/Navbar.tsx

# Atualizar imports se necessario (ja esta correto)
```

**Estimativa:** 2 min
**Prioridade Deploy:** BAIXA

---

### ⚠️ #8 - Links Sociais Placeholder
**Status:** ABERTO
**Prioridade:** BAIXA
**Arquivo:** `/components/layout/Footer.tsx` (linhas 47-71)

**Problema:**
```typescript
{
  name: 'Instagram',
  href: '#', // Link placeholder
  // ...
}
```

Todos os 4 links sociais apontam para `#` ao inves de URLs reais.

**Impacto:**
- Usuario clica mas nao vai a lugar nenhum
- SEO prejudicado
- Experiencia ruim

**Solucao Proposta:**
```typescript
const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/mitjunior', // URL real
    icon: Instagram,
    ariaLabel: 'Instagram da ComunidadeFlix',
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@mitjunior', // URL real
    icon: Youtube,
    ariaLabel: 'YouTube da ComunidadeFlix',
  },
  // ... outros
];
```

**Estimativa:** 10 min
**Prioridade Deploy:** MEDIA

---

### ⚠️ #9 - Alt Text Generico em Avatar
**Status:** ABERTO
**Prioridade:** BAIXA (Acessibilidade)
**Arquivo:** `/components/layout/Navbar.tsx` (linha 147)

**Problema:**
```typescript
<img src={user.photoURL} alt={user.displayName || 'Usuario'} />
```

Alt text "Usuario" nao e descritivo para screen readers.

**Solucao Proposta:**
```typescript
<img
  src={user.photoURL}
  alt={`Foto de perfil de ${user.displayName || user.email?.split('@')[0] || 'usuario'}`}
/>
```

**Estimativa:** 5 min
**Prioridade Deploy:** BAIXA

---

### ⚠️ #10 - Hardcoded Animation Delays
**Status:** ABERTO
**Prioridade:** BAIXA (Manutencao)
**Arquivos:** Multiplos componentes landing

**Problema:**
```typescript
// Valores hardcoded dificultam ajustes globais
style={{ animationDelay: `${index * 0.1}s` }}
```

**Solucao Proposta:**
```typescript
// Criar arquivo de constantes
// /lib/constants.ts
export const ANIMATION_CONFIG = {
  DELAY_STEP: 0.1,
  DURATION: {
    FAST: 0.3,
    MEDIUM: 0.6,
    SLOW: 0.8,
  }
}

// Usar nos componentes
import { ANIMATION_CONFIG } from '@/lib/constants'

style={{ animationDelay: `${index * ANIMATION_CONFIG.DELAY_STEP}s` }}
```

**Estimativa:** 20 min
**Prioridade Deploy:** BAIXA

---

## Issues Futuros (Recomendacoes para FASE 2)

### 💡 #11 - Implementar Error Boundaries
**Status:** NAO INICIADO
**Prioridade:** MEDIA
**Arquivos:** Criar `/app/error.tsx`, `/components/ErrorBoundary.tsx`

**Problema:**
Nenhum Error Boundary implementado. Se um componente quebrar, toda aplicacao cai.

**Solucao Proposta:**
```typescript
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1419]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Ops! Algo deu errado
        </h2>
        <p className="text-gray-400 mb-6">
          {error.message || 'Ocorreu um erro inesperado'}
        </p>
        <button
          onClick={() => reset()}
          className="bg-[#00C896] text-white px-6 py-3 rounded-lg hover:bg-[#00B386]"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )
}
```

**Estimativa:** 1-2 h
**Prioridade FASE 2:** ALTA

---

### 💡 #12 - Adicionar Testes Unitarios
**Status:** NAO INICIADO
**Prioridade:** ALTA
**Arquivos:** Criar estrutura de testes

**Problema:**
Nenhum teste implementado. Dificil garantir que mudancas nao quebrem funcionalidades.

**Solucao Proposta:**
```bash
# Setup Vitest + Testing Library
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @vitejs/plugin-react jsdom

# Criar vitest.config.ts
# Adicionar script "test" no package.json
```

**Exemplos de testes:**
```typescript
// components/__tests__/Navbar.test.tsx
import { render, screen } from '@testing-library/react'
import Navbar from '../layout/Navbar'

describe('Navbar', () => {
  it('renders logo', () => {
    render(<Navbar />)
    expect(screen.getByText(/ComunidadeFlix/i)).toBeInTheDocument()
  })

  it('shows login button when not authenticated', () => {
    render(<Navbar />)
    expect(screen.getByText(/Entrar/i)).toBeInTheDocument()
  })
})
```

**Estimativa:** 4-8 h (setup + testes basicos)
**Prioridade FASE 2:** ALTA

---

### 💡 #13 - Implementar Analytics Tracking
**Status:** NAO INICIADO
**Prioridade:** MEDIA
**Arquivos:** Criar `/lib/analytics.ts`

**Problema:**
Console.logs usados para tracking de eventos. Nao ha dados reais de usuario.

**Solucao Proposta:**
```typescript
// lib/analytics.ts
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  if (typeof window === 'undefined') return

  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', eventName, properties)
  }

  // Facebook Pixel (se aplicavel)
  if (window.fbq) {
    window.fbq('track', eventName, properties)
  }

  // Log em dev
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, properties)
  }
}

// Usar nos componentes
import { trackEvent } from '@/lib/analytics'

const handlePrimaryCTA = () => {
  trackEvent('cta_clicked', {
    location: 'hero',
    button: 'Quero Virar o Jogo Agora'
  })
}
```

**Estimativa:** 2-3 h
**Prioridade FASE 2:** MEDIA

---

### 💡 #14 - Otimizar Imagens com next/image
**Status:** NAO INICIADO
**Prioridade:** MEDIA
**Arquivos:** Navbar.tsx, Authority.tsx (avatares)

**Problema:**
Tags `<img>` usadas ao inves de `next/image`, perdendo otimizacoes automaticas.

**Solucao Proposta:**
```typescript
import Image from 'next/image'

// Ao inves de:
<img src={user.photoURL} alt="Avatar" />

// Usar:
<Image
  src={user.photoURL}
  alt="Avatar"
  width={32}
  height={32}
  className="rounded-full"
  priority={false}
  loading="lazy"
/>
```

**Beneficios:**
- Lazy loading automatico
- Responsive images
- WebP conversion automatica
- Blur placeholder
- Melhor performance

**Estimativa:** 1-2 h
**Prioridade FASE 2:** MEDIA

---

### 💡 #15 - Habilitar TypeScript Strict Mode
**Status:** NAO INICIADO
**Prioridade:** BAIXA
**Arquivo:** `/tsconfig.json`

**Problema:**
TypeScript strict mode desabilitado, permitindo codigo menos seguro.

**Solucao Proposta:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

**Impacto:**
Pode revelar alguns erros de tipo que estao ocultos. Necessario revisar e corrigir.

**Estimativa:** 2-4 h (habilitar + corrigir erros)
**Prioridade FASE 2:** BAIXA

---

## Sumario de Issues

| Status | Criticos | Altos | Medios | Baixos | Total |
|--------|----------|-------|--------|--------|-------|
| Resolvidos | 2 | 1 | 1 | 0 | 4 |
| Pendentes | 0 | 0 | 3 | 3 | 6 |
| Futuros | 0 | 2 | 3 | 0 | 5 |
| **TOTAL** | **2** | **3** | **7** | **3** | **15** |

---

## Prioridade para Deploy

### Antes do Deploy em Producao (OBRIGATORIO)
1. ✅ #1 - Tailwind CSS compatibility (RESOLVIDO)
2. ✅ #2 - Styled-JSX (RESOLVIDO)
3. ⚠️ #5 - Remover console.logs
4. ⚠️ #6 - Remover Bootstrap import (opcional mas recomendado)

### Antes de Iniciar FASE 2 (RECOMENDADO)
1. #7 - Deletar Navbar duplicada
2. #8 - Adicionar URLs reais nos links sociais
3. #11 - Implementar Error Boundaries
4. #12 - Adicionar testes unitarios basicos

### Durante FASE 2 (QUANDO POSSIVEL)
1. #9 - Melhorar alt texts
2. #10 - Refatorar animation delays
3. #13 - Implementar analytics
4. #14 - Otimizar imagens
5. #15 - Habilitar TypeScript strict mode

---

## Como Usar Este Tracker

### Para Desenvolvedores
1. Escolha um issue pela prioridade
2. Leia a descricao e solucao proposta
3. Implemente a correcao
4. Teste localmente
5. Marque como resolvido neste documento
6. Commit com referencia ao issue (#N)

### Para Code Reviewers
1. Verifique issues pendentes antes de aprovar PRs
2. Adicione novos issues conforme encontrados
3. Atualize prioridades conforme necessario
4. Mantenha estimativas realistas

### Para Project Managers
1. Use este tracker para planning
2. Priorize issues antes de deploys
3. Acompanhe progresso por sprint
4. Valide que issues criticos estao resolvidos

---

## Changelog

**2025-10-12:**
- Criado tracker inicial
- Documentados 15 issues (4 resolvidos, 6 pendentes, 5 futuros)
- Definidas prioridades e estimativas
- Adicionadas solucoes propostas com exemplos de codigo

---

**Mantido por:** Code Review Agent
**Ultima Atualizacao:** 2025-10-12
**Proximo Review:** Antes do deploy em producao
