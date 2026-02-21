import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', width: '100%', display: 'flex',
            background: 'radial-gradient(ellipse at 20% 50%, #1a1040 0%, #0f0f14 45%, #0a0a18 100%)',
            fontFamily: 'Inter, sans-serif',
        }}>
            {/* ── Left Panel ─────────────────────────── */}
            <div style={{
                flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                padding: '48px 56px', position: 'relative', overflow: 'hidden',
            }} className="login-left-panel">

                {/* Background orbs */}
                <div style={{
                    position: 'absolute', top: '-80px', left: '-80px', width: '400px', height: '400px',
                    borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)',
                    filter: 'blur(60px)', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-60px', right: '60px', width: '300px', height: '300px',
                    borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,29,72,0.2) 0%, transparent 70%)',
                    filter: 'blur(60px)', pointerEvents: 'none',
                }} />

                {/* Logo */}
                <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #7c3aed, #e11d48)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                            </svg>
                        </div>
                        <span style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>KODBANK</span>
                    </div>
                </div>

                {/* Main hero text */}
                <div style={{ position: 'relative', maxWidth: '480px' }}>
                    <div style={{
                        display: 'inline-block', padding: '5px 14px', borderRadius: '999px',
                        background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
                        fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
                        color: 'rgba(167,139,250,1)', marginBottom: '24px',
                    }}>
                        🔒 256-bit Encrypted · RBI Compliant
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 900,
                        lineHeight: 1.1, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 20px',
                    }}>
                        Your finances,<br />
                        <span style={{ background: 'linear-gradient(90deg, #a78bfa, #e11d48)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            secured & smart.
                        </span>
                    </h1>
                    <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: '0 0 48px' }}>
                        Access your KodBank account with enterprise-grade security. Real-time insights, instant transfers, and complete peace of mind.
                    </p>

                    {/* Feature pills */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { icon: '⚡', title: 'Instant Transfers', desc: 'NEFT, RTGS & IMPS — zero delays' },
                            { icon: '🛡️', title: 'Fraud Protection', desc: 'AI-powered 24/7 threat monitoring' },
                            { icon: '📊', title: 'Smart Analytics', desc: 'Spend insights & budget tracking' },
                        ].map((f) => (
                            <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                                }}>
                                    {f.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{f.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom trust badges */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                    {['ISO 27001 Certified', 'RBI Regulated', 'FDIC Insured'].map(b => (
                        <div key={b} style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em',
                        }}>
                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
                            {b}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Divider ─────────────────────────────── */}
            <div style={{
                width: '1px', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent)',
                flexShrink: 0,
            }} className="login-divider" />

            {/* ── Right Panel — Login Form ─────────────── */}
            <div style={{
                width: '480px', flexShrink: 0, display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: '48px 56px',
            }} className="login-right-panel">
                <div style={{ width: '100%', maxWidth: '360px' }}>

                    {/* Card */}
                    <div style={{
                        background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(28px)',
                        WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '24px', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.04)',
                        padding: '40px 36px', position: 'relative', overflow: 'hidden',
                    }}>
                        {/* Top glow */}
                        <div style={{
                            position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
                            width: '200px', height: '100px', borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(124,58,237,0.6) 0%, transparent 70%)',
                            filter: 'blur(30px)', pointerEvents: 'none',
                        }} />

                        <div style={{ position: 'relative' }}>
                            {/* Header */}
                            <div style={{ marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 6px', color: '#fff' }}>
                                    Welcome back
                                </h2>
                                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                                    Sign in to your KodBank account
                                </p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div style={{
                                    background: 'rgba(225,29,72,0.08)', border: '1px solid rgba(225,29,72,0.28)',
                                    borderRadius: '10px', color: '#fca5a5', fontSize: '0.8rem',
                                    padding: '11px 14px', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'flex-start',
                                }}>
                                    <span>⚠️</span>{error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Username */}
                                <div style={{ marginBottom: '18px' }}>
                                    <label style={{
                                        display: 'block', fontSize: '10px', textTransform: 'uppercase',
                                        letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)', marginBottom: '8px',
                                    }}>User ID</label>
                                    <div style={{ position: 'relative' }}>
                                        <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', width: '16px', height: '16px', pointerEvents: 'none' }}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <input
                                            type="text" name="username" placeholder="Enter your User ID"
                                            value={formData.username} onChange={handleChange} required
                                            style={{
                                                width: '100%', padding: '13px 16px 13px 42px',
                                                background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)',
                                                borderRadius: '12px', color: '#fff', fontFamily: 'Inter,sans-serif',
                                                fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <label style={{
                                            fontSize: '10px', textTransform: 'uppercase',
                                            letterSpacing: '0.25em', color: 'rgba(255,255,255,0.35)',
                                        }}>Password</label>
                                        <span style={{ fontSize: '11px', color: 'rgba(167,139,250,0.7)', cursor: 'pointer', letterSpacing: '0.05em' }}>
                                            Forgot password?
                                        </span>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', width: '16px', height: '16px', pointerEvents: 'none' }}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <input
                                            type={showPass ? 'text' : 'password'} name="password"
                                            placeholder="Enter your password"
                                            value={formData.password} onChange={handleChange} required
                                            style={{
                                                width: '100%', padding: '13px 44px 13px 42px',
                                                background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)',
                                                borderRadius: '12px', color: '#fff', fontFamily: 'Inter,sans-serif',
                                                fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
                                            }}
                                        />
                                        <button type="button" onClick={() => setShowPass(!showPass)}
                                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', padding: '4px' }}>
                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                {showPass
                                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                                                }
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button type="submit" disabled={loading} style={{
                                    display: 'block', width: '100%', padding: '15px 24px', marginTop: '24px',
                                    borderRadius: '12px', border: 'none',
                                    background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(90deg, #7c3aed 0%, #e11d48 100%)',
                                    color: '#fff', fontFamily: 'Inter,sans-serif', fontWeight: 700,
                                    fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    boxShadow: loading ? 'none' : '0 4px 24px rgba(124,58,237,0.45)',
                                    transition: 'all 0.2s ease',
                                }}>
                                    {loading ? (
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                                                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" />
                                                <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
                                            </svg>
                                            Authenticating...
                                        </span>
                                    ) : 'Sign In →'}
                                </button>
                            </form>

                            {/* Divider */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
                                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>or</span>
                                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
                            </div>

                            {/* Register link */}
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>
                                    Don't have an account?
                                </p>
                                <Link to="/register" style={{
                                    display: 'inline-block', padding: '11px 28px', borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
                                    fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em',
                                    textTransform: 'uppercase', textDecoration: 'none',
                                    background: 'rgba(255,255,255,0.04)',
                                    transition: 'background 0.2s',
                                }}>
                                    Open an Account
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Security note */}
                    <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <svg width="12" height="12" fill="none" stroke="rgba(255,255,255,0.25)" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
                            Secured with 256-bit SSL encryption
                        </span>
                    </div>
                </div>
            </div>

            {/* Responsive styles */}
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    .login-left-panel { display: none !important; }
                    .login-divider { display: none !important; }
                    .login-right-panel { width: 100% !important; padding: 24px !important; }
                }
            `}</style>
        </div>
    );
};

export default Login;
