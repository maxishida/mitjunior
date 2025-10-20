import Navigation from '@/components/landing/Navigation';
import HeroSection from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { SocialProof } from '@/components/landing/SocialProof';
import { TaxAuthoritySection } from '@/components/landing/TaxAuthoritySection';
import PricingSection from '@/components/landing/PricingSection';
import { ContactSection } from '@/components/landing/ContactSection';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-background text-white">
      <Navigation />
      <main className="pt-24">
        <HeroSection />

        <div className="space-y-28 md:space-y-36">
          <section className="relative isolate border-y border-white/5 bg-background-secondary/60 backdrop-blur-sm">
            <FeaturesSection className="relative" />
          </section>

          <section className="relative isolate">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/20 via-background-secondary/40 to-background/10" />
            <HowItWorksSection />
          </section>

          <section className="relative isolate border-y border-white/5 bg-background-secondary/40 backdrop-blur-sm">
            <SocialProof />
          </section>

          <section className="relative isolate">
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background-secondary/35 via-background/15 to-background-secondary/20" />
            <TaxAuthoritySection />
          </section>

          <section className="relative isolate border-y border-white/5 bg-gradient-to-b from-background-secondary/60 via-background-secondary/35 to-background/40 backdrop-blur-sm">
            <PricingSection />
          </section>

          <section className="relative isolate">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/10 via-background-secondary/30 to-background/60" />
            <ContactSection />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
