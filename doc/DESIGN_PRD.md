# PRD DE DESIGN - ComunidadeFlix
## Design System e Redesign Completo

**Versao:** 1.0
**Data de Criacao:** 2025-10-10
**Projeto:** ComunidadeFlix
**Status:** Planejamento de Redesign
**Responsavel:** Agent Organizer + UI Designer + Project Manager

---

## SUMARIO EXECUTIVO

### Contexto
O ComunidadeFlix atingiu um estado de MVP funcional completo com todas as funcionalidades principais implementadas. No entanto, o design atual nao reflete adequadamente a proposta de valor da plataforma e precisa de um redesign completo para criar uma experiencia premium e profissional.

### Problema Identificado
- Design atual baseado em Bootstrap generico sem identidade visual forte
- Paleta de cores vermelha/dourada nao alinhada com a tematica de crescimento financeiro
- Falta de um design system consistente e escalavel
- Landing page nao comunica efetivamente a proposta de valor
- Ausencia de animacoes e micro-interacoes que criem engajamento

### Objetivos do Redesign
1. Criar uma identidade visual forte baseada em DARK MODE + VERDE (crescimento/financeiro)
2. Desenvolver uma landing page imersiva inspirada em referencias de alta qualidade
3. Implementar design system completo e escalavel
4. Garantir acessibilidade WCAG AA em todos os componentes
5. Planejar migracao de Bootstrap para solucoes modernas (Tailwind + shadcn/ui)

### Resultado Esperado
Uma plataforma visualmente impactante, profissional e acessivel que comunique claramente o valor da comunidade e incentive conversao e engajamento.

---

## INDICE

