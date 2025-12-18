import { useState } from 'react';

export function ManageStartPositionsModal({
  startPositions,
  onClose,
  onExportConfig,
  onAddStartPosition,
  onUpdateStartPosition,
  onDeleteStartPosition
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPositionLabel, setNewPositionLabel] = useState('');

  // Add custom position (S0) to the display list
  const allPositions = [
    { key: 'S0', label: 'Custom', isSystem: true },
    ...startPositions
  ];

  const handleAdd = () => {
    setShowAddModal(true);
    // Auto-generate default label based on next key number
    const nextKeyNumber = Math.max(
      ...startPositions.map(pos => {
        const match = pos.key?.match(/^S(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      }).filter(n => n > 0),
      0
    ) + 1;
    setNewPositionLabel(`Start Position ${nextKeyNumber}`);
  };

  const confirmAdd = () => {
    if (newPositionLabel.trim()) {
      onAddStartPosition(newPositionLabel.trim());
    }
    setShowAddModal(false);
    setNewPositionLabel('');
  };

  const cancelAdd = () => {
    setShowAddModal(false);
    setNewPositionLabel('');
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 flex items-start justify-center overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-4 my-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Configure Start Positions</h3>
            <div className="flex gap-2">
              <button onClick={onExportConfig} className="flex items-center gap-1 py-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
              <button onClick={onClose} className="py-1 px-2 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-gray-100 rounded transition">
                Close
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100">Available Start Positions</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Keys are auto-generated in S{'{n}'} format for QR codes. Labels are for app display only. Custom position (S0) is reserved and always available.
            </p>
          </div>

          <div className="space-y-2">
            {allPositions.map((pos, idx) => {
              const isCustom = pos.key === 'S0';
              const actualIdx = isCustom ? -1 : idx - 1; // Adjust index for non-custom positions
              
              return (
                <div key={pos.key || idx} className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="flex gap-3 items-center">
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Read-only key */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-12">Key:</span>
                        <div className="px-3 py-1.5 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-700 border-2 border-gray-400 dark:border-slate-500 rounded text-sm font-mono font-bold text-gray-900 dark:text-gray-100 shadow-inner">
                          {pos.key}
                        </div>
                        {isCustom && (
                          <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">(System)</span>
                        )}
                      </div>
                      {/* Label - editable only for non-custom positions */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-12">Label:</span>
                        {isCustom ? (
                          <div className="flex-1 px-2 py-1 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded text-sm text-gray-700 dark:text-gray-300">
                            {pos.label}
                          </div>
                        ) : (
                          <input
                            value={pos.label}
                            onChange={(e) => onUpdateStartPosition(actualIdx, { label: e.target.value })}
                            className="flex-1 px-2 py-1 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Display label"
                          />
                        )}
                      </div>
                    </div>
                    {/* Delete button - hidden for custom position */}
                    {!isCustom && (
                      <button
                        onClick={() => onDeleteStartPosition(actualIdx)}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-red-600 transition flex-shrink-0"
                        title="Delete position"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                    {isCustom && (
                      <div className="w-8 h-8 flex-shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}

            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg font-semibold transition min-h-[48px] touch-manipulation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Position
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>Keys vs Labels:</strong> Position keys (S1, S2, etc.) are auto-generated and immutable. They're encoded in QR codes. Labels are editable and used for display in the app only. S0 is reserved for custom position.
            </p>
          </div>
        </div>
      </div>

      {/* Add Position Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-slate-800">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Add Start Position</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Position Label
                </label>
                <input
                  type="text"
                  value={newPositionLabel}
                  onChange={(e) => setNewPositionLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      confirmAdd();
                    } else if (e.key === 'Escape') {
                      cancelAdd();
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Center, Corner, Custom Front"
                  autoFocus
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  This label will be used for display in the app only. The key will be auto-generated.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cancelAdd}
                  className="flex-1 py-2 px-4 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-100 rounded-lg font-semibold transition min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAdd}
                  disabled={!newPositionLabel.trim()}
                  className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition min-h-[44px]"
                >
                  Add Position
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
