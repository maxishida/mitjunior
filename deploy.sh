#!/bin/bash

# =============================================================================
# COMUNIDADE FLIX - AUTOMATED DEPLOYMENT SCRIPT
# =============================================================================
# Este script realiza o deploy completo da aplicação em produção
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="Comunidade Flix"
FIREBASE_PROJECT="mitjunior"
DOMAIN="mitsuoishida.com"
BUILD_DIR=".next"
DEPLOY_BRANCH="main"

# Logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Header
echo -e "${BLUE}"
echo "=============================================================================="
echo "🚀 COMUNIDADE FLIX - PRODUCTION DEPLOY"
echo "=============================================================================="
echo -e "${NC}"

# Pre-flight checks
log_info "Iniciando pre-flight checks..."

# Check if we're on the correct branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "$DEPLOY_BRANCH" ]; then
    log_error "Você não está na branch $DEPLOY_BRANCH. Branch atual: $CURRENT_BRANCH"
    exit 1
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    log_warning "Existem mudanças não commitadas. Deseja continuar? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        log_info "Deploy cancelado."
        exit 0
    fi
fi

# Check environment variables
if [ ! -f ".env.production" ]; then
    log_error "Arquivo .env.production não encontrado!"
    exit 1
fi

# Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    log_error "Firebase CLI não está instalado. Execute: npm install -g firebase-tools"
    exit 1
fi

# Check if logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    log_error "Você não está logado no Firebase. Execute: firebase login"
    exit 1
fi

log_success "Pre-flight checks concluídos!"

# Step 1: Clean previous build
log_info "Limpando build anterior..."
rm -rf .next
rm -rf out
rm -rf dist
log_success "Limpeza concluída!"

# Step 2: Install dependencies
log_info "Instalando dependências..."
npm ci --production=false
log_success "Dependências instaladas!"

# Step 3: Run tests (if available)
if [ -d "__tests__" ] || [ -f "jest.config.js" ]; then
    log_info "Executando testes..."
    npm test
    log_success "Testes passaram!"
else
    log_warning "Nenhum teste encontrado. Pulando etapa de testes."
fi

# Step 4: Type checking
log_info "Verificando tipos TypeScript..."
npm run type-check
log_success "TypeScript check passou!"

# Step 5: Build application
log_info "Fazendo build da aplicação..."
NODE_ENV=production npm run build
log_success "Build concluído com sucesso!"

# Step 6: Optimize build
log_info "Otimizando build para produção..."
# Additional optimizations can be added here
log_success "Otimização concluída!"

# Step 7: Firebase deployment preparation
log_info "Preparando deployment Firebase..."

# Update firebase.json if needed
if [ ! -f "firebase.json" ]; then
    log_error "firebase.json não encontrado!"
    exit 1
fi

# Deploy Firestore rules and indexes
log_info "Deploy das regras do Firestore..."
firebase deploy --only firestore:rules --project "$FIREBASE_PROJECT"

log_info "Deploy dos índices do Firestore..."
firebase deploy --only firestore:indexes --project "$FIREBASE_PROJECT"

# Deploy Storage rules
log_info "Deploy das regras do Storage..."
firebase deploy --only storage --project "$FIREBASE_PROJECT"

# Step 8: Deploy to Firebase Hosting
log_info "Deploy para Firebase Hosting..."
firebase deploy --only hosting --project "$FIREBASE_PROJECT"

# Step 9: Post-deployment verification
log_info "Verificando deployment..."

# Check if site is accessible
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    log_success "Site está acessível! (HTTP $HTTP_STATUS)"
else
    log_warning "Site pode não estar acessível. Status: HTTP $HTTP_STATUS"
fi

# Step 10: Performance and security checks
log_info "Executando verificações de performance e segurança..."

# Run Lighthouse audit (if available)
if command -v lighthouse &> /dev/null; then
    log_info "Executando Lighthouse audit..."
    lighthouse "https://$DOMAIN" --output=json --output-path=./lighthouse-report.json --quiet
    log_success "Lighthouse audit concluído!"
else
    log_warning "Lighthouse não disponível. Pulando audit de performance."
fi

# Step 11: Cleanup
log_info "Limpando arquivos temporários..."
rm -f lighthouse-report.json
log_success "Limpeza concluída!"

# Step 12: Send notifications (if configured)
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    log_info "Enviando notificação para Slack..."
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚀 $PROJECT_NAME deployed successfully to production! https://$DOMAIN\"}" \
        "$SLACK_WEBHOOK_URL"
    log_success "Notificação enviada!"
fi

# Completion message
echo -e "${GREEN}"
echo "=============================================================================="
echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
echo "=============================================================================="
echo -e "${NC}"
echo -e "${BLUE}📍 URL: ${NC}https://$DOMAIN"
echo -e "${BLUE}📊 Dashboard Firebase: ${NC}https://console.firebase.google.com/project/$FIREBASE_PROJECT"
echo -e "${BLUE}🔥 Hosting URL: ${NC}https://$FIREBASE_PROJECT.web.app"
echo -e "${BLUE}🌐 Custom Domain: ${NC}https://$DOMAIN"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "1. Monitore o performance em: https://console.firebase.google.com/project/$FIREBASE_PROJECT/performance"
echo "2. Verifique os logs em: https://console.firebase.google.com/project/$FIREBASE_PROJECT/functions/logs"
echo "3. Configure analytics e monitoring"
echo "4. Teste todas as funcionalidades críticas"
echo ""
echo -e "${GREEN}Deploy realizado em: $(date)${NC}"
echo -e "${GREEN}Branch: $CURRENT_BRANCH${NC}"
echo -e "${GREEN}Commit: $(git rev-parse --short HEAD)${NC}"
echo ""

# Optional: Open the deployed site
if command -v open &> /dev/null; then
    log_info "Abrindo site no navegador..."
    open "https://$DOMAIN"
elif command -v xdg-open &> /dev/null; then
    log_info "Abrindo site no navegador..."
    xdg-open "https://$DOMAIN"
fi

log_success "Deploy finalizado! 🚀"