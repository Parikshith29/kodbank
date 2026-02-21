import React, { useEffect, useState } from 'react';

const PageTransition = ({ children }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 20);
        return () => clearTimeout(t);
    }, []);

    return (
        <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}>
            {children}
        </div>
    );
};

export default PageTransition;
