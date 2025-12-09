export function ActionPicker({
  actionGroups,
  actionList,
  hasStart,
  hasPark,
  expandedGroup,
  setExpandedGroup,
  onAddAction,
  PICKUP_IDS
}) {
  return (
    <div>
      {Object.entries(actionGroups).map(([groupKey, group]) => {
        const childStates = group.actions.map(action => {
          const disabledPickup = PICKUP_IDS.includes(action.id) && actionList.some(a => a.type === action.id);
          const disabledStart = (groupKey === 'start') && hasStart;
          const disabledPark = (groupKey === 'parking') && hasPark;
          const disabledBecauseNoStart = !hasStart && groupKey !== 'start';
          const disabled = disabledPickup || disabledStart || disabledPark || disabledBecauseNoStart;
          return !disabled;
        });

        const groupHasEnabledChild = childStates.some(Boolean);

        return (
          <div key={groupKey} className="mb-3">
            <button
              onClick={() => groupHasEnabledChild && setExpandedGroup(expandedGroup === groupKey ? null : groupKey)}
              className={`w-full flex items-center justify-between p-3 ${
                groupHasEnabledChild ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-100 opacity-50 cursor-not-allowed'
              } rounded-lg transition`}
              aria-disabled={!groupHasEnabledChild}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{group.icon}</span>
                <span className="font-semibold text-gray-800">{group.label}</span>
              </div>
              <span className="text-gray-500 text-xl">{expandedGroup === groupKey ? '?' : '+'}</span>
            </button>

            {expandedGroup === groupKey && (
              <div className="mt-2 space-y-2 pl-4">
                {group.actions.map(action => {
                  const disabledPickup = PICKUP_IDS.includes(action.id) && actionList.some(a => a.type === action.id);
                  const disabledStart = (groupKey === 'start') && hasStart;
                  const disabledPark = (groupKey === 'parking') && hasPark;
                  const disabledBecauseNoStart = !hasStart && groupKey !== 'start';
                  const disabled = disabledPickup || disabledStart || disabledPark || disabledBecauseNoStart;
                  return (
                    <button
                      key={action.id}
                      onClick={() => {
                        if (disabled) return;
                        onAddAction(action);
                      }}
                      className={`w-full text-left p-3 ${
                        disabled ? 'bg-gray-50 opacity-50 cursor-not-allowed' : 'bg-white hover:bg-indigo-50'
                      } border border-gray-200 rounded-lg transition`}
                      aria-disabled={disabled}
                    >
                      <span className="text-sm font-medium text-gray-800">{action.label}</span>
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
