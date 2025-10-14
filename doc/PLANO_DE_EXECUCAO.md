# PLANO DE EXECUÇÃO - ComunidadeFlix
## Redesign Completo + Novas Funcionalidades

**Versão:** 1.0
**Data de Criação:** 2025-10-10
**Status:** Planejamento Estratégico
**Gerente:** Agent Project Manager + Agent Organizer

---

## 📋 SUMÁRIO EXECUTIVO

### Contexto
O ComunidadeFlix atingiu um **MVP funcional completo**, mas enfrenta dois desafios críticos:
1. **Design atual inadequado** - Interface genérica sem identidade visual forte
2. **Funcionalidades de engajamento ausentes** - Falta tracking de progresso, favoritos e histórico

### Objetivo do Plano
Este documento integra **redesign completo** (DESIGN_PRD.md) com **novas funcionalidades** (ROADMAP.md) em um plano de execução único, sequenciado e viável.

### Estratégia de Execução
Dividir o trabalho em **8 fases paralelas e sequenciais**, equilibrando:
- **Design**: Landing Page → Painel Admin → Experiência de Login → Design Interno
- **Desenvolvimento**: Funcionalidades de engajamento → Otimizações → Testes
- **Infraestrutura**: Back-end → Banco de Dados → Integração Firebase

---

## 🎯 VISÃO GERAL DAS FASES

```
SEQUÊNCIA DE EXECUÇÃO:
├── FASE 1: Home Page (Landing Page) + Fundação Design System
├── FASE 2: Painel Administrativo (Redesign)
├── FASE 3: Experiência de Login + Onboarding
├── FASE 4: Design Interno da Plataforma
├── FASE 5: Funcionalidades de Engajamento (Progresso, Favoritos, Histórico)
├── FASE 6: Back-end + Banco de Dados
├── FASE 7: Integração Firebase Studio + Deploy
└── FASE 8: Otimização e Testes (QA Final)
```

**Esforço Estimado:** 320-400 horas

---

## 📊 FASE 1: HOME PAGE (LANDING PAGE) + FUNDAÇÃO DESIGN SYSTEM

**Esforço:** 60-70 horas
**Prioridade:** CRÍTICA
**Equipe:** Frontend Developer + UI Designer
**Dependências:** Nenhuma (fase inicial)

### Objetivos
1. Criar landing page de conversão profissional
2. Estabelecer design system base (cores, tipografia, tokens)
3. Integrar componente Digital Serenity com animações

### Entregas

#### 1.1 Fundação do Design System
**Tarefas:**
- [ ] Criar `/styles/tokens.css` com paleta verde + dark mode completa
  - Background: `#0F1419` (dark blue-gray)
  - Primary Green: `#00C896` (teal, acessível WCAG AAA)
  - Grays completos para hierarquia
- [ ] Criar `/styles/typography.css` com fonte Inter (Google Fonts)
  - Escala tipográfica: Display XL (72px) → Caption (12px)
  - Line-heights responsivos
- [ ] Criar `/styles/animations.css` com keyframes base
  - Fade In, Slide Up, Scale In, Shimmer
  - Easing curves e durações padronizadas
- [ ] Atualizar `globals.css` incluindo todos os tokens

**Critérios de Aceite:**
- [ ] Todas as cores validadas WCAG AA (contraste mínimo 4.5:1)
- [ ] Tipografia responsiva funcional (mobile → desktop)
- [ ] Tokens acessíveis via CSS variables

#### 1.2 Componentes Base
**Tarefas:**
- [ ] Criar `/components/ui/Button.tsx` (5 variantes)
  - Primary, Secondary, Outline, Ghost, Danger
  - 3 tamanhos (sm, md, lg)
  - Estados: hover, active, disabled, loading
- [ ] Criar `/components/ui/Input.tsx` com validação
  - Text, Email, Password, Number, Textarea
  - Focus state com border verde + box-shadow
- [ ] Criar `/components/ui/Card.tsx` (4 variantes)
  - Default, Elevated, Outlined, Interactive
  - Hover: scale 1.05 + border verde

**Critérios de Aceite:**
- [ ] Componentes funcionam em todas as breakpoints
- [ ] Acessibilidade ARIA implementada
- [ ] TypeScript props completos

#### 1.3 Landing Page

**Estrutura da Landing Page:**

**Seção 1: Hero Section**
- Background: Componente Digital Serenity (animação imersiva)
- Headline: "Transforme Conhecimento em Crescimento"
- Subheadline: "A plataforma premium de cursos em vídeo para comunidades"
- CTAs: "Começar Agora" (primary) + "Ver Demo" (secondary)
- Social Proof: "+5.000 membros aprendendo"

**Seção 2: Features Showcase**
- Título: "Tudo que Você Precisa em Um Só Lugar"
- Grid 3 Colunas:
  1. Cursos em Vídeo (ícone play + screenshot player)
  2. Comunidade Ativa (ícone chat + screenshot feed)
  3. Progresso Personalizado (ícone chart + screenshot)
- Cards elevados com hover effect

**Seção 3: Social Proof (Depoimentos)**
- Carrossel de depoimentos
- Foto circular (64px) + Nome + Depoimento + Rating (5 estrelas)
- Background: bg-tertiary

