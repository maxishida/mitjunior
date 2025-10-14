# ROADMAP - ComunidadeFlix

**Data de criacao:** 2025-10-10
**Status do Projeto:** MVP Concluido - Fase 7 em Planejamento
**Gerente de Projeto:** Agent project-manager
**Versao:** 1.0

---

## SUMARIO EXECUTIVO

### Status Atual
A plataforma ComunidadeFlix atingiu um estado de **MVP completo e funcional**. Todas as funcionalidades principais foram implementadas com sucesso, incluindo:
- Autenticacao completa com seguranca robusta
- Interface Netflix-style responsiva
- Feed de comunidade em tempo real
- Painel administrativo completo (CRUD de cursos, videos, posts e usuarios)
- Player de video integrado
- Chat em tempo real

### Proximas Prioridades
O foco imediato sera na **Fase 7: Melhorias de Engajamento**, que implementara funcionalidades criticas para retenccao e experiencia do usuario:
1. Sistema de progresso do aluno (tracking de videos)
2. Area "Meus Favoritos"
3. Historico de visualizaccoes

### Objetivo do Roadmap
Este documento estabelece um plano de acao detalhado para as proximas fases do projeto, com estimativas realistas, identificaccao de riscos e estrategias de mitigacao.

---

## ANALISE DE SITUACAO ATUAL

### Funcionalidades Implementadas (100%)

#### 1. Autenticacao e Seguranca
- **Status:** Completo
- **Componentes:**
  - Sistema de login/cadastro com Firebase Auth
  - Cookies de sessao seguros (httpOnly)
  - Middleware de protecao de rotas (`/middleware.ts`)
  - Permissoes de administrador via UID
  - API de sessao (`/app/api/auth/session/route.ts`)

#### 2. Interface Netflix-Style
- **Status:** Completo
- **Componentes:**
  - Tema escuro moderno com paleta vermelha/dourada
  - Carrosseis horizontais (`/components/CourseCarousel.tsx`)
  - Efeitos de hover e animacoes
  - Layout responsivo com Bootstrap 5.3.8
  - Skeleton loaders para carregamento

#### 3. Area do Usuario
- **Status:** Completo
- **Rotas Implementadas:**
  - Homepage: `/app/page.tsx`
  - Feed de posts: `/app/feed/page.tsx`
  - Chat: `/app/chat/page.tsx`
  - Visualizacao de curso: `/app/course/[id]/page.tsx`
  - Login/Signup: `/app/login/page.tsx`, `/app/signup/page.tsx`

#### 4. Painel Administrativo
- **Status:** Completo
- **Rotas Implementadas:**
  - Dashboard: `/app/admin/page.tsx`
  - CRUD de Cursos: `/app/admin/courses/page.tsx`, `/app/admin/courses/edit/[id]/page.tsx`
  - Gestao de Videos: `/app/admin/videos/page.tsx`
  - Moderacao de Posts: `/app/admin/posts/page.tsx`
  - Lista de Usuarios: `/app/admin/users/page.tsx`
  - API de usuarios: `/app/api/users/route.ts`

#### 5. Infraestrutura
- **Stack Tecnologico:**
  - Next.js 15.5.4 (App Router + Turbopack)
  - React 19.1.0 + TypeScript 5
  - Firebase (Auth, Firestore, Storage)
  - Bootstrap 5.3.8 + React-Bootstrap 2.10.10
- **Configuracao:**
  - Firebase Hosting configurado (`firebase.json`)
  - Variavei de ambiente configuradas
  - Servidor de desenvolvimento na porta 9002

### Gaps Criticos Identificados

#### 1. Engajamento do Usuario (ALTA PRIORIDADE)
**Gap:** Nao ha sistema para trackear o progresso do aluno ou personalizar a experiencia.

**Impacto:**
- Usuarios nao sabem quais videos ja assistiram
- Nao ha incentivo para completar cursos
- Experiencia generica sem personalizacao
- Taxa de retencao pode ser afetada

**Features Faltantes:**
- Tracking de progresso de videos
- Marcacao de aulas concluidas
- Area "Meus Favoritos"
- Historico de visualizaccoes
- Barra de progresso por curso

#### 2. Performance e Otimizacao (MEDIA PRIORIDADE)
**Gap:** Videos e imagens nao estao otimizados para streaming eficiente.

**Impacto:**
- Tempo de carregamento lento em conexoes lentas
- Alto consumo de largura de banda
- Experiencia ruim em dispositivos moveis

**Features Faltantes:**
- CDN dedicado para videos
- Multiplas resolucoes (adaptive streaming)
- Compressao de imagens
- Lazy loading avancado
- Capas animadas em looping

#### 3. Qualidade e Testes (ALTA PRIORIDADE)
**Gap:** Nao ha testes automatizados ou pipeline de CI/CD.

**Impacto:**
- Risco de bugs em producao
- Regressoes nao detectadas
- Deploy manual sujeito a erros
- Dificuldade em manter qualidade com crescimento

**Features Faltantes:**
- Testes unitarios (Jest)
- Testes E2E (Playwright/Cypress)
- CI/CD pipeline
- Cobertura de codigo
- Monitoramento e analytics

#### 4. Features Avancadas (BAIXA PRIORIDADE)
**Gap:** Funcionalidades de expansao nao implementadas.

