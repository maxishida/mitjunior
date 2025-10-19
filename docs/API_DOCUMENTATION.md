# Comunidade Flix - API Documentation

## Overview

A Comunidade Flix API é uma API RESTful construída com Next.js e Firebase, projetada para fornecer uma plataforma de educação financeira escalável e segura. Esta documentação cobre todos os endpoints, autenticação, modelos de dados e melhores práticas.

## Base URL

```
Development: https://localhost:3000/api
Production: https://api.comunidadeflix.com/api
```

## Authentication

A API utiliza Firebase Authentication para autenticação. Todos os endpoints (exceto os públicos) requerem um token JWT no header `Authorization`:

```
Authorization: Bearer <firebase_id_token>
```

### Getting Token

```javascript
// Client-side
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const user = auth.currentUser;
const token = await user.getIdToken();

// Use token in API requests
fetch('/api/courses', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Rate Limiting

- **Standard endpoints**: 100 requests per minute
- **Write operations**: 20 requests per minute
- **Authentication endpoints**: 10 requests per minute
- **Admin endpoints**: 50 requests per minute

## Response Format

Todas as respostas seguem este formato padrão:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "metadata": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "requestId": "req_1234567890_abcdef",
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "details": {}
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Courses API

### Get All Courses

**GET** `/courses`

Recupera uma lista de cursos com suporte a paginação e filtros.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Número da página (default: 1) |
| `limit` | number | Itens por página (default: 20, max: 100) |
| `sortBy` | string | Campo de ordenação (default: createdAt) |
| `sortOrder` | string | Direção da ordenação: asc/desc (default: desc) |
| `category` | string | Filtrar por categoria |
| `level` | string | Filtrar por nível |
| `search` | string | Buscar por título/descrição |
| `instructorId` | string | Filtrar por instrutor |
| `organizationId` | string | Filtrar por organização |

#### Example Request

```javascript
const response = await fetch('/api/courses?page=1&limit=10&category=investment&level=beginner', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": "course_123",
      "title": "Introdução ao Mercado de Ações",
      "description": "Aprenda os fundamentos do mercado de ações brasileiro",
      "instructorId": "user_456",
      "instructorName": "João Silva",
      "category": "investment",
      "level": "beginner",
      "thumbnail": "https://storage.googleapis.com/thumbnails/course_123.jpg",
      "duration": 240,
      "status": "published",
      "visibility": "public",
      "tags": ["ações", "bolsa", "investimentos"],
      "objectives": ["Entender o funcionamento da bolsa", "Aprender a analisar ações"],
      "requirements": ["Conhecimento básico de finanças"],
      "skills": ["Análise de ações", "Gestão de carteira"],
      "pricing": {
        "type": "paid",
        "amount": 197.00,
        "currency": "BRL"
      },
      "stats": {
        "enrollmentCount": 150,
        "averageRating": 4.7,
        "ratingCount": 45
      },
      "isEnrolled": false,
      "isInstructor": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "metadata": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### Create Course

**POST** `/courses`

Cria um novo curso. Requer papel de instrutor ou administrador.

#### Request Body

```json
{
  "title": "Título do Curso",
  "description": "Descrição detalhada do curso com no mínimo 10 caracteres",
  "category": "investment",
  "level": "beginner",
  "tags": ["tag1", "tag2"],
  "objectives": ["Objetivo 1", "Objetivo 2"],
  "requirements": ["Requisito 1"],
  "skills": ["Skill 1"],
  "pricing": {
    "type": "paid",
    "amount": 197.00,
    "currency": "BRL"
  },
  "settings": {
    "allowComments": true,
    "certificateEnabled": true,
    "autoProgress": true
  }
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "course_789",
    "title": "Título do Curso",
    "description": "Descrição detalhada do curso",
    "instructorId": "user_456",
    "category": "investment",
    "level": "beginner",
    "status": "draft",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Course created successfully"
}
```

### Get Course Details

**GET** `/courses/{id}`

Recupera detalhes completos de um curso específico.

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "course_123",
    "title": "Introdução ao Mercado de Ações",
    "description": "Descrição completa do curso...",
    "modules": [
      {
        "id": "module_1",
        "title": "Módulo 1: Fundamentos",
        "description": "Introdução ao mercado",
        "order": 1,
        "videos": [
          {
            "id": "video_1",
            "title": "Video 1: O que é a bolsa",
            "duration": 1200,
            "order": 1
          }
        ]
      }
    ],
    "isEnrolled": true,
    "enrollmentData": {
      "id": "enrollment_456",
      "progress": 25,
      "lastAccessAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

### Update Course

**PUT** `/courses/{id}`

Atualiza dados de um curso existente. Apenas instrutores e administradores.

#### Request Body

Mesmo formato do create course, mas todos os campos são opcionais.

### Delete Course

**DELETE** `/courses/{id}`

Remove um curso. Se houver inscrições, é feito soft delete.

---

## Course Enrollment API

### Enroll in Course

**POST** `/courses/{id}/enroll`

Inscreve usuário em um curso.

#### Request Body

```json
{
  "promotionalCode": "DESCONTO10"
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "enrollment_789",
    "userId": "user_123",
    "courseId": "course_456",
    "status": "active",
    "progress": 0,
    "enrolledAt": "2024-01-01T00:00:00.000Z",
    "payment": {
      "type": "paid",
      "amount": 197.00,
      "currency": "BRL"
    }
  },
  "message": "Enrollment successful"
}
```

### Get Enrollment Status

**GET** `/courses/{id}/enroll`

Verifica status de inscrição e progresso.

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "enrollment_789",
    "status": "active",
    "progress": 75,
    "calculatedProgress": {
      "completedVideos": 15,
      "totalVideos": 20,
      "progressPercentage": 75,
      "timeSpentFormatted": "3h 45m"
    },
    "courseInfo": {
      "title": "Título do Curso",
      "thumbnail": "url",
      "totalVideos": 20
    },
    "recentActivity": [
      {
        "id": "activity_1",
        "type": "video_complete",
        "timestamp": "2024-01-01T12:00:00.000Z"
      }
    ]
  }
}
```

### Cancel Enrollment

**DELETE** `/courses/{id}/enroll`

Cancela inscrição em um curso.

---

## User Management API

### Get Current User

**GET** `/users/me`

Recupera dados do usuário autenticado.

#### Example Response

```json
{
  "success": true,
  "data": {
    "uid": "user_123",
    "email": "usuario@exemplo.com",
    "displayName": "João Silva",
    "photoURL": "https://...",
    "firstName": "João",
    "lastName": "Silva",
    "bio": "Estudante de finanças",
    "preferences": {
      "theme": "light",
      "notifications": {
        "email": true,
        "push": true
      }
    },
    "stats": {
      "coursesStarted": 5,
      "coursesCompleted": 2,
      "totalPoints": 1500,
      "level": 3
    }
  }
}
```

### Update User Profile

**PUT** `/users/me`

Atualiza perfil do usuário.

#### Request Body

```json
{
  "displayName": "Novo Nome",
  "firstName": "João",
  "lastName": "Silva",
  "bio": "Nova bio",
  "preferences": {
    "theme": "dark",
    "notifications": {
      "email": false
    }
  }
}
```

---

## Gamification API

### Get User Achievements

**GET** `/user/achievements`

Recupera conquistas do usuário.

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": "user_achievement_1",
      "userId": "user_123",
      "achievementId": "achievement_1",
      "progress": 100,
      "isCompleted": true,
      "unlockedAt": "2024-01-01T00:00:00.000Z",
      "achievement": {
        "id": "achievement_1",
        "title": "Primeiro Passo",
        "description": "Complete seu primeiro vídeo",
        "category": "learning",
        "points": 50,
        "badge": {
          "type": "bronze",
          "color": "#CD7F32"
        }
      }
    }
  ]
}
```