**Seção 4: Pricing/CTA Final**
- Headline: "Comece Sua Jornada de Crescimento Hoje"
- Card de pricing centralizado (max-width 500px)
- Lista de benefícios (checkmarks verdes)
- CTA: "Criar Conta Grátis"

**Seção 5: Footer**
- Logo + links (Produto, Empresa, Legal)
- Social media icons
- Copyright

**Tarefas:**
- [ ] Integrar componente Digital Serenity (6h)
- [ ] Criar Hero Section (4h)
- [ ] Criar Features Showcase (5h)
- [ ] Criar carrossel de depoimentos (4h)
- [ ] Criar seção Pricing/CTA (3h)
- [ ] Criar Footer completo (2h)
- [ ] Escrever copy definitivo (2h)
- [ ] Otimizar SEO (meta tags, structured data) (2h)

**Critérios de Aceite:**
- [ ] Responsive em mobile/tablet/desktop
- [ ] Animações suaves (60fps)
- [ ] CTAs óbvios e funcionais
- [ ] Lighthouse Performance > 90
- [ ] Tempo de carregamento < 2s

### Riscos e Mitigações

**Risco 1:** Componente Digital Serenity pode não ser fornecido
- **Mitigação:** Criar fallback com gradiente animado CSS
- **Impacto:** Médio

**Risco 2:** Performance de animações pode ser baixa
- **Mitigação:** Lazy load, intersection observer, optimize bundle
- **Impacto:** Médio

### Recursos Necessários
- **Frontend Developer:** 60h
- **UI Designer:** 10h (review de mockups)
- **Copywriter (opcional):** 5h (headlines e CTAs)

---

## 🎨 FASE 2: PAINEL ADMINISTRATIVO (REDESIGN)

**Esforço:** 40-50 horas
**Prioridade:** ALTA
**Dependências:** Fase 1 completa (design system necessário)

### Objetivos
1. Reestruturar completamente o design do painel admin
2. Melhorar usabilidade e organização visual
3. Aplicar design system consistentemente

### Entregas

#### 2.1 Dashboard Admin
**Tarefas:**
- [ ] Redesign `/app/admin/page.tsx`
  - Cards com métricas (total cursos, vídeos, usuários, posts)
  - Gráficos simples (opcional: Chart.js)
  - Ações rápidas (botões grandes: Criar Curso, Upload Vídeo)
- [ ] Sidebar de navegação (desktop) / Bottom nav (mobile)
  - Links: Dashboard, Cursos, Vídeos, Posts, Usuários
  - Ícones + labels
  - Link ativo com underline verde
- [ ] Header fixo com user menu
  - Avatar + nome do admin
  - Dropdown: Perfil, Configurações, Logout

**Critérios de Aceite:**
- [ ] Navegação intuitiva e óbvia
- [ ] Métricas atualizadas em tempo real
- [ ] Responsive (sidebar vira bottom nav em mobile)

#### 2.2 Gerenciamento de Cursos
**Tarefas:**
- [ ] Redesign `/app/admin/courses/page.tsx`
  - Tabela/Grid de cursos com filtros
  - Botão "Criar Novo Curso" destacado
  - Ações por curso: Editar, Deletar, Ver Vídeos
- [ ] Redesign `/app/admin/courses/edit/[id]/page.tsx`
  - Form estruturado: Título, Descrição, Categoria
  - Upload de capa com preview
  - Botões: Salvar, Cancelar, Deletar
- [ ] Modal de confirmação para delete
  - Texto: "Tem certeza? Ação irreversível"
  - Botões: Cancelar (ghost), Deletar (danger)

**Critérios de Aceite:**
- [ ] Form validation visual
- [ ] Loading states nos botões
- [ ] Toast notifications de sucesso/erro

#### 2.3 Gerenciamento de Vídeos, Posts e Usuários
**Tarefas:**
- [ ] Redesign `/app/admin/videos/page.tsx`
  - Lista de vídeos agrupados por curso
  - Upload com drag-and-drop
  - Progress bar de upload
- [ ] Redesign `/app/admin/posts/page.tsx`
  - Feed de posts moderáveis
  - Botão "Deletar" com confirmação
- [ ] Redesign `/app/admin/users/page.tsx`
  - Tabela de usuários com busca
  - Colunas: Nome, Email, Data Cadastro, Role
  - Paginação (20 por página)

**Critérios de Aceite:**
- [ ] Todas as páginas seguem design system
- [ ] Animações consistentes
- [ ] Estados vazios bem projetados ("Nenhum vídeo ainda...")

### Recursos Necessários
- **Frontend Developer:** 45h
- **UI Designer:** 5h (review)

---

## 🔐 FASE 3: EXPERIÊNCIA DE LOGIN + ONBOARDING

**Esforço:** 25-30 horas
**Prioridade:** ALTA
**Dependências:** Fase 1 completa (design system necessário)

### Objetivos
1. Otimizar jornada de login/cadastro
2. Criar experiência de onboarding para novos usuários
3. Melhorar feedback visual e mensagens de erro

### Entregas

