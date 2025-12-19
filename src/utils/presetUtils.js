export function loadConfigPreset(preset, actionGroupsHook, startPositionsHook) {
  const config = preset.config;
  
  // Load action groups if they exist in the preset
  if (config.actionGroups) {
    // Store action groups to localStorage
    try {
      localStorage.setItem('ftc-autofig-action-groups', JSON.stringify(config.actionGroups));
      // Trigger a reload to apply the new configuration
      window.location.reload();
    } catch (e) {
      console.error('Failed to load action groups:', e);
    }
  }
  
  // Load start positions if they exist in the preset
  if (config.startPositions) {
    // Store start positions to localStorage
    try {
      localStorage.setItem('ftc-autofig-start-positions', JSON.stringify(config.startPositions));
      // If we didn't already trigger a reload for action groups, reload now
      if (!config.actionGroups) {
        window.location.reload();
      }
    } catch (e) {
      console.error('Failed to load start positions:', e);
    }
  }
}
