# THE CLINIC

A minimalist conversational experiment built with React and Claude AI.

## Concept

THE CLINIC presents two opposing conversational modes:

- **ARGUE** — A reflexive contrarian that contradicts your every word. Say "day" and it says "night." Change your mind, and it flips to oppose your new position.

- **GRANDSTAND** — A spineless echo that agrees with anything you say. Claim you're right, it validates you. Admit you're wrong, it agrees you're wrong.

Both modes are context-aware—ask "Why?" and they'll invent justifications without breaking character.

## Design

- Ultra-minimalist black & white aesthetic
- Helvetica landing page, Menlo chat interface
- ARGUE mode displays in red text
- GRANDSTAND mode displays in black text
- Script-like chat format with symmetrical grid layout

## Tech Stack

- **Frontend:** React, Tailwind CSS, Framer Motion, Wouter
- **Backend:** Node.js, Express
- **AI:** Anthropic Claude API (via Replit AI Integrations)

## How It Works

The app sends full conversation history to Claude with carefully crafted system prompts that enforce:

1. **Immediate contradiction/agreement** based on current input
2. **Flip-flopping** when the user changes their stance
3. **Context-aware follow-ups** for "Why?" questions
4. **Length mirroring** to match user input size
5. **Immersion guards** preventing meta-commentary or breaking character

## Running Locally

```bash
npm install
npm run dev
```

The app runs on port 5000.

## Environment Variables

This project uses Replit AI Integrations which automatically provides:
- `AI_INTEGRATIONS_ANTHROPIC_API_KEY`
- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL`

No manual API key configuration needed when running on Replit.

## License

MIT
