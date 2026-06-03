import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { WALLPAPERS } from "#constants";

const STORAGE_KEY = "activeWallpaperId";
const FOCUS_KEY = "focusModeEnabled";

const getSavedId = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved !== null) {
    const id = parseInt(saved, 10);
    if (WALLPAPERS.some((w) => w.id === id)) return id;
  }
  return WALLPAPERS[0].id;
};

const getSavedFocus = () => {
  return localStorage.getItem(FOCUS_KEY) === "true";
};

const useDesktopStore = create(
  immer((set) => ({
    activeWallpaperId: getSavedId(),
    isSpotlightOpen: false,
    isFocusModeEnabled: getSavedFocus(),
    isControlCenterOpen: false,

    setWallpaper: (id) =>
      set((state) => {
        if (!WALLPAPERS.some((w) => w.id === id)) return;
        state.activeWallpaperId = id;
        localStorage.setItem(STORAGE_KEY, String(id));
      }),

    nextWallpaper: () =>
      set((state) => {
        const idx = WALLPAPERS.findIndex((w) => w.id === state.activeWallpaperId);
        const next = WALLPAPERS[(idx + 1) % WALLPAPERS.length];
        state.activeWallpaperId = next.id;
        localStorage.setItem(STORAGE_KEY, String(next.id));
      }),

    prevWallpaper: () =>
      set((state) => {
        const idx = WALLPAPERS.findIndex((w) => w.id === state.activeWallpaperId);
        const prev = WALLPAPERS[(idx - 1 + WALLPAPERS.length) % WALLPAPERS.length];
        state.activeWallpaperId = prev.id;
        localStorage.setItem(STORAGE_KEY, String(prev.id));
      }),

    openSpotlight: () =>
      set((state) => {
        state.isSpotlightOpen = true;
      }),

    closeSpotlight: () =>
      set((state) => {
        state.isSpotlightOpen = false;
      }),

    toggleSpotlight: () =>
      set((state) => {
        state.isSpotlightOpen = !state.isSpotlightOpen;
      }),

    toggleFocusMode: () =>
      set((state) => {
        state.isFocusModeEnabled = !state.isFocusModeEnabled;
        localStorage.setItem(FOCUS_KEY, String(state.isFocusModeEnabled));
      }),

    setFocusMode: (enabled) =>
      set((state) => {
        state.isFocusModeEnabled = enabled;
        localStorage.setItem(FOCUS_KEY, String(enabled));
      }),

    openControlCenter: () =>
      set((state) => {
        state.isControlCenterOpen = true;
      }),

    closeControlCenter: () =>
      set((state) => {
        state.isControlCenterOpen = false;
      }),

    toggleControlCenter: () =>
      set((state) => {
        state.isControlCenterOpen = !state.isControlCenterOpen;
      }),
  })),
);

export default useDesktopStore;
