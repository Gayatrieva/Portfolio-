import { useWindowStore } from '../store/windowStore';
import { DOCK_ICONS } from '../config/windows';

export default function Dock() {
  const openWindow = useWindowStore((s) => s.openWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const windows = useWindowStore((s) => s.windows);

  const handleDockClick = (id) => {
    const win = windows[id];
    if (win?.isOpen) {
      focusWindow(id);
    } else {
      openWindow(id);
    }
  };

  return (
    <nav className="dock" aria-label="Application dock">
      <div className="dock-inner">
        {DOCK_ICONS.map((cfg) => {
          const isOpen = windows[cfg.id]?.isOpen;
          const isFocused = windows[cfg.id]?.isFocused;
          return (
            <button
              key={cfg.id}
              className={`dock-item ${isOpen ? 'is-open' : ''} ${isFocused ? 'is-focused' : ''} ${cfg.id === 'chat' ? 'dock-chat' : ''}`}
              onClick={() => handleDockClick(cfg.id)}
              aria-label={cfg.title}
              title={cfg.title}
              id={`dock-${cfg.id}`}
            >
              <span className="dock-icon-emoji" aria-hidden="true">
                {cfg.id === 'chat' ? '✦' : cfg.icon}
              </span>
              {isOpen && <span className="dock-dot" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
