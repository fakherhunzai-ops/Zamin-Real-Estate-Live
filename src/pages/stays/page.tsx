import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import StaysHero from './components/StaysHero';
import FeaturedStays from './components/FeaturedStays';
import ExploreDestinations from './components/ExploreDestinations';
import StayTypeBrowser from './components/StayTypeBrowser';
import WhyBookZamin from './components/WhyBookZamin';
import StaysHostingSection from './components/StaysHostingSection';
import StaysFinalCTA from './components/StaysFinalCTA';

export default function StaysLandingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-50">
        <StaysHero />
        <FeaturedStays />
        <ExploreDestinations />
        <StayTypeBrowser />
        <WhyBookZamin />
        <StaysHostingSection />
        <StaysFinalCTA />
      </main>
      <Footer />
    </>
  );
}