import React from 'react';

interface PresentationNavProps {
  slides: { id: string; title: string }[];
  currentSlideId: string;
  onNavigate: (id: string) => void;
}

export const PresentationNav: React.FC<PresentationNavProps> = ({ slides, currentSlideId, onNavigate }) => {
  return (
    <nav className="fixed top-1/2 right-2 sm:right-4 transform -translate-y-1/2 z-40">
      <ul className="flex flex-col items-center gap-2 sm:gap-3">
        {slides.map((slide) => (
          <li key={slide.id} className="group relative flex justify-center items-center">
             <button
              onClick={() => onNavigate(slide.id)}
              className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:bg-indigo-500/20`}
              aria-label={`Go to section: ${slide.title}`}
              aria-current={currentSlideId === slide.id ? 'step' : undefined}
            >
              <div
                className={`block w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out ${
                  currentSlideId === slide.id ? 'bg-indigo-500 scale-150' : 'bg-slate-400 group-hover:bg-indigo-500 group-hover:scale-125'
                }`}
              />
            </button>
            <span
              className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1 bg-slate-800 text-white text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg"
              role="tooltip"
            >
              {slide.title}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
};