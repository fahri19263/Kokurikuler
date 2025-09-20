import React from 'react';
import { HistoryItem, CoCurricularFormData } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  onView: (item: HistoryItem) => void;
  onDelete: (id: number) => void;
  onReload: (formData: CoCurricularFormData) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onView, onDelete, onReload }) => {
  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-md border border-slate-200">
      <h3 className="text-xl font-semibold text-slate-900 mb-4">Riwayat Rencana</h3>
      {history.length === 0 ? (
        <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-slate-800">Riwayat Anda masih kosong</h3>
            <p className="mt-1 text-sm text-slate-500">Setelah Anda membuat rencana pertama, riwayatnya akan muncul di sini untuk akses cepat.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {history.map(item => (
            <li key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{item.title}</p>
                <p className="text-sm text-slate-500">{new Date(item.id).toLocaleString('id-ID')}</p>
              </div>
              <div className="flex flex-shrink-0 flex-wrap items-center justify-end gap-2 ml-2 sm:ml-4">
                 <button 
                  onClick={() => onReload(item.formData)}
                  className="px-3 py-1 text-sm font-medium text-orange-600 bg-orange-100 rounded-md hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label={`Gunakan lagi data untuk ${item.title}`}
                >
                  Gunakan Lagi
                </button>
                <button 
                  onClick={() => onView(item)}
                  className="px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label={`Lihat rencana ${item.title}`}
                >
                  Lihat
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`Hapus rencana ${item.title}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};