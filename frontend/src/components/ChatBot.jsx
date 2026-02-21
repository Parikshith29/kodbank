import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

const CHIPS = ['Check my balance', 'How to transfer funds?', 'Report lost card'];

/* Simple inline markdown renderer — handles **bold**, *italic*, line breaks, bullet points */
const renderText = (text) => {
    const lines = text.split('\n').filter(l => l !== undefined);
    return lines.map((line, i) => {
        const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ');
        const content = isBullet ? line.trim().substring(2) : line;

        // Bold + italic inline
        const parts = content.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
        const formatted = parts.map((p, j) => {
            if (p.startsWith('**') && p.endsWith('**')) return <strong key={j}>{p.slice(2, -2)}</strong>;
            if (p.startsWith('*') && p.endsWith('*')) return <em key={j}>{p.slice(1, -1)}</em>;
            return p;
        });

        return (
            <span key={i} style={{ display: isBullet ? 'flex' : 'block', gap: isBullet ? '6px' : 0, marginBottom: lines.length > 1 ? '4px' : 0 }}>
                {isBullet && <span style={{ color: 'rgba(167,139,250,0.7)', flexShrink: 0 }}>·</span>}
                <span>{formatted}</span>
            </span>
        );
    });
};

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
        if (open) { const t = setTimeout(() => setPanelMounted(true), 20); return () => clearTimeout(t); }
        else { setPanelMounted(false); }
    }, [open]);

    const buildHistory = (msgs) => {
        const hist = [];
        for (let i = 0; i < msgs.length - 1; i++) {
            if (msgs[i].role === 'user' && msgs[i + 1]?.role === 'bot') hist.push({ user: msgs[i].text, bot: msgs[i + 1].text });
        }
        return hist;
    };

    const sendMessage = async (text) => {
        const trimmed = (text || input).trim();
        if (!trimmed || loading) return;
        const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMessages = [...messages, { role: 'user', text: trimmed, ts }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);
        try {
            const res = await api.post('/chat', { message: trimmed, history: buildHistory(newMessages) });
            const replyTs = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages(prev => [...prev, { role: 'bot', text: res.data.reply, ts: replyTs }]);
        } catch (err) {
            const errMsg = err.response?.data?.error || 'Something went wrong. Please try again.';
            setMessages(prev => [...prev, { role: 'bot', text: errMsg, ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isError: true }]);
        } finally { setLoading(false); }
    };

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

    return (
        <>
            {/* Bubble */}
            <button onClick={() => setOpen(o => !o)}
                style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 1000, width: '52px', height: '52px', borderRadius: '50%', border: 'none', background: open ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #7c3aed, #e11d48)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: open ? '0 4px 16px rgba(0,0,0,0.4)' : '0 6px 28px rgba(124,58,237,0.55)', border: open ? '1px solid rgba(255,255,255,0.1)' : 'none', transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
                {open
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                }
                {!open && <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(124,58,237,0.35)', animation: 'chatPulse 2s ease-out infinite' }} />}
            </button>

            {/* Panel */}
            <div style={{ position: 'fixed', bottom: '90px', right: '28px', zIndex: 999, width: '380px', maxWidth: 'calc(100vw - 40px)', background: 'rgba(12,8,24,0.96)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '20px', boxShadow: '0 24px 64px -12px rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', overflow: 'hidden', opacity: panelMounted ? 1 : 0, transform: panelMounted ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.98)', pointerEvents: open ? 'all' : 'none', transition: 'opacity 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>

                {/* Header */}
                <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(124,58,237,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff', flexShrink: 0, fontFamily: 'Inter,sans-serif' }}>K</div>
                        <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', fontFamily: 'Inter,sans-serif' }}>KodBank AI</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter,sans-serif' }}>Online</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', padding: '4px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px' }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '8px' }}>
                            {msg.role === 'bot' && (
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800, color: '#fff', flexShrink: 0, fontFamily: 'Inter,sans-serif' }}>K</div>
                            )}
                            <div style={{ maxWidth: '82%' }}>
                                <div style={{
                                    padding: '10px 13px',
                                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                    background: msg.role === 'user' ? 'linear-gradient(135deg, rgba(124,58,237,0.75), rgba(225,29,72,0.65))' : msg.isError ? 'rgba(225,29,72,0.09)' : 'rgba(255,255,255,0.06)',
                                    border: msg.role === 'bot' ? `1px solid ${msg.isError ? 'rgba(225,29,72,0.2)' : 'rgba(255,255,255,0.07)'}` : 'none',
                                    fontSize: '0.82rem', lineHeight: 1.6, color: '#fff', fontFamily: 'Inter,sans-serif', letterSpacing: '0.01em',
                                }}>
                                    {msg.role === 'bot' ? renderText(msg.text) : msg.text}
                                </div>
                                {msg.ts && <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.18)', marginTop: '3px', textAlign: msg.role === 'user' ? 'right' : 'left', fontFamily: 'Inter,sans-serif' }}>{msg.ts}</div>}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800, color: '#fff', flexShrink: 0, fontFamily: 'Inter,sans-serif' }}>K</div>
                            <div style={{ padding: '10px 14px', borderRadius: '14px 14px 14px 4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                                {[0, 1, 2].map(i => <span key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(167,139,250,0.7)', display: 'inline-block', animation: `chatDot 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Quick chips */}
                {messages.length === 1 && (
                    <div style={{ padding: '0 14px 10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {CHIPS.map(chip => (
                            <button key={chip} onClick={() => sendMessage(chip)}
                                style={{ padding: '5px 11px', borderRadius: '999px', border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.08)', color: 'rgba(190,170,255,0.85)', fontSize: '10px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', letterSpacing: '0.02em', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.2)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.08)'; }}
                            >{chip}</button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div style={{ padding: '10px 12px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input type="text" placeholder="Ask anything…" value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                        disabled={loading} autoComplete="off"
                        style={{ flex: 1, padding: '10px 13px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '11px', color: '#fff', fontFamily: 'Inter,sans-serif', fontSize: '0.82rem', outline: 'none', transition: 'border-color 0.2s' }}
                        onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                    <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                        style={{ width: '36px', height: '36px', flexShrink: 0, borderRadius: '10px', border: 'none', background: input.trim() && !loading ? 'linear-gradient(135deg, #7c3aed, #e11d48)' : 'rgba(255,255,255,0.05)', color: '#fff', cursor: input.trim() && !loading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: input.trim() && !loading ? '0 4px 12px rgba(124,58,237,0.4)' : 'none' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes chatPulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.65); opacity: 0; } }
                @keyframes chatDot { 0%,80%,100% { transform: scale(0.7); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
            `}</style>
        </>
    );
};

export default ChatBot;
