@echo off
REM =============================================================================
REM COMUNIDADE FLIX - AUTOMATED DEPLOYMENT SCRIPT (WINDOWS)
REM =============================================================================
REM Este script realiza o deploy completo da aplicação em produção
REM =============================================================================

setlocal enabledelayedexpansion

REM Configuration
set PROJECT_NAME=Comunidade Flix
set FIREBASE_PROJECT=mitjunior
set DOMAIN=mitsuoishida.com
set DEPLOY_BRANCH=main

REM Colors (Windows doesn't support ANSI colors by default, so we'll use simple text)
echo ==============================================================================
echo 🚀 COMUNIDADE FLIX - PRODUCTION DEPLOY
echo ==============================================================================
echo.

REM Pre-flight checks
echo [INFO] Iniciando pre-flight checks...

REM Check if we're on the correct branch
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%i
if not "%CURRENT_BRANCH%"=="%DEPLOY_BRANCH%" (
    echo [ERROR] Voce nao esta na branch %DEPLOY_BRANCH%. Branch atual: %CURRENT_BRANCH%
    exit /b 1
)

REM Check environment variables
if not exist ".env.production" (
    echo [ERROR] Arquivo .env.production nao encontrado!
    exit /b 1
)

REM Check Firebase CLI
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Firebase CLI nao esta instalado. Execute: npm install -g firebase-tools
    exit /b 1
)

echo [SUCCESS] Pre-flight checks concluidos!

REM Step 1: Clean previous build
echo [INFO] Limpando build anterior...
if exist ".next" rmdir /s /q ".next"
if exist "out" rmdir /s /q "out"
if exist "dist" rmdir /s /q "dist"
echo [SUCCESS] Limpeza concluida!

REM Step 2: Install dependencies
echo [INFO] Instalando dependencias...
call npm ci
echo [SUCCESS] Dependencias instaladas!

REM Step 3: Type checking
echo [INFO] Verificando tipos TypeScript...
call npm run type-check
echo [SUCCESS] TypeScript check passou!

REM Step 4: Build application
echo [INFO] Fazendo build da aplicacao...
set NODE_ENV=production
call npm run build
echo [SUCCESS] Build concluido com sucesso!

REM Step 5: Firebase deployment
echo [INFO] Preparando deployment Firebase...

REM Deploy Firestore rules
echo [INFO] Deploy das regras do Firestore...
call firebase deploy --only firestore:rules --project %FIREBASE_PROJECT%

REM Deploy Storage rules
echo [INFO] Deploy das regras do Storage...
call firebase deploy --only storage --project %FIREBASE_PROJECT%

REM Step 6: Deploy to Firebase Hosting
echo [INFO] Deploy para Firebase Hosting...
call firebase deploy --only hosting --project %FIREBASE_PROJECT%

REM Step 7: Verification
echo [INFO] Verificando deployment...

REM Open the deployed site
echo [INFO] Abrindo site no navegador...
start https://%DOMAIN%

echo.
echo ==============================================================================
echo 🎉 DEPLOY CONCLUIDO COM SUCESSO!
echo ==============================================================================
echo.
echo 📍 URL: https://%DOMAIN%
echo 🔥 Firebase Console: https://console.firebase.google.com/project/%FIREBASE_PROJECT%
echo.
echo Próximos passos:
echo 1. Monitore o performance no Firebase Console
echo 2. Verifique os logs de erro
echo 3. Teste todas as funcionalidades críticas
echo.
echo Deploy realizado em: %date% %time%
echo Branch: %CURRENT_BRANCH%
echo.
echo [SUCCESS] Deploy finalizado! 🚀

pause