**Features Faltantes:**
- API REST documentada
- Aplicativo movel
- Sistema de notificacoes push
- Gamificacao (badges, pontos)
- Sistema de pagamentos
- Multi-idioma (i18n)

---

## ROADMAP DETALHADO

### FASE 7: MELHORIAS DE ENGAJAMENTO

**Prioridade:** ALTA
**Duracao Estimada:** 2-3 semanas (10-15 dias uteis)
**Esforco Total:** 60-80 horas
**Dependencias:** Nenhuma (pode iniciar imediatamente)

#### Objetivos da Fase
1. Aumentar retencao de usuarios atraves de tracking de progresso
2. Personalizar experiencia com favoritos e historico
3. Incentivar conclusao de cursos
4. Estabelecer base para gamificacao futura

#### Feature 1: Sistema de Progresso do Aluno

**Descricao:**
Implementar sistema completo para rastrear o progresso do aluno em cada curso, incluindo videos assistidos, tempo de visualizacao e conclusao de aulas.

**Componentes a Criar:**
1. **Modelo de Dados (Firestore):**
   ```
   Collection: userProgress
   ├── {userId}
   │   ├── courses/
   │   │   ├── {courseId}
   │   │   │   ├── videos/
   │   │   │   │   ├── {videoId}
   │   │   │   │   │   ├── completed: boolean
   │   │   │   │   │   ├── watchedTime: number (segundos)
   │   │   │   │   │   ├── lastWatched: timestamp
   │   │   │   │   │   └── completedAt: timestamp | null
   │   │   │   ├── overallProgress: number (%)
   │   │   │   ├── completedVideos: number
   │   │   │   ├── totalVideos: number
   │   │   │   └── startedAt: timestamp
   ```

2. **Componentes React:**
   - `ProgressBar.tsx` - Barra de progresso visual
   - `VideoProgressTracker.tsx` - Hook para rastrear tempo de video
   - `CourseProgress.tsx` - Componente de progresso por curso
   - `CompletionBadge.tsx` - Badge de conclusao

3. **Hooks Customizados:**
   - `useVideoProgress.ts` - Hook para gerenciar progresso de video
   - `useCourseProgress.ts` - Hook para calcular progresso de curso

4. **Modificacoes em Arquivos Existentes:**
   - `/app/course/[id]/page.tsx` - Adicionar tracking de progresso
   - `/components/CourseCarousel.tsx` - Exibir barra de progresso nos cards
   - `/app/page.tsx` - Secao "Continuar Assistindo"

**Tarefas Detalhadas:**
- [ ] Criar modelo de dados no Firestore (1h)
- [ ] Implementar `useVideoProgress` hook (3h)
- [ ] Criar componente `ProgressBar` (2h)
- [ ] Modificar player de video para trackear tempo (4h)
- [ ] Implementar logica de marcacao como concluido (2h)
- [ ] Adicionar barra de progresso nos cards de curso (3h)
- [ ] Criar secao "Continuar Assistindo" na homepage (4h)
- [ ] Testes manuais e ajustes (3h)

**Estimativa de Esforco:** 22 horas
**Prazo:** 5 dias uteis

**Riscos:**
- **Risco 1:** Performance ao atualizar progresso em tempo real
  - **Mitigacao:** Implementar debounce/throttle para atualizacoes (ex: a cada 5 segundos)
  - **Impacto:** Medio

- **Risco 2:** Consumo excessivo de reads/writes no Firestore
  - **Mitigacao:** Usar batch writes e cache local
  - **Impacto:** Baixo

**Criterios de Aceite:**
- [ ] Usuario pode ver progresso de cada video (%)
- [ ] Videos concluidos exibem badge de conclusao
- [ ] Homepage mostra secao "Continuar Assistindo" com ultimos cursos
- [ ] Barra de progresso visivel em cada card de curso
- [ ] Progresso salvo automaticamente no Firestore
- [ ] Progresso persiste entre sessoes

---

#### Feature 2: Area "Meus Favoritos"

**Descricao:**
Implementar funcionalidade para usuarios adicionarem cursos aos favoritos e visualizarem em uma area dedicada.

**Componentes a Criar:**
1. **Modelo de Dados (Firestore):**
   ```
   Collection: userFavorites
   ├── {userId}
   │   ├── courses/
   │   │   ├── {courseId}
   │   │   │   ├── addedAt: timestamp
   │   │   │   └── courseData: { title, coverUrl } (denormalized)
   ```

2. **Componentes React:**
   - `FavoriteButton.tsx` - Botao de adicionar/remover favorito
   - `FavoritesGrid.tsx` - Grid de cursos favoritos
   - `FavoritesPage.tsx` - Pagina completa de favoritos

3. **Hooks Customizados:**
   - `useFavorites.ts` - Hook para gerenciar favoritos

4. **Novas Rotas:**
   - `/app/favorites/page.tsx` - Pagina de favoritos

5. **Modificacoes em Arquivos Existentes:**
   - `/app/course/[id]/page.tsx` - Adicionar botao de favoritar
   - `/components/Navbar.tsx` - Link para pagina de favoritos
   - `/components/CourseCarousel.tsx` - Icone de favorito nos cards

