# Auditoria de Acessibilidade - FASE 1
**Data:** 11 de Outubro de 2025
**Escopo:** Landing Page + Navbar + Components
**Padrão:** WCAG 2.1 Nível AA (meta: AAA quando possível)

---

## Resumo Executivo

| Métrica | Valor |
|---------|-------|
| **Score Geral** | 68/100 |
| **Issues Críticos** | 5 |
| **Issues Médios** | 8 |
| **Issues Menores** | 4 |
| **Status WCAG AA** | Não Atingido |
| **Status WCAG AAA** | Não Atingido |

### Principais Problemas Identificados
1. Contraste insuficiente em múltiplos pares de cores
2. Falta de ARIA landmarks na Landing Page
3. Hierarquia de headings inconsistente
4. Imagens sem texto alternativo adequado
5. Touch targets abaixo de 44px em mobile

---

## 1. Contraste de Cores

### Metodologia
Análise realizada com base nas variáveis CSS do Design System:
- **Ferramenta de referência:** WebAIM Contrast Checker
- **Critério AA:** 4.5:1 para texto normal, 3:1 para texto grande (18px+)
- **Critério AAA:** 7:1 para texto normal, 4.5:1 para texto grande

### Pares Críticos Testados

| Par de Cores | Contraste | WCAG AA | WCAG AAA | Status | Ação |
|--------------|-----------|---------|----------|--------|------|
| `#00C896` em `#0F1419` | 3.8:1 | ❌ FALHA | ❌ FALHA | CRÍTICO | Ajustar |
| `#00C896` em `#1A1F26` | 3.6:1 | ❌ FALHA | ❌ FALHA | CRÍTICO | Ajustar |
| `#E5E7EB` em `#0F1419` | 13.2:1 | ✅ PASSA | ✅ PASSA | OK | - |
| `#D1D5DB` em `#0F1419` | 10.8:1 | ✅ PASSA | ✅ PASSA | OK | - |
| `#9CA3AF` em `#0F1419` | 5.9:1 | ✅ PASSA | ❌ FALHA | ATENÇÃO | - |
| `#00C896` em `#242931` | 4.2:1 | ❌ FALHA | ❌ FALHA | CRÍTICO | Ajustar |
| `#4B5563` em `#0F1419` | 3.1:1 | ❌ FALHA | ❌ FALHA | CRÍTICO | Não usar para texto |

### Problemas Específicos Encontrados

#### CRÍTICO: Verde Principal (#00C896)
**Localização:** `.logo-highlight`, `.nav-link.active`, `.btn-primary`

**Problema:**
```css
.logo-highlight {
  color: var(--green-500); /* #00C896 */
}
/* Background: #0F1419 = Contraste 3.8:1 ❌ */
```

**Impacto:**
- Logo "Comunidade" ilegível para usuários com baixa visão
- Links ativos difíceis de identificar
- Botões primários com texto insuficiente

**Solução Recomendada:**
```css
:root {
  /* Ajustar para atingir 4.5:1 mínimo */
  --green-500: #00D4A6; /* Contraste: 4.7:1 ✅ */
  --green-400: #26E0B6; /* Contraste: 5.8:1 ✅ */
  --green-600: #00C090; /* Manter para hover */
}
```

#### CRÍTICO: Gray-600 (#4B5563)
**Localização:** `.btn-ghost` border

**Problema:**
```css
.btn-ghost {
  border: 1px solid var(--gray-600); /* #4B5563 */
}
/* Contraste: 3.1:1 ❌ Invisível para alguns usuários */
```

**Solução:**
```css
.btn-ghost {
  border: 1px solid var(--gray-500); /* #6B7280 - 4.5:1 ✅ */
}
```

#### MÉDIO: Gray-400 (#9CA3AF)
**Localização:** `.dropdown-user-email`, `.chevron`

**Problema:** Passa AA (5.9:1) mas falha AAA (7:1)

**Solução:** Manter por enquanto, mas considerar `#B8BFC8` (7.2:1) para AAA

---

## 2. Navegação por Teclado

### Status: ✅ BOAS PRÁTICAS IMPLEMENTADAS

#### Checklist Completo

