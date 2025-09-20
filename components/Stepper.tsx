import React from 'react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
  onStepClick?: (stepNumber: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, steps, onStepClick }) => {
  return (
    <div className="w-full mb-8">
        <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:rounded-lg after:bg-slate-200">
            <ol className="relative z-10 flex justify-between text-sm font-medium text-slate-500">
                {steps.map((title, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = currentStep > stepNumber;
                    const isCurrent = currentStep === stepNumber;
                    const canClick = onStepClick !== undefined;

                    return (
                        <li 
                            key={stepNumber} 
                            className={`flex items-center gap-2 bg-slate-50 p-2 ${canClick ? 'cursor-pointer' : ''}`}
                            onClick={() => onStepClick?.(stepNumber)}
                        >
                            <span
                                className={`h-6 w-6 rounded-full text-center text-[10px]/6 font-bold flex items-center justify-center transition-colors ${
                                    isCompleted ? 'bg-indigo-600 text-white' : 
                                    isCurrent ? 'bg-indigo-600 text-white ring ring-indigo-200' : 
                                    'bg-slate-200 text-slate-700'
                                }`}
                            >
                                {isCompleted ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    stepNumber
                                )}
                            </span>
                            <span className={`hidden sm:block transition-colors ${isCurrent ? 'text-indigo-600 font-semibold' : ''}`}>{title}</span>
                        </li>
                    );
                })}
            </ol>
        </div>
    </div>
  );
};