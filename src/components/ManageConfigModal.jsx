import { useState } from 'react';

function AddGroupForm({ onAdd }) {
  const [key, setKey] = useState('');
  const [label, setLabel] = useState('');
  return (
    <div className="flex gap-2 items-center">
      <input
        placeholder="group key (e.g. custom)"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="px-2 py-1 border rounded"
      />
      <input
        placeholder="label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="px-2 py-1 border rounded"
      />
      <button
        onClick={() => {
          if (!key) return;
          onAdd(key, label);
          setKey('');
          setLabel('');
        }}
        className="py-1 px-2 bg-green-600 text-white rounded"
      >
        Add Group
      </button>
    </div>
  );
}

function AddActionForm({ groupKey, onAdd }) {
  const [id, setId] = useState('');
  const [label, setLabel] = useState('');
  const [hasConfig, setHasConfig] = useState(false);
  return (
    <div className="flex gap-2 items-center mt-2">
      <input
        placeholder="action id"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="px-2 py-1 border rounded w-36"
      />
      <input
        placeholder="label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="px-2 py-1 border rounded flex-1"
      />
      <label className="text-sm">
        <input type="checkbox" checked={hasConfig} onChange={(e) => setHasConfig(e.target.checked)} /> cfg
      </label>
      <button
        onClick={() => {
          if (!id) return;
          onAdd({ id, label: label || id, hasConfig });
          setId('');
          setLabel('');
          setHasConfig(false);
        }}
        className="py-1 px-2 bg-blue-600 text-white rounded"
      >
        Add
      </button>
    </div>
  );
}

function AddStartPositionForm({ onAdd }) {
  const [id, setId] = useState('');
  const [label, setLabel] = useState('');
  return (
    <div className="flex gap-2 items-center mt-2">
      <input
        placeholder="position id (e.g. left)"
        value={id}
        onChange={(e) => setId(e.target.value)}
        className="px-2 py-1 border rounded w-40"
      />
      <input
        placeholder="label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="px-2 py-1 border rounded flex-1"
      />
      <button
        onClick={() => {
          if (!id) return;
          onAdd({ id, label: label || id });
          setId('');
          setLabel('');
        }}
        className="py-1 px-2 bg-blue-600 text-white rounded"
      >
        Add
      </button>
    </div>
  );
}

export function ManageConfigModal({
  actionGroups,
  startPositions,
  onClose,
  onExportConfig,
  onRenameGroup,
  onDeleteGroup,
  onAddActionToGroup,
  onUpdateActionInGroup,
  onDeleteActionInGroup,
  onAddCustomGroup,
  onAddStartPosition,
  onUpdateStartPosition,
  onDeleteStartPosition
}) {
  const [activeTab, setActiveTab] = useState('actions');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 flex items-start justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Manage Configuration</h3>
          <div className="flex gap-2">
            <button onClick={onExportConfig} className="py-1 px-3 bg-indigo-600 text-white rounded">
              Export Config
            </button>
            <button onClick={onClose} className="py-1 px-2 bg-gray-200 rounded">
              Close
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4 border-b">
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'actions'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Action Groups
          </button>
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'positions'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Start Positions
          </button>
        </div>

        {activeTab === 'actions' && (
          <div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800">Available Actions</h4>
            </div>

            <div className="space-y-4">
              {Object.entries(actionGroups).map(([gk, group]) => (
                <div key={gk} className="border p-3 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{group.icon}</span>
                      <input
                        value={group.label}
                        onChange={(e) => onRenameGroup(gk, e.target.value)}
                        className="font-semibold text-gray-800 px-2 py-1 border rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => onDeleteGroup(gk)} className="py-1 px-2 bg-red-600 text-white rounded text-sm">
                        Delete Group
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {group.actions.map((act, idx) => (
                      <div key={act.id + idx} className="flex gap-2 items-center">
                        <input
                          value={act.id}
                          onChange={(e) => onUpdateActionInGroup(gk, idx, { id: e.target.value })}
                          className="px-2 py-1 border rounded w-40"
                        />
                        <input
                          value={act.label}
                          onChange={(e) => onUpdateActionInGroup(gk, idx, { label: e.target.value })}
                          className="px-2 py-1 border rounded flex-1"
                        />
                        <label className="text-sm mr-2">
                          <input
                            type="checkbox"
                            checked={!!act.hasConfig}
                            onChange={(e) => onUpdateActionInGroup(gk, idx, { hasConfig: e.target.checked })}
                          />{' '}
                          config
                        </label>
                        <button
                          onClick={() => onDeleteActionInGroup(gk, idx)}
                          className="py-1 px-2 bg-red-100 text-red-600 rounded text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    <AddActionForm groupKey={gk} onAdd={(a) => onAddActionToGroup(gk, a)} />
                  </div>
                </div>
              ))}

              <AddGroupForm onAdd={onAddCustomGroup} />
            </div>
          </div>
        )}

        {activeTab === 'positions' && (
          <div>
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800">Available Start Positions</h4>
            </div>

            <div className="space-y-2">
              {startPositions.map((pos, idx) => (
                <div key={pos.id + idx} className="flex gap-2 items-center border p-3 rounded">
                  <span className="text-lg">??</span>
                  <input
                    value={pos.id}
                    onChange={(e) => onUpdateStartPosition(idx, { id: e.target.value })}
                    className="px-2 py-1 border rounded w-32"
                    placeholder="ID"
                  />
                  <input
                    value={pos.label}
                    onChange={(e) => onUpdateStartPosition(idx, { label: e.target.value })}
                    className="px-2 py-1 border rounded flex-1"
                    placeholder="Label"
                  />
                  <button
                    onClick={() => onDeleteStartPosition(idx)}
                    className="py-1 px-2 bg-red-600 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}

              <AddStartPositionForm onAdd={onAddStartPosition} />
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Start positions define preset locations. The &quot;Custom&quot; position with configurable X, Y, ? is always available and cannot be removed.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
