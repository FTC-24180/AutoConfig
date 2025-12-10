import { useState, useEffect } from 'react';

const MATCHES_STORAGE_KEY = 'ftc-autoconfig-matches';

export function useMatches() {
  const [matches, setMatches] = useState(() => {
    try {
      const raw = localStorage.getItem(MATCHES_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load matches:', e);
    }
    return [];
  });

  const [currentMatchId, setCurrentMatchId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(matches));
    } catch (e) {
      console.error('Failed to save matches:', e);
    }
  }, [matches]);

  const addMatch = () => {
    const newMatch = {
      id: crypto.randomUUID(),
      matchNumber: matches.length + 1,
      partnerTeam: '',
      alliance: 'red',
      startPosition: { type: 'front' },
      actions: []
    };
    setMatches(prev => [...prev, newMatch]);
    setCurrentMatchId(newMatch.id);
    return newMatch.id;
  };

  const deleteMatch = (matchId) => {
    setMatches(prev => prev.filter(m => m.id !== matchId));
    if (currentMatchId === matchId) {
      setCurrentMatchId(matches.length > 1 ? matches[0].id : null);
    }
  };

  const updateMatch = (matchId, updates) => {
    setMatches(prev => prev.map(match =>
      match.id === matchId ? { ...match, ...updates } : match
    ));
  };

  const getCurrentMatch = () => {
    return matches.find(m => m.id === currentMatchId);
  };

  const duplicateMatch = (matchId) => {
    const matchToDuplicate = matches.find(m => m.id === matchId);
    if (!matchToDuplicate) return;

    const newMatch = {
      ...matchToDuplicate,
      id: crypto.randomUUID(),
      matchNumber: matches.length + 1
    };
    setMatches(prev => [...prev, newMatch]);
    return newMatch.id;
  };

  const exportAllMatches = () => {
    const config = {
      matches: matches.map(({ id, ...match }) => ({
        matchNumber: match.matchNumber,
        partnerTeam: match.partnerTeam,
        alliance: match.alliance,
        startPosition: match.startPosition,
        actions: match.actions
      }))
    };
    return config;
  };

  const importMatches = (config) => {
    if (config.matches && Array.isArray(config.matches)) {
      const importedMatches = config.matches.map(match => ({
        ...match,
        id: crypto.randomUUID()
      }));
      setMatches(importedMatches);
      if (importedMatches.length > 0) {
        setCurrentMatchId(importedMatches[0].id);
      }
    }
  };

  return {
    matches,
    currentMatchId,
    setCurrentMatchId,
    addMatch,
    deleteMatch,
    updateMatch,
    getCurrentMatch,
    duplicateMatch,
    exportAllMatches,
    importMatches
  };
}
