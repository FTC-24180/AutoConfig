const THEME_OPTIONS = [
  { 
    id: 'system', 
    label: 'System', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    id: 'light', 
    label: 'Light', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  { 
    id: 'dark', 
    label: 'Dark', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    )
  },
];

export function SettingsMenu({
  themePreference,
  resolvedTheme,
  onThemeChange,
  useInches,
  onUnitsChange,
  useDegrees,
  onAngleUnitsChange,
  onClearAllData
}) {
  const resolvedThemeLabel = resolvedTheme.charAt(0).toUpperCase() + resolvedTheme.slice(1);

  return (
    <div className="space-y-6">
      {/* Theme Selector */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Appearance</h3>
        <div className="grid grid-cols-3 gap-2">
          {THEME_OPTIONS.map(option => (
            <button
              key={option.id}
              onClick={() => onThemeChange(option.id)}
              className={`p-3 rounded-lg border text-sm font-semibold transition flex flex-col items-center gap-1 min-h-[72px] ${
                themePreference === option.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100'
              }`}
            >
              <span className={themePreference === option.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'}>
                {option.icon}
              </span>
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          {themePreference === 'system'
            ? `Following OS preference (currently ${resolvedThemeLabel}).`
            : `Forced ${themePreference} mode.`}
        </p>
      </div>

      {/* Distance Units Preference */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Distance Units</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onUnitsChange(true)}
            className={`p-3 rounded-lg border text-sm font-semibold transition flex flex-col items-center gap-1 min-h-[72px] ${
              useInches
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100'
            }`}
          >
            <svg className={`w-5 h-5 ${useInches ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Inches
          </button>
          <button
            onClick={() => onUnitsChange(false)}
            className={`p-3 rounded-lg border text-sm font-semibold transition flex flex-col items-center gap-1 min-h-[72px] ${
              !useInches
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100'
            }`}
          >
            <svg className={`w-5 h-5 ${!useInches ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Meters
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Distance units. Internal storage is always in meters.
        </p>
      </div>

      {/* Angle Units Preference */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Angle Units</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onAngleUnitsChange(true)}
            className={`p-3 rounded-lg border text-sm font-semibold transition flex flex-col items-center gap-1 min-h-[72px] ${
              useDegrees
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100'
            }`}
          >
            <svg className={`w-5 h-5 ${useDegrees ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Degrees
          </button>
          <button
            onClick={() => onAngleUnitsChange(false)}
            className={`p-3 rounded-lg border text-sm font-semibold transition flex flex-col items-center gap-1 min-h-[72px] ${
              !useDegrees
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100'
            }`}
          >
            <svg className={`w-5 h-5 ${!useDegrees ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Radians
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Angle units. Internal storage is always in degrees.
        </p>
      </div>

      {/* Clear All Data - Danger Zone */}
      <div className="pt-4 border-t border-red-200 dark:border-red-500/30 mt-4">
        <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-3">Danger Zone</h3>
        <button
          onClick={onClearAllData}
          className="w-full flex items-center gap-3 p-3 text-left bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 active:bg-red-200 rounded-lg transition touch-manipulation min-h-[48px] border-2 border-red-300 dark:border-red-500/40"
        >
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <div className="font-medium text-red-800 dark:text-red-200">Clear All Data</div>
            <div className="text-xs text-red-600 dark:text-red-400">Delete everything and reset app</div>
          </div>
        </button>
      </div>
    </div>
  );
}