**Tarefas Detalhadas:**
- [ ] Criar modelo de dados no Firestore (30min)
- [ ] Implementar `useFavorites` hook (2h)
- [ ] Criar componente `FavoriteButton` com animacao (2h)
- [ ] Criar pagina `/favorites` (3h)
- [ ] Adicionar botao de favorito na pagina de curso (1h)
- [ ] Adicionar icone de favorito nos cards (1h)
- [ ] Implementar notificacao visual ao favoritar (1h)
- [ ] Adicionar link na navbar (30min)
- [ ] Testes manuais e ajustes (2h)

**Estimativa de Esforco:** 13 horas
**Prazo:** 3 dias uteis

**Riscos:**
- **Risco 1:** Dados denormalizados podem ficar desatualizados
  - **Mitigacao:** Implementar funcao Cloud para sincronizar dados quando curso eh editado
  - **Impacto:** Baixo

- **Risco 2:** Performance com muitos favoritos
  - **Mitigacao:** Implementar paginacao na lista de favoritos
  - **Impacto:** Baixo

**Criterios de Aceite:**
- [ ] Usuario pode adicionar/remover curso dos favoritos
- [ ] Icone de coracao muda de estado (vazio/preenchido)
- [ ] Pagina `/favorites` exibe todos os cursos favoritos
- [ ] Favoritos persistem no Firestore
- [ ] Notificacao visual ao adicionar/remover favorito
- [ ] Link "Meus Favoritos" visivel na navbar

---

#### Feature 3: Historico de Visualizacoes

**Descricao:**
Criar historico completo de todos os cursos e videos visualizados pelo usuario, com ordenacao por data recente.

**Componentes a Criar:**
1. **Modelo de Dados (Firestore):**
   ```
   Collection: viewHistory
   ├── {userId}
   │   ├── items/
   │   │   ├── {historyId}
   │   │   │   ├── courseId: string
   │   │   │   ├── videoId: string | null
   │   │   │   ├── viewedAt: timestamp
   │   │   │   ├── courseData: { title, coverUrl } (denormalized)
   │   │   │   └── duration: number (tempo assistido)
   ```

2. **Componentes React:**
   - `HistoryCard.tsx` - Card de item do historico
   - `HistoryList.tsx` - Lista de historico
   - `HistoryPage.tsx` - Pagina completa de historico

3. **Hooks Customizados:**
   - `useViewHistory.ts` - Hook para gerenciar historico

4. **Novas Rotas:**
   - `/app/history/page.tsx` - Pagina de historico

5. **Modificacoes em Arquivos Existentes:**
   - `/app/course/[id]/page.tsx` - Registrar visualizacao no historico
   - `/components/Navbar.tsx` - Link para pagina de historico
   - `/app/page.tsx` - Secao "Vistos Recentemente"

**Tarefas Detalhadas:**
- [ ] Criar modelo de dados no Firestore (30min)
- [ ] Implementar `useViewHistory` hook (2h)
- [ ] Criar componente `HistoryCard` (2h)
- [ ] Criar pagina `/history` com paginacao (3h)
- [ ] Implementar registro automatico de visualizacao (2h)
- [ ] Criar secao "Vistos Recentemente" na homepage (2h)
- [ ] Adicionar link na navbar (30min)
- [ ] Implementar funcao de limpar historico (1h)
- [ ] Testes manuais e ajustes (2h)

**Estimativa de Esforco:** 15 horas
**Prazo:** 3 dias uteis

**Riscos:**
- **Risco 1:** Historico pode crescer muito e afetar performance
  - **Mitigacao:** Implementar limite de 100 itens mais recentes, arquivar antigos
  - **Impacto:** Medio

- **Risco 2:** Muitos writes no Firestore ao assistir videos
  - **Mitigacao:** Usar debounce e batch writes
  - **Impacto:** Baixo

**Criterios de Aceite:**
- [ ] Visualizacoes registradas automaticamente
- [ ] Pagina `/history` exibe historico completo
- [ ] Itens ordenados por data (mais recente primeiro)
- [ ] Secao "Vistos Recentemente" na homepage
- [ ] Usuario pode limpar historico
- [ ] Link "Historico" visivel na navbar
- [ ] Paginacao funcional com +20 itens

---

#### Cronograma da Fase 7

```
Semana 1 (Dias 1-5):
├── Dia 1-2: Feature 1.1 - Modelo de dados + useVideoProgress hook
├── Dia 3-4: Feature 1.2 - Componentes de progresso + tracking de video
└── Dia 5: Feature 1.3 - Secao "Continuar Assistindo" + testes

Semana 2 (Dias 6-10):
├── Dia 6-7: Feature 2 - Sistema de Favoritos (completo)
├── Dia 8-9: Feature 3.1 - Modelo de historico + useViewHistory hook
└── Dia 10: Feature 3.2 - Componentes de historico + testes

Semana 3 (Dias 11-13) - Buffer e Refinamento:
├── Dia 11: Feature 3.3 - Pagina de historico + secao homepage
├── Dia 12: Testes integrados de todas as features
└── Dia 13: Ajustes finais, documentacao e deploy
```

**Total:** 13 dias uteis (2.6 semanas)

---

### FASE 8: OTIMIZACAO DE PERFORMANCE

**Prioridade:** MEDIA
**Duracao Estimada:** 2 semanas (10 dias uteis)
**Esforco Total:** 50-60 horas
**Dependencias:** Nenhuma (pode executar em paralelo com Fase 7)

