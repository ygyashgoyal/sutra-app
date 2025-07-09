"use client"

import { useRef, useEffect, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { Bot, Send, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, [messages])
      

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <Bot className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-semibold text-black">
                                    Simple <span className="text-blue-600 mr-116">ChatBot</span>
                                </h1>
                                <SystemPrompt value={systemPrompt} onChange={setSystemPrompt} />

                            </div>
                            <p className="text-sm text-gray-600">Ask me anything</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="container mx-auto px-4 py-1 max-w-4xl">
                <Card className="h-[calc(100vh-160px)] flex flex-col border-blue-200">
                    <CardHeader className="pb-2 px-6 pt-4">
                        <h2 className="text-black font-bold text-xl">Chat Session</h2>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                        <div className="flex-1 overflow-y-auto px-6" ref={scrollRef}>
                            <div className="space-y-4 py-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex items-start space-x-3 ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                                            }`}
                                    >
                                        <div className={`p-2 rounded-full ${msg.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}>
                                            {msg.role === "user" ? (
                                                <User className="h-4 w-4 text-blue-600" />
                                            ) : (
                                                <Bot className="h-4 w-4 text-gray-600" />
                                            )}
                                        </div>
                                        <div
                                            className={`max-w-[80%] p-4 rounded-lg ${msg.role === "user"
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-50 text-black border border-gray-200"
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap">
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </p>
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

                        {/* Input */}
                        <div className="border-t border-gray-200 p-6 bg-gray-50/50">
                            <form onSubmit={handleSubmit} className="flex space-x-3">
                                <Input
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Ask a question..."
                                    disabled={isLoading}
                                    className="flex-1 border-black/10 focus:border-blue-500 focus:ring-blue-500 hover:border-blue-300 text-black/80"
                                />
                                <Button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="relative bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    {isLoading ? (
                                        <div className="absolute left-2 top-2 w-4 h-4 border-t-2 border-white rounded-full animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
