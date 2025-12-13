export function WelcomeScreen({ 
  isDarkTheme, 
  onAddMatch, 
  presets,
  onShowSaveTemplate,
  onShowManageActions 
}) {
  return (
    <div className={`h-screen flex flex-col overflow-hidden ${isDarkTheme ? 'bg-gradient-to-br from-slate-900 to-slate-950' : 'bg-gradient-to-br from-indigo-50 to-blue-50'}`}>
      <header className="bg-white dark:bg-slate-900 shadow-lg flex-shrink-0 safe-top border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center justify-center px-3 py-2.5">
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
              FTC AutoConfig
            </h1>
            <p className="text-xs text-indigo-600 dark:text-indigo-300 leading-none">
              Autonomous Match Configuration
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-slate-800">
            <div className="mb-6">
              <div className="w-20 h-20 bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Welcome to FTC AutoConfig
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Configure your autonomous routines for FTC matches
              </p>
            </div>

            <button
              onClick={onAddMatch}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-bold text-lg transition-colors min-h-[56px] touch-manipulation shadow-lg hover:shadow-xl"
            >
              Create Your First Match
            </button>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-800">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Or get started with:</p>
              <div className="space-y-2">
                {presets.length > 0 && (
                  <button
                    onClick={onShowSaveTemplate}
                    className="w-full py-2 px-4 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 active:bg-gray-300 text-gray-700 dark:text-gray-100 rounded-lg font-medium text-sm transition min-h-[44px] touch-manipulation"
                  >
                    ?? Load a Template
                  </button>
                )}
                <button
                  onClick={onShowManageActions}
                  className="w-full py-2 px-4 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 active:bg-gray-300 text-gray-700 dark:text-gray-100 rounded-lg font-medium text-sm transition min-h-[44px] touch-manipulation"
                >
                  ?? Configure Actions
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-slate-800/70 border border-blue-200 dark:border-slate-700 rounded-lg p-4 text-left">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800 dark:text-blue-100">
                <strong className="font-semibold">Quick Start:</strong> Create a match, configure your starting position and actions, then scan the QR code with your robot.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
