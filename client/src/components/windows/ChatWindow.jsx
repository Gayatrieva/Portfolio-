import { useState, useRef, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL || '';

const SUGGESTED_QUESTIONS = [
  'What frontend technologies does Gayatri know?',
  'Tell me about her projects.',
  'Is Gayatri open to freelance or internship roles?',
  'What is her educational background?',
];

function TypingIndicator() {
  return (
    <div className="chat-message chat-message--ai typing-indicator" aria-label="AI is typing">
      <div className="chat-sender">GAYATRI.AI</div>
      <div className="typing-dots">
        <span /><span /><span />
      </div>
    </div>
  );
}

function ChatMessage({ role, content }) {
  const isAi = role === 'assistant';
  return (
    <div className={`chat-message chat-message--${isAi ? 'ai' : 'user'}`}>
      {isAi && <div className="chat-sender">GAYATRI.AI</div>}
      <p className="chat-text">{content}</p>
    </div>
  );
}

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm an AI assistant trained on Gayatri's resume, skills, and projects. Ask me anything — like \"what has Gayatri built?\" or \"is she a good fit for a frontend role?\"",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed || isLoading) return;

      setError(null);
      const userMessage = { role: 'user', content: trimmed };
      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setInput('');
      setIsLoading(true);

      try {
        const res = await fetch(`${API}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            history: nextMessages
              .slice(0, -1) // exclude the just-added user message
              .map(({ role, content }) => ({ role, content })),
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server error ${res.status}`);
        }

        const { reply } = await res.json();
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      } catch (err) {
        setError(err.message || 'Failed to get a response. Please try again.');
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [input, messages, isLoading]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const showSuggestions = messages.length === 1;

  return (
    <div className="chat-window">
      {/* Message list */}
      <div className="chat-messages" role="log" aria-label="Chat conversation" aria-live="polite">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <TypingIndicator />}
        {error && (
          <div className="chat-error" role="alert">
            ⚠ {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>


      {showSuggestions && !isLoading && (
        <div className="chat-suggestions" aria-label="Suggested questions">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              className="suggestion-btn"
              onClick={() => sendMessage(q)}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="chat-input-row">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder="Ask about Gayatri's experience…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          maxLength={2000}
          aria-label="Chat message input"
          id="chat-input-field"
          disabled={isLoading}
        />
        <button
          className="chat-send-btn"
          onClick={() => sendMessage()}
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
          id="chat-send-btn"
        >
          {isLoading ? '…' : 'Send'}
        </button>
      </div>
    </div>
  );
}
