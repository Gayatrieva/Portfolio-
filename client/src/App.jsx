import { useState, useEffect } from 'react';
import MenuBar from './components/MenuBar';
import Desktop from './components/Desktop';
import Dock from './components/Dock';
import Window from './components/Window';
import MobileLayout from './components/MobileLayout';
import AboutWindow from './components/windows/AboutWindow';
import SkillsWindow from './components/windows/SkillsWindow';
import ProjectsWindow from './components/windows/ProjectsWindow';
import ResumeWindow from './components/windows/ResumeWindow';
import EducationWindow from './components/windows/EducationWindow';
import CertificatesWindow from './components/windows/CertificatesWindow';
import ChatWindow from './components/windows/ChatWindow';
import { WINDOW_CONFIG } from './config/windows';

// Map window id → content component
const WINDOW_CONTENT = {
  about: <AboutWindow />,
  skills: <SkillsWindow />,
  projects: <ProjectsWindow />,
  resume: <ResumeWindow />,
  education: <EducationWindow />,
  certificates: <CertificatesWindow />,
  chat: <ChatWindow />,
};

// Hook: returns true when viewport width ≤ 768px
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

export default function App() {
  const isMobile = useIsMobile();

  // Mobile: completely different layout — tab-based, no floating windows
  if (isMobile) {
    return <MobileLayout />;
  }

  // Desktop: full OS-style layout with floating windows & dock
  return (
    <div className="os-shell">
      <MenuBar />
      <Desktop />

      {/* Render all windows — each manages its own visibility */}
      {WINDOW_CONFIG.map((cfg) => (
        <Window key={cfg.id} id={cfg.id} title={cfg.title}>
          {WINDOW_CONTENT[cfg.id]}
        </Window>
      ))}

      <Dock />
    </div>
  );
}
