# Conversion‑Sim — Business Assessment Tool

AI‑powered conversion assessment with industry‑specific questions and an 8‑factor report. Built for fast embed into Wix or any site via iframe.

## Features
- Adaptive questionnaire with industry presets
- 8‑factor scoring and simple exportable report
- Fast Wix/HTML embed with responsive layout
- Local dev with hot‑reload, typed code, and strict linting
- Testable endpoints and components

## Tech Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript, React 18
- Styling: Tailwind CSS
- Testing: Jest + React Testing Library
- Quality: ESLint, Prettier, Type checks
- Runtime: Node 18+
- Package manager: npm

## Project Structure
```
/app               # Next.js routes and API
/components        # UI components
/lib               # utilities, scoring logic
/public            # static assets
/tests             # unit/integration tests
/docs              # project docs (deployment, ops, architecture, etc.)
```

## Quickstart

```bash
git clone <repo-url>
cd conversion-sim
npm install
cp .env.example .env.local
# Add your OPENAI_API_KEY (and others) to .env.local
npm run dev
```

Open http://localhost:9002

## Scripts

```bash
# Development
npm run dev

# Build
npm run build
npm start

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Testing
npm test
npm run test:watch
npm run test:coverage
```

## Configuration

Environment variables used by the app. Copy `.env.example` to `.env.local` for development.

| Variable | Required | Example | Notes |
| --- | --- | --- | --- |
| OPENAI_API_KEY | yes | sk-xxxx | Server‑side usage only. Do not expose publicly. |
| NEXT_PUBLIC_APP_URL | yes | http://localhost:9002 | Public base URL used in embeds and links. |
| NODE_ENV | no | development | Automatically set in most runtimes. |
| PORT | no | 9002 | Dev server port. |
| LOG_LEVEL | no | info | debug \| info \| warn \| error |

### Environments

#### Development
```bash
cp .env.example .env.local
npm run dev
```

#### Staging
```bash
cp .env.example .env.staging
# Fill staging values and configure deployment target
```

#### Production
Provide environment variables in your host (e.g., Vercel/Render/Fly).
```bash
# Required variables
OPENAI_API_KEY=your_key_here
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Embedding in Wix (and any site)

### Simple iframe
```html
<iframe 
  src="https://yourdomain.com" 
  width="100%" 
  height="800"
  frameborder="0"
  allow="clipboard-write; encrypted-media">
</iframe>
```

### Responsive embed
```html
<div style="position:relative;width:100%;height:0;padding-bottom:56.25%;">
  <iframe 
    src="https://yourdomain.com"
    style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"
    frameborder="0">
  </iframe>
</div>
```

> If embedding on Wix, use the HTML iframe component. Ensure the app URL in `.env` matches the deployed origin.

## Theming

Tailwind tokens can be overridden in `tailwind.config.js`. Global CSS variables live in `app/globals.css`.

```css
/* tailwind.config.js */
theme: {
  extend: {
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#10b981'
    }
  }
}
```

```css
/* app/globals.css */
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
}
```

## Testing

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Test specific file
npm test -- QuestionScreen.test.tsx

# Coverage report
npm run test:coverage
```

## Troubleshooting

### Build issues
```bash
# Clear cache
rm -rf .next node_modules package-lock.json
npm install

# Type errors
npm run type-check

# ESLint errors
npm run lint:fix
```

### Runtime issues
```bash
# Start with verbose logs
npm run dev -- --debug

# Verify environment variables
echo $OPENAI_API_KEY

# Port conflicts
npm run dev -- --port 3001
```

### API checks
```bash
# Test API endpoint
curl -X POST http://localhost:9002/api/test \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Check OpenAI connection
node -e "console.log(process.env.OPENAI_API_KEY ? 'API key set' : 'Missing API key')"
```

### Performance
```bash
# Build + analyze
npm run build
npm run analyze

# Lighthouse
npx lighthouse http://localhost:9002 --view
```

## Documentation

### 📚 Essential Documentation
- **[Quick Reference](./docs/QUICK_REFERENCE.md)** - Fast lookup for all key information
- **[Project History](./docs/PROJECT_HISTORY.md)** - Complete changelog and updates
- **[Architecture Design](./docs/ZONED_ARCHITECTURE_DESIGN.md)** - Complete technical specification

### 🔧 Implementation & Development
- **[Implementation Guide](./docs/ROUND_2_IMPLEMENTATION_GUIDE.md)** - Step-by-step coding instructions
- **[Content Type Mapping](./docs/CONTENT_TYPE_MAPPING.md)** - Screen-by-screen breakdown
- **[Visual Flow Diagram](./docs/VISUAL_FLOW_DIAGRAM.md)** - Architecture diagrams and flows

### 🔒 Security & Operations
- **[Security Implementation](./docs/SECURITY_IMPLEMENTATION.md)** - Security measures and configuration
- **[Security Quickstart](./docs/SECURITY_QUICKSTART.md)** - Fast security setup guide

### ♿ Accessibility & Polish
- **[Keyboard Shortcuts](./docs/KEYBOARD_SHORTCUTS.md)** - User-facing shortcuts guide
- **[UX Polish Implementation](./docs/UX_POLISH_IMPLEMENTATION.md)** - Accessibility details

### 📝 Development Guides
- **[TypeScript Strictness](./docs/TYPESCRIPT_STRICTNESS.md)** - TypeScript best practices
- **[Performance Optimization](./docs/PERFORMANCE_OPTIMIZATION.md)** - Performance tuning guide

### 📦 Archive
- **[ze_deletables/](./docs/ze_deletables/)** - Outdated and redundant documentation

### Legacy References
- Deployment: See Quick Reference and Security Implementation
- Operations: See Security Implementation and Performance Optimization
- Contributing: See Project History for current patterns
- License: [LICENSE](./LICENSE)

## License

MIT unless replaced. See [LICENSE](./LICENSE).