import React, { forwardRef } from 'react';
import { Tooltip } from './Tooltip';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  tooltipText?: string;
  min?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({ label, name, value, onChange, type = 'text', placeholder, tooltipText, min }, ref) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <label htmlFor={name} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        {tooltipText && <Tooltip text={tooltipText} />}
      </div>
      <input
        ref={ref}
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
});

InputField.displayName = 'InputField';