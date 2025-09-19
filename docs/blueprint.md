# **App Name**: Scenario Insights Generator

## Core Features:

- Custom Question Generation: Validates input, calls LLM under constraints above, returns JSON or empty with error code. No caching, no storage.
- Report Generation: Validates input, calls LLM with strict template, returns narrative string or empty with error code.
- LLM constraints (questions): Exactly 5 questions. Each has A–E options. Each option ≤ 5 words. No free text. Deterministic JSON only.
- LLM constraints (report): Narrative only. No score. Structure enforced: Title ≤10 words, Dateline, Lede, 3–4 sentences, one Quote, fixed CTA.
- API Endpoint Security: Server-to-server only. `X-Service-Token` required. Optional HMAC signature + timestamp.
- Standardized JSON Responses: Single envelope with typed error codes.
- Operational Guarantees: Timeouts, retries, idempotency via `requestId`, rate limiting, versioning, `/health`.

## Style Guidelines:

- Primary color: Deep Indigo (#383759) to convey depth and insight.
- Background color: Light Blue-Gray (#e0e5f1) for a soft, professional feel.
- Accent color: Bright Yellow (#FFDA63) to highlight key insights and calls to action.
- Font pairing: 'Roboto' (sans-serif) headlines, and 'Open Sans' (sans-serif) for body text, offering a clean, modern aesthetic.
- Maintain a clean and structured layout with a left-side content area and a right-side control panel with rounded buttons, inspired by the provided image. The content area will display questions/reports. Buttons on the right will initiate actions.