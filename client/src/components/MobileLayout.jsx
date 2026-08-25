import { useState, useEffect } from 'react';
import { useWindowStore } from '../store/windowStore';
import { WINDOW_CONFIG } from '../config/windows';
import NatureBackground from './NatureBackground';
import AboutWindow from './windows/AboutWindow';
import SkillsWindow from './windows/SkillsWindow';
import ProjectsWindow from './windows/ProjectsWindow';
import ResumeWindow from './windows/ResumeWindow';
import EducationWindow from './windows/EducationWindow';
import ChatWindow from './windows/ChatWindow';

// ✅ Store COMPONENT REFERENCES, not pre-rendered JSX elements
// Pre-rendered JSX is static — it won't re-fetch or re-mount when tabs switch
const CONTENT_MAP = {
  about:     AboutWindow,
  skills:    SkillsWindow,
  projects:  ProjectsWindow,
  resume:    ResumeWindow,
  education: EducationWindow,
  chat:      ChatWindow,
};

// Only show tabs that have a content component
const MOBILE_TABS = WINDOW_CONFIG.filter((w) => CONTENT_MAP[w.id]);

export default function MobileLayout() {
  const activeTab = useWindowStore((s) => s.mobileActiveTab);
  const setTab    = useWindowStore((s) => s.setMobileTab);
  const [time, setTime] = useState('');
  // null = no section open (shows "home" state), string = open section
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleString('en-US', {
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

  // When a tab is tapped: if already open → close it, else open it
  const handleTabClick = (id) => {
    if (openSection === id) {
      setOpenSection(null); // close / toggle off
    } else {
      setTab(id);
      setOpenSection(id);
    }
  };

  // Dynamically render the active content component
  const ActiveComponent = openSection ? CONTENT_MAP[openSection] : null;
  const activeConfig    = openSection ? MOBILE_TABS.find((t) => t.id === openSection) : null;

  return (
    <div className="mobile-layout">
      {/* Background — always visible */}
      <NatureBackground />

      {/* ── Top bar ── */}
      <header className="mobile-topbar" role="banner">
        <span className="mobile-topbar-logo">
          <span className="menu-logo-dot" aria-hidden="true">●</span>
          <span className="mobile-topbar-name">GAYATRI KASHYAP</span>
        </span>
        <time className="mobile-topbar-time">{time}</time>
      </header>

      {/* ── Tab navigation (always visible) ── */}
      <nav className="mobile-tabs" aria-label="Section navigation">
        <div className="mobile-tabs-inner">
          {MOBILE_TABS.map((cfg) => (
            <button
              key={cfg.id}
              className={`mobile-tab-btn ${openSection === cfg.id ? 'active' : ''}`}
              onClick={() => handleTabClick(cfg.id)}
              aria-selected={openSection === cfg.id}
              aria-label={cfg.title}
              id={`mobile-tab-${cfg.id}`}
            >
              <span className="mobile-tab-icon" aria-hidden="true">
                {cfg.id === 'chat' ? '✦' : cfg.icon}
              </span>
              <span className="mobile-tab-label">{cfg.title}</span>
              {/* Active indicator dot */}
              {openSection === cfg.id && (
                <span className="mobile-tab-dot" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Content panel (slides up when a section is open) ── */}
      {openSection && ActiveComponent && (
        <main
          className="mobile-content"
          role="main"
          aria-label={`${activeConfig?.title} section`}
        >
          {/* Section header with close button */}
          <div className="mobile-section-header">
            <div className="mobile-section-title-row">
              <span className="mobile-section-icon" aria-hidden="true">
                {activeConfig?.id === 'chat' ? '✦' : activeConfig?.icon}
              </span>
              <h2 className="mobile-section-title">{activeConfig?.title}</h2>
            </div>
            <button
              className="mobile-close-btn"
              onClick={() => setOpenSection(null)}
              aria-label={`Close ${activeConfig?.title}`}
              id="mobile-close-btn"
            >
              ✕
            </button>
          </div>

          {/* Content — freshly mounted component on each open */}
          <div className="mobile-content-inner">
            <ActiveComponent />
          </div>
        </main>
      )}

      {/* ── Home hint (when nothing is open) ── */}
      {!openSection && (
        <div className="mobile-home-hint" aria-hidden="true">
          <p className="mobile-hint-text">Tap a section above to explore ↑</p>
        </div>
      )}
    </div>
  );
}
