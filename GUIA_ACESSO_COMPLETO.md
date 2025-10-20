# 🚀 Guia Completo de Acesso - Mitsuo Ishida Platform

## 📋 Índice
- [Acesso Rápido](#acesso-rápido)
- [Painel Administrativo](#painel-administrativo)
- [Páginas da Comunidade](#páginas-da-comunidade)
- [Páginas do Aluno](#páginas-do-aluno)
- [Páginas de Autenticação](#páginas-de-autenticação)
- [Páginas de Teste](#páginas-de-teste)
- [Acesso via Código](#acesso-via-código)

---

## 🏠 Acesso Rápido

### URLs Principais
```
http://localhost:3000/           → Home Page (Landing)
http://localhost:3000/app        → Dashboard do Aluno
http://localhost:3000/admin      → Painel Administrativo
http://localhost:3000/login      → Login
http://localhost:3000/signup     → Cadastro
```

---

## 🔐 Painel Administrativo

### Acesso ao Admin
1. **URL Principal**: `http://localhost:3000/admin`

2. **Páginas Administrativas**:
   ```
   http://localhost:3000/admin              → Dashboard Admin
   http://localhost:3000/admin/courses     → Gerenciar Cursos
   http://localhost:3000/admin/courses/edit/[id] → Editar Curso
   http://localhost:3000/admin/videos       → Gerenciar Vídeos
   http://localhost:3000/admin/posts        → Gerenciar Posts
   http://localhost:3000/admin/users        → Gerenciar Usuários
   ```

3. **Estrutura do Admin**:
   ```
   📁 app/admin/
   ├── page.tsx              → Dashboard Admin
   ├── courses/
   │   ├── page.tsx         → Lista de Cursos
   │   └── edit/[id]/page.tsx → Editar Curso
   ├── videos/page.tsx       → Gerenciar Vídeos
   ├── posts/page.tsx        → Gerenciar Posts
   └── users/page.tsx        → Gerenciar Usuários
   ```

---

## 👥 Páginas da Comunidade

### Acesso à Comunidade
1. **URL Principal**: `http://localhost:3000/app/comunidade`

2. **Páginas Comunitárias**:
   ```
   http://localhost:3000/app/comunidade    → Página Principal da Comunidade
   http://localhost:3000/app/feed         → Feed de Atividades
   http://localhost:3000/app/busca        → Busca de Conteúdo
   http://localhost:3000/app/perfil       → Perfil do Usuário
   ```

3. **Estrutura da Comunidade**:
   ```
   📁 app/app/
   ├── comunidade/page.tsx     → Comunidade
   ├── feed/page.tsx           → Feed de Posts
   ├── busca/page.tsx          → Busca
   ├── perfil/page.tsx         → Perfil do Usuário
   └── aula/[courseId]/[videoId]/page.tsx → Aula Individual
   ```

---

## 📚 Páginas do Aluno

### Dashboard e Cursos
1. **Acesso Principal**: `http://localhost:3000/app`

2. **Páginas do Aluno**:
   ```
   http://localhost:3000/app                 → Dashboard Principal
   http://localhost:3000/app/perfil          → Perfil Gamificado
   http://localhost:3000/meus-cursos        → Meus Cursos
   http://localhost:3000/cursos             → Catálogo de Cursos
   http://localhost:3000/progress           → Progresso e Estatísticas
   http://localhost:3000/continue-watching  → Continuar Assistindo
   ```

3. **Páginas de Curso**:
   ```
   http://localhost:3000/course/[id]       → Página do Curso
   http://localhost:3000/app/aula/[courseId]/[videoId] → Aula Específica
   ```

---

## 🔑 Páginas de Autenticação

### Login e Cadastro
```
http://localhost:3000/login           → Login Principal
http://localhost:3000/signup          → Página de Cadastro
http://localhost:3000/esqueci-senha   → Recuperar Senha
http://localhost:3000/bem-vindo       → Boas-vindas
http://localhost:3000/onboarding      → Onboarding de Novo Usuário
```

### Configurações
```
http://localhost:3000/configuracoes   → Configurações do Perfil
http://localhost:3000/chat           → Chat/ Suporte
```

---

## 🧪 Páginas de Teste e Desenvolvimento

### Testes de UI/UX
```
http://localhost:3000/test-components     → Testar Componentes
http://localhost:3000/test-features       → Testar Funcionalidades
http://localhost:3000/test-footer         → Testar Footer
http://localhost:3000/test-social-proof   → Testar Prova Social
http://localhost:3000/test-ui-components  → Testar UI Components
http://localhost:3000/test-build          → Testar Build
```

### APIs para Teste
```
http://localhost:3000/api/test            → API de Teste
http://localhost:3000/test                → Página de Teste
```

---

## 💻 Acesso via Código

### Como Navegar Programaticamente

#### 1. Usando Next.js Router
```typescript
import { useRouter } from 'next/navigation';

// Em um componente React
const router = useRouter();

// Navegar para página admin
router.push('/admin');

// Navegar para comunidade
router.push('/app/comunidade');

// Navegar para curso específico
router.push('/course/123');
```

#### 2. Usando Link Component
```tsx
import Link from 'next/link';

// Links de navegação
<Link href="/admin">Painel Admin</Link>
<Link href="/app/comunidade">Comunidade</Link>
<Link href="/app/perfil">Meu Perfil</Link>
```

#### 3. Redirecionamento no Servidor
```typescript
// Em páginas ou middleware
import { redirect } from 'next/navigation';

// Redirecionar para admin
redirect('/admin');

// Redirecionar para dashboard
redirect('/app');
```

---

## 🗂️ Estrutura Completa de Pastas

### Admin Painel
```
📁 app/admin/
├── page.tsx                    # Dashboard Admin
├── courses/
│   ├── page.tsx               # Lista Cursos
│   └── edit/[id]/page.tsx     # Editar Curso
├── videos/page.tsx            # Gerenciar Vídeos
├── posts/page.tsx             # Gerenciar Posts
└── users/page.tsx             # Gerenciar Usuários
```

### App do Aluno
```
📁 app/app/
├── page.tsx                   # Dashboard Principal
├── comunidade/page.tsx        # Comunidade
├── feed/page.tsx              # Feed Social
├── perfil/page.tsx            # Perfil Gamificado
├── busca/page.tsx             # Busca
└── aula/[courseId]/[videoId]/page.tsx # Aula Individual
```

### Autenticação
```
📁 app/
├── login/page.tsx             # Login
├── signup/page.tsx            # Cadastro
├── esqueci-senha/page.tsx     # Recuperar Senha
├── bem-vindo/page.tsx         # Boas-vindas
└── onboarding/page.tsx        # Onboarding
```

### Páginas Públicas
```
📁 app/
├── page.tsx                   # Home/Landing
├── cursos/page.tsx            # Catálogo de Cursos
├── course/[id]/page.tsx       # Página do Curso
├── sobre/page.tsx             # Sobre
└── chat/page.tsx              # Chat/Suporte
```

---

## 🚀 Como Iniciar o Projeto

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

### 3. Acessar URLs
- Abra o navegador e vá para: `http://localhost:3000`

---

## 🎯 Fluxo de Navegação Recomendado

### Para Novos Usuários
1. `http://localhost:3000/` → Home Page
2. `http://localhost:3000/signup` → Criar Conta
3. `http://localhost:3000/onboarding` → Primeiros Passos
4. `http://localhost:3000/app` → Dashboard

### Para Administradores
1. `http://localhost:3000/login` → Login
2. `http://localhost:3000/admin` → Painel Admin
3. Gerenciar conteúdo em `/admin/courses`, `/admin/videos`, etc.

### Para Alunos
1. `http://localhost:3000/app` → Dashboard
2. `http://localhost:3000/app/comunidade` → Comunidade
3. `http://localhost:3000/meus-cursos` → Meus Cursos
4. `http://localhost:3000/progress` → Progresso

---

## 📱 Componentes Principais

### Componentes de UI
```
📁 components/ui/
├── Button.tsx                 # Botões
├── Card.tsx                   # Cards
├── Input.tsx                  # Campos de Input
├── Badge.tsx                  # Badges/Tags
├── StatsCard.tsx              # Cards de Estatísticas
└── ... (outros componentes)
```

### Componentes Gamificados
```
📁 components/gamification/
├── Notification.tsx           # Notificações
├── ProgressBar.tsx            # Barras de Progresso
├── AchievementCard.tsx        # Cards de Conquistas
├── LevelBadge.tsx             # Badges de Nível
└── ... (componentes de gamificação)
```

### Componentes de Vídeo
```
📁 components/video/
├── VideoPlayer.tsx            # Player de Vídeo
├── VideoCard.tsx              # Cards de Vídeo
├── VideoProgressIndicator.tsx # Indicadores de Progresso
└── ... (componentes de vídeo)
```

---

## 🔧 Dicas de Desenvolvimento

### 1. Como Adicionar Nova Página
1. Criar pasta em `app/` ou `app/app/`
2. Adicionar arquivo `page.tsx`
3. Acessar via URL correspondente

### 2. Como Criar Nova Rota Admin
1. Criar pasta em `app/admin/`
2. Adicionar arquivo `page.tsx`
3. Acessar via `/admin/nova-rota`

### 3. Como Proteger Rotas
```typescript
// Middleware ou em páginas
import { auth } from '@/lib/auth';

if (!auth) {
  redirect('/login');
}
```

---

## 📞 Suporte

### Como Obter Ajuda
1. **Página de Chat**: `http://localhost:3000/chat`
2. **Configurações**: `http://localhost:3000/configuracoes`
3. **Documentação**: Ver arquivos `.md` na pasta `doc/`

### Contato Mitsuo
- **Email**: Para contato direto
- **Comunidade**: `/app/comunidade`

---

## 🎉 Resumo Rápido

| Funcionalidade | URL |
|---------------|-----|
| 🏠 Home | `/` |
| 👤 Dashboard Aluno | `/app` |
| 🔧 Painel Admin | `/admin` |
| 👥 Comunidade | `/app/comunidade` |
| 📚 Meus Cursos | `/meus-cursos` |
| 📈 Progresso | `/progress` |
| 🎬 Vídeos | `/app/aula/[id]/[video]` |
| ⚙️ Configurações | `/configuracoes` |

**Para começar**: Acesse `http://localhost:3000` e explore todas as funcionalidades! 🚀