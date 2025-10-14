# 🤖 Guia para Agentes de IA - Projeto ComunidadeFlix

**Data de criação:** 2025-10-10
**Status:** Workspace Firebase Studio Ativo
**Porta de Produção:** 9002 (PROTEGIDA - NÃO FECHAR)

---

## ⚠️ REGRAS CRÍTICAS - LEIA PRIMEIRO

### 🚨 NUNCA FAÇA ISSO:
1. **NÃO FECHE a porta 9002** - É o servidor de desenvolvimento Next.js em produção
2. **NÃO MODIFIQUE** arquivos sem antes ler e entender o contexto completo
3. **NÃO DELETE** arquivos de configuração Firebase (`.firebaserc`, `firebase.json`)
4. **NÃO ALTERE** variáveis de ambiente sem documentar
5. **NÃO EXECUTE** comandos destrutivos (`rm -rf`, `git reset --hard`, etc)

### ✅ SEMPRE FAÇA ISSO:
1. **LEIA** os arquivos de documentação em `/doc/` antes de qualquer ação
2. **VERIFIQUE** o status dos processos com `ps aux | grep node` antes de parar serviços
3. **DOCUMENTE** todas as alterações significativas
4. **TESTE** mudanças em ambiente local antes de aplicar em produção
5. **MANTENHA** backup de arquivos críticos antes de modificar

---

## 📊 STATUS ATUAL DO AMBIENTE

### Processos em Execução (NÃO INTERROMPER):
```bash
# Servidor Next.js (PORTA 9002 - PRODUÇÃO)
PID: 47995 - next dev --turbopack --port 9002 --hostname 0.0.0.0
PID: 48076 - next-server (v15.5.4)

# Servidor Firebase Init (em execução)
PID: 16445 - firebase init hosting

# Preview Server & Capra
PID: 13 - previewserver.js
PID: 14 - capra-management-server.js
```

### Portas Utilizadas:
- **9002** - Next.js Development Server (PROTEGIDA)
- **80** - Preview Server
- **6000** - Capra Management

---

## 📁 ESTRUTURA COMPLETA DO PROJETO

### Arquivos de Configuração Principal:
```
/home/user/mitjunior/
├── package.json              # Dependências e scripts
├── next.config.ts            # Config Next.js (ignoreBuildErrors ativado)
├── tsconfig.json             # Config TypeScript
├── firebase.json             # Config Firebase Hosting
├── .firebaserc               # Projeto Firebase: "mitjunior"
├── middleware.ts             # Proteção de rotas /admin
├── .env.local                # Variáveis de ambiente (NÃO VERSIONADO)
└── .env.local.example        # Template de variáveis
```

### Estrutura de Código:
```
app/                          # Next.js App Router
├── page.tsx                  # Homepage (/)
├── layout.tsx                # Layout raiz
├── globals.css               # Estilos globais
│
├── login/page.tsx            # Autenticação
├── signup/page.tsx           # Cadastro
│
├── admin/                    # Painel Administrativo (protegido)
│   ├── page.tsx              # Dashboard admin
│   ├── courses/
│   │   ├── page.tsx          # Lista de cursos
│   │   └── edit/[id]/page.tsx # Edição de curso
│   ├── videos/page.tsx       # Gestão de vídeos
│   ├── posts/page.tsx        # Moderação de posts
│   └── users/page.tsx        # Lista de usuários
│
├── course/[id]/page.tsx      # Visualização de curso
├── chat/page.tsx             # Chat em tempo real
├── feed/page.tsx             # Feed de posts
│
└── api/                      # Backend APIs
    ├── auth/session/route.ts # Gerenciamento de sessão
    └── users/route.ts        # Listagem de usuários (Admin)

components/                   # Componentes React
├── Navbar.tsx                # Barra de navegação
├── HomeClient.tsx            # Homepage client-side
└── CourseCarousel.tsx        # Carrossel de cursos

context/
└── AuthContext.tsx           # Estado global de autenticação

lib/                          # Configurações auxiliares
├── firebase.config.ts        # Firebase Client SDK
├── firebase.config.example.ts
└── firebase.admin.config.ts  # Firebase Admin SDK

doc/                          # Documentação
├── blueprint.md              # Planejamento original
├── relatorio.md              # Relatório de implementação
└── AI_AGENT_GUIDE.md         # Este arquivo
```

