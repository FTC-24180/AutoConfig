/**
 * Centralized localStorage utilities with error handling
 */

/**
 * Safely get and parse JSON from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist or parse fails
 * @returns {*} Parsed value or default
 */
export function getStorageItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.error(`Failed to load ${key}:`, e);
    return defaultValue;
  }
}

/**
 * Safely stringify and save to localStorage
 * @param {string} key - Storage key  
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
    return false;
  }
}

/**
 * Safely remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error(`Failed to remove ${key}:`, e);
    return false;
  }
}

/**
 * Storage keys used throughout the app
 */
export const STORAGE_KEYS = {
  MATCHES: 'ftc-autoconfig-matches',
  CURRENT_MATCH: 'ftc-autoconfig-current-match',
  PRESETS: 'ftc-autoconfig-presets',
  ACTION_GROUPS: 'ftc-autoconfig-action-groups',
  ACTIONS_INITIALIZED: 'ftc-autoconfig-actions-initialized',
  START_POSITIONS: 'ftc-autoconfig-start-positions',
  THEME_PREFERENCE: 'autoconfig-theme-preference',
  UNITS_PREFERENCE: 'autoconfig-units-preference',
  ANGLE_UNITS_PREFERENCE: 'autoconfig-angle-units-preference',
};
