import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import ConsultCTA from '@/components/base/ConsultCTA';
import { SITE } from '@/utils/site';
import AboutHero from './components/AboutHero';
import Story from './components/Story';
import MissionVision from './components/MissionVision';
import WhyZamin from './components/WhyZamin';
import AreasServed from './components/AreasServed';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-100">
        <AboutHero />
        <Story />
        <MissionVision />
        <WhyZamin />
        <AreasServed />
        <div id="talk-to-team" className="scroll-mt-24">
          <ConsultCTA
            eyebrow="Let’s Talk"
            eyebrowIcon="ri-customer-service-2-line"
            title="Talk to Our Team"
            description="Whether you’re buying your first home, listing a property or exploring an investment, our local advisers are ready to help — with no obligation."
            primary={{ label: 'Contact Our Team', to: '/contact', icon: 'ri-chat-3-line' }}
            secondary={{ label: 'Call Now', href: SITE.phoneHref, icon: 'ri-phone-line' }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}