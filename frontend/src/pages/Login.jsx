import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

/* SVG subtle dot-grid background */
const GridBg = () => (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.055, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="lgrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(167,139,250,1)" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="lfade" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="lgridmask"><rect width="100%" height="100%" fill="url(#lfade)" /></mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#lgrid)" mask="url(#lgridmask)" />
    </svg>
);

/* Abstract mini card mockup — purely CSS, no emojis */
const MiniDashboard = () => (
    <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px', backdropFilter: 'blur(12px)' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>KODBANK</span>
            <div style={{ display: 'flex', gap: '5px' }}>
                {['rgba(255,255,255,0.1)', 'rgba(124,58,237,0.4)', 'rgba(225,29,72,0.4)'].map((c, i) => (
                    <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: c }} />
                ))}
            </div>
        </div>

        {/* Balance card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.35) 0%, rgba(225,29,72,0.25) 100%)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '12px', padding: '16px 18px', marginBottom: '14px' }}>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' }}>Total Balance</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff' }}>₹2,45,800<span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>.00</span></div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                <div style={{ fontSize: '9px', color: 'rgba(34,197,94,0.8)', letterSpacing: '0.08em' }}>▲ 4.2% this month</div>
            </div>
        </div>

        {/* Mini chart bars */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '40px', marginBottom: '14px' }}>
            {[55, 38, 70, 45, 82, 60, 90, 50, 75, 88, 62, 78].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px 3px 0 0', background: i === 10 ? 'linear-gradient(to top, #7c3aed, #e11d48)' : 'rgba(255,255,255,0.08)', transition: 'height 0.3s' }} />
            ))}
        </div>

        {/* Transaction rows */}
        {[
            { label: 'NEFT Transfer', amount: '-₹12,500', color: '#fca5a5' },
            { label: 'Salary Credit', amount: '+₹85,000', color: '#6ee7b7' },
        ].map(t => (
            <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }} />
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.03em' }}>{t.label}</span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: t.color }}>{t.amount}</span>
            </div>
        ))}
    </div>
);

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('username')) navigate('/dashboard', { replace: true });
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, [navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('username', res.data.username);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const anim = (delay = 0) => ({
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
    });

    const focusIn = (e) => { e.target.style.borderColor = 'rgba(124,58,237,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; };
    const blurIn = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; };

    return (
        <div style={{
            minHeight: '100vh', width: '100%', display: 'flex',
            background: 'radial-gradient(ellipse at 20% 50%, #1a1040 0%, #0f0f14 45%, #0a0a18 100%)',
            fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden',
        }}>
            <GridBg />

            {/* Ambient orbs */}
            <div style={{ position: 'absolute', top: '-80px', left: '-60px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-60px', right: '300px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,29,72,0.15) 0%, transparent 65%)', filter: 'blur(55px)', pointerEvents: 'none' }} />

            {/* ── LEFT PANEL ─────────────────────────── */}
            <div className="login-left" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '52px 60px', position: 'relative' }}>
                {/* Logo */}
                <div style={anim(0)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'linear-gradient(135deg, #7c3aed, #e11d48)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                                <rect x="2" y="7" width="20" height="14" rx="2" />
                                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                            </svg>
                        </div>
                        <span style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>KODBANK</span>
                    </div>
                </div>

                {/* Hero */}
                <div style={{ maxWidth: '500px' }}>
                    <div style={{ ...anim(100), marginBottom: '32px' }}>
                        <h1 style={{ fontSize: 'clamp(2.4rem, 3.5vw, 3.4rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.04em', color: '#fff', margin: '0 0 20px' }}>
                            Your money is<br />
                            <span style={{ background: 'linear-gradient(90deg, #a78bfa 0%, #e11d48 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                always secure.
                            </span>
                        </h1>
                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, margin: 0, maxWidth: '380px' }}>
                            Real-time transactions, instant balance access, and enterprise-grade security — all in one portal.
                        </p>
                    </div>

                    {/* Mini dashboard preview */}
                    <div style={anim(220)}>
                        <MiniDashboard />
                    </div>
                </div>

                {/* Bottom */}
                <div style={{ ...anim(340), display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.06)' }} />
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Trusted by 50,000+ customers</span>
                    <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.06)' }} />
                </div>
            </div>

            {/* Vertical divider */}
            <div className="login-divider" style={{ width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent)', flexShrink: 0 }} />

            {/* ── RIGHT PANEL — login form ─────────────── */}
            <div className="login-right" style={{ width: '460px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 52px' }}>
                <div style={{ width: '100%', maxWidth: '360px' }}>

                    {/* Glass card */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '28px', boxShadow: '0 48px 100px -24px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.07)', padding: '44px 38px', position: 'relative', overflow: 'hidden' }}>

                        {/* Card top glow */}
                        <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '240px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.6) 0%, transparent 70%)', filter: 'blur(32px)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.8), transparent)', borderRadius: '999px' }} />

                        {/* Heading */}
                        <div style={{ ...anim(120), marginBottom: '32px', position: 'relative' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#fff', margin: '0 0 6px' }}>Welcome back</h2>
                            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em', margin: 0 }}>Sign in to your KodBank account</p>
                        </div>

                        {error && (
                            <div style={{ background: 'rgba(225,29,72,0.08)', border: '1px solid rgba(225,29,72,0.25)', borderRadius: '12px', color: '#fca5a5', fontSize: '0.78rem', padding: '11px 14px', marginBottom: '20px', letterSpacing: '0.02em' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* User ID */}
                            <div style={{ ...anim(200), marginBottom: '16px', position: 'relative' }}>
                                <label style={{ display: 'block', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.28)', marginBottom: '8px' }}>User ID</label>
                                <div style={{ position: 'relative' }}>
                                    <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'rgba(255,255,255,0.22)', pointerEvents: 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <input type="text" name="username" placeholder="Enter your User ID" value={formData.username} onChange={handleChange} required
                                        style={{ width: '100%', padding: '13px 16px 13px 40px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontFamily: 'Inter,sans-serif', fontSize: '0.83rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                                        onFocus={focusIn} onBlur={blurIn}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div style={{ ...anim(270), marginBottom: '28px', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <label style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.28)' }}>Password</label>
                                    <span style={{ fontSize: '10px', color: 'rgba(167,139,250,0.6)', cursor: 'pointer', letterSpacing: '0.04em' }}>Forgot?</span>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'rgba(255,255,255,0.22)', pointerEvents: 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <input type={showPass ? 'text' : 'password'} name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required
                                        style={{ width: '100%', padding: '13px 40px 13px 40px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontFamily: 'Inter,sans-serif', fontSize: '0.83rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                                        onFocus={focusIn} onBlur={blurIn}
                                    />
                                    <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {showPass
                                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                                            }
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <div style={anim(340)}>
                                <button type="submit" disabled={loading}
                                    style={{ display: 'block', width: '100%', padding: '15px', borderRadius: '12px', border: 'none', background: 'linear-gradient(90deg, #7c3aed 0%, #e11d48 100%)', color: '#fff', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.83rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 6px 28px rgba(124,58,237,0.4)', opacity: loading ? 0.65 : 1, transition: 'all 0.2s' }}
                                    onMouseEnter={e => { if (!loading) { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 10px 36px rgba(124,58,237,0.55)'; } }}
                                    onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 6px 28px rgba(124,58,237,0.4)'; }}
                                >
                                    {loading ? 'Authenticating…' : 'Access Account →'}
                                </button>
                            </div>
                        </form>

                        {/* OR divider */}
                        <div style={{ ...anim(400), display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>or</span>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                        </div>

                        {/* Register */}
                        <div style={{ ...anim(460), textAlign: 'center' }}>
                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.22)', marginBottom: '10px' }}>New to KodBank?</p>
                            <Link to="/register" style={{ display: 'inline-block', padding: '11px 28px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.03)', color: 'rgba(167,139,250,0.75)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
                                Open an Account
                            </Link>
                        </div>
                    </div>

                    {/* SSL note */}
                    <div style={{ ...anim(520), textAlign: 'center', marginTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(34,197,94,0.6)' }} />
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>256-bit TLS Encryption</span>
                    </div>
                </div>
            </div>

            {/* Responsive */}
            <style>{`
                @media (max-width: 820px) {
                    .login-left { display: none !important; }
                    .login-divider { display: none !important; }
                    .login-right { width: 100% !important; padding: 24px !important; }
                }
            `}</style>
        </div>
    );
};

export default Login;
