import Navbar from '@/components/landing/Navbar';
import HeroScrollAnimation from '@/components/landing/HeroScrollAnimation';
import FeatureSection from '@/components/landing/FeatureSection';
import ProductPreview from '@/components/landing/ProductPreview';
import CTASection from '@/components/landing/CTASection';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <HeroScrollAnimation />
      <FeatureSection />
      <ProductPreview />
      <CTASection />
    </main>
  );
}
