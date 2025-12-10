import { useState } from 'react';

export function WizardNavigation({ currentStep, totalSteps, onNext, onPrev, canGoNext = true, nextLabel = 'Next' }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 px-3 py-3 shadow-lg z-30 safe-bottom">
      <div className="flex items-center justify-between gap-3">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className={`flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-semibold transition min-h-[48px] touch-manipulation shadow-sm ${
            currentStep === 0
              ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 active:scale-95'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="sm:hidden">Back</span>
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Step Indicator */}
        <div className="flex-1 flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? 'w-8 bg-indigo-600'
                  : index < currentStep
                  ? 'w-2 bg-indigo-400'
                  : 'w-2 bg-gray-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-semibold transition min-h-[48px] touch-manipulation shadow-md ${
            !canGoNext
              ? 'bg-indigo-300 dark:bg-indigo-900/40 text-indigo-100 dark:text-indigo-700 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-95'
          }`}
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
