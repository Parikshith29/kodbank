import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

const ChatBot = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I\'m KodBank AI. How can I assist you with your banking needs today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    // Build history for backend context
    const buildHistory = (msgs) => {
        const hist = [];
        for (let i = 0; i < msgs.length - 1; i++) {
            if (msgs[i].role === 'user' && msgs[i + 1]?.role === 'bot') {
                hist.push({ user: msgs[i].text, bot: msgs[i + 1].text });
            }
        }
        return hist;
    };

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const newMessages = [...messages, { role: 'user', text: trimmed }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const history = buildHistory(newMessages);
            const res = await api.post('/chat', { message: trimmed, history });
            setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
        } catch (err) {
            const errMsg = err.response?.data?.error || 'Something went wrong. Please try again.';
            setMessages(prev => [...prev, { role: 'bot', text: errMsg, isError: true }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    return (
        <>
            {/* Floating bubble */}
            <button
                id="chatbot-bubble"
                className={`chatbot-bubble ${open ? 'chatbot-bubble--open' : ''}`}
                onClick={() => setOpen(o => !o)}
                aria-label="Toggle AI Chat"
            >
                {open ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                )}
            </button>

            {/* Chat panel */}
            <div className={`chatbot-panel ${open ? 'chatbot-panel--open' : ''}`}>
                {/* Header */}
                <div className="chatbot-header">
                    <div className="chatbot-header-info">
                        <div className="chatbot-avatar">AI</div>
                        <div>
                            <div className="chatbot-title">KodBank AI</div>
                            <div className="chatbot-status">
                                <span className="chatbot-dot" />
                                Online
                            </div>
                        </div>
                    </div>
                    <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chat">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="chatbot-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`chat-msg chat-msg--${msg.role} ${msg.isError ? 'chat-msg--error' : ''}`}>
                            {msg.role === 'bot' && <div className="chat-msg-avatar">AI</div>}
                            <div className="chat-msg-bubble">{msg.text}</div>
                        </div>
                    ))}
                    {loading && (
                        <div className="chat-msg chat-msg--bot">
                            <div className="chat-msg-avatar">AI</div>
                            <div className="chat-msg-bubble chat-typing">
                                <span /><span /><span />
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="chatbot-input-row">
                    <input
                        id="chatbot-input"
                        className="chatbot-input"
                        type="text"
                        placeholder="Ask KodBank AI…"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        disabled={loading}
                        autoComplete="off"
                    />
                    <button
                        id="chatbot-send"
                        className="chatbot-send"
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        aria-label="Send message"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatBot;
