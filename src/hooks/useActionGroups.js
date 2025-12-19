import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storageUtils';

// Default action groups with A{n} keys
const DEFAULT_ACTION_GROUPS = {
  actions: {
    label: 'Actions',
    icon: '\u26A1',
    actions: [

    ]
  },
  wait: {
    label: 'Wait',
    icon: '\u23F1\uFE0F',
    actions: [
      { id: 'W', label: 'Wait', config: { waitTime: 1000 } }
    ]
  }
};

// Empty action groups structure for cleared state
const EMPTY_ACTION_GROUPS = {
  actions: {
    label: 'Actions',
    icon: '\u26A1',
    actions: []
  },
  wait: {
    label: 'Wait',
    icon: '\u23F1\uFE0F',
    actions: [
      { id: 'W', label: 'Wait', config: { waitTime: 1000 } }
    ]
  }
};

/**
 * useActionGroups - Manages action groups with sparse A{n} keys
 * Actions group uses A{n} format, Wait group uses fixed W key
 */
export function useActionGroups() {
  const [actionGroups, setActionGroups] = useState(() => {
    const stored = getStorageItem(STORAGE_KEYS.ACTION_GROUPS, null);
    const initialized = getStorageItem(STORAGE_KEYS.ACTIONS_INITIALIZED, null);
    
    // If storage has never been initialized (null), use defaults for first time
    if (stored === null && initialized === null) {
      setStorageItem(STORAGE_KEYS.ACTIONS_INITIALIZED, 'true');
      return DEFAULT_ACTION_GROUPS;
    }
    
    // If initialized flag is 'cleared', return empty structure
    if (initialized === 'cleared') {
      return EMPTY_ACTION_GROUPS;
    }
    
    // If we have stored data, use it
    if (stored && typeof stored === 'object') {
      return stored;
    }
    
    // Fallback to defaults
    return DEFAULT_ACTION_GROUPS;
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ACTION_GROUPS, actionGroups);
  }, [actionGroups]);

  /**
   * Get the next available A{n} key for actions group
   * Uses lowest available ordinal in sparse array
   */
  const getNextActionKey = () => {
    const actionsGroup = actionGroups.actions;
    if (!actionsGroup) return 'A1';
    
    const existingNumbers = actionsGroup.actions
      .map(action => {
        const match = action.id?.match(/^A(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(n => n > 0);
    
    if (existingNumbers.length === 0) return 'A1';
    
    // Find lowest available number
    existingNumbers.sort((a, b) => a - b);
    for (let i = 1; i <= existingNumbers[existingNumbers.length - 1]; i++) {
      if (!existingNumbers.includes(i)) {
        return `A${i}`;
      }
    }
    
    // If no gaps, use next number after max
    return `A${existingNumbers[existingNumbers.length - 1] + 1}`;
  };

  const addActionToGroup = (groupKey, actionData) => {
    setActionGroups(prev => {
      const group = prev[groupKey];
      if (!group) return prev;
      
      // For actions group, auto-assign next A{n} key if not provided or invalid
      let actionId = actionData.id;
      if (groupKey === 'actions') {
        if (!actionId || !actionId.match(/^A\d+$/)) {
          actionId = getNextActionKey();
        }
      }
      
      const newAction = {
        id: actionId,
        label: actionData.label || actionId,
        ...(actionData.config && { config: actionData.config })
      };
      
      return {
        ...prev,
        [groupKey]: {
          ...group,
          actions: [...group.actions, newAction]
        }
      };
    });
  };

  const updateActionInGroup = (groupKey, actionIndex, updates) => {
    setActionGroups(prev => {
      const group = prev[groupKey];
      if (!group) return prev;
      
      const newActions = [...group.actions];
      newActions[actionIndex] = { ...newActions[actionIndex], ...updates };
      
      return {
        ...prev,
        [groupKey]: {
          ...group,
          actions: newActions
        }
      };
    });
  };

  const deleteActionInGroup = (groupKey, actionIndex) => {
    setActionGroups(prev => {
      const group = prev[groupKey];
      if (!group) return prev;
      
      return {
        ...prev,
        [groupKey]: {
          ...group,
          actions: group.actions.filter((_, i) => i !== actionIndex)
        }
      };
    });
  };

  // Keep other group operations as no-ops (groups are fixed to 'actions' and 'wait')
  const addCustomGroup = () => {};
  const renameGroup = () => {};
  const deleteGroup = () => {};

  return {
    actionGroups,
    addActionToGroup,
    updateActionInGroup,
    deleteActionInGroup,
    addCustomGroup,
    renameGroup,
    deleteGroup,
    exportConfig: () => {}
  };
}
