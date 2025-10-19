import HeroSection from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { SocialProof } from '@/components/landing/SocialProof';
import { PricingSection } from '@/components/landing/PricingSection';
import Footer from '@/components/layout/Footer';

export default function TestPage() {
  return (
    <div className="bg-[#0F1419] text-white min-h-screen">
      <main>
        <HeroSection />
        <FeaturesSection />
        <SocialProof autoPlay={true} autoPlayInterval={6000} />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}