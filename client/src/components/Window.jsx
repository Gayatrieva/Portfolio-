import { useRef, useCallback } from 'react';
import { useWindowStore } from '../store/windowStore';

export default function Window({ id, title, children }) {
  const win = useWindowStore((s) => s.windows[id]);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const moveWindow = useWindowStore((s) => s.moveWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const maximizeWindow = useWindowStore((s) => s.maximizeWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);

  const dragState = useRef(null);
  const windowRef = useRef(null);

  const onTitleMouseDown = useCallback(
    (e) => {
      if (e.button !== 0) return;
      // Don't drag when maximized or minimized
      if (win?.isMaximized || win?.isMinimized) return;
      e.preventDefault();
      focusWindow(id);
      dragState.current = {
        startX: e.clientX - win.position.x,
        startY: e.clientY - win.position.y,
      };

      const onMouseMove = (e) => {
        if (!dragState.current) return;
        const x = Math.max(0, e.clientX - dragState.current.startX);
        const y = Math.max(0, e.clientY - dragState.current.startY);
        moveWindow(id, { x, y });
      };

      const onMouseUp = () => {
        dragState.current = null;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [id, win?.position, win?.isMaximized, win?.isMinimized, focusWindow, moveWindow]
  );

  // Touch drag support for mobile
  const onTitleTouchStart = useCallback(
    (e) => {
      if (win?.isMaximized || win?.isMinimized) return;
      focusWindow(id);
      const touch = e.touches[0];
      dragState.current = {
        startX: touch.clientX - win.position.x,
        startY: touch.clientY - win.position.y,
      };

      const onTouchMove = (e) => {
        if (!dragState.current) return;
        const t = e.touches[0];
        const x = Math.max(0, t.clientX - dragState.current.startX);
        const y = Math.max(0, t.clientY - dragState.current.startY);
        moveWindow(id, { x, y });
      };

      const onTouchEnd = () => {
        dragState.current = null;
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
      };

      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    },
    [id, win?.position, win?.isMaximized, win?.isMinimized, focusWindow, moveWindow]
  );

  if (!win || !win.isOpen) return null;

  // --- MINIMIZED: show only a small title bar at bottom of screen ---
  if (win.isMinimized) {
    return (
      <div
        className="window window-minimized"
        style={{ zIndex: win.zIndex }}
        onMouseDown={() => focusWindow(id)}
      >
        <div className={`window-titlebar ${win.isFocused ? 'focused' : 'unfocused'}`}>
          <div className="window-controls">
            <button
              className="dot dot-red"
              onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
              aria-label="Close window"
              title="Close"
            />
            {/* Yellow: restore from minimized */}
            <button
              className="dot dot-yellow"
              onClick={(e) => { e.stopPropagation(); restoreWindow(id); }}
              aria-label="Restore window"
              title="Restore"
            />
            <button
              className="dot dot-green"
              onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }}
              aria-label="Maximize window"
              title="Maximize"
            />
          </div>
          <span className="window-title">{title}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={windowRef}
      className={`window${win.isMaximized ? ' window-maximized' : ''}`}
      style={{
        left: win.position.x,
        top: win.position.y,
        zIndex: win.zIndex,
        width: win.size.w,
        height: win.size.h,
        '--window-w': `${win.size.w}px`,
      }}
      onMouseDown={() => focusWindow(id)}
    >
      {/* Title bar */}
      <div
        className={`window-titlebar ${win.isFocused ? 'focused' : 'unfocused'}`}
        onMouseDown={onTitleMouseDown}
        onTouchStart={onTitleTouchStart}
      >
        {/* Traffic light dots */}
        <div className="window-controls">
          {/* Red: Close */}
          <button
            className="dot dot-red"
            onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
            aria-label="Close window"
            title="Close"
          />
          {/* Yellow: Minimize */}
          <button
            className="dot dot-yellow"
            onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
            aria-label="Minimize window"
            title="Minimize"
          />
          {/* Green: Maximize / Restore */}
          <button
            className="dot dot-green"
            onClick={(e) => {
              e.stopPropagation();
              if (win.isMaximized) {
                restoreWindow(id);
              } else {
                maximizeWindow(id);
              }
            }}
            aria-label={win.isMaximized ? 'Restore window' : 'Maximize window'}
            title={win.isMaximized ? 'Restore' : 'Maximize'}
          />
        </div>
        <span className="window-title">{title}</span>
      </div>

      {/* Content */}
      <div className="window-content">
        {children}
      </div>
    </div>
  );
}
