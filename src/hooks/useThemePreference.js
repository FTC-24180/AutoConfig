import { useEffect, useState } from 'react';
import { removeStorageItem, STORAGE_KEYS } from '../utils/storageUtils';

const VALID_PREFERENCES = new Set(['light', 'dark', 'system']);

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

const getStoredPreference = () => {
  if (!isBrowser()) {
    return 'system';
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME_PREFERENCE);
    return VALID_PREFERENCES.has(stored) ? stored : 'system';
  } catch (e) {
    console.error('Failed to load theme preference:', e);
    return 'system';
  }
};

const getMediaQuery = () => {
  if (!isBrowser() || typeof window.matchMedia !== 'function') {
    return null;
  }
  return window.matchMedia('(prefers-color-scheme: dark)');
};

const resolveTheme = (preference, mediaQuery) => {
  if (preference === 'system') {
    if (mediaQuery) {
      return mediaQuery.matches ? 'dark' : 'light';
    }
    return 'light';
  }
  return preference;
};

export function useThemePreference() {
  const [preference, setPreference] = useState(() => getStoredPreference());
  const [resolvedTheme, setResolvedTheme] = useState(() => {
    const mediaQuery = getMediaQuery();
    return resolveTheme(getStoredPreference(), mediaQuery);
  });

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    const mediaQuery = getMediaQuery();

    const applyTheme = (mode) => {
      setResolvedTheme(mode);
      document.documentElement.classList.toggle('dark', mode === 'dark');
      document.documentElement.dataset.theme = mode;
    };

    applyTheme(resolveTheme(preference, mediaQuery));

    if (!mediaQuery) {
      return;
    }

    const handleChange = (event) => {
      if (preference === 'system') {
        applyTheme(event.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preference]);

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    if (preference === 'system') {
      removeStorageItem(STORAGE_KEYS.THEME_PREFERENCE);
    } else {
      try {
        localStorage.setItem(STORAGE_KEYS.THEME_PREFERENCE, preference);
      } catch (e) {
        console.error('Failed to save theme preference:', e);
      }
    }
  }, [preference]);

  return {
    preference,
    setPreference,
    resolvedTheme,
  };
}
