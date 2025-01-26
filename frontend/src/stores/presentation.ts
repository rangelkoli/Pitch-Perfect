import { create } from 'zustand'

type PresentationStore = {
    script: string
    setScript: (script: string) => void

}

export const usePresentationStore = create<PresentationStore>((set) => ({
    script: '',
    setScript: (script) => set({ script })
}))
