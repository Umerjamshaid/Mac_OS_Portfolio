import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { WALLPAPERS } from "#constants";

const STORAGE_KEY = "activeWallpaperId";

const getSavedId = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const id = parseInt(saved, 10);
      if (!Number.isNaN(id) && WALLPAPERS.some((w) => w.id === id)) return id;
    }
  } catch (e) {
    console.warn("Failed to read wallpaper from localStorage:", e);
  }
  return WALLPAPERS[0]?.id ?? 1;
};

const useDesktopStore = create(
  immer((set) => ({
    activeWallpaperId: getSavedId(),
    isSpotlightOpen: false,

    setWallpaper: (id) =>
      set((state) => {
        if (!WALLPAPERS.some((w) => w.id === id)) return;
        state.activeWallpaperId = id;
        try {
          localStorage.setItem(STORAGE_KEY, String(id));
        } catch (e) {
          console.warn("Failed to save wallpaper to localStorage:", e);
        }
      }),

    nextWallpaper: () =>
      set((state) => {
        let idx = WALLPAPERS.findIndex((w) => w.id === state.activeWallpaperId);
        if (idx === -1) idx = 0;
        const next = WALLPAPERS[(idx + 1) % WALLPAPERS.length];
        state.activeWallpaperId = next.id;
        try {
          localStorage.setItem(STORAGE_KEY, String(next.id));
        } catch (e) {
          console.warn("Failed to save wallpaper to localStorage:", e);
        }
      }),

    prevWallpaper: () =>
      set((state) => {
        let idx = WALLPAPERS.findIndex((w) => w.id === state.activeWallpaperId);
        if (idx === -1) idx = 0;
        const prev = WALLPAPERS[(idx - 1 + WALLPAPERS.length) % WALLPAPERS.length];
        state.activeWallpaperId = prev.id;
        try {
          localStorage.setItem(STORAGE_KEY, String(prev.id));
        } catch (e) {
          console.warn("Failed to save wallpaper to localStorage:", e);
        }
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
  })),
);

export default useDesktopStore;
