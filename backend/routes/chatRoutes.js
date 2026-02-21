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

    if (!HF_TOKEN) {
        console.error('[Chat] HF_API_TOKEN is not set in environment variables.');
        return res.status(500).json({ error: 'Chatbot service not configured.' });
    }

    // Build messages array (OpenAI-compatible format)
    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map(h => [
            { role: 'user', content: h.user },
            { role: 'assistant', content: h.bot }
        ]).flat(),
        { role: 'user', content: message }
    ];

    // Strategy 1: HF Serverless Inference API (always-on, no cold starts)
    // Uses the model directly — no Space needed
    const INFERENCE_URL = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct/v1/chat/completions';

    try {
        console.log('[Chat] Calling HF Inference API...');
        const response = await axios.post(
            INFERENCE_URL,
            {
                model: 'Qwen/Qwen2.5-7B-Instruct',
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
                timeout: 90000, // 90s — HF inference can be slow under load
            }
        );

        const reply = response.data?.choices?.[0]?.message?.content?.trim();
        if (!reply) {
            console.error('[Chat] Empty response body:', JSON.stringify(response.data));
            throw new Error('Empty response from inference API');
        }

        console.log('[Chat] Success');
        return res.json({ reply });

    } catch (inferenceErr) {
        // Log the real error to Render logs
        console.error('[Chat] Inference API failed:', inferenceErr.response?.status, inferenceErr.response?.data || inferenceErr.message);

        // Strategy 2: HF Space TGI endpoint fallback
        const HF_URL = process.env.HF_SPACE_URL;
        if (!HF_URL) {
            return res.status(502).json({ error: 'The AI assistant is currently unavailable. Please try again shortly.' });
        }

        try {
            console.log('[Chat] Falling back to HF Space:', HF_URL);
            const spaceRes = await axios.post(
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
                    timeout: 90000,
                }
            );

            const reply = spaceRes.data?.choices?.[0]?.message?.content?.trim();
            if (!reply) throw new Error('Empty Space response');

            console.log('[Chat] Space fallback success');
            return res.json({ reply });

        } catch (spaceErr) {
            console.error('[Chat] Space fallback also failed:', spaceErr.response?.status, spaceErr.response?.data || spaceErr.message);
            return res.status(502).json({
                error: 'The AI assistant is currently unavailable. Please try again shortly.',
            });
        }
    }
});

module.exports = router;
