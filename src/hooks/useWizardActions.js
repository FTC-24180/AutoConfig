import { useState } from 'react';
import { createNewAction } from '../utils/actionUtils';

export function useWizardActions(matchesHook) {
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedGroup, setExpandedGroup] = useState(null);

  const currentMatch = matchesHook.getCurrentMatch();

  const updateCurrentMatch = (updates) => {
    if (matchesHook.currentMatchId) {
      matchesHook.updateMatch(matchesHook.currentMatchId, updates);
    }
  };

  const addAction = (action) => {
    const newAction = createNewAction(action);
    const updatedActions = [...(currentMatch.actions || []), newAction];
    updateCurrentMatch({ actions: updatedActions });
  };

  const removeAction = (id) => {
    const updatedActions = (currentMatch.actions || []).filter(action => action.id !== id);
    updateCurrentMatch({ actions: updatedActions });
  };

  const moveAction = (id, direction) => {
    const actions = currentMatch.actions || [];
    const index = actions.findIndex(action => action.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= actions.length) return;
    
    const newList = [...actions];
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    updateCurrentMatch({ actions: newList });
  };

  const updateActionConfig = (id, key, value) => {
    const updatedActions = (currentMatch.actions || []).map(action =>
      action.id === id
        ? { ...action, config: { ...action.config, [key]: value } }
        : action
    );
    updateCurrentMatch({ actions: updatedActions });
  };

  const clearAll = () => {
    if (confirm('Clear all actions?')) {
      updateCurrentMatch({ actions: [] });
    }
  };

  const updateStartPositionField = (field, value) => {
    const newStartPosition = { ...currentMatch.startPosition, [field]: parseFloat(value) || 0 };
    updateCurrentMatch({ startPosition: newStartPosition });
  };

  const canGoNext = () => {
    if (!currentMatch) return false;
    switch (currentStep) {
      case 0: return currentMatch.matchNumber > 0 && currentMatch.alliance !== '';
      case 1: return currentMatch.startPosition?.type !== '';
      case 2: return true; // Actions are optional but recommended
      case 3: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    expandedGroup,
    setExpandedGroup,
    currentMatch,
    updateCurrentMatch,
    addAction,
    removeAction,
    moveAction,
    updateActionConfig,
    clearAll,
    updateStartPositionField,
    canGoNext,
    handleNext,
    handlePrev
  };
}
