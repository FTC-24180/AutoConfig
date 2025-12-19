export function ActionPicker({
  actionGroups,
  actionList,
  expandedGroup,
  setExpandedGroup,
  onAddAction
}) {
  return (
    <div className="space-y-3">
      {Object.entries(actionGroups)
        .filter(([groupKey]) => groupKey !== 'start') // Filter out start group
        .map(([groupKey, group]) => {
          const isExpanded = expandedGroup === groupKey;
          return (
            <div key={groupKey}>
              <button
                onClick={() => setExpandedGroup(isExpanded ? null : groupKey)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition touch-manipulation min-h-[56px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{group.icon}</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{group.label}</span>
                </div>
                <svg 
                  className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isExpanded ? (
                    // Minus icon for collapse
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  ) : (
                    // Plus icon for expand
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  )}
                </svg>
              </button>

              {isExpanded && (
                <div className="mt-2 space-y-2 pl-4">
                  {group.actions.map(action => {
                    // Check if this action type is already in the action list
                    // BUT allow multiple Wait actions (type 'W')
                    const isAlreadyAdded = action.id !== 'W' && actionList.some(a => a.type === action.id);
                    
                    return (
                      <button
                        key={action.id}
                        onClick={() => onAddAction(action)}
                        disabled={isAlreadyAdded}
                        className={`w-full text-left p-3 min-h-[48px] touch-manipulation border rounded-lg transition ${
                          isAlreadyAdded 
                            ? 'bg-gray-100 dark:bg-slate-950 border-gray-300 dark:border-slate-800 opacity-50 cursor-not-allowed'
                            : 'bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border-gray-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${
                            isAlreadyAdded 
                              ? 'text-gray-500 dark:text-gray-500'
                              : 'text-gray-800 dark:text-gray-100'
                          }`}>
                            {action.label}
                          </span>
                          {isAlreadyAdded && (
                            <span className="text-xs text-gray-500 dark:text-gray-500 italic">
                              Already added
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