### Get User Stats

**GET** `/user/stats`

Recupera estatísticas gamification do usuário.

#### Example Response

```json
{
  "success": true,
  "data": {
    "userId": "user_123",
    "totalPoints": 1500,
    "experiencePoints": 1500,
    "level": 3,
    "levelProgress": 50,
    "streak": {
      "current": 7,
      "longest": 15,
      "lastActiveDate": "2024-01-01T00:00:00.000Z"
    },
    "courses": {
      "started": 5,
      "completed": 2,
      "inProgress": 3,
      "totalTime": 1200,
      "certificates": 2
    },
    "achievements": {
      "unlocked": 8,
      "inProgress": 3,
      "totalAvailable": 20
    }
  }
}
```

### Get Achievements List

**GET** `/achievements`

Recupera lista de conquistas disponíveis.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `active` | boolean | Apenas conquistas ativas (default: true) |

---

## Certificates API

### Get User Certificates

**GET** `/certificates`

Recupera certificados do usuário.

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": "certificate_1",
      "userId": "user_123",
      "courseId": "course_456",
      "courseName": "Introdução ao Mercado de Ações",
      "instructorName": "João Silva",
      "completionDate": "2024-01-01T00:00:00.000Z",
      "score": 95,
      "verificationCode": "ABC12345",
      "certificateUrl": "https://certificates.comunidadeflix.com/ABC12345",
      "skills": ["Análise de ações", "Gestão de carteira"],
      "shareCount": 2
    }
  ]
}
```

### Generate Certificate

**POST** `/certificates/generate`

Gera certificado para curso concluído.

#### Request Body

```json
{
  "courseId": "course_456"
}
```

---

## Leaderboard API

### Get Leaderboard

**GET** `/leaderboard`

Recupera ranking de usuários.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | Tipo: points, courses, streak (default: points) |
| `period` | string | Período: weekly, monthly, all-time (default: all-time) |
| `limit` | number | Quantidade de resultados (default: 10) |

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "userId": "user_456",
      "username": "Maria Santos",
      "avatar": "https://...",
      "totalPoints": 3500,
      "level": 7,
      "achievementsCount": 15,
      "coursesCompleted": 8,
      "streakDays": 30
    }
  ]
}
```

