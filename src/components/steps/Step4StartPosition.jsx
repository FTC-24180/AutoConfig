import { useState } from 'react';
import { createPortal } from 'react-dom';
import { WizardStep } from '../WizardStep';
import { StartPositionPickerPanel } from '../StartPositionPickerPanel';
import { getPoseResolution, roundToResolution, metersToInches, inchesToMeters } from '../../utils/poseEncoder';

export function Step4StartPosition({ 
  startPosition, 
  onStartPositionChange,
  startPositions,
  onUpdateField,
  useInches = true,
  isActive = false
}) {
  const [adjustmentMessage, setAdjustmentMessage] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // Local editing state - only used during active editing
  // This keeps display values separate from stored meters
  const [editingValues, setEditingValues] = useState({});
  
  const resolution = getPoseResolution();

  const closePanel = () => setIsPanelOpen(false);
  const openPanel = () => setIsPanelOpen(true);

  const getStartPositionLabel = () => {
    // Check configured positions
    const pos = startPositions.find(p => p.key === startPosition.type);
    if (pos) return pos.label;
    
    // Handle custom position (S0) - display to 0.01 inches or 1mm
    if (startPosition.type === 'S0') {
      // Ensure values are numbers (handle edge cases during editing)
      const xMeters = Number(startPosition.x) || 0;
      const yMeters = Number(startPosition.y) || 0;
      const theta = Number(startPosition.theta) || 0;
      
      if (useInches) {
        const xIn = metersToInches(xMeters);
        const yIn = metersToInches(yMeters);
        return `Custom (${xIn.toFixed(2)}in, ${yIn.toFixed(2)}in, ${theta.toFixed(1)}\u00B0)`;
      } else {
        return `Custom (${xMeters.toFixed(3)}m, ${yMeters.toFixed(3)}m, ${theta.toFixed(1)}\u00B0)`;
      }
    }
    
    return 'Unknown';
  };

  const handleFieldFocus = (field) => {
    // When focusing, convert stored meters to editing unit and store in local state
    const storedValue = startPosition[field];
    
    // storedValue is a number in meters
    const numValue = storedValue || 0;
    
    let displayValue;
    if (useInches && (field === 'x' || field === 'y')) {
      // Convert meters to inches for editing
      const inchesValue = metersToInches(numValue);
      displayValue = inchesValue.toFixed(2);
    } else if (field === 'x' || field === 'y') {
      // Meters mode
      displayValue = numValue.toFixed(3);
    } else if (field === 'theta') {
      // Theta in degrees
      displayValue = numValue.toFixed(1);
    } else {
      displayValue = String(numValue);
    }
    
    // Store in local editing state
    setEditingValues(prev => ({ ...prev, [field]: displayValue }));
  };

  const handleFieldBlur = (field, displayValue) => {
    // Clear local editing state
    setEditingValues(prev => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });

    let value = parseFloat(displayValue);
    
    // If empty or invalid, set to 0
    if (isNaN(value)) {
      onUpdateField(field, 0);
      return;
    }

    // Convert inches to meters if needed (ALWAYS store as meters internally)
    if (useInches && (field === 'x' || field === 'y')) {
      value = inchesToMeters(value);
    }

    let adjusted = value;
    let wasAdjusted = false;
    let reason = '';

    if (field === 'x' || field === 'y') {
      // Round to 0.893mm resolution and clamp to ±1.8288m (±72 inches)
      const clamped = Math.max(-1.8288, Math.min(1.8288, value));
      adjusted = roundToResolution(clamped, 3.6576, 1.8288);
      
      if (Math.abs(value - clamped) > 0.0001) {
        wasAdjusted = true;
        reason = useInches ? `${field.toUpperCase()} clamped to \u00B172" range` 
                            : `${field.toUpperCase()} clamped to \u00B11.83m range`;
      } else if (Math.abs(value - adjusted) > 0.0001) {
        wasAdjusted = true;
        reason = useInches ? `${field.toUpperCase()} rounded to ~0.035" resolution`
                            : `${field.toUpperCase()} rounded to ~0.9mm resolution`;
      }
      
      // Round for storage precision
      adjusted = parseFloat(adjusted.toFixed(6));
    } else if (field === 'theta') {
      // Round to 0.088° resolution and clamp to ±180°
      const clamped = Math.max(-180, Math.min(180, value));
      adjusted = roundToResolution(clamped, 360, 180);
      
      if (Math.abs(value - clamped) > 0.001) {
        wasAdjusted = true;
        reason = 'Heading clamped to \u00B1180\u00B0 range';
      } else if (Math.abs(value - adjusted) > 0.001) {
        wasAdjusted = true;
        reason = 'Heading rounded to ~0.09\u00B0 resolution';
      }
      
      adjusted = parseFloat(adjusted.toFixed(1));
    }

    // Update the field with adjusted value as NUMBER (not string)
    onUpdateField(field, adjusted);

    // Show feedback if adjusted
    if (wasAdjusted) {
      setAdjustmentMessage(reason);
      setTimeout(() => setAdjustmentMessage(''), 3000);
    }
  };

  const handleFieldChange = (field, rawValue) => {
    // Allow empty string, negative sign, and valid decimal number patterns
    if (rawValue === '' || rawValue === '-' || /^-?\d*\.?\d*$/.test(rawValue)) {
      // Update local editing state only
      setEditingValues(prev => ({ ...prev, [field]: rawValue }));
    }
  };

  // Get display value - use local editing state if available, otherwise convert from storage
  const getDisplayValue = (field) => {
    // If currently editing this field, use local editing state
    if (editingValues.hasOwnProperty(field)) {
      return editingValues[field];
    }
    
    // Convert from stored value (should be number in meters)
    const storedValue = startPosition[field];
    
    // Handle undefined/null/empty and convert to number
    const numValue = Number(storedValue);
    if (!storedValue || isNaN(numValue)) return '0';
    
    // Convert from meters to display unit with appropriate rounding
    if (useInches && (field === 'x' || field === 'y')) {
      const inches = metersToInches(numValue);
      return inches.toFixed(2);
    }
    
    if (field === 'theta') {
      return numValue.toFixed(1);
    }
    
    // For meters mode x/y
    if (field === 'x' || field === 'y') {
      return numValue.toFixed(3);
    }
    
    return String(numValue);
  };

  // Only render panel when active
  const panelElement = isActive && isPanelOpen ? createPortal(
    <StartPositionPickerPanel
      startPositions={startPositions}
      currentPosition={startPosition}
      onSelectPosition={onStartPositionChange}
      isOpen={isPanelOpen}
      onClose={closePanel}
    />,
    document.body
  ) : null;

  return (
    <WizardStep 
      title="Starting Position"
      subtitle="Choose your robot's starting position"
    >
      {/* Render panel via portal */}
      {panelElement}

      <div className="space-y-6">
        {/* Current Position Display with Change Button */}
        <div className="bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Current Position</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {getStartPositionLabel()}
              </p>
            </div>
          </div>
          
          <button
            onClick={openPanel}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg font-semibold transition min-h-[48px] touch-manipulation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Select Position
          </button>
        </div>

        {/* Custom Position Configuration */}
        {startPosition.type === 'S0' && (
          <>
            <div className="bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Custom Position Configuration</h4>
              
              {/* Resolution info */}
              <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-800 dark:text-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Resolution:</strong> X/Y: ~{useInches ? '0.035"' : '0.9mm'}, theta: ~0.09{'\u00B0'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    X Position ({useInches ? 'in' : 'm'})
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={getDisplayValue('x')}
                    onFocus={() => handleFieldFocus('x')}
                    onChange={(e) => handleFieldChange('x', e.target.value)}
                    onBlur={(e) => handleFieldBlur('x', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{useInches ? '\u00B172"' : '\u00B11.83m'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Y Position ({useInches ? 'in' : 'm'})
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={getDisplayValue('y')}
                    onFocus={() => handleFieldFocus('y')}
                    onChange={(e) => handleFieldChange('y', e.target.value)}
                    onBlur={(e) => handleFieldBlur('y', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{useInches ? '\u00B172"' : '\u00B11.83m'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Angle (deg)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={getDisplayValue('theta')}
                    onFocus={() => handleFieldFocus('theta')}
                    onChange={(e) => handleFieldChange('theta', e.target.value)}
                    onBlur={(e) => handleFieldBlur('theta', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{'\u00B1'}180{'\u00B0'}</p>
                </div>
              </div>

              {/* Adjustment feedback */}
              {adjustmentMessage && (
                <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    <strong>Adjusted:</strong> {adjustmentMessage}
                  </p>
                </div>
              )}
            </div>

            {/* Encoding info */}
            <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3">
              <h5 className="text-xs font-semibold text-indigo-900 dark:text-indigo-200 mb-2">Encoding Information</h5>
              <div className="space-y-1 text-xs text-indigo-900 dark:text-indigo-200">
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-mono">S0{'{6 base64 chars}'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Size:</span>
                  <span>8 bytes</span>
                </div>
                <div className="flex justify-between">
                  <span>Precision:</span>
                  <span>12 bits per value</span>
                </div>
                <div className="flex justify-between">
                  <span>Display Units:</span>
                  <span>{useInches ? 'Inches' : 'Meters'} & Degrees</span>
                </div>
                <div className="flex justify-between">
                  <span>Internal Storage:</span>
                  <span>Meters (always)</span>
                </div>
                <div className="flex justify-between">
                  <span>Resolution:</span>
                  <span>{useInches ? '~0.035" (~1/28")' : '~0.9mm'}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </WizardStep>
  );
}
