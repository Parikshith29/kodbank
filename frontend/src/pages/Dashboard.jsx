import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import PartyPopper from '../components/PartyPopper';
import ChatBot from '../components/ChatBot';


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
const btnStyle = {
    display: 'block', width: '100%', padding: '15px 24px', borderRadius: '12px',
    border: 'none', background: 'linear-gradient(90deg, #e11d48 0%, #db2777 55%, #c026d3 100%)',
    color: '#fff', fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: '0.85rem',
    letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(225,29,72,0.4)',
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [loading, setLoading] = useState(false);
    const username = localStorage.getItem('username') || 'Agent';

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

    const handleLogout = async () => {
        try { await api.post('/auth/logout'); } catch (_) { }
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <>
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
                        <button onClick={handleLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.35)', fontFamily: 'Inter,sans-serif', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '8px 14px', cursor: 'pointer' }}>
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
