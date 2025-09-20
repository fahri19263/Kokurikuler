import React, { useState } from 'react';

interface LevelSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (level: string, query: string) => void;
}

const levels = [
  { key: 'PAUD', name: 'PAUD / TK' },
  { key: 'SD', name: 'SD' },
  { key: 'SMP', name: 'SMP' },
  { key: 'SMA', name: 'SMA' },
  { key: 'SMK', name: 'SMK' },
];

export const LevelSelectionModal: React.FC<LevelSelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="level-select-title"
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-sm w-full transform transition-transform duration-300 scale-95 animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-slate-200">
          <h2 id="level-select-title" className="text-xl font-bold text-slate-800">Pilih Jenjang Pendidikan</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Tutup modal">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <label htmlFor="idea-input" className="block text-sm font-medium text-slate-700">
              Punya ide awal? (Opsional)
            </label>
            <textarea
              id="idea-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Contoh: kegiatan tentang robotik, festival budaya, atau kemah di alam terbuka..."
            />
            <p className="mt-1 text-xs text-slate-500">Jelaskan ide Anda untuk membantu AI memberikan rekomendasi yang lebih sesuai.</p>
          </div>
          <p className="text-slate-600 mb-4 font-medium">Pilih jenjang untuk melanjutkan:</p>
          <div className="grid grid-cols-1 gap-3">
            {levels.map(level => (
              <button
                key={level.key}
                onClick={() => onSelect(level.key, query)}
                className="w-full text-left px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-md hover:bg-indigo-100 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              >
                {level.name}
              </button>
            ))}
          </div>
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