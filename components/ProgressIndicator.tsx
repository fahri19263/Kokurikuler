import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ProgressIndicatorProps {
  title: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ title }) => {
  return (
    <div 
      className="fixed inset-0 bg-slate-900 bg-opacity-75 flex flex-col items-center justify-center z-[100]"
      aria-modal="true"
      role="dialog"
      aria-labelledby="progress-title"
    >
      <div className="text-white text-center p-8">
        <div className="flex justify-center mb-4 text-white">
          <LoadingSpinner />
        </div>
        <h2 id="progress-title" className="text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-slate-300">Harap jangan tutup jendela ini.</p>
      </div>
    </div>
  );
};
