
import React, { forwardRef } from 'react';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection = forwardRef<HTMLDivElement, FormSectionProps>(({ title, children }, ref) => {
  return (
    <div ref={ref} className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-slate-200" style={{scrollMarginTop: '100px'}}>
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 border-b border-slate-200 pb-4 mb-6">
        {title}
      </h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
});

FormSection.displayName = 'FormSection';
