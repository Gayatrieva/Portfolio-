import { create } from 'zustand';
import { WINDOW_CONFIG } from '../config/windows';

// Build initial state from config
const initialWindows = WINDOW_CONFIG.reduce((acc, win) => {
  acc[win.id] = {
    id: win.id,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: win.defaultPosition || { x: 80, y: 80 },
    zIndex: 10,
    isFocused: false,
    size: win.defaultSize || { w: 680, h: 480 },
    prevPosition: win.defaultPosition || { x: 80, y: 80 },
    prevSize: win.defaultSize || { w: 680, h: 480 },
  };
  return acc;
}, {});

let zCounter = 10;

export const useWindowStore = create((set, get) => ({
  windows: initialWindows,

  // Mobile: track which tab/section is active
  mobileActiveTab: 'about',
  setMobileTab: (id) => set({ mobileActiveTab: id }),

  openWindow: (id) => {
    zCounter += 1;
    set((state) => ({
      windows: {
        ...state.windows,
        ...Object.fromEntries(
          Object.entries(state.windows).map(([k, w]) => [k, { ...w, isFocused: false }])
        ),
        [id]: {
          ...state.windows[id],
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: zCounter,
          isFocused: true,
        },
      },
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isMinimized: true, isFocused: false },
      },
    }));
  },

  maximizeWindow: (id) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    set((state) => {
      const w = state.windows[id];
      return {
        windows: {
          ...state.windows,
          [id]: {
            ...w,
            isMaximized: true,
            isMinimized: false,
            prevPosition: w.isMaximized ? w.prevPosition : w.position,
            prevSize: w.isMaximized ? w.prevSize : w.size,
            position: { x: 0, y: 28 },
            size: { w: vw, h: vh - 28 },
          },
        },
      };
    });
  },

  restoreWindow: (id) => {
    zCounter += 1;
    set((state) => {
      const w = state.windows[id];
      return {
        windows: {
          ...state.windows,
          ...Object.fromEntries(
            Object.entries(state.windows).map(([k, win]) => [k, { ...win, isFocused: false }])
          ),
          [id]: {
            ...w,
            isMinimized: false,
            isMaximized: false,
            position: w.prevPosition,
            size: w.prevSize,
            zIndex: zCounter,
            isFocused: true,
          },
        },
      };
    });
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isOpen: false, isFocused: false },
      },
    }));
  },

  focusWindow: (id) => {
    zCounter += 1;
    set((state) => ({
      windows: {
        ...state.windows,
        ...Object.fromEntries(
          Object.entries(state.windows).map(([k, w]) => [k, { ...w, isFocused: false }])
        ),
        [id]: { ...state.windows[id], zIndex: zCounter, isFocused: true },
      },
    }));
  },

  moveWindow: (id, position) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], position },
      },
    }));
  },

  getWindow: (id) => get().windows[id],
}));

