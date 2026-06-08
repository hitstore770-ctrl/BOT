/**
 * index.js
 *
 * Lightweight, stateless Telegram <-> Gemini bridge.
 *
 * Flow:
 *   1. Telegram long-polls for incoming messages.
 *   2. For each text message we run a single, independent Gemini generation
 *      (no chat history is kept — the system is intentionally stateless).
 *   3. The persona/rules (SYSTEM_PROMPT) and the facts (KNOWLEDGE_BASE) are
 *      combined into one systemInstruction, so they accompany every message.
 *   4. The generated text is sent straight back to the user.
 *
 * Uses Google's unified GenAI SDK: @google/genai.
 */

require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenAI } = require('@google/genai');
const { SYSTEM_PROMPT } = require('./systemPrompt');
const { KNOWLEDGE_BASE } = require('./knowledgeBase');

// --- Config -----------------------------------------------------------------

const { TELEGRAM_BOT_TOKEN, GEMINI_API_KEY } = process.env;

// Free-tier model requested. If this ever returns a 404 "model not found",
// Gemini 1.5 may be retired for new projects — swap in 'gemini-2.0-flash'
// or 'gemini-2.5-flash' (both have free tiers) without any other changes.
const GEMINI_MODEL = 'gemini-1.5-flash';

// Fail fast with a clear message instead of crashing deep inside the SDK.
if (!TELEGRAM_BOT_TOKEN || !GEMINI_API_KEY) {
  console.error(
    'Missing credentials. Set TELEGRAM_BOT_TOKEN and GEMINI_API_KEY in your .env file.'
  );
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

// --- Telegram ---------------------------------------------------------------

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userText = msg.text;

  // Ignore non-text payloads (stickers, photos, voice, etc.).
  if (!userText) return;

  try {
    // Let the user know we're working while Gemini thinks.
    bot.sendChatAction(chatId, 'typing').catch(() => {});

    const reply = await generateReply(userText);

    // `response.text` can be undefined (e.g. safety block / empty candidate).
    if (!reply) {
      await bot.sendMessage(
        chatId,
        'מצטער, לא הצלחתי להפיק תשובה כרגע. נסה לנסח שוב בבקשה 🙏'
      );
      return;
    }

    await bot.sendMessage(chatId, reply);
  } catch (err) {
    console.error(`Error handling message from chat ${chatId}:`, err.message);
    await bot
      .sendMessage(chatId, 'מצטער, נתקלתי בתקלה רגעית. נסה שוב בעוד רגע 🙏')
      .catch(() => {});
  }
});

// Surface polling problems (e.g. bad token, network) without crashing.
bot.on('polling_error', (err) => {
  console.error('Polling error:', err.message);
});

console.log(`🤖 Bot is up and polling. Model: ${GEMINI_MODEL}`);
