import DesktopIcon from './DesktopIcon';
import NatureBackground from './NatureBackground';
import { WINDOW_CONFIG } from '../config/windows';

// Initial pixel positions for each desktop icon (left-side column layout as starting point)
const ICON_INITIAL_POSITIONS = {
  about:     { x: 16, y: 16  },
  skills:    { x: 16, y: 108 },
  projects:  { x: 16, y: 200 },
  resume:    { x: 16, y: 292 },
  education: { x: 16, y: 384 },
  chat:      { x: -1, y: -1  }, // placed via corner offset below
};

// All icons except chat go on the free desktop; chat goes top-right
const DESKTOP_ICONS = WINDOW_CONFIG.filter((w) => w.id !== 'chat');
const CHAT_ICON     = WINDOW_CONFIG.find((w) => w.id === 'chat');

export default function Desktop() {
  return (
    <main className="desktop" aria-label="Desktop">
      {/* Nature photo background */}
      <NatureBackground />

      {/* Vignette overlay */}
      <div className="desktop-glow" aria-hidden="true" />

      {/* Freely draggable desktop icons */}
      {DESKTOP_ICONS.map((cfg) => {
        const pos = ICON_INITIAL_POSITIONS[cfg.id] ?? { x: 16, y: 16 };
        return (
          <DesktopIcon
            key={cfg.id}
            id={cfg.id}
            title={cfg.title}
            icon={cfg.icon}
            iconType={cfg.iconType}
            initialX={pos.x}
            initialY={pos.y}
          />
        );
      })}

      {/* Chat AI icon — starts top-right, also freely draggable */}
      {CHAT_ICON && (
        <DesktopIconTopRight cfg={CHAT_ICON} />
      )}
    </main>
  );
}

// Helper: measures viewport on mount to place chat icon top-right
function DesktopIconTopRight({ cfg }) {
  // Start at top-right with a 24px inset; user can drag from there
  const initX = Math.max(0, window.innerWidth - 104);
  const initY = 24;

  return (
    <DesktopIcon
      id={cfg.id}
      title={cfg.title}
      icon={cfg.icon}
      iconType={cfg.iconType}
      initialX={initX}
      initialY={initY}
    />
  );
}
