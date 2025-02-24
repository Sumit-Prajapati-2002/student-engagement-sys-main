'use client';

import { useState } from 'react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  selectedField: string;
  onNext: () => void;
  onPrev: () => void;
  isLoading?: boolean;
}

export function NavigationButtons({ 
  currentStep, 
  totalSteps, 
  selectedField, 
  onNext, 
  onPrev,
  isLoading = false 
}: NavigationButtonsProps) {
  
  return (
    <div className="flex justify-between mt-8 gap-4 flex-wrap sm:flex-nowrap">
      <button
        onClick={onPrev}
        disabled={currentStep === 1 || isLoading}
        className={`nav-button prev flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 w-full sm:w-auto
          ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-lg'}
          bg-[#1E1E1E]/60 backdrop-blur-lg text-[#8B5CF6] border-2 border-[#8B5CF6]`}
      >
        <i className="fas fa-arrow-left"></i>
        Previous
      </button>

      <button
        onClick={onNext}
        disabled={isLoading}
        className={`nav-button next flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 w-full sm:w-auto
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-lg'}
          bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            {currentStep === totalSteps ? (
              <>
                Generate Roadmap
                <i className="fas fa-paper-plane"></i>
              </>
            ) : (
              <>
                Next
                <i className="fas fa-arrow-right"></i>
              </>
            )}
          </>
        )}
      </button>
    </div>
  );
} 