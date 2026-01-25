import Navbar from '@/components/landing/Navbar';
import HeroScrollAnimation from '@/components/landing/HeroScrollAnimation';
import FeatureScrollAnimation from '@/components/landing/FeatureScrollAnimation';
import CalendarScrollAnimation from '@/components/landing/CalendarScrollAnimation';
import AutomationScrollAnimation from '@/components/landing/AutomationScrollAnimation';
import SimplicityScrollAnimation from '@/components/landing/SimplicityScrollAnimation';
import CTASection from '@/components/landing/CTASection';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <HeroScrollAnimation />
      <FeatureScrollAnimation />
      <CalendarScrollAnimation />
      <AutomationScrollAnimation />
      <SimplicityScrollAnimation />
      <CTASection />
    </main>
  );
}
