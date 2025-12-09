import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useActionGroups } from './hooks/useActionGroups';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { usePresets } from './hooks/usePresets';
import { useStartPositions } from './hooks/useStartPositions';
import { ActionSequence } from './components/ActionSequence';
import { ActionPicker } from './components/ActionPicker';
import { ManageConfigModal } from './components/ManageConfigModal';
import { isValidReorder, createNewAction } from './utils/actionUtils';

const PICKUP_IDS = ['spike_1', 'spike_2', 'spike_3', 'corner'];

function App() {
  const [alliance, setAlliance] = useState('red');
  const [startLocation, setStartLocation] = useState('near');
  const [startPosition, setStartPosition] = useState({ type: 'front' }); // 'front', 'back', or { type: 'custom', x, y, theta }
  const [actionList, setActionList] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showManageActions, setShowManageActions] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [presetName, setPresetName] = useState('');

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 640 : true);
  
  const { presets, savePreset, deletePreset } = usePresets();
  const actionGroupsHook = useActionGroups();
  const startPositionsHook = useStartPositions();

  const dragHandlers = useDragAndDrop(
    actionList,
    setActionList,
    (from, to) => isValidReorder(actionList, from, to)
  );

  // Derived flags
  const hasStart = actionList.some(a => a.configType === 'start');
  const hasPark = actionList.some(a => a.type === 'near_park' || a.type === 'far_park');
  const startIndex = actionList.findIndex(a => a.configType === 'start');
  const parkIndex = actionList.findIndex(a => a.type === 'near_park' || a.type === 'far_park');

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }, []);

  const addAction = (action) => {
    const newAction = createNewAction(action);
    setActionList(prev => [...prev, newAction]);
    setExpandedGroup(expandedGroup);
  };

  const removeAction = (id) => {
    setActionList(actionList.filter(action => action.id !== id));
  };

  const moveAction = (id, direction) => {
    const index = actionList.findIndex(action => action.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= actionList.length) return;
    
    const newList = [...actionList];
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setActionList(newList);
  };

  const updateWaitTime = (id, waitTime) => {
    setActionList(actionList.map(action =>
      action.id === id
        ? { ...action, config: { ...action.config, waitTime: parseInt(waitTime) || 0 } }
        : action
    ));
  };

  const updateStartPositionNumeric = (id, field, value) => {
    setActionList(prev => prev.map(action =>
      action.id === id
        ? { ...action, config: { ...action.config, [field]: parseFloat(value) || 0 } }
        : action
    ));
  };

  const updateStartPositionField = (field, value) => {
    setStartPosition(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const getStartPositionLabel = () => {
    const pos = startPositionsHook.startPositions.find(p => p.id === startPosition.type);
    if (pos) return pos.label;
    if (startPosition.type === 'custom') {
      const x = startPosition.x ?? 0;
      const y = startPosition.y ?? 0;
      const theta = startPosition.theta ?? 0;
      return `Custom (${x}, ${y}, ${theta}°)`;
    }
    return 'Unknown';
  };

  const getConfig = () => ({
    alliance,
    startLocation,
    startPosition,
    actions: actionList.map(({ id, ...rest }) => rest)
  });

  const exportJSON = () => JSON.stringify(getConfig(), null, 2);

  const downloadJSON = () => {
    const config = getConfig();
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ftc-auto-${alliance}-${startLocation}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSavePreset = () => {
    if (savePreset(presetName, getConfig())) {
      setPresetName('');
    }
  };

  const loadPreset = (preset) => {
    setAlliance(preset.config.alliance);
    setStartLocation(preset.config.startLocation);
    if (preset.config.startPosition) {
      setStartPosition(preset.config.startPosition);
    }
    setActionList(preset.config.actions.map(action => ({ ...action, id: crypto.randomUUID() })));
  };

  const clearAll = () => {
    if (confirm('Clear all actions?')) setActionList([]);
  };

  const exportConfig = () => {
    const config = {
      actionGroups: actionGroupsHook.actionGroups,
      startPositions: startPositionsHook.startPositions
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ftc-config-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const theme = alliance === 'red'
    ? { from: '#fff5f5', to: '#fff1f2', border: '#fecaca', accent: '#ef4444' }
    : { from: '#eff6ff', to: '#eef2ff', border: '#bfdbfe', accent: '#3b82f6' };

  return (
    <div className="min-h-screen py-4 px-4" style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}>
      <div className="max-w-6xl mx-auto relative">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-2">FTC AutoConfig</h1>
          <p className="text-sm md:text-base text-indigo-600">DECODE Season Autonomous Configuration Builder</p>
          <div className="mx-auto mt-3" style={{ width: 96 }}>
            <div style={{ height: 6, borderRadius: 12, background: theme.accent }} />
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6" style={{ borderTop: `4px solid ${theme.border}` }}>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Configuration</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Alliance</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setAlliance('red')}
                  className={`flex-1 py-2 md:py-3 px-3 md:px-4 rounded-lg font-semibold transition text-sm md:text-base ${
                    alliance === 'red' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Red
                </button>
                <button
                  onClick={() => setAlliance('blue')}
                  className={`flex-1 py-2 md:py-3 px-3 md:px-4 rounded-lg font-semibold transition text-sm md:text-base ${
                    alliance === 'blue' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Blue
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Position</label>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">{getStartPositionLabel()}</span>
                  <div className="flex gap-1 flex-wrap">
                    {startPositionsHook.startPositions.map(pos => (
                      <button
                        key={pos.id}
                        onClick={() => setStartPosition({ type: pos.id })}
                        className={`px-3 py-1 text-xs rounded transition ${
                          startPosition.type === pos.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                    <button
                      onClick={() => setStartPosition({ type: 'custom', x: 0, y: 0, theta: 0 })}
                      className={`px-3 py-1 text-xs rounded transition ${
                        startPosition.type === 'custom' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Custom
                    </button>
                  </div>
                </div>

                {startPosition.type === 'custom' && (
                  <div className="mt-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs text-gray-600">X:</label>
                        <input
                          type="number"
                          value={startPosition.x ?? 0}
                          onChange={(e) => updateStartPositionField('x', e.target.value)}
                          className="w-full px-2 py-1 text-xs border rounded"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Y:</label>
                        <input
                          type="number"
                          value={startPosition.y ?? 0}
                          onChange={(e) => updateStartPositionField('y', e.target.value)}
                          className="w-full px-2 py-1 text-xs border rounded"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">&#952; (deg):</label>
                        <input
                          type="number"
                          value={startPosition.theta ?? 0}
                          onChange={(e) => updateStartPositionField('theta', e.target.value)}
                          className="w-full px-2 py-1 text-xs border rounded"
                          step="1"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!isMobile && (
              <div className="mb-4">
                <button
                  onClick={() => setShowActionModal(true)}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition shadow-md text-base md:text-lg"
                >
                  + Add Action
                </button>
              </div>
            )}

            <ActionSequence
              actionList={actionList}
              dragIndex={dragHandlers.dragIndex}
              hoverIndex={dragHandlers.hoverIndex}
              dragPos={dragHandlers.dragPos}
              touchActiveRef={dragHandlers.touchActiveRef}
              startIndex={startIndex}
              parkIndex={parkIndex}
              onMoveAction={moveAction}
              onRemoveAction={removeAction}
              onUpdateWaitTime={updateWaitTime}
              onUpdateStartPosition={updateStartPositionNumeric}
              onClearAll={clearAll}
              dragHandlers={dragHandlers}
            />

            {isMobile && (
              <div className="mt-4 border-t-2 border-gray-200 pt-4 bg-white rounded-lg shadow-md p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-800">Add Action</h3>
                </div>
                <ActionPicker
                  actionGroups={actionGroupsHook.actionGroups}
                  actionList={actionList}
                  hasStart={hasStart}
                  hasPark={hasPark}
                  expandedGroup={expandedGroup}
                  setExpandedGroup={setExpandedGroup}
                  onAddAction={addAction}
                  PICKUP_IDS={PICKUP_IDS}
                />
              </div>
            )}
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6" style={{ borderTop: `4px solid ${theme.border}` }}>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Export</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">JSON Configuration</label>
                <pre className="bg-gray-50 p-3 md:p-4 rounded-lg text-xs overflow-x-auto max-h-40 md:max-h-60 overflow-y-auto">
                  {exportJSON()}
                </pre>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={downloadJSON}
                  className="flex-1 py-2 px-3 md:px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition text-sm md:text-base"
                >
                  Download
                </button>
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="flex-1 py-2 px-3 md:px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition text-sm md:text-base"
                >
                  {showQR ? 'Hide QR' : 'Show QR'}
                </button>
              </div>

              {showQR && (
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 flex justify-center">
                  <QRCodeSVG value={exportJSON()} size={Math.min(256, window.innerWidth - 100)} level="M" includeMargin={true} />
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6" style={{ borderTop: `4px solid ${theme.border}` }}>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Presets</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Save Current Configuration</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Preset name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                  />
                  <button
                    onClick={handleSavePreset}
                    className="py-2 px-3 md:px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition text-sm md:text-base"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Saved Presets</label>
                {presets.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4 bg-gray-50 rounded-lg">No presets saved yet</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {presets.map(preset => (
                      <div key={preset.id} className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
                        <span className="flex-1 text-sm font-medium text-gray-800 truncate">{preset.name}</span>
                        <button
                          onClick={() => loadPreset(preset)}
                          className="py-1 px-2 md:px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm rounded transition"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deletePreset(preset.id)}
                          className="py-1 px-2 md:px-3 bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm rounded transition"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-6 md:mt-8 text-xs md:text-sm" style={{ color: theme.accent }}>
          <p>FTC Team 24180 - DECODE Season Configuration Tool</p>
        </footer>
      </div>

      {showManageActions && (
        <ManageConfigModal
          actionGroups={actionGroupsHook.actionGroups}
          startPositions={startPositionsHook.startPositions}
          onClose={() => setShowManageActions(false)}
          onExportConfig={exportConfig}
          onRenameGroup={actionGroupsHook.renameGroup}
          onDeleteGroup={actionGroupsHook.deleteGroup}
          onAddActionToGroup={actionGroupsHook.addActionToGroup}
          onUpdateActionInGroup={actionGroupsHook.updateActionInGroup}
          onDeleteActionInGroup={actionGroupsHook.deleteActionInGroup}
          onAddCustomGroup={actionGroupsHook.addCustomGroup}
          onAddStartPosition={startPositionsHook.addStartPosition}
          onUpdateStartPosition={startPositionsHook.updateStartPosition}
          onDeleteStartPosition={startPositionsHook.deleteStartPosition}
        />
      )}

      {!isMobile && showActionModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowActionModal(false);
              setExpandedGroup(null);
            }
          }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Add Action</h3>
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setExpandedGroup(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-4">
              <ActionPicker
                actionGroups={actionGroupsHook.actionGroups}
                actionList={actionList}
                hasStart={hasStart}
                hasPark={hasPark}
                expandedGroup={expandedGroup}
                setExpandedGroup={setExpandedGroup}
                onAddAction={addAction}
                PICKUP_IDS={PICKUP_IDS}
              />
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowManageActions(true)}
        style={{ position: 'fixed', right: 16, bottom: 16 }}
        className="py-2 px-3 bg-gray-800 text-white rounded-full shadow"
      >
        Manage Config
      </button>
    </div>
  );
}

export default App;
