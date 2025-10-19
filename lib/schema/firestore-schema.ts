/**
 * FIRESTORE SCHEMA DESIGN - COMUNIDADE FLIX
 * Arquitetura escalável e otimizada para performance
 *
 * Collections Principais:
 * - users (perfis e preferências)
 * - organizations (multi-tenancy)
 * - courses (conteúdo educacional)
 * - videos (módulos de vídeo)
 * - progress (rastreamento de aprendizado)
 * - gamification (sistema de conquistas)
 * - analytics (métricas e eventos)
 * - notifications (comunicação com usuários)
 * - certificates (certificações)
 * - subscriptions (pagamentos e planos)
 */

export const FIRESTORE_SCHEMA = {
  // ======== CORE COLLECTIONS ========

  /**
   * Users Collection - Perfil completo do usuário
   * Indexes: [email], [organizationId, role], [createdAt], [lastLoginAt]
   */
  users: {
    primaryKey: 'userId',
    fields: {
      // Identificação
      uid: 'string', // Firebase Auth UID
      email: 'string',
      displayName: 'string',
      photoURL: 'string',
      phone: 'string',

      // Multi-tenancy
      organizationId: 'string',
      role: 'string', // 'student', 'instructor', 'admin', 'super_admin'
      permissions: 'array<string>',

      // Perfil
      firstName: 'string',
      lastName: 'string',
      bio: 'string',
      birthDate: 'timestamp',
      location: 'map', // { city, state, country, coordinates }
      timezone: 'string',
      language: 'string',

      // Preferências
      preferences: {
        theme: 'string', // 'light', 'dark', 'auto'
        notifications: {
          email: 'boolean',
          push: 'boolean',
          inApp: 'boolean',
          types: 'array<string>', // ['course_complete', 'achievement', etc]
        },
        autoplay: 'boolean',
        videoQuality: 'string', // 'auto', '360p', '720p', '1080p'
        playbackSpeed: 'number',
        subtitles: 'boolean',
        subtitleLanguage: 'string',
      },

      // Status e Controle
      status: 'string', // 'active', 'inactive', 'suspended', 'deleted'
      emailVerified: 'boolean',
      phoneVerified: 'boolean',
      onboardingCompleted: 'boolean',
      profileCompleted: 'boolean',

      // LGPD/Compliance
      privacy: {
        dataProcessingConsent: 'boolean',
        marketingConsent: 'boolean',
        cookiesConsent: 'boolean',
        consentDate: 'timestamp',
        gdprRights: {
          dataPortabilityRequested: 'boolean',
          dataDeletionRequested: 'boolean',
          dataRectificationRequested: 'boolean',
        }
      },

      // Security
      security: {
        lastPasswordChange: 'timestamp',
        twoFactorEnabled: 'boolean',
        loginAttempts: 'number',
        lockedUntil: 'timestamp',
        devices: 'array<object>', // [{ deviceId, userAgent, lastUsed, trusted }]
      },

      // Metadados
      metadata: {
        source: 'string', // 'google', 'email', 'sso'
        referrer: 'string',
        utm: 'object',
        ipAddress: 'string',
        userAgent: 'string',
      },

      // Timestamps
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
      lastLoginAt: 'timestamp',
      lastActiveAt: 'timestamp',
    }
  },

  /**
   * Organizations Collection - Multi-tenancy para empresas
   * Indexes: [slug], [status], [plan], [createdAt]
   */
  organizations: {
    primaryKey: 'organizationId',
    fields: {
      // Identificação
      name: 'string',
      slug: 'string', // URL-friendly identifier
      description: 'string',
      logo: 'string',
      website: 'string',

      // Contato
      contact: {
        email: 'string',
        phone: 'string',
        address: 'object',
      },

      // Plano e Billing
      plan: 'string', // 'free', 'starter', 'professional', 'enterprise'
      subscriptionId: 'string',
      billing: {
        seatsUsed: 'number',
        seatsLimit: 'number',
        billingCycle: 'string', // 'monthly', 'annual'
        nextBillingDate: 'timestamp',
        paymentMethod: 'string',
      },

      // Configurações
      settings: {
        allowPublicCourses: 'boolean',
        allowUserRegistration: 'boolean',
        requireApproval: 'boolean',
        customBranding: 'object',
        sso: {
          enabled: 'boolean',
          provider: 'string',
          config: 'object',
        },
        integrations: 'object',
      },

      // Domínios
      domains: 'array<string>', // ['company.com', 'app.company.com']

      // Status
      status: 'string', // 'active', 'trial', 'suspended', 'cancelled'

      // Metadados
      metadata: {
        industry: 'string',
        size: 'string', // '1-10', '11-50', '51-200', '201-500', '500+'
        trialEndsAt: 'timestamp',
      },

      // Timestamps
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
    }
  },

  // ======== CONTENT COLLECTIONS ========

  /**
   * Courses Collection - Cursos e programas educacionais
   * Indexes: [organizationId, status], [instructorId], [category], [createdAt], [publishedAt]
   * Composite Indexes: [organizationId, status, publishedAt], [category, level, rating]
   */
  courses: {
    primaryKey: 'courseId',
    fields: {
      // Multi-tenancy
      organizationId: 'string',

      // Informações Básicas
      title: 'string',
      description: 'string',
      summary: 'string',
      language: 'string',

      // Categorização
      category: 'string',
      subcategory: 'string',
      tags: 'array<string>',
      level: 'string', // 'beginner', 'intermediate', 'advanced', 'all_levels'

      // Instrutor
      instructorId: 'string',
      instructors: 'array<string>', // Para cursos com múltiplos instrutores

      // Conteúdo
      thumbnail: 'string',
      previewVideo: 'string',
      duration: 'number', // Em minutos
      modules: 'array<object>', // [{ id, title, description, order, videos }]

      // Metadados de Aprendizado
      objectives: 'array<string>',
      requirements: 'array<string>',
      skills: 'array<string>',
      certificate: {
        enabled: 'boolean',
        template: 'string',
        criteria: {
          completionPercentage: 'number',
          minimumScore: 'number',
          timeSpent: 'number',
        }
      },

      // Pricing
      pricing: {
        type: 'string', // 'free', 'paid', 'subscription'
        amount: 'number',
        currency: 'string',
        discounts: 'array<object>',
      },

      // Publicação
      status: 'string', // 'draft', 'published', 'archived', 'deleted'
      visibility: 'string', // 'public', 'private', 'organization', 'unlisted'
      publishedAt: 'timestamp',

      // Engagement
      stats: {
        enrollmentCount: 'number',
        completionCount: 'number',
        averageRating: 'number',
        ratingCount: 'number',
        totalWatchTime: 'number',
        averageCompletion: 'number',
      },

      // SEO
      seo: {
        slug: 'string',
        metaTitle: 'string',
        metaDescription: 'string',
        keywords: 'array<string>',
      },

      // Configurações
      settings: {
        allowComments: 'boolean',
        allowDownload: 'boolean',
        certificateEnabled: 'boolean',
        autoProgress: 'boolean',
        prerequisiteCourses: 'array<string>',
      },

      // Timestamps
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
    }
  },

  /**
   * Videos Collection - Vídeos individuais dos cursos
   * Indexes: [courseId, order], [status], [processedAt]
   * Subcollections: comments, bookmarks, notes
   */
  videos: {
    primaryKey: 'videoId',
    fields: {
      // Relacionamento
      courseId: 'string',
      moduleId: 'string',
      order: 'number',

      // Informações Básicas
      title: 'string',
      description: 'string',
      duration: 'number', // Em segundos

      // Arquivos
      files: {
        original: 'string', // URL do vídeo original
        processed: 'array<object>', // [{ quality: '720p', url: '...', size: number }]
        thumbnail: 'string',
        captions: 'array<object>', // [{ language: 'pt-BR', url: '...' }]
        transcript: 'string',
        slides: 'array<string>', // URLs dos slides
        attachments: 'array<object>', // [{ name, url, type }]
      },

      // Processamento
      status: 'string', // 'uploading', 'processing', 'ready', 'error', 'archived'
      processing: {
        startedAt: 'timestamp',
        completedAt: 'timestamp',
        errors: 'array<string>',
        progress: 'number', // 0-100
      },

      // Configurações
      settings: {
        autoplay: 'boolean',
        allowSpeed: 'boolean',
        allowFullscreen: 'boolean',
        showCaptions: 'boolean',
        seekable: 'boolean',
        downloadable: 'boolean',
      },

      // Engagement
      stats: {
        views: 'number',
        uniqueViews: 'number',
        averageWatchTime: 'number',
        completionRate: 'number',
        likes: 'number',
        dislikes: 'number',
        comments: 'number',
      },

      // Quiz/Assessment
      quiz: {
        enabled: 'boolean',
        questions: 'array<object>',
        passingScore: 'number',
        timeLimit: 'number',
      },

      // Timestamps
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
      publishedAt: 'timestamp',
    }
  },

  // ======== PROGRESS COLLECTIONS ========

  /**
   * Enrollments Collection - Inscrições dos usuários em cursos
   * Indexes: [userId], [courseId], [userId, status], [courseId, status], [enrolledAt]
   * Composite Indexes: [userId, courseId], [courseId, enrolledAt]
   */
  enrollments: {
    primaryKey: 'enrollmentId',
    fields: {
      // Relacionamentos
      userId: 'string',
      courseId: 'string',
      organizationId: 'string',

      // Status
      status: 'string', // 'active', 'completed', 'paused', 'cancelled', 'refunded'
      progress: 'number', // 0-100

      // Progresso Detalhado
      progressData: {
        videosCompleted: 'array<string>',
        videosWatched: 'array<string>', // Com timestamps
        timeSpent: 'number', // Em segundos
        lastPosition: 'number', // Segundo do último vídeo assistido
        lastVideoId: 'string',
        completionPercentage: 'number',
      },

      // Notas e Avaliações
      notes: 'array<object>', // [{ videoId, note, timestamp }]
      bookmarks: 'array<object>', // [{ videoId, position, note, createdAt }]
      rating: {
        score: 'number', // 1-5
        review: 'string',
        ratedAt: 'timestamp',
      },

      // Certificação
      certificate: {
        issued: 'boolean',
        issuedAt: 'timestamp',
        url: 'string',
        verificationCode: 'string',
        score: 'number',
      },

      // Engagement
      stats: {
        sessionsCount: 'number',
        totalWatchTime: 'number',
        averageSessionTime: 'number',
        streakDays: 'number',
        lastStudyDate: 'timestamp',
      },

      // Pricing e Pagamento
      payment: {
        type: 'string', // 'free', 'paid', 'subscription'
        amount: 'number',
        currency: 'string',
        transactionId: 'string',
        promotionalCode: 'string',
      },

      // Timestamps
      enrolledAt: 'timestamp',
      completedAt: 'timestamp',
      lastAccessAt: 'timestamp',
      updatedAt: 'timestamp',
    }
  },

  /**
   * UserActivity Collection - Rastreamento de atividades detalhado
   * Indexes: [userId, timestamp], [userId, type], [courseId], [sessionId]
   * Composite Indexes: [userId, timestamp, type], [sessionId, timestamp]
   * TTL: 90 dias em produção
   */
  userActivity: {
    primaryKey: 'activityId',
    fields: {
      // Identificação
      userId: 'string',
      sessionId: 'string',

      // Tipo de Atividade
      type: 'string', // 'video_start', 'video_pause', 'video_complete', 'quiz_attempt', 'course_complete', etc.
      category: 'string', // 'video', 'quiz', 'course', 'profile', 'system'

      // Contexto
      context: {
        courseId: 'string',
        videoId: 'string',
        moduleId: 'string',
        position: 'number', // Para vídeos
        data: 'object', // Dados específicos da atividade
      },

      // Dados da Atividade
      duration: 'number', // Duração da atividade em segundos
      metadata: {
        device: 'string',
        browser: 'string',
        os: 'string',
        ipAddress: 'string',
        location: 'object',
        referrer: 'string',
      },

      // Timestamps
      timestamp: 'timestamp',
      processedAt: 'timestamp',
    }
  },

  // ======== GAMIFICATION COLLECTIONS ========

  /**
   * UserStats Collection - Estatísticas e gamification
   * Indexes: [userId], [organizationId], [totalPoints], [level]
   * Composite Indexes: [organizationId, totalPoints], [organizationId, level]
   */
  userStats: {
    primaryKey: 'userId', // Same as users collection
    fields: {
      // Identificação
      userId: 'string',
      organizationId: 'string',

      // Pontos e Nível
      totalPoints: 'number',
      experiencePoints: 'number',
      level: 'number',
      levelProgress: 'number', // 0-100

      // Streaks
      streak: {
        current: 'number',
        longest: 'number',
        lastActiveDate: 'timestamp',
        history: 'array<object>', // [{ date: timestamp, active: boolean }]
      },

      // Conquistas
      achievements: {
        unlocked: 'number',
        inProgress: 'number',
        totalAvailable: 'number',
        latestUnlocked: 'timestamp',
      },

      // Progresso em Cursos
      courses: {
        started: 'number',
        completed: 'number',
        inProgress: 'number',
        totalTime: 'number', // Em minutos
        certificates: 'number',
      },

      // Vídeos
      videos: {
        watched: 'number',
        completed: 'number',
        totalTime: 'number', // Em minutos
        averageCompletionRate: 'number',
      },

      // Engajamento
      engagement: {
        loginDays: 'number',
        sessionsCount: 'number',
        averageSessionTime: 'number',
        interactions: 'number', // Comments, likes, bookmarks
      },

      // Ranking
      ranking: {
        global: {
          position: 'number',
          totalUsers: 'number',
          percentile: 'number',
        },
        organization: {
          position: 'number',
          totalUsers: 'number',
          percentile: 'number',
        },
      },

      // Metadados
      lastCalculatedAt: 'timestamp',
      seasonPoints: 'number', // Pontos da temporada atual
      badges: 'array<string>', // IDs dos badges conquistados

      // Timestamps
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
    }
  },

  /**
   * Achievements Collection - Definição das conquistas
   * Indexes: [organizationId], [category], [isActive], [points]
   * Composite Indexes: [organizationId, category, isActive]
   */
  achievements: {
    primaryKey: 'achievementId',
    fields: {
      // Identificação
      organizationId: 'string', // null para conquistas globais

      // Informações Básicas
      title: 'string',
      description: 'string',
      category: 'string', // 'learning', 'engagement', 'social', 'milestone'
      type: 'string', // 'progress', 'streak', 'completion', 'special'

      // Visual
      icon: 'string',
      badge: {
        type: 'string', // 'bronze', 'silver', 'gold', 'platinum', 'diamond'
        color: 'string',
        custom: 'string', // URL para badge personalizado
      },

      // Requisitos
      requirements: {
        type: 'string', // 'course_completion', 'streak_days', 'points_threshold', etc.
        value: 'number',
        conditions: 'array<object>', // Condições adicionais
      },

      // Recompensas
      rewards: {
        points: 'number',
        badge: 'string',
        certificate: 'boolean',
        unlocks: 'array<string>', // Outras conquistas ou conteúdo
      },

      // Configurações
      isActive: 'boolean',
      isSecret: 'boolean', // Não aparece na lista até ser desbloqueada
      isRepeatable: 'boolean',
      rarity: 'string', // 'common', 'uncommon', 'rare', 'epic', 'legendary'

      // Estatísticas
      stats: {
        unlockedCount: 'number',
        totalUsers: 'number',
        unlockRate: 'number',
        averageTimeToUnlock: 'number', // Em dias
      },

      // Timestamps
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
      publishedAt: 'timestamp',
    }
  },

  /**
   * UserAchievements Collection - Conquistas desbloqueadas pelos usuários
   * Indexes: [userId], [achievementId], [userId, isCompleted], [unlockedAt]
   * Composite Indexes: [userId, achievementId], [userId, unlockedAt]
   */
  userAchievements: {
    primaryKey: 'userAchievementId',
    fields: {
      // Relacionamentos
      userId: 'string',
      achievementId: 'string',
      organizationId: 'string',

      // Progresso
      progress: 'number', // 0-100
      isCompleted: 'boolean',
      currentLevel: 'number', // Para conquistas com múltiplos níveis
      maxLevel: 'number',

      // Dados do Progresso
      progressData: {
        currentValue: 'number',
        targetValue: 'number',
        milestones: 'array<object>', // [{ value: number, unlockedAt: timestamp }]
        context: 'object', // Dados específicos do tipo de conquista
      },

      // Unlock
      unlockedAt: 'timestamp',
      unlockSession: 'string', // Session ID quando foi desbloqueada

      // Notificação
      notificationSent: 'boolean',
      notificationAt: 'timestamp',

      // Metadados
      metadata: {
        triggerEvent: 'string',
        triggerData: 'object',
        shareCount: 'number',
      },

      // Timestamps
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
    }
  },

  // ======== ANALYTICS COLLECTIONS ========

  /**
   * AnalyticsEvents Collection - Eventos para analytics
   * Indexes: [userId, timestamp], [type], [organizationId], [sessionId]
   * TTL: 365 dias
   */
  analyticsEvents: {
    primaryKey: 'eventId',
    fields: {
      // Identificação
      userId: 'string', // null para eventos anônimos
      sessionId: 'string',
      organizationId: 'string',

      // Evento
      name: 'string', // 'video_play', 'course_enroll', 'quiz_submit', etc.
      category: 'string', // 'engagement', 'learning', 'conversion', 'system'

      // Propriedades
      properties: 'object', // Dados específicos do evento

      // Metadados
      metadata: {
        platform: 'string', // 'web', 'mobile', 'api'
        version: 'string',
        device: 'object',
        location: 'object',
        referrer: 'string',
        utm: 'object',
      },

      // Timestamps
      timestamp: 'timestamp',
      processedAt: 'timestamp',
    }
  },

  /**
   * AnalyticsAggregated Collection - Dados agregados para dashboards
   * Indexes: [organizationId, date, type], [type, date]
   * TTL: 5 anos
   */
  analyticsAggregated: {
    primaryKey: 'aggregationId',
    fields: {
      // Identificação
      organizationId: 'string',

      // Agregação
      date: 'timestamp',
      period: 'string', // 'hour', 'day', 'week', 'month', 'year'
      type: 'string', // 'users', 'courses', 'videos', 'revenue', 'engagement'

      // Métricas
      metrics: 'object', // { active_users: number, new_users: number, etc. }

      // Dimensões
      dimensions: 'object', // { course_category: 'finance', user_level: 'beginner', etc. }

      // Metadados
      lastUpdated: 'timestamp',
      version: 'string',
    }
  },

  // ======== SYSTEM COLLECTIONS ========

  /**
   * Notifications Collection - Notificações dos usuários
   * Indexes: [userId], [userId, isRead], [expiresAt], [createdAt]
   * TTL: 30 dias após expiresAt
   */
  notifications: {
    primaryKey: 'notificationId',
    fields: {
      // Destinatário
      userId: 'string',

      // Conteúdo
      type: 'string', // 'achievement', 'course_complete', 'reminder', 'system', etc.
      title: 'string',
      message: 'string',

      // Dados
      data: 'object', // Dados específicos da notificação
      actionUrl: 'string',

      // Status
      isRead: 'boolean',
      readAt: 'timestamp',

      // Canais
      channels: {
        inApp: 'boolean',
        email: 'boolean',
        push: 'boolean',
        sms: 'boolean',
      },

      // Configurações
      priority: 'string', // 'low', 'normal', 'high', 'urgent'
      category: 'string', // 'learning', 'engagement', 'marketing', 'system'

      // Agendamento
      scheduledFor: 'timestamp',
      expiresAt: 'timestamp',

      // Metadados
      metadata: {
        source: 'string',
        campaign: 'string',
        template: 'string',
        version: 'string',
      },

      // Timestamps
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
      sentAt: 'timestamp',
    }
  },

  /**
   * Certificates Collection - Certificados emitidos
   * Indexes: [userId], [courseId], [verificationCode], [issuedAt]
   * Composite Indexes: [userId, courseId], [courseId, issuedAt]
   */
  certificates: {
    primaryKey: 'certificateId',
    fields: {
      // Relacionamentos
      userId: 'string',
      courseId: 'string',
      organizationId: 'string',

      // Informações do Certificado
      title: 'string',
      description: 'string',
      instructorName: 'string',

      // Conclusão
      completionDate: 'timestamp',
      issuedAt: 'timestamp',
      expiresAt: 'timestamp', // null para certificados permanentes

      // Performance
      score: 'number',
      totalModules: 'number',
      completedModules: 'number',
      timeSpent: 'number', // Em horas

      // Verificação
      verificationCode: 'string',
      certificateUrl: 'string',

      // Design
      template: 'string',
      customDesign: 'object',

      // Skills e Competências
      skills: 'array<string>',
      competencies: 'array<string>',

      // Status
      isActive: 'boolean',
      isRevoked: 'boolean',
      revokedAt: 'timestamp',
      revokedReason: 'string',

      // Compartilhamento
      shareCount: 'number',
      lastSharedAt: 'timestamp',

      // Metadados
      metadata: {
        version: 'string',
        blockchain: 'boolean', // Se foi registrado em blockchain
        ipfsHash: 'string',
      },

      // Timestamps
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
    }
  },

  /**
   * SystemConfig Collection - Configurações do sistema
   * Indexes: [organizationId], [key], [type]
   */
  systemConfig: {
    primaryKey: 'configId',
    fields: {
      // Identificação
      organizationId: 'string', // null para configurações globais
      key: 'string',
      type: 'string', // 'feature_flag', 'setting', 'limit', 'integration'

      // Valor
      value: 'any', // Pode ser string, number, boolean, object, array
      defaultValue: 'any',

      // Configurações
      isEditable: 'boolean',
      requiresRestart: 'boolean',
      category: 'string',

      // Controle de Versão
      version: 'string',
      lastChangedBy: 'string', // User ID
      changeReason: 'string',

      // Metadados
      description: 'string',
      tags: 'array<string>',

      // Timestamps
      createdAt: 'timestamp',
      updatedAt: 'timestamp',
    }
  }
};

