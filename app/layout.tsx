import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/hooks/useTheme';
import { AuthProvider } from '@/context/AuthContext';
import { GamificationProvider } from '@/hooks/useGamification';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingWrapper from '@/components/LoadingSpinner';
import { HydrationSafeWrapper } from '@/components/HydrationSafeWrapper';
import { analyticsService, performanceService, errorTrackingService } from '@/lib';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mitsuoishida.com'),
  title: {
    default: 'Mitsuo Ishida - Educação Financeira que Transforma',
    template: '%s | Mitsuo Ishida',
  },
  description:
    'Domine seu dinheiro em 30 dias com a metodologia do Mitsuo Ishida. Cursos, consultoria e e-books sobre finanças pessoais, impostos e investimentos.',
  keywords: [
    'educação financeira',
    'imposto de renda',
    'investimentos',
    'finanças pessoais',
    'mitjunior',
    'mitsuo ishida',
    'cursos online',
    'consultoria financeira',
    'planejamento financeiro',
    'como investir',
    'educação fiscal',
  ],
  authors: [{ name: 'Mitsuo Ishida (mitjunior)' }],
  creator: 'Mitsuo Ishida',
  publisher: 'Mitsuo Ishida',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://mitsuoishida.com',
    siteName: 'Mitsuo Ishida',
    title: 'Mitsuo Ishida - Educação Financeira que Transforma',
    description: 'Domine seu dinheiro em 30 dias com a metodologia do Mitsuo Ishida',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mitsuo Ishida - Educação Financeira',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mitsuo Ishida - Educação Financeira',
    description: 'Domine seu dinheiro em 30 dias',
    images: ['/og-image.jpg'],
    creator: '@mitjunior',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token_aqui',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://mitsuoishida.com" />
        <meta name="theme-color" content="#00C896" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ErrorBoundary>
          <HydrationSafeWrapper>
            <ThemeProvider>
              <AuthProvider>
                <GamificationProvider>
                  <LoadingWrapper>
                    {children}
                  </LoadingWrapper>
                </GamificationProvider>
              </AuthProvider>
            </ThemeProvider>
          </HydrationSafeWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}
