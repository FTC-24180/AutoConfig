import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storageUtils';

export function usePresets() {
  const [presets, setPresets] = useState(() => {
    return getStorageItem(STORAGE_KEYS.PRESETS, []);
  });

  useEffect(() => {
    if (presets.length > 0) {
      setStorageItem(STORAGE_KEYS.PRESETS, presets);
    }
  }, [presets]);

  const savePreset = (name, config) => {
    if (!name.trim()) {
      return false;
    }
    const newPreset = { id: Date.now(), name, config };
    setPresets([...presets, newPreset]);
    return true;
  };

  const deletePreset = (id) => {
    setPresets(presets.filter(p => p.id !== id));
  };

  return {
    presets,
    savePreset,
    deletePreset
  };
}
