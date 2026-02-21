const express = require('express');
const axios = require('axios');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

const SYSTEM_PROMPT = `You are KodBank AI Assistant — a helpful, professional, and friendly virtual banking assistant for KodBank, a modern digital bank. 
You help customers with:
- Account balance enquiries and transaction history
- Fund transfers and payment guidance
- Loan and credit card information
- General banking FAQs
- Security tips and fraud prevention

Keep your responses concise, clear, and professional. If a question is outside banking, politely redirect the user to banking topics.`;

// POST /api/chat
router.post('/', verifyToken, async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required.' });
    }

    const HF_TOKEN = process.env.HF_API_TOKEN;
    const HF_URL = process.env.HF_SPACE_URL;

    if (!HF_TOKEN || !HF_URL) {
        return res.status(500).json({ error: 'Chatbot service not configured.' });
    }

    // Build messages array (OpenAI-compatible format — works with TGI & many Gradio spaces)
    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map(h => [
            { role: 'user', content: h.user },
            { role: 'assistant', content: h.bot }
        ]).flat(),
        { role: 'user', content: message }
    ];

    try {
        // Try OpenAI-compatible endpoint first (TGI / newer Gradio)
        const response = await axios.post(
            `${HF_URL}/v1/chat/completions`,
            {
                model: 'tgi',
                messages,
                max_tokens: 512,
                temperature: 0.7,
                stream: false,
            },
            {
                headers: {
                    Authorization: `Bearer ${HF_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                timeout: 60000,
            }
        );

        const reply = response.data?.choices?.[0]?.message?.content?.trim();
        if (!reply) throw new Error('Empty response from AI');

        return res.json({ reply });

    } catch (firstErr) {
        // Fallback: try Gradio /api/predict endpoint
        try {
            const gradioRes = await axios.post(
                `${HF_URL}/api/predict`,
                {
                    data: [message, history.map(h => [h.user, h.bot]), SYSTEM_PROMPT, 512, 0.7, 0.95]
                },
                {
                    headers: {
                        Authorization: `Bearer ${HF_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 60000,
                }
            );

            const reply = gradioRes.data?.data?.[0]?.trim();
            if (!reply) throw new Error('Empty Gradio response');

            return res.json({ reply });

        } catch (secondErr) {
            console.error('Chat API error:', secondErr.message);
            return res.status(502).json({
                error: 'The AI assistant is currently unavailable. Please try again shortly.',
            });
        }
    }
});

module.exports = router;
