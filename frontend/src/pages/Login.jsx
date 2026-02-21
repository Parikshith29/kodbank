import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

/* Animated grid lines background */
const GridBg = () => (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(167,139,250,1)" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="fade" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="gridmask">
                <rect width="100%" height="100%" fill="url(#fade)" />
            </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridmask)" />
    </svg>
);

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Auth guard — already logged in? Go to dashboard
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
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
    });

    return (
        <div style={{
            minHeight: '100vh', width: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'radial-gradient(ellipse at 30% 10%, #1a1040 0%, #0f0f14 50%, #0a0a18 100%)',
            padding: '24px', position: 'relative', overflow: 'hidden', fontFamily: 'Inter,sans-serif',
        }}>
            <GridBg />

            {/* Ambient glow orbs */}
            <div style={{ position: 'absolute', top: '10%', left: '15%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '5%', right: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,29,72,0.13) 0%, transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

            {/* Glass card */}
            <div style={{
                position: 'relative', width: '100%', maxWidth: '400px',
                background: 'rgba(255,255,255,0.055)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '28px',
                boxShadow: '0 48px 100px -24px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.08)',
                padding: '48px 40px', overflow: 'hidden',
            }}>
                {/* Top card glow */}
                <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '280px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.65) 0%, rgba(79,70,229,0.3) 50%, transparent 80%)', filter: 'blur(36px)', pointerEvents: 'none' }} />

                {/* Thin accent line at top */}
                <div style={{ ...anim(0), position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60px', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.8), transparent)', borderRadius: '999px' }} />

                {/* Wordmark */}
                <div style={{ ...anim(80), textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
                    <h1 style={{ fontSize: '2.6rem', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 8px', background: 'linear-gradient(135deg, #fff 60%, rgba(167,139,250,0.9))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        KODBANK
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)', maxWidth: '60px' }} />
                        <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.25)', margin: 0 }}>Secure Access Portal</p>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)', maxWidth: '60px' }} />
                    </div>
                </div>

                {error && (
                    <div style={{ ...anim(0), background: 'rgba(225,29,72,0.08)', border: '1px solid rgba(225,29,72,0.25)', borderRadius: '12px', color: '#fca5a5', fontSize: '0.78rem', padding: '11px 14px', marginBottom: '20px', letterSpacing: '0.02em' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div style={{ ...anim(160), marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.28)', marginBottom: '8px' }}>User Identity</label>
                        <div style={{ position: 'relative' }}>
                            <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgba(255,255,255,0.22)', pointerEvents: 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <input type="text" name="username" placeholder="Enter your ID" value={formData.username} onChange={handleChange} required
                                style={{ width: '100%', padding: '13px 16px 13px 42px', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontFamily: 'Inter,sans-serif', fontSize: '0.83rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ ...anim(240), marginBottom: '28px' }}>
                        <label style={{ display: 'block', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.28)', marginBottom: '8px' }}>Security Key</label>
                        <div style={{ position: 'relative' }}>
                            <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgba(255,255,255,0.22)', pointerEvents: 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <input type={showPass ? 'text' : 'password'} name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required
                                style={{ width: '100%', padding: '13px 42px 13px 42px', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', fontFamily: 'Inter,sans-serif', fontSize: '0.83rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                onFocus={e => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                            />
                            <button type="button" onClick={() => setShowPass(p => !p)}
                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
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
                    <div style={anim(320)}>
                        <button type="submit" disabled={loading} style={{
                            display: 'block', width: '100%', padding: '15px 24px', borderRadius: '12px', border: 'none',
                            background: 'linear-gradient(90deg, #7c3aed 0%, #e11d48 100%)',
                            color: '#fff', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.83rem',
                            letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
                            boxShadow: '0 6px 28px rgba(124,58,237,0.4)', opacity: loading ? 0.65 : 1,
                            transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s',
                        }}
                            onMouseEnter={e => { if (!loading) { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 10px 36px rgba(124,58,237,0.55)'; } }}
                            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 6px 28px rgba(124,58,237,0.4)'; }}
                        >
                            {loading ? 'Authenticating...' : 'Access Account →'}
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <div style={{ ...anim(400), textAlign: 'center', marginTop: '32px' }}>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginBottom: '10px', letterSpacing: '0.05em' }}>
                        New to KodBank?
                    </p>
                    <Link to="/register" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(167,139,250,0.7)', textDecoration: 'none' }}>
                        Open an Account
                    </Link>
                </div>

                {/* SSL note */}
                <div style={{ ...anim(480), textAlign: 'center', marginTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(34,197,94,0.6)' }} />
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>256-bit TLS Encryption</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
