import { useEffect, useMemo, useRef, useState } from 'react'
import { ChatIcon, SendIcon } from './Icons'
import { postChatbot } from '../services/api'

type ChatMessage = {
  id: string
  role: 'user' | 'bot'
  text: string
  at: number
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'bot-hello',
      role: 'bot',
      text: 'Hi! I can help you understand crowd intensity, alerts, and network health.',
      at: Date.now(),
    },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const listRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [open, messages])

  const hint = useMemo(() => {
    if (sending) return 'Thinking...'
    return 'Ask about overcrowding, weak network, or zone risk.'
  }, [sending])

  async function handleSend() {
    const text = input.trim()
    if (!text || sending) return

    const now = Date.now()
    setMessages((prev) => [
      ...prev,
      { id: `u-${now}`, role: 'user', text, at: now },
    ])
    setInput('')
    setSending(true)

    try {
      const res = await postChatbot(text)
      const reply = res?.data?.reply || 'No response from assistant.'
      setMessages((prev) => [
        ...prev,
        { id: `b-${now + 1}`, role: 'bot', text: String(reply), at: Date.now() },
      ])
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${now + 1}`,
          role: 'bot',
          text: 'Sorry, I couldn’t reach the assistant service right now.',
          at: Date.now(),
        },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {open && (
        <div className="fixed right-6 bottom-24 w-[380px] max-w-[calc(100vw-48px)] bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden z-50">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
            <div className="text-gray-800 font-semibold">AI Assistant</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div ref={listRef} className="h-72 overflow-y-auto px-5 py-4 space-y-3 bg-white">
            {messages.map((m) => (
              <div
                key={m.id}
                className={[
                  'flex',
                  m.role === 'user' ? 'justify-end' : 'justify-start',
                ].join(' ')}
              >
                <div
                  className={[
                    'px-3 py-2 rounded-2xl text-sm leading-relaxed max-w-[85%]',
                    m.role === 'user'
                      ? 'bg-sky-600 text-white'
                      : 'bg-gray-100 text-gray-800',
                  ].join(' ')}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={hint}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:bg-gray-50"
                disabled={sending}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend()
                }}
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={sending || !input.trim()}
                className="w-11 h-10 rounded-xl bg-sky-600 text-white disabled:opacity-60 disabled:cursor-not-allowed hover:bg-sky-700 transition-colors flex items-center justify-center"
                aria-label="Send message"
              >
                <SendIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-sky-600 text-white shadow-[0_10px_30px_rgba(56,189,248,0.35)] hover:bg-sky-700 transition-colors z-40 flex items-center justify-center"
        aria-label="Open AI assistant"
      >
        <ChatIcon className="w-6 h-6" />
      </button>
    </>
  )
}

