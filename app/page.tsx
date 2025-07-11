"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Code2,
  Settings,
  Bot,
} from "lucide-react"
import Chatbot from "@/components/chatbot"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { generateCodeExample } from "@/utils/generate-codes"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export default function SUTRAPlayground() {
  const [model, setModel] = useState("sutra-v2")
  const [temperature, setTemperature] = useState([1])
  const [maxTokens, setMaxTokens] = useState([1024])
  const [stream, setStream] = useState(true)
  const [onlineSearch, setOnlineSearch] = useState(false)
  const [location, setLocation] = useState("global")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [showCode, setShowCode] = useState(false)
  const [codeLanguage, setCodeLanguage] = useState("javascript")

  const code = useMemo(() => {
    return generateCodeExample(codeLanguage, {
      model,
      messages,
      maxTokens: maxTokens[0],
      temperature: temperature[0],
      stream,
      onlineSearch,
      location,
    })
  }, [codeLanguage, model, messages, maxTokens, temperature, stream, onlineSearch, location])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Playground</h1>
            </div>

          </div>

          <div className="flex items-center space-x-4">
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-48 bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="sutra-v2">
                  <div className="flex items-center gap-2">
                    SUTRA-V2
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                      Latest
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="sutra-r0">SUTRA-R0</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-2 border-gray-300 hover:bg-gray-50 bg-transparent" onClick={() => { setShowCode(true) }}>
              <Code2 className="w-4 h-4" />
              View code
            </Button>

          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Center Panel - Chatbot */}
        <div className="w-240">
          <Chatbot
            onMessagesUpdate={setMessages}
            temperature={temperature[0]}
            maxTokens={maxTokens[0]}
            stream={stream}
            onlineSearch={onlineSearch}
            location={location}
          />
        </div>



        {/* Right Panel - Parameters */}
        <div className="w-80 border-l border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Parameters</h2>
            <Button variant="ghost" size="sm" className="hover:bg-gray-100">
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Temperature */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Temperature</label>
                <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-medium">{temperature[0]}</div>
              </div>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                max={2}
                min={0}
                step={0.1}
                className="w-full [&_[role=slider]]:bg-blue-600 [&_[role=slider]]:border-blue-600"
              />
              <p className="text-xs text-gray-500">Controls randomness in the output</p>
            </div>

            {/* Max Completion Tokens */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Max Completion Tokens</label>
                <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-medium">{maxTokens[0]}</div>
              </div>
              <Slider
                value={maxTokens}
                onValueChange={setMaxTokens}
                max={4096}
                min={1}
                step={1}
                className="w-full [&_[role=slider]]:bg-blue-600 [&_[role=slider]]:border-blue-600"
              />
              <p className="text-xs text-gray-500">Maximum number of tokens to generate</p>
            </div>

            <Separator className="bg-gray-200" />

            {/* Stream */}
            <div className="flex items-center justify-between py-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Stream</label>
                <p className="text-xs text-gray-500">Stream response as it&apos;s generated</p>
              </div>
              <Switch checked={stream} onCheckedChange={setStream} className="data-[state=checked]:bg-blue-600" />
            </div>

            {/* Online Search */}
            <div className="flex items-center justify-between py-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Online Search</label>
                <p className="text-xs text-gray-500">Enable web search capabilities</p>
              </div>
              <Switch
                checked={onlineSearch}
                onCheckedChange={setOnlineSearch}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            {/* Location */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full bg-white border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="london">London</SelectItem>
                  <SelectItem value="korea">Korea</SelectItem>
                  <SelectItem value="tokyo">Tokyo</SelectItem>
                  <SelectItem value="newyork">New York</SelectItem>
                  <SelectItem value="singapore">Singapore</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Search location preference</p>
            </div>

            <Separator className="bg-gray-200" />

            {/* Advanced */}
            <div></div>
          </div>
        </div>
      </div>

      {showCode && (
        <div className="fixed inset-0 bg-opacity-70 flex items-center justify-center z-50">
          <div
            className={`bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-4xl" : "w-1/2"`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">View Code</h2>
              <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                <SelectTrigger className="w-40 bg-white border-gray-300 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="curl">cURL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <pre className="overflow-auto text-sm bg-gray-100 p-4 rounded max-h-[70vh]">

              <SyntaxHighlighter language={codeLanguage} style={oneDark} wrapLongLines>
                {code}
              </SyntaxHighlighter>
            </pre>
            <Button onClick={() => setShowCode(false)} className="mt-4">Close</Button>
          </div>
        </div>
      )}
    </div>
  )
}
