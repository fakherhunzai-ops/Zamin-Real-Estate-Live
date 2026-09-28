import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';

export default function StaysLoadingScreen({ label = 'Loading…' }: { label?: string }) {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[70vh] items-center justify-center bg-background-50 px-4 pt-24">
        <div className="flex flex-col items-center gap-3 text-foreground-600">
          <i className="ri-loader-4-line animate-spin text-3xl text-primary-600"></i>
          <p className="text-sm">{label}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}