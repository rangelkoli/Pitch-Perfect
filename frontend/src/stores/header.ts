
import { create } from 'zustand'

type useHeaderStore = {
    url: string
    setUrl: (url: string) => void

}

export const useuseHeaderStore = create<useHeaderStore>((set) => ({
    url: '',
    setUrl: (url) => set({ url })
}))