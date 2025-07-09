import { streamText, UIMessage } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const {
    messages,
    temperature = 1,
    max_tokens = 1024,
    stream = true,
    extra_body = {},
  }: {
    messages: UIMessage[]
    temperature?: number
    max_tokens?: number
    stream?: boolean
    extra_body?: Record<string, any> // { online_search: true, location: "mumbai" }
  } = await req.json()

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Invalid or missing messages", { status: 400 })
  }

  const sutra = createOpenAI({
    baseURL: "https://api.two.ai/v2",
    apiKey: process.env.SUTRA_API_KEY,
  })

  const result = await streamText({
    model: sutra("sutra-v2"),
    messages,
    temperature,
    maxTokens: max_tokens,
    stream,
    extraBody: extra_body,
  })

  return result.toDataStreamResponse()
}

