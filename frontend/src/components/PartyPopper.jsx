import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

const PartyPopper = () => {
    useEffect(() => {
        const duration = 3500;
        const end = Date.now() + duration;
        const colors = ['#e11d48', '#db2777', '#c026d3', '#ffffff', '#22d3ee'];

        const frame = () => {
            if (Date.now() > end) return;
            confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
            confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
            requestAnimationFrame(frame);
        };

        frame();
    }, []);

    return null;
};

export default PartyPopper;
