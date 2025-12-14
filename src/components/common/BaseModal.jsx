/**
 * Base modal component with consistent structure and styling
 * Reduces duplication across ClearDataModal, DeleteMatchModal, etc.
 */
export function BaseModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  maxWidth = "max-w-md",
  closeOnOverlay = true 
}) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
      style={{ 
        paddingTop: 'max(1rem, env(safe-area-inset-top))', 
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' 
      }}
      onClick={handleOverlayClick}
    >
      <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ${maxWidth} w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-slate-800`}>
        {/* Header */}
        {title && (
          <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h3>
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>

        {/* Footer - Fixed */}
        {footer && (
          <div className="flex-shrink-0 bg-gray-50 dark:bg-slate-800 px-6 py-4 flex gap-3 border-t border-gray-200 dark:border-slate-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Reusable button styles for modals
 */
export const ModalButton = {
  Primary: ({ children, onClick, disabled = false, className = "" }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition min-h-[48px] touch-manipulation ${className}`}
    >
      {children}
    </button>
  ),
  
  Secondary: ({ children, onClick, className = "" }) => (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-4 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 active:bg-gray-100 text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg font-semibold transition min-h-[48px] touch-manipulation ${className}`}
    >
      {children}
    </button>
  ),
  
  Danger: ({ children, onClick, disabled = false, className = "" }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition min-h-[48px] touch-manipulation ${className}`}
    >
      {children}
    </button>
  ),
};
