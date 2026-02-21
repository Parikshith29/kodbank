import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PartyPopper from '../components/PartyPopper';
import ChatBot from '../components/ChatBot';

const pageStyle = {
    minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at 30% 10%, #1a1040 0%, #0f0f14 50%, #0a0a18 100%)',
    padding: '24px', fontFamily: 'Inter,sans-serif',
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
const btnStyle = {
    display: 'block', width: '100%', padding: '15px 24px', borderRadius: '12px',
    border: 'none', background: 'linear-gradient(90deg, #7c3aed 0%, #e11d48 100%)',
    color: '#fff', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.85rem',
    letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
};

/* ── Logout Confirmation Modal ─────────────────────────────── */
const LogoutModal = ({ onConfirm, onCancel }) => (
    <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease',
    }}>
        <div style={{
            background: 'rgba(20,12,40,0.92)', backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.07)',
            padding: '40px 36px', maxWidth: '340px', width: '90%', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
            animation: 'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
            {/* Modal glow */}
            <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,29,72,0.5) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

            {/* Icon */}
            <div style={{
                width: '52px', height: '52px', borderRadius: '50%', margin: '0 auto 20px',
                background: 'rgba(225,29,72,0.12)', border: '1px solid rgba(225,29,72,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            }}>
                <svg width="22" height="22" fill="none" stroke="rgba(252,165,165,0.9)" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 8px', color: '#fff', position: 'relative' }}>
                Sign out?
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.38)', margin: '0 0 28px', lineHeight: 1.6, letterSpacing: '0.02em', position: 'relative' }}>
                You'll need to authenticate again to access your account.
            </p>

            <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
                <button onClick={onCancel} style={{
                    flex: 1, padding: '13px', borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter,sans-serif', fontSize: '0.78rem',
                    fontWeight: 600, cursor: 'pointer', letterSpacing: '0.05em',
                    transition: 'background 0.2s',
                }}>
                    Stay
                </button>
                <button onClick={onConfirm} style={{
                    flex: 1, padding: '13px', borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(90deg, #be123c, #e11d48)',
                    color: '#fff', fontFamily: 'Inter,sans-serif', fontSize: '0.78rem',
                    fontWeight: 700, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase',
                    boxShadow: '0 4px 20px rgba(225,29,72,0.35)',
                }}>
                    Sign Out
                </button>
            </div>
        </div>
        <style>{`
            @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
            @keyframes slideUp { from { opacity:0; transform:translateY(20px) scale(0.97) } to { opacity:1; transform:translateY(0) scale(1) } }
        `}</style>
    </div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const username = localStorage.getItem('username') || 'Agent';

    // Intercept browser back button — show logout modal instead of navigating away
    useEffect(() => {
        // Push a dummy state so the first "back" hits our handler
        window.history.pushState({ dashboardGuard: true }, '');

        const handlePop = () => {
            // Push the state back immediately to prevent navigation
            window.history.pushState({ dashboardGuard: true }, '');
            setShowLogoutModal(true);
        };

        window.addEventListener('popstate', handlePop);
        return () => window.removeEventListener('popstate', handlePop);
    }, []);

    const checkBalance = async () => {
        setLoading(true);
        try {
            const res = await api.get('/user/balance');
            setBalance(res.data.balance);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 4000);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const confirmLogout = async () => {
        try { await api.post('/auth/logout'); } catch (_) { }
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <>
            {/* Logout modal */}
            {showLogoutModal && (
                <LogoutModal
                    onConfirm={confirmLogout}
                    onCancel={() => setShowLogoutModal(false)}
                />
            )}

            <div style={pageStyle}>
                {showConfetti && <PartyPopper />}
                <div style={cardStyle}>
                    <div style={glowStyle} />

                    {/* Header row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', position: 'relative' }}>
                        <div>
                            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>KODBANK</h1>
                            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                                {username}
                            </p>
                        </div>
                        <button onClick={() => setShowLogoutModal(true)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter,sans-serif', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '8px 14px', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s' }}
                            onMouseEnter={e => { e.target.style.borderColor = 'rgba(225,29,72,0.4)'; e.target.style.color = 'rgba(252,165,165,0.7)'; }}
                            onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.color = 'rgba(255,255,255,0.35)'; }}
                        >
                            Sign Out
                        </button>
                    </div>

                    {/* Balance */}
                    <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
                        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>
                            Account Balance
                        </p>
                        {balance !== null ? (
                            <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#fff' }}>
                                ₹{parseFloat(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                        ) : (
                            <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.08)', userSelect: 'none' }}>
                                ₹ ••••••
                            </div>
                        )}
                    </div>

                    <button onClick={checkBalance} disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.6 : 1 }}>
                        {loading ? 'Retrieving...' : balance !== null ? 'REFRESH BALANCE' : 'CHECK BALANCE'}
                    </button>
                </div>
            </div>
            <ChatBot />
        </>
    );
};

export default Dashboard;
