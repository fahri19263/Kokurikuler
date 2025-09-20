import React, { useState, useEffect } from 'react';
import { PROFILE_DETAILS } from '../constants';
import { Footer } from '../components/Footer';
import { PresentationNav } from '../components/PresentationNav';

interface ProfilePageProps {
  onNavigateHome: () => void;
}

const SLIDES = [
    { id: 'intro', title: 'Pengenalan' },
    ...PROFILE_DETAILS.map((p, i) => ({
        id: `profil-${i}`,
        title: p.title
    }))
];

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigateHome }) => {
  const [activeSlideId, setActiveSlideId] = useState(SLIDES[0].id);

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

  const handleNavigate = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  return (
    <div className="bg-slate-50 min-h-screen flex flex-col h-screen">
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
              onClick={onNavigateHome}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </header>

      <div className="presentation-container flex-grow">
          {/* Intro Slide */}
          <section id="intro" className="presentation-slide justify-center items-center">
              <div className="presentation-slide-content text-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                      8 Dimensi Profil Lulusan
                  </h1>
                  <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-600">
                      Landasan pengembangan karakter dan kompetensi siswa melalui setiap kegiatan kokurikuler. Temukan inspirasi kegiatan untuk setiap dimensi di bawah ini.
                  </p>
              </div>
          </section>

          {/* Slides for each profile */}
          {PROFILE_DETAILS.map((profile, index) => (
              <section key={index} id={`profil-${index}`} className="presentation-slide bg-white justify-center items-center">
                  <div className="presentation-slide-content p-4 sm:p-8 rounded-lg shadow-lg border border-slate-200 max-w-4xl w-full">
                      <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">{profile.title}</h2>
                      <p className="mt-3 text-slate-600 leading-relaxed">{profile.description}</p>
                      <div className="mt-6">
                          <h3 className="text-lg font-semibold text-slate-800">Contoh Inspirasi Kegiatan:</h3>
                          <ul className="mt-3 list-disc list-inside space-y-2 text-slate-700">
                              {profile.activities.map((activity, actIndex) => (
                                  <li key={actIndex}>{activity}</li>
                              ))}
                          </ul>
                      </div>
                  </div>
              </section>
          ))}
          
          {/* Footer Slide */}
          <section className="presentation-slide items-center justify-center" style={{ height: 'auto', backgroundColor: '#1e293b' /* bg-slate-800 */ }}>
             <Footer />
          </section>
      </div>
    </div>
  );
};