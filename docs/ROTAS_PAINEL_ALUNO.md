# Rotas do Painel do Aluno

Este checklist resume todas as rotas do fluxo do aluno (da tela de boas-vindas ao dashboard), indicando o arquivo responsável, o status atual em desenvolvimento e o que precisa ser feito para protegê-las em produção.

| Rota | Arquivo principal | Status no desenvolvimento | Ações para proteção em produção |
| --- | --- | --- | --- |
| `/bem-vindo` | `app/bem-vindo/page.tsx` | Bypass de login quando `NODE_ENV !== 'production'` | Reativar redirecionamento obrigatório ou usar flag de ambiente (`NEXT_PUBLIC_REQUIRE_AUTH`) |
| `/onboarding` | `app/onboarding/page.tsx` & `components/auth/OnboardingFlow.tsx` | Acesso liberado em DEV; gravação no Firestore fica desativada sem usuário | Exigir autenticação real antes de persistir dados e tratar erros de permissão |
| `/app` (dashboard aluno) | `app/app/page.tsx` | Conteúdo mock, sem proteção adicional | Integrar com dados reais e validar sessão antes de montar o dashboard |
| `/app/busca` | `app/app/busca/page.tsx` | Página desbloqueada (mock) | Habilitar somente para usuários válidos e conectar ao backend de busca |
| `/app/comunidade` | `app/app/comunidade/page.tsx` | Mock com conteúdo estático | Garantir autenticação antes de listar posts e aplicar regras de Firestore |
| `/app/perfil` | `app/app/perfil/page.tsx` | Perfil gamificado com dados mock | Conectar à API real e validar UID antes de mostrar estatísticas |
| `/app/aula/[courseId]/[videoId]` | `app/app/aula/[courseId]/[videoId]/page.tsx` | Player acessível em DEV sem bloquear rota dinâmica | Validar matrícula do aluno e restringir streaming apenas a inscritos |
| `/continue-watching` | `app/continue-watching/page.tsx` & `hooks/useContinueWatching.tsx` | Carrega vazio quando não há usuário | Exigir userId antes das consultas ao Firestore e apresentar mensagem de login obrigatório |
| `/progress` | `app/progress/page.tsx` & hooks (`useProgressSummary`, `useCourseProgress`, `useRecentVideos`) | Mostra placeholders se não houver sessão | Restaurar bloqueio de login e garantir segurança das consultas |
| `/meus-cursos` | `app/meus-cursos/page.tsx` | Página estática liberada | Ativar proteção e fazer fetch dos cursos do aluno autenticado |
| `/perfil` | `app/perfil/page.tsx` | Dados mock exibidos quando sem usuário | Reconectar ao contexto real e reforçar verificação de e-mail/UID |
| `/configuracoes` | `app/configuracoes/page.tsx` | Configurações abertas em DEV | Requerer sessão antes de alterar preferências |

## Como voltar a proteger as rotas

1. **Remover bypass de DEV:** Em cada página protegida, retire a checagem `process.env.NODE_ENV !== 'production'` ou troque por uma variável como `NEXT_PUBLIC_REQUIRE_AUTH`.
2. **Middleware unificado:** Centralize a proteção no `middleware.ts`, validando o cookie/sessão para `/admin` e para o bloco aluno (`/bem-vindo`, `/onboarding`, `/app/:path*`, `/continue-watching`, `/progress`, `/meus-cursos`, `/perfil`, `/configuracoes`).
3. **Fallback de hooks:** Nos hooks de progresso, restaure o comportamento original (consultar somente quando houver `userId`) e trate o estado “não logado” exibindo CTA para login.
4. **Testes end-to-end:** Garanta que o fluxo completo (login ➜ onboarding ➜ dashboard) funciona com usuário real antes de publicar.

> Enquanto estiver desenvolvendo, mantenha o bypass apenas no ambiente local. Ao preparar o deploy, troque o valor de `NODE_ENV` para `production` ou use uma flag dedicada para reativar a proteção automaticamente.
