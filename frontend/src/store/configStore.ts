import { create } from 'zustand'

export const useConfigStore = create((set) => ({
    role: 'professor',
}))
