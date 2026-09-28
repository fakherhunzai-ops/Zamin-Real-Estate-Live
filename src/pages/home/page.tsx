import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import FeaturedProperties from './components/FeaturedProperties';
import BrowseByLocation from './components/BrowseByLocation';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import FinalCTA from './components/FinalCTA';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <FeaturedProperties />
        <BrowseByLocation />
        <Services />
        <WhyChooseUs />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}