#### Objetivos da Fase
1. Reduzir tempo de carregamento em 40%
2. Implementar adaptive streaming para videos
3. Otimizar imagens e assets
4. Melhorar Lighthouse score para +90

#### Feature 1: Otimizacao de Videos

**Descricao:**
Implementar sistema de adaptive streaming com multiplas resolucoes e CDN dedicado.

**Componentes a Criar:**
1. **Servico de Transcoding:**
   - Integrar com servico de transcoding (ex: Cloudinary, Mux)
   - Gerar multiplas resolucoes: 360p, 480p, 720p, 1080p

2. **Player de Video Avancado:**
   - Substituir player HTML5 basico por Video.js ou similar
   - Implementar adaptive bitrate streaming
   - Adicionar controles avancados (legendas, velocidade)

3. **Configuracao CDN:**
   - Configurar Firebase Storage com CDN
   - Implementar cache headers otimizados

**Tarefas Detalhadas:**
- [ ] Pesquisar e escolher solucao de transcoding (2h)
- [ ] Integrar servico de transcoding (8h)
- [ ] Implementar Video.js ou similar (6h)
- [ ] Configurar adaptive streaming (4h)
- [ ] Otimizar Firebase Storage + CDN (3h)
- [ ] Migrar videos existentes para novo sistema (4h)
- [ ] Testes de performance (3h)

**Estimativa de Esforco:** 30 horas
**Prazo:** 6 dias uteis

**Riscos:**
- **Risco 1:** Custo de servico de transcoding pode ser alto
  - **Mitigacao:** Avaliar opcoes gratuitas/low-cost (Cloudinary free tier)
  - **Impacto:** Alto

- **Risco 2:** Migracao de videos existentes pode falhar
  - **Mitigacao:** Manter sistema antigo como fallback
  - **Impacto:** Medio

**Criterios de Aceite:**
- [ ] Videos disponivei em multiplas resolucoes
- [ ] Player ajusta qualidade automaticamente baseado na conexao
- [ ] Tempo de carregamento inicial reduzido em 40%
- [ ] CDN configurado corretamente
- [ ] Videos antigos migrados com sucesso

---

#### Feature 2: Melhorias de UX

**Descricao:**
Implementar capas animadas, previews de video no hover e skeleton loaders otimizados.

**Componentes a Criar:**
1. **Capas Animadas:**
   - Videos em looping leve (5-10s) para capas de curso
   - Efeito de fade-in ao passar mouse

2. **Preview de Video:**
   - Preview de 10s ao passar mouse sobre card
   - Mute automatico
   - Transicao suave

3. **Skeleton Loaders Otimizados:**
   - Componente `SkeletonLoader` reutilizavel
   - Animacao shimmer suave
   - Layout identico ao conteudo final

**Tarefas Detalhadas:**
- [ ] Criar sistema de capas animadas (6h)
- [ ] Implementar preview de video no hover (5h)
- [ ] Otimizar skeleton loaders existentes (3h)
- [ ] Adicionar lazy loading avancado (3h)
- [ ] Testes de performance e UX (3h)

**Estimativa de Esforco:** 20 horas
**Prazo:** 4 dias uteis

**Riscos:**
- **Risco 1:** Previews podem consumir muita banda
  - **Mitigacao:** Implementar debounce de 1s antes de carregar preview
  - **Impacto:** Medio

**Criterios de Aceite:**
- [ ] Capas de curso com video em looping
- [ ] Preview aparece 1s apos hover
- [ ] Skeleton loaders identicos ao layout final
- [ ] Lazy loading em todas as imagens
- [ ] Performance nao impactada negativamente

---

### FASE 9: QUALIDADE E DEPLOY

**Prioridade:** ALTA
**Duracao Estimada:** 2 semanas (10 dias uteis)
**Esforco Total:** 50-60 horas
**Dependencias:** Recomendado apos Fase 7

#### Objetivos da Fase
1. Implementar testes automatizados com cobertura +80%
2. Configurar pipeline de CI/CD
3. Deploy automatizado para Firebase Hosting
4. Monitoramento e analytics

#### Feature 1: Testes Automatizados

**Descricao:**
Implementar suite completa de testes unitarios e E2E.

**Componentes a Criar:**
1. **Setup de Testes:**
   - Configurar Jest + React Testing Library
   - Configurar Playwright para testes E2E
   - Setup de mocks do Firebase

2. **Testes Unitarios:**
   - Testar componentes principais (Navbar, CourseCarousel, etc)
   - Testar hooks customizados
   - Testar utilitarios

3. **Testes E2E:**
   - Fluxo de autenticacao
   - Fluxo de visualizacao de curso
   - Fluxo de adicionar favorito
   - Fluxo de tracking de progresso

**Tarefas Detalhadas:**
- [ ] Configurar Jest + RTL (3h)
- [ ] Configurar Playwright (2h)
- [ ] Escrever testes unitarios de componentes (12h)
- [ ] Escrever testes de hooks (4h)
- [ ] Escrever testes E2E (10h)
- [ ] Configurar coverage reports (2h)
- [ ] Ajustes e correcoes (5h)

**Estimativa de Esforco:** 38 horas
**Prazo:** 8 dias uteis

**Criterios de Aceite:**
- [ ] Cobertura de codigo +80%
- [ ] Todos os testes passando
- [ ] Testes E2E cobrindo fluxos principais
- [ ] CI executando testes automaticamente

---

