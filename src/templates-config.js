export const REPORT_TEMPLATES = {
  intro: "Based on your {businessType} business targeting {targetAudience}, we've analyzed your conversion potential using industry benchmarks and your specific approach.",
  
  metrics: {
    conversionRate: "Expected Conversion Rate: {rate}%",
    traffic: "Projected Monthly Traffic: {visitors} visitors",
    conversions: "Estimated Monthly Conversions: {conversions}",
    revenue: "Potential Monthly Revenue: ${revenue}",
    cost: "Estimated Cost Per Conversion: ${cpc}"
  },
  
  recommendations: {
    high: [
      "Your approach shows strong potential for above-average conversion rates",
      "Focus on scaling your {primaryChannel} efforts",
      "Consider A/B testing your {optimizationArea} to maximize results"
    ],
    medium: [
      "Your strategy has solid fundamentals with room for improvement", 
      "Optimize your {primaryChannel} messaging for better resonance",
      "Consider expanding to {suggestedChannel} for additional reach"
    ],
    low: [
      "Your approach may benefit from strategic adjustments",
      "Focus on improving {weakestArea} before scaling",
      "Consider consulting with specialists in {recommendedExpertise}"
    ]
  },
  
  factors: {
    positive: [
      "Strong target audience alignment",
      "Proven marketing channels selected",
      "Appropriate budget allocation",
      "Clear value proposition focus"
    ],
    negative: [
      "Highly competitive market space",
      "Limited budget for testing phases", 
      "Complex customer journey",
      "Seasonal demand fluctuations"
    ]
  }
};

export const CALCULATION_PARAMS = {
  baseConversionRates: {
    'ecommerce': 2.3,
    'saas': 3.1,
    'consulting': 1.8,
    'coaching': 2.7,
    'agency': 2.1,
    'other': 2.0
  },
  
  channelMultipliers: {
    'organic-search': 1.2,
    'paid-search': 1.1,
    'social-media': 0.9,
    'email-marketing': 1.4,
    'content-marketing': 1.0,
    'referral': 1.3,
    'direct': 1.1
  },
  
  audienceMultipliers: {
    'existing-customers': 1.8,
    'warm-leads': 1.4,
    'cold-prospects': 1.0,
    'competitors-customers': 0.8
  },
  
  budgetMultipliers: {
    'under-1000': 0.8,
    '1000-5000': 1.0,
    '5000-15000': 1.2,
    'over-15000': 1.3
  }
};