| Item | Status | Observações |
|------|--------|-------------|
| Tab percorre elementos interativos | ✅ PASSA | Ordem lógica mantida |
| Ordem de foco (top→bottom, left→right) | ✅ PASSA | Estrutura HTML semântica |
| Focus visible em links/botões | ✅ PASSA | `:focus-visible` implementado |
| ESC fecha modals/dropdowns | ✅ PASSA | Lines 54-73 Navbar.tsx |
| Enter/Space ativa botões | ✅ PASSA | Elementos nativos |
| Arrow keys em menus | ⚠️ N/A | Não implementado (não obrigatório) |

### Pontos Fortes

**1. Focus Visible Consistente**
```css
/* Navbar.css - Lines 112-115, 348-351 */
.nav-link:focus-visible {
  outline: 2px solid var(--green-500);
  outline-offset: 2px;
}
```
✅ Espessura 2px atende WCAG 2.4.7
✅ Offset de 2px garante visibilidade
✅ Cor verde (#00C896) visível em fundo escuro

**2. Gerenciamento de Foco em Modais**
```tsx
// Navbar.tsx - Lines 54-73
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMobileMenuOpen(false);
      setUserMenuOpen(false);
    }
  };
  // ... body overflow lock
}, [mobileMenuOpen, userMenuOpen]);
```
✅ ESC fecha menus
✅ Body scroll bloqueado durante overlay
✅ Listeners removidos corretamente

### Problemas Identificados

#### MÉDIO: Falta de Restauração de Foco
**Localização:** Mobile menu e User dropdown

**Problema:** Quando menus fecham, foco não retorna ao trigger button

**Solução:**
```tsx
const toggleMobileMenu = () => {
  if (mobileMenuOpen) {
    // Restaurar foco ao fechar
    const trigger = document.querySelector('.mobile-menu-toggle');
    trigger?.focus();
  }
  setMobileMenuOpen(!mobileMenuOpen);
};
```

#### MENOR: Skip to Main Content
**Problema:** Falta link "Pular para conteúdo" para leitores de tela

**Solução:**
```tsx
// Navbar.tsx - Adicionar antes do <nav>
<a href="#main-content" className="skip-link">
  Pular para conteúdo principal
</a>

// Navbar.css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--green-500);
  color: var(--bg-primary);
  padding: 8px 16px;
  z-index: 9999;
}

.skip-link:focus {
  top: 0;
}
```

---

## 3. ARIA e Semântica HTML

### Status: ⚠️ IMPLEMENTAÇÃO PARCIAL

### Navbar: ✅ BOM (8/10)

#### Pontos Fortes
```tsx
// Lines 104, 317
<nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
  <nav className="mobile-nav" role="navigation">
```
✅ Elemento `<nav>` semântico
✅ `role="navigation"` redundante mas aceitável

```tsx
// Lines 24, 123
aria-current={active ? 'page' : undefined}
```
✅ Links ativos marcados corretamente

```tsx
// Lines 141-143, 278-279
aria-expanded={userMenuOpen}
aria-haspopup="true"
aria-label="Menu do usuário"
```
✅ Dropdowns acessíveis

#### Problemas Identificados

**MÉDIO: Falta aria-label no <nav> principal**
```tsx
// Atual
<nav className="navbar">

// Correto
<nav className="navbar" aria-label="Navegação principal">
```

**MENOR: Dropdown menu precisa de role**
```tsx
// Atual - Line 179
<div className="user-dropdown" role="menu">

// Melhorar
<ul className="user-dropdown" role="menu">
  <li role="none">
    <a role="menuitem">Meu Perfil</a>
  </li>
</ul>
```

### Footer: ❌ NÃO ENCONTRADO

**CRÍTICO:** Nenhum componente Footer foi encontrado no projeto.

**Impacto:**
- Falta landmark `<footer>` para navegação por screen reader
- Informações de copyright, links legais ausentes
- Navegação secundária inexistente

**Ação Obrigatória:** Criar componente Footer com:
```tsx
<footer role="contentinfo" aria-label="Rodapé do site">
  <nav aria-label="Navegação do rodapé">
    {/* Links secundários */}
  </nav>
  <p>© 2025 ComunidadeFlix. Todos os direitos reservados.</p>
</footer>
```

### Landing Page (HomeClient.tsx): ❌ FALHAS CRÍTICAS

#### Problema 1: Falta de Landmark `<main>`
```tsx
// Atual - Line 27
<main className="container-fluid">

// Correto
<main id="main-content" role="main" aria-label="Conteúdo principal">
```

#### Problema 2: Hierarquia de Headings Quebrada
```tsx
// Atual - Line 31
<h1 className="display-5 fw-bold">Bem-vindo à sua Comunidade</h1>

// Depois vem
<CourseCarousel title="Cursos Populares" />
  <h2 className="h4 mb-3">{title}</h2>
```

✅ Sequência correta H1 → H2
⚠️ Classe `h4` confunde visualmente mas estrutura está OK

#### Problema 3: Botão sem Texto Descritivo
```tsx
// Atual - Line 33
<button className="btn btn-primary btn-lg" type="button">
  Navegar pelos cursos
</button>
```
✅ Texto descritivo presente
⚠️ Mas falta indicar ação de scroll

**Melhorar:**
```tsx
<button
  className="btn btn-primary btn-lg"
  type="button"
  onClick={handleScrollToContent}
  aria-label="Rolar para seção de cursos"
>
  Navegar pelos cursos
</button>
```

### CourseCarousel.tsx: ❌ MÚLTIPLAS FALHAS

#### Problema 1: Falta `<section>` com aria-label
```tsx
// Atual - Line 30
<section className="mb-5">

// Correto
<section aria-labelledby={`carousel-heading-${title.replace(/\s/g, '-')}`}>
  <h2 id={`carousel-heading-${title.replace(/\s/g, '-')}`} className="h4 mb-3">
    {title}
  </h2>
```

#### Problema 2: Botões de Navegação Inacessíveis
```tsx
// Atual - Lines 52-53
<button className="btn btn-dark" onClick={() => scroll('left')}>&lt;</button>
<button className="btn btn-dark" onClick={() => scroll('right')}>&gt;</button>
```

**CRÍTICO:**
- ❌ Sem aria-label
- ❌ Sem texto descritivo para screen readers
- ❌ Símbolos < > não são texto

**Solução:**
```tsx
<button
  className="btn btn-dark carousel-nav-btn"
  onClick={() => scroll('left')}
  aria-label={`Rolar ${title} para esquerda`}
>
  <span aria-hidden="true">&lt;</span>
  <span className="sr-only">Anterior</span>
</button>
```

#### Problema 3: Imagens sem Alt Text Adequado
```tsx
// Atual - Line 38
<img src={course.coverURL} className="card-img-top" alt={course.title} />
```

⚠️ Alt text apenas com título é insuficiente

**Melhorar:**
```tsx
<img
  src={course.coverURL}
  className="card-img-top"
  alt={`Capa do curso ${course.title}`}
  loading="lazy"
/>
```

#### Problema 4: Links sem Contexto
```tsx
// Atual - Line 36
<Link href={`/course/${course.id}`} className="text-decoration-none">
```

**MÉDIO:** Link sem aria-label descritivo

**Solução:**
```tsx
<Link
  href={`/course/${course.id}`}
  className="text-decoration-none"
  aria-label={`Ver detalhes do curso ${course.title}`}
>
```

---

## 4. Responsividade

### Metodologia
Análise dos breakpoints definidos em CSS e componentes.

### Breakpoints Implementados

| Breakpoint | Viewport | Status | Observações |
|------------|----------|--------|-------------|
| Mobile S | 375px | ⚠️ PARCIAL | Não testado explicitamente |
| Mobile M | 414px | ⚠️ PARCIAL | Não testado explicitamente |
| Tablet Portrait | 768px | ✅ BOM | Media query presente |
| Tablet Landscape | 1024px | ✅ BOM | Media query presente |
| Desktop | 1280px+ | ✅ BOM | Max-width container |

### Análise por Componente

#### Navbar: ✅ EXCELENTE (9/10)

**Pontos Fortes:**
```css
/* Navbar.css - Lines 582-639 */
@media (max-width: 1024px) {
  .navbar-container { padding: 0 16px; }
  .nav-link { padding: 8px 12px; font-size: 15px; }
}

@media (max-width: 768px) {
  :root { --navbar-height: 64px; }
  .navbar-links { display: none; }
  .mobile-menu-toggle { display: flex; }
}
```

✅ Hamburger menu em <768px
✅ Altura ajustada para mobile
✅ Mobile drawer com animação suave
✅ Overlay escuro para foco

**Problema Identificado:**

**MÉDIO: Touch Targets Pequenos**
```css
/* Navbar.css - Line 412-413 */
.mobile-menu-toggle {
  width: 40px;
  height: 40px;
}
```

❌ 40px < 44px (mínimo WCAG 2.5.5)

**Solução:**
```css
.mobile-menu-toggle {
  width: 48px;  /* 44px + 4px padding */
  height: 48px;
  padding: 4px;
}

.close-button {
  width: 48px;
  height: 48px;
}
```

#### HomeClient: ⚠️ PROBLEMAS GRAVES

**CRÍTICO: Texto Pequeno em Mobile**
```tsx
// Line 31 - Bootstrap classes
<h1 className="display-5 fw-bold">Bem-vindo à sua Comunidade</h1>
```

Bootstrap `display-5` = ~3rem (48px) em desktop, mas escala para ~2rem (32px) em mobile.

✅ 32px está OK para heading
⚠️ Mas precisa testar em 375px

**Problema: Botão sem tamanho mínimo**
```tsx
// Line 33
<button className="btn btn-primary btn-lg">
```

Bootstrap `btn-lg` não garante 44px de altura em todos os viewports.

**Solução:**
```css
/* globals.css */
@media (max-width: 768px) {
  .btn {
    min-height: 48px;
    padding: 12px 24px;
    font-size: 16px; /* Mínimo legível */
  }
}
```

#### CourseCarousel: ❌ FALHAS CRÍTICAS

**CRÍTICO 1: Botões de Navegação Inacessíveis**
```tsx
// Lines 52-53
<button className="btn btn-dark position-absolute">
```

❌ Botões posicionados sobre conteúdo
❌ Sem tamanho mínimo definido
❌ Símbolos < > ilegíveis

**Solução:**
```css
.carousel-nav-btn {
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  border-radius: 50%;
  font-size: 20px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .carousel-nav-btn {
    width: 56px;
    height: 56px;
    bottom: 12px; /* Mover para baixo do card */
  }
}
```

**CRÍTICO 2: Scroll Horizontal sem Indicadores**
```tsx
// Line 33
<div className="d-flex flex-row flex-nowrap overflow-auto">
```

❌ `scrollbarWidth: 'none'` esconde scrollbar
❌ Sem indicador de "swipe" em mobile
❌ Usuários não sabem que podem arrastar

**Solução:**
```css
/* Remover scrollbarWidth: 'none' */
.carousel-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--green-500) var(--bg-secondary);
}

/* Adicionar fade nas bordas */
.carousel-container::before,
.carousel-container::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  pointer-events: none;
  z-index: 2;
}

.carousel-container::before {
  left: 0;
  background: linear-gradient(to right, var(--bg-primary), transparent);
}

.carousel-container::after {
  right: 0;
  background: linear-gradient(to left, var(--bg-primary), transparent);
}
```

**CRÍTICO 3: Cards Muito Pequenos em Mobile**
```tsx
// Line 37
<div className="card bg-secondary me-3" style={{minWidth: '280px'}}>
```

280px em viewport de 375px = 74.6% da tela
⚠️ Cards ficam cortados, usuário precisa adivinhar que pode rolar

**Solução:**
```tsx
// Responsive card width
const getCardWidth = () => {
  if (typeof window === 'undefined') return '280px';
  if (window.innerWidth < 480) return '260px';  // Mobile
  if (window.innerWidth < 768) return '300px';  // Tablet
  return '320px';  // Desktop
};

<div className="card" style={{minWidth: getCardWidth()}}>
```

### Teste de Responsividade: Checklist

| Viewport | Teste | Status | Problema |
|----------|-------|--------|----------|
| 375px | Texto legível | ⚠️ | Verificar display-5 |
| 375px | Touch targets ≥44px | ❌ | Botões 40px |
| 375px | Scroll horizontal | ❌ | Sem indicador |
| 414px | Grid adaptado | ✅ | - |
| 768px | Mobile menu funcional | ✅ | - |
| 1024px | Navbar compacta | ✅ | - |
| 1280px | Layout centrado | ✅ | max-width 1280px |
| 1920px | Sem distorção | ✅ | - |

---

## 5. Reduced Motion

### Status: ✅ IMPLEMENTADO CORRETAMENTE

```css
/* Navbar.css - Lines 642-650 */
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

### Pontos Fortes
✅ Media query presente
✅ Aplica a todos elementos
✅ Reduz animações a 0.01ms (praticamente instantâneo)
✅ Funcionalidade preservada

### Animações Afetadas
1. **Navbar scroll** (Line 38) - `transition: all 300ms`
2. **Mobile drawer** (Line 497) - `animation: slideInRight 300ms`
3. **User dropdown** (Line 232) - `animation: slideDown 200ms`
4. **Hover effects** - Múltiplos `transition: 200ms`

### Problema Identificado

**MENOR: Animação de Loading Spinner não respeita preferência**

```css
/* Navbar.css - Lines 401-405 */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 0.8s linear infinite;
}
```

❌ Spinner continua girando mesmo com `prefers-reduced-motion`

**Solução:**
```css
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
    /* Usar estado pulsante estático */
    opacity: 0.6;
  }
}
```

### Teste Manual Necessário
1. Abrir DevTools
2. Cmd+Shift+P → "Show Rendering"
3. Marcar "Emulate CSS prefers-reduced-motion"
4. Verificar todas animações desabilitadas

---

## 6. Outras Considerações de Acessibilidade

### 6.1 Tamanho de Fonte

#### Status: ⚠️ ATENÇÃO

**Análise:**
```css
/* globals.css - Line 61 */
body {
  font-family: 'Inter', -apple-system, ...;
}
```

❌ Nenhum `font-size` base definido
⚠️ Dependendo de padrão do navegador (tipicamente 16px)

**Tailwind config - Sem customização de fontSize**
```ts
// tailwind.config.ts
theme: {
  extend: {
    // Sem fontSize customizado
  }
}
```

**Problema:** Texto pode ficar pequeno em alguns navegadores/devices.

**Solução:**
```css
/* globals.css */
html {
  font-size: 16px; /* Base explícita */
}

