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
    <div className="min-h-screen bg-neutral-900">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SocialProof />
      <TaxAuthoritySection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </div>
  );
}