# Copy Comparison: Current vs Proposed

## UI Labels & Status Messages

| Location | Current | Proposed |
|----------|---------|----------|
| App title | Conversion Simulator / DeVOTE Identity Portal | Pilot Scoping Tool |
| Initial status | Link established. Awaiting input. | Ready |
| Help text (default) | Highlight an option with the dial and press confirm. | Select answer |
| Help text (report) | Use the green button to copy or confirm the report. | Copy brief |
| Help text (text) | Type your response and press confirm when ready. | Describe your scenario |
| Help text (multi) | Select all relevant options, then press confirm. | Select all that apply |
| Loading state | Compiling your strategic case… | Generating brief… |
| Options loading | Loading options… stand by. | Loading… |
| Report header | Strategic Business Case | Pilot Brief |
| Report subhead | Deployment Analysis | Assessment |
| Footer note | Generated from your responses; use for directional guidance. | Based on your assessment |

## Screen Headers

| Screen | Current | Proposed |
|--------|---------|----------|
| PRELIM_1 title | Select Your Strategic Focus Area | What's your primary use case? |
| PRELIM_1 subtitle | Choose the domain that best aligns with your organization's priorities | Select the scenario that best matches your need |
| PRELIM_2 (Custom) title | Describe your strategic initiative or use case | What problem are you solving? |
| PRELIM_2 (Custom) subtitle | Be specific about the business problem you're solving | Describe the decision or vote that needs better infrastructure |
| Report title | Strategic Business Case & Value Proposition | Pilot Scope & Technical Brief |

## Button Labels

| Action | Current | Proposed |
|--------|---------|----------|
| Reset button aria | Reset simulator | Restart |
| Back button aria | Back one step | Back |
| Confirm button aria | Confirm and continue | Confirm |
| Copy report aria | Copy report to clipboard | Copy brief |

## Report Section Headers

| Section | Current | Proposed |
|---------|---------|----------|
| Main header | STRATEGIC BUSINESS CASE | PILOT BRIEF |
| Summary | Executive Summary | Overview |
| Value props | VALUE PROPOSITIONS | CAPABILITIES MATCHED |
| ROI section | ROI PROJECTION | DEPLOYMENT TIMELINE |
| Risk section | RISK MITIGATION | BLOCKERS ADDRESSED |
| Positioning | COMPETITIVE POSITIONING | *(remove)* |
| Next steps | NEXT STEPS | NEXT STEPS |
| Success factors | KEY SUCCESS FACTORS | *(remove if business case missing)* |

## Prompt System Messages

| Prompt | Current | Proposed |
|--------|---------|----------|
| Questions system | You are an executive strategy consultant designing C-suite assessments for DeVOTE voting technology. | You generate assessment questions for voting infrastructure pilots. Extract constraints, timelines, and proof requirements. |
| Questions objective | Generate exactly {count} executive-level questions | Generate {count} questions that extract deployment facts |
| Questions language | Use sophisticated business language focused on strategic pain points | Use concrete language. No jargon without plain alternatives. |
| Report system | You are an executive strategy consultant producing comprehensive business cases for C-suite decision-makers. | You generate pilot scoping briefs for voting infrastructure deployments. |
| Report objective | Create a compelling business case that demonstrates… | Create a technical brief that maps their constraints to DeVOTE capabilities with deployment timelines. |
| Report framing | Frame as a strategic transformation initiative | Frame as a pilot deployment with measurable criteria |

## Prompt Output Instructions

| Element | Current | Proposed |
|---------|---------|----------|
| Question types | >=2 single_choice, >=2 multi_choice, >=1 text_input | Mix based on prior answers. Adaptive question types. |
| Question focus | Strategic pain points, organizational barriers | What broke, proof requirement, timeline, blockers |
| Option length | Each <= 5 words | 2-6 words, no acronyms without expansion |
| Report emphasis | VALUE PROPOSITIONS: cost savings, efficiency gains… | Map their named constraint to specific DeVOTE mechanism |
| Report metrics | Include concrete ROI projections and success metrics | Include baseline state, projected state, timeframe for each metric |
| Report tone | This is a SIMULATION - clearly fictional but professionally credible | This is a scoping assessment. Numbers are estimates based on similar deployments. |

## Error Messages

