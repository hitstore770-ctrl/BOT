/**
 * index.js
 *
 * Lightweight, stateless WhatsApp <-> Gemini bridge.
 *
 * Uses whatsapp-web.js (free, no Meta/Cloud API) — it drives a real WhatsApp
 * Web session through a headless browser, so you authenticate once by scanning
 * a QR code. Gemini answers each message via Google's @google/genai SDK.
 *
 * Flow:
 *   1. On first run a QR code is printed; scan it from WhatsApp > Linked Devices.
 *   2. For each incoming PRIVATE message we run a single, independent Gemini
 *      generation (no chat history — the system is intentionally stateless).
 *   3. SYSTEM_PROMPT (how to behave) + KNOWLEDGE_BASE (what to know) are combined
 *      into one systemInstruction sent with every message.
 *   4. The generated text is sent straight back with message.reply().
 */

require('dotenv').config();

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { GoogleGenAI } = require('@google/genai');
const { SYSTEM_PROMPT } = require('./systemPrompt');
const { KNOWLEDGE_BASE } = require('./knowledgeBase');

// --- Config -----------------------------------------------------------------

const { GEMINI_API_KEY } = process.env;

// Free-tier model. If this ever returns a 404 "model not found", Gemini 1.5
// may be retired for new projects — swap in 'gemini-2.0-flash' or
// 'gemini-2.5-flash' (both have free tiers) without any other changes.
const GEMINI_MODEL = 'gemini-1.5-flash';

// WhatsApp needs no API token (QR auth), so Gemini is the only required secret.
if (!GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY. Set it in your .env file.');
  process.exit(1);
}

// SYSTEM_PROMPT defines HOW the assistant behaves; KNOWLEDGE_BASE defines WHAT
// it knows. Together they form the single system instruction sent with every
// request, kept separate from the user's own text.
const SYSTEM_INSTRUCTION = `${SYSTEM_PROMPT}\n\n${KNOWLEDGE_BASE}`;

// --- Gemini -----------------------------------------------------------------

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * Generate a stateless reply for a single user message.
 * Each call is independent — no conversation memory is retained.
 *
 * @param {string} userText - The raw text the user sent.
 * @returns {Promise<string|undefined>} The model's reply text, or undefined if
 *   the model produced no text (e.g. blocked by a safety filter).
 */
async function generateReply(userText) {
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: userText,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
  return response.text;
}

// --- WhatsApp client --------------------------------------------------------

const client = new Client({
  // LocalAuth persists the session to disk (.wwebjs_auth/) so you only scan
  // the QR code once, not on every restart.
  authStrategy: new LocalAuth(),
  puppeteer: {
    // --no-sandbox is required when running as root, in containers, or on many
    // Linux servers. It is harmless on a normal desktop and can be removed there.
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

// Print the login QR code in the terminal.
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('📲 Scan the QR code above with WhatsApp → Linked Devices to log in.');
});

client.on('ready', () => {
  console.log('✅ WhatsApp client is ready and listening for messages.');
});

client.on('auth_failure', (msg) => {
  console.error('Authentication failure:', msg);
});

client.on('disconnected', (reason) => {
  console.warn('Client was disconnected:', reason);
});

// Handle incoming messages.
client.on('message', async (message) => {
  // CRITICAL: only respond to private 1:1 chats.
  //   - groups end in '@g.us'  -> ignore (avoids spamming whole groups)
  //   - status updates are 'status@broadcast' -> ignore
  if (message.from.includes('@g.us') || message.from === 'status@broadcast') {
    return;
  }

  const userText = message.body;

  // Skip empty bodies (e.g. media without a caption, system messages).
  if (!userText) return;

  try {
    const reply = await generateReply(userText);

    // `response.text` can be undefined (e.g. safety block / empty candidate).
    await message.reply(
      reply || 'מצטער, לא הצלחתי להפיק תשובה כרגע. נסה לנסח שוב בבקשה 🙏'
    );
  } catch (err) {
    console.error(`Error replying to ${message.from}:`, err.message);
    // Best-effort apology; ignore a failure to deliver it.
    try {
      await message.reply('מצטער, נתקלתי בתקלה רגעית. נסה שוב בעוד רגע 🙏');
    } catch (_) {
      /* swallow */
    }
  }
});

// Launch the headless browser and start the session.
client.initialize().catch((err) => {
  console.error('Failed to initialize WhatsApp client:', err.message);
  process.exit(1);
});

console.log('⏳ Starting WhatsApp client… a QR code will appear shortly.');