#### Feature 2: CI/CD Pipeline

**Descricao:**
Configurar pipeline de deploy automatizado.

**Componentes a Criar:**
1. **GitHub Actions Workflow:**
   - Workflow de teste em PRs
   - Workflow de deploy em merge para main
   - Workflow de deploy para staging

2. **Ambientes:**
   - Staging environment no Firebase
   - Production environment

**Tarefas Detalhadas:**
- [ ] Configurar GitHub Actions (4h)
- [ ] Criar workflow de teste (2h)
- [ ] Criar workflow de deploy (3h)
- [ ] Configurar staging environment (2h)
- [ ] Testes do pipeline (3h)

**Estimativa de Esforco:** 14 horas
**Prazo:** 3 dias uteis

**Criterios de Aceite:**
- [ ] Testes executam automaticamente em PRs
- [ ] Deploy automatico para staging em merge
- [ ] Deploy manual para production
- [ ] Rollback automatico em falhas

---

### FASE 10: EXPANSAO E MONETIZACAO

**Prioridade:** BAIXA
**Duracao Estimada:** 4+ semanas
**Dependencias:** Todas as fases anteriores

#### Features Planejadas
1. **API REST Publica:**
   - Documentacao com Swagger
   - Rate limiting
   - API keys

2. **Aplicativo Movel:**
   - React Native
   - Compartilhar logica com web
   - Push notifications

3. **Sistema de Pagamentos:**
   - Integracao com Stripe
   - Assinaturas recorrentes
   - Marketplace de cursos

4. **Gamificacao:**
   - Sistema de pontos
   - Badges e conquistas
   - Leaderboard

5. **Multi-idioma:**
   - i18n com next-intl
   - Traducoes PT/EN/ES

**Nota:** Esta fase sera detalhada apos conclusao da Fase 9.

---

## GESTAO DE RISCOS

### Riscos Tecnicos

#### Risco 1: Performance do Firestore com Muitos Usuarios
- **Probabilidade:** Media
- **Impacto:** Alto
- **Mitigacao:**
  - Implementar cache com Redis ou similar
  - Otimizar queries com indices compostos
  - Considerar Cloud Functions para operacoes pesadas
- **Plano de Contingencia:**
  - Migrar para Firestore em modo nativo (custos mais baixos)
  - Implementar sharding de colecoes

#### Risco 2: Custo de Servicos Firebase
- **Probabilidade:** Media
- **Impacto:** Medio
- **Mitigacao:**
  - Monitorar uso com Firebase Console
  - Implementar limites e quotas
  - Otimizar reads/writes
- **Plano de Contingencia:**
  - Migrar Storage para solucao mais barata (Cloudflare R2)
  - Implementar cache agressivo

#### Risco 3: Bugs em Producao Sem Testes
- **Probabilidade:** Alta (antes da Fase 9)
- **Impacto:** Alto
- **Mitigacao:**
  - Priorizar Fase 9 logo apos Fase 7
  - Testes manuais rigorosos ate implementar testes automatizados
  - Implementar feature flags
- **Plano de Contingencia:**
  - Rollback imediato via Git
  - Comunicacao proativa com usuarios

#### Risco 4: Dependencia de Servicos Terceiros
- **Probabilidade:** Baixa
- **Impacto:** Alto
- **Mitigacao:**
  - Documentar todas as integracoes
  - Manter fallbacks para servicos criticos
  - SLA agreements com fornecedores
- **Plano de Contingencia:**
  - Migrar para alternativas pre-mapeadas
  - Manter backup de dados criticos

### Riscos de Projeto

#### Risco 5: Escopo Crescente (Scope Creep)
- **Probabilidade:** Media
- **Impacto:** Medio
- **Mitigacao:**
  - Roadmap bem definido com prioridades claras
  - Revisao de escopo a cada fase
  - Comunicacao clara com stakeholders
- **Plano de Contingencia:**
  - Criar backlog de features futuras
  - Renegociar prazos se necessario

#### Risco 6: Falta de Recursos (Tempo/Pessoas)
- **Probabilidade:** Media
- **Impacto:** Alto
- **Mitigacao:**
  - Estimativas realistas com buffer de 20%
  - Priorizar features criticas (MVP)
  - Documentacao clara para onboarding rapido
- **Plano de Contingencia:**
  - Realocar prioridades
  - Postergar features de baixa prioridade

---

## METRICAS DE SUCESSO

### KPIs por Fase

#### Fase 7: Melhorias de Engajamento
- **Metrica 1:** Taxa de retorno semanal > 60%
- **Metrica 2:** Tempo medio na plataforma > 15min/sessao
- **Metrica 3:** Taxa de conclusao de cursos > 40%
- **Metrica 4:** Numero medio de favoritos por usuario > 3

#### Fase 8: Otimizacao de Performance
- **Metrica 1:** Lighthouse Performance Score > 90
- **Metrica 2:** First Contentful Paint < 1.5s
- **Metrica 3:** Largest Contentful Paint < 2.5s
- **Metrica 4:** Time to Interactive < 3s
- **Metrica 5:** Cumulative Layout Shift < 0.1

#### Fase 9: Qualidade e Deploy
- **Metrica 1:** Cobertura de testes > 80%
- **Metrica 2:** Uptime > 99.5%
- **Metrica 3:** Tempo de deploy < 10min
- **Metrica 4:** Taxa de sucesso de deploy > 95%
- **Metrica 5:** MTTR (Mean Time to Recovery) < 1h

