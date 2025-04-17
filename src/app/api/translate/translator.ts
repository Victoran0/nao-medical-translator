import {ChatGroq} from "@langchain/groq";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromMessages([
    ["system",
        `
            You are a language translator for Nao Medical. You strictly work in a Healthcare context.
            Translate the provided text to the specified language given in BCP 47 language tags.
            Medical terms are a priority, ensure you get the best possible translation in the provided language. 
            You respose should contain the translation of the given text only, nothing else! Do not add fluff like "I'm here to help you" or "I'm a helpful AI" or anything like that. 
            If the provided text contains some grammatical errors that will make it difficult to translate, provide the translation mostly related to the intent of the text.
            Strictly ensure that your response is a translation of the provided text to the provided language.
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