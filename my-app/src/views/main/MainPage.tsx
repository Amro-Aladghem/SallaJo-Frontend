import Navbar from './Component/Navbar';
import HeroSection from './Component/HeroSection';
import PhilosophySection from './Component/PhilosophySection';
import FeaturesSection from './Component/FeaturesSection';
import SocialToStoreSection from './Component/SocialToStoreSection';
import InventorySection from './Component/InventorySection';
import HowItWorksSection from './Component/HowItWorksSection';
import PricingSection from './Component/PricingSection';
import TrustSection from './Component/TrustSection';
import FinalCtaSection from './Component/FinalCtaSection';
import Footer from './Component/Footer';

export default function MainPage() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <PhilosophySection />
      <FeaturesSection />
      <SocialToStoreSection />
      <InventorySection />
      <HowItWorksSection />
      <PricingSection />
      <TrustSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
}
