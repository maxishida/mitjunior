import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/landing/Hero';
import Benefits from '@/components/landing/Benefits';
import Authority from '@/components/landing/Authority';
import Products from '@/components/landing/Products';
import TaxSection from '@/components/landing/TaxSection';
import HowItWorks from '@/components/landing/HowItWorks';

export default function HomePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'ComunidadeFlix',
    description: 'Plataforma de educacao financeira com cursos, consultoria e e-books sobre financas pessoais, impostos e investimentos.',
    url: 'https://comunidadeflix.com',
    logo: 'https://comunidadeflix.com/logo.png',
    sameAs: [
      'https://twitter.com/mitjunior',
      'https://www.instagram.com/mitjunior',
      'https://www.youtube.com/@mitjunior',
    ],
    founder: {
      '@type': 'Person',
      name: 'Mitsuo Ishida',
      alternateName: 'mitjunior',
      jobTitle: 'Especialista em Imposto de Renda',
      description: 'Especialista em Imposto de Renda na Me Poupe!, contador e MBA em investimentos',
      knowsAbout: ['Educacao Financeira', 'Imposto de Renda', 'Investimentos', 'Financas Pessoais'],
    },
    offers: {
      '@type': 'AggregateOffer',
      offerCount: '3',
      lowPrice: '0',
      highPrice: '997',
      priceCurrency: 'BRL',
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Pessoas interessadas em educacao financeira',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '10000',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00C896] focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Pular para conteudo principal
      </a>

      <div className="bg-[#0F1419] text-white min-h-screen flex flex-col">
        <Navbar />
        <main id="main-content" className="flex-grow">
          <Hero />
          <Benefits />
          <Authority />
          <Products />
          <TaxSection />
          <HowItWorks />
        </main>
        <Footer />
      </div>
    </>
  );
}
