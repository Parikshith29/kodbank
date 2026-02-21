import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

/* Password strength */
const getStrength = (pw) => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
};
const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];

const EyeOpen = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const EyeOff = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

/* Shared input style */
const inp = (extra = {}) => ({
    width: '100%', padding: '13px 16px 13px 42px',
    background: 'rgba(0,0,0,0.38)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px', color: '#fff', fontFamily: 'Inter,sans-serif',
    fontSize: '0.83rem', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s', ...extra,
});
const iconSt = {
    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
    width: '16px', height: '16px', color: 'rgba(255,255,255,0.22)', pointerEvents: 'none',
};
const labelSt = {
    display: 'block', fontSize: '9px', textTransform: 'uppercase',
    letterSpacing: '0.3em', color: 'rgba(255,255,255,0.28)', marginBottom: '8px',
};
const focusIn = (e) => { e.target.style.borderColor = 'rgba(124,58,237,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; };
const blurIn = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; };

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', phone: '' });
    const [show, setShow] = useState({ password: false, confirmPassword: false });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [slideDir, setSlideDir] = useState('right'); // 'right' = forward, 'left' = back

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const toggleShow = (field) => setShow(prev => ({ ...prev, [field]: !prev[field] }));

    const goNext = (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email) { setError('Please fill in all fields.'); return; }
        setError('');
        setSlideDir('right');
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }
        if (getStrength(formData.password) < 2) { setError('Password is too weak. Add uppercase, numbers or symbols.'); return; }
        setLoading(true); setError('');
        try {
            const { confirmPassword, ...payload } = formData;
            await api.post('/auth/register', payload);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally { setLoading(false); }
    };

    const anim = (delay = 0) => ({
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
    });

    const strength = getStrength(formData.password);

    return (
        <div style={{
            minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'radial-gradient(ellipse at 70% 90%, #1a1040 0%, #0f0f14 45%, #0a0a18 100%)',
            padding: '24px', position: 'relative', overflow: 'hidden', fontFamily: 'Inter,sans-serif',
        }}>
            {/* Ambient orbs */}
            <div style={{ position: 'absolute', bottom: '10%', left: '12%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,29,72,0.15) 0%, transparent 65%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '8%', right: '10%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 65%)', filter: 'blur(45px)', pointerEvents: 'none' }} />

            {/* Card */}
            <div style={{
                position: 'relative', width: '100%', maxWidth: '420px',
                background: 'rgba(255,255,255,0.055)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '28px',
                boxShadow: '0 48px 100px -24px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.07)',
                padding: '44px 40px', overflow: 'hidden',
            }}>
                {/* Top glow */}
                <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,29,72,0.5) 0%, rgba(124,58,237,0.3) 50%, transparent 80%)', filter: 'blur(38px)', pointerEvents: 'none' }} />

                {/* Wordmark */}
                <div style={{ ...anim(60), textAlign: 'center', marginBottom: '32px', position: 'relative' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 6px', background: 'linear-gradient(135deg, #fff 60%, rgba(167,139,250,0.85))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        KODBANK
                    </h1>
                    <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.38em', color: 'rgba(255,255,255,0.22)', margin: 0 }}>Create Your Account</p>
                </div>

                {/* Step progress bar */}
                <div style={{ ...anim(120), marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        {['Identity', 'Security'].map((label, i) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '26px', height: '26px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '11px', fontWeight: 700, transition: 'all 0.4s ease',
                                    background: step > i ? 'linear-gradient(135deg, #7c3aed, #e11d48)' : step === i + 1 ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)',
                                    border: step === i + 1 ? '1px solid rgba(124,58,237,0.6)' : '1px solid transparent',
                                    color: step > i || step === i + 1 ? '#fff' : 'rgba(255,255,255,0.3)',
                                    boxShadow: step > i ? '0 0 12px rgba(124,58,237,0.5)' : 'none',
                                }}>
                                    {step > i + 1 ? '✓' : i + 1}
                                </div>
                                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: step === i + 1 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)', transition: 'color 0.3s' }}>{label}</span>
                            </div>
                        ))}
                    </div>
                    {/* Progress track */}
                    <div style={{ height: '2px', background: 'rgba(255,255,255,0.07)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: step === 1 ? '50%' : '100%', background: 'linear-gradient(90deg, #7c3aed, #e11d48)', borderRadius: '999px', transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)' }} />
                    </div>
                </div>

                {error && (
                    <div style={{ background: 'rgba(225,29,72,0.08)', border: '1px solid rgba(225,29,72,0.25)', borderRadius: '12px', color: '#fca5a5', fontSize: '0.78rem', padding: '11px 14px', marginBottom: '18px', letterSpacing: '0.02em' }}>
                        {error}
                    </div>
                )}

                {/* Step 1 */}
                {step === 1 && (
                    <form onSubmit={goNext} key="step1">
                        <div style={{ ...anim(160), marginBottom: '16px' }}>
                            <label style={labelSt}>Username</label>
                            <div style={{ position: 'relative' }}>
                                <svg style={iconSt} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                <input type="text" name="username" placeholder="Choose a username" value={formData.username} onChange={handleChange} required style={inp()} onFocus={focusIn} onBlur={blurIn} />
                            </div>
                        </div>
                        <div style={{ ...anim(240), marginBottom: '28px' }}>
                            <label style={labelSt}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <svg style={iconSt} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required style={inp()} onFocus={focusIn} onBlur={blurIn} />
                            </div>
                        </div>
                        <div style={anim(320)}>
                            <button type="submit" style={{ display: 'block', width: '100%', padding: '15px', borderRadius: '12px', border: 'none', background: 'linear-gradient(90deg, #7c3aed 0%, #e11d48 100%)', color: '#fff', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.83rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 6px 28px rgba(124,58,237,0.4)' }}>
                                Continue →
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <form onSubmit={handleSubmit} key="step2">
                        <div style={{ ...anim(100), marginBottom: '16px' }}>
                            <label style={labelSt}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <svg style={iconSt} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                <input type={show.password ? 'text' : 'password'} name="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} required style={inp({ paddingRight: '42px' })} onFocus={focusIn} onBlur={blurIn} />
                                <button type="button" onClick={() => toggleShow('password')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                                    {show.password ? <EyeOff /> : <EyeOpen />}
                                </button>
                            </div>
                            {/* Strength meter */}
                            {formData.password && (
                                <div style={{ marginTop: '8px' }}>
                                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} style={{ flex: 1, height: '3px', borderRadius: '999px', background: i <= strength ? strengthColor[strength] : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: '9px', color: strengthColor[strength], letterSpacing: '0.1em', textTransform: 'uppercase' }}>{strengthLabel[strength]}</span>
                                </div>
                            )}
                        </div>

                        <div style={{ ...anim(160), marginBottom: '16px' }}>
                            <label style={labelSt}>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <svg style={iconSt} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                <input type={show.confirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Repeat your password" value={formData.confirmPassword} onChange={handleChange} required
                                    style={inp({ paddingRight: '42px', borderColor: formData.confirmPassword ? (formData.confirmPassword === formData.password ? 'rgba(34,197,94,0.45)' : 'rgba(225,29,72,0.45)') : 'rgba(255,255,255,0.08)' })}
                                    onFocus={focusIn} onBlur={e => { e.target.style.boxShadow = 'none'; }}
                                />
                                <button type="button" onClick={() => toggleShow('confirmPassword')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                                    {show.confirmPassword ? <EyeOff /> : <EyeOpen />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                                <p style={{ fontSize: '9px', color: '#fca5a5', marginTop: '5px', letterSpacing: '0.08em' }}>Passwords do not match</p>
                            )}
                            {formData.confirmPassword && formData.confirmPassword === formData.password && (
                                <p style={{ fontSize: '9px', color: '#6ee7b7', marginTop: '5px', letterSpacing: '0.08em' }}>✓ Passwords match</p>
                            )}
                        </div>

                        <div style={{ ...anim(220), marginBottom: '28px' }}>
                            <label style={labelSt}>Phone <span style={{ color: 'rgba(255,255,255,0.18)' }}>(optional)</span></label>
                            <div style={{ position: 'relative' }}>
                                <svg style={iconSt} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                <input type="tel" name="phone" placeholder="Enter phone number" value={formData.phone} onChange={handleChange} style={inp()} onFocus={focusIn} onBlur={blurIn} />
                            </div>
                        </div>

                        <div style={{ ...anim(300), display: 'flex', gap: '10px' }}>
                            <button type="button" onClick={() => { setError(''); setStep(1); }}
                                style={{ flex: '0 0 auto', padding: '15px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter,sans-serif', fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '0.05em' }}>
                                ← Back
                            </button>
                            <button type="submit" disabled={loading}
                                style={{ flex: 1, padding: '15px', borderRadius: '12px', border: 'none', background: 'linear-gradient(90deg, #7c3aed 0%, #e11d48 100%)', color: '#fff', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.83rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 6px 28px rgba(124,58,237,0.4)', opacity: loading ? 0.65 : 1 }}>
                                {loading ? 'Creating...' : 'Create Account →'}
                            </button>
                        </div>
                    </form>
                )}

                <div style={{ ...anim(400), textAlign: 'center', marginTop: '28px' }}>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginBottom: '8px' }}>Already have an account?</p>
                    <Link to="/login" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'rgba(167,139,250,0.7)', textDecoration: 'none' }}>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
