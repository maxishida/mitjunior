# Guia de Autenticação - Comunidade Flix

Este documento descreve o sistema completo de autenticação implementado para a Comunidade Flix, projetado para proporcionar uma experiência premium tipo Netflix/Monetizze.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Componentes Principais](#componentes-principais)
3. [Fluxos de Autenticação](#fluxos-de-autenticação)
4. [Segurança](#segurança)
5. [Analytics](#analytics)
6. [Configuração](#configuração)
7. [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

O sistema de autenticação foi completamente redesenhado para oferecer:

- **Experiência Premium**: Interface similar a Netflix/Monetizze
- **Múltiplos Métodos**: Email/senha, Google, Facebook
- **Onboarding Inteligente**: Flow personalizado para novos usuários
- **Segurança Avançada**: Rate limiting, proteção CSRF, validações
- **Analytics Completos**: Rastreamento de conversão e comportamento

## 🧩 Componentes Principais

### Components (`/components/auth/`)

#### `AuthForm.tsx`
Componente reutilizável para formulários de login e cadastro.

**Features:**
- Validação em tempo real
- Medidor de força de senha
- Social login integrado
- Remember me
- Layout responsivo premium

**Uso:**
```tsx
<AuthForm
  type="login" // ou "signup"
  onSubmit={handleSubmit}
  loading={loading}
/>
```

#### `PasswordRecovery.tsx`
Componente para recuperação de senha profissional.

**Features:**
- Flow com countdown
- Verificação de entrega
- Múltiplas tentativas
- Interface amigável

#### `OnboardingFlow.tsx`
Flow completo de onboarding personalizado.

**Features:**
- Multi-step progressivo
- Coleta de preferências
- Gamificação
- Persistência de dados

#### `SocialAuthButtons.tsx`
Botões para autenticação social.

**Features:**
- Google e Facebook
- Tratamento de erros
- Analytics integrados
- Loading states

### Páginas (`/app/`)

#### `/login` - Página de Login Premium
- Layout split-screen tipo Netflix
- Conteúdo marketing à esquerda
- Formulário de login à direita
- Social proof e badges de segurança

#### `/cadastro` - Cadastro Multi-step
- Step 1: Dados principais + social auth
- Step 2: Informações adicionais
- Coleta de dados para personalização
- Otimizado para conversão

#### `/esqueci-senha` - Recuperação Profissional
- Interface clean e moderna
- Múltiplos métodos de recuperação
- Segurança com tokens únicos

#### `/onboarding` - Flow Inteligente
- Bem-vindo personalizado
- Definição de objetivos
- Configuração de preferências
- Tutorial gamificado

#### `/bem-vindo` - Pós-cadastro
- Confirmação de sucesso
- Presente de boas-vindas
- Próximos passos
- Acesso rápido

## 🔄 Fluxos de Autenticação

### 1. Login por Email/Senha
```
Usuario preenche formulário → Validação → Firebase Auth → Sessão → Redirect
```

### 2. Social Login
```
Usuario clica no botão → Popup provider → Firebase Auth → Criar/Atualizar usuário → Sessão
```

### 3. Cadastro
```
Step 1: Email/senha → Step 2: Dados adicionais → Firebase Auth → Firestore → Onboarding
```

### 4. Recuperação de Senha
```
Email → Token único → Link seguro → Redefinição → Confirmação
```

## 🔒 Segurança

### Rate Limiting
- **Login**: 5 tentativas por 15 minutos
- **Cadastro**: 3 tentativas por hora
- **Reset de senha**: 3 tentativas por hora
- **Social auth**: 10 tentativas por 15 minutos

### Proteções
- CSRF protection
- XSS prevention
- Secure cookies
- Session management
- Device tracking

### Validações
- Email format validation
- Password strength meter
- Real-time field validation
- Sanitização de inputs

## 📊 Analytics

### Eventos Rastreados
- `page_view` - Visualizações de página
- `sign_up` - Cadastros
- `login` - Logins
- `form_interaction` - Interações com formulários
- `social_auth` - Autenticação social
- `onboarding_step` - Progresso no onboarding
- `conversion` - Eventos de conversão

### Conversão
- Taxa de cadastro
- Taxa de login
- Abandono de formulário
- Tempo de conclusão
- Engajamento pós-cadastro

### Ferramentas Integradas
- Google Analytics 4
- Google Ads
- Facebook Pixel
- Hotjar
- Analytics customizado

## ⚙️ Configuração

### Variáveis de Ambiente
```bash
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_AW_ID=AW-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=XXXXXX

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
```

### Firebase Config
1. Ativar Email/Password Authentication
2. Configurar Google Provider
3. Configurar Facebook Provider
4. Ativar Firestore Database
5. Configurar regras de segurança

### Middleware Config
O middleware em `lib/middleware.ts` protege automaticamente:
- Rotas autenticadas
- Redirecionamentos inteligentes
- Validação de sessão
- Cache de autenticação

## 🚀 Deploy e Configuração

### 1. Firebase Setup
```bash
# Instalar Firebase Admin
npm install firebase-admin

# Configurar service account
# Download do JSON do console Firebase
```

### 2. Environment Variables
Copiar `.env.example` para `.env.local` e preencher as variáveis.

### 3. Database Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Auth logs are write-only
    match /auth_logs/{logId} {
      allow create: if request.auth != null;
    }

    // Analytics events are write-only
    match /analytics_events/{eventId} {
      allow create: if request.auth != null;
    }
  }
}
```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. "Too many requests"
**Causa:** Rate limiting ativado
**Solução:** Aguardar o período de reset ou limpar o cache

#### 2. "Invalid session"
**Causa:** Sessão expirada ou inválida
**Solução:** Fazer login novamente

#### 3. Social login não funciona
**Causa:** Configuração OAuth incorreta
**Solução:** Verificar client IDs e domains autorizados

#### 4. Redirect loop
**Causa:** Middleware configurado incorretamente
**Solução:** Verificar as rotas públicas vs protegidas

### Debug Mode
Para ativar debug mode:
```bash
NODE_ENV=development npm run dev
```

### Logs
Verificar os seguintes logs:
- Browser console (erros de client)
- Firebase Functions logs
- Vercel/Deploy logs (se aplicável)

## 📈 Performance

### Otimizações Implementadas
- Lazy loading de componentes
- Code splitting por rota
- Cache de autenticação
- Imagens otimizadas
- Minificação de CSS/JS

### Métricas Alvo
- Tempo de carregamento < 2s
- Taxa de conversão > 15%
- Bounce rate < 30%
- Core Web Vitals "Good"

## 🔄 Updates e Manutenção

### Checklist Semanal
- [ ] Verificar logs de erros
- [ ] Analisar métricas de conversão
- [ ] Revisar rate limits
- [ ] Atualizar dependências

### Checklist Mensal
- [ ] Análise de segurança
- [ ] Otimização de performance
- [ ] Review de analytics
- [ ] Backup de configurações

## 📞 Suporte

### Canais de Suporte
- **Email:** suporte@comunidadeflix.com
- **WhatsApp:** (11) 99999-9999
- **Documentação:** https://docs.comunidadeflix.com

### Escalation
1. Primeiro nível: Suporte via email/WhatsApp
2. Segundo nível: Desenvolvedor sênior
3. Terceiro nível: Arquiteto de sistemas

---

**Última atualização:** Outubro 2024
**Versão:** 2.0.0
**Responsável:** Time de Desenvolvimento Comunidade Flix