### Metricas de Negocio (Longo Prazo)
- Crescimento de usuarios ativos mensais: +20%
- NPS (Net Promoter Score): > 50
- Taxa de churn: < 10%
- Receita recorrente (quando implementado pagamento)

---

## RECURSOS NECESSARIOS

### Recursos Humanos

#### Fase 7: Melhorias de Engajamento
- **Desenvolvedor Full-Stack:** 60-80 horas
- **Designer UI/UX (opcional):** 10 horas (para revisar componentes)
- **QA Tester:** 10 horas (testes manuais)

#### Fase 8: Otimizacao de Performance
- **Desenvolvedor Full-Stack:** 50-60 horas
- **DevOps Engineer:** 15 horas (configuracao CDN)

#### Fase 9: Qualidade e Deploy
- **Desenvolvedor Full-Stack:** 40 horas
- **DevOps Engineer:** 20 horas (CI/CD)
- **QA Engineer:** 20 horas (testes E2E)

### Recursos Tecnicos

#### Servicos e Ferramentas
1. **Firebase (Atual):**
   - Spark Plan (gratuito) - Suficiente para MVP
   - Blaze Plan (pay-as-you-go) - Recomendado para producao
   - Estimativa: $50-100/mes

2. **CDN/Storage (Fase 8):**
   - Firebase Storage + CDN (incluido)
   - Ou Cloudinary/Mux (alternativa)
   - Estimativa: $0-50/mes (depende de volume)

3. **Servico de Transcoding (Fase 8):**
   - Cloudinary (1GB gratis/mes)
   - Mux (pay-as-you-go)
   - Estimativa: $0-100/mes

4. **CI/CD (Fase 9):**
   - GitHub Actions (2000 min gratis/mes)
   - Estimativa: $0/mes (suficiente para projeto)

5. **Monitoramento (Fase 9):**
   - Firebase Analytics (gratis)
   - Sentry (gratis ate 5k eventos/mes)
   - Estimativa: $0/mes

**Custo Total Estimado (Mensal):** $50-250/mes

### Ambiente de Desenvolvimento
- **Atual:** Firebase Studio (IDX) - Porta 9002
- **Recomendado:** Manter configuracao atual
- **Staging:** Firebase Hosting channel (gratis)

---

## CRONOGRAMA CONSOLIDADO

### Visao Geral (3-4 Meses)

```
Outubro 2025 (Semanas 1-4):
├── Semana 1-2: FASE 7.1 - Sistema de Progresso
├── Semana 3: FASE 7.2 - Favoritos
└── Semana 4: FASE 7.3 - Historico + Testes

Novembro 2025 (Semanas 5-8):
├── Semana 5-6: FASE 8.1 - Otimizacao de Videos
├── Semana 7-8: FASE 8.2 - Melhorias de UX
└── Revisao e ajustes

Dezembro 2025 (Semanas 9-12):
├── Semana 9-10: FASE 9.1 - Testes Automatizados
├── Semana 11: FASE 9.2 - CI/CD Pipeline
└── Semana 12: Deploy e estabilizacao

Janeiro 2026+ (Semanas 13+):
└── FASE 10 - Expansao e Monetizacao (planejamento detalhado futuro)
```

### Marcos (Milestones)

1. **M1: MVP com Engajamento (Fim de Outubro)**
   - Sistema de progresso funcional
   - Favoritos implementados
   - Historico completo
   - Taxa de conclusao de cursos mensuravel

2. **M2: Performance Otimizada (Fim de Novembro)**
   - Lighthouse score > 90
   - Videos em multiplas resolucoes
   - UX melhorada com previews
   - Tempo de carregamento reduzido 40%

3. **M3: Producao Estavel (Fim de Dezembro)**
   - Testes automatizados (80% coverage)
   - CI/CD funcional
   - Deploy automatizado
   - Monitoramento ativo

4. **M4: Expansao (Janeiro 2026+)**
   - API publica documentada
   - Roadmap de monetizacao definido
   - Estrategia de mobile app

---

## DEPENDENCIAS ENTRE FASES

### Diagrama de Dependencias

```
FASE 7 (Engajamento)
    |
    ├─> FASE 9 (Qualidade) [RECOMENDADO]
    |       |
    |       └─> FASE 10 (Expansao) [OBRIGATORIO]
    |
    └─> FASE 8 (Performance) [OPCIONAL - PARALELO]
            |
            └─> FASE 10 (Expansao) [RECOMENDADO]
```

### Ordem Recomendada de Execucao

1. **FASE 7:** Melhorias de Engajamento (INICIAR IMEDIATAMENTE)
   - Critica para retencao de usuarios
   - Base para features futuras
   - Sem dependencias

2. **FASE 9:** Qualidade e Deploy (LOGO APOS FASE 7)
   - Reduz risco de bugs em producao
   - Facilita desenvolvimento futuro
   - Depende de Fase 7 estar estavel

3. **FASE 8:** Otimizacao de Performance (PARALELO OU APOS FASE 7)
   - Pode executar em paralelo
   - Melhora experiencia sem afetar funcionalidades
   - Sem dependencias criticas

4. **FASE 10:** Expansao (APOS FASE 7 E 9)
   - Requer base solida
   - Depende de testes automatizados
   - Roadmap detalhado apos experiencia com MVP