---

## 🔥 CONFIGURAÇÃO FIREBASE

### Projeto Firebase:
- **Nome:** mitjunior
- **Região:** us-central1
- **Hosting:** Configurado com frameworks backend

### Configuração Atual (`firebase.json`):
```json
{
  "hosting": {
    "source": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "frameworksBackend": {
      "region": "us-central1"
    }
  }
}
```

### Serviços Firebase em Uso:
1. **Authentication** - Login/cadastro de usuários
2. **Firestore Database** - Armazenamento de dados (cursos, posts, chat)
3. **Storage** - Upload de vídeos e imagens
4. **Hosting** - Deploy da aplicação

### Variáveis de Ambiente Necessárias:
```env
# Firebase Client (frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (backend)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Admin UID
ADMIN_UID=
```

---

## 🛠️ STACK TECNOLÓGICO

### Core:
- **Framework:** Next.js 15.5.4 (App Router + Turbopack)
- **Runtime:** Node.js 20.19.1
- **Linguagem:** TypeScript 5

### Frontend:
- **React:** 19.1.0
- **UI Library:** Bootstrap 5.3.8 + React-Bootstrap 2.10.10
- **Hooks:** react-firebase-hooks 5.1.1

### Backend:
- **Firebase SDK:** 12.3.0 (client)
- **Firebase Admin SDK:** 13.5.0 (server)

### Ferramentas:
- **Build Tool:** Turbopack (Next.js)
- **Package Manager:** npm
- **Firebase CLI:** 14.19.1

---

## 📖 DOCUMENTAÇÃO FIREBASE ESSENCIAL

### Links Importantes:
1. **Docs Principais:** https://firebase.google.com/docs?hl=pt-br
2. **Authentication:** https://firebase.google.com/docs/auth/web/start
3. **Firestore:** https://firebase.google.com/docs/firestore
4. **Storage:** https://firebase.google.com/docs/storage/web/start
5. **Hosting com Next.js:** https://firebase.google.com/docs/hosting/frameworks/nextjs

### Conceitos-Chave para Next.js + Firebase:

#### 1. Autenticação:
- **Client-side:** Use Firebase SDK no frontend para login/signup
- **Server-side:** Use Firebase Admin SDK para validar tokens
- **Middleware:** Proteção de rotas via cookies de sessão

#### 2. Firestore:
- **Client-side:** Leitura em tempo real com listeners
- **Server-side:** Operações privilegiadas com Admin SDK
- **Security Rules:** Configurar regras no Firebase Console

#### 3. Storage:
- **Upload:** Client-side com Firebase Storage SDK
- **Download URLs:** Gerar URLs públicas para vídeos/imagens
- **Security Rules:** Controlar acesso por autenticação

#### 4. Hosting:
- **Frameworks Backend:** Suporte nativo para Next.js
- **Deploy:** `firebase deploy --only hosting`
- **Preview:** `firebase hosting:channel:deploy CHANNEL_NAME`

---

## 🔒 SEGURANÇA IMPLEMENTADA

### Middleware de Proteção (`middleware.ts`):
```typescript
// Protege rotas /admin
// Redireciona usuários não autenticados para /login
// Redireciona usuários autenticados de /login para homepage
```

### Autenticação de Sessão:
- **API Route:** `/api/auth/session`
- **Cookie:** httpOnly, secure, sameSite
- **Validação:** Firebase Admin SDK no servidor

### Permissões Admin:
- **Verificação:** Por UID em variáveis de ambiente
- **Endpoints Protegidos:** `/api/users`, todas as rotas `/admin/*`

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### ✅ Completo (100%):
1. Sistema de autenticação (login/signup/logout)
2. Homepage com carrosséis de cursos
3. Player de vídeo integrado
4. Feed de posts em tempo real
5. Chat interno
6. Painel admin completo:
   - CRUD de cursos
   - Upload de vídeos
   - Moderação de posts
   - Gestão de usuários
7. Design responsivo estilo Netflix
8. Skeleton loaders e estados vazios