| Context | Current | Proposed |
|---------|---------|----------|
| No selection | Please select an option | Select an answer |
| Text too short | Please enter at least 5 characters | Enter at least 5 characters |
| Multi no selection | Please select at least one option | Select at least one |
| API error | Service temporarily unavailable. Please try again in a moment. | *(keep)* |
| Validation error | Invalid request. Please check your input and try again. | *(keep)* |

## NORAD Terminal Aesthetic Changes

| Element | Current (Arcade) | Proposed (NORAD) |
|---------|------------------|------------------|
| Color palette | Yellow-300, Emerald-400, Red-600 | Amber-500, Cyan-400, Red-500 |
| Typography | Orbitron + gradients + tracking | Courier New / Share Tech Mono, monospaced, fixed weight |
| Panel borders | Rounded-2xl, gradients, shadows | Sharp corners or minimal radius, 1px solid borders |
| Button style | Circular, 3D effect, glows | Rectangular, flat, LED-style indicators |
| Progress lights | Circular orbs with shadows | Square/rectangular segments, single color |
| Header treatment | Engraved metal placard with rivets | Plain text label, military stencil style |
| CRT effects | Scanlines + vignette + glow | Scanlines only, higher contrast |
| Status indicators | Animated glowing spheres | Static LED rectangles (on/off states) |
| Background | Gradient from zinc-900 to black | Solid dark gray (#0a0a0a) |
| Text glow | Multiple color glows, soft | Single color, sharp phosphor effect |

---

## Codex v2 Copy Proposals (Brand + Terminal Voice)

| Location (file:line) | Current | Proposed | Rationale |
|---|---|---|---|
| src/config/screen-text.ts:2 | Conversion Simulator | DeVOTE Identity Portal | Brand alignment and clarity |
| src/config/screen-text.ts:3 | System ready. Awaiting input. | Link established. Awaiting input. | Terminal/console tone |
| src/config/screen-text.ts:5 | Highlight an option with the dial and press confirm. | Status — highlight an option, then press confirm. | Concise, consistent status voice |
| src/config/screen-text.ts:6 | Use the green button to copy or confirm the report. | Status — press confirm to copy or approve the report. | Clear action language |
| src/config/screen-text.ts:7 | Type your response and press confirm when ready. | Status — type your response, then press confirm. | Consistent pattern |
| src/config/screen-text.ts:8 | Select all relevant options, then press confirm. | Status — select all that apply; press confirm. | Consistent pattern |
| src/components/AppContainer.tsx:31 | aria-label "Pilot scenario simulator" | "DeVOTE Simulator" | Brand/ARIA clarity |
| src/components/CRTShell.tsx:45 | aria-label "Simulation content" | "Simulator viewport" | More precise ARIA |
| src/components/zones/HeaderZone.tsx:65 | aria-label "Assessment progress" | "Simulator progress" | Align naming |
| src/components/Buttons.tsx:88 | Describe your scenario where DeVOTE technology could be used... | Describe a scenario where DeVOTE could help… | Shorter, friendlier placeholder |
| src/components/Buttons.tsx:128 | Options will appear once this step loads. | Loading options… stand by. | Less boilerplate |
| src/components/Buttons.tsx:148 | aria-label "Reset assessment" | "Reset simulator" | Terminology consistency |
| src/components/Buttons.tsx:160 | aria-label "Go back to previous question" | "Back one step" | Shorter ARIA |
| src/components/Buttons.tsx:169 | aria-label "Confirm selection and continue" | "Confirm and continue" | Shorter ARIA |
| src/components/ReportDisplay.tsx:20 | STRATEGIC BUSINESS CASE | Strategic Business Case | Title Case, less shouty |
| src/components/ReportDisplay.tsx:20 | DEPLOYMENT ANALYSIS | Deployment Analysis | Title Case |
| src/components/ReportDisplay.tsx:42 | VALUE PROPOSITIONS | Value Propositions | Title Case |
| src/components/ReportDisplay.tsx:66 | ROI PROJECTION | ROI Projection | Title Case |
| src/components/ReportDisplay.tsx:146 | KEY SUCCESS FACTORS | Key Success Factors | Title Case |
| src/components/ReportDisplay.tsx:168–171 | 💡 This strategic assessment is generated based on your specific organizational context and priorities. | Generated from your responses; use for directional guidance. | Tighter guidance |
| src/components/ReportDisplay.tsx:178–179 | Your strategic business case is being generated… The comprehensive analysis will appear here once complete. | Compiling your strategic case… This pane will populate once analysis is ready. | Short, confident |

> Note: This section is a proposal only; no code changes applied yet.

---

## Prelim Q&A Wording Updates (No logic changes)

| Path | Key/Screen | Current | Proposed | Rationale |
|---|---|---|---|---|
| src/data/preliminary-questions.ts | PRELIM_1.title | Select Your Strategic Focus Area | Select Your Strategic Focus | Tighter wording |
| src/data/preliminary-questions.ts | Custom PRELIM_2.subtitle | Be specific about the business problem you're solving | Describe the business problem to solve | Direct, active |
| src/data/preliminary-questions.ts | Gov PRELIM_2 option | Union & labor organization governance | Union & Labor Governance | Title Case, concise |
| src/data/preliminary-questions.ts | Gov PRELIM_2 option | Community & HOA governance | Community & HOA Governance | Title Case |
| src/data/preliminary-questions.ts | Gov PRELIM_2 option | Referendums & policy initiatives | Referendums & Policy Initiatives | Title Case |
| src/data/preliminary-questions.ts | Gov PRELIM_3 option | Digital transformation & adoption barriers | Digital Transformation & Adoption | Remove “barriers” redundancy |
| src/data/preliminary-questions.ts | Healthcare PRELIM_3 option | Healthcare cost & reimbursement pressures | Cost & Reimbursement Pressure | Less verbose |
| src/data/preliminary-questions.ts | Healthcare PRELIM_3 option | Clinical data management & quality | Clinical Data & Quality Management | Parallel form |
| src/data/preliminary-questions.ts | SC PRELIM_2 option | Supply-chain manager / logistics coord | Supply Chain Manager / Logistics Coordinator | Expanded abbrev |
| src/data/preliminary-questions.ts | SC PRELIM_3 option | On-time perf | On‑time Performance | Full wording |
| src/data/preliminary-questions.ts | SC PRELIM_3 option | WMS integrations | WMS Integrations | Title Case |
| src/data/preliminary-questions.ts | SC PRELIM_3 title | Select up to 3 pains in DC ops | Select up to 3 pains in Distribution Center Operations | Expanded |
| src/data/preliminary-questions.ts | SC PRELIM_3 option | ESG/compliance vetting | ESG & Compliance Vetting | Parallel form |
| src/data/preliminary-questions.ts | SC PRELIM_3 option | Master data | Master Data Quality | Specificity |
| src/data/preliminary-questions.ts | SC PRELIM_3 option | S&OP cadence | S&OP Cadence | Title Case |
| src/data/preliminary-questions.ts | SC PRELIM_3 option | CoC/CoA capture | Chain‑of‑Custody / CoA Capture | Expanded abbrev |
| src/data/preliminary-questions.ts | Corp Gov PRELIM_3 option | Digital governance & cybersecurity | Digital Governance & Cybersecurity | Title Case |

> All changes are label-only; no changes to selection rules, counts, or logic.

---

## AI Prompt Refinements (OpenAI + Gemini)

### System Prompts

| Name | Current Summary | Proposed Summary | Rationale |
|---|---|---|---|
| SYSTEM_PROMPT_QUESTIONS | Executive strategy consultant; JSON-only | DeVOTE strategy copilot; executive, JSON-only; tie to prior choices | Brand voice, specificity |
| SYSTEM_PROMPT_REPORT | Executive business-case writer; JSON-only | DeVOTE business‑case generator; simulation framing; JSON-only | Clarity and guardrails |

### Questions Prompt (buildQuestionsPrompt)

Key deltas:
- Exactly `{count}` questions; enforce mix ≥2 single_choice, ≥2 multi_choice, ≥1 text_input.
- Option rules: 3–7 options; each ≤ 5 words; no “All of the above”; no duplicates.
- multi_choice: include `maxSelections` ONLY when useful (2–4).
- text_input: informative placeholder; `minLength` 30–120 (still within API validation 5–150).
- Every question must reflect `industry` and `priorChoices`; avoid boilerplate; executive language.
- Output is a single JSON object (no markdown, no prose).

### Report Prompt (buildReportPrompt)

Key deltas:
- Strong “simulation” framing; tie value/risk directly to prior choices.
- Quantify impact where reasonable (%, $, time) with baseline → projected → timeframe.
- Map constraints to DeVOTE mechanisms (ZK proofs, verifiability, deployment model, etc.).
- No URLs/markdown/disclaimers; JSON object only using existing schema.

> These prompt updates keep the current schema and server validations intact.
