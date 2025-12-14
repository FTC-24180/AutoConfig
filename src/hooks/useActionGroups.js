import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storageUtils';
import { downloadJSON } from '../utils/configUtils';

const DEFAULT_ACTION_GROUPS = {
  launch: {
    label: 'Launch',
    icon: '🚀',
    actions: [
      { id: 'near_launch', label: 'Near Launch' },
      { id: 'far_launch', label: 'Far Launch' }
    ]
  },
  pickup: {
    label: 'Pickup',
    icon: '📦',
    actions: [
      { id: 'spike_1', label: 'Spike 1' },
      { id: 'spike_2', label: 'Spike 2' },
      { id: 'spike_3', label: 'Spike 3' },
      { id: 'corner', label: 'Corner' }
    ]
  },
  parking: {
    label: 'Parking',
    icon: '🅿️',
    actions: [
      { id: 'near_park', label: 'Park (Near)' },
      { id: 'far_park', label: 'Park (Far)' }
    ]
  },
  other: {
    label: 'Other',
    icon: '🛠️',
    actions: [
      { id: 'dump', label: 'Dump' },
      { id: 'drive_to', label: 'DriveTo' },
      { id: 'wait', label: 'Wait', config: { waitTime: 0 } }
    ]
  }
};

export function useActionGroups() {
  const [actionGroups, setActionGroups] = useState(() => {
    const loaded = getStorageItem(STORAGE_KEYS.ACTION_GROUPS, null);
    
    if (loaded) {
      // Migration: Remove start group if it exists
      if (loaded.start) {
        delete loaded.start;
        setStorageItem(STORAGE_KEYS.ACTION_GROUPS, loaded);
      }
      return loaded;
    }
    
    // Check if actions were previously initialized
    const wasInitialized = getStorageItem(STORAGE_KEYS.ACTIONS_INITIALIZED, null);
    if (wasInitialized === 'true') {
      // Actions were cleared intentionally, return empty
      return {};
    }
    
    // First time - use defaults
    setStorageItem(STORAGE_KEYS.ACTIONS_INITIALIZED, 'true');
    return DEFAULT_ACTION_GROUPS;
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ACTION_GROUPS, actionGroups);
    setStorageItem(STORAGE_KEYS.ACTIONS_INITIALIZED, 'true');
  }, [actionGroups]);

  const addCustomGroup = (key, label) => {
    if (!key) return;
    setActionGroups(prev => ({ ...prev, [key]: { label: label || key, icon: '🛠️', actions: [] } }));
  };

  const renameGroup = (key, newLabel) => {
    setActionGroups(prev => ({ ...prev, [key]: { ...prev[key], label: newLabel } }));
  };

  const deleteGroup = (key) => {
    setActionGroups(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const addActionToGroup = (groupKey, action) => {
    setActionGroups(prev => ({ ...prev, [groupKey]: { ...prev[groupKey], actions: [...(prev[groupKey]?.actions||[]), action] } }));
  };

  const updateActionInGroup = (groupKey, actionIndex, updated) => {
    setActionGroups(prev => {
      const group = prev[groupKey];
      if (!group) return prev;
      const actions = [...group.actions];
      actions[actionIndex] = { ...actions[actionIndex], ...updated };
      return { ...prev, [groupKey]: { ...group, actions } };
    });
  };

  const deleteActionInGroup = (groupKey, actionIndex) => {
    setActionGroups(prev => {
      const group = prev[groupKey];
      if (!group) return prev;
      const actions = group.actions.filter((_, i) => i !== actionIndex);
      return { ...prev, [groupKey]: { ...group, actions } };
    });
  };

  const exportConfig = () => {
    const combinedConfig = { actionGroups };
    downloadJSON(combinedConfig, `ftc-config.json`);
  };

  return {
    actionGroups,
    addCustomGroup,
    renameGroup,
    deleteGroup,
    addActionToGroup,
    updateActionInGroup,
    deleteActionInGroup,
    exportConfig
  };
}