/**
 * COMPOUND INDEXES RECOMMENDED
 * Execute estas queries no Firebase Console para criar os índices compostos
 */
export const COMPOUND_INDEXES = [
  // Users
  {
    collection: 'users',
    fields: [
      { fieldPath: 'organizationId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  },

  // Courses
  {
    collection: 'courses',
    fields: [
      { fieldPath: 'organizationId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'publishedAt', order: 'DESCENDING' }
    ]
  },
  {
    collection: 'courses',
    fields: [
      { fieldPath: 'category', order: 'ASCENDING' },
      { fieldPath: 'level', order: 'ASCENDING' },
      { fieldPath: 'stats.averageRating', order: 'DESCENDING' }
    ]
  },

  // Enrollments
  {
    collection: 'enrollments',
    fields: [
      { fieldPath: 'userId', order: 'ASCENDING' },
      { fieldPath: 'courseId', order: 'ASCENDING' }
    ]
  },
  {
    collection: 'enrollments',
    fields: [
      { fieldPath: 'courseId', order: 'ASCENDING' },
      { fieldPath: 'enrolledAt', order: 'DESCENDING' }
    ]
  },

  // UserActivity
  {
    collection: 'userActivity',
    fields: [
      { fieldPath: 'userId', order: 'ASCENDING' },
      { fieldPath: 'timestamp', order: 'DESCENDING' },
      { fieldPath: 'type', order: 'ASCENDING' }
    ]
  },

  // UserAchievements
  {
    collection: 'userAchievements',
    fields: [
      { fieldPath: 'userId', order: 'ASCENDING' },
      { fieldPath: 'achievementId', order: 'ASCENDING' }
    ]
  },

  // AnalyticsEvents
  {
    collection: 'analyticsEvents',
    fields: [
      { fieldPath: 'organizationId', order: 'ASCENDING' },
      { fieldPath: 'timestamp', order: 'DESCENDING' },
      { fieldPath: 'name', order: 'ASCENDING' }
    ]
  },

  // Notifications
  {
    collection: 'notifications',
    fields: [
      { fieldPath: 'userId', order: 'ASCENDING' },
      { fieldPath: 'isRead', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  }
];

export default FIRESTORE_SCHEMA;