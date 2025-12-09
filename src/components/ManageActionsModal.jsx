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

export function ManageActionsModal({
  actionGroups,
  onClose,
  onExport,
  onRenameGroup,
  onDeleteGroup,
  onAddActionToGroup,
  onUpdateActionInGroup,
  onDeleteActionInGroup,
  onAddCustomGroup
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 flex items-start justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Manage Action Groups</h3>
          <div className="flex items-center gap-2">
            <button onClick={onExport} className="py-1 px-2 bg-indigo-600 text-white rounded">
              Export
            </button>
            <button onClick={onClose} className="py-1 px-2 bg-gray-200 rounded">
              Close
            </button>
          </div>
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
                  <button onClick={() => onDeleteGroup(gk)} className="py-1 px-2 bg-red-600 text-white rounded">
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
                      className="py-1 px-2 bg-red-100 text-red-600 rounded"
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
    </div>
  );
}
