import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const pageStyle = {
    minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at 30% 10%, #1a1040 0%, #0f0f14 50%, #0a0a18 100%)',
    padding: '24px',
};
const cardStyle = {
    background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(28px)',
    WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '24px', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8)',
    padding: '48px 40px', width: '100%', maxWidth: '420px',
    position: 'relative', overflow: 'hidden',
};
const glowStyle = {
    position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
    width: '260px', height: '120px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.7) 0%, rgba(79,70,229,0.4) 50%, transparent 80%)',
    filter: 'blur(30px)', pointerEvents: 'none',
};
const inputStyle = {
    width: '100%', padding: '14px 46px 14px 46px',
    background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px', color: '#fff', fontFamily: 'Inter,sans-serif',
    fontSize: '0.82rem', letterSpacing: '0.06em', outline: 'none',
};
const labelStyle = {
    display: 'block', fontSize: '10px', textTransform: 'uppercase',
    letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)', marginBottom: '8px',
};
const iconStyle = {
    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
    color: 'rgba(255,255,255,0.25)', width: '18px', height: '18px', pointerEvents: 'none',
};
const toggleBtnStyle = {
    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
    cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center',
};
const btnStyle = {
    display: 'block', width: '100%', padding: '15px 24px', borderRadius: '12px',
    border: 'none', background: 'linear-gradient(90deg, #e11d48 0%, #db2777 55%, #c026d3 100%)',
    color: '#fff', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.85rem',
    letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(225,29,72,0.4)', marginTop: '8px',
};

// Eye icons
const EyeOpen = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const EyeOff = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', phone: '' });
    const [show, setShow] = useState({ password: false, confirmPassword: false });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const toggleShow = (field) => setShow(prev => ({ ...prev, [field]: !prev[field] }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const { confirmPassword, ...payload } = formData;
            await api.post('/auth/register', payload);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    // Lock icon path
    const lockPath = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />;

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <div style={glowStyle} />
                <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative' }}>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 6px' }}>KODBANK</h1>
                    <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.3)' }}>Open a New Account</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(225,29,72,0.08)', border: '1px solid rgba(225,29,72,0.3)', borderRadius: '10px', color: '#fca5a5', fontSize: '0.8rem', padding: '11px 14px', marginBottom: '18px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <input type="text" name="username" placeholder="Enter Username" value={formData.username} onChange={handleChange} style={{ ...inputStyle, padding: '14px 16px 14px 46px' }} required />
                        </div>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <input type="email" name="email" placeholder="Enter Email" value={formData.email} onChange={handleChange} style={{ ...inputStyle, padding: '14px 16px 14px 46px' }} required />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">{lockPath}</svg>
                            <input type={show.password ? 'text' : 'password'} name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} style={inputStyle} required />
                            <button type="button" onClick={() => toggleShow('password')} style={toggleBtnStyle}>
                                {show.password ? <EyeOff /> : <EyeOpen />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">{lockPath}</svg>
                            <input
                                type={show.confirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Re-enter Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                style={{
                                    ...inputStyle,
                                    borderColor: formData.confirmPassword
                                        ? formData.confirmPassword === formData.password
                                            ? 'rgba(16,185,129,0.5)'
                                            : 'rgba(225,29,72,0.5)'
                                        : 'rgba(255,255,255,0.08)',
                                }}
                                required
                            />
                            <button type="button" onClick={() => toggleShow('confirmPassword')} style={toggleBtnStyle}>
                                {show.confirmPassword ? <EyeOff /> : <EyeOpen />}
                            </button>
                        </div>
                        {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                            <p style={{ fontSize: '10px', color: '#fca5a5', marginTop: '5px', letterSpacing: '0.05em' }}>Passwords do not match</p>
                        )}
                        {formData.confirmPassword && formData.confirmPassword === formData.password && (
                            <p style={{ fontSize: '10px', color: '#6ee7b7', marginTop: '5px', letterSpacing: '0.05em' }}>✓ Passwords match</p>
                        )}
                    </div>

                    {/* Phone (optional) */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Phone <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '9px' }}>(optional)</span></label>
                        <div style={{ position: 'relative' }}>
                            <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <input type="tel" name="phone" placeholder="Enter Phone" value={formData.phone} onChange={handleChange} style={{ ...inputStyle, padding: '14px 16px 14px 46px' }} />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.6 : 1 }}>
                        {loading ? 'Creating...' : 'INITIALIZE ACCOUNT →'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '28px' }}>
                    <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.22)', marginBottom: '8px' }}>Already registered?</p>
                    <Link to="/login" style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#22d3ee', textDecoration: 'none' }}>
                        Authenticate
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
