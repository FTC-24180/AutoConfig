import { BaseModal, ModalButton } from './common/BaseModal';

export function DeleteMatchModal({ isOpen, matchNumber, onClose, onConfirm }) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      closeOnOverlay={true}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-red-800 dark:text-red-200">Delete Match</h3>
          <p className="text-sm text-red-600 dark:text-red-400">This action cannot be undone</p>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300">
        Are you sure you want to delete <strong className="font-semibold text-gray-900 dark:text-gray-100">Match #{matchNumber}</strong>?
      </p>

      <div className="flex gap-3 mt-6">
        <ModalButton.Secondary onClick={onClose}>
          Cancel
        </ModalButton.Secondary>
        <ModalButton.Danger onClick={onConfirm}>
          Delete
        </ModalButton.Danger>
      </div>
    </BaseModal>
  );
}