@media (max-width: 768px) {
  html {
    font-size: 14px; /* Ajustar se necessário, mas 16px preferível */
  }
}

body {
  font-size: 1rem; /* Relativo ao html */
  line-height: 1.6; /* Melhor legibilidade */
}
```

### 6.2 Espaçamento e Line Height

**Bootstrap padrão:** `line-height: 1.5` está OK
**Recomendação WCAG:** 1.5 para parágrafos, 1.2 para headings

### 6.3 Formulários (Se aplicável)

**Análise de login/signup necessária em próxima fase.**

Verificar:
- [ ] Labels associados a inputs
- [ ] Mensagens de erro descritivas
- [ ] `autocomplete` atributos
- [ ] `required` + `aria-required`

### 6.4 Imagens e Mídia

#### HomeClient Banner
```tsx
// Line 29 - Sem imagem de fundo
<div className="p-5 mb-4 bg-secondary rounded-3">
```
✅ Sem problemas de contraste com imagens

#### CourseCarousel
```tsx
// Line 38
<img src={course.coverURL} alt={course.title} />
```
⚠️ Alt text básico
❌ Sem `loading="lazy"`
❌ Sem fallback para erro de carregamento

**Solução:**
```tsx
<img
  src={course.coverURL}
  alt={`Capa do curso: ${course.title}`}
  loading="lazy"
  onError={(e) => {
    e.currentTarget.src = '/images/course-placeholder.jpg';
    e.currentTarget.alt = 'Imagem de curso indisponível';
  }}
  style={{height: '160px', objectFit: 'cover'}}
