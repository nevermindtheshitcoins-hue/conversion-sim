# Conversion-Sim — AI Assessment Tool

AI-powered business assessment with industry-specific questions and 8-factor reporting. Built for seamless embedding in Wix, websites, or any platform via iframe.

## 🚀 Features

- **Adaptive Intelligence**: Industry presets with AI-generated questions
- **8-Factor Analysis**: Comprehensive scoring with exportable reports
- **Universal Embed**: Works perfectly in Wix, HTML, or any iframe
- **Bulletproof Reliability**: Advanced error handling with user-friendly messages
- **Developer Friendly**: Hot-reload, TypeScript, strict linting, test coverage
- **Security First**: HMAC verification, rate limiting, request timeouts

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript, React 18
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Quality**: ESLint, Prettier, TypeScript strict mode
- **Runtime**: Node 18+, npm package manager

## ⚡ Quick Start

```bash
git clone <repo-url>
cd conversion-sim
npm install
cp .env.example .env.local
# Add your OPENAI_API_KEY to .env.local
npm run dev
```

Visit **http://localhost:9002** to see your assessment tool in action.

## 🔧 Configuration

### Required Environment Variables

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `OPENAI_API_KEY` | ✅ | `sk-xxxx` | Server-side only. Keep secret! |
| `NEXT_PUBLIC_APP_URL` | ✅ | `http://localhost:9002` | Public URL for embeds |
| `HMAC_SECRET` | ⚠️ Production | `openssl rand -hex 32` | For API security |

### Optional Variables

| Variable | Default | Example | Notes |
|----------|---------|---------|-------|
| `NODE_ENV` | `development` | `production` | Auto-set by runtime |
| `PORT` | `9002` | `3001` | Development server port |
| `LOG_LEVEL` | `info` | `debug` | Logging verbosity |

## 🌐 Embedding

### Simple Iframe (Recommended)

```html
<iframe
  src="https://yourdomain.com"
  width="100%"
  height="800"
  frameborder="0"
  allow="clipboard-write; encrypted-media">
</iframe>
```

### Responsive Embed

```html
<div style="position:relative;width:100%;height:0;padding-bottom:56.25%;">
  <iframe
    src="https://yourdomain.com"
    style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"
    frameborder="0">
  </iframe>
</div>
```

> **Tip**: Use the HTML iframe component in Wix. Ensure your deployed domain matches `NEXT_PUBLIC_APP_URL`.

## ⌨️ Keyboard Navigation

- **Arrow Keys** (↑↓←→): Navigate options
- **Enter/Space**: Select option
- **Home/End**: Jump to first/last option
- **Tab**: Move between sections

*Full accessibility support with WCAG 2.1 AA compliance*

## 🔒 Security Features

- **HMAC Signature Verification**: Prevents request tampering
- **Rate Limiting**: 10 requests per IP, refills 1/minute
- **Request Timeouts**: 25-second timeout prevents abuse
- **Input Validation**: Comprehensive request/response validation

## 🧪 Testing

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
```

### Runtime Issues
```bash
# Verbose logging
npm run dev -- --debug

# Check environment variables
echo $OPENAI_API_KEY

# Different port
npm run dev -- --port 3001
```

### API Issues
```bash
# Test endpoint
curl -X POST http://localhost:9002/api/ai-assessment \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Check API key
node -e "console.log(process.env.OPENAI_API_KEY ? '✅ API key set' : '❌ Missing API key')"
```

## 📚 Documentation

### 🎯 Essential Guides
- **[Project History](./docs/archive/PROJECT_HISTORY.md)** - Changelog and roadmap
- **[Architecture Design](./docs/archive/ZONED_ARCHITECTURE_DESIGN.md)** - Technical specification
- **[Security Implementation](./docs/archive/SECURITY_IMPLEMENTATION.md)** - Security measures

### 🔧 Development Guides
- **[Implementation Guide](./docs/archive/ROUND_2_IMPLEMENTATION_GUIDE.md)** - Step-by-step coding
- **[Visual Flow Diagram](./docs/archive/VISUAL_FLOW_DIAGRAM.md)** - Architecture diagrams
- **[Content Type Mapping](./docs/archive/CONTENT_TYPE_MAPPING.md)** - Screen-by-screen breakdown

### ⚡ Quick References
- **[Error Handling](./docs/archive/ERROR_HANDLING.md)** - Comprehensive error management
- **[Keyboard Shortcuts](./docs/archive/KEYBOARD_SHORTCUTS.md)** - User shortcuts guide
- **[Performance Optimization](./docs/archive/PERFORMANCE_OPTIMIZATION.md)** - Performance tuning
- **[TypeScript Strictness](./docs/archive/TYPESCRIPT_STRICTNESS.md)** - TypeScript best practices

### 🔐 Operations
- **[Security Quickstart](./docs/archive/SECURITY_QUICKSTART.md)** - Fast security setup
- **[UX Polish Implementation](./docs/archive/UX_POLISH_IMPLEMENTATION.md)** - Accessibility details

---

*"Unless someone like you cares a whole awful lot, nothing is going to get better. It's not."*
— **Dr. Seuss** 💚

*From there to here, and here to there, funny things are everywhere! If you never did, you should. These things are fun, and fun is good.*

---

## 📄 License

MIT License. See [LICENSE](./LICENSE) for details.

---

**Built with ❤️ by the Conversion-Sim team** | **Ready for production** 🚀