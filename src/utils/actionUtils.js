export function getActionDisplayLabel(action) {
  if (action.configType === 'start' && action.config) {
    const posType = action.config.positionType;
    if (posType === 'front') return 'Start (Front)';
    if (posType === 'back') return 'Start (Back)';
    if (posType === 'custom') {
      const x = action.config.x ?? 0;
      const y = action.config.y ?? 0;
      const theta = action.config.theta ?? 0;
      return `Start (${x}, ${y}, ${theta}°)`;
    }
  }
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
  let config = null;
  if (action.hasConfig) {
    if (action.configType === 'wait') {
      config = { waitTime: 0 };
    }
  }

  return {
    id: crypto.randomUUID(),
    type: action.id,
    label: action.label,
    config: config,
    configType: action.configType
  };
}
