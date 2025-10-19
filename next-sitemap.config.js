/** @type {import('next-sitemap').IConfig } */
module.exports = {
  siteUrl: 'https://mitsuoishida.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,

  // Additional paths to include
  additionalPaths: async (config) => {
    const result = []

    // Dynamically add course pages
    // In production, you would fetch these from your database
    result.push({
      loc: '/courses',
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString()
    })

    // Add important pages
    const importantPages = [
      { loc: '/', changefreq: 'daily', priority: 1.0 },
      { loc: '/cursos', changefreq: 'weekly', priority: 0.9 },
      { loc: '/sobre', changefreq: 'monthly', priority: 0.7 },
      { loc: '/login', changefreq: 'monthly', priority: 0.6 },
      { loc: '/signup', changefreq: 'monthly', priority: 0.6 },
      { loc: '/app', changefreq: 'daily', priority: 0.8 },
      { loc: '/app/comunidade', changefreq: 'daily', priority: 0.8 },
      { loc: '/app/busca', changefreq: 'weekly', priority: 0.7 },
    ]

    importantPages.forEach(page => {
      result.push({
        ...page,
        lastmod: new Date().toISOString()
      })
    })

    return result
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/_next/',
          '/static/',
          '/.well-known/',
          '/app/aula/',
          '/app/perfil/',
          '/app/configuracoes/',
          '/meus-cursos/',
          '/progress/',
          '/continue-watching/'
        ]
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/']
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/']
      },
      {
        userAgent: 'CCBot',
        disallow: ['/']
      },
      {
        userAgent: 'anthropic-ai',
        disallow: ['/']
      },
      {
        userAgent: 'Claude-Web',
        disallow: ['/']
      }
    ]
  }
}