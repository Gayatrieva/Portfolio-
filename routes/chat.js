const express = require('express');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');

const router = express.Router();
const DATA_DIR = path.join(__dirname, '../data');

// ─── Rate limiter: 20 requests per minute per IP ──────────────────────────────
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again in a minute.',
  },
});

// ─── Build system prompt from profile data ────────────────────────────────────
function buildSystemPrompt() {
  const files = [
    'about',
    'skills',
    'projects',
    'resume',
    'education',
    'certificates',
  ];

  const profile = {};

  for (const f of files) {
    const raw = fs.readFileSync(
      path.join(DATA_DIR, `${f}.json`),
      'utf-8'
    );

    profile[f] = JSON.parse(raw);
  }

  const name = profile.about.name;

  return `You are ${name}'s portfolio assistant.

Answer ONLY using the profile data provided below.

If asked something not covered by this data, say you don't know and suggest contacting ${name} directly at ${
    profile.about.email || 'the contact form'
  }.

Speak about ${name} in the third person.

Keep answers concise — 2 to 4 sentences unless the visitor explicitly asks for more detail.

Do not make up any information.
Do not speculate about things not mentioned in the profile data.

Be friendly, direct, and professional.

PROFILE DATA:
${JSON.stringify(profile, null, 2)}`;
}

// ─── POST /api/chat ───────────────────────────────────────────────────────────
router.post('/chat', chatLimiter, async (req, res) => {
  const { message, history } = req.body;

  // ─── Input validation ───────────────────────────────────────────────────────
  if (
    !message ||
    typeof message !== 'string' ||
    message.trim().length === 0
  ) {
    return res.status(400).json({
      error: 'Message is required.',
    });
  }

  if (message.length > 2000) {
    return res.status(400).json({
      error: 'Message too long (max 2000 characters).',
    });
  }

  // ─── API key check ──────────────────────────────────────────────────────────
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY not set');

    return res.status(503).json({
      error:
        'AI assistant is not configured. Please contact the site owner.',
    });
  }

  try {
    // ─── Gemini client ────────────────────────────────────────────────────────
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // ─── Cap history to last 10 turns ─────────────────────────────────────────
    const cappedHistory = Array.isArray(history)
      ? history.slice(-20)
      : [];

    const contents = [
      ...cappedHistory.map((turn) => ({
        role: turn.role === 'assistant' ? 'model' : 'user',
        parts: [
          {
            text: turn.content,
          },
        ],
      })),

      {
        role: 'user',
        parts: [
          {
            text: message.trim(),
          },
        ],
      },
    ];

    // ─── Gemini request ───────────────────────────────────────────────────────
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',

      contents,

      config: {
        systemInstruction: buildSystemPrompt(),
        maxOutputTokens: 1024,
      },
    });

    const reply =
      response.text ||
      'Sorry, I could not generate a response.';

    res.json({ reply });

  } catch (err) {
    console.error('Gemini API error:', err);

    // ─── Rate limit / quota ───────────────────────────────────────────────────
    if (err.status === 429) {
      return res.status(429).json({
        error:
          'Gemini API rate limit or quota reached. Please try again later.',
      });
    }

    // ─── Authentication ──────────────────────────────────────────────────────
    if (err.status === 401 || err.status === 403) {
      return res.status(503).json({
        error:
          'Gemini API authentication error. Please check your API key.',
      });
    }

    res.status(500).json({
      error:
        'Failed to get a response from Gemini. Please try again.',
    });
  }
});

module.exports = router;