#### 3.1 Redesign Login/Signup
**Tarefas:**
- [ ] Redesign `/app/login/page.tsx`
  - Background: Digital Serenity (consistência com landing)
  - Form centralizado (max-width 400px)
  - Input com ícones (email, password)
  - Botão "Entrar" (verde, full-width, 48px altura)
  - Link "Esqueceu senha?" abaixo do form
  - Link "Não tem conta? Cadastre-se" destacado
- [ ] Redesign `/app/signup/page.tsx`
  - Form similar ao login
  - Campos: Nome, Email, Senha, Confirmar Senha
  - Password strength indicator (barra de progresso)
  - Checkbox "Aceito os termos" (obrigatório)
- [ ] Implementar social login (Google, Apple)
  - Botões separados com ícones oficiais
  - Firebase Authentication integration

**Critérios de Aceite:**
- [ ] Validação de form em tempo real
- [ ] Mensagens de erro humanizadas ("Email inválido" → "Ops, esse email não parece correto")
- [ ] Loading state visual ao submeter
- [ ] Success feedback antes de redirect

#### 3.2 Onboarding (Novos Usuários)
**Tarefas:**
- [ ] Criar `/app/onboarding/page.tsx`
  - 3 telas de introdução (slides)
  - Tela 1: "Bem-vindo ao ComunidadeFlix"
  - Tela 2: "Explore Cursos Incríveis"
  - Tela 3: "Acompanhe Seu Progresso"
  - Botão "Avançar" / "Pular Introdução"
- [ ] Tour guiado na homepage (primeira visita)
  - Biblioteca: react-joyride
  - Tooltips: "Aqui você encontra cursos", "Veja seu progresso aqui"
  - 5 steps máximo
  - Botão "Próximo" / "Concluir Tour"

**Critérios de Aceite:**
- [ ] Onboarding aparece apenas na primeira visita
- [ ] Cookie/localStorage para não repetir
- [ ] Tour pode ser pulado a qualquer momento

### Recursos Necessários
- **Frontend Developer:** 28h
- **UX Writer:** 3h (mensagens e microcopy)

---

## 🎨 FASE 4: DESIGN INTERNO DA PLATAFORMA

**Esforço:** 50-60 horas
**Prioridade:** ALTA
**Dependências:** Fases 1, 2 e 3 completas

### Objetivos
1. Aplicar design system em TODAS as páginas internas
2. Redesenhar componentes principais (Navbar, Course Card, Player)
3. Garantir consistência visual em 100% da plataforma

### Entregas

#### 4.1 Componentes Globais 
**Tarefas:**
- [ ] Refatorar `/components/Navbar.tsx`
  - Background blur effect no scroll
  - Links com underline verde no ativo
  - User menu com dropdown
  - Logo à esquerda, links centro, user menu direita
  - Mobile: Hamburger menu → Drawer lateral
- [ ] Criar `/components/ui/CourseCard.tsx` standalone
  - Imagem 16:9 ratio
  - Título (2 linhas max, ellipsis)
  - Metadata (duração, nº vídeos)
  - Progress bar (se usuário já começou)
  - Hover: scale 1.05 + play button overlay
- [ ] Refatorar `/components/CourseCarousel.tsx`
  - Usar novo CourseCard
  - Drag to scroll
  - Botões prev/next estilizados
  - 4 cards desktop, 2 tablet, 1 mobile

**Critérios de Aceite:**
- [ ] Navbar fixa no topo com blur
- [ ] CourseCard reutilizável em qualquer lugar
- [ ] Carrossel com scroll snap suave

#### 4.2 Páginas Internas (Semana 1 - Dias 4-5 + Semana 2 - Dias 6-8)
**Tarefas:**
- [ ] Redesign `/app/page.tsx` (Homepage)
  - Hero banner: "Bem-vindo, [Nome]!"
  - Seção "Continuar Assistindo" (será implementado na Fase 5)
  - Seção "Cursos em Alta" (carrossel)
  - Seção "Novos Cursos" (carrossel)
  - Empty state amigável se não há cursos
- [ ] Redesign `/app/course/[id]/page.tsx`
  - Layout: 70% player / 30% playlist (desktop)
  - Layout: 100% player, playlist abaixo (mobile)
  - Breadcrumb: Home > Curso > Vídeo Atual
  - Progresso do curso: "X de Y vídeos completos" (Fase 5)
  - Player com controles customizados
  - Playlist: Checkmarks verdes em vídeos completos
- [ ] Redesign `/app/feed/page.tsx`
  - Card de criar post fixo no topo
  - Posts: Card style, spacing 16px
  - Avatar circular (40px)
  - Timestamp relativo ("2h atrás")
  - Likes: Coração outline → filled (animação bounce)
- [ ] Redesign `/app/chat/page.tsx`
  - Layout clássico: Header + mensagens + input
  - Message bubbles alternados
  - Minhas mensagens: direita, bg verde
  - Outras mensagens: esquerda, bg-secondary
  - Input: Fixed bottom, auto-expand até 3 linhas

**Critérios de Aceite:**
- [ ] Todas as páginas responsivas
- [ ] Design consistente com design system
- [ ] Transições de página suaves
- [ ] Estados vazios bem projetados

