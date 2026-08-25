import { useRef, useCallback, useState } from 'react';
import { useWindowStore } from '../store/windowStore';

const CLICK_THRESHOLD = 5; // px — less than this = click, more = drag

export default function DesktopIcon({ id, title, icon, iconType, initialX, initialY }) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const win = useWindowStore((s) => s.windows[id]);
  const isOpen = win?.isOpen;

  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [dragging, setDragging] = useState(false);

  const dragState = useRef(null);

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    dragState.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startIconX: pos.x,
      startIconY: pos.y,
      moved: false,
    };

    const onMouseMove = (e) => {
      if (!dragState.current) return;
      const dx = e.clientX - dragState.current.startMouseX;
      const dy = e.clientY - dragState.current.startMouseY;

      if (!dragState.current.moved && Math.hypot(dx, dy) > CLICK_THRESHOLD) {
        dragState.current.moved = true;
        setDragging(true);
      }

      if (dragState.current.moved) {
        const newX = Math.max(0, dragState.current.startIconX + dx);
        const newY = Math.max(0, dragState.current.startIconY + dy);
        setPos({ x: newX, y: newY });
      }
    };

    const onMouseUp = (e) => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      const wasDrag = dragState.current?.moved;
      dragState.current = null;
      setDragging(false);

      // Only open window if it was a click (not a drag)
      if (!wasDrag) {
        openWindow(id);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [id, pos, openWindow]);

  // Touch drag support
  const onTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    dragState.current = {
      startMouseX: touch.clientX,
      startMouseY: touch.clientY,
      startIconX: pos.x,
      startIconY: pos.y,
      moved: false,
    };

    const onTouchMove = (e) => {
      if (!dragState.current) return;
      const t = e.touches[0];
      const dx = t.clientX - dragState.current.startMouseX;
      const dy = t.clientY - dragState.current.startMouseY;

      if (!dragState.current.moved && Math.hypot(dx, dy) > CLICK_THRESHOLD) {
        dragState.current.moved = true;
        setDragging(true);
      }

      if (dragState.current.moved) {
        e.preventDefault();
        const newX = Math.max(0, dragState.current.startIconX + dx);
        const newY = Math.max(0, dragState.current.startIconY + dy);
        setPos({ x: newX, y: newY });
      }
    };

    const onTouchEnd = () => {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);

      const wasDrag = dragState.current?.moved;
      dragState.current = null;
      setDragging(false);

      if (!wasDrag) {
        openWindow(id);
      }
    };

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
  }, [id, pos, openWindow]);

  return (
    <button
      className={`desktop-icon ${isOpen ? 'is-open' : ''} ${dragging ? 'is-dragging' : ''}`}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        cursor: dragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        zIndex: dragging ? 9999 : undefined,
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      aria-label={`Open ${title}`}
      id={`icon-${id}`}
    >
      <div className={`icon-body icon-${iconType}`}>
        <span className="icon-emoji" aria-hidden="true">{icon}</span>
      </div>
      <span className="icon-label">{title}</span>
    </button>
  );
}
