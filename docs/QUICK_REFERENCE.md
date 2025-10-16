# Quick Reference Guide

## 📋 Essential Information at a Glance

This document consolidates key information from all project documentation for fast lookup during development and operations.

---

## 🚀 Project Overview

**Conversion-Sim** - AI-powered business assessment tool with industry-specific questions and 8-factor reporting.

**Tech Stack**: Next.js 15, TypeScript, React 18, Tailwind CSS
**Runtime**: Node 18+, npm package manager

---

## 🏗️ Architecture (3-Zone Design)

### Zone Structure
```
┌─────────────────────────────────────┐
│ HEADER ZONE (Always Visible)        │ ← Progress, Step Counter
├─────────────────────────────────────┤
│ MAIN ZONE (Content Morphs)          │ ← Industry → Questions → Report
├─────────────────────────────────────┤
│ FOOTER ZONE (Context Messages)      │ ← Errors, Hover, Help
└─────────────────────────────────────┘
```

### Content Types (Main Zone)
| Type | When | Keypad Behavior |
|------|------|-----------------|
| **INDUSTRY_PICKER** | First screen | Buttons 1-7 = industries |
| **SINGLE_CHOICE** | Most questions | Buttons 1-N = options |
| **TEXT_INPUT** | Custom scenario | Text field active |
| **AI_LOADING** | Generating questions | All disabled |
| **REPORT_VIEW** | Final screen | Copy/Reset/CTA |

### Key Constraints
- **KEYPAD STATIC**: 7 buttons never appear/disappear
- **NO NAVIGATION**: No route changes, only content morphing
- **ZONE ISOLATION**: Each zone updates independently

---

## ⚙️ Development Setup

### Quick Start
```bash
git clone <repo-url>
cd conversion-sim
npm install
cp .env.example .env.local
# Add OPENAI_API_KEY to .env.local
npm run dev
```

### Essential Environment Variables
```bash
OPENAI_API_KEY=sk-xxxx                    # Required for AI features
NEXT_PUBLIC_APP_URL=http://localhost:9002 # Public base URL
NODE_ENV=development                      # Auto-set in most runtimes
PORT=9002                                 # Dev server port (optional)
LOG_LEVEL=info                            # debug \| info \| warn \| error
```

### Key Scripts
```bash
npm run dev        # Development server
npm run build      # Production build
npm run lint       # Code linting
npm run typecheck  # TypeScript checking
npm run test       # Run tests
```

---

## 🔒 Security & API

### Production Security Setup
```bash
# Generate HMAC secret
HMAC_SECRET=$(openssl rand -hex 32)

# Rate limiting: 10 requests per IP, refills 1/minute
# Request timeout: 25 seconds
```

### API Endpoints
- `POST /api/ai-assessment` - Main assessment API (HMAC protected)
- Rate limited per IP address
- 25-second request timeout

---

## 🎨 Styling & UI Constants

### Button Styles
```typescript
import { BUTTON_STYLES } from '../lib/ui-constants';

// Available: base, primary, secondary, disabled
className={`${BUTTON_STYLES.base} ${BUTTON_STYLES.primary}`}
```

### Animation Controls
```typescript
import { ANIMATION_DURATIONS } from '../lib/ui-constants';

// Standard durations: fast (150ms), normal (300ms), slow (500ms)
```

---

## ⌨️ Keyboard Navigation

### Control Panel Shortcuts
- **Arrow Keys** (↑↓←→): Navigate between options
- **Home/End**: Jump to first/last option
- **Enter/Space**: Select option
- **Tab**: Move between sections

### Focus Management
- High-contrast yellow focus rings
- Roving tabindex pattern
- Automatic skip of disabled options

---

## 🔧 Implementation Guides

### Round 2: Zone Components (2-3 hours)
1. Create `src/components/zones/` directory
2. Build HeaderZone with progress bar
3. Build MainZone with content router
4. Build FooterZone with message display
5. Add ContentType enum to `app-state.ts`
6. Create `getContentType()` helper function

### Round 3: Content Components (4-5 hours)
1. Build 6 content type components
2. Ensure keypad stays static
3. Map all existing screens
4. Implement content-specific interactions

### Round 4: Animations (2-3 hours)
1. Morph transitions between content types
2. Progress bar animations
3. Respect motion preferences

### Round 5: Integration & Polish (3-4 hours)
1. Update useAssessmentFlow hook
2. Full testing & validation
3. Performance optimization
4. Documentation updates

---

## 📊 Content Type Decision Tree

