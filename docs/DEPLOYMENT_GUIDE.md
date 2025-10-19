# Deployment Guide - Comunidade Flix

## Overview

Este guia cobre o deployment completo do backend da Comunidade Flix, incluindo Firebase configuration, Cloud Functions, API endpoints, monitoring e segurança.

## Prerequisites

- Node.js 18+
- Firebase CLI
- Google Cloud CLI
- Conta Firebase com projeto configurado
- Domínio customizado (opcional)

## Environment Setup

### 1. Firebase Project Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login no Firebase
firebase login

# Criar novo projeto
firebase projects:create comunidadeflix-prod

# Inicializar projeto
firebase init functions
firebase init firestore
firebase init hosting
```

### 2. Environment Variables

Crie arquivo `.env.production`:

```env
# Firebase
FIREBASE_PROJECT_ID=comunidadeflix-prod
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Database
FIRESTORE_DATABASE_ID="(default)"

# Storage
STORAGE_BUCKET=comunidadeflix-prod.appspot.com

# Security
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_32_character_encryption_key

# Monitoring
SENTRY_DSN=your_sentry_dsn
LOG_LEVEL=info

# External Services
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
EMAIL_SERVICE_API_KEY=your_email_api_key

# Application
NODE_ENV=production
API_BASE_URL=https://api.comunidadeflix.com
FRONTEND_URL=https://comunidadeflix.com
```

### 3. Firebase Configuration

#### firebase.json

```json
{
  "functions": {
    "source": "lib/functions",
    "runtime": "nodejs18",
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run lint",
      "npm --prefix \"$RESOURCE_DIR\" run build"
    ],
    "ignore": [
      "node_modules",
      ".git",
      "firebase-debug.log",
      "firebase-debug.*.log"
    ],
    "env": {
      "NODE_ENV": "production"
    }
  },
  "firestore": {
    "rules": "firestore.rules.prod",
    "indexes": "lib/schema/firestore-indexes.json"
  },
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "storage": {
    "rules": "storage.rules"
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "functions": {
      "port": 5001
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    },
    "storage": {
      "port": 9199
    },
    "ui": {
      "enabled": true
    }
  }
}
```

## Database Setup

### 1. Firestore Collections

Execute os scripts para criar collections e indexes:

```bash
# Deploy indexes
firebase deploy --only firestore:indexes

# Deploy security rules
firebase deploy --only firestore:rules
```

### 2. Initial Data

Crie script `scripts/initialize-data.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'comunidadeflix-prod'
});

const db = admin.firestore();

