export function getActionDisplayLabel(action) {
  return action.label;
}

export function isValidReorder(actionList, fromIndex, toIndex) {
  if (fromIndex === -1 || toIndex === -1) return false;
  const dragged = actionList[fromIndex];
  if (!dragged) return false;
  
  // Allow all reordering - no restrictions
  return true;
}

export function createNewAction(action) {
  const newAction = {
    id: crypto.randomUUID(),
    type: action.id,
    label: action.label
  };

  // Only add config if the action has config defined
  if (action.config && Object.keys(action.config).length > 0) {
    newAction.config = { ...action.config };
  }

  return newAction;
}