```
START
  ↓
Is state.isReport?
  YES → REPORT_VIEW
  NO ↓
Is state.isLoading && aiGenerated?
  YES → AI_LOADING
  NO ↓
Is state.isTextInput?
  YES → TEXT_INPUT
  NO ↓
Is state.isMultiSelect?
  YES → MULTI_CHOICE
  NO ↓
Is currentScreenIndex === 0?
  YES → INDUSTRY_PICKER
  NO ↓
DEFAULT → SINGLE_CHOICE
```

---

## 🔍 Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install

# Check types
npm run typecheck

# Fix linting
npm run lint:fix
```

### Runtime Issues
```bash
# Verbose logging
npm run dev -- --debug

# Check environment
echo $OPENAI_API_KEY

# Different port
npm run dev -- --port 3001
```

### API Issues
```bash
# Test API endpoint
curl -X POST http://localhost:9002/api/ai-assessment \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Check OpenAI key
node -e "console.log(process.env.OPENAI_API_KEY ? 'API key set' : 'Missing API key')"
```

---

## 🚀 Deployment

### Required Environment Variables
```bash
OPENAI_API_KEY=your_production_key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
HMAC_SECRET=<secure-random-string>
```

### Wix Embedding
```html
<iframe
  src="https://yourdomain.com"
  width="100%"
  height="800"
  frameborder="0"
  allow="clipboard-write; encrypted-media">
</iframe>
```

---

## 📚 Documentation Map

### Essential Reading
- **[README.md](./README.md)** - Project overview and setup
- **[ZONED_ARCHITECTURE_DESIGN.md](./ZONED_ARCHITECTURE_DESIGN.md)** - Complete architecture specification
- **[PROJECT_HISTORY.md](./PROJECT_HISTORY.md)** - All changes and updates

### Technical Details
- **[CONTENT_TYPE_MAPPING.md](./CONTENT_TYPE_MAPPING.md)** - Screen-by-screen breakdown
- **[VISUAL_FLOW_DIAGRAM.md](./VISUAL_FLOW_DIAGRAM.md)** - Visual architecture diagrams
- **[SECURITY_IMPLEMENTATION.md](./SECURITY_IMPLEMENTATION.md)** - Security measures

### Implementation
- **[ROUND_2_IMPLEMENTATION_GUIDE.md](./ROUND_2_IMPLEMENTATION_GUIDE.md)** - Step-by-step coding guide
- **[TYPESCRIPT_STRICTNESS.md](./TYPESCRIPT_STRICTNESS.md)** - TypeScript best practices

### User-Facing
- **[KEYBOARD_SHORTCUTS.md](./KEYBOARD_SHORTCUTS.md)** - End-user shortcuts guide

### Archive
- **[ze_deletables/](./ze_deletables/)** - Outdated and redundant documentation

---

## ✅ Success Criteria

### Functional
- [ ] Zero screen navigation (100% content morphing)
- [ ] All screens map to content types
- [ ] Keypad never re-renders structure
- [ ] Back button works correctly

### UX
- [ ] Transitions <300ms
- [ ] No layout shifts
- [ ] Clear error feedback in footer
- [ ] Progress always visible

### Technical
- [ ] 60fps on desktop
- [ ] 30fps minimum on mobile
- [ ] <100ms state update latency
- [ ] WCAG 2.1 AA accessibility compliance

---

## 🔗 Key File Locations

### Core Application
- `src/app/main-app.tsx` - Main application component
- `src/hooks/useAssessmentFlow.ts` - State management
- `src/components/CRTScreen.tsx` - Display component
- `src/lib/screen-config-new.ts` - Screen configuration

### Zone System
- `src/components/zones/` - Zone components (Header/Main/Footer)
- `src/components/content/` - Content type components
- `src/types/app-state.ts` - ContentType enum

### Security & Utils
- `src/lib/rate-limiter.ts` - API rate limiting
- `src/lib/api-client.ts` - Secure API client
- `src/lib/ui-constants.ts` - Centralized styling

---

## 📞 Support & Questions

### Before Starting Implementation
- Review architecture in ZONED_ARCHITECTURE_DESIGN.md
- Confirm three-zone layout requirements
- Validate keypad constraint (7 buttons max)
- Check timeline feasibility (2-3 weeks)

### During Development
- Follow ROUND_2_IMPLEMENTATION_GUIDE.md for step-by-step
- Use CONTENT_TYPE_MAPPING.md for reference
- Check VISUAL_FLOW_DIAGRAM.md when stuck
- Follow testing checklists in each document

### After Implementation
- Verify all success criteria met
- Run full test suite
- Check performance metrics
- Update documentation if needed

---

**Total Estimated Time**: 11-15 hours over 2-3 weeks
**Risk Level**: Medium (manageable with proper planning)
**Status**: Ready for implementation 🚀

---

*This quick reference consolidates essential information from all project documentation for fast lookup and decision making.*