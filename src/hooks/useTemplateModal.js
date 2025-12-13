import { useState } from 'react';

export function useTemplateModal(savePreset, getConfig) {
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [showLoadTemplate, setShowLoadTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }
    if (savePreset(templateName, getConfig())) {
      setTemplateName('');
      setShowSaveTemplate(false);
    }
  };

  const closeSaveTemplate = () => {
    setShowSaveTemplate(false);
    setTemplateName('');
  };

  return {
    showSaveTemplate,
    showLoadTemplate,
    templateName,
    setTemplateName,
    setShowSaveTemplate,
    setShowLoadTemplate,
    handleSaveTemplate,
    closeSaveTemplate
  };
}