#### 4.3 Player de Vídeo Customizado 
**Tarefas:**
- [ ] Criar `/components/VideoPlayer.tsx`
  - Controles customizados:
    - Play/Pause, Volume, Timeline scrubbing
    - Fullscreen, Playback speed (0.5x, 1x, 1.5x, 2x)
    - Keyboard shortcuts (Space, F, M, arrows)
  - Auto-hide controles após 3s de inatividade
  - Tracking de progresso (integração Fase 5)
  - Picture-in-Picture support

**Critérios de Aceite:**
- [ ] Controles funcionais em desktop e mobile
- [ ] Tracking de progresso salvo a cada 5s (Fase 5)
- [ ] Marca como completo aos 95%

### Recursos Necessários
- **Frontend Developer:** 55h
- **UI Designer:** 8h (review de páginas)

---

## 🚀 FASE 5: FUNCIONALIDADES DE ENGAJAMENTO

**Esforço:** 60-80 horas
**Prioridade:** CRÍTICA
**Dependências:** Fase 4 completa (design interno aplicado)

### Objetivos
1. Implementar sistema de progresso do aluno
2. Criar área "Meus Favoritos"
3. Implementar histórico de visualizações

### Entregas

#### 5.1 Sistema de Progresso do Aluno 

**Modelo de Dados (Firestore):**
```javascript
userProgress/
├── {userId}/
│   └── courses/
│       └── {courseId}/
│           ├── videos/
│           │   └── {videoId}/
│           │       ├── completed: boolean
│           │       ├── watchedTime: number (segundos)
│           │       ├── lastWatched: timestamp
│           │       └── completedAt: timestamp | null
│           ├── overallProgress: number (%)
│           ├── completedVideos: number
│           ├── totalVideos: number
│           └── startedAt: timestamp
```

**Tarefas:**
- [ ] Criar modelo de dados no Firestore (1h)
- [ ] Implementar `/hooks/useVideoProgress.ts` (3h)
  - Função: trackProgress(videoId, time)
  - Função: markCompleted(videoId)
  - Função: getProgress(courseId)
- [ ] Criar `/components/ui/ProgressBar.tsx` (2h)
  - Props: value (0-100), color, size
  - Visual: Barra verde com animação suave
- [ ] Modificar VideoPlayer para trackear tempo (4h)
  - Debounce de 5s para salvar progresso
  - Batch writes no Firestore
- [ ] Implementar lógica de marcação como concluído (2h)
  - Automático aos 95% do vídeo
  - Manual via botão "Marcar como Concluído"
- [ ] Adicionar barra de progresso nos CourseCards (3h)
  - Exibir "X% completo" abaixo do título
  - Barra visual no card
- [ ] Criar seção "Continuar Assistindo" na homepage (4h)
  - Query: cursos com progresso > 0 e < 100
  - Ordenar por lastWatched
  - Carrossel com últimos 10 cursos
- [ ] Testes manuais e ajustes (3h)

**Critérios de Aceite:**
- [ ] Usuário vê progresso (%) em cada vídeo
- [ ] Vídeos concluídos exibem badge de conclusão
- [ ] Homepage mostra "Continuar Assistindo"
- [ ] Progresso persiste entre sessões
- [ ] Performance não impactada (debounce)

#### 5.2 Área "Meus Favoritos" 

**Modelo de Dados (Firestore):**
```javascript
userFavorites/
├── {userId}/
│   └── courses/
│       └── {courseId}/
│           ├── addedAt: timestamp
│           └── courseData: {
│               title: string,
│               coverUrl: string
│             }
```

**Tarefas:**
- [ ] Criar modelo de dados no Firestore (30min)
- [ ] Implementar `/hooks/useFavorites.ts` (2h)
  - Função: addFavorite(courseId)
  - Função: removeFavorite(courseId)
  - Função: getFavorites()
  - Função: isFavorite(courseId)
- [ ] Criar `/components/ui/FavoriteButton.tsx` (2h)
  - Ícone: Coração outline/filled
  - Animação: Bounce ao adicionar
  - Toast notification: "Adicionado aos favoritos"
- [ ] Criar `/app/favorites/page.tsx` (3h)
  - Grid de cursos favoritos
  - Empty state: "Nenhum favorito ainda. Comece a favoritar cursos!"
  - Ordenar por data (mais recente primeiro)
- [ ] Adicionar botão de favorito na página de curso (1h)
  - Posição: Abaixo do título, ao lado do botão "Assistir"
- [ ] Adicionar ícone de favorito nos CourseCards (1h)
  - Canto superior direito do card
  - Visível apenas no hover (desktop)
- [ ] Adicionar link "Meus Favoritos" na Navbar (30min)
- [ ] Testes manuais e ajustes (2h)

**Critérios de Aceite:**
- [ ] Usuário adiciona/remove favoritos facilmente
- [ ] Ícone de coração muda de estado instantaneamente
- [ ] Página `/favorites` exibe todos os favoritos
- [ ] Notificação visual ao favoritar
- [ ] Link na navbar funcional

#### 5.3 Histórico de Visualizações 

**Modelo de Dados (Firestore):**
```javascript
viewHistory/
├── {userId}/
│   └── items/
│       └── {historyId}/
│           ├── courseId: string
│           ├── videoId: string | null
│           ├── viewedAt: timestamp
│           ├── courseData: {
│           │   title: string,
│           │   coverUrl: string
│           │ }
│           └── duration: number (tempo assistido)
```

