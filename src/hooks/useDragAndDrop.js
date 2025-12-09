import { useState, useRef } from 'react';

export function useDragAndDrop(actionList, setActionList, isValidReorder) {
  const [dragIndex, setDragIndex] = useState(-1);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  
  const touchActiveRef = useRef(false);
  const pointerActiveRef = useRef(false);
  const pointerIdRef = useRef(null);
  const pointerPendingRef = useRef(false);
  const pointerStartRef = useRef({ x: 0, y: 0 });
  
  const DRAG_START_THRESHOLD = 8;

  // Desktop drag handlers
  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', String(index)); } catch (err) {}
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setHoverIndex(index);
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const from = dragIndex !== -1 ? dragIndex : parseInt(e.dataTransfer.getData('text/plain'), 10);
    const to = index;
    if (isValidReorder(from, to)) {
      const item = actionList[from];
      const copy = actionList.filter((_, i) => i !== from);
      let insertIndex = to;
      if (from < to) insertIndex = to - 1;
      copy.splice(insertIndex, 0, item);
      setActionList(copy);
    }
    setDragIndex(-1);
    setHoverIndex(-1);
    setDragPos({ x: 0, y: 0 });
  };

  const handleDropAtEnd = (e) => {
    e.preventDefault();
    const from = dragIndex !== -1 ? dragIndex : parseInt(e.dataTransfer.getData('text/plain'), 10);
    const to = actionList.length;
    if (isValidReorder(from, to)) {
      const item = actionList[from];
      const copy = actionList.filter((_, i) => i !== from);
      let insertIndex = to;
      if (from < to) insertIndex = to - 1;
      copy.splice(insertIndex, 0, item);
      setActionList(copy);
    }
    setDragIndex(-1);
    setHoverIndex(-1);
    setDragPos({ x: 0, y: 0 });
  };

  // Touch handlers
  const handleTouchStart = (e, index) => {
    const action = actionList[index];
    if (!action) return;
    if (action.configType === 'start') return;
    if (action.type === 'near_park' || action.type === 'far_park') return;

    touchActiveRef.current = true;
    setDragIndex(index);
    setHoverIndex(index);

    const touch = e.touches[0];
    if (touch) setDragPos({ x: touch.clientX, y: touch.clientY });

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e) => {
    if (!touchActiveRef.current) return;
    const touch = e.touches[0];
    if (!touch) return;
    setDragPos({ x: touch.clientX, y: touch.clientY });
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!el) return;
    const itemEl = el.closest('[data-action-index]');
    if (itemEl) {
      const idx = parseInt(itemEl.getAttribute('data-action-index'), 10);
      setHoverIndex(idx);
    } else {
      setHoverIndex(actionList.length);
    }
    if (e.cancelable) {
      try { e.preventDefault(); } catch (err) {}
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchActiveRef.current) return;
    touchActiveRef.current = false;
    const from = dragIndex;
    const to = hoverIndex === -1 ? actionList.length : hoverIndex;
    if (isValidReorder(from, to)) {
      const item = actionList[from];
      const copy = actionList.filter((_, i) => i !== from);
      let insertIndex = to;
      if (from < to) insertIndex = to - 1;
      copy.splice(insertIndex, 0, item);
      setActionList(copy);
    }
    setDragIndex(-1);
    setHoverIndex(-1);
    setDragPos({ x: 0, y: 0 });

    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  };

  // Pointer handlers
  const handlePointerDown = (e, index) => {
    if (e.pointerType !== 'touch' && e.pointerType !== 'pen') return;
    const action = actionList[index];
    if (!action) return;
    if (action.configType === 'start') return;
    if (action.type === 'near_park' || action.type === 'far_park') return;

    pointerPendingRef.current = true;
    pointerIdRef.current = e.pointerId;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    setDragIndex(index);
    setHoverIndex(index);

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    if (e.pointerId !== pointerIdRef.current) return;

    if (pointerPendingRef.current && !pointerActiveRef.current) {
      const dx = e.clientX - pointerStartRef.current.x;
      const dy = e.clientY - pointerStartRef.current.y;
      const dist = Math.hypot(dx, dy);
      if (dist >= DRAG_START_THRESHOLD) {
        pointerActiveRef.current = true;
        pointerPendingRef.current = false;
        try { e.target.setPointerCapture(e.pointerId); } catch (err) {}
        try { document.body.style.touchAction = 'none'; } catch (err) {}
        setDragPos({ x: e.clientX, y: e.clientY });
      } else {
        return;
      }
    }

    if (!pointerActiveRef.current) return;

    setDragPos({ x: e.clientX, y: e.clientY });
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;
    const itemEl = el.closest('[data-action-index]');
    if (itemEl) {
      const idx = parseInt(itemEl.getAttribute('data-action-index'), 10);
      setHoverIndex(idx);
    } else {
      setHoverIndex(actionList.length);
    }
    if (e.cancelable) {
      try { e.preventDefault(); } catch (err) {}
    }
  };

  const handlePointerUp = (e) => {
    if (e.pointerId !== pointerIdRef.current) return;

    if (pointerPendingRef.current && !pointerActiveRef.current) {
      pointerPendingRef.current = false;
      pointerIdRef.current = null;
      setDragIndex(-1);
      setHoverIndex(-1);

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      return;
    }

    if (!pointerActiveRef.current) return;

    pointerActiveRef.current = false;
    pointerIdRef.current = null;

    const from = dragIndex;
    const to = hoverIndex === -1 ? actionList.length : hoverIndex;
    if (isValidReorder(from, to)) {
      const item = actionList[from];
      const copy = actionList.filter((_, i) => i !== from);
      let insertIndex = to;
      if (from < to) insertIndex = to - 1;
      copy.splice(insertIndex, 0, item);
      setActionList(copy);
    }

    setDragIndex(-1);
    setHoverIndex(-1);
    setDragPos({ x: 0, y: 0 });

    try { e.target.releasePointerCapture(e.pointerId); } catch (err) {}

    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);

    try { document.body.style.touchAction = ''; } catch (err) {}

    if (e.cancelable) {
      try { e.preventDefault(); } catch (err) {}
    }
  };

  return {
    dragIndex,
    hoverIndex,
    dragPos,
    touchActiveRef,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDropAtEnd,
    handleTouchStart,
    handlePointerDown
  };
}
