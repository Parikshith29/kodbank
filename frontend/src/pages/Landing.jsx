import React from 'react';
import { Link } from 'react-router-dom';

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
    maxWidth: '380px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
};

const glowStyle = {
    position: 'absolute',
    top: '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '240px',
    height: '120px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.7) 0%, rgba(79,70,229,0.4) 50%, transparent 80%)',
    filter: 'blur(30px)',
    pointerEvents: 'none',
};

const Landing = () => (
    <div style={pageStyle}>
        <div style={cardStyle}>
            <div style={glowStyle} />
            <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 4px', position: 'relative' }}>
                KODBANK
            </h1>
            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.3)', marginBottom: '40px' }}>
                Secure Asset Portal
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link
                    to="/login"
                    style={{
                        display: 'block',
                        padding: '15px 24px',
                        borderRadius: '12px',
                        background: 'linear-gradient(90deg, #e11d48 0%, #db2777 55%, #c026d3 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        boxShadow: '0 4px 20px rgba(225,29,72,0.4)',
                    }}
                >
                    AUTHENTICATE →
                </Link>
                <Link
                    to="/register"
                    style={{
                        display: 'block',
                        padding: '14px 24px',
                        borderRadius: '12px',
                        color: 'rgba(255,255,255,0.5)',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        border: '1px solid rgba(255,255,255,0.1)',
                        transition: 'all 0.2s',
                    }}
                >
                    Create Account
                </Link>
            </div>
        </div>
    </div>
);

export default Landing;
