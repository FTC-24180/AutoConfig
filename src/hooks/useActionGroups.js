import { useState, useEffect } from 'react';

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

const ACTIONS_STORAGE_KEY = 'ftc-autoconfig-action-groups';

export function useActionGroups() {
  const [actionGroups, setActionGroups] = useState(() => {
    try {
      const raw = localStorage.getItem(ACTIONS_STORAGE_KEY);
      if (raw) {
        const loaded = JSON.parse(raw);
        // Migration: Remove start group if it exists
        if (loaded.start) {
          delete loaded.start;
          localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(loaded));
        }
        return loaded;
      }
    } catch (e) { /* ignore */ }
    return DEFAULT_ACTION_GROUPS;
  });

  useEffect(() => {
    try { localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(actionGroups)); } catch (e) {}
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
    const blob = new Blob([JSON.stringify(combinedConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ftc-config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
