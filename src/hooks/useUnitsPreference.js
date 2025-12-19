import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storageUtils';

/**
 * Hook to manage user's units preference (inches vs meters)
 * Defaults to inches (true)
 * @returns {Object} { useInches: boolean, setUseInches: (value: boolean) => void }
 */
export function useUnitsPreference() {
  const [useInches, setUseInchesState] = useState(() => {
    // Default to inches (true) if no preference is saved
    return getStorageItem(STORAGE_KEYS.UNITS_PREFERENCE, true);
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.UNITS_PREFERENCE, useInches);
  }, [useInches]);

  const setUseInches = (value) => {
    setUseInchesState(value);
  };

  return { useInches, setUseInches };
}
