import { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import ScrollProgress from '../../components/common/ScrollProgress';
import CursorEffect from '../../components/common/CursorEffect';
import SplashScreen from '../../components/animations/SplashScreen';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { usePortfolio } from '../../context/PortfolioContext';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Achievements from './Achievements';
import Contact from './Contact';

export default function Home() {
  const { loading, error, refresh } = usePortfolio();
  const [booting, setBooting] = useState(() => sessionStorage.getItem('ece_booted') !== '1');

  return (
    <div className="min-h-screen bg-void text-ice">
      <a href="#home" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:bg-cyan focus:px-3 focus:py-2 focus:text-void">
        Skip to content
      </a>
      {booting && <SplashScreen onDone={() => setBooting(false)} />}
      <CursorEffect />
      <ScrollProgress />
      <Navbar />
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <Loader label="LOADING LAB DATABASE…" />
        </div>
      ) : error ? (
        <div className="mx-auto max-w-lg px-6 pt-40">
          <ErrorState message={error} onRetry={refresh} />
        </div>
      ) : (
        <>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Achievements />
          <Contact />
          <Footer />
        </>
      )}
    </div>
  );
}
