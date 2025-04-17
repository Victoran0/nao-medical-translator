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
        if (!("webkitSpeechRecognition" in window)) {
            toast.error("Your browser does not support Web speech API")
            console.error("Web speech api is not supported")
            return;
        }

        recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        const recognition = recognitionRef.current;
        recognition.interimResults = true;
        recognition.lang = inputLang || "en-US"
        recognition.continuous = true;

        if ("webkitSpeechRecognition" in window) {
            const grammar = `#JSGF V1.0; grammar punctuation; public <mark> = . | , | ? | ! | ; | : | ' | " | ... `;
            const speechRecognitionList = new window.webkitSpeechGrammarList();
            speechRecognitionList.addFromString(grammar, 1);
            recognition.grammars = speechRecognitionList;
            
        }
        
        recognition.onresult = (event) => {
            let text = ""
            for (let i = 0; i < event.results.length; i++) {
                text += event.results[i][0].transcript
                console.log(text);
                handleInputChange({target: {value: `${text} ${" "} `}})
            }
            setTranscript(text);
        };

        recognition.onerror = (event) => {
            toast.error("speech recognition error, Try again!")
            console.log("speech recognition error", event.error);
        }

        recognition.onend = (event) => {
            setIsListening(false);
            setTranscript("")
            console.log("speech recognition ended");
        }

        return () => {
            recognition.stop();
        };
    }, [])

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
