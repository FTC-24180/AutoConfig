import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storageUtils';

// Fixed action groups - no customization allowed
// Action keys follow {identifier}{ordinal} pattern: A1, A2, etc.
const FIXED_ACTION_GROUPS = {
  actions: {
    label: 'Actions',
    icon: '\u26A1',
    actions: [
      { id: 'A1', label: 'Near Launch' },
      { id: 'A2', label: 'Far Launch' },
      { id: 'A3', label: 'Spike 1' },
      { id: 'A4', label: 'Spike 2' },
      { id: 'A5', label: 'Spike 3' },
      { id: 'A6', label: 'Park (Near)' },
      { id: 'A7', label: 'Park (Far)' },
      { id: 'A8', label: 'Dump' },
      { id: 'A9', label: 'Corner' },
      { id: 'A10', label: 'Drive To' }
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

/**
 * useActionGroups - Simplified version with fixed groups
 * Only provides actions and wait groups
 * No add/delete/rename functionality
 */
export function useActionGroups() {
  // Always return fixed groups, ignore any stored customizations
  const [actionGroups] = useState(FIXED_ACTION_GROUPS);

  // Clear any old custom groups from storage on mount
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ACTION_GROUPS, FIXED_ACTION_GROUPS);
    setStorageItem(STORAGE_KEYS.ACTIONS_INITIALIZED, 'true');
  }, []);

  // Return fixed groups with no-op mutation functions
  return {
    actionGroups: FIXED_ACTION_GROUPS,
    // These functions are no-ops now - kept for backwards compatibility
    addCustomGroup: () => {},
    renameGroup: () => {},
    deleteGroup: () => {},
    addActionToGroup: () => {},
    updateActionInGroup: () => {},
    deleteActionInGroup: () => {},
    exportConfig: () => {}
  };
}