---

## ESTRATEGIAS DE IMPLEMENTACAO

### Abordagem Agil

#### Sprints Sugeridos (2 semanas cada)

**Sprint 1-2: Sistema de Progresso (FASE 7.1)**
- Sprint Planning: Definir tasks detalhadas
- Daily Standups: 15min (se equipe)
- Sprint Review: Demo de progresso funcional
- Retrospective: Licoes aprendidas

**Sprint 3: Favoritos + Historico (FASE 7.2 + 7.3)**
- Feature menor, sprint acelerado
- Testes integrados

**Sprint 4-5: Otimizacao de Videos (FASE 8.1)**
- Pesquisa e escolha de solucao
- Implementacao e migracao

**Sprint 6: Melhorias de UX (FASE 8.2)**
- Polish final de interface
- Ajustes baseados em feedback

**Sprint 7-8: Testes Automatizados (FASE 9.1)**
- Setup de ferramentas
- Escrita de testes

**Sprint 9: CI/CD (FASE 9.2)**
- Configuracao de pipeline
- Deploy automatizado

### Desenvolvimento Iterativo

1. **Iterar Rapidamente:**
   - Releases pequenos e frequentes
   - Feedback continuo de usuarios
   - Ajustes baseados em metricas

2. **Feature Flags:**
   - Implementar sistema de feature flags
   - Habilitar features gradualmente
   - A/B testing quando relevante

3. **Documentacao Continua:**
   - Atualizar docs a cada feature
   - Manter changelog detalhado
   - Documentar decisoes tecnicas

---

## PROXIMOS PASSOS RECOMENDADOS

### Acao Imediata (Proximos 7 Dias)

#### 1. Preparacao do Ambiente
- [ ] Criar branch `feature/user-progress` no Git
- [ ] Configurar estrutura de colecoes no Firestore
- [ ] Revisar e validar estimativas da Fase 7

#### 2. Comunicacao com Stakeholders
- [ ] Apresentar este roadmap para aprovacao
- [ ] Alinhar expectativas de prazos
- [ ] Definir canais de comunicacao

#### 3. Inicio da Fase 7
- [ ] Criar modelo de dados `userProgress` no Firestore
- [ ] Implementar hook `useVideoProgress`
- [ ] Desenvolver componente `ProgressBar`

### Acao de Curto Prazo (Proximas 2 Semanas)

#### 1. Completar Feature de Progresso
- [ ] Modificar player de video para tracking
- [ ] Adicionar barra de progresso nos cards
- [ ] Criar secao "Continuar Assistindo"

#### 2. Iniciar Favoritos
- [ ] Criar modelo de dados `userFavorites`
- [ ] Implementar `useFavorites` hook
- [ ] Desenvolver componente `FavoriteButton`

#### 3. Setup de Monitoramento Basico
- [ ] Configurar Firebase Analytics
- [ ] Definir eventos customizados
- [ ] Criar dashboard basico

### Acao de Medio Prazo (Proximo Mes)

#### 1. Completar Fase 7
- [ ] Todas as features de engajamento implementadas
- [ ] Testes manuais completos
- [ ] Documentacao atualizada

#### 2. Preparar Fase 9
- [ ] Pesquisar ferramentas de teste
- [ ] Configurar ambiente de testes
- [ ] Definir estrategia de CI/CD

#### 3. Avaliar Necessidade de Fase 8
- [ ] Analisar metricas de performance
- [ ] Decidir prioridade de otimizacao
- [ ] Alocar recursos se necessario

---

## CRITERIOS DE TRANSICAO ENTRE FASES

### Fase 7 -> Fase 9

**Pre-requisitos:**
- [ ] Todas as features de engajamento implementadas e funcionais
- [ ] Testes manuais completos sem bugs criticos
- [ ] Metricas de engajamento sendo coletadas
- [ ] Documentacao tecnica atualizada

**Criterios de Go/No-Go:**
- **GO:** Taxa de bugs < 5 por feature, feedback positivo de usuarios teste
- **NO-GO:** Bugs criticos nao resolvidos, performance degradada

### Fase 8 (Opcional - Paralelo)

**Pre-requisitos:**
- [ ] Analise de performance indica necessidade
- [ ] Lighthouse score < 80 OU LCP > 3s
- [ ] Feedback de usuarios sobre lentidao

**Criterios de Go/No-Go:**
- **GO:** Performance impacta experiencia, recursos disponiveis
- **NO-GO:** Performance aceitavel, prioridade em outras areas

### Fase 9 -> Fase 10

**Pre-requisitos:**
- [ ] Cobertura de testes > 80%
- [ ] CI/CD funcional com deploys automatizados
- [ ] Zero bugs criticos em producao
- [ ] Uptime > 99% por 30 dias

**Criterios de Go/No-Go:**
- **GO:** Plataforma estavel, demanda de usuarios para novas features
- **NO-GO:** Instabilidade, divida tecnica alta

---

## APENDICES

### Apendice A: Stack Tecnologico Detalhado

#### Frontend
```javascript
{
  "framework": "Next.js 15.5.4",
  "runtime": "React 19.1.0",
  "language": "TypeScript 5",
  "ui": "Bootstrap 5.3.8 + React-Bootstrap 2.10.10",
  "hooks": "react-firebase-hooks 5.1.1",
  "buildTool": "Turbopack"
}
```

