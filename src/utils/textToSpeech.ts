import { stat } from "fs";
import { toast } from "sonner";

let voices: SpeechSynthesisVoice[] = [];

export function textToSpeech(
    text: string, 
    lang: string, 
    onEndFunc: () => void, 
    onStartFunc: () => void,
) {
    const synth = window.speechSynthesis;

    // If already speaking, cancel and retry
    if (synth.speaking) {
        console.warn('speechSynthesis is already speaking. Cancelling...');
        toast.warning('Currently speaking. Cancelling...');
        onEndFunc()
        synth.cancel();
        return; 
    }

    const speakNow = () => {
        const utterThis = new SpeechSynthesisUtterance(text);

        const selectedVoice =
        voices.find((voice) => voice.lang === lang) ||
        voices.find((voice) => voice.default) ||
        voices[0];

        if (selectedVoice) {
        utterThis.voice = selectedVoice;
        }

        utterThis.pitch = 1;
        utterThis.rate = 1;

        utterThis.onend = () => {
            onEndFunc()
            console.log('Speech finished');
        };
        utterThis.onstart = () => {
            toast.success("Speaking...")
            onStartFunc()
        }
        utterThis.onerror = (e:any) => {
            console.log('Speech error', e)
            if (e.error === "interrupted") {
            } else {
                toast.warning('Uh oh! Something went wrong, try again later...');
            }
        };

        synth.speak(utterThis);
    };

    const loadVoices = () => {
        voices = synth.getVoices().sort((a, b) => a.name.localeCompare(b.name));
        // console.log("Available voices: ", voices);
    };

    if (voices.length === 0) {
        // Some browsers load voices asynchronously
        synth.onvoiceschanged = loadVoices;
    }

    speakNow();
}

export function stopSpeech(onEndFunc: () => void) {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
        onEndFunc()
        synth.cancel();
    }
}