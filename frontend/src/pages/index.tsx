import AboutSection from '@/components/ui/AboutSection';
import ContactSection from '@/components/ui/ContactSection';
import CTASection from '@/components/ui/CTASection';
import FeaturesSection from '@/components/ui/FeaturesSection';
import Footer from '@/components/ui/Footer';
import HeroSection from '@/components/ui/HeroSection';
import Navbar from '@/components/ui/Navbar';
import StatsSection from '@/components/ui/StatsSection';
import TestimonialsSection from '@/components/ui/TestimonialsSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
      <CTASection />
      <Footer />
    </div>
  );
}