### 🔧 Melhorias Futuras (Sugestões):
1. Testes automatizados (Jest + React Testing Library)
2. CI/CD pipeline
3. Otimização de imagens (next/image)
4. PWA support
5. Analytics e monitoramento
6. Rate limiting em APIs
7. Backup automático do Firestore

---

## 📝 COMANDOS ÚTEIS

### Desenvolvimento:
```bash
# Iniciar servidor de desenvolvimento (JÁ RODANDO NA PORTA 9002)
npm run dev

# Build de produção
npm run build

# Iniciar servidor de produção
npm start
```

### Firebase:
```bash
# Login no Firebase
firebase login

# Listar projetos
firebase projects:list

# Deploy completo
firebase deploy

# Deploy apenas hosting
firebase deploy --only hosting

# Emuladores locais
firebase emulators:start
```

### Verificação de Processos:
```bash
# Ver processos Node.js
ps aux | grep node

# Verificar porta específica
lsof -i :9002

# Ver logs do servidor
tail -f /tmp/ai.1.log
```

---

## 🚀 WORKFLOW RECOMENDADO PARA AGENTES

### Antes de Qualquer Modificação:
1. **Ler documentação:**
   - `/doc/blueprint.md` - Visão do projeto
   - `/doc/relatorio.md` - Status de implementação
   - Este arquivo (`AI_AGENT_GUIDE.md`)

2. **Verificar contexto:**
   - Ler arquivo a ser modificado
   - Entender dependências
   - Verificar impacto em outros componentes

3. **Planejar:**
   - Criar lista de tarefas (TodoWrite)
   - Identificar riscos
   - Preparar rollback se necessário

### Durante Modificações:
1. **Fazer backup** de arquivos críticos
2. **Testar incrementalmente** cada mudança
3. **Documentar** alterações no código (comentários)
4. **Atualizar** documentação relevante

### Após Modificações:
1. **Testar** funcionalidades afetadas
2. **Verificar** se servidor ainda está rodando
3. **Atualizar** este guia se necessário
4. **Documentar** problemas encontrados

---

## 🐛 TROUBLESHOOTING

### Servidor não inicia:
```bash
# Verificar se porta 9002 está ocupada
lsof -i :9002

# Limpar cache do Next.js
rm -rf .next

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erros de Build:
- **Erro de tipo:** `next.config.ts` tem `ignoreBuildErrors: true` (investigar futuramente)
- **Erro de módulo:** Verificar `package.json` e reinstalar
- **Erro de Firebase:** Verificar variáveis de ambiente

### Erros de Autenticação:
- Verificar Firebase Admin credentials
- Validar tokens de sessão
- Checar regras de segurança no Firebase Console

---

## 📚 REFERÊNCIAS

### Documentação Oficial:
- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs (PT-BR)](https://firebase.google.com/docs?hl=pt-br)
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

### Arquivos de Referência do Projeto:
- `/doc/blueprint.md` - Planejamento original
- `/doc/relatorio.md` - Relatório completo de implementação
- `/README.md` - Instruções básicas Next.js

---

## 📞 INFORMAÇÕES DE CONTATO

**Projeto:** ComunidadeFlix
**Workspace:** Firebase Studio
**Ambiente:** IDX Project
**Última atualização deste guia:** 2025-10-10

---

## ⚡ QUICK REFERENCE

### Arquivos Mais Importantes:
```
middleware.ts                 # Segurança de rotas
lib/firebase.config.ts        # Config Firebase client
lib/firebase.admin.config.ts  # Config Firebase admin
context/AuthContext.tsx       # Estado de autenticação
app/api/auth/session/route.ts # Gestão de sessão
```

### Comandos de Emergência:
```bash
# Parar servidor na porta 9002 (CUIDADO!)
kill $(lsof -t -i:9002)

# Reiniciar servidor
npm run dev -- --port 9002

# Ver logs em tempo real
tail -f firebase-debug.log
```

### Variáveis Críticas:
- `ADMIN_UID` - UID do administrador
- `FIREBASE_PRIVATE_KEY` - Chave privada do Firebase Admin
- `NEXT_PUBLIC_FIREBASE_API_KEY` - API key pública

---

**🤖 Este guia foi criado para auxiliar agentes de IA a trabalharem de forma segura e eficiente no projeto ComunidadeFlix. Sempre priorize a leitura e compreensão antes da ação.**
