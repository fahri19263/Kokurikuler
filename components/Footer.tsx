import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-base text-slate-400">&copy; {new Date().getFullYear()} Portal Kokurikuler Sekolah. All rights reserved.</p>
          <p className="mt-4 text-sm text-slate-500">Dirancang oleh Fahri, Guru SMP Negeri 2 Manggar</p>
        </div>
      </div>
    </footer>
  );
};
