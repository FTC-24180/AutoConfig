export function TemplatesMenu({
  presets,
  onLoadPreset,
  onDeletePreset,
  onPreviewPreset,
  onSaveTemplate,
  onClose
}) {
  return (
    <div>
      <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-3">Stored Configurations</h3>

      {presets.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-slate-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-300 text-sm">No configurations saved yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {presets.map(preset => (
            <div key={preset.id} className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800 dark:text-gray-100 text-sm">{preset.name}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onLoadPreset(preset);
                    onClose();
                  }}
                  className="flex-1 py-2 px-3 bg-indigo-600 active:bg-indigo-700 text-white text-sm rounded-lg transition min-h-[40px] touch-manipulation"
                >
                  Load
                </button>
                <button
                  onClick={() => onPreviewPreset(preset)}
                  className="py-2 px-3 bg-gray-600 active:bg-gray-700 text-white text-sm rounded-lg transition min-h-[40px] min-w-[40px] flex items-center justify-center touch-manipulation"
                  title="Preview JSON"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 006 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDeletePreset(preset)}
                  className="py-2 px-3 bg-red-600 active:bg-red-700 text-white text-sm rounded-lg transition min-h-[40px] touch-manipulation"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Create New Preset Button */}
          <div className="pt-4">
            <button
              onClick={onSaveTemplate}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 active:bg-green-700 text-white rounded-lg font-semibold min-h-[48px] touch-manipulation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Save New Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
