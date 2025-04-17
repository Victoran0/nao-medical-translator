"use client"
import { toast } from "sonner";
import React from 'react'
import { useTranslatorStore } from "@/app/providers/translator-store-provider";

const UseTextToSpeech = () => {
    const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
    const {outputLang, setSpeakingIndex} = useTranslatorStore((state) => state,);


    function textToSpeech(
        text: string, 
        index: number, 
    ) {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        const synth = window.speechSynthesis;

        // If already speaking, cancel and retry
        if (synth.speaking) {
            console.warn('speechSynthesis is already speaking. Cancelling...');
            toast.warning('Currently speaking. Cancelling...');
            setSpeakingIndex(-1)
            synth.cancel();
            return; 
        }

        const speakNow = () => {
            const utterThis = new SpeechSynthesisUtterance(text);

            const selectedVoice =
            voices.find((voice) => voice.lang === outputLang) ||
            voices.find((voice) => voice.default) ||
            voices[0];

            if (selectedVoice) {
            utterThis.voice = selectedVoice;
            }

            utterThis.pitch = 1;
            utterThis.rate = 1;

            utterThis.onend = () => {
                setSpeakingIndex(-1)
                console.log('Speech finished');
            };
            utterThis.onstart = () => {
                toast.success("Speaking...")
                setSpeakingIndex(index)
            }
            utterThis.onerror = (e: any) => {
                console.log('Speech error', e)
                if (e.error !== "interrupted") {
                    toast.warning('Uh oh! Something went wrong, try again later...');
                }
            };

            synth.speak(utterThis);
        };

        const loadVoices = () => {
            setVoices(synth.getVoices().sort((a, b) => a.name.localeCompare(b.name)));
            // console.log("Available voices: ", voices);
        };

        if (voices.length === 0) {
            // Some browsers load voices asynchronously
            synth.onvoiceschanged = loadVoices;
        }

        speakNow();
    }

    function stopSpeech() {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
        const synth = window.speechSynthesis;
        if (synth.speaking) {
            setSpeakingIndex(-1)
            synth.cancel();
        }
    }
    return {
        textToSpeech,
        stopSpeech
    }
}

export default UseTextToSpeech
