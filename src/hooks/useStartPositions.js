import { useState, useEffect } from 'react';

const DEFAULT_START_POSITIONS = [
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' }
];

const START_POSITIONS_STORAGE_KEY = 'ftc-autoconfig-start-positions';

export function useStartPositions() {
  const [startPositions, setStartPositions] = useState(() => {
    try {
      const raw = localStorage.getItem(START_POSITIONS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return DEFAULT_START_POSITIONS;
  });

  useEffect(() => {
    try { 
      localStorage.setItem(START_POSITIONS_STORAGE_KEY, JSON.stringify(startPositions)); 
    } catch (e) {}
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
