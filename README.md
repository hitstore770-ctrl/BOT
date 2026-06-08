# WhatsApp AI Chatbot (Gemini)

A lightweight, **stateless**, 100% free AI chatbot for **WhatsApp**. It uses
[`whatsapp-web.js`](https://wwebjs.dev/) (no paid Meta/Cloud API) to drive a real
WhatsApp Web session, and Google Gemini to answer. Every message is handled by a
single, independent generation — there is no session/state machine, so the bot
never "traps" the user in a flow.

## Architecture

| File               | Responsibility                                                       |
| ------------------ | ------------------------------------------------------------------- |
| `index.js`         | WhatsApp client (QR auth) + Gemini integration (the runtime).       |
| `systemPrompt.js`  | Exports `SYSTEM_PROMPT` — the persona & behaviour rules (Hebrew).    |
| `knowledgeBase.js` | Exports `KNOWLEDGE_BASE` — the facts the assistant answers from.     |
| `.env`             | Secret: `GEMINI_API_KEY` (not committed).                           |
| `.env.example`     | Template for `.env`.                                                 |

The bot talks to Gemini through Google's unified **`@google/genai`** SDK.
`SYSTEM_PROMPT` (how to behave) and `KNOWLEDGE_BASE` (what to know) are combined
into a single `systemInstruction`, so they accompany every user message while
staying separate from the user's own text. Group chats (`@g.us`) and status
broadcasts are ignored, so the bot only replies in private 1:1 chats.

## Requirements

- Node.js 18+
- A Chromium/Chrome that Puppeteer can launch (downloaded automatically with
  `whatsapp-web.js`). On headless Linux you may also need system libraries for
  Chromium.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your `.env` from the template and add your key:
   ```bash
   cp .env.example .env
   ```
   - `GEMINI_API_KEY` — from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - WhatsApp needs **no** key — you log in by scanning a QR code.
3. Run the bot:
   ```bash
   node index.js
   ```
4. Scan the QR code printed in the terminal: WhatsApp → **Linked Devices** →
   **Link a device**. The session is saved locally (`.wwebjs_auth/`), so you only
   scan once.

## Model

Uses the free-tier `gemini-1.5-flash`. If you hit a 404 "model not found"
(Gemini 1.5 is being retired for new projects), change `GEMINI_MODEL` in
`index.js` to `gemini-2.0-flash` or `gemini-2.5-flash`.

## Note

`whatsapp-web.js` is an unofficial library that automates WhatsApp Web. It is not
affiliated with or endorsed by WhatsApp/Meta, and automating a personal account
can risk restrictions. Use a number you're comfortable with and review WhatsApp's
Terms of Service.
