import Navbar from './Component/Navbar';
import Footer from './Component/Footer';
import SupportSection from './Component/SupportSection';

export default function SupportPage() {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        <SupportSection />
      </div>
      <Footer />
    </div>
  );
}