**Tarefas:**
- [ ] Criar modelo de dados no Firestore (30min)
- [ ] Implementar `/hooks/useViewHistory.ts` (2h)
  - Função: addToHistory(courseId, videoId, duration)
  - Função: getHistory(limit)
  - Função: clearHistory()
- [ ] Criar `/components/HistoryCard.tsx` (2h)
  - Card com capa + título + timestamp
  - "Assistido há 2 horas"
- [ ] Criar `/app/history/page.tsx` (3h)
  - Lista de histórico com paginação
  - 20 itens por página
  - Botão "Carregar Mais"
  - Botão "Limpar Histórico" (com confirmação)
- [ ] Implementar registro automático de visualização (2h)
  - Trigger ao clicar em curso
  - Salvar no Firestore com debounce
- [ ] Criar seção "Vistos Recentemente" na homepage (2h)
  - Carrossel com últimos 10 cursos
  - Abaixo de "Continuar Assistindo"
- [ ] Adicionar link "Histórico" na Navbar (30min)
- [ ] Testes manuais e ajustes (2h)

**Critérios de Aceite:**
- [ ] Visualizações registradas automaticamente
- [ ] Página `/history` funcional com paginação
- [ ] Itens ordenados por data (mais recente)
- [ ] Usuário pode limpar histórico
- [ ] Seção "Vistos Recentemente" na homepage

### Recursos Necessários
- **Frontend Developer:** 70h
- **Backend (Firebase):** Configuração de índices (2h)
- **QA Tester:** 10h (testes manuais)

---

## 🗄️ FASE 6: BACK-END + BANCO DE DADOS

**Esforço:** 35-45 horas
**Prioridade:** ALTA
**Dependências:** Pode iniciar em paralelo com Fase 5

### Objetivos
1. Estruturar banco de dados completo no Firestore
2. Criar APIs de backend necessárias
3. Otimizar queries e índices

### Entregas

#### 6.1 Modelagem de Dados Completa 
**Tarefas:**
- [ ] Documentar estrutura completa do Firestore
  - Collections: users, courses, videos, posts, chat, userProgress, userFavorites, viewHistory
  - Subcollections e relacionamentos
  - Campos obrigatórios e opcionais
- [ ] Criar índices compostos no Firebase Console
  - userProgress: orderBy lastWatched + where completed == false
  - viewHistory: orderBy viewedAt desc
  - favorites: orderBy addedAt desc
- [ ] Definir Security Rules
  - Usuários só podem ler/escrever seus próprios dados
  - Admins podem ler/escrever tudo
  - Validação de tipos de dados

**Critérios de Aceite:**
- [ ] Documentação completa em `/doc/DATABASE_SCHEMA.md`
- [ ] Índices criados no Firestore
- [ ] Security Rules validadas e deployed

#### 6.2 APIs de Backend 
**Tarefas:**
- [ ] Criar `/app/api/progress/route.ts`
  - GET: Retornar progresso de curso
  - POST: Salvar progresso de vídeo
  - PUT: Marcar vídeo como completo
- [ ] Criar `/app/api/favorites/route.ts`
  - GET: Listar favoritos do usuário
  - POST: Adicionar favorito
  - DELETE: Remover favorito
- [ ] Criar `/app/api/history/route.ts`
  - GET: Listar histórico com paginação
  - POST: Adicionar item ao histórico
  - DELETE: Limpar histórico
- [ ] Refatorar `/app/api/users/route.ts`
  - Adicionar paginação
  - Adicionar busca por nome/email
  - Otimizar query

**Critérios de Aceite:**
- [ ] Todas as APIs retornam JSON estruturado
- [ ] Erro handling consistente
- [ ] Autenticação verificada em todas as rotas
- [ ] Rate limiting básico implementado

#### 6.3 Otimização de Queries 
**Tarefas:**
- [ ] Implementar cache local com React Query
  - Cache de 5min para listas de cursos
  - Invalidação ao criar/editar curso
- [ ] Otimizar queries Firestore
  - Usar `limit()` em todas as queries
  - Implementar paginação cursor-based
  - Evitar reads desnecessários
- [ ] Implementar batch operations
  - Batch writes para progresso de vídeo
  - Batch deletes para limpar histórico
- [ ] Monitoramento de uso
  - Firebase Console: reads/writes por dia
  - Alertas se atingir 80% da quota

**Critérios de Aceite:**
- [ ] Cache funcionando (redução de 50% em reads)
- [ ] Paginação em todas as listas grandes
- [ ] Batch operations implementadas
- [ ] Monitoramento ativo

### Recursos Necessários
- **Backend Developer:** 40h
- **DBA/Firebase Specialist:** 5h (otimização)

---

## ☁️ FASE 7: INTEGRAÇÃO FIREBASE STUDIO + DEPLOY

**Esforço:** 25-30 horas
**Prioridade:** ALTA
**Dependências:** Fases 1-6 completas

### Objetivos
1. Configurar ambiente de produção no Firebase Studio
2. Migrar dados de desenvolvimento para produção
3. Deploy automatizado

### Entregas

#### 7.1 Configuração de Ambientes 
**Tarefas:**
- [ ] Criar projeto Firebase de produção
  - Nome: "comunidadeflix-prod"
  - Região: us-central1
