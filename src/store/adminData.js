import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAdminStore = create(
  persist(
    (set) => ({
      apps: {},
      folders: {},

      setAppOverride: (id, data) =>
        set((s) => ({
          apps: { ...s.apps, [id]: { ...s.apps[id], ...data } },
        })),

      resetApp: (id) =>
        set((s) => {
          const apps = { ...s.apps };
          delete apps[id];
          return { apps };
        }),

      setFolderChildOverride: (folderId, childId, data) =>
        set((s) => ({
          folders: {
            ...s.folders,
            [folderId]: {
              ...s.folders[folderId],
              [childId]: {
                ...(s.folders[folderId]?.[childId] ?? {}),
                ...data,
              },
            },
          },
        })),

      resetFolder: (folderId) =>
        set((s) => {
          const folders = { ...s.folders };
          delete folders[folderId];
          return { folders };
        }),
    }),
    { name: "portfolio-admin-v1" }
  )
);

export default useAdminStore;
