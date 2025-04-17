"use client"
import React from 'react'
import { toast } from 'sonner'
import { useTranslatorStore } from '../providers/translator-store-provider';

declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}

type Props = {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const UseSpeechRecognition = ({handleInputChange}: Props) => {
    const [isListening, setIsListening] = React.useState(false);
    const [transcript, setTranscript] = React.useState("");
    const recognitionRef = React.useRef<SpeechRecognition | null>(null);
    const {inputLang} = useTranslatorStore((state) => state,);
    
    React.useEffect(() => { 
        if (typeof window === "undefined") return;

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

        if (!SpeechRecognition) {
            toast.error("Your browser does not support Web Speech API");
            console.log("Web Speech API not supported");
            return;
        }

        try {
            recognitionRef.current = new SpeechRecognition();
            const recognition = recognitionRef.current;
            recognition.interimResults = true;
            recognition.lang = inputLang || "en-US";
            recognition.continuous = true;

            // Apply grammar only if supported
            if (SpeechGrammarList && recognition.grammars) {
                const grammar = `#JSGF V1.0; grammar punctuation; public <mark> = . | , | ? | ! | ; | : | ' | " | ... `;
                const speechRecognitionList = new SpeechGrammarList();
                speechRecognitionList.addFromString(grammar, 1);
                recognition.grammars = speechRecognitionList;
            }

            recognition.onresult = (event) => {
                let text = "";
                for (let i = 0; i < event.results.length; i++) {
                    text += event.results[i][0].transcript;
                }
                setTranscript(text);
                handleInputChange({ target: { value: `${text} ` } } as any);
            };

            recognition.onerror = (event) => {
                toast.error("Speech recognition error, try again!");
                console.log("speech recognition error", event.error);
            };

            recognition.onend = () => {
                setIsListening(false);
                setTranscript("");
                console.log("Speech recognition ended");
            };
        } catch (error) {
            toast.error("Speech Recognition init failed");
            console.log("SpeechRecognition init error:", error);
        }

        return () => {
            recognitionRef.current?.stop();
        };
    }, []);


    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
            setIsListening(true);
        }
    }

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }

    return {
        isListening,
        transcript,
        startListening,
        stopListening,
    }
}

export default UseSpeechRecognition