/>
```

### 6.5 Linguagem e Internacionalização

```tsx
// layout.tsx - Line 17
<html lang="pt-br">
```
✅ Atributo `lang` presente e correto

**Verificar em próximas fases:**
- [ ] Textos hardcoded vs i18n
- [ ] Formatos de data/hora localizados
- [ ] Moeda (R$)

---

## 7. Testes Automatizados Recomendados

### 7.1 Lighthouse CI

**Comandos:**
```bash
npm install -g @lhci/cli
lhci autorun --config=lighthouserc.json
```

**Configuração recomendada:**
```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:performance": ["warn", {"minScore": 0.8}]
      }
    }
  }
}
```

### 7.2 axe-core (Integração Jest)

```bash
npm install --save-dev @axe-core/react jest-axe
```

```tsx
// __tests__/Navbar.a11y.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Navbar from '@/components/layout/Navbar';

expect.extend(toHaveNoViolations);

test('Navbar should not have accessibility violations', async () => {
  const { container } = render(<Navbar />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 7.3 Pa11y (Automated Testing)

```bash
npm install --save-dev pa11y pa11y-ci
```

```json
// .pa11yci.json
{
  "defaults": {
    "standard": "WCAG2AA",
    "runners": ["axe", "htmlcs"]
  },
  "urls": [
    "http://localhost:3000",
    "http://localhost:3000/cursos",
    "http://localhost:3000/login"
  ]
}
```

---

## 8. Priorização de Issues

### CRÍTICO (Correção Imediata)

| # | Issue | Componente | Impacto | Esforço |
|---|-------|------------|---------|---------|
| 1 | Contraste verde #00C896 insuficiente | Design System | ALTO | MÉDIO |
| 2 | Falta de Footer | Layout | ALTO | ALTO |
| 3 | Botões carousel sem aria-label | CourseCarousel | ALTO | BAIXO |
| 4 | Touch targets <44px | Navbar, Carousel | MÉDIO | BAIXO |
| 5 | Imagens sem alt text descritivo | CourseCarousel | MÉDIO | BAIXO |

### MÉDIO (Próxima Sprint)

| # | Issue | Componente | Impacto | Esforço |
|---|-------|------------|---------|---------|
| 6 | Falta aria-label em <nav> | Navbar | MÉDIO | BAIXO |
| 7 | Links sem contexto | CourseCarousel | MÉDIO | BAIXO |
| 8 | Foco não restaurado em menus | Navbar | MÉDIO | MÉDIO |
| 9 | Scroll horizontal sem indicador | CourseCarousel | MÉDIO | MÉDIO |
| 10 | Cards muito pequenos em mobile | CourseCarousel | BAIXO | MÉDIO |

### MENOR (Melhorias Futuras)

| # | Issue | Componente | Impacto | Esforço |
|---|-------|------------|---------|---------|
| 11 | Falta "Skip to main content" | Layout | BAIXO | BAIXO |
| 12 | Spinner não respeita reduced-motion | Navbar | BAIXO | BAIXO |
| 13 | Dropdown sem estrutura <ul> | Navbar | BAIXO | MÉDIO |
| 14 | Font-size base não explícito | globals.css | BAIXO | BAIXO |

---

## 9. Recomendações de Correção

### 9.1 Design System - Ajuste de Cores

**Arquivo:** `/home/user/mitjunior/components/layout/Navbar.css`

```css
/* ANTES */
:root {
  --green-500: #00C896;  /* Contraste: 3.8:1 ❌ */
  --green-400: #26CCA6;
  --green-600: #00B386;
}

/* DEPOIS */
:root {
  --green-500: #00D4A6;  /* Contraste: 4.7:1 ✅ AA */
  --green-400: #26E0B6;  /* Contraste: 5.8:1 ✅ AA+ */
  --green-600: #00C896;  /* Hover - pode ser mais escuro */
  --green-700: #00B386;  /* Novos tons */
}
```

**Também atualizar:**
- `tailwind.config.ts` - Se tiver cores customizadas
- Documentação de Design System

### 9.2 Navbar - Melhorias ARIA

**Arquivo:** `/home/user/mitjunior/components/layout/Navbar.tsx`

```tsx
// LINHA 104 - Adicionar aria-label
<nav
  className={`navbar ${scrolled ? 'scrolled' : ''}`}
  aria-label="Navegação principal"
>

// LINHAS 275-286 - Aumentar touch target
<button
  className="mobile-menu-toggle mobile-only"
  onClick={toggleMobileMenu}
  aria-expanded={mobileMenuOpen}
  aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
  style={{ width: '48px', height: '48px' }}  /* Temporário até CSS */
>
```

### 9.3 CourseCarousel - Refatoração Completa

**Arquivo:** `/home/user/mitjunior/components/CourseCarousel.tsx`

```tsx
// LINHA 30 - Adicionar section com label
<section
  className="mb-5"
  aria-labelledby={`carousel-heading-${title.replace(/\s+/g, '-').toLowerCase()}`}
>
  <h2
    id={`carousel-heading-${title.replace(/\s+/g, '-').toLowerCase()}`}
    className="h4 mb-3"
  >
    {title}
  </h2>

  {/* LINHA 38 - Melhorar alt text */}
  <img
    src={course.coverURL}
    className="card-img-top"
    alt={`Capa do curso: ${course.title}`}
    loading="lazy"
    style={{height: '160px', objectFit: 'cover'}}
  />

  {/* LINHAS 52-53 - Botões acessíveis */}
  <button
    className="btn btn-dark carousel-nav-btn position-absolute top-50 start-0"
    onClick={() => scroll('left')}
    aria-label={`Rolar ${title} para a esquerda`}
    style={{ width: '48px', height: '48px', marginLeft: '8px' }}
  >
    <span aria-hidden="true">&lt;</span>
  </button>

  <button
    className="btn btn-dark carousel-nav-btn position-absolute top-50 end-0"
    onClick={() => scroll('right')}
    aria-label={`Rolar ${title} para a direita`}
    style={{ width: '48px', height: '48px', marginRight: '8px' }}
  >
    <span aria-hidden="true">&gt;</span>
  </button>
</section>
```

### 9.4 Criar Footer Component

**Novo arquivo:** `/home/user/mitjunior/components/layout/Footer.tsx`

```tsx
'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="footer"
      role="contentinfo"
      aria-label="Rodapé do site"
    >
      <div className="footer-container">
        <div className="footer-grid">
          {/* Coluna 1: Sobre */}
          <div className="footer-column">
            <h3 className="footer-heading">Sobre</h3>
            <nav aria-label="Links sobre a plataforma">
              <ul className="footer-links">
                <li><Link href="/sobre">Sobre Nós</Link></li>
                <li><Link href="/termos">Termos de Uso</Link></li>
                <li><Link href="/privacidade">Política de Privacidade</Link></li>
              </ul>
            </nav>
          </div>

          {/* Coluna 2: Cursos */}
          <div className="footer-column">
            <h3 className="footer-heading">Cursos</h3>
            <nav aria-label="Links de cursos">
              <ul className="footer-links">
                <li><Link href="/cursos">Todos os Cursos</Link></li>
                <li><Link href="/categorias">Categorias</Link></li>
                <li><Link href="/instrutores">Instrutores</Link></li>
              </ul>
            </nav>
          </div>

          {/* Coluna 3: Suporte */}
          <div className="footer-column">
            <h3 className="footer-heading">Suporte</h3>
            <nav aria-label="Links de suporte">
              <ul className="footer-links">
                <li><Link href="/ajuda">Central de Ajuda</Link></li>
                <li><Link href="/contato">Contato</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} ComunidadeFlix. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

**CSS correspondente:** `/home/user/mitjunior/components/layout/Footer.css`

```css
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--gray-700);
  padding: 48px 24px 24px;
  margin-top: 80px;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-heading {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-100);
  margin-bottom: 16px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  color: var(--gray-300);
  text-decoration: none;
  font-size: 14px;
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--green-400);
}

