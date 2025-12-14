import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storageUtils';

export function useStartPositions() {
  const [startPositions, setStartPositions] = useState(() => {
    return getStorageItem(STORAGE_KEYS.START_POSITIONS, []);
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.START_POSITIONS, startPositions);
  }, [startPositions]);

  const addStartPosition = (position) => {
    setStartPositions(prev => [...prev, position]);
  };

  const updateStartPosition = (index, updated) => {
    setStartPositions(prev => {
      const positions = [...prev];
      positions[index] = { ...positions[index], ...updated };
      return positions;
    });
  };

  const deleteStartPosition = (index) => {
    setStartPositions(prev => prev.filter((_, i) => i !== index));
  };

  return {
    startPositions,
    addStartPosition,
    updateStartPosition,
    deleteStartPosition
  };
}
