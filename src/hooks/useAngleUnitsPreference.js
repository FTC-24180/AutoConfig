import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storageUtils';

/**
 * Hook to manage user's angle units preference (degrees vs radians)
 * Defaults to degrees (false for radians, true for degrees)
 * @returns {Object} { useDegrees: boolean, setUseDegrees: (value: boolean) => void }
 */
export function useAngleUnitsPreference() {
  const [useDegrees, setUseDegreesState] = useState(() => {
    // Default to degrees (true) if no preference is saved
    return getStorageItem(STORAGE_KEYS.ANGLE_UNITS_PREFERENCE, true);
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ANGLE_UNITS_PREFERENCE, useDegrees);
  }, [useDegrees]);

  const setUseDegrees = (value) => {
    setUseDegreesState(value);
  };

  return { useDegrees, setUseDegrees };
}
