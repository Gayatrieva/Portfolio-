import { useState, useEffect } from 'react';
import { useWindowStore } from '../store/windowStore';

export default function MenuBar() {
  const [time, setTime] = useState('');
  const openWindow = useWindowStore((s) => s.openWindow);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    tick();
    const interval = setInterval(tick, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="menu-bar" role="banner">
      <div className="menu-bar-left">
        <span className="menu-bar-logo" aria-label="Gayatri OS">
          <span className="menu-logo-dot" aria-hidden="true">●</span>
          <span className="menu-bar-appname">GAYATRI kASHYAP</span>
        </span>
        <nav className="menu-bar-nav" aria-label="Menu bar navigation">
          <button className="menu-bar-item" onClick={() => openWindow('about')}>Finder</button>
          <button className="menu-bar-item" onClick={() => openWindow('projects')}>Projects</button>
          <button className="menu-bar-item" onClick={() => openWindow('chat')}>Chat</button>
        </nav>
      </div>
      <div className="menu-bar-right">
        <time className="menu-bar-clock" aria-live="polite">{time}</time>
      </div>
    </header>
  );
}
