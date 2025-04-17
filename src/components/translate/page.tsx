"use client"
import React, {useState, useEffect, useRef} from "react";
import {AnimatePresence, motion} from 'motion/react'
import { cn } from '@/lib/utils'
import { Send, SparkleIcon, Mic, CirclePlay, CircleStop, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import {useChat} from '@ai-sdk/react'
import SelectInputLang from "./SelectInputLang";
import SelectOutputlang from "./SelectOutputLang";
import { useTranslatorStore } from "../../app/providers/translator-store-provider";
import UseSpeechRecognition from "./SpeechRecognition";
import ThinkingThreeDotsJumping from "./ThinkingThreeDotsJumping";
import UseTextToSpeech from "./UseTextToSpeech";

const Translator = () => {
    const [body, setBody] = useState<string>("")
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [responseLoaded, setResponseLoaded] = useState<boolean>(false)
    const [responseIsLoading, setResponseIsLoading] = useState<boolean>(false)
    const loadingRef = useRef<HTMLDivElement | null>(null)  
    const {inputLang, outputLang, speakingIndex} = useTranslatorStore((state) => state,);
    const { stopSpeech, textToSpeech } = UseTextToSpeech();



    const {input, handleInputChange, handleSubmit, messages} = useChat({
        api: '/api/translate', // path to our server route
        body: { // the body of the request
            body, outputLang
        },
        onError: (error: any) => {
            toast.error("internal server error")
            console.log("useChat error: ", error)
            setResponseLoaded(true)
            setResponseIsLoading(false)
            if (loadingRef.current) {
                loadingRef.current.remove()
            }
        },
        onFinish: () => {
            console.log("finished")
            setResponseLoaded(true)
            setResponseIsLoading(false)
            if (loadingRef.current) {
                loadingRef.current.remove()
            }
        },
        initialMessages: [],
        streamProtocol: 'text'
    });

    const {isListening, startListening, stopListening, transcript} = UseSpeechRecognition({handleInputChange});


    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages])

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        handleSubmit(event)
        stopListening();
        if (responseLoaded) setResponseLoaded(false)
        setResponseIsLoading(true)
        console.log("submitted")
    }

    const speechToText = () => {
        if (inputLang == "") {
            toast.error("Kindly select your input Language")
            return;
        }
        if (outputLang == "") {
            toast.error("Kindly select your output Language")
            return;
        }
        if (isListening) {
            stopListening()
        } 
        startListening();
        toast.success("Listening...")
    }


    return (
        <div className="grid items-center justify-items-center min-h-screen px-2 font-[family-name:var(--font-geist-sans)]">

        <motion.div className='p-2 h-[430px] flex flex-col w-full mx-3 self-center overflow-x-scroll mb-16 justify-between rounded-lg bg-gray-200 shadow-inner'>

            {messages.length > 0 && (
            <div className=" w-full p-2 flex overflow-y-scroll h-[80%] flex-col gap-2" id='message-container' ref={containerRef}>
                <AnimatePresence mode='sync'>
                    {messages.map((message, index) => {
                        const uniqueId = `fallback-${index}`
                        return (
                            <React.Fragment key={uniqueId}>
                            <motion.div 
                                key={`${uniqueId}-head`}
                                layout='position' // only its position will animate
                                className={cn('z-10 mt-2 max-w-[700px] break-words', 
                                {'self-end text-gray-900 bg-pink-200 rounded-2xl': message.role === 'user', 
                                'self-start text-white': message.role === 'assistant'
                                })}
                                layoutId={`container-[${messages.length-1}]`}
                                transition={{
                                    type: 'easeOut',
                                    duration: 0.2
                                }}
                            >   
                                {message.role === 'user' ? (
                                    <div className='max-[700px]:text-[12px] px-3 py-2 text-[16px] leading-[20px]'>
                                        {message.content}
                                    </div>
                                ) : (
                                    <div 
                                        className='max-[700px]:text-[12px] text-[14px] flex items-end'
                                    >   
                                        <p
                                            className="bg-[#7367f0] px-3 py-2 rounded-2xl"
                                        >

                                            {message.content}
                                        </p>
                                            {speakingIndex === index ? (
                                                <button 
                                                    type="button" 
                                                    title="Stop Listening to Translation"
                                                    className=""
                                                    onClick={() => 
                                                        stopSpeech()
                                                    }
                                                >
                                                    <CircleStop className='text-black hover:border-none bg-[#ff6ec7] rounded-full cursor-pointer hover:opacity-75 active:opacity-30 transition-all duration-150 -ml-3 -mb-2 size-6' />
                                                </button>
                                                
                                            ) : (
                                                <button 
                                                    type="button" 
                                                    title="Listen to Translation"
                                                    className=""
                                                    onClick={() => 
                                                        textToSpeech(
                                                            message.content, 
                                                            index,
                                                        )
                                                    }
                                                >
                                                    <CirclePlay className='text-black hover:border-none cursor-pointer bg-[#ff6ec7] rounded-full hover:opacity-75 active:opacity-30 transition-all duration-150 -ml-3 -mb-2 size-6' />
                                                </button>
                                            )}
                                    </div>
                                )}
                            </motion.div>
                            {message.role === 'user' ? (
                            <motion.div 
                                ref={loadingRef}
                                key={`${uniqueId}-loading`}
                                className="z-10 mt-2 mr-4 max-w-[700px] self-start"
                                layoutId={`container-[${parseInt(message.id) === 0 ? -1.20 : parseInt(message.id) ** -3.22}]`}
                                transition={{
                                    type: 'easeOut',
                                    duration: 0.2
                                }}
                            >
                                {(!responseLoaded && messages[messages.length-1].role === 'user') && (
                                    <ThinkingThreeDotsJumping />
                                )}
                            </motion.div>
                            ): ""}
                            </React.Fragment>
                        )
                    })}
                </AnimatePresence>
            </div>
            )}

            {/* {messages.length > 0 && <div className='h-4'/>} */}
            
            <div className="">
                {messages.length === 0 && <div className='mb-4 overflow-y-scroll h-[80%] min-[804px]:mb-10 min-[1233px]:h-[94%] min-[932px]:h-[98%] min-[480px]:h-[85%] flex items-center flex-col gap-3'>
                    <div className="flex items-center min-[550px]:mt-5 justify-center gap-4">
                        <SparkleIcon className='size-12 text-gray-600' />
                        <div className="flex flex-col justify-center items-center gap-1">
                            <p className="max-[700px]:text-[12px] self-center text-gray-950 bgColorGrad text-[20px] text-center font-[500]">Nao Medical Translator</p>
                            <p className="max-[700px]:text-sm text-gray-500 text-xl px-2 stretchText mt-1">Translate Speech/Text professionally</p>
                        </div>
                    </div>

                    <div className="h-2"></div>
                    <div className="flex items-center gap-2 flex-wrap min-[700px]:px-10 max-[700px]:flex-col">
                        <span 
                            className='max-[700px]:text-sm text-center text-gray-600 bbBox2 px-2 py-1 text-[16px]'
                        >
                            select languages (input and output)
                        </span>
                        <span 
                            className='max-[700px]:text-sm text-center text-gray-600 bbBox2 px-2 py-1 text-[16px]'
                        >
                            Tap Speak
                        </span>
                        <span 
                            className='max-[700px]:text-sm text-center text-gray-600 bbBox2 px-2 py-1 text-[16px]'
                        >
                            Your speech will be transcribed into the text area
                        </span>
                        <span 
                            className='max-[700px]:text-sm text-center text-gray-600 bbBox2 px-2 py-1 text-[16px]' 
                        >
                            You can also type using your keyboard
                        </span>
                        <span 
                            className='max-[700px]:text-sm text-center text-gray-600 bbBox2 px-2 py-1 text-[16px]'
                        >
                            Click the Play button at the bottom right of the translation to listen!
                        </span>
                    </div>
                </div>}

                    <div>
                    {isListening ? (
                        <form 
                            className="relative flex items-center justify-center w-full" 
                            onSubmit={handleFormSubmit}
                        >
                            <div className="relative w-[96%]">
                                <input 
                                    type="text"
                                    className="text-[12px] px-4 py-4 w-full placeholder:text-[12px] rounded-full border border-gray-200 bg-white outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-blue-500/20 focus-visible:ring-offset-1 pr-12"
                                    placeholder="Speak or type text..."
                                    value={input}
                                    onChange={handleInputChange}
                                    required
                                />

                                <button 
                                    title="send" 
                                    type="submit"
                                    className="absolute inset-y-[10px] right-[9px] flex items-center justify-center size-8 rounded-full bg-gray-200 hover:opacity-75 active:opacity-25 transition-all duration-150"
                                >
                                    <Send className="size-5 text-gray-500 max-[700px]:size-4" />
                                </button>
                            </div>

                            <motion.div 
                                key={messages.length}
                                layout="position"
                                layoutId={`container-[${messages.length}]`}
                                transition={{
                                type: 'easeOut',
                                duration: 0.2,
                                }}
                                initial={{opacity: 0.6, zIndex: -1}}
                                animate={{opacity: 0.6, zIndex: -1}}
                                exit={{opacity: 1, zIndex: 1}}
                                className="pointer-events-none absolute z-10 flex h-9 w-[250px] items-center overflow-hidden break-words rounded-full bg-gray-200 [word-break:break-word]"
                            >
                                <div className="px-3 py-2 text-[12px] leading-[15px] text-gray-900">
                                    {input}
                                </div>
                            </motion.div>
                        </form>

                    ) : (
                        <div className="flex flex-col">
                            <div className="h-1 w-[96%] self-center bg-gray-500 mb-5" />
                            <div className="flex items-center gap-5 self-center max-[450px]:gap-2">
                                <button 
                                    type="button"
                                    className="flex items-center justify-center bgColorGrad text-gray-700 gap-1 cursor-pointer hover:scale-90 transition-all duration-150 active:opacity-25 min-[400px]:mr-2 disabled:opacity-30 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    onClick={speechToText}
                                    disabled={responseIsLoading}
                                >
                                    <p className="font-[600] text-[12px] my-[5px]">Speak</p>
                                    <Mic  className='max-[700px]:size-5 size-6 ' />
                                </button>
                                <div className="flex items-center justify-center min-[400px]:gap-2 min-[700px]:gap-3">
                                    <SelectInputLang />
                                    <ArrowRight className='max-[700px]:size-5 size-6 ' />
                                    <SelectOutputlang />
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
            </div>
            </motion.div>
        </div>
    )
}

export default Translator
