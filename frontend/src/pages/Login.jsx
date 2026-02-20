import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const pageStyle = {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at 30% 10%, #1a1040 0%, #0f0f14 50%, #0a0a18 100%)',
    padding: '24px',
};

const cardStyle = {
    background: 'rgba(255,255,255,0.07)',
    backdropFilter: 'blur(28px)',
    WebkitBackdropFilter: 'blur(28px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '24px',
    boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '420px',
    position: 'relative',
    overflow: 'hidden',
};

const glowStyle = {
    position: 'absolute',
    top: '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '260px',
    height: '120px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.7) 0%, rgba(79,70,229,0.4) 50%, transparent 80%)',
    filter: 'blur(30px)',
    pointerEvents: 'none',
};

const inputWrapStyle = { position: 'relative', marginBottom: '20px' };
const iconStyle = {
    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
    color: 'rgba(255,255,255,0.25)', width: '18px', height: '18px', pointerEvents: 'none',
};
const inputStyle = {
    width: '100%', padding: '14px 16px 14px 46px',
    background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px', color: '#fff', fontFamily: 'Inter,sans-serif',
    fontSize: '0.82rem', letterSpacing: '0.06em', outline: 'none',
};
const labelStyle = {
    display: 'block', fontSize: '10px', textTransform: 'uppercase',
    letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)', marginBottom: '8px',
};
const btnStyle = {
    display: 'block', width: '100%', padding: '15px 24px', borderRadius: '12px',
    border: 'none', background: 'linear-gradient(90deg, #e11d48 0%, #db2777 55%, #c026d3 100%)',
    color: '#fff', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.85rem',
    letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(225,29,72,0.4)', marginTop: '8px',
};

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
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <div style={glowStyle} />

                <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 6px' }}>KODBANK</h1>
                    <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.3)' }}>
                        Secure Client Login
                    </p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(225,29,72,0.08)', border: '1px solid rgba(225,29,72,0.3)', borderRadius: '10px', color: '#fca5a5', fontSize: '0.8rem', padding: '11px 14px', marginBottom: '20px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={inputWrapStyle}>
                        <label style={labelStyle}>User Identity</label>
                        <div style={{ position: 'relative' }}>
                            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <input type="text" name="username" placeholder="Enter User ID" value={formData.username} onChange={handleChange} style={inputStyle} required />
                        </div>
                    </div>

                    <div style={{ ...inputWrapStyle, marginBottom: '28px' }}>
                        <label style={labelStyle}>Security Key</label>
                        <div style={{ position: 'relative' }}>
                            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <input type={showPass ? 'text' : 'password'} name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} style={{ ...inputStyle, paddingRight: '48px' }} required />
                            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', padding: 0 }}>
                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {showPass
                                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                                    }
                                </svg>
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.6 : 1 }}>
                        {loading ? 'Authenticating...' : 'AUTHENTICATE →'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '36px' }}>
                    <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.22)', marginBottom: '8px' }}>New to the system?</p>
                    <Link to="/register" style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#22d3ee', textDecoration: 'none' }}>
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