#### Backend
```javascript
{
  "platform": "Firebase",
  "services": {
    "auth": "Firebase Authentication",
    "database": "Firestore",
    "storage": "Firebase Storage",
    "hosting": "Firebase Hosting"
  },
  "sdk": {
    "client": "firebase 12.3.0",
    "admin": "firebase-admin 13.5.0"
  }
}
```

#### DevOps (Fase 9+)
```javascript
{
  "ci": "GitHub Actions",
  "testing": {
    "unit": "Jest + React Testing Library",
    "e2e": "Playwright",
    "coverage": "Jest Coverage"
  },
  "monitoring": {
    "analytics": "Firebase Analytics",
    "errors": "Sentry (opcionale)"
  }
}
```

### Apendice B: Estrutura de Firestore Proposta

```
firestore/
├── users/
│   └── {userId}
│       ├── email: string
│       ├── displayName: string
│       ├── role: "user" | "admin"
│       └── createdAt: timestamp
│
├── courses/
│   └── {courseId}
│       ├── title: string
│       ├── description: string
│       ├── coverUrl: string
│       ├── createdBy: string (userId)
│       └── createdAt: timestamp
│
├── videos/
│   └── {videoId}
│       ├── courseId: string
│       ├── title: string
│       ├── videoUrl: string
│       ├── duration: number
│       └── order: number
│
├── posts/
│   └── {postId}
│       ├── userId: string
│       ├── content: string
│       └── createdAt: timestamp
│
├── userProgress/ [NOVO - FASE 7]
│   └── {userId}
│       └── courses/
│           └── {courseId}
│               ├── videos/
│               │   └── {videoId}
│               │       ├── completed: boolean
│               │       ├── watchedTime: number
│               │       ├── lastWatched: timestamp
│               │       └── completedAt: timestamp | null
│               ├── overallProgress: number (%)
│               ├── completedVideos: number
│               ├── totalVideos: number
│               └── startedAt: timestamp
│
├── userFavorites/ [NOVO - FASE 7]
│   └── {userId}
│       └── courses/
│           └── {courseId}
│               ├── addedAt: timestamp
│               └── courseData: {
│                   title: string,
│                   coverUrl: string
│                 }
│
└── viewHistory/ [NOVO - FASE 7]
    └── {userId}
        └── items/
            └── {historyId}
                ├── courseId: string
                ├── videoId: string | null
                ├── viewedAt: timestamp
                ├── courseData: {
                │   title: string,
                │   coverUrl: string
                │ }
                └── duration: number
```

### Apendice C: Glossario

- **MVP:** Minimum Viable Product - Produto minimo viavel
- **CDN:** Content Delivery Network - Rede de distribuicao de conteudo
- **CI/CD:** Continuous Integration/Continuous Deployment - Integracao/Deploy continuo
- **E2E:** End-to-End - Ponta a ponta (testes)
- **KPI:** Key Performance Indicator - Indicador chave de performance
- **LCP:** Largest Contentful Paint - Metrica de performance
- **NPS:** Net Promoter Score - Score de promotor liquido
- **PWA:** Progressive Web App - Aplicativo web progressivo
- **SLA:** Service Level Agreement - Acordo de nivel de servico
- **UX/UI:** User Experience/User Interface - Experiencia/Interface do usuario

### Apendice D: Referencias

#### Documentacao Oficial
- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs (PT-BR)](https://firebase.google.com/docs?hl=pt-br)
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

#### Documentacao do Projeto
- `/doc/PRD.md` - Product Requirements Document completo
- `/doc/blueprint.md` - Planejamento original
- `/doc/relatorio.md` - Relatorio de implementacao
- `/doc/AI_AGENT_GUIDE.md` - Guia tecnico para agentes

#### Ferramentas Recomendadas
- [Jest Testing Framework](https://jestjs.io/)
- [Playwright E2E Testing](https://playwright.dev/)
- [Video.js Player](https://videojs.com/)
- [Cloudinary Media Management](https://cloudinary.com/)

---

## REVISOES DO DOCUMENTO

### Historico de Versoes

| Versao | Data       | Autor              | Alteracoes                       |
|--------|------------|--------------------|----------------------------------|
| 1.0    | 2025-10-10 | project-manager    | Criacao inicial do roadmap       |

### Proxima Revisao Programada
**Data:** 2025-10-24 (apos 2 semanas de Fase 7)
**Objetivo:** Validar estimativas, ajustar cronograma, avaliar progresso

---

**Fim do Documento**

---

**Notas Finais:**

Este roadmap foi criado com base em analise detalhada de toda a documentacao do projeto ComunidadeFlix. As estimativas sao realistas e consideram um desenvolvedor full-stack trabalhando em tempo integral. Ajustes podem ser necessarios baseados em:

1. Disponibilidade real de recursos
2. Feedback de usuarios durante implementacao
3. Mudancas de prioridades de negocio
4. Descoberta de novos requisitos tecnicos

Recomenda-se revisao quinzenal deste documento para manter alinhamento com a realidade do projeto.

---

**Contato:**
Para questoes sobre este roadmap, consulte:
- `/doc/AI_AGENT_GUIDE.md` - Guia tecnico completo
- `/doc/PRD.md` - Requisitos de produto
- `/doc/relatorio.md` - Status de implementacao atual
