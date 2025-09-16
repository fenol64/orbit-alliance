import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'

export const useConfigStore = createStore()(
  persist(
    (set) => ({
        role: 'institute',
        instituteId: "",
        setInstituteId: (id) => set(() => ({ instituteId : id })),
    }),
    { name: 'config-storage' },
  ),
)
