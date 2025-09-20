
import React from 'react';
import { formatPlanText } from '../utils/formatters.ts';
import { Footer } from '../components/Footer.tsx';

interface SharedPlanPageProps {
  planData: {
    plan: string;
    title: string;
  };
  onNavigateHome: () => void;
}

export const SharedPlanPage: React.FC<SharedPlanPageProps> = ({ planData, onNavigateHome }) => {
  const formattedPlan = formatPlanText(planData.plan);
  
  const handleDownload = () => {
    const blob = new Blob([planData.plan], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = planData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `rencana_${safeTitle || 'kegiatan'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Kembali ke Portal
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <div className="bg-white p-8 sm:p-12 rounded-lg shadow-xl border border-slate-200">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 tracking-tight">
                    {planData.title || "Rencana Kegiatan Kokurikuler"}
                </h1>
                <p className="mt-3 text-slate-500">Ini adalah halaman publik. Bagikan tautan ini kepada siapa saja yang perlu melihat rencana ini.</p>
            </div>
            
            <div className="mb-8 p-4 bg-slate-50 rounded-lg border flex flex-col sm:flex-row gap-3 justify-center">
                 <button onClick={handleDownload} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    Unduh (.txt)
                </button>
                <button onClick={handlePrint} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v-2a1 1 0 011-1h8a1 1 0 011 1v2h1a2 2 0 002-2v-3a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                    Cetak Rencana
                </button>
            </div>

            <div 
              className="text-slate-700 leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: formattedPlan }} 
            />
        </div>
      </main>
      <Footer />
       <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          main, main * {
            visibility: visible;
          }
          main {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          header, footer, .mb-8 {
             display: none;
          }
        }
      `}</style>
    </div>
  );
};