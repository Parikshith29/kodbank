import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

const CHIPS = ['Check my balance', 'How to transfer funds?', 'Report lost card'];

const ChatBot = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I\'m KodBank AI. How can I assist you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [panelMounted, setPanelMounted] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        if (open) {
            const t = setTimeout(() => setPanelMounted(true), 20);
            return () => clearTimeout(t);
        } else {
            setPanelMounted(false);
        }
    }, [open]);

    const buildHistory = (msgs) => {
        const hist = [];
        for (let i = 0; i < msgs.length - 1; i++) {
            if (msgs[i].role === 'user' && msgs[i + 1]?.role === 'bot') {
                hist.push({ user: msgs[i].text, bot: msgs[i + 1].text });
            }
        }
        return hist;
    };

    const sendMessage = async (text) => {
        const trimmed = (text || input).trim();
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
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <>
            {/* Floating bubble */}
            <button id="chatbot-bubble" onClick={() => setOpen(o => !o)}
                style={{
                    position: 'fixed', bottom: '28px', right: '28px', zIndex: 1000,
                    width: '56px', height: '56px', borderRadius: '50%', border: 'none',
                    background: open ? 'rgba(255,255,255,0.12)' : 'linear-gradient(135deg, #7c3aed, #e11d48)',
                    color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: open ? '0 4px 20px rgba(0,0,0,0.4)' : '0 8px 32px rgba(124,58,237,0.6)',
                    border: open ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                    transform: open ? 'rotate(0deg) scale(1)' : 'rotate(0deg) scale(1)',
                }}>
                {open ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                )}

                {/* Pulse ring when closed */}
                {!open && (
                    <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(124,58,237,0.4)', animation: 'chatPulse 2s ease-out infinite' }} />
                )}
            </button>

            {/* Chat panel */}
            <div style={{
                position: 'fixed', bottom: '96px', right: '28px', zIndex: 999,
                width: '420px', maxWidth: 'calc(100vw - 40px)',
                background: 'rgba(14,10,28,0.92)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px',
                boxShadow: '0 32px 80px -16px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.07)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                opacity: panelMounted ? 1 : 0,
                transform: panelMounted ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
                pointerEvents: open ? 'all' : 'none',
                transition: 'opacity 0.3s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
            }}>
                {/* Header */}
                <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                    {/* Header top glow */}
                    <div style={{ position: 'absolute', top: '-20px', left: '24px', width: '120px', height: '60px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
                        {/* Avatar */}
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: '#fff', flexShrink: 0, boxShadow: '0 0 16px rgba(124,58,237,0.5)' }}>K</div>
                        <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>KodBank AI</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px rgba(34,197,94,0.7)' }} />
                                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>Online · Banking Assistant</span>
                            </div>
                        </div>
                    </div>

                    <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '6px', display: 'flex', position: 'relative' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 12px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '360px' }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '8px' }}>
                            {msg.role === 'bot' && (
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>K</div>
                            )}
                            <div style={{ maxWidth: '78%' }}>
                                <div style={{
                                    padding: '11px 14px',
                                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                    background: msg.role === 'user'
                                        ? 'linear-gradient(135deg, rgba(124,58,237,0.7), rgba(225,29,72,0.6))'
                                        : msg.isError ? 'rgba(225,29,72,0.1)' : 'rgba(255,255,255,0.07)',
                                    border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.07)',
                                    fontSize: '0.83rem', lineHeight: 1.55, color: '#fff', letterSpacing: '0.01em',
                                    boxShadow: msg.role === 'user' ? '0 4px 16px rgba(124,58,237,0.25)' : 'none',
                                }}>
                                    {msg.text}
                                </div>
                                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', marginTop: '4px', textAlign: msg.role === 'user' ? 'right' : 'left', letterSpacing: '0.05em' }}>
                                    {timeStr}
                                </div>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>K</div>
                            <div style={{ padding: '12px 16px', borderRadius: '16px 16px 16px 4px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '5px', alignItems: 'center' }}>
                                {[0, 1, 2].map(i => (
                                    <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(167,139,250,0.7)', display: 'inline-block', animation: `chatDot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Quick chips — only show if first message is untouched */}
                {messages.length === 1 && (
                    <div style={{ padding: '0 16px 10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {CHIPS.map(chip => (
                            <button key={chip} onClick={() => sendMessage(chip)}
                                style={{ padding: '6px 12px', borderRadius: '999px', border: '1px solid rgba(124,58,237,0.35)', background: 'rgba(124,58,237,0.1)', color: 'rgba(200,180,255,0.85)', fontSize: '11px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', letterSpacing: '0.02em', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                                onMouseEnter={e => { e.target.style.background = 'rgba(124,58,237,0.25)'; e.target.style.borderColor = 'rgba(124,58,237,0.6)'; }}
                                onMouseLeave={e => { e.target.style.background = 'rgba(124,58,237,0.1)'; e.target.style.borderColor = 'rgba(124,58,237,0.35)'; }}
                            >
                                {chip}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input row */}
                <div style={{ padding: '12px 14px 14px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                        type="text" placeholder="Ask KodBank AI…" value={input}
                        onChange={e => setInput(e.target.value)} onKeyDown={handleKey} disabled={loading}
                        autoComplete="off"
                        style={{ flex: 1, padding: '11px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontFamily: 'Inter,sans-serif', fontSize: '0.83rem', outline: 'none', transition: 'border-color 0.2s' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                    <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                        style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '12px', border: 'none', background: input.trim() && !loading ? 'linear-gradient(135deg, #7c3aed, #e11d48)' : 'rgba(255,255,255,0.06)', color: '#fff', cursor: input.trim() && !loading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: input.trim() && !loading ? '0 4px 16px rgba(124,58,237,0.4)' : 'none' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes chatPulse { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(1.7); opacity: 0; } }
                @keyframes chatDot { 0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
            `}</style>
        </>
    );
};

export default ChatBot;
