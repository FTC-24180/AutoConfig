export function useMatchHandlers(matchesHook, setCurrentStep) {
  const handleAddMatch = () => {
    const newMatchId = matchesHook.addMatch();
    setCurrentStep(0); // Reset to first step for new match
  };

  const handleSelectMatch = (matchId) => {
    // Switch match without changing the current step
    matchesHook.setCurrentMatchId(matchId);
  };

  const handleSelectMatchFromQRCode = (matchId) => {
    // Switch match without changing the current step
    matchesHook.setCurrentMatchId(matchId);
  };

  const handleDuplicateMatch = (matchId) => {
    const newMatchId = matchesHook.duplicateMatch(matchId);
    if (newMatchId) {
      matchesHook.setCurrentMatchId(newMatchId);
      setCurrentStep(0); // Reset to first step for duplicated match
    }
  };

  return {
    handleAddMatch,
    handleSelectMatch,
    handleSelectMatchFromQRCode,
    handleDuplicateMatch
  };
}
