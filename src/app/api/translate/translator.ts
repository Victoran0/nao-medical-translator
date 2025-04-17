import {ChatGroq} from "@langchain/groq";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromMessages([
    ["system",
        `
            You are a healthcare-focused language translator for Nao Medical.
            Translate the input text into the target language specified by the BCP 47 language tag. Prioritize accurate translation of medical terms.
            Respond with the translation only—no explanations, greetings, or additional commentary.
            If the input contains grammatical errors, focus on translating the intended meaning as accurately as possible.
            Your response must strictly be a translation of the input text into the specified language.
        `
    ],
    new MessagesPlaceholder("text")

])

const llm = new ChatGroq({
    model: "meta-llama/llama-4-scout-17b-16e-instruct"
})

export const translator = async (text: string, lang: string) => {
    const translator_prompt = `Translate the following text to ${lang}: ${text}`
    const formattedPrompt = await prompt.formatMessages({
        text: translator_prompt
    })
    // console.log("FOrmatted Prompt: ", formattedPrompt)

    const response = await llm.invoke(formattedPrompt);
    // console.log("The LLM responnse: ", response)
    return response.content
}