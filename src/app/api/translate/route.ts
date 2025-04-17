import { translator } from "./translator"


export async function POST(req: Request) {
    const {messages, outputLang} = await req.json()
    const latestPrompt = messages[messages.length - 1].content
    // console.log("The user;s request: ", latestPrompt)
    // console.log("The outputLang: ", outputLang)
    try {
        const response = await translator(latestPrompt, outputLang)
        // console.log("Translator Response: ", response)
        return new Response(JSON.stringify(response), {status: 200})
        
    } catch (error: any) {
        console.error("The backend error: ", error)
        return new Response(JSON.stringify(error?.response), {status: 500})
    }

}