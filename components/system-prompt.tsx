"use client"

import { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { ChevronUp } from "lucide-react"

export function SystemPrompt({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  const [open, setOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [open])

  return (
    <div
      className={`flex w-full content-start rounded-lg flex-col transition 
        ${open ? "bg-accent/10 border border-border shadow-sm" : "bg-secondary-subtle"}`}
    >
      {/* Clickable header */}
      <div
        className="flex justify-between p-2 cursor-pointer hover:bg-accent/30 transition"
        onClick={() => setOpen(!open)}
      >
        <div className="p-2 px-4 justify-start bg-none uppercase font-semibold text-primary opacity-85">
          System
        </div>

        {!open ? (
          <div className="flex items-center text-muted-foreground opacity-50 pr-124">
            Enter system message (Optional)
          </div>
        ) : (
          <button
            className="inline-flex items-center justify-center w-10 h-10 hover:text-accent-foreground text-muted-foreground"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
            }}
            title="Collapse"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Textarea only if expanded */}
      {open && (
        <div className="px-4 pb-3">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter system message (Optional)"
            className="w-full text-sm resize-none border-none bg-muted focus-visible:ring-0 focus-visible:outline-none px-3 py-2 rounded-md"
            rows={3}
          />
        </div>
      )}
    </div>
  )
}