- [ ] Configurar Firebase Hosting
  - Domínio customizado (se houver)
  - SSL automático
  - CDN configurado
- [ ] Configurar variáveis de ambiente
  - `.env.production` com credenciais de prod
  - Atualizar Next.js config
- [ ] Configurar Firebase Storage
  - Buckets separados: videos, images, avatars
  - CORS configurado
  - Lifecycle rules (auto-delete após X dias)

**Critérios de Aceite:**
- [ ] Projeto de produção criado
- [ ] Hosting configurado
- [ ] Variáveis de ambiente seguras
- [ ] Storage organizado

#### 7.2 Migração de Dados 
**Tarefas:**
- [ ] Exportar dados de desenvolvimento
  - Firestore: gcloud firestore export
  - Storage: gsutil rsync
- [ ] Importar dados para produção
  - Validar integridade dos dados
  - Testar queries principais
- [ ] Criar dados de seed para staging
  - 10 cursos de exemplo
  - 50 vídeos
  - 100 usuários de teste
- [ ] Backup automático configurado
  - Daily backup do Firestore
  - Retenção de 30 dias

**Critérios de Aceite:**
- [ ] Dados migrados sem perda
- [ ] Staging environment funcional
- [ ] Backup configurado

#### 7.3 Deploy e Validação
**Tarefas:**
- [ ] Deploy inicial para produção
  ```bash
  npm run build
  firebase deploy --only hosting
  ```
- [ ] Validar todas as funcionalidades
  - Login/Signup
  - Criação de curso
  - Upload de vídeo
  - Tracking de progresso
  - Favoritos e histórico
- [ ] Configurar monitoramento
  - Firebase Performance Monitoring
  - Firebase Analytics
  - Sentry para error tracking (opcional)
- [ ] Configurar alertas
  - Email se uptime < 99%
  - Slack notification em erros críticos

**Critérios de Aceite:**
- [ ] Deploy bem-sucedido
- [ ] Todas as funcionalidades testadas
- [ ] Monitoramento ativo
- [ ] Alertas configurados

### Recursos Necessários
- **DevOps Engineer:** 25h
- **QA Tester:** 8h (validação de produção)

---

## ✅ FASE 8: OTIMIZAÇÃO E TESTES (QA FINAL)

**Esforço:** 40-50 horas
**Prioridade:** CRÍTICA
**Dependências:** Fase 7 completa (deploy realizado)

### Objetivos
1. Garantir qualidade em produção
2. Otimizar performance (Lighthouse > 90)
3. Implementar testes automatizados

### Entregas

#### 8.1 Auditoria de Acessibilidade e Performance 
**Tarefas:**
- [ ] Auditoria Lighthouse em todas as páginas
  - Performance, Accessibility, Best Practices, SEO
  - Corrigir issues críticos (score < 80)
- [ ] Auditoria com axe DevTools
  - Contraste de cores
  - Navegação por teclado
  - ARIA labels
  - Foco visível
- [ ] Testar com leitor de tela
  - NVDA (Windows) ou VoiceOver (Mac)
  - Validar todas as páginas principais
- [ ] Otimizações de performance
  - Code splitting por rota
  - Lazy loading de componentes pesados
  - Otimização de imagens (next/image)
  - Minificação de CSS/JS

**Critérios de Aceite:**
- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 95
- [ ] Zero erros críticos de acessibilidade
- [ ] Navegação por teclado funcional

#### 8.2 Testes Automatizados 
**Tarefas:**
- [ ] Configurar Jest + React Testing Library (2h)
- [ ] Escrever testes unitários (12h)
  - Componentes: Button, Input, Card, CourseCard
  - Hooks: useVideoProgress, useFavorites, useViewHistory
  - Utilitários: formatters, validators
- [ ] Configurar Playwright (2h)
- [ ] Escrever testes E2E (10h)
  - Fluxo de autenticação (signup → login → logout)
  - Fluxo de visualização (home → curso → player)
  - Fluxo de favorito (adicionar → visualizar → remover)
  - Fluxo de progresso (assistir vídeo → salvar progresso)
- [ ] Configurar coverage reports (1h)
  - Meta: 80% de cobertura

**Critérios de Aceite:**
- [ ] Cobertura de testes > 80%
- [ ] Todos os testes passando
- [ ] Testes E2E cobrindo fluxos principais
- [ ] Coverage report gerado automaticamente

#### 8.3 QA Manual e Ajustes 
**Tarefas:**
- [ ] Testes manuais em múltiplos dispositivos
  - Desktop: Chrome, Firefox, Safari
  - Mobile: iOS Safari, Android Chrome
  - Tablet: iPad, Android tablets
- [ ] Testes de usabilidade
  - 5 usuários beta testam a plataforma
  - Coletar feedback qualitativo
  - Identificar pain points
- [ ] Ajustes finais baseados em feedback
  - Corrigir bugs encontrados
  - Melhorar microcopy confuso
  - Ajustar animações se necessário
- [ ] Documentação final
  - Atualizar `/doc/relatorio.md`
  - Criar `/doc/USER_GUIDE.md`
  - Atualizar changelog

