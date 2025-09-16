import { create } from 'zustand'

export const useConfigStore = create((set) => ({
    role: 'institute',
    instituteId: "",
    setInstituteId: (id) => set(() => ({ instituteId: id })),
}))
