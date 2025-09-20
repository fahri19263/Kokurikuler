
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_ACTIVITIES, MOCK_FAQS } from '../constants.ts';
import { SkeletonLoader } from '../components/SkeletonLoader.tsx';
import { Footer } from '../components/Footer.tsx';
import { PresentationNav } from '../components/PresentationNav.tsx';

interface LandingPageProps {
  onNavigateToCreator: () => void;
  onNavigateToProfile: () => void;
}

const SLIDES = [
    { id: 'hero', title: 'Selamat Datang' },
    { id: 'nilai-kami', title: 'Nilai Kami' },
    { id: 'kegiatan', title: 'Contoh Kegiatan' },
    { id: 'proses', title: 'Proses Perancangan' },
    { id: 'faq', title: 'Tanya Jawab' },
];

const processSteps = [
    { step: 1, title: "Tahap Persiapan", text: "Riset, pembekalan siswa, dan pembentukan tim." },
    { step: 2, title: "Tahap Pelaksanaan", text: "Aksi proyek, kolaborasi, dan bimbingan guru." },
    { step: 3, title: "Tahap Refleksi", text: "Pameran karya, presentasi, dan evaluasi bersama." }
];

const FeaturedActivitySkeleton: React.FC = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
        <div className="h-48 w-full bg-slate-200 animate-pulse"></div>
        <div className="p-6">
            <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse"></div>
            <div className="mt-4 flex flex-wrap gap-2">
                <div className="h-5 w-1/4 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="h-5 w-1/3 bg-slate-200 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToCreator, onNavigateToProfile }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlideId, setActiveSlideId] = useState(SLIDES[0].id);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTopRef = useRef<number>(0);
  const blockFaqCloseRef = useRef(false);
  const blockFaqCloseTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Simulate network request for featured activities
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Observer for slide animations and active slide tracking
  useEffect(() => {
    const slideObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const content = entry.target.querySelector('.presentation-slide-content');
          if (entry.isIntersecting) {
            content?.classList.add('is-active');
            // Update active slide for nav dots when it's mostly in view
            if (entry.intersectionRatio >= 0.7) {
              setActiveSlideId(entry.target.id);
            }
          } else {
            // Reset animation when slide is out of view
            content?.classList.remove('is-active');
          }
        });
      },
      {
        // Use multiple thresholds to handle both animation and nav dot updates
        threshold: [0.5, 0.7],
      }
    );

    const targets = document.querySelectorAll('.presentation-slide[id]');
    targets.forEach((target) => slideObserver.observe(target));

    return () => {
      targets.forEach((target) => slideObserver.unobserve(target));
    };
  }, []);

  // Effect to close FAQs on scroll up
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // If a block is active (because an FAQ was just toggled), ignore this scroll event.
      if (blockFaqCloseRef.current) {
        // Still update the scroll position to prevent the *next* scroll from using a stale value.
        lastScrollTopRef.current = container.scrollTop <= 0 ? 0 : container.scrollTop;
        return;
      }
      
      const currentScrollTop = container.scrollTop;
      
      // Check for scroll up direction (current is less than last).
      // A small threshold (e.g., 5px) prevents it from being too sensitive.
      if (currentScrollTop < lastScrollTopRef.current - 5) {
        const faqDetails = document.querySelectorAll<HTMLDetailsElement>('#faq details[open]');
        faqDetails.forEach((detail) => {
          detail.open = false;
        });
      }

      // Update the last scroll position.
      lastScrollTopRef.current = currentScrollTop <= 0 ? 0 : currentScrollTop;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (blockFaqCloseTimeoutRef.current) {
        clearTimeout(blockFaqCloseTimeoutRef.current);
      }
    };
  }, []);
  
  const handleFaqToggle = () => {
    // When an FAQ is toggled, briefly prevent the scroll handler from closing it.
    // This prevents a side-effect where scroll-snap adjustments trigger the close logic.
    blockFaqCloseRef.current = true;

    if (blockFaqCloseTimeoutRef.current) {
      clearTimeout(blockFaqCloseTimeoutRef.current);
    }

    blockFaqCloseTimeoutRef.current = window.setTimeout(() => {
      blockFaqCloseRef.current = false;
    }, 150); // A 150ms delay is enough for the browser's layout and scroll adjustments to settle.
  };
  
  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  return (
    <div className="bg-slate-50 text-slate-800 h-screen flex flex-col">
      <PresentationNav slides={SLIDES} currentSlideId={activeSlideId} onNavigate={handleNavigate} />
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
               <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <span className="text-xl font-bold text-slate-900">Portal Kokurikuler</span>
            </div>
            <button
              onClick={onNavigateToCreator}
              className="inline-flex items-center px-4 sm:px-6 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:scale-105"
            >
              Rancang Kegiatan
            </button>
          </div>
        </div>
      </header>
      
      <div ref={scrollContainerRef} className="presentation-container flex-grow">
        <main>
          {/* Hero Section */}
          <section id="hero" className="presentation-slide bg-white justify-center items-center">
            <div className="presentation-slide-content max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                <span className="block">Belajar Tanpa Batas,</span>
                <span className="block text-indigo-600">Berkarya Melampaui Kelas.</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-slate-600">
                Jelajahi beragam kegiatan kokurikuler yang dirancang untuk mengembangkan potensi, karakter, dan kreativitas setiap siswa.
              </p>
              <div className="mt-10">
                <button onClick={onNavigateToProfile} className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-full text-white bg-orange-500 hover:bg-orange-600 md:text-lg shadow-lg transition-transform transform hover:scale-105">
                  Jelajahi Profil Lulusan
                  <svg className="ml-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          {/* Value Proposition Section */}
          <section id="nilai-kami" className="presentation-slide bg-slate-50 justify-start sm:justify-center items-center">
            <div className="presentation-slide-content max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Membentuk Lulusan Unggul & Berkarakter</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                  Setiap kegiatan dirancang untuk menumbuhkan dimensi-dimensi kunci profil lulusan.
                </p>
              </div>
              <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: 'users', title: 'Belajar Kolaborasi', text: 'Bekerja sama dalam tim untuk mencapai tujuan bersama.' },
                  { icon: 'puzzle-piece', title: 'Memecahkan Masalah Nyata', text: 'Mengasah penalaran kritis melalui proyek yang relevan.' },
                  { icon: 'light-bulb', title: 'Menuangkan Ide Inovatif', text: 'Mendorong kreativitas untuk menciptakan solusi baru.' },
                  { icon: 'rocket-launch', title: 'Tumbuh Percaya Diri', text: 'Membangun kemandirian dan tanggung jawab pribadi.' },
                ].map((item, index) => (
                  <div key={item.title} className="text-center p-6 bg-white rounded-lg shadow-lg border border-slate-200 transition-transform hover:-translate-y-1">
                     <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          { item.icon === 'users' && <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.273-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.273.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> }
                          { item.icon === 'puzzle-piece' && <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /> }
                          { item.icon === 'light-bulb' && <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /> }
                          { item.icon === 'rocket-launch' && <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a17.918 17.918 0 00-5.84 2.56m0-2.56l-3.14-3.14a6 6 0 017.38-5.84m-1.56 8.4l-2.22-2.22a1.5 1.5 0 00-2.12 0l-1.56 1.56a1.5 1.5 0 000 2.12l2.22 2.22a1.5 1.5 0 002.12 0l1.56-1.56a1.5 1.5 0 000-2.12z" /> }
                        </svg>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-base text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Activities Section */}
          <section id="kegiatan" className="presentation-slide justify-start sm:justify-center items-center">
            <div className="presentation-slide-content max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Temukan Passion Kamu di Sini</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                  Dari sains hingga seni, temukan kegiatan yang paling cocok untukmu.
                </p>
              </div>
              <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => <FeaturedActivitySkeleton key={index} />)
                ) : (
                  MOCK_ACTIVITIES.map((activity, index) => (
                    <div key={activity.title} className="group relative bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200 transition-transform duration-300 hover:-translate-y-2">
                      <img className="h-48 w-full object-cover" src={activity.imageUrl} alt={activity.title} />
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{activity.title}</h3>
                        <p className="mt-1 text-sm font-medium text-slate-500">{activity.target}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {activity.tags.map(tag => (
                            <span key={tag} className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section id="proses" className="presentation-slide bg-slate-50 justify-start sm:justify-center items-center">
             <div className="presentation-slide-content max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                  <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Dirancang untuk Hasil Terbaik</h2>
                  <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                      Setiap kegiatan melalui alur perancangan yang terstruktur untuk memastikan dampak maksimal.
                  </p>
              </div>
              <div className="mt-16 w-full">
                  <div className="relative md:grid md:grid-cols-3 md:gap-10 space-y-12 md:space-y-0">
                      {/* Horizontal line for desktop */}
                      <div className="hidden md:block absolute top-5 left-0 w-full h-0.5 bg-slate-300" aria-hidden="true"></div>
                      
                      {processSteps.map((item, index) => (
                          <div key={item.step} className="relative text-center">
                              {/* Vertical line connector for mobile */}
                              {index < processSteps.length - 1 && (
                                  <div className="md:hidden absolute top-5 left-1/2 -translate-x-1/2 w-0.5 h-full bg-slate-300" aria-hidden="true"></div>
                              )}
                              <div className="relative flex flex-col items-center">
                                  <div className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white font-bold rounded-full border-4 border-slate-50 z-10">{item.step}</div>
                                  <div className="mt-6 p-4 sm:p-6 bg-white rounded-lg shadow-lg border border-slate-200">
                                      <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                                      <p className="mt-2 text-base text-slate-600">{item.text}</p>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
             </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="presentation-slide justify-start items-center pt-24 sm:pt-32">
              <div className="presentation-slide-content max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center">
                      <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Pertanyaan Umum</h2>
                      <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                          Menemukan jawaban untuk pertanyaan yang paling sering diajukan oleh siswa dan orang tua.
                      </p>
                  </div>
                  <div className="mt-12 space-y-4 w-full">
                      {MOCK_FAQS.map((faq, index) => (
                          <details
                            key={index}
                            className="group bg-white p-6 rounded-lg shadow-sm border border-slate-200 transition-colors hover:bg-slate-50"
                            onToggle={handleFaqToggle}
                          >
                              <summary className="flex justify-between items-center cursor-pointer font-semibold text-slate-900 text-lg">
                                  {faq.question}
                                  <svg className="w-5 h-5 text-slate-500 transform transition-transform duration-300 group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                              </summary>
                              <p className="mt-4 text-slate-600 leading-relaxed">
                                  {faq.answer}
                              </p>
                          </details>
                      ))}
                  </div>
              </div>
          </section>
        </main>

        <section className="presentation-slide items-center justify-center" style={{ height: 'auto', backgroundColor: '#1e293b' /* bg-slate-800 */ }}>
          <Footer />
        </section>
      </div>
    </div>
  );
};