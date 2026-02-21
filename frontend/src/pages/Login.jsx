import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

/* ── Inline SVG Logo ─────────────────────────────────────── */
const KodBankLogo = ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="kbg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill="url(#kbg)" />
        <path d="M13 11v18M13 20l10-9M13 20l10 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* ── Subtle grid background ──────────────────────────────── */
const GridBg = () => (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
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

/* ── Abstract visual for left panel ──────────────────────── */
const AbstractVisual = () => (
    <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
        {/* Security ring */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Top stat row */}
            <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(124,58,237,0.1))', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" fill="none" stroke="rgba(167,139,250,0.9)" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>Secured</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#a78bfa' }}>256-bit TLS</div>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" fill="none" stroke="rgba(74,222,128,0.9)" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>Compliance</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#4ade80' }}>RBI Certified</div>
                </div>
            </div>

            {/* Activity meter */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>Transaction Activity</span>
                    <span style={{ fontSize: '10px', color: 'rgba(124,58,237,0.8)', fontWeight: 600 }}>Live</span>
                </div>
                {/* Animating bars */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '44px' }}>
                    {[40, 65, 30, 80, 55, 90, 45, 70, 35, 85, 60, 75, 50, 95, 40, 68].map((h, i) => (
                        <div key={i} style={{ flex: 1, borderRadius: '3px 3px 0 0', background: i >= 13 ? 'linear-gradient(to top, #7c3aed, #e11d48)' : 'rgba(255,255,255,0.08)', height: `${h}%`, animation: i >= 13 ? `barPulse ${0.8 + i * 0.1}s ease-in-out infinite alternate` : 'none' }} />
                    ))}
                </div>
            </div>

            {/* Fast transfer pill */}
            <div style={{ background: 'rgba(225,29,72,0.07)', border: '1px solid rgba(225,29,72,0.18)', borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(225,29,72,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" fill="none" stroke="rgba(252,165,165,0.9)" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Instant Transfers</div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>NEFT · IMPS · UPI — all supported</div>
                </div>
            </div>
        </div>
        <style>{`@keyframes barPulse { from { opacity:0.6 } to { opacity:1 } }`}</style>
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
        } finally { setLoading(false); }
    };

    const anim = (d = 0) => ({
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.55s ease ${d}ms, transform 0.55s ease ${d}ms`,
    });

    const focusIn = (e) => { e.target.style.borderColor = 'rgba(124,58,237,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; };
    const blurIn = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; };

    return (
        <div style={{ minHeight: '100vh', width: '100%', display: 'flex', background: 'radial-gradient(ellipse at 20% 50%, #1a1040 0%, #0f0f14 45%, #0a0a18 100%)', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden' }}>
            <GridBg />

            {/* Ambient orbs */}
            <div style={{ position: 'absolute', top: '-80px', left: '-60px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-60px', right: '300px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,29,72,0.12) 0%, transparent 65%)', filter: 'blur(55px)', pointerEvents: 'none' }} />

            {/* ── LEFT PANEL ─────────────────────────── */}
            <div className="login-left" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '44px 56px', position: 'relative', overflowY: 'auto' }}>

                {/* Logo header */}
                <div style={anim(0)}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <KodBankLogo size={34} />
                        <span style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>KODBANK</span>
                    </Link>
                </div>

                {/* Hero copy + abstract visual */}
                <div style={{ maxWidth: '480px', paddingTop: '40px', paddingBottom: '40px' }}>
                    <div style={anim(100)}>
                        <h1 style={{ fontSize: 'clamp(2rem, 3vw, 3rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.04em', color: '#fff', margin: '0 0 16px' }}>
                            Your money is<br />
                            <span style={{ background: 'linear-gradient(90deg, #a78bfa 0%, #e11d48 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>always secure.</span>
                        </h1>
                        <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.75, margin: '0 0 32px', maxWidth: '380px' }}>
                            Real-time transactions, instant balance access, and enterprise-grade security — all in one portal.
                        </p>
                    </div>

                    <div style={anim(200)}>
                        <AbstractVisual />
                    </div>
                </div>

                {/* Bottom compliance row */}
                <div style={{ ...anim(300), display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80' }} />
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>RBI Compliant</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(124,58,237,0.7)' }} />
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>NPCI Integrated</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(225,29,72,0.6)' }} />
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Zero Data Sharing</span>
                    </div>
                </div>
            </div>

            {/* Vertical divider */}
            <div className="login-divider" style={{ width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent)', flexShrink: 0 }} />

            {/* ── RIGHT PANEL — login form ─────────────── */}
            <div className="login-right" style={{ width: '460px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 48px' }}>
                <div style={{ width: '100%', maxWidth: '360px' }}>

                    <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '28px', boxShadow: '0 48px 100px -24px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.07)', padding: '44px 38px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '240px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.5) 0%, transparent 70%)', filter: 'blur(32px)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.8), transparent)', borderRadius: '999px' }} />

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
                            <div style={{ ...anim(200), marginBottom: '16px' }}>
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
                            <div style={{ ...anim(270), marginBottom: '28px' }}>
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

                        <div style={{ ...anim(400), display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>or</span>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                        </div>

                        <div style={{ ...anim(460), textAlign: 'center' }}>
                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.22)', marginBottom: '10px' }}>New to KodBank?</p>
                            <Link to="/register" style={{ display: 'inline-block', padding: '11px 28px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.03)', color: 'rgba(167,139,250,0.75)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
                                Open an Account
                            </Link>
                        </div>
                    </div>

                    <div style={{ ...anim(520), textAlign: 'center', marginTop: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(34,197,94,0.6)' }} />
                        <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>256-bit TLS · End-to-End Encrypted</span>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 860px) {
                    .login-left { display: none !important; }
                    .login-divider { display: none !important; }
                    .login-right { width: 100% !important; }
                }
            `}</style>
        </div>
    );
};

export default Login;