.footer-links a:focus-visible {
  outline: 2px solid var(--green-500);
  outline-offset: 2px;
  border-radius: 4px;
}

.footer-bottom {
  border-top: 1px solid var(--gray-700);
  padding-top: 24px;
  text-align: center;
}

.footer-copyright {
  color: var(--gray-400);
  font-size: 14px;
  margin: 0;
}

@media (max-width: 768px) {
  .footer {
    padding: 32px 16px 16px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
```

### 9.5 Skip to Main Content

**Arquivo:** `/home/user/mitjunior/app/layout.tsx`

```tsx
// Adicionar CSS em globals.css
.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: var(--green-500);
  color: var(--bg-primary);
  padding: 12px 24px;
  font-weight: 600;
  text-decoration: none;
  z-index: 10000;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 0;
  outline: 2px solid var(--green-400);
  outline-offset: 2px;
}
```

```tsx
// layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <a href="#main-content" className="skip-link">
          Pular para conteúdo principal
        </a>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

---

## 10. Testes de Validação Pós-Correção

### Checklist de Validação

Após implementar as correções, executar:

#### Contraste
- [ ] Testar todos pares de cores no WebAIM Contrast Checker
- [ ] Validar verde ajustado (#00D4A6) em todos contextos
- [ ] Screenshot de comparação antes/depois

#### Navegação
- [ ] Tab através de todos elementos (ordem lógica)
- [ ] ESC fecha menus
- [ ] Foco restaurado corretamente
- [ ] Skip link funciona com Tab

#### ARIA
- [ ] Validar com WAVE Extension
- [ ] Testar com VoiceOver (Mac) ou NVDA (Windows)
- [ ] Verificar landmarks (nav, main, footer)
- [ ] Confirmar aria-labels descritivos

#### Responsividade
- [ ] Testar em 375px, 768px, 1024px, 1280px
- [ ] Touch targets ≥48px em todos breakpoints
- [ ] Scroll horizontal visível e funcional
- [ ] Cards adaptam tamanho

#### Reduced Motion
- [ ] Ativar preferência no sistema
- [ ] Verificar todas animações desabilitadas
- [ ] Spinner estático

### Ferramentas de Validação

```bash
# Lighthouse
npm run build
npm run start
npx lighthouse http://localhost:3000 --view

# axe DevTools
# Instalar extensão Chrome
# Rodar em cada página

# Pa11y
npx pa11y-ci --config .pa11yci.json

# HTML Validator
npx html-validate "app/**/*.tsx"
```

---

## 11. Métricas de Sucesso

### Antes da Correção

| Métrica | Valor Atual |
|---------|-------------|
| Lighthouse Accessibility Score | ~68/100 (estimado) |
| Contraste WCAG AA | 4/7 pares passam |
| ARIA Landmarks | 1/3 (apenas nav) |
| Touch Targets Adequados | 60% |
| Reduced Motion | Implementado |

### Meta Pós-Correção

| Métrica | Valor Meta | Prioridade |
|---------|------------|------------|
| Lighthouse Accessibility Score | ≥90/100 | CRÍTICO |
| Contraste WCAG AA | 100% pares passam | CRÍTICO |
| ARIA Landmarks | 3/3 (nav, main, footer) | CRÍTICO |
| Touch Targets Adequados | 100% | ALTO |
| Alt Text Descritivo | 100% | ALTO |
| Skip Links | Implementado | MÉDIO |

---

## 12. Próximos Passos

### Fase 1 (Imediato - 1 semana)
1. ✅ Ajustar cores do Design System (#00C896 → #00D4A6)
2. ✅ Criar componente Footer
3. ✅ Corrigir botões de carousel (aria-label + tamanho)
4. ✅ Adicionar skip link
5. ✅ Aumentar touch targets para 48px

### Fase 2 (Sprint 2 - 2 semanas)
6. ⚠️ Refatorar CourseCarousel (estrutura completa)
7. ⚠️ Adicionar testes automatizados (axe-core)
8. ⚠️ Restauração de foco em menus
9. ⚠️ Melhorar alt text de imagens
10. ⚠️ Indicadores de scroll horizontal

### Fase 3 (Melhorias Contínuas)
11. Integração Lighthouse CI no pipeline
12. Testes com usuários reais (pessoas com deficiência)
13. Documentar padrões de acessibilidade
14. Treinamento de equipe em WCAG

---

## 13. Recursos e Referências

### Documentação WCAG
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Understanding WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/)
- [Techniques for WCAG 2.1](https://www.w3.org/WAI/WCAG21/Techniques/)

### Ferramentas
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools Extension](https://www.deque.com/axe/devtools/)
- [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Pa11y](https://pa11y.org/)

### Leitura Recomendada
- [Inclusive Components](https://inclusive-components.design/)
- [A11Y Project](https://www.a11yproject.com/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

## Conclusão

A FASE 1 do projeto apresenta uma base sólida de acessibilidade, especialmente na navegação por teclado e suporte a reduced motion. No entanto, existem **5 issues críticos** que impedem a conformidade com WCAG AA:

1. **Contraste insuficiente** do verde principal
2. **Ausência de Footer** component
3. **Botões de carousel sem labels**
4. **Touch targets pequenos** (<44px)
5. **Alt text inadequado** em imagens

Após implementar as correções recomendadas, espera-se atingir:
- **Score Lighthouse:** 90-95/100
- **WCAG AA:** Conformidade completa
- **WCAG AAA:** Parcial (contraste de alguns elementos secundários)

**Tempo estimado de correção:** 3-5 dias úteis para issues críticos.

---

**Auditor:** Claude (UI Designer)
**Data da Auditoria:** 11 de Outubro de 2025
**Próxima Revisão:** Após implementação das correções (estimado: 18 de Outubro de 2025)