**Critérios de Aceite:**
- [ ] Zero bugs críticos
- [ ] Feedback de usuários positivo (>80%)
- [ ] Documentação atualizada
- [ ] Changelog completo

### Recursos Necessários
- **QA Engineer:** 30h
- **Frontend Developer:** 20h (correções)
- **UX Researcher (opcional):** 5h (testes de usabilidade)

---

## 📊 SEQUÊNCIA E MARCOS

### Visão Geral da Execução

```
BLOCO 1 - FUNDAÇÃO DO DESIGN:
├── FASE 1: Landing Page + Design System (60-70h)
├── FASE 2: Painel Administrativo (40-50h)
└── FASE 3: Login + Onboarding (25-30h)

BLOCO 2 - APLICAÇÃO E FEATURES:
├── FASE 4: Design Interno (50-60h)
├── FASE 5: Funcionalidades de Engajamento (60-80h)
└── FASE 6: Back-end + Banco de Dados (35-45h) [paralelo com Fase 5]

BLOCO 3 - DEPLOY E QUALIDADE:
├── FASE 7: Firebase Studio + Deploy (25-30h)
└── FASE 8: Otimização e Testes (40-50h)
```

**Total Estimado:** 320-400 horas de trabalho

### Marcos (Milestones)

**M1: Design System Completo**
- Landing page no ar
- Design system estabelecido
- Painel admin redesenhado
- Login otimizado

**M2: Funcionalidades de Engajamento**
- Progresso do aluno funcional
- Favoritos implementados
- Histórico completo
- Design interno 100% aplicado

**M3: Produção Estável**
- Deploy em produção
- Testes automatizados (80% coverage)
- Performance > 90 (Lighthouse)
- Zero bugs críticos

---

## 🔀 DEPENDÊNCIAS ENTRE FASES

### Diagrama de Dependências

```
FASE 1 (Landing Page + Design System)
    |
    ├──> FASE 2 (Painel Admin) [DEPENDE]
    |       |
    |       └──> FASE 4 (Design Interno) [DEPENDE]
    |
    └──> FASE 3 (Login + Onboarding) [DEPENDE]
            |
            └──> FASE 4 (Design Interno) [DEPENDE]
                    |
                    ├──> FASE 5 (Engajamento) [DEPENDE]
                    |       |
                    |       └──> FASE 7 (Deploy) [DEPENDE]
                    |
                    └──> FASE 6 (Back-end + BD) [PARALELO]
                            |
                            └──> FASE 7 (Deploy) [DEPENDE]
                                    |
                                    └──> FASE 8 (QA Final) [DEPENDE]
```

### Fases que Podem Ser Paralelas

**Possível Paralelismo:**
- FASE 4 (Design Interno) + FASE 6 (Back-end) → podem iniciar juntas
- FASE 5 (Engajamento) pode começar durante FASE 4

**Bloqueios Críticos:**
- FASE 1 bloqueia FASE 2 e 3 (design system necessário)
- FASE 4 bloqueia FASE 5 (design precisa estar pronto)
- FASE 5 e 6 bloqueiam FASE 7 (funcionalidades prontas antes de deploy)
- FASE 7 bloqueia FASE 8 (QA em produção)

---

## 💰 RECURSOS NECESSÁRIOS

### Recursos Humanos (Total)

**Frontend Developer:**
- FASE 1: 60h
- FASE 2: 45h
- FASE 3: 28h
- FASE 4: 55h
- FASE 5: 70h
- FASE 8: 20h (correções)
- **TOTAL:** 278 horas (~7 semanas full-time)

**Backend Developer:**
- FASE 6: 40h
- **TOTAL:** 40 horas (~1 semana full-time)

**DevOps Engineer:**
- FASE 7: 25h
- **TOTAL:** 25 horas (~0.6 semanas full-time)

**UI Designer:**
- FASE 1: 10h
- FASE 2: 5h
- FASE 4: 8h
- **TOTAL:** 23 horas (~0.6 semanas part-time)

**QA Engineer:**
- FASE 5: 10h
- FASE 7: 8h
- FASE 8: 30h
- **TOTAL:** 48 horas (~1.2 semanas full-time)

**Outros:**
- UX Writer: 3h (Fase 3)
- Copywriter: 5h (Fase 1)
- UX Researcher: 5h (Fase 8)

**TOTAL GERAL:** ~420 horas (~10.5 semanas de uma pessoa full-time)

### Recursos Financeiros Estimados

**Serviços e Ferramentas:**

1. **Firebase (Produção):**
   - Blaze Plan (pay-as-you-go)
   - Estimativa: $100-150/mês

2. **Ferramentas de Teste:**
   - Jest + React Testing Library (grátis)
   - Playwright (grátis)
   - Lighthouse CI (grátis)
   - Total: $0/mês

3. **Monitoramento (Opcional):**
   - Sentry (grátis até 5k eventos/mês)
   - Total: $0/mês

4. **Design:**
   - Figma (grátis ou $12/mês)
   - Total: $0-12/mês

**CUSTO TOTAL ESTIMADO (Mensal após deploy):** $100-162/mês

---

## 🎯 MÉTRICAS DE SUCESSO

### KPIs por Fase

**Após FASE 1:**
- Landing page no ar
- Lighthouse Performance > 85
- Taxa de conversão landing → signup: baseline definida

