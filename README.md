# Business Assessment Tool

AI-powered conversion assessment with industry-specific questions and 8-factor reports.

## Quickstart

```bash
git clone <repo-url>
cd conversion-sim
npm install
cp .env.example .env.local
# Add your OPENAI_API_KEY to .env.local
npm run dev
```

Open http://localhost:3000

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

## Environments

### Development
```bash
cp .env.example .env.local
```

### Production
```bash
# Set environment variables:
OPENAI_API_KEY=your_key_here
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Staging
```bash
cp .env.example .env.staging
# Configure staging-specific variables
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

## Theming

### Colors
```css
/* tailwind.config.js */
theme: {
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#10b981'
  }
}
```

### Custom CSS
```css
/* globals.css */
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
}
```

### Component Styling
```tsx
// Override default styles
<div className="bg-primary text-white p-4 rounded-lg">
  Custom styled component
</div>
```

## Wix Embed

### Iframe Embed
```html
<iframe 
  src="https://yourdomain.com" 
  width="100%" 
  height="800px"
  frameborder="0">
</iframe>
```

### Wix HTML Component
```html
<div id="assessment-tool"></div>
<script>
  const iframe = document.createElement('iframe');
  iframe.src = 'https://yourdomain.com';
  iframe.width = '100%';
  iframe.height = '800px';
  iframe.frameBorder = '0';
  document.getElementById('assessment-tool').appendChild(iframe);
</script>
```

### Responsive Embed
```html
<div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%;">
  <iframe 
    src="https://yourdomain.com"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0">
  </iframe>
</div>
```

## Troubleshooting

### Build Issues
```bash
# Clear cache
rm -rf .next node_modules package-lock.json
npm install

# Type errors
npm run type-check

# ESLint errors
npm run lint:fix
```

### Runtime Errors
```bash
# Check logs
npm run dev -- --debug

# Environment variables
echo $OPENAI_API_KEY

# Port conflicts
npm run dev -- --port 3001
```

### API Issues
```bash
# Test API endpoint
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Check OpenAI connection
node -e "console.log(process.env.OPENAI_API_KEY ? 'API key set' : 'Missing API key')"
```

### Performance
```bash
# Bundle analysis
npm run build
npm run analyze

# Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

### Database/Storage
```bash
# Clear local storage
localStorage.clear()

# Reset session
sessionStorage.clear()
```