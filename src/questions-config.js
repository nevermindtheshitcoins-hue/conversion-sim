export const QUESTIONS = [
  // Step 1: Business Information
  {
    id: 'businessType',
    step: 1,
    type: 'select',
    question: 'What type of business do you have?',
    required: true,
    options: [
      { value: 'ecommerce', label: 'E-commerce / Online Store' },
      { value: 'saas', label: 'SaaS / Software' },
      { value: 'consulting', label: 'Consulting Services' },
      { value: 'coaching', label: 'Coaching / Training' },
      { value: 'agency', label: 'Marketing Agency' },
      { value: 'other', label: 'Other' }
    ]
  },
  {
    id: 'targetAudience',
    step: 1,
    type: 'select',
    question: 'Who is your primary target audience?',
    required: true,
    options: [
      { value: 'existing-customers', label: 'Existing customers (upsell/cross-sell)' },
      { value: 'warm-leads', label: 'Warm leads (newsletter, social followers)' },
      { value: 'cold-prospects', label: 'Cold prospects (new audience)' },
      { value: 'competitors-customers', label: 'Competitors\' customers' }
    ]
  },
  {
    id: 'industryExperience',
    step: 1,
    type: 'select',
    question: 'How long have you been in this industry?',
    required: true,
    options: [
      { value: 'under-1-year', label: 'Less than 1 year' },
      { value: '1-3-years', label: '1-3 years' },
      { value: '3-5-years', label: '3-5 years' },
      { value: 'over-5-years', label: 'Over 5 years' }
    ]
  },

  // Step 2: Marketing Approach  
  {
    id: 'primaryChannels',
    step: 2,
    type: 'select',
    question: 'What are your primary marketing channels?',
    required: true,
    multiple: true,
    maxSelections: 3,
    options: [
      { value: 'organic-search', label: 'Organic Search (SEO)' },
      { value: 'paid-search', label: 'Paid Search (Google Ads)' },
      { value: 'social-media', label: 'Social Media Marketing' },
      { value: 'email-marketing', label: 'Email Marketing' },
      { value: 'content-marketing', label: 'Content Marketing' },
      { value: 'referral', label: 'Referral Marketing' },
      { value: 'direct', label: 'Direct Marketing' }
    ]
  },
  {
    id: 'conversionGoal',
    step: 2,
    type: 'select',
    question: 'What is your primary conversion goal?',
    required: true,
    options: [
      { value: 'sale', label: 'Direct sale/purchase' },
      { value: 'lead', label: 'Lead generation (contact form)' },
      { value: 'signup', label: 'Email signup/registration' },
      { value: 'demo', label: 'Demo/consultation booking' },
      { value: 'trial', label: 'Free trial signup' }
    ]
  },
  {
    id: 'currentConversions',
    step: 2,
    type: 'select',
    question: 'What are your current monthly conversions?',
    required: true,
    options: [
      { value: 'none', label: 'Just starting (0 conversions)' },
      { value: '1-10', label: '1-10 conversions' },
      { value: '11-50', label: '11-50 conversions' },
      { value: '51-100', label: '51-100 conversions' },
      { value: 'over-100', label: 'Over 100 conversions' }
    ]
  },

  // Step 3: Goals & Budget
  {
    id: 'monthlyBudget',
    step: 3,
    type: 'select',
    question: 'What is your monthly marketing budget?',
    required: true,
    options: [
      { value: 'under-1000', label: 'Under $1,000' },
      { value: '1000-5000', label: '$1,000 - $5,000' },
      { value: '5000-15000', label: '$5,000 - $15,000' },
      { value: 'over-15000', label: 'Over $15,000' }
    ]
  },
  {
    id: 'timeframe',
    step: 3,
    type: 'select', 
    question: 'What is your timeframe for seeing results?',
    required: true,
    options: [
      { value: '1-month', label: '1 month (immediate)' },
      { value: '3-months', label: '3 months (short-term)' },
      { value: '6-months', label: '6 months (medium-term)' },
      { value: '12-months', label: '12+ months (long-term)' }
    ]
  },
  {
    id: 'biggestChallenge',
    step: 3,
    type: 'select',
    question: 'What is your biggest challenge?',
    required: true,
    options: [
      { value: 'traffic', label: 'Getting enough website traffic' },
      { value: 'conversion', label: 'Converting visitors to customers' },
      { value: 'retention', label: 'Retaining customers' },
      { value: 'competition', label: 'Standing out from competition' },
      { value: 'budget', label: 'Limited marketing budget' }
    ]
  }
];