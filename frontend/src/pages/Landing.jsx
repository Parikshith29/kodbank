import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/* Inline SVG Logo — geometric hexagon with K */
const KodBankLogo = ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="lg1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill="url(#lg1)" />
        {/* Stylised K */}
        <path d="M13 11v18M13 20l10-9M13 20l10 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Landing = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

    const anim = (d = 0) => ({
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.55s ease ${d}ms, transform 0.55s ease ${d}ms`,
    });

    return (
        <div style={{
            minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column',
            background: 'radial-gradient(ellipse at 40% 0%, #1a0e3a 0%, #0c0918 40%, #080810 100%)',
            fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden',
        }}>
            {/* Background orbs */}
            <div style={{ position: 'absolute', top: '-120px', left: '30%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-80px', right: '-60px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,29,72,0.18) 0%, transparent 65%)', filter: 'blur(70px)', pointerEvents: 'none' }} />

            {/* Subtle grid */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }}>
                <defs>
                    <pattern id="g" width="72" height="72" patternUnits="userSpaceOnUse">
                        <path d="M 72 0 L 0 0 0 72" fill="none" stroke="rgba(167,139,250,1)" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#g)" />
            </svg>

            {/* ── Nav bar ─────────────────────────── */}
            <nav style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 48px', borderBottom: '1px solid rgba(255,255,255,0.05)', ...anim(0) }}>
                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <KodBankLogo size={34} />
                    <span style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }}>KODBANK</span>
                </div>
                {/* Nav actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Link to="/login" style={{ padding: '9px 20px', borderRadius: '9px', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.04em', textDecoration: 'none', transition: 'all 0.2s', background: 'rgba(255,255,255,0.03)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                    >Sign In</Link>
                    <Link to="/register" style={{ padding: '9px 20px', borderRadius: '9px', border: 'none', background: 'linear-gradient(90deg, #7c3aed, #e11d48)', color: '#fff', fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', textDecoration: 'none', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}>
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* ── Hero ─────────────────────────────── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px 60px', position: 'relative' }}>
                {/* Pill badge */}
                <div style={{ ...anim(80), display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(124,58,237,0.35)', background: 'rgba(124,58,237,0.1)', marginBottom: '32px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} />
                    <span style={{ fontSize: '11px', color: 'rgba(167,139,250,0.9)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Secure Digital Banking</span>
                </div>

                {/* Headline */}
                <h1 style={{ ...anim(150), fontSize: 'clamp(2.6rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.04em', color: '#fff', margin: '0 0 24px', maxWidth: '800px' }}>
                    Banking That<br />
                    <span style={{ background: 'linear-gradient(100deg, #a78bfa 0%, #e11d48 60%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Works for You.</span>
                </h1>

                {/* Subtitle */}
                <p style={{ ...anim(220), fontSize: '1rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.75, maxWidth: '480px', margin: '0 0 48px', letterSpacing: '0.01em' }}>
                    Instant transfers, real-time balance tracking, and intelligent security — built for the modern generation.
                </p>

                {/* CTA buttons */}
                <div style={{ ...anim(290), display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to="/register" style={{ padding: '15px 36px', borderRadius: '12px', border: 'none', background: 'linear-gradient(90deg, #7c3aed, #e11d48)', color: '#fff', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.06em', textDecoration: 'none', boxShadow: '0 8px 28px rgba(124,58,237,0.45)', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(124,58,237,0.6)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(124,58,237,0.45)'; }}
                    >Open an Account</Link>
                    <Link to="/login" style={{ padding: '15px 36px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.06em', textDecoration: 'none', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                    >Sign In →</Link>
                </div>

                {/* Abstract visual — 3 floating card shapes */}
                <div style={{ ...anim(380), marginTop: '72px', position: 'relative', width: '100%', maxWidth: '560px', height: '200px' }}>
                    {/* Back card */}
                    <div style={{ position: 'absolute', left: '50%', top: '30px', transform: 'translateX(-50%) rotate(-6deg)', width: '300px', height: '170px', borderRadius: '20px', background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.25)', backdropFilter: 'blur(12px)' }} />
                    {/* Mid card */}
                    <div style={{ position: 'absolute', left: '50%', top: '15px', transform: 'translateX(-50%) rotate(3deg)', width: '300px', height: '170px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(225,29,72,0.2))', border: '1px solid rgba(167,139,250,0.2)', backdropFilter: 'blur(16px)' }} />
                    {/* Front card */}
                    <div style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', width: '300px', height: '170px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(30,20,60,0.95), rgba(20,10,35,0.9))', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '22px 24px' }}>
                        {/* Top row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {['rgba(124,58,237,0.8)', 'rgba(225,29,72,0.6)'].map((c, i) => <div key={i} style={{ width: '22px', height: '22px', borderRadius: '50%', background: c, marginLeft: i > 0 ? '-8px' : 0 }} />)}
                            </div>
                            <KodBankLogo size={26} />
                        </div>
                        {/* Card number dots */}
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            {[0, 1, 2].map(g => <div key={g} style={{ display: 'flex', gap: '4px' }}>{[0, 1, 2, 3].map(d => <div key={d} style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />)}</div>)}
                            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', fontWeight: 600 }}>1234</span>
                        </div>
                        {/* Bottom row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <div style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', marginBottom: '3px' }}>Cardholder</div>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.05em' }}>KODBANK USER</div>
                            </div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>12/28</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Footer bar ─────────────────────────── */}
            <div style={{ ...anim(460), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', padding: '20px 48px', borderTop: '1px solid rgba(255,255,255,0.04)', flexWrap: 'wrap' }}>
                {['256-bit TLS Encryption', 'RBI Compliant', 'Zero Hidden Charges'].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(124,58,237,0.7)' }} />
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Landing;
