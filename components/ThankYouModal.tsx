import React from 'react';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDonateClick = () => {
    const targetWhatsApp = "6281929200509";
    const message = "Halo, saya ingin memberikan donasi sebagai dukungan untuk pengembangan aplikasi Portal Kokurikuler.";
    const whatsappUrl = `https://wa.me/${targetWhatsApp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[60]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="thank-you-title"
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-md w-full text-center p-8 transform transition-transform duration-300 scale-95 animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
            <svg className="h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <h2 id="thank-you-title" className="text-2xl font-bold text-slate-800">Berhasil Diunduh!</h2>
        <p className="mt-2 text-slate-600">
          Rencana kegiatan Anda telah berhasil diunduh sebagai file teks.
        </p>
        <p className="mt-4 text-sm text-slate-500 bg-slate-100 p-3 rounded-md">
          Jika aplikasi ini bermanfaat, Anda dapat memberikan dukungan untuk pengembangan selanjutnya melalui donasi.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleDonateClick}
          >
            Donasi via WhatsApp
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onClose}
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
  );
};