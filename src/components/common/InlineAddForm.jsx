import { useState, useEffect, useRef } from 'react';

/**
 * Reusable inline form component for adding items with validation
 * @param {boolean} showForm - Whether the form is visible
 * @param {function} onAdd - Called when user submits the form with valid data
 * @param {function} onCancel - Called when user cancels
 * @param {string} nextKey - The key that will be assigned (e.g., "A3", "S2")
 * @param {function} getDefaultLabel - Function that returns default label based on key
 * @param {string[]} existingLabels - Array of existing labels to check for duplicates
 * @param {string} itemType - Display name for the item type (e.g., "Action", "Start Position")
 * @param {string} panelClassName - CSS class name for panel identification (for click detection)
 */
export function InlineAddForm({
  showForm,
  onAdd,
  onCancel,
  nextKey,
  getDefaultLabel,
  existingLabels,
  itemType = 'Item',
  panelClassName = 'inline-add-form-panel'
}) {
  const [label, setLabel] = useState('');
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  // Auto-focus and select text when form opens
  useEffect(() => {
    if (showForm && inputRef.current) {
      const defaultLabel = getDefaultLabel(nextKey);
      setLabel(defaultLabel);
      setError(null);
      
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [showForm, nextKey, getDefaultLabel]);

  // Validate label in real-time
  useEffect(() => {
    if (!showForm) return;
    
    const trimmedLabel = label.trim();
    
    if (!trimmedLabel) {
      setError('Label cannot be empty');
      return;
    }

    const isDuplicate = existingLabels.some(
      existingLabel => existingLabel.trim().toLowerCase() === trimmedLabel.toLowerCase()
    );

    if (isDuplicate) {
      setError(`A ${itemType.toLowerCase()} with the label "${trimmedLabel}" already exists. Please use a unique label.`);
    } else {
      setError(null);
    }
  }, [label, existingLabels, showForm, itemType]);

  const handleSubmit = () => {
    if (error || !label.trim()) {
      return;
    }

    onAdd(label.trim());
  };

  const handleCancel = () => {
    setLabel('');
    setError(null);
    onCancel();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !error && label.trim()) {
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!showForm) return null;

  const canSubmit = !error && label.trim().length > 0;

  return (
    <div className={`${panelClassName} bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-300 dark:border-indigo-700 rounded-lg p-4`}>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="inline-add-label" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            New {itemType} Label
          </label>
          <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
            {nextKey}
          </span>
        </div>
        <input
          ref={inputRef}
          id="inline-add-label"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`w-full px-3 py-2 border ${
            error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-slate-600'
          } dark:bg-slate-900 dark:text-gray-100 rounded-lg text-sm focus:ring-2 ${
            error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-indigo-500 focus:border-indigo-500'
          }`}
          placeholder={`Enter ${itemType.toLowerCase()} label`}
        />
        {error && (
          <div className="flex items-start gap-1.5 mt-2 text-xs text-red-600 dark:text-red-400">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleCancel}
          className="flex-1 py-2 px-4 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 active:bg-gray-400 text-gray-700 dark:text-gray-100 rounded-lg font-semibold transition min-h-[44px] touch-manipulation"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition min-h-[44px] touch-manipulation ${
            canSubmit
              ? 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white'
              : 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          Add {itemType}
        </button>
      </div>
    </div>
  );
}
