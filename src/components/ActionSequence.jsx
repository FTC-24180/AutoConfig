import { getActionDisplayLabel } from '../utils/actionUtils';

export function ActionSequence({
  actionList,
  dragIndex,
  hoverIndex,
  dragPos,
  touchActiveRef,
  startIndex,
  parkIndex,
  onMoveAction,
  onRemoveAction,
  onUpdateWaitTime,
  onUpdateStartPosition,
  onClearAll,
  dragHandlers
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">Action Sequence</label>
        {actionList.length > 0 && (
          <button onClick={onClearAll} className="text-sm text-red-600 hover:text-red-800">
            Clear All
          </button>
        )}
      </div>

      {actionList.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8 bg-gray-50 rounded-lg">
          No actions added yet. Tap &quot;Add Action&quot; above to get started.
        </p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {actionList.map((action, index) => (
            <div
              key={action.id}
              className={`bg-gray-50 rounded-lg p-3 transition-transform duration-150 ease-out ${
                hoverIndex === index ? 'border-t-2 border-indigo-400' : ''
              } ${index === dragIndex ? 'opacity-30 scale-95' : ''}`}
              draggable={true}
              onDragStart={(e) => dragHandlers.handleDragStart(e, index)}
              onDragOver={(e) => dragHandlers.handleDragOver(e, index)}
              onDrop={(e) => dragHandlers.handleDrop(e, index)}
              data-action-index={index}
              onTouchStart={(e) => dragHandlers.handleTouchStart(e, index)}
              onPointerDown={(e) => dragHandlers.handlePointerDown(e, index)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-500 w-6">{index + 1}.</span>
                <span className="flex-1 text-sm font-medium text-gray-800">
                  {getActionDisplayLabel(action)}
                </span>

                {action.configType === 'wait' && action.config && (
                  <input
                    type="number"
                    value={action.config.waitTime}
                    onChange={(e) => onUpdateWaitTime(action.id, e.target.value)}
                    placeholder="ms"
                    className="w-16 md:w-20 px-2 py-1 text-sm border rounded"
                    min="0"
                  />
                )}

                <div className="flex gap-1">
                  <button
                    onClick={() => onMoveAction(action.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-600 hover:text-indigo-600 disabled:opacity-30"
                    title="Move up"
                  >
                    &#8593;
                  </button>
                  <button
                    onClick={() => onMoveAction(action.id, 'down')}
                    disabled={index === actionList.length - 1}
                    className="p-1 text-gray-600 hover:text-indigo-600 disabled:opacity-30"
                    title="Move down"
                  >
                    &#8595;
                  </button>
                  <button 
                    onClick={() => onRemoveAction(action.id)} 
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Remove"
                  >
                    &#215;
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div
            className={`drop-zone h-10 ${hoverIndex === actionList.length ? 'bg-indigo-50 border-t-2 border-indigo-400' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              dragHandlers.handleDragOver(e, actionList.length);
            }}
            onDrop={dragHandlers.handleDropAtEnd}
          />

          {(dragIndex !== -1 || touchActiveRef.current) && dragIndex >= 0 && actionList[dragIndex] && (
            <div
              className="pointer-events-none fixed z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl px-3 py-2 text-sm font-medium"
              style={{ left: dragPos.x + 'px', top: dragPos.y + 'px', transition: 'transform 0.08s ease-out' }}
            >
              {getActionDisplayLabel(actionList[dragIndex])}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
