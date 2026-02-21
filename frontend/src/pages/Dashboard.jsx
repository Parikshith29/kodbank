import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PartyPopper from '../components/PartyPopper';

/* ── Inline SVG Logo ─────────────────────────────────── */
const KodBankLogo = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="dlg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill="url(#dlg)" />
        <path d="M13 11v18M13 20l10-9M13 20l10 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* ── Markets config ──────────────────────────────────── */
const MARKETS = [
    { id: 'usd', label: 'USD/INR', fetch: async () => { try { const r = await fetch('https://api.exchangerate-api.com/v4/latest/USD'); const d = await r.json(); return { price: d.rates.INR.toFixed(2), change: '+0.12%', up: true }; } catch { return { price: '83.91', change: '+0.12%', up: true }; } } },
    { id: 'eur', label: 'EUR/INR', fetch: async () => { try { const r = await fetch('https://api.exchangerate-api.com/v4/latest/EUR'); const d = await r.json(); return { price: d.rates.INR.toFixed(2), change: '-0.08%', up: false }; } catch { return { price: '90.44', change: '-0.08%', up: false }; } } },
    { id: 'btc', label: 'BTC/INR', fetch: async () => { try { const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr&include_24hr_change=true'); const d = await r.json(); const p = d.bitcoin.inr; const c = d.bitcoin.inr_24h_change; return { price: (p / 100000).toFixed(1) + 'L', change: (c >= 0 ? '+' : '') + c.toFixed(2) + '%', up: c >= 0 }; } catch { return { price: '72.4L', change: '+1.3%', up: true }; } } },
];

/* ── Logout Modal ────────────────────────────────────── */
const LogoutModal = ({ onConfirm, onCancel }) => (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.2s ease' }}>
        <div style={{ background: 'rgba(18,10,38,0.97)', backdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', boxShadow: '0 40px 80px rgba(0,0,0,0.9)', padding: '40px 36px', maxWidth: '320px', width: '90%', textAlign: 'center', position: 'relative', overflow: 'hidden', animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
            <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,29,72,0.5) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', margin: '0 auto 18px', background: 'rgba(225,29,72,0.1)', border: '1px solid rgba(225,29,72,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <svg width="20" height="20" fill="none" stroke="rgba(252,165,165,0.9)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '0 0 8px', position: 'relative' }}>Sign out?</h3>
            <p style={{ fontSize: '0.77rem', color: 'rgba(255,255,255,0.35)', margin: '0 0 24px', lineHeight: 1.6, position: 'relative' }}>You'll need to sign in again to access your account.</p>
            <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
                <button onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: '11px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter,sans-serif', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Stay</button>
                <button onClick={onConfirm} style={{ flex: 1, padding: '12px', borderRadius: '11px', border: 'none', background: 'linear-gradient(90deg, #be123c, #e11d48)', color: '#fff', fontFamily: 'Inter,sans-serif', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Sign Out</button>
            </div>
        </div>
        <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideUp{from{opacity:0;transform:translateY(20px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
);

/* ── Markdown renderer ───────────────────────────────── */
const Msg = ({ text }) => {
    const lines = text.split('\n');
    const out = [];
    lines.forEach((raw, i) => {
        const t = raw.trim();
        const numM = t.match(/^(\d+)\.\s+(.*)/);
        if (numM) {
            out.push(<div key={i} style={{ display: 'flex', gap: '7px', marginBottom: '5px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(167,139,250,0.8)', minWidth: '14px', paddingTop: '2px', flexShrink: 0 }}>{numM[1]}.</span>
                <span style={{ lineHeight: 1.55, fontSize: '0.82rem', color: '#fff', fontFamily: 'Inter,sans-serif' }}>{fmt(numM[2])}</span>
            </div>);
        } else if (t.startsWith('- ') || t.startsWith('• ')) {
            const c = t.replace(/^[-•]\s+/, '');
            out.push(<div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                <span style={{ color: 'rgba(167,139,250,0.7)', flexShrink: 0, paddingTop: '2px' }}>·</span>
                <span style={{ lineHeight: 1.55, fontSize: '0.82rem', color: '#fff', fontFamily: 'Inter,sans-serif' }}>{fmt(c)}</span>
            </div>);
        } else if (t === '') {
            if (i > 0 && i < lines.length - 1) out.push(<div key={i} style={{ height: '5px' }} />);
        } else {
            out.push(<p key={i} style={{ margin: '0 0 4px', lineHeight: 1.6, fontSize: '0.82rem', color: '#fff', fontFamily: 'Inter,sans-serif' }}>{fmt(t)}</p>);
        }
    });
    return <div>{out}</div>;
};

function fmt(text) {
    return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) return <strong key={i} style={{ color: '#d4b8ff', fontWeight: 700 }}>{p.slice(2, -2)}</strong>;
        if (p.startsWith('*') && p.endsWith('*')) return <em key={i} style={{ color: 'rgba(255,255,255,0.75)' }}>{p.slice(1, -1)}</em>;
        return p;
    });
}

const CHIPS = ['Check my balance', 'How to transfer?', 'Report lost card'];

/* ══════════════════════════════════════════════════════
   Dashboard Component
══════════════════════════════════════════════════════ */
const Dashboard = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'Agent';

    /* — account state — */
    const [balance, setBalance] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [balLoading, setBalLoading] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [markets, setMarkets] = useState([]);

    /* — KodBot state — */
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I\'m KodBot, powered by Qwen 2.5-7B. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [botLoading, setBotLoading] = useState(false);
    const msgsEndRef = useRef(null);

    /* Back-button guard */
    useEffect(() => {
        window.history.pushState({ g: true }, '');
        const h = () => { window.history.pushState({ g: true }, ''); setShowLogoutModal(true); };
        window.addEventListener('popstate', h);
        return () => window.removeEventListener('popstate', h);
    }, []);

    /* Load markets */
    useEffect(() => {
        Promise.all(MARKETS.map(async m => ({ id: m.id, label: m.label, ...(await m.fetch()) }))).then(setMarkets);
    }, []);

    /* Auto-scroll chat */
    useEffect(() => { msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, botLoading]);

    const checkBalance = async () => {
        setBalLoading(true);
        try {
            const res = await api.get('/user/balance');
            setBalance(res.data.balance);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 4000);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) navigate('/');
        } finally { setBalLoading(false); }
    };

    const confirmLogout = async () => {
        try { await api.post('/auth/logout'); } catch (_) { }
        localStorage.removeItem('username');
        navigate('/');
    };

    const buildHistory = (msgs) => {
        const h = [];
        for (let i = 0; i < msgs.length - 1; i++) {
            if (msgs[i].role === 'user' && msgs[i + 1]?.role === 'bot') h.push({ user: msgs[i].text, bot: msgs[i + 1].text });
        }
        return h;
    };

    const sendMessage = async (text) => {
        const trimmed = (text || input).trim();
        if (!trimmed || botLoading) return;
        const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updated = [...messages, { role: 'user', text: trimmed, ts }];
        setMessages(updated);
        setInput('');
        setBotLoading(true);
        try {
            const res = await api.post('/chat', { message: trimmed, history: buildHistory(updated) });
            const replyTs = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages(prev => [...prev, { role: 'bot', text: res.data.reply, ts: replyTs }]);
        } catch (err) {
            const msg = err.response?.data?.error || 'Something went wrong.';
            setMessages(prev => [...prev, { role: 'bot', text: msg, ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isError: true }]);
        } finally { setBotLoading(false); }
    };

    return (
        <>
            {showLogoutModal && <LogoutModal onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />}
            {showConfetti && <PartyPopper />}

            {/*
             ══ Page shell: flex row, full height, no outer scroll ══
             Main content scrolls independently. Sidebar sticks.
            */}
            <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'radial-gradient(ellipse at 30% 10%, #1a1040 0%, #0f0f14 50%, #0a0a18 100%)', fontFamily: 'Inter, sans-serif' }}>

                {/* ── MAIN CONTENT (left/center) ──────────────── */}
                <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', gap: '20px' }}>

                    {/* Market pills */}
                    {markets.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {markets.map(m => (
                                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', backdropFilter: 'blur(12px)' }}>
                                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)' }}>{m.label}</span>
                                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{m.price}</span>
                                    <span style={{ fontSize: '10px', fontWeight: 600, color: m.up ? '#4ade80' : '#f87171' }}>{m.change}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Account card */}
                    <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '24px', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8)', padding: '44px 40px', width: '100%', maxWidth: '400px', position: 'relative', overflow: 'hidden' }}>
                        {/* Top glow */}
                        <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', width: '240px', height: '110px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.65) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px', position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <KodBankLogo size={32} />
                                <div>
                                    <h1 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0, color: '#fff' }}>KODBANK</h1>
                                    <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.28)', marginTop: '2px' }}>{username}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowLogoutModal(true)}
                                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter,sans-serif', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '7px 13px', cursor: 'pointer', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(225,29,72,0.4)'; e.currentTarget.style.color = 'rgba(252,165,165,0.7)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
                            >Sign Out</button>
                        </div>

                        {/* Balance */}
                        <div style={{ textAlign: 'center', marginBottom: '36px', position: 'relative' }}>
                            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.28)', marginBottom: '14px' }}>Account Balance</p>
                            {balance !== null ? (
                                <div style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff' }}>
                                    ₹{parseFloat(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </div>
                            ) : (
                                <div style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.08)', userSelect: 'none' }}>
                                    ₹ ••••••
                                </div>
                            )}
                        </div>

                        <button onClick={checkBalance} disabled={balLoading}
                            style={{ display: 'block', width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(90deg, #7c3aed 0%, #e11d48 100%)', color: '#fff', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.83rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: balLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 20px rgba(124,58,237,0.4)', opacity: balLoading ? 0.6 : 1, transition: 'all 0.2s' }}
                            onMouseEnter={e => { if (!balLoading) e.currentTarget.style.boxShadow = '0 8px 30px rgba(124,58,237,0.6)'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.4)'; }}
                        >
                            {balLoading ? 'Retrieving…' : balance !== null ? 'Refresh Balance' : 'Check Balance'}
                        </button>
                    </div>
                </main>

                {/* ── RIGHT SIDEBAR ──────────────────────────── */}
                <aside style={{
                    width: '400px', flexShrink: 0, height: '100vh',
                    display: 'flex', flexDirection: 'column',
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
                    borderLeft: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '-20px 0 60px rgba(0,0,0,0.4)',
                    overflow: 'hidden',
                }}>

                    {/* ── Profile section ────────────────────── */}
                    <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            {/* Avatar */}
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 900, color: '#fff', flexShrink: 0, boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{username}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px rgba(34,197,94,0.8)', flexShrink: 0 }} />
                                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>KodBank Member · Active</span>
                                </div>
                            </div>
                            {/* Profile icon */}
                            <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                                <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* ── KodBot section ─────────────────────── */}
                    {/* Header */}
                    <div style={{ padding: '16px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, background: 'rgba(124,58,237,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(124,58,237,0.4)' }}>
                                    <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>KodBot</div>
                                    <div style={{ fontSize: '9px', color: 'rgba(167,139,250,0.6)', letterSpacing: '0.06em', marginTop: '1px' }}>Powered by Qwen 2.5 · 7B Instruct</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px rgba(34,197,94,0.7)' }} />
                                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.04em' }}>Online</span>
                            </div>
                        </div>
                    </div>

                    {/* Messages — flex:1 so it fills rest of sidebar height */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(124,58,237,0.3) transparent' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: '8px' }}>
                                {/* Avatar */}
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: msg.role === 'user' ? 'linear-gradient(135deg, rgba(124,58,237,0.55), rgba(225,29,72,0.5))' : 'linear-gradient(135deg, #7c3aed, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: '#fff', flexShrink: 0, marginTop: '2px', boxShadow: msg.role === 'bot' ? '0 2px 8px rgba(124,58,237,0.3)' : 'none' }}>
                                    {msg.role === 'user' ? username.charAt(0).toUpperCase() : 'K'}
                                </div>
                                <div style={{ maxWidth: '80%' }}>
                                    <div style={{
                                        padding: '10px 13px',
                                        borderRadius: msg.role === 'user' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                                        background: msg.role === 'user'
                                            ? 'linear-gradient(135deg, rgba(124,58,237,0.65), rgba(225,29,72,0.55))'
                                            : msg.isError ? 'rgba(225,29,72,0.09)' : 'rgba(255,255,255,0.06)',
                                        border: msg.role === 'bot' ? `1px solid ${msg.isError ? 'rgba(225,29,72,0.2)' : 'rgba(255,255,255,0.07)'}` : 'none',
                                        wordBreak: 'break-word',
                                    }}>
                                        {msg.role === 'bot'
                                            ? <Msg text={msg.text} />
                                            : <span style={{ fontSize: '0.82rem', color: '#fff', fontFamily: 'Inter,sans-serif', lineHeight: 1.55 }}>{msg.text}</span>
                                        }
                                    </div>
                                    {msg.ts && <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', marginTop: '3px', paddingLeft: '2px', fontFamily: 'Inter,sans-serif' }}>{msg.ts}</div>}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {botLoading && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>K</div>
                                <div style={{ padding: '11px 14px', borderRadius: '14px 4px 14px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                                    {[0, 1, 2].map(n => <span key={n} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(167,139,250,0.7)', display: 'inline-block', animation: `chatDot 1.2s ease-in-out ${n * 0.2}s infinite` }} />)}
                                </div>
                            </div>
                        )}
                        <div ref={msgsEndRef} />
                    </div>

                    {/* Quick chips — only first load */}
                    {messages.length === 1 && (
                        <div style={{ padding: '6px 16px 4px', display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
                            {CHIPS.map(c => (
                                <button key={c} onClick={() => sendMessage(c)}
                                    style={{ padding: '5px 11px', borderRadius: '999px', border: '1px solid rgba(124,58,237,0.32)', background: 'rgba(124,58,237,0.09)', color: 'rgba(190,170,255,0.85)', fontSize: '10px', cursor: 'pointer', fontFamily: 'Inter,sans-serif', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.22)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.09)'}
                                >{c}</button>
                            ))}
                        </div>
                    )}

                    {/* Input row */}
                    <div style={{ padding: '12px 14px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                        <input type="text" placeholder="Ask KodBot…" value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                            disabled={botLoading} autoComplete="off"
                            style={{ flex: 1, padding: '11px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontFamily: 'Inter,sans-serif', fontSize: '0.83rem', outline: 'none', transition: 'border-color 0.2s' }}
                            onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                        />
                        <button onClick={() => sendMessage()} disabled={botLoading || !input.trim()}
                            style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '11px', border: 'none', background: input.trim() && !botLoading ? 'linear-gradient(135deg, #7c3aed, #e11d48)' : 'rgba(255,255,255,0.05)', color: '#fff', cursor: input.trim() && !botLoading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: input.trim() && !botLoading ? '0 4px 12px rgba(124,58,237,0.45)' : 'none' }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                </aside>
            </div>

            {/* Responsive: hide sidebar on mobile */}
            <style>{`
                @keyframes chatDot { 0%,80%,100% { transform:scale(0.7); opacity:0.4; } 40% { transform:scale(1); opacity:1; } }
                @media (max-width: 860px) {
                    aside { display: none !important; }
                }
            `}</style>
        </>
    );
};

export default Dashboard;
