import { createStore } from 'zustand/vanilla'

export type TranslatorState = {
    inputLang: string;
    outputLang: string;
    speakingIndex: number;
}

export type TranslatorActions = {
    setSpeakingIndex: (val: number) => void;
    manageLang: (key: 'inputLang' | 'outputLang', value: string) => void;
}

export type TranslatorStore = TranslatorState & TranslatorActions

export const initTranslatorStore = (): TranslatorState => {
    return { 
        inputLang: "",
        outputLang: "",
        speakingIndex: -1,
    }
}

export const defaultInitState: TranslatorState = {
    inputLang: "",
    outputLang: "",
    speakingIndex: -1,
}

export const createTranslatorStore = (
    initState: TranslatorState = defaultInitState,
) => {
    return createStore<TranslatorStore>()((set, get) => ({
        ...initState,
        setSpeakingIndex: (val) => {
            set(() => ({ speakingIndex: val }))
        },
        manageLang(key, value) {
            set(() => ({ [key]: value }))
        },
    }))
}