**Após FASE 4:**
- 100% das páginas seguindo design system
- Lighthouse Performance > 85 em todas as páginas
- Zero inconsistências visuais

**Após FASE 5:**
- Taxa de retorno semanal > 60%
- Tempo médio na plataforma > 15min/sessão
- Taxa de conclusão de cursos > 40%
- Favoritos por usuário > 3

**Após FASE 8 (FINAL):**
- Lighthouse Performance > 90
- Lighthouse Accessibility > 95
- Cobertura de testes > 80%
- Uptime > 99.5%
- Zero bugs críticos em produção
- NPS > 50

---

## ⚠️ GESTÃO DE RISCOS

Para análise detalhada de riscos críticos, estratégias de mitigação e planos de contingência, consulte:

**→ [`/doc/RISCOS_CRITICOS.md`](./RISCOS_CRITICOS.md)**

### Resumo dos Principais Riscos

**Riscos de Alto Impacto:**
1. **Atraso na Fase 1** - Bloqueia todas as fases subsequentes
2. **Performance do Firestore** - Pode impactar experiência do usuário
3. **Bugs Pré-Testes** - Alta probabilidade nas fases iniciais
4. **Integração Digital Serenity** - Componente externo crítico

**Riscos Operacionais:**
5. **Mudança de Escopo** - Alta probabilidade durante execução
6. **Dependência de Desenvolvedor Único** - Risco de continuidade

**Matriz de Risco:**
```
IMPACTO vs PROBABILIDADE

CRÍTICO  | [R1]      | [R6]      |
ALTO     | [R2]      |           |
MÉDIO    | [R3, R4]  | [R5]      |
         | Baixa     | Média     | Alta
```

**Ações Imediatas:**
- [ ] Revisar documento RISCOS_CRITICOS.md antes de iniciar cada fase
- [ ] Implementar planos de mitigação da Fase 1 imediatamente
- [ ] Configurar alertas de monitoramento de riscos
- [ ] Agendar revisão semanal de riscos com equipe

---

## 📝 PRÓXIMOS PASSOS IMEDIATOS

### Etapa 1: Preparação

**Ações Iniciais:**
- [ ] Apresentar este plano para stakeholders
- [ ] Obter aprovação final
- [ ] Alocar recursos (desenvolvedor, designer)
- [ ] Configurar ambiente de desenvolvimento
- [ ] Criar branch `feature/redesign-complete` no Git

### Etapa 2: Início da Fase 1

**Prioridade Máxima:**
- [ ] Criar `/styles/tokens.css` (PRIORIDADE 1)
- [ ] Criar `/styles/typography.css`
- [ ] Importar fonte Inter
- [ ] Criar componente Button (MVP mínimo)
- [ ] Validar cores WCAG AA

**Sequência Seguinte:**
- [ ] Completar componentes base (Input, Card)
- [ ] Integrar Digital Serenity
- [ ] Começar Hero Section da landing page

---

## 📚 DOCUMENTAÇÃO RELACIONADA

Este plano integra e referencia:

- **[`/doc/PRD.md`](./PRD.md)** - Product Requirements Document
- **[`/doc/DESIGN_PRD.md`](./DESIGN_PRD.md)** - Design PRD Completo
- **[`/doc/ROADMAP.md`](./ROADMAP.md)** - Roadmap de Funcionalidades
- **[`/doc/RISCOS_CRITICOS.md`](./RISCOS_CRITICOS.md)** - Análise de Riscos (NOVO)
- **[`/doc/blueprint.md`](./blueprint.md)** - Planejamento Original
- **[`/doc/relatorio.md`](./relatorio.md)** - Status Atual
- **[`/doc/AI_AGENT_GUIDE.md`](./AI_AGENT_GUIDE.md)** - Guia Técnico

---

## ✍️ HISTÓRICO DE VERSÕES

| Versão | Data       | Autor              | Alterações                                      |
|--------|------------|--------------------|-------------------------------------------------|
| 1.0    | 2025-10-10 | project-manager    | Criação inicial do plano                        |
| 1.1    | 2025-10-10 | project-manager    | Removidas datas específicas, organização por fases |

**Próxima Revisão:** Após conclusão da Fase 1

---

**FIM DO PLANO DE EXECUÇÃO**

---

**Notas Finais:**

Este plano de execução foi criado integrando:
1. Redesign completo (DESIGN_PRD.md)
2. Funcionalidades de engajamento (ROADMAP.md)
3. Back-end e deploy (documentação técnica)

O resultado é um plano organizado em 8 fases sequenciais que entrega:
- ✅ Landing page profissional
- ✅ Design system completo e escalável
- ✅ Redesign de 100% da plataforma
- ✅ Funcionalidades de engajamento (progresso, favoritos, histórico)
- ✅ Back-end otimizado
- ✅ Deploy em produção com testes automatizados

**Filosofia de Execução:**
- **Sequencial:** Cada fase depende da anterior para garantir qualidade
- **Flexível:** Sem datas rígidas - adaptável ao ritmo da equipe
- **Validável:** Critérios de aceite claros em cada entrega
- **Documentado:** Riscos e dependências mapeados em documentos separados

A execução por fases permite validação contínua e ajustes baseados em feedback real de usuários.
