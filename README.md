# Telegram AI Chatbot (Gemini)

A lightweight, **stateless**, free AI chatbot. It bridges Telegram and Google
Gemini: every message is answered by a single, independent Gemini generation —
there is no session/state machine, so the bot never "traps" the user in a flow.

## Architecture

| File              | Responsibility                                                        |
| ----------------- | --------------------------------------------------------------------- |
| `index.js`        | Telegram polling + Gemini integration (the runtime).                  |
| `systemPrompt.js` | Exports `SYSTEM_PROMPT` — the persona & rules (Hebrew).               |
| `.env`            | Secrets: `TELEGRAM_BOT_TOKEN`, `GEMINI_API_KEY` (not committed).      |
| `.env.example`    | Template for `.env`.                                                   |

The persona is passed to Gemini as a `systemInstruction`, so it accompanies
every user message while staying separate from the user's own text.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your `.env` from the template and fill in real credentials:
   ```bash
   cp .env.example .env
   ```
   - `TELEGRAM_BOT_TOKEN` — from [@BotFather](https://t.me/BotFather)
   - `GEMINI_API_KEY` — from [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Run the bot:
   ```bash
   npm start
   ```

## Model

Uses the free-tier `gemini-1.5-flash`. If you hit a 404 "model not found"
(Gemini 1.5 is being retired for new projects), change `GEMINI_MODEL` in
`index.js` to `gemini-2.0-flash` or `gemini-2.5-flash`.
