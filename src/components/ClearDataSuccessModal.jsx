import { BaseModal } from './common/BaseModal';

export function ClearDataSuccessModal({ isOpen }) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => {}} // No close action - auto-reloads
      closeOnOverlay={false}
      maxWidth="max-w-sm"
    >
      <div className="bg-green-50 dark:bg-green-500/10 -mx-6 -mt-6 px-6 py-6 mb-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-green-900 dark:text-green-100">All Data Cleared</h3>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">Successfully deleted</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          All data has been cleared successfully.
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          The page will reload in a moment...
        </p>
        
        {/* Loading indicator */}
        <div className="mt-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    </BaseModal>
  );
}
