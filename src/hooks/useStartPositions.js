import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storageUtils';

// Default start positions with S{n} keys
const DEFAULT_START_POSITIONS = [
  { key: 'S1', label: 'Front' },
  { key: 'S2', label: 'Back' },
  { key: 'S3', label: 'Left' },
  { key: 'S4', label: 'Right' }
];

export function useStartPositions() {
  const [startPositions, setStartPositions] = useState(() => {
    const stored = getStorageItem(STORAGE_KEYS.START_POSITIONS, []);
    
    // If no stored data, use defaults
    if (stored.length === 0) {
      return DEFAULT_START_POSITIONS;
    }
    
    // One-time migration: convert old format if needed
    const needsMigration = stored.some(pos => !pos.key || pos.id);
    if (needsMigration) {
      const migrated = stored.map((pos, index) => {
        // If already has key, keep it
        if (pos.key) return pos;
        
        // Migrate from old id format
        return {
          key: `S${index + 1}`,
          label: pos.label || pos.id || 'Position'
        };
      });
      
      // Save migrated data immediately
      setStorageItem(STORAGE_KEYS.START_POSITIONS, migrated);
      return migrated;
    }
    
    return stored;
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.START_POSITIONS, startPositions);
  }, [startPositions]);

  /**
   * Get the next available S{n} key
   */
  const getNextKey = () => {
    const existingNumbers = startPositions
      .map(pos => {
        const match = pos.key?.match(/^S(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(n => n > 0);
    
    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    return `S${maxNumber + 1}`;
  };

  const addStartPosition = (label) => {
    const nextKey = getNextKey();
    const nextNumber = parseInt(nextKey.substring(1));
    
    const newPosition = {
      key: nextKey,
      // If no label provided, auto-generate "Start Position {n}"
      label: label || `Start Position ${nextNumber}`
    };
    setStartPositions(prev => [...prev, newPosition]);
  };

  const updateStartPosition = (index, updates) => {
    setStartPositions(prev => {
      const positions = [...prev];
      // Only allow updating the label, not the key
      positions[index] = { 
        ...positions[index], 
        label: updates.label !== undefined ? updates.label : positions[index].label
      };
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