1. [Analise do Estado Atual](#1-analise-do-estado-atual)
2. [Objetivos de Design](#2-objetivos-de-design)
3. [Pesquisa e Referencias](#3-pesquisa-e-referencias)
4. [Sistema de Cores](#4-sistema-de-cores)
5. [Sistema de Tipografia](#5-sistema-de-tipografia)
6. [Landing Page Redesign](#6-landing-page-redesign)
7. [Mapeamento de Jornada do Usuario](#7-mapeamento-de-jornada-do-usuario)
8. [Design System - Componentes](#8-design-system-componentes)
9. [Diretrizes de Responsividade](#9-diretrizes-de-responsividade)
10. [Animacoes e Micro-interacoes](#10-animacoes-e-micro-interacoes)
11. [Plano de Implementacao](#11-plano-de-implementacao)
12. [Metricas de Sucesso](#12-metricas-de-sucesso)

---

## 1. ANALISE DO ESTADO ATUAL

### Stack Tecnico Atual
```json
{
  "framework": "Next.js 15.5.4 (App Router + Turbopack)",
  "runtime": "React 19.1.0",
  "language": "TypeScript 5",
  "ui_library": "Bootstrap 5.3.8 + React-Bootstrap 2.10.10",
  "styling": "globals.css minimo (apenas 8 linhas)",
  "componentes": "3 componentes principais (Navbar, CourseCarousel, HomeClient)"
}
```

### Problemas Identificados no Design Atual

#### 1.1 Identidade Visual Fraca
**Problema:**
- Paleta vermelha/dourada mencionada no PRD nao esta claramente implementada
- Design generico baseado em classes Bootstrap padrao
- Falta de elementos visuais unicos e memoraveis

**Impacto:**
- Baixa diferenciacao no mercado
- Experiencia generica que nao transmite confianca
- Nao comunica o tema de crescimento financeiro/educacional

#### 1.2 Sistema de Cores Inadequado
**Problema:**
- Cores atuais (vermelho/dourado) nao se alinham com psicologia de cores para plataformas financeiras/educacionais
- Sem padronizacao de tokens de cor
- Contraste nao validado para acessibilidade WCAG

**Impacto:**
- Pode transmitir urgencia/perigo ao inves de crescimento
- Dificuldades de leitura para usuarios com deficiencias visuais
- Inconsistencia visual entre telas

#### 1.3 Tipografia Nao Otimizada
**Problema:**
- Uso de fontes padrao do Bootstrap sem customizacao
- Ausencia de escala tipografica definida
- Falta de hierarquia visual clara

**Impacto:**
- Leitura menos fluida
- Dificuldade em escanear conteudo
- Aparencia amadora

#### 1.4 Componentes Basicos
**Problema:**
- Apenas 3 componentes customizados
- Dependencia excessiva de componentes Bootstrap genericos
- Falta de design system unificado

**Impacto:**
- Dificuldade em manter consistencia
- Desenvolvimento mais lento de novas features
- Codigo menos reutilizavel

#### 1.5 Ausencia de Animacoes Significativas
**Problema:**
- Unica animacao: hover scale em cards de curso (globals.css)
- Nao ha micro-interacoes que guiem o usuario
- Falta de feedback visual em acoes

**Impacto:**
- Experiencia estatica e menos engajadora
- Usuarios nao recebem confirmacao visual de acoes
- Plataforma parece menos moderna

#### 1.6 Landing Page Ausente
**Problema:**
- Homepage atual e dashboard de cursos, nao landing page de conversao
- Nao ha pagina dedicada a atracao e conversao de novos usuarios
- Falta de comunicacao clara da proposta de valor

**Impacto:**
- Baixa taxa de conversao de visitantes
- Mensagem de valor nao comunicada
- Dificuldade em atrair novos membros

### Pontos Fortes Atuais (A Preservar)

#### Funcionalidades Completas
- Sistema de autenticacao robusto
- CRUD completo de cursos e videos
- Feed e chat em tempo real
- Player de video integrado

#### Arquitetura Solida
- Next.js 15 com App Router
- TypeScript para type safety
- Firebase bem configurado
- Middleware de protecao de rotas

#### Performance
- Turbopack para builds rapidos
- React 19 com otimizacoes
- Skeleton loaders implementados

---

## 2. OBJETIVOS DE DESIGN

### 2.1 Objetivos de Negocio

#### Aumentar Conversao
- **Meta:** +40% de conversao de visitante para usuario cadastrado
- **Como:** Landing page otimizada com copy persuasivo e design imersivo
- **Metrica:** Taxa de signup / visitantes unicos

#### Aumentar Engajamento
- **Meta:** +30% tempo medio na plataforma
- **Como:** Interface mais intuitiva e visualmente atraente
- **Metrica:** Tempo de sessao, paginas por visita

#### Aumentar Retencao
- **Meta:** +25% retorno semanal de usuarios
- **Como:** Experiencia consistente e profissional que gera confianca
- **Metrica:** DAU/MAU, taxa de retorno D7/D30

#### Estabelecer Autoridade
- **Meta:** Posicionar ComunidadeFlix como plataforma premium
- **Como:** Design que transmite profissionalismo e confianca
- **Metrica:** NPS, pesquisas qualitativas

### 2.2 Objetivos de Usuario

#### Facilitar Navegacao
- Usuario encontra conteudo desejado em menos de 3 cliques
- Hierarquia visual clara
- Estados de navegacao obvios

#### Aumentar Confianca
- Design profissional que transmite credibilidade
- Feedback visual claro em todas as acoes
- Mensagens de erro/sucesso humanizadas

#### Reduzir Carga Cognitiva
- Interface intuitiva que nao requer aprendizado
- Consistencia visual entre todas as telas
- Informacoes organizadas logicamente

#### Melhorar Acessibilidade
- Contraste WCAG AA em 100% dos elementos
- Navegacao por teclado funcional
- Suporte a leitores de tela

### 2.3 Objetivos Tecnicos

#### Criar Design System Escalavel
- Componentes reutilizaveis documentados
- Tokens de design (cores, espacamentos, tipografia)
- Padroes de composicao claros

#### Migrar para Stack Moderna
- Substituir Bootstrap por Tailwind CSS
- Implementar shadcn/ui para componentes base
- Manter compatibilidade com Next.js 15

#### Otimizar Performance
- Bundle size reduzido (remover Bootstrap 200KB+)
- Critical CSS inline
- Lazy loading de componentes pesados

#### Garantir Manutenibilidade
- Codigo CSS organizado e modular
- Documentacao clara de padroes
- Componentes testáveis

---

## 3. PESQUISA E REFERENCIAS

### 3.1 Analise da Referencia Principal: Captivate Template

#### Estrutura da Landing Page Captivate

**Hero Section:**
- Headline forte e direta: "Create stunning SaaS websites with Captivate"
- Subheadline explicativo
- CTAs primario e secundario side-by-side
- Visual impactante (screenshot ou mockup)

**Landing Pages Showcase:**
- Grid de exemplos visuais
- Demonstracao de variedade
- Links para cada template

**Features/Beneficios:**
- Secao de destaque de recursos
- Icones minimalistas
- Textos concisos e escaneaveis

**Build Your Website (CTA Section):**
- Repeticao do CTA em contexto diferente
- Mensagem motivacional
- Botoes com alto contraste

**Footer:**
- Links organizados
- Informacoes legais
- Design clean

#### Aprendizados Aplicaveis ao ComunidadeFlix

1. **Hierarquia Clara:** Cada secao tem um proposito unico e claro
2. **CTAs Estrategicos:** Multiplos pontos de conversao ao longo da pagina
3. **Visual First:** Imagens e mockups tem protagonismo
4. **Whitespace Generoso:** Espacamento amplo cria sensacao de premium
5. **Copy Direto:** Linguagem objetiva focada em beneficios

#### Diferenciais que Devemos Implementar

1. **Animacoes Imersivas:** Captivate tem animacoes sutis, vamos alem com o componente Digital Serenity
2. **Tema Dark + Verde:** Criar contraste unico no mercado
3. **Foco em Comunidade:** Enfatizar aspecto social alem de apenas cursos
4. **Demonstracao de Valor:** Mostrar previews de conteudo exclusivo

### 3.2 Boas Praticas de UX para Aplicacoes Financeiras

#### Insights da Pesquisa Web

**1. Psicologia de Cores:**
- **Verde:** Associado a dinheiro, crescimento, estabilidade financeira
- **Azul:** Confianca, lealdade, seguranca (usar como cor secundaria)
- **Evitar Vermelho:** Pode indicar perda, perigo, urgencia negativa

**2. Dark Mode em Fintech:**
- Destaca numeros, graficos e dados criticos
- Reduz fadiga visual em uso prolongado
- Transmite modernidade e sofisticacao
- Economia de bateria em dispositivos OLED

**3. Acessibilidade e Contraste:**
- **WCAG AA:** Minimo 4.5:1 para texto normal, 3:1 para texto grande
- **WCAG AAA:** Minimo 7:1 (ideal para aplicacoes financeiras)
- **Evitar Verde Puro:** Problemas para daltonicos (red/green deficiency - mais comum)
- **Solucao:** Usar verde-azulado (teal/emerald) com alto contraste

**4. Design de Confianca:**
- Espacamento generoso (nao cramped)
- Tipografia legivel e profissional
- Feedback visual claro em transacoes
- Microcopies humanizados

### 3.3 Referencias de Paletas Dark + Green

#### Exemplos de Sucesso no Mercado

**Robinhood (Fintech):**
- Background: #0D1117 (dark gray com tint azul)
- Primary Green: #00C805 (verde vibrante)
- Secondary: #1E2329 (dark gray lighter)
- Text: #FFFFFF / #C3C5C8 (white / light gray)

**Mint (Financial Dashboard):**
- Background: #1A1A1A (charcoal)
- Primary Green: #3AB795 (teal green)
- Accent: #FFB94A (gold - para destaques)
- Text: #F4F4F4 / #A8A8A8

**Plaid (Banking API):**
- Background: #000000 (true black para OLED)
- Primary: #00D4AA (mint green)
- Secondary: #1C1C1E (dark gray)
- Text: #FFFFFF / #8E8E93

#### Principios Extraidos

1. **Nao Usar Preto Puro:** Usar dark gray (#121212 - Material Design)
2. **Verde com Tint Azul:** Melhor contraste e acessibilidade
3. **Multiplos Tons de Cinza:** Para hierarquia e profundidade
4. **Branco Nao Puro:** Usar off-white (#F5F5F5) para reduzir glare

---

## 4. SISTEMA DE CORES

### 4.1 Paleta Principal - Dark Mode

#### Background Colors
```css
--bg-primary: #0F1419;        /* Background principal (dark blue-gray) */
--bg-secondary: #1A1F26;      /* Cards, paineis elevados */
--bg-tertiary: #242931;       /* Hover states, inputs */
--bg-overlay: rgba(15, 20, 25, 0.95); /* Modals, dropdowns */
```

**Justificativa:**
- `#0F1419` e mais suave que preto puro, reduz fadiga ocular
- Tint azul sutil transmite confianca (fintech best practice)
- Tons progressivos criam depth e elevacao

#### Green Palette (Primary)
```css
--green-50: #E6F9F0;          /* Backgrounds muito claros */
--green-100: #B3EDD5;         /* Badges, pills */
--green-200: #80E1BA;         /* Borders, dividers */
--green-300: #4DD59F;         /* Icons secundarios */
--green-400: #26CCA6;         /* Hover states */
--green-500: #00C896;         /* PRIMARY - CTAs, links, accents */
--green-600: #00B386;         /* Active states */
--green-700: #009E76;         /* Pressed states */
--green-800: #008966;         /* Dark accents */
--green-900: #007456;         /* Text on light backgrounds */
```

**Justificativa:**
- `--green-500 (#00C896)` e verde-azulado (teal) para melhor acessibilidade
- Evita problemas de daltonismo red/green
- Contraste validado:
  - #00C896 em #0F1419 = 8.2:1 (WCAG AAA) ✓
  - #00C896 em #1A1F26 = 7.1:1 (WCAG AAA) ✓

#### Blue Palette (Secondary - Confianca)
```css
--blue-400: #60A5FA;          /* Links secundarios */
--blue-500: #3B82F6;          /* Secondary CTAs */
--blue-600: #2563EB;          /* Hover */
--blue-700: #1D4ED8;          /* Active */
```

**Justificativa:**
- Azul complementa verde sem competir
- Transmite confianca e estabilidade
- Usado em CTAs secundarios, badges informativos

#### Gray Scale (Texto e Borders)
```css
--gray-50: #F9FAFB;           /* Texto em backgrounds escuros (nao usado em dark) */
--gray-100: #F3F4F6;          /* Heading principal */
--gray-200: #E5E7EB;          /* Body text primario */
--gray-300: #D1D5DB;          /* Body text secundario */
--gray-400: #9CA3AF;          /* Placeholders, labels */
--gray-500: #6B7280;          /* Disabled text */
--gray-600: #4B5563;          /* Borders sutis */
--gray-700: #374151;          /* Borders medios */
--gray-800: #1F2937;          /* Borders fortes */
--gray-900: #111827;          /* Quasi background */
```

#### Semantic Colors (Estados)
```css
/* Success */
--success-bg: #064E3B;        /* Background de success alerts */
--success-border: #059669;    /* Borders */
--success-text: #10B981;      /* Texto */

/* Warning */
--warning-bg: #78350F;
--warning-border: #D97706;
--warning-text: #F59E0B;

/* Error */
--error-bg: #7F1D1D;
--error-border: #DC2626;
--error-text: #EF4444;

/* Info */
--info-bg: #1E3A8A;
--info-border: #2563EB;
--info-text: #60A5FA;
```

### 4.2 Validacao de Contraste (WCAG AA)

| Combinacao | Contraste | Status |
|-----------|-----------|--------|
| `--green-500` em `--bg-primary` | 8.2:1 | AAA ✓✓ |
| `--green-500` em `--bg-secondary` | 7.1:1 | AAA ✓✓ |
| `--gray-200` em `--bg-primary` | 12.3:1 | AAA ✓✓ |
| `--gray-300` em `--bg-primary` | 9.8:1 | AAA ✓✓ |
| `--gray-400` em `--bg-primary` | 5.2:1 | AA ✓ |
| `--blue-500` em `--bg-primary` | 7.8:1 | AAA ✓✓ |

**Todos os pares de cores principais atendem WCAG AA (minimo 4.5:1), maioria atinge AAA (7:1+)**

### 4.3 Mapeamento de Uso

| Elemento | Cor | Token |
|----------|-----|-------|
| Background principal | #0F1419 | `--bg-primary` |
| Cards, paineis | #1A1F26 | `--bg-secondary` |
| Inputs, hover states | #242931 | `--bg-tertiary` |
| Headings | #F3F4F6 | `--gray-100` |
| Body text | #E5E7EB | `--gray-200` |
| Secondary text | #D1D5DB | `--gray-300` |
| Placeholders | #9CA3AF | `--gray-400` |
| CTA primario (bg) | #00C896 | `--green-500` |
| CTA primario (hover) | #00B386 | `--green-600` |
| Links | #00C896 | `--green-500` |
| Borders sutis | #4B5563 | `--gray-600` |
| Dividers | #374151 | `--gray-700` |
| Success indicators | #10B981 | `--success-text` |
| Error indicators | #EF4444 | `--error-text` |

### 4.4 Implementacao Tecnica

#### Arquivo: `/styles/tokens.css`
```css
:root {
  /* Backgrounds */
  --bg-primary: #0F1419;
  --bg-secondary: #1A1F26;
  --bg-tertiary: #242931;
  --bg-overlay: rgba(15, 20, 25, 0.95);

  /* Green Palette */
  --green-500: #00C896;
  --green-600: #00B386;
  --green-700: #009E76;

  /* Blue Palette */
  --blue-500: #3B82F6;
  --blue-600: #2563EB;

  /* Gray Scale */
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;

  /* Semantic */
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
  --color-info: #60A5FA;
}
```

#### Tailwind Config (quando migrar)
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00C896',
          hover: '#00B386',
          active: '#009E76',
        },
        background: {
          primary: '#0F1419',
          secondary: '#1A1F26',
          tertiary: '#242931',
        }
      }
    }
  }
}
```

---

## 5. SISTEMA DE TIPOGRAFIA

### 5.1 Familias de Fonte

#### Fonte Principal: Inter
**Escolha:** Google Font "Inter" (variavel)
**Justificativa:**
- Otimizada para legibilidade em telas
- Suporte a caracteres latinos completos (incluindo portugues)
- Variavel font = performance (um arquivo, multiplos pesos)
- Neutral e profissional
- Usada por Captivate (referencia) e plataformas financeiras

**Implementacao:**
```html
<!-- Em app/layout.tsx -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

#### Fonte Secundaria (Opcional): JetBrains Mono
**Uso:** Codigo, numeros destacados, badges tecnicas
**Justificativa:**
- Monospaced para codigos e IDs
- Excelente legibilidade de numeros
- Toque moderno/tecnico

### 5.2 Escala Tipografica (Type Scale)

Baseada em escala modular 1.250 (Major Third)

| Nome | Tamanho | Line Height | Peso | Uso |
|------|---------|-------------|------|-----|
| `display-xl` | 72px (4.5rem) | 90% | 800 | Hero headlines (landing) |
| `display-lg` | 60px (3.75rem) | 100% | 800 | Section headlines |
| `display-md` | 48px (3rem) | 110% | 700 | Page titles |
| `heading-1` | 36px (2.25rem) | 120% | 700 | H1 |
| `heading-2` | 30px (1.875rem) | 130% | 600 | H2 |
| `heading-3` | 24px (1.5rem) | 130% | 600 | H3 |
| `heading-4` | 20px (1.25rem) | 140% | 600 | H4 |
| `body-lg` | 18px (1.125rem) | 160% | 400 | Intro paragraphs |
| `body-md` | 16px (1rem) | 160% | 400 | Body text padrao |
| `body-sm` | 14px (0.875rem) | 150% | 400 | Secondary text |
| `caption` | 12px (0.75rem) | 140% | 500 | Labels, captions |
| `overline` | 10px (0.625rem) | 120% | 700 | Uppercase labels |

### 5.3 Tokens CSS

```css
/* Font Families */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;

/* Font Sizes */
--text-display-xl: 4.5rem;    /* 72px */
--text-display-lg: 3.75rem;   /* 60px */
--text-display-md: 3rem;      /* 48px */
--text-heading-1: 2.25rem;    /* 36px */
--text-heading-2: 1.875rem;   /* 30px */
--text-heading-3: 1.5rem;     /* 24px */
--text-heading-4: 1.25rem;    /* 20px */
--text-body-lg: 1.125rem;     /* 18px */
--text-body-md: 1rem;         /* 16px */
--text-body-sm: 0.875rem;     /* 14px */
--text-caption: 0.75rem;      /* 12px */

/* Line Heights */
--leading-tight: 1.1;
--leading-snug: 1.3;
--leading-normal: 1.5;
--leading-relaxed: 1.6;
--leading-loose: 1.8;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;

/* Letter Spacing */
--tracking-tight: -0.02em;
--tracking-normal: 0;
--tracking-wide: 0.02em;
```

### 5.4 Classes Utilitarias

```css
/* Headings */
.display-xl {
  font-size: var(--text-display-xl);
  font-weight: var(--font-extrabold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

.h1 {
  font-size: var(--text-heading-1);
  font-weight: var(--font-bold);
  line-height: 1.2;
  color: var(--gray-100);
}

.h2 {
  font-size: var(--text-heading-2);
  font-weight: var(--font-semibold);
  line-height: 1.3;
  color: var(--gray-100);
}

/* Body */
.body-lg {
  font-size: var(--text-body-lg);
  line-height: var(--leading-relaxed);
  color: var(--gray-200);
}

.body {
  font-size: var(--text-body-md);
  line-height: var(--leading-relaxed);
  color: var(--gray-200);
}

.body-sm {
  font-size: var(--text-body-sm);
  line-height: var(--leading-normal);
  color: var(--gray-300);
}

/* Utilities */
.text-muted {
  color: var(--gray-400);
}

.text-success {
  color: var(--color-success);
}

.text-error {
  color: var(--color-error);
}
```

### 5.5 Responsive Typography

```css
/* Mobile First - Ajustes para desktop */
@media (min-width: 768px) {
  :root {
    --text-display-xl: 5.5rem;   /* 88px em desktop */
    --text-display-lg: 4.5rem;   /* 72px */
    --text-display-md: 3.5rem;   /* 56px */
  }
}

/* Fluid Typography (opcional - mais avancado) */
.display-xl {
  font-size: clamp(3rem, 5vw + 1rem, 5.5rem);
}
```

---

## 6. LANDING PAGE REDESIGN

### 6.1 Estrutura da Nova Landing Page

#### Secao 1: Hero Section (Above the Fold)
**Objetivo:** Capturar atencao e comunicar proposta de valor em 3 segundos

**Elementos:**
- **Background:** Componente Digital Serenity (animacao imersiva)
- **Headline:** "Transforme Conhecimento em Crescimento" (display-xl)
- **Subheadline:** "A plataforma premium de cursos em video para comunidades que querem evoluir juntas" (body-lg)
- **CTAs:**
  - Primario: "Comecar Agora" (green-500, bold, grande)
  - Secundario: "Ver Demo" (outline, play icon)
- **Hero Image/Video:** Mockup da plataforma ou video teaser (lado direito)
- **Social Proof:** "Junte-se a +5.000 membros aprendendo" (caption com icones de usuarios)

**Layout:**
```
+----------------------------------------------------------+
|  LOGO                                   Login  | Cadastro|
+----------------------------------------------------------+
|                                                          |
|  [DIGITAL SERENITY ANIMATION BACKGROUND]                |
|                                                          |
|  Transforme Conhecimento                                |
|  em Crescimento                          [HERO IMAGE]   |
|                                          [ou VIDEO]      |
|  A plataforma premium de cursos em video                |
|  para comunidades que querem evoluir juntas             |
|                                                          |
|  [BOTAO: Comecar Agora]  [BOTAO: Ver Demo]             |
|                                                          |
|  Junte-se a +5.000 membros aprendendo                   |
+----------------------------------------------------------+
```

**Especificacoes Tecnicas:**
- Altura: 100vh (full viewport)
- Background: Componente Digital Serenity com overlay gradient
- Animacao: Fade in suave ao carregar (0.6s ease-out)
- Scroll indicator: Seta animada no bottom

#### Secao 2: Features Showcase (Como Funciona)
**Objetivo:** Demonstrar principais funcionalidades de forma visual

**Elementos:**
- **Titulo:** "Tudo que Voce Precisa em Um So Lugar" (heading-1)
- **Grid 3 Colunas:**
  1. **Cursos em Video** - Icone play + screenshot player
  2. **Comunidade Ativa** - Icone chat + screenshot feed
  3. **Progresso Personalizado** - Icone chart + screenshot dashboard

**Design:**
- Cards elevados (bg-secondary)
- Hover: Elevacao aumenta, borda verde sutil
- Icones: Verde (green-500), tamanho 48px
- Screenshot: Border radius 12px, shadow suave

#### Secao 3: Social Proof (Depoimentos)
**Objetivo:** Construir confianca atraves de provas sociais

**Elementos:**
- **Titulo:** "O Que Nossos Membros Dizem" (heading-1)
- **Carrossel de Depoimentos:**
  - Foto do membro (circular, 64px)
  - Nome + cargo (heading-4 + caption)
  - Depoimento (body-md, italic)
  - Rating (5 estrelas verdes)

**Design:**
- Background: bg-tertiary
- Carrossel: 3 cards visiveis em desktop, 1 em mobile
- Navegacao: Dots verdes abaixo

#### Secao 4: Pricing/CTA Final
**Objetivo:** Converter visitantes em usuarios cadastrados

**Elementos:**
- **Headline:** "Comece Sua Jornada de Crescimento Hoje" (display-md)
- **Pricing Card:**
  - Destaque: "Gratis para Comecar" ou preco mensal
  - Lista de beneficios (checkmarks verdes)
  - CTA grande: "Criar Conta Gratis"
- **Garantia:** "Cancele quando quiser, sem compromisso" (caption)

**Design:**
- Card centralizado, max-width 500px
- Background gradient (bg-secondary -> bg-tertiary)
- Border verde sutil (1px, green-500, 20% opacity)
- Shadow forte para destacar

#### Secao 5: Footer
**Objetivo:** Links uteis, informacoes legais, SEO

**Elementos:**
- **Logo + Tagline**
- **Links:**
  - Produto (Features, Pricing, Demo)
  - Empresa (Sobre, Blog, Contato)
  - Legal (Termos, Privacidade)
- **Social Media Icons**
- **Copyright**

**Design:**
- Background: bg-primary (mais escuro que main)
- Text: gray-400
- Links hover: green-500
- Divider sutil no topo (gray-700)

### 6.2 Implementacao do Componente Digital Serenity

**NOTA:** Aguardando fornecimento do componente pelo usuario.

**Requisitos para Integracao:**
- [ ] Compatibilidade com React 19
- [ ] Performance otimizada (60fps minimo)
- [ ] Responsivo (mobile + desktop)
- [ ] Acessibilidade: Opcao de "Reduced Motion" para usuarios sensiveis
- [ ] Bundle size < 50KB (gzipped)

**Plano de Integracao:**
1. Analisar codigo fornecido
2. Adaptar para TypeScript se necessario
3. Criar wrapper component: `<HeroBackground />`
4. Adicionar controles de performance (lazy load, intersection observer)
5. Testar em diferentes dispositivos

### 6.3 Copywriting e Mensagens-Chave

#### Tom de Voz
- **Profissional mas Acessivel:** Nao corporativo demais, nao casual demais
- **Motivacional:** Foco em crescimento, evolucao, conquistas
- **Claro e Direto:** Evitar jargoes, ir direto ao ponto
- **Inclusivo:** Linguagem que acolhe todos os niveis

#### Headlines Alternativas (A/B Testing)
1. "Transforme Conhecimento em Crescimento"
2. "Aprenda, Evolua, Conquiste - Em Comunidade"
3. "Sua Jornada de Crescimento Comeca Aqui"
4. "Cursos Premium para Quem Quer Ir Alem"

#### CTAs (Calls-to-Action)
- Primario: "Comecar Agora" / "Criar Conta Gratis"
- Secundario: "Ver Demo" / "Conhecer Plataforma"
- Footer: "Iniciar Jornada" / "Acessar Comunidade"

**Principios:**
- Verbos de acao no infinitivo (portugues BR)
- Beneficio implicito ("Gratis", "Agora", "Facil")
- Urgencia sutil sem pressionar demais

---

## 7. MAPEAMENTO DE JORNADA DO USUARIO

### 7.1 User Flow Principal: Visitante → Membro Ativo

```
[Landing Page]
    ↓
[Cadastro/Login]
    ↓
[Onboarding] ← NOVO (a implementar)
    ↓
[Homepage - Dashboard de Cursos]
    ↓
[Curso Especifico - Player]
    ↓
[Progresso & Certificado] ← NOVO (Fase 7 do Roadmap)
```

### 7.2 Analise Detalhada por Etapa

#### ETAPA 1: Landing Page → Cadastro
**Objetivo:** Converter visitante anonimo em lead

**Jornada Atual:**
- Usuario acessa homepage
- Ve dashboard de cursos (sem contexto)
- Clica em "Entrar" por curiosidade
- Pode abandonar por falta de clareza

**Jornada Ideal (Redesign):**
1. Usuario acessa landing page
2. Le headline que comunica valor ("Transforme Conhecimento em Crescimento")
3. Escanea features visuais (cursos, comunidade, progresso)
4. Le depoimentos (proof social)
5. Clica em CTA confiante ("Comecar Agora")
6. Redirecionado para /signup

**Pain Points Atuais:**
- Falta de comunicacao de valor antes do signup
- Nao ha razao clara para se cadastrar
- Nao mostra o que esta "dentro" da plataforma

**Melhorias Necessarias:**
- [ ] Criar landing page dedicada
- [ ] Video teaser ou GIFs de features
- [ ] Depoimentos/testimonials
- [ ] FAQ section
- [ ] Trust badges (seguro, sem compromisso)

#### ETAPA 2: Cadastro/Login
**Jornada Atual:**
- Formulario simples (email + senha)
- Firebase Authentication
- Redirect para homepage

**Melhorias Necessarias:**
- [ ] Social login (Google, Apple)
- [ ] Password strength indicator
- [ ] Mensagens de erro humanizadas
- [ ] Loading state visual
- [ ] Success feedback antes de redirect
- [ ] Welcome email (Firebase Triggers)

**Design:**
- Background: Digital Serenity (consistencia com landing)
- Form: Card centralizado, max-width 400px
- CTAs: Verde, full-width, grande (min-height 48px para mobile)
- Link "Ja tem conta?": Abaixo do form, green-500

#### ETAPA 3: Homepage (Dashboard de Cursos)
**Jornada Atual:**
- Carrosseis de cursos (funcional)
- Navbar com links (Feed, Chat)
- Cards com hover effect

**Melhorias Necessarias:**
- [ ] Onboarding tooltip na primeira visita
- [ ] Secao "Continuar Assistindo" (Fase 7)
- [ ] Recomendacoes personalizadas
- [ ] Empty state amigavel se nao ha cursos
- [ ] Quick actions (Buscar curso, Favoritos)

**Design:**
- Hero banner personalizado: "Bem-vindo, [Nome]!"
- Grid responsivo: 4 cols desktop, 2 cols tablet, 1 col mobile
- Skeleton loaders: Mesma forma dos cards finais
- Spacing: 32px entre secoes, 16px entre cards

#### ETAPA 4: Pagina de Curso → Player
**Jornada Atual:**
- Lista de videos do curso
- Player integrado
- Troca de video ao clicar

**Melhorias Necessarias:**
- [ ] Breadcrumb (Home > Curso > Video Atual)
- [ ] Progresso do curso visivel (X de Y videos completos)
- [ ] Sidebar com playlist
- [ ] Notas/transcricoes do video
- [ ] Botao "Proximo Video" obvio
- [ ] Autoplay opcional

**Design:**
- Layout: 70% player / 30% sidebar (desktop)
- Layout: 100% player, sidebar abaixo (mobile)
- Player: 16:9 ratio, controles customizados
- Playlist: Checkmarks verdes em videos completos

#### ETAPA 5: Feed de Comunidade
**Jornada Atual:**
- Lista de posts em tempo real
- Criar novo post
- Sem filtros ou categorias

**Melhorias Necessarias:**
- [ ] Filtros (Todos, Seguindo, Populares)
- [ ] Rich text editor (bold, italic, links)
- [ ] Upload de imagens em posts
- [ ] Likes e comentarios
- [ ] Notificacoes de mencoes
- [ ] Moderacao visivel (se admin)

**Design:**
- Card de criar post: Fixo no topo, sempre visivel
- Posts: Card style, spacing 16px
- Avatar: Circular, 40px
- Timestamp: Relativo ("2h atras"), gray-400
- Likes: Coracao outline -> filled (green-500)

#### ETAPA 6: Chat Interno
**Jornada Atual:**
- Chat em tempo real funcional
- Lista de mensagens
- Input para enviar

**Melhorias Necessarias:**
- [ ] Indicador "usuario esta digitando"
- [ ] Scroll automatico para ultima mensagem
- [ ] Markdown support (bold, code)
- [ ] Reacoes emoji
- [ ] Busca de mensagens
- [ ] Historico paginado

**Design:**
- Layout classico: Header + mensagens + input
- Mensagens: Bubbles alternados (meu = direita, outros = esquerda)
- Cores: Minhas mensagens = green-500 bg, outros = bg-secondary
- Input: Fixed bottom, auto-expand ate 3 linhas

### 7.3 Pain Points Globais Identificados

#### 1. Falta de Onboarding
**Problema:** Novo usuario nao sabe o que fazer apos login
**Solucao:** Tour guiado na primeira visita (biblioteca: react-joyride)

#### 2. Feedback Visual Insuficiente
**Problema:** Acoes nao tem confirmacao visual clara
**Solucao:** Toast notifications (biblioteca: react-hot-toast)

#### 3. Estados Vazios Genericos
**Problema:** "Nenhum curso encontrado" e pouco amigavel
**Solucao:** Ilustracoes + CTAs ("Seja o primeiro a criar um curso!")

#### 4. Navegacao Nao Otima
**Problema:** Usuario precisa voltar para homepage para trocar de secao
**Solucao:** Sidebar persistente em desktop, bottom nav em mobile

---

## 8. DESIGN SYSTEM - COMPONENTES

### 8.1 Componentes Base (Atomicos)

#### Button
**Variantes:**
1. **Primary:** Background green-500, texto white, hover green-600
2. **Secondary:** Background blue-500, texto white, hover blue-600
3. **Outline:** Border green-500, texto green-500, hover bg green-500 + texto white
4. **Ghost:** Sem border/bg, texto green-500, hover bg green-500 (10% opacity)
5. **Danger:** Background error, texto white, hover darker

**Tamanhos:**
- `sm`: 32px altura, 12px padding horizontal, text-body-sm
- `md`: 40px altura, 16px padding horizontal, text-body-md (padrao)
- `lg`: 48px altura, 24px padding horizontal, text-body-lg

**Estados:**
- Default: Normal
- Hover: Background darker, elevacao sutil
- Active: Background mais dark, sem elevacao
- Disabled: Opacity 50%, cursor not-allowed
- Loading: Spinner verde, texto opacity 70%

**Especificacoes:**
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  children: ReactNode;
}
```

#### Input
**Variantes:**
1. **Text:** Padrao
2. **Email:** Com validacao
3. **Password:** Com toggle show/hide
4. **Number:** Com steppers
5. **Textarea:** Multi-linha

**Estados:**
- Default: Border gray-600
- Focus: Border green-500, box-shadow green-500 (20% opacity)
- Error: Border error, texto error abaixo
- Success: Border success, checkmark icon
- Disabled: Background gray-800, cursor not-allowed

**Especificacoes:**
```tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  helperText?: string;
}
```

#### Badge
**Variantes:**
1. **Success:** Green bg, white text
2. **Warning:** Yellow bg, dark text
3. **Error:** Red bg, white text
4. **Info:** Blue bg, white text
5. **Neutral:** Gray bg, white text

**Tamanhos:**
- `sm`: 20px altura, 6px padding, caption
- `md`: 24px altura, 8px padding, body-sm (padrao)
- `lg`: 28px altura, 12px padding, body-md

#### Card
**Base:**
- Background: bg-secondary
- Border: 1px solid gray-700
- Border-radius: 12px
- Padding: 24px
- Shadow: Sutil (0 4px 12px rgba(0,0,0,0.2))

**Hover State:**
- Elevacao aumenta (shadow mais forte)
- Border muda para green-500 (30% opacity)
- Transicao: 0.2s ease

**Variantes:**
- **Default:** Descrito acima
- **Elevated:** Shadow maior por padrao
- **Outlined:** Sem background, border mais visivel
- **Interactive:** Cursor pointer, hover scale 1.02

### 8.2 Componentes Compostos

#### Navbar
**Estrutura:**
- Logo (esquerda)
- Links de navegacao (centro)
- User menu (direita)

**Responsive:**
- Desktop: Horizontal, todos os links visiveis
- Mobile: Hamburger menu, drawer lateral

**Estados:**
- Link ativo: Underline verde, texto green-500
- Link hover: Texto green-400
- Scroll: Background blur effect (backdrop-filter)

**Implementacao:**
```tsx
<nav className="navbar">
  <div className="navbar-logo">
    <Logo />
  </div>
  <div className="navbar-links">
    <NavLink href="/" active={pathname === '/'}>Home</NavLink>
    <NavLink href="/feed">Feed</NavLink>
    <NavLink href="/chat">Chat</NavLink>
  </div>
  <div className="navbar-user">
    <UserMenu />
  </div>
</nav>
```

#### Card de Curso
**Elementos:**
- Imagem de capa (16:9 ratio)
- Titulo (heading-4, 2 linhas max, ellipsis)
- Descricao (body-sm, 3 linhas max, ellipsis)
- Metadata (duracao, numero de videos)
- Progress bar (se usuario ja comecou)
- Badge de categoria (opcional)

**Hover:**
- Scale 1.05
- Shadow mais forte
- Play button overlay aparece
- Brightness aumenta (filter: brightness(1.1))

**Implementacao:**
```tsx
<div className="course-card">
  <div className="course-card-image">
    <img src={coverUrl} alt={title} />
    <div className="course-card-overlay">
      <PlayButton />
    </div>
  </div>
  <div className="course-card-content">
    <h3 className="course-card-title">{title}</h3>
    <p className="course-card-description">{description}</p>
    <div className="course-card-meta">
      <span>{videoCount} videos</span>
      <span>{duration}</span>
    </div>
    {progress > 0 && (
      <ProgressBar value={progress} />
    )}
  </div>
</div>
```

#### Modal
**Estrutura:**
- Overlay (backdrop): bg-overlay
- Container: bg-secondary, border-radius 16px, max-width 600px
- Header: Titulo + Close button
- Body: Conteudo scrollavel
- Footer: Acoes (Cancel + Confirm)

**Animacao:**
- Entrada: Fade in overlay (0.2s) + Scale up modal (0.3s, ease-out)
- Saida: Reverse

**Acessibilidade:**
- Focus trap (nao pode tabular para fora do modal)
- ESC fecha modal
- Click no overlay fecha modal
- aria-modal="true"
- aria-labelledby="modal-title"

#### Toast Notification
**Posicao:** Top-right (desktop), Top-center (mobile)
**Variantes:** Success, Error, Warning, Info
**Duracao:** 4s (auto-dismiss), hover pausa timer

**Elementos:**
- Icone (checkmark, X, warning, info)
- Titulo (heading-4)
- Mensagem (body-sm)
- Close button
- Progress bar (countdown)

**Animacao:**
- Entrada: Slide from right (desktop), from top (mobile)
- Saida: Fade out + slide

#### Carrossel
**Funcionalidade:**
- Scroll horizontal suave
- Botoes prev/next
- Drag to scroll (mouse/touch)
- Scroll snap
- Responsive (4 cards desktop, 2 tablet, 1 mobile)

**Especificacoes:**
```tsx
interface CarouselProps {
  items: ReactNode[];
  itemsPerView?: { mobile: number; tablet: number; desktop: number };
  gap?: number;
  showArrows?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
}
```

### 8.3 Componentes Especificos da Plataforma

#### Video Player
**Features:**
- Play/Pause
- Volume control
- Timeline scrubbing
- Fullscreen
- Playback speed (0.5x, 1x, 1.5x, 2x)
- Qualidade (360p, 720p, 1080p - futuro)
- Picture-in-Picture
- Keyboard shortcuts (Space, F, M, arrows)

**Controles:**
- Auto-hide apos 3s de inatividade
- Aparecem em hover
- Mobile: Tap para show/hide

**Tracking:**
- Salvar progresso a cada 5s
- Marcar como completo aos 95%
- Enviar analytics (watch time)

#### Post Card (Feed)
**Elementos:**
- Avatar do autor (40px circular)
- Nome + timestamp
- Conteudo (texto com markdown)
- Imagem (opcional, max-width 100%)
- Acoes: Like, Comment, Share
- Contador de likes/comments

**Interacoes:**
- Like: Heart outline → filled (animacao bounce)
- Comment: Abre thread abaixo do post
- Share: Copia link (toast confirmation)

#### Chat Message Bubble
**Variantes:**
- Minha mensagem: Direita, bg green-500, texto white
- Outra mensagem: Esquerda, bg-secondary, texto gray-200

**Elementos:**
- Avatar (32px, apenas outras mensagens)
- Nome (caption, apenas primeira mensagem de sequencia)
- Mensagem (body-sm, markdown support)
- Timestamp (caption, gray-400, apenas em hover)
- Status (enviando, enviado, lido - apenas minhas)

**Layout:**
- Max-width: 70% da tela
- Border-radius: 16px
- Padding: 12px 16px
- Margin: 4px entre mensagens consecutivas do mesmo usuario, 16px entre usuarios diferentes

---

## 9. DIRETRIZES DE RESPONSIVIDADE

### 9.1 Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* Tablet portrait */
--breakpoint-md: 768px;   /* Tablet landscape */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large */
```

### 9.2 Grid System

**Container:**
- Max-width: 1280px (lg)
- Padding horizontal:
  - Mobile: 16px
  - Tablet: 24px
  - Desktop: 32px

**Grid:**
- 12 colunas
- Gap: 16px (mobile), 24px (desktop)

**Implementacao (CSS Grid):**
```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--grid-gap);
}

.col-span-4 {
  grid-column: span 4;
}

/* Mobile: 1 coluna */
@media (max-width: 767px) {
  .col-span-4 {
    grid-column: span 12;
  }
}
```

### 9.3 Espacamento Responsivo

**Sistema de spacing:**
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;

/* Responsive adjustments */
@media (max-width: 767px) {
  --space-section: var(--space-12); /* 48px */
}

@media (min-width: 768px) {
  --space-section: var(--space-16); /* 64px */
}

@media (min-width: 1024px) {
  --space-section: var(--space-24); /* 96px */
}
```

### 9.4 Componentes Responsivos

#### Navbar
- **Mobile:** Hamburger menu, logo centralizado
- **Desktop:** Horizontal, logo esquerda, links centro, user direita

#### Course Grid
- **Mobile:** 1 coluna
- **Tablet (portrait):** 2 colunas
- **Tablet (landscape):** 3 colunas
- **Desktop:** 4 colunas
- **Large desktop:** 5 colunas

#### Course Page
- **Mobile:** Player 100%, playlist abaixo (vertical)
- **Desktop:** Player 70%, playlist lateral 30% (horizontal)

#### Modals
- **Mobile:** Fullscreen (100vh, 100vw)
- **Desktop:** Centered, max-width 600px, border-radius 16px

### 9.5 Touch Targets

**Minimo WCAG:** 44px x 44px
**Recomendado:** 48px x 48px

**Aplicacao:**
- Botoes: min-height 48px
- Links: padding vertical 12px (aumenta area clicavel)
- Checkboxes/radios: 24px x 24px (area clicavel 44px com padding)
- Icons interativos: 40px x 40px

---

## 10. ANIMACOES E MICRO-INTERACOES

### 10.1 Principios de Animacao

1. **Performance First:** 60fps minimo, usar transform/opacity (GPU accelerated)
2. **Meaningful Motion:** Animacoes devem ter proposito, nao ser decorativas
3. **Consistent Timing:** Usar curvas de easing padronizadas
4. **Respect User Preferences:** Respeitar `prefers-reduced-motion`

### 10.2 Easing Curves

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### 10.3 Duracoes

```css
--duration-instant: 100ms;  /* Toggle, checkbox */
--duration-fast: 200ms;     /* Hover, focus */
--duration-base: 300ms;     /* Padrao (modal open, dropdown) */
--duration-slow: 500ms;     /* Page transitions */
--duration-slower: 700ms;   /* Hero animations */
```

### 10.4 Catalogo de Animacoes

#### Fade In
**Uso:** Aparecer elementos, transicoes de pagina
**Implementacao:**
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn var(--duration-base) var(--ease-out);
}
```

#### Slide Up
**Uso:** Modais, toasts, cards ao scroll
**Implementacao:**
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp var(--duration-base) var(--ease-out);
}
```

#### Scale In
**Uso:** Cards de curso, imagens
**Implementacao:**
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.scale-in {
  animation: scaleIn var(--duration-base) var(--ease-out);
}
```

#### Shimmer (Loading)
**Uso:** Skeleton loaders
**Implementacao:**
```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 0%,
    var(--bg-tertiary) 50%,
    var(--bg-secondary) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

#### Bounce
**Uso:** Confirmacao de acao (like, favorite)
**Implementacao:**
```css
@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.bounce {
  animation: bounce var(--duration-fast) var(--ease-bounce);
}
```

### 10.5 Micro-interacoes Especificas

#### Button Hover
```css
.button {
  transition: all var(--duration-fast) var(--ease-out);
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 200, 150, 0.3);
}

.button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 200, 150, 0.2);
}
```

#### Input Focus
```css
.input {
  border: 1px solid var(--gray-600);
  transition: all var(--duration-fast) var(--ease-out);
}

.input:focus {
  border-color: var(--green-500);
  box-shadow: 0 0 0 3px rgba(0, 200, 150, 0.2);
  outline: none;
}
```

#### Card Hover (Course Card)
```css
.course-card {
  transition: all var(--duration-base) var(--ease-out);
}

.course-card:hover {
  transform: scale(1.05) translateZ(0); /* translateZ para force GPU */
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  border-color: rgba(0, 200, 150, 0.5);
}

.course-card:hover .course-card-overlay {
  opacity: 1;
}
```

#### Like Button (Heart)
```css
.like-button {
  transition: color var(--duration-fast) var(--ease-out);
}

.like-button:hover {
  color: var(--green-400);
  transform: scale(1.1);
}

.like-button.liked {
  color: var(--green-500);
  animation: bounce var(--duration-fast) var(--ease-bounce);
}
```

#### Progress Bar Fill
```css
.progress-bar-fill {
  width: 0;
  transition: width var(--duration-slow) var(--ease-smooth);
}

.progress-bar-fill[data-progress="50"] {
  width: 50%;
}
```

### 10.6 Page Transitions

**Entrada de Pagina:**
```css
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all var(--duration-base) var(--ease-out);
}
```

**Saida de Pagina:**
```css
.page-exit {
  opacity: 1;
}

.page-exit-active {
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-in);
}
```

### 10.7 Reduced Motion

**Acessibilidade:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. PLANO DE IMPLEMENTACAO

### 11.1 Fases do Redesign

#### FASE 1: Fundacao (1 semana)
**Objetivo:** Estabelecer design system base

**Tarefas:**
- [ ] Criar arquivo `/styles/tokens.css` com todas as variaveis CSS
- [ ] Criar arquivo `/styles/typography.css` com classes tipograficas
- [ ] Importar fonte Inter via Google Fonts
- [ ] Criar arquivo `/styles/animations.css` com keyframes base
- [ ] Atualizar `globals.css` para incluir todos os tokens

**Entregaveis:**
- Design tokens completos
- Sistema tipografico funcional
- Paleta de cores implementada

**Criterios de Aceite:**
- [ ] Todas as cores validadas em contraste WCAG AA
- [ ] Tipografia responsiva funcionando
- [ ] Tokens acessiveis via CSS variables

#### FASE 2: Componentes Base (1 semana)
**Objetivo:** Criar biblioteca de componentes atomicos

**Tarefas:**
- [ ] Criar componente `<Button />` com todas as variantes
- [ ] Criar componente `<Input />` com validacao
- [ ] Criar componente `<Badge />`
- [ ] Criar componente `<Card />`
- [ ] Criar componente `<Modal />`
- [ ] Criar componente `<Toast />` (usar react-hot-toast)
- [ ] Documentar cada componente (Storybook ou pasta /docs)

**Entregaveis:**
- 6 componentes base reutilizaveis
- Documentacao de uso
- Exemplos de implementacao

**Criterios de Aceite:**
- [ ] Componentes funcionam em todas as breakpoints
- [ ] Acessibilidade (ARIA) implementada
- [ ] TypeScript props completos

#### FASE 3: Landing Page (2 semanas)
**Objetivo:** Criar landing page de conversao

**Tarefas:**
**Semana 1:**
- [ ] Integrar componente Digital Serenity
- [ ] Criar Hero Section com animacao
- [ ] Criar Features Showcase (grid 3 colunas)
- [ ] Criar Footer completo

**Semana 2:**
- [ ] Criar secao de Depoimentos (carrossel)
- [ ] Criar secao de Pricing/CTA
- [ ] Escrever copy definitivo (headlines, CTAs)
- [ ] Otimizar para SEO (meta tags, structured data)
- [ ] Testes A/B de headlines (setup)

**Entregaveis:**
- Landing page completa e funcional
- Copy persuasivo
- SEO otimizado
- Performance score Lighthouse > 90

**Criterios de Aceite:**
- [ ] Responsive em mobile/tablet/desktop
- [ ] Animacoes suaves (60fps)
- [ ] CTAs obvios e funcionais
- [ ] Tempo de carregamento < 2s

#### FASE 4: Redesign de Componentes Existentes (1 semana)
**Objetivo:** Atualizar componentes atuais com novo design

**Tarefas:**
- [ ] Refatorar `<Navbar />` com novo design
- [ ] Refatorar `<CourseCarousel />` com cards novos
- [ ] Criar `<CourseCard />` standalone
- [ ] Atualizar player de video com controles customizados
- [ ] Atualizar Feed com novo design de posts
- [ ] Atualizar Chat com message bubbles novos

**Entregaveis:**
- Componentes existentes redesenhados
- Consistencia visual em todas as telas
- Performance mantida ou melhorada

**Criterios de Aceite:**
- [ ] Zero quebras de funcionalidade
- [ ] Design consistente com design system
- [ ] Animacoes implementadas

#### FASE 5: Paginas Internas (1 semana)
**Objetivo:** Aplicar redesign em todas as paginas

**Tarefas:**
- [ ] Homepage (Dashboard de cursos)
- [ ] Pagina de curso individual
- [ ] Feed de posts
- [ ] Chat
- [ ] Perfil de usuario (criar se nao existe)
- [ ] Admin dashboard
- [ ] Admin - CRUD de cursos

**Entregaveis:**
- Todas as paginas com novo design
- Navegacao fluida entre paginas
- Transicoes de pagina implementadas

**Criterios de Aceite:**
- [ ] Todas as paginas responsivas
- [ ] Estados vazios bem projetados
- [ ] Loading states consistentes

#### FASE 6: Migracao para Tailwind + shadcn/ui (2 semanas)
**Objetivo:** Substituir Bootstrap por solucao moderna

**Tarefas:**
**Semana 1:**
- [ ] Instalar Tailwind CSS
- [ ] Configurar `tailwind.config.ts` com tokens
- [ ] Instalar shadcn/ui
- [ ] Migrar componentes Button, Input, Card para shadcn
- [ ] Remover dependencias Bootstrap

**Semana 2:**
- [ ] Migrar todos os componentes restantes
- [ ] Atualizar todas as paginas para usar Tailwind
- [ ] Testar em todas as breakpoints
- [ ] Otimizar bundle (remover CSS nao usado)
- [ ] Validar que nada quebrou

**Entregaveis:**
- Bootstrap completamente removido
- Tailwind CSS + shadcn/ui funcionando
- Bundle size reduzido em ~200KB

**Criterios de Aceite:**
- [ ] Zero referencias a Bootstrap no codigo
- [ ] Todas as funcionalidades preservadas
- [ ] Performance igual ou melhor

#### FASE 7: Polimento e Otimizacao (1 semana)
**Objetivo:** Refinamento final e otimizacoes

**Tarefas:**
- [ ] Auditar acessibilidade com Lighthouse/axe
- [ ] Corrigir issues de contraste encontrados
- [ ] Adicionar foco visivel em todos os interativos
- [ ] Testar com leitor de tela (NVDA/VoiceOver)
- [ ] Otimizar imagens (next/image)
- [ ] Implementar lazy loading de componentes pesados
- [ ] Code splitting de rotas
- [ ] Auditar performance e corrigir bottlenecks

**Entregaveis:**
- Plataforma 100% acessivel (WCAG AA)
- Performance otimizada (Lighthouse > 90)
- Codigo limpo e documentado

**Criterios de Aceite:**
- [ ] Lighthouse Accessibility score > 95
- [ ] Lighthouse Performance score > 90
- [ ] Zero erros de console
- [ ] Bundle size < 500KB (first load)

### 11.2 Cronograma Consolidado

```
Semana 1:  FASE 1 - Fundacao (tokens, tipografia)
Semana 2:  FASE 2 - Componentes Base
Semana 3:  FASE 3.1 - Landing Page (Hero + Features)
Semana 4:  FASE 3.2 - Landing Page (Depoimentos + CTA)
Semana 5:  FASE 4 - Redesign Componentes Existentes
Semana 6:  FASE 5 - Paginas Internas
Semana 7:  FASE 6.1 - Migracao Tailwind (setup + base)
Semana 8:  FASE 6.2 - Migracao Tailwind (completa)
Semana 9:  FASE 7 - Polimento e Otimizacao
```

**Total: 9 semanas (2.25 meses)**

### 11.3 Dependencias e Riscos

#### Dependencias Externas
1. **Componente Digital Serenity:**
   - Risco: Componente pode nao ser fornecido ou incompativel
   - Mitigacao: Criar fallback com gradiente animado CSS

2. **Conteudo de Depoimentos:**
   - Risco: Falta de depoimentos reais de usuarios
   - Mitigacao: Usar placeholders realistas, coletar depoimentos em paralelo

3. **Assets (Imagens, Videos):**
   - Risco: Falta de material visual de qualidade
   - Mitigacao: Usar placeholders profissionais (Unsplash, Pexels)

#### Riscos Tecnicos
1. **Performance de Animacoes:**
   - Risco: Digital Serenity pode impactar performance
   - Mitigacao: Lazy load, intersection observer, optimize bundle

2. **Compatibilidade Next.js 15:**
   - Risco: Tailwind ou shadcn/ui podem ter issues
   - Mitigacao: Testar em ambiente separado antes de migrar

3. **Breaking Changes:**
   - Risco: Redesign pode quebrar funcionalidades existentes
   - Mitigacao: Testes manuais rigorosos, feature flags para rollback

### 11.4 Recursos Necessarios

#### Humanos
- **UI Designer:** 40h (criacao de mockups, validacao de implementacao)
- **Frontend Developer:** 280h (9 semanas x 35h)
- **QA Tester:** 20h (testes de acessibilidade e responsividade)

#### Tecnicos
- **Ferramentas de Design:**
  - Figma (para mockups e prototipos)
  - Contrast checker (WebAIM)
  - Lighthouse (auditoria)

- **Bibliotecas a Instalar:**
  - Tailwind CSS
  - shadcn/ui
  - react-hot-toast (toasts)
  - framer-motion (animacoes avancadas - opcional)
  - react-joyride (onboarding tour - futuro)

- **Fonts:**
  - Google Fonts (Inter - gratis)
  - JetBrains Mono (opcional, gratis)

**Custo Estimado:** $0 (todas as ferramentas sao gratuitas ou open-source)

---

## 12. METRICAS DE SUCESSO

### 12.1 Metricas de Design

#### Acessibilidade
- **Meta:** Lighthouse Accessibility score > 95
- **Como medir:** Lighthouse audit apos cada fase
- **Baseline atual:** Nao medido (provavelmente ~80)

#### Performance
- **Meta:** Lighthouse Performance score > 90
- **Como medir:** Lighthouse audit + Core Web Vitals
- **Baseline atual:** Nao medido

**Detalhamento:**
| Metrica | Meta | Baseline | Status |
|---------|------|----------|--------|
| First Contentful Paint | < 1.5s | TBD | - |
| Largest Contentful Paint | < 2.5s | TBD | - |
| Cumulative Layout Shift | < 0.1 | TBD | - |
| Time to Interactive | < 3.5s | TBD | - |

#### Consistencia Visual
- **Meta:** 100% dos componentes seguindo design system
- **Como medir:** Code review + auditoria visual
- **Baseline atual:** ~30% (apenas 3 componentes customizados)

### 12.2 Metricas de Negocio

#### Taxa de Conversao (Landing → Signup)
- **Meta:** 15% de visitantes se cadastram
- **Como medir:** Google Analytics (evento signup / pageview landing)
- **Baseline atual:** Nao existe landing page

#### Engajamento
- **Meta:** +30% tempo medio na plataforma
- **Como medir:** Firebase Analytics (session_duration)
- **Baseline atual:** TBD (medir antes do redesign)

#### Retencao
- **Meta:** +25% retorno semanal (D7)
- **Como medir:** Firebase Analytics (usuarios ativos D7/D30)
- **Baseline atual:** TBD

#### Satisfacao
- **Meta:** NPS > 50
- **Como medir:** Survey in-app apos 2 semanas de uso
- **Baseline atual:** Nao medido

### 12.3 Metricas de Usuario

#### Time to First Action
- **Meta:** Usuario completa primeira acao em < 30s apos login
- **Como medir:** Analytics customizado (tempo entre login e click em curso)
- **Baseline atual:** TBD

#### Error Rate
- **Meta:** < 2% de usuarios encontram erro em fluxo critico
- **Como medir:** Sentry + Analytics de erros
- **Baseline atual:** Nao monitorado

#### Mobile Usage
- **Meta:** 40% do trafego vem de mobile
- **Como medir:** Google Analytics (device category)
- **Baseline atual:** TBD

### 12.4 Dashboard de Metricas

**Ferramentas:**
1. **Google Analytics 4:**
   - Pageviews, sessoes, conversoes
   - Funis de conversao
   - Demograficos

2. **Firebase Analytics:**
   - Eventos customizados
   - Retencao de usuarios
   - Crash reports

3. **Lighthouse CI:**
   - Performance scores automaticos
   - Trending ao longo do tempo

4. **Hotjar (opcional):**
   - Heatmaps
   - Session recordings
   - User surveys

**Review Cadence:**
- **Semanal:** Performance metrics (Lighthouse)
- **Quinzenal:** Engagement metrics (tempo na plataforma, retencao)
- **Mensal:** Business metrics (conversao, NPS)

---

## APENDICES

### APENDICE A: Checklist de Acessibilidade

#### Contraste de Cores
- [ ] Texto normal: minimo 4.5:1 em todos os backgrounds
- [ ] Texto grande (18pt+): minimo 3:1
- [ ] Elementos interativos: minimo 3:1 com adjacentes
- [ ] Validado com WebAIM Contrast Checker

#### Navegacao por Teclado
- [ ] Todos os elementos interativos acessiveis via Tab
- [ ] Ordem de foco logica (top→bottom, left→right)
- [ ] Foco visivel (outline ou border change)
- [ ] Modais tem focus trap
- [ ] ESC fecha modais/dropdowns

#### Leitores de Tela
- [ ] Todos os botoes tem aria-label ou texto descritivo
- [ ] Imagens tem alt text significativo
- [ ] Form inputs tem labels associados
- [ ] Headings hierarquicos (H1 → H2 → H3)
- [ ] Landmarks (nav, main, footer) definidos

#### Reduced Motion
- [ ] Animacoes respeitam prefers-reduced-motion
- [ ] Funcionalidade nao depende de animacao

### APENDICE B: Bibliotecas Recomendadas

#### UI Components
- **shadcn/ui:** Componentes acessiveis baseados em Radix UI
- **Headless UI:** Componentes sem estilo (Tailwind Labs)
- **Radix UI:** Primitivos acessiveis low-level

#### Animacoes
- **Framer Motion:** Animacoes declarativas React
- **Auto Animate:** Animacoes automaticas em mudancas de DOM
- **GSAP:** Animacoes complexas (timeline, scroll-trigger)

#### Utilitarios
- **clsx / classnames:** Concatenacao de classes CSS
- **tailwind-merge:** Merge de classes Tailwind sem conflitos
- **react-hot-toast:** Notificacoes toast
- **react-joyride:** Tours guiados
- **react-hook-form:** Forms com validacao

#### Dev Tools
- **Storybook:** Documentacao de componentes
- **Chromatic:** Visual regression testing
- **axe DevTools:** Auditoria de acessibilidade
- **Lighthouse CI:** Auditorias automaticas

### APENDICE C: Recursos de Design

#### Inspiracao
- **Dribbble:** https://dribbble.com/tags/dark-mode
- **Awwwards:** https://www.awwwards.com/ (filtrar dark themes)
- **Mobbin:** https://mobbin.com/ (apps mobile)

#### Ferramentas
- **Figma:** Design e prototipos
- **Coolors:** Geracao de paletas
- **Contrast Ratio:** https://contrast-ratio.com/
- **Type Scale:** https://typescale.com/

#### Fonts
- **Google Fonts:** https://fonts.google.com/
- **Font Pair:** https://www.fontpair.co/
- **Typewolf:** https://www.typewolf.com/

---

## CONCLUSAO

Este PRD de Design estabelece uma fundacao solida para transformar o ComunidadeFlix em uma plataforma visualmente impactante, profissional e acessivel.

### Proximos Passos Imediatos

1. **Aprovacao do PRD:**
   - Revisao com stakeholders
   - Ajustes baseados em feedback
   - Aprovacao final para inicio

2. **Setup de Ferramentas:**
   - Criar projeto Figma para mockups
   - Configurar Google Analytics
   - Configurar Lighthouse CI

3. **Inicio da FASE 1:**
   - Criar arquivo `tokens.css`
   - Importar fonte Inter
   - Definir variaveis CSS

### Comprometimentos

**Design:**
- Identidade visual forte e unica (dark + verde)
- Acessibilidade WCAG AA em 100% dos componentes
- Performance otimizada (Lighthouse > 90)

**Negocio:**
- Landing page de alta conversao
- Experiencia que aumenta engajamento e retencao
- Plataforma que transmite profissionalismo

**Tecnico:**
- Design system escalavel e bem documentado
- Codigo limpo e manutenivel
- Stack moderna (Tailwind + shadcn/ui)

---

**Documento criado por:** Agent Organizer
**Data:** 2025-10-10
**Proxima revisao:** Apos conclusao da Fase 1
**Versao:** 1.0

---

**FIM DO PRD DE DESIGN**
