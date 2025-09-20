

import React, { forwardRef } from 'react';
import { Tooltip } from './Tooltip.tsx';

interface TextareaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  tooltipText?: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(({ label, name, value, onChange, placeholder, rows = 5, tooltipText }, ref) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label htmlFor={name} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        {tooltipText && <Tooltip text={tooltipText} />}
      </div>
      <textarea
        ref={ref}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-y"
      />
    </div>
  );
});

TextareaField.displayName = 'TextareaField';