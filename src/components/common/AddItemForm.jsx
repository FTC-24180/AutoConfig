import { useState } from 'react';

/**
 * Reusable form for adding items with id and label
 * Used for start positions, action groups, etc.
 */
export function AddItemForm({ 
  onAdd, 
  idPlaceholder = "id", 
  labelPlaceholder = "label",
  buttonText = "Add",
  buttonIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  className = "",
  layout = "horizontal", // "horizontal" or "vertical"
  separateArgs = false, // If true, onAdd(id, label) instead of onAdd({id, label})
  buttonColor = "bg-blue-600 hover:bg-blue-700" // Color classes for the button
}) {
  const [id, setId] = useState('');
  const [label, setLabel] = useState('');

  const handleSubmit = () => {
    if (!id.trim()) return;
    
    if (separateArgs) {
      // For callbacks that expect separate arguments like onAddCustomGroup(key, label)
      onAdd(id.trim(), label.trim() || id.trim());
    } else {
      // For callbacks that expect an object like onAddStartPosition({id, label})
      onAdd({ id: id.trim(), label: label.trim() || id.trim() });
    }
    
    setId('');
    setLabel('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (layout === "vertical") {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <input
          placeholder={idPlaceholder}
          value={id}
          onChange={(e) => setId(e.target.value)}
          onKeyPress={handleKeyPress}
          className="px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded text-xs w-full"
        />
        <input
          placeholder={labelPlaceholder}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyPress={handleKeyPress}
          className="px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded text-xs w-full"
        />
        <button
          onClick={handleSubmit}
          disabled={!id.trim()}
          className={`flex items-center justify-center gap-1 py-1 px-2 ${buttonColor} disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded text-xs transition`}
        >
          {buttonIcon}
          {buttonText}
        </button>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      <input
        placeholder={idPlaceholder}
        value={id}
        onChange={(e) => setId(e.target.value)}
        onKeyPress={handleKeyPress}
        className="px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded w-40"
      />
      <input
        placeholder={labelPlaceholder}
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onKeyPress={handleKeyPress}
        className="px-2 py-1 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded flex-1"
      />
      <button
        onClick={handleSubmit}
        disabled={!id.trim()}
        className={`flex items-center gap-1 py-1 px-3 ${buttonColor} disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded transition min-h-[36px]`}
      >
        {buttonIcon}
        {buttonText}
      </button>
    </div>
  );
}
