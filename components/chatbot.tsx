"use client"

import { useRef, useEffect, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { Bot, Send, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SystemPrompt } from "./system-prompt"
import ReactMarkdown from "react-markdown"

type ChatbotProps = {
    onMessagesUpdate: (messages: { role: "user" | "assistant"; content: string }[]) => void
    temperature: number
    maxTokens: number
    stream: boolean
    onlineSearch: boolean
    location: string
}

export default function Chatbot({
    onMessagesUpdate,
    temperature,
    maxTokens,
    stream,
    onlineSearch,
    location,
}: Readonly<ChatbotProps>) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [systemPrompt, setSystemPrompt] = useState("")

    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/chat",
        key: "simple-chatbot",
        body: {
            temperature,
            max_tokens: maxTokens,
            stream,
            extra_body: {
                online_search: onlineSearch,
                location,
                tone: systemPrompt, // 👈 added tone/systemPrompt here
            },
        },
        initialMessages: [
            {
                id: "welcome",
                role: "assistant",
                content: "Hi! Ask me anything.",
            },
        ],
    })

    useEffect(() => {
        const filteredMessages = messages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }))

        onMessagesUpdate(filteredMessages)


        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, onMessagesUpdate])

    return (
        <div className="container mx-auto px-4 py-1 max-w-4xl">
            <SystemPrompt value={systemPrompt} onChange={setSystemPrompt} />

            {/* Chat UI Section */}
            <div className="h-[calc(100vh-160px)] flex flex-col">
                <div className="relative w-full flex-1 overflow-hidden">
                    <div className="h-full overflow-auto flex flex-col gap-4 p-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                            >
                                <div className="flex items-start gap-2 max-w-3xl w-full">
                                    {msg.role === "assistant" && (
                                        <div className="p-2 rounded-full bg-gray-100">
                                            <Bot className="h-4 w-4 text-gray-600" />
                                        </div>
                                    )}
                                    {msg.role === "user" && (
                                        <div className="p-2 rounded-full bg-blue-100">
                                            <User className="h-4 w-4 text-blue-600" />
                                        </div>
                                    )}

                                    <div className="flex-1 p-4 rounded-lg border border-black/10 bg-gray-50 text-black">
                                        <div className="text-xs uppercase text-muted-foreground mb-1 font-medium tracking-wide">
                                            {msg.role === "user" ? "User" : "Assistant"}
                                        </div>
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}




                        {isLoading && (
                            <div className="flex items-start space-x-3">
                                <div className="p-2 rounded-full bg-gray-100">
                                    <Bot className="h-4 w-4 text-gray-600" />
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                        <div
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.1s" }}
                                        />
                                        <div
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.2s" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Input area (styled like ChatGPT) */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <form onSubmit={handleSubmit} className="flex space-x-3">
                        <Input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Ask something..."
                            disabled={isLoading}
                            className="flex-1 border-black/10 focus:border-blue-500 focus:ring-blue-500 hover:border-blue-300 rounded-2xl text-black/80 h-10"
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white relative"
                        >
                            {isLoading ? (
                                <div className="absolute left-2 top-2 w-4 h-4 border-t-2 border-white rounded-full animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>

    )
}