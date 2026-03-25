# VyralForge

Live demo: [Open the app in your browser](https://vyralforge.netlify.app/)

For local development use: `http://localhost:3000`.

VyralForge is a lightweight React + Vite app that transforms a single piece of source content (blog text, notes, or idea) into platform-ready social copy and short-form video scripts using a GenAI model.

The app focuses on producing professional, high-engagement outputs for LinkedIn, Twitter threads, Instagram captions, YouTube scripts, hooks, and short-form video outlines — with options to adjust tone, length, and a "viral boost" mode.

---

## Features

- Convert one input into LinkedIn posts, a Twitter thread, Instagram caption, YouTube script, hooks, and a short-form video script.
- Tone control (Professional, Casual, Viral, Storytelling) and length control (Short, Medium, Long).
- Viral boost toggle to emphasize hooks and psychological engagement triggers.
- Live preview while composing and copy-to-clipboard for quick export.
- Type-safe schema enforcement for structured JSON responses from the model.

---

## Tech stack

- React (functional components)
- Vite (dev server and build)
- TypeScript
- TailwindCSS (styling)
- GenAI client (e.g., provider SDK)
- motion (animation primitives)

---

## Quick start

Prerequisites

- Node.js (recommended v18+)
- npm or yarn

Install dependencies

```bash
npm install
# or
# yarn
```

Configure environment

Create a file named `.env` (or `.env.local`) in the project root with your model API key:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

Notes:
- The client reads the key via `import.meta.env.VITE_GEMINI_API_KEY`.
- Ensure the key has access to the model you intend to use.

Run the dev server

```bash
npm run dev
```

The app defaults to port 3000 (see `package.json` script).

Build and preview

- Build: `npm run build`
- Preview production build: `npm run preview`
- Clean build output: `npm run clean`
- Type-check / lint: `npm run lint`

---

## Project structure (high level)

- `src/App.tsx` — main UI, pages, and routing
- `src/main.tsx` — app bootstrap
- `src/services/gemini.ts` — model client wrapper and generation logic
- `index.html`, `vite.config.ts`, `tsconfig.json` — build & config
- `package.json` — scripts and dependencies

---

## Model integration details

- The core generation logic lives in `src/services/gemini.ts` and uses an LLM/GenAI client to call the configured model (the code defaults to `gemini-3-flash-preview`).
- `generateRepurposedContent` submits a prompt and a strict JSON schema to the model. The function expects a validated JSON object matching the `RepurposedContent` TypeScript interface.
- If the model returns malformed JSON or fails schema validation, the function may throw an error — check the console or server logs for details.

Tips

- If you need to swap models or tweak prompts, edit `src/services/gemini.ts`.
- For local development without an API key, guard calls to the model or mock `generateRepurposedContent`.

---

## Usage

1. Open the app in your browser (http://localhost:3000).
2. Paste source content in the textarea.
3. Select tone and length; toggle VIRAL_BOOST if desired.
4. Click Generate. After processing, the app navigates to the Generated Content page where you can browse tabs and copy content.

---

## Troubleshooting

- Generation errors:
  - Confirm your `VITE_GEMINI_API_KEY` is set and valid.
  - Confirm the model name in `src/services/gemini.ts` is accessible to your key.
  - Inspect the browser console for network or runtime errors.

- Dev server problems:
  - Ensure dependencies are installed and Node.js version is compatible.
  - Try removing `node_modules` and reinstalling: `rm -rf node_modules && npm install`.

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork and create a feature branch.
2. Keep changes focused. Add TypeScript types and tests where appropriate.
3. Open a PR and describe the change.

---

## License

This repository does not include a license file. Add one if you intend to publish or share the project publicly.

---

## Acknowledgements

Built by Vishnu. UI inspired by modern motion-driven dashboards and platform-first content workflows.
