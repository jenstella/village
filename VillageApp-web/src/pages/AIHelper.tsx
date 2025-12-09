import { useState } from 'react'
import '../App.css'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const starterPrompts = [
  'Help me write an email to request a meeting about his accommodations.',
  'Summarize this IEP section and tell me what questions to ask.',
  'What does “executive functioning difficulties” mean?',
  'What should I log when he comes home upset from school?',
]

const cannedReplies: Message[] = [
  {
    role: 'assistant',
    content:
      'Got it. I can draft a supportive email that references accommodations, asks for collaborative solutions, and keeps a positive tone.',
  },
  {
    role: 'assistant',
    content:
      'Tip: include concrete examples and a clear ask (meeting date/time or updated supports).',
  },
]

export function AIHelper() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hi! I can summarize school docs, draft advocacy emails, or suggest supportive responses. Try one of the prompts below.',
    },
  ])
  const [input, setInput] = useState('')

  const send = (text?: string) => {
    const prompt = text ?? input
    if (!prompt.trim()) return
    setMessages((prev) => [...prev, { role: 'user', content: prompt }, ...cannedReplies])
    setInput('')
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI helper</h1>
          <p className="page-subtitle">
            Draft advocacy emails, summarize notes, or get next-step guidance.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="card" style={{ display: 'grid', gap: 10 }}>
          <strong>Starter prompts</strong>
          <div className="stack">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                className="button secondary"
                type="button"
                onClick={() => send(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="list">
          {messages.map((msg, idx) => (
            <div key={idx} className="card">
              <div className="meta">
                <span className="tag">{msg.role === 'user' ? 'You' : 'AI'}</span>
              </div>
              <p style={{ margin: 0 }}>{msg.content}</p>
            </div>
          ))}
        </div>

        <form className="form" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <div className="field">
            <label htmlFor="chat">Ask anything</label>
            <textarea
              id="chat"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex: Draft a follow-up email after the meeting..."
            />
          </div>
          <button className="button" type="submit">
            Send to AI (stubbed)
          </button>
          <small className="page-subtitle">
            In this prototype, responses are canned. Later, connect OpenAI or similar.
          </small>
        </form>
      </div>
    </div>
  )
}

export default AIHelper

