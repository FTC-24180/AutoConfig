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
  if (dragged.configType === 'start') return false;
  if (dragged.type === 'near_park' || dragged.type === 'far_park') return false;

  const without = actionList.filter((_, i) => i !== fromIndex);
  let insertIndex = toIndex;
  if (fromIndex < toIndex) insertIndex = toIndex - 1;
  without.splice(insertIndex, 0, dragged);

  const newStartIndex = without.findIndex(a => a.configType === 'start');
  if (newStartIndex !== 0) return false;
  
  const newParkIndex = without.findIndex(a => a.type === 'near_park' || a.type === 'far_park');
  if (newParkIndex !== -1 && newParkIndex !== without.length - 1) return false;
  
  if (insertIndex === 0) return false;
  return true;
}

export function createNewAction(action) {
  let config = null;
  if (action.hasConfig) {
    if (action.configType === 'wait') {
      config = { waitTime: 0 };
    } else if (action.configType === 'start') {
      if (action.positionType === 'custom') {
        config = {
          positionType: 'custom',
          x: 0,
          y: 0,
          theta: 0
        };
      } else {
        config = {
          positionType: action.positionType
        };
      }
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
