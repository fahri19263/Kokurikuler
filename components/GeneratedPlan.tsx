
import React, { useState } from 'react';
import { ThankYouModal } from './ThankYouModal.tsx';
import { formatPlanText } from '../utils/formatters.ts';

interface GeneratedPlanProps {
  plan: string;
  title: string;
  onClose: () => void;
}

export const GeneratedPlan: React.FC<GeneratedPlanProps> = ({ plan, title, onClose }) => {
  const formattedPlan = formatPlanText(plan);
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([plan], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `rencana_${safeTitle || 'kegiatan'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsThankYouModalOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col transform transition-transform duration-300 scale-95 animate-fade-in-up" onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center p-5 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-indigo-700">Rencana Kegiatan Anda</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div 
              className="p-6 sm:p-8 overflow-y-auto text-slate-700 leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: formattedPlan }} />

           <div className="flex flex-wrap justify-end p-5 border-t border-slate-200 bg-slate-50 rounded-b-lg gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent font-medium rounded-md shadow-sm text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Unduh Rencana (.txt)
            </button>
            <button 
              onClick={onClose} 
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Tutup
            </button>
          </div>
        </div>
         <style>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
          }
        `}</style>
      </div>
      {isThankYouModalOpen && (
        <ThankYouModal 
          isOpen={isThankYouModalOpen}
          onClose={() => setIsThankYouModalOpen(false)}
        />
      )}
    </>
  );
};