async function initializeData() {
  // Create system configurations
  await db.collection('systemConfig').doc('gamification').set({
    key: 'gamification',
    type: 'settings',
    value: {
      pointsPerVideo: 10,
      pointsPerCourse: 100,
      levelUpBonus: 50,
      streakBonus: 20
    },
    isEditable: true,
    category: 'gamification',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // Create default achievements
  const achievements = [
    {
      title: 'Primeiros Passos',
      description: 'Assista seu primeiro vídeo',
      category: 'learning',
      type: 'progress',
      requirements: { type: 'video_completed', value: 1 },
      points: 50,
      badge: { type: 'bronze', color: '#CD7F32' },
      isActive: true
    },
    // ... more achievements
  ];

  for (const achievement of achievements) {
    await db.collection('achievements').add({
      ...achievement,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  console.log('Data initialized successfully');
  process.exit(0);
}

initializeData().catch(console.error);
```

### 3. Execute Initialization

```bash
node scripts/initialize-data.js
```

## Cloud Functions Deployment

### 1. Package.json for Functions

```json
{
  "name": "comunidadeflix-functions",
  "scripts": {
    "lint": "eslint .",
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  },
  "main": "lib/functions/index.js",
  "dependencies": {
    "@google-cloud/storage": "^6.9.0",
    "firebase-admin": "^11.10.1",
    "firebase-functions": "^4.4.1",
    "stripe": "^12.18.0"
  },
  "devDependencies": {
    "@types/node": "^18.18.5",
    "typescript": "^5.2.2",
    "firebase-functions-test": "^3.1.0"
  }
}
```

### 2. Deploy Functions

```bash
# Build and deploy
npm run build
firebase deploy --only functions

# Verify deployment
firebase functions:list
```

## API Configuration

### 1. Next.js API Routes

Configure middleware em `middleware.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/firebase-admin';

export async function middleware(request: NextRequest) {
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### 2. API Health Check

Configure health check em `app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    // Test database connection
    await db.collection('health').doc('test').get();

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        api: 'healthy'
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message
    }, { status: 503 });
  }
}
```

## Security Configuration

### 1. Security Rules

Deploy security rules atualizadas:

```bash
# Deploy production rules
firebase deploy --only firestore:rules

# Verify rules
firebase firestore:rules:list
```

### 2. Environment Security

```bash
# Set secure environment variables in Firebase
firebase functions:config:set \
  env.production="true" \
  jwt.secret="$JWT_SECRET" \
  encryption.key="$ENCRYPTION_KEY"
```

### 3. API Keys and Secrets

Use Firebase Secret Manager:

```typescript
// Access secrets in functions
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

async function accessSecret(secretName) {
  const client = new SecretManagerServiceClient();
  const version = await client.accessSecretVersion({
    name: `projects/${process.env.GCLOUD_PROJECT}/secrets/${secretName}/versions/latest`
  });

  return version.payload.data.toString();
}
```

## Monitoring Setup

### 1. Error Reporting

Configure Sentry em `lib/monitoring/sentry.ts`:

```typescript
import * as Sentry from '@sentry/nextjs';

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    beforeSend(event) {
      // Filter out sensitive data
      if (event.exception) {
        delete event.user;
      }
      return event;
    }
  });
}
```

### 2. Performance Monitoring

```typescript
// Em app/api/**/*.ts
import { metrics } from '@/lib/monitoring/metrics.service';

export async function GET(request: Request) {
  const startTime = Date.now();

  try {
    // ... API logic

    metrics.recordHistogram('api_request_duration_seconds', (Date.now() - startTime) / 1000, {
      method: 'GET',
      endpoint: request.url,
      status_code: '200'
    });

    return NextResponse.json(data);
  } catch (error) {
    metrics.incrementCounter('api_errors_total', 1, {
      method: 'GET',
      endpoint: request.url,
      error_type: error.name
    });

    throw error;
  }
}
```

### 3. Health Check Dashboard

Configure monitoramento contínuo:

```typescript
// scripts/health-check.js
setInterval(async () => {
  try {
    const response = await fetch('https://api.comunidadeflix.com/api/health');
    const health = await response.json();

    if (health.status !== 'healthy') {
      // Send alert
      await sendAlert('API Health Check Failed', health);
    }
  } catch (error) {
    await sendAlert('API Health Check Error', error.message);
  }
}, 60000); // Check every minute
```

## Deployment Pipeline

### 1. GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: success()
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: comunidadeflix-prod
```

### 2. Environment Variables in GitHub

Configure secrets no GitHub:

- `FIREBASE_SERVICE_ACCOUNT`
- `SENTRY_DSN`
- `STRIPE_SECRET_KEY`

## Performance Optimization

### 1. CDN Configuration

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['storage.googleapis.com'],
    loader: 'custom',
    loaderFile: './lib/image-loader.js'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.comunidadeflix.com/api/:path*'
      }
    ];
  }
};
```

### 2. Caching Strategy

```typescript
// lib/cache.service.ts
export class CacheService {
  private cache = new Map();
  private ttl = 5 * 60 * 1000; // 5 minutes

  async get(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }
    return null;
  }

  async set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}
```

## Production Checklist

### Pre-deployment Checklist:

- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] Security rules deployed
- [ ] SSL certificates configured
- [ ] Domain DNS configured
- [ ] Monitoring setup
- [ ] Error reporting configured
- [ ] Backup strategy implemented
- [ ] Load testing completed
- [ ] Security audit performed

### Post-deployment Checklist:

- [ ] Health checks passing
- [ ] Monitoring alerts configured
- [ ] Performance metrics collected
- [ ] Error tracking active
- [ ] User access verified
- [ ] Payment processing tested
- [ ] Email delivery working
- [ ] File uploads functional

## Troubleshooting

### Common Issues:

1. **Cold Start Delays**
   ```bash
   # Keep functions warm
   firebase functions:config:set runtime.minInstances=1
   ```

2. **Memory Issues**
   ```bash
   # Increase memory allocation
   firebase functions:config:set runtime.memory="1GB"
   ```

3. **Database Performance**
   ```bash
   # Check indexes
   firebase firestore:indexes list
   ```

### Monitoring Commands:

```bash
# View function logs
firebase functions:log

# Check database usage
firebase firestore:databases describe

# Monitor performance
firebase monitoring dashboard
```

## Support and Maintenance

### Regular Maintenance Tasks:

1. **Weekly**: Review error logs and performance metrics
2. **Monthly**: Update dependencies and security patches
3. **Quarterly**: Review and optimize database queries
4. **Annually**: Security audit and architecture review

### Emergency Procedures:

1. **Service Outage**: Check Firebase status dashboard
2. **Data Corruption**: Restore from recent backup
3. **Security Breach**: Follow incident response plan

---

*Este guia cobre o deployment completo da plataforma. Para suporte adicional, consulte a documentação do Firebase ou entre em contato com a equipe de desenvolvimento.*