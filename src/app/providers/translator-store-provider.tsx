'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import {
    type TranslatorStore,
    createTranslatorStore,
    initTranslatorStore,
} from "@/stores/translator-store"

export type TranslatorStoreApi = ReturnType<typeof createTranslatorStore>

export const TranslatorStoreContext = createContext<TranslatorStoreApi | undefined>(
    undefined,
)

export interface TranslatorStoreProviderProps {
    children: ReactNode
}

export const TranslatorStoreProvider = ({
    children,
}: TranslatorStoreProviderProps) => {
    const storeRef = useRef<TranslatorStoreApi | null>(null)
    if (storeRef.current === null) {
        storeRef.current = createTranslatorStore(initTranslatorStore())
    }

    return (
        <TranslatorStoreContext.Provider value={storeRef.current}>
        {children}
        </TranslatorStoreContext.Provider>
    )
}

export const useTranslatorStore = <T,>(
    selector: (store: TranslatorStore) => T,
): T => {
    const translatorStoreContext = useContext(TranslatorStoreContext)

    if (!translatorStoreContext) {
        throw new Error(`useTranslatorStore must be used within TranslatorStoreProvider`)
    }

    return useStore(translatorStoreContext, selector)
}