---

## Notifications API

### Get Notifications

**GET** `/notifications`

Recupera notificações do usuário.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `read` | boolean | Filtrar por status de leitura |
| `type` | string | Filtrar por tipo |
| `limit` | number | Quantidade de resultados (default: 20) |

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": "notification_1",
      "type": "achievement_unlocked",
      "title": "Nova Conquista!",
      "message": "Você desbloqueou: Primeiro Passo",
      "data": {
        "achievementId": "achievement_1"
      },
      "actionUrl": "/achievements",
      "isRead": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Mark Notification as Read

**PUT** `/notifications/{id}/read`

Marca notificação como lida.

---

## Analytics API

### Track Event

**POST** `/analytics/events`

Registra evento de analytics.

#### Request Body

```json
{
  "name": "video_play",
  "category": "engagement",
  "properties": {
    "videoId": "video_123",
    "courseId": "course_456",
    "position": 0
  }
}
```

---

## Admin API

### Get System Health

**GET** `/monitoring/health`

Verifica saúde do sistema (disponível publicamente).

#### Example Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 86400,
  "version": "1.0.0",
  "services": {
    "database": {
      "status": "healthy",
      "responseTime": 45
    },
    "authentication": {
      "status": "healthy",
      "responseTime": 23
    }
  },
  "metrics": {
    "activeUsers": 150,
    "errorRate": 0.5,
    "averageResponseTime": 145
  }
}
```

### Get System Metrics

**GET** `/admin/metrics`

Recupera métricas detalhadas do sistema (admin only).

---

## Error Handling

### Common Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Autenticação necessária |
| `INSUFFICIENT_PERMISSIONS` | Permissões insuficientes |
| `RESOURCE_NOT_FOUND` | Recurso não encontrado |
| `VALIDATION_ERROR` | Erro de validação |
| `RATE_LIMIT_EXCEEDED` | Limite de requisições excedido |
| `COURSE_NOT_PUBLISHED` | Curso não publicado |
| `ALREADY_ENROLLED` | Já inscrito no curso |
| `PREREQUISITES_NOT_MET` | Pré-requisitos não atendidos |

### Error Response Example

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "details": {
    "errors": [
      "Title must be between 5 and 200 characters",
      "Category is required"
    ]
  }
}
```

---

## SDKs and Libraries

### JavaScript/TypeScript Client

```typescript
import { ComunidadeFlixAPI } from '@comunidadeflix/client-sdk';

const api = new ComunidadeFlixAPI({
  baseURL: 'https://api.comunidadeflix.com/api',
  authToken: 'your_firebase_token'
});

// Get courses
const courses = await api.courses.list({
  category: 'investment',
  level: 'beginner'
});

// Enroll in course
const enrollment = await api.courses.enroll('course_123');
```

### Python Client

```python
from comunidadeflix import ComunidadeFlixAPI

api = ComunidadeFlixAPI(
    base_url='https://api.comunidadeflix.com/api',
    auth_token='your_firebase_token'
)

# Get courses
courses = api.courses.list(
    category='investment',
    level='beginner'
)

# Enroll in course
enrollment = api.courses.enroll('course_123')
```

---

## Best Practices

### Authentication

1. **Sempre use HTTPS** para proteger tokens
2. **Armazene tokens com segurança** no cliente
3. **Implemente refresh de tokens** automaticamente
4. **Verifique permissões** no backend

### Performance

1. **Use paginação** para listas grandes
2. **Implemente cache** para dados frequentes
3. **Use field selection** para reduzir payload
4. **Monitore tempos de resposta**

### Error Handling

1. **Implemente retry** com exponential backoff
2. **Log erros client-side** para debugging
3. **Mostre mensagens amigáveis** para usuários
4. **Implemente fallbacks** quando possível

### Rate Limiting

1. **Respeite headers de rate limiting**
2. **Implemente backoff automático**
3. **Cache responses** quando possível
4. **Use WebSockets** para atualizações em tempo real

---

## Support

- **Documentation**: https://docs.comunidadeflix.com
- **API Status**: https://status.comunidadeflix.com
- **Support Email**: api-support@comunidadeflix.com
- **Discord Community**: https://discord.gg/comunidadeflix

---

## Changelog

### v1.0.0 (2024-01-01)
- Initial release
- Core CRUD operations for courses
- User management and authentication
- Gamification system
- Basic analytics and monitoring

### v1.1.0 (2024-02-01)
- Added video streaming endpoints
- Enhanced search functionality
- Improved error handling
- Performance optimizations

### v1.2.0 (2024-03-01)
- Real-time notifications
- Advanced analytics
- Organization management
- Enhanced security features

---

*Esta documentação está atualizada para a versão 1.0.0 da API. Para informações sobre versões anteriores, consulte o histórico de changelog.*