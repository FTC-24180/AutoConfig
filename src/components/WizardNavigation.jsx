import { useState } from 'react';

export function WizardNavigation({ currentStep, totalSteps, onNext, onPrev, canGoNext = true, nextLabel = 'Next' }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 shadow-lg z-30 safe-bottom">
      <div className="flex items-center justify-between gap-2">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed active:bg-gray-200 disabled:active:bg-gray-100 min-h-[44px] touch-manipulation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="sm:hidden">Back</span>
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Step Indicator */}
        <div className="flex-1 flex items-center justify-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentStep
                  ? 'w-6 bg-indigo-600'
                  : index < currentStep
                  ? 'w-1.5 bg-indigo-400'
                  : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-indigo-600 text-white rounded-lg font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed active:bg-indigo-700 disabled:active:bg-indigo-600 min-h-[44px] touch-manipulation"
        >
          <span>{nextLabel}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
