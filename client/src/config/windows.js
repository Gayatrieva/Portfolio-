// Data-driven window + icon configuration.
// Adding a new window = adding one entry here. No new markup needed.

export const WINDOW_CONFIG = [
  {
    id: 'about',
    title: 'About Me',
    icon: '🧑‍💻',
    iconType: 'folder',
    defaultPosition: { x: 120, y: 60 },
    defaultSize: { w: 620, h: 480 },
    desktopPosition: { col: 0, row: 0 },
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: '🛠',
    iconType: 'folder',
    defaultPosition: { x: 200, y: 80 },
    defaultSize: { w: 660, h: 500 },
    desktopPosition: { col: 0, row: 1 },
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: '📁',
    iconType: 'folder',
    defaultPosition: { x: 280, y: 100 },
    defaultSize: { w: 700, h: 560 },
    desktopPosition: { col: 0, row: 2 },
  },
  {
    id: 'resume',
    title: 'Resume.pdf',
    icon: '📄',
    iconType: 'file',
    defaultPosition: { x: 360, y: 70 },
    defaultSize: { w: 680, h: 520 },
    desktopPosition: { col: 0, row: 3 },
  },
  {
    id: 'education',
    title: 'Education',
    icon: '🎓',
    iconType: 'folder',
    defaultPosition: { x: 160, y: 120 },
    defaultSize: { w: 580, h: 420 },
    desktopPosition: { col: 0, row: 4 },
  },

  {
    id: 'chat',
    title: 'Ask Gayatri.AI',
    icon: '✦',
    iconType: 'app',
    defaultPosition: { x: 440, y: 60 },
    defaultSize: { w: 560, h: 580 },
    desktopPosition: { col: 1, row: 0 }, // top-right corner
    dockOnly: false,
  },
];

// Desktop icons — left column (all except chat which goes top-right)
export const LEFT_COLUMN_IDS = ['about', 'skills', 'projects', 'resume', 'education'];

// Desktop icons to show (subset — chat goes top-right corner separately)
export const DESKTOP_ICONS = WINDOW_CONFIG.filter(w => !w.dockOnly);

// Dock icons (all windows)
export const DOCK_ICONS = WINDOW_CONFIG;
