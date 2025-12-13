export function loadPresetIntoMatches(preset, matchesHook, actionGroups) {
  if (preset.config.matches) {
    // New format - multiple matches
    matchesHook.importMatches(preset.config);
  } else {
    // Old format - single match
    const matchId = matchesHook.addMatch();
    matchesHook.updateMatch(matchId, {
      matchNumber: preset.config.matchNumber || 1,
      partnerTeam: preset.config.partnerTeam || '',
      alliance: preset.config.alliance || 'red',
      startPosition: preset.config.startPosition || { type: 'front' },
      actions: preset.config.actions?.map(action => {
        let label = action.type;
        for (const group of Object.values(actionGroups)) {
          const matchingAction = group.actions.find(a => a.id === action.type);
          if (matchingAction) {
            label = matchingAction.label;
            break;
          }
        }
        return { ...action, id: crypto.randomUUID(), label };
      }) || []
    });
    matchesHook.setCurrentMatchId(matchId);
  }
}
