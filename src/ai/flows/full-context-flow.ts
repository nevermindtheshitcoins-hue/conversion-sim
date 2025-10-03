'use server';

import type { UserJourney } from '../../lib/journey-tracker';

export interface FullContextOutput {
  response: string;
  questions?: string[];
  reportFactors?: Array<{
    factor: string;
    analysis: string;
    recommendation: string;
  }>;
}

function createSignature(data: any): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

async function callAIAssessmentAPI(userJourney: UserJourney, requestType: string, industry?: string): Promise<FullContextOutput> {
  const dataToSign = { userJourney, requestType, industry };
  const signature = createSignature(dataToSign);
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/ai-assessment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userJourney,
      requestType,
      industry,
      signature,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

function generateFallback(requestType: string): FullContextOutput {
  if (requestType === 'generate_questions') {
    return {
      response: "Generating personalized questions based on your responses...",
      questions: [
        "We struggle with measuring success in our key business areas",
        "This challenge significantly impacts our daily operations",
        "Previous solutions we've tried haven't delivered expected results",
        "We have a clear vision of our ideal business outcome",
        "We have a realistic timeline for addressing our priorities",
      ],
    };
  }

  return {
    response: "Based on your responses, we've identified key areas for improvement and growth opportunities tailored to your specific situation.",
    reportFactors: [
      {
        factor: "Strategic Focus",
        analysis: "Your responses indicate a clear strategic direction with specific priorities.",
        recommendation: "Continue focusing on your identified key areas while monitoring progress.",
      },
      {
        factor: "Operational Efficiency", 
        analysis: "There are opportunities to streamline processes and improve workflow.",
        recommendation: "Implement systematic process improvements and automation where possible.",
      },
      {
        factor: "Growth Potential",
        analysis: "Strong foundation for scaling with proper resource allocation.",
        recommendation: "Develop a structured growth plan with clear milestones.",
      },
      {
        factor: "Risk Management",
        analysis: "Current approach shows awareness of key business risks.",
        recommendation: "Establish formal risk assessment and mitigation procedures.",
      },
      {
        factor: "Team Development",
        analysis: "Team capabilities align well with business objectives.",
        recommendation: "Invest in targeted skill development and leadership training.",
      },
      {
        factor: "Technology Integration",
        analysis: "Technology usage supports current operations effectively.",
        recommendation: "Evaluate emerging technologies for competitive advantage.",
      },
      {
        factor: "Customer Focus",
        analysis: "Customer-centric approach evident in decision-making process.",
        recommendation: "Enhance customer feedback systems and personalization.",
      },
      {
        factor: "Financial Health",
        analysis: "Financial planning shows consideration of long-term sustainability.",
        recommendation: "Implement regular financial reviews and scenario planning.",
      },
    ],
  };
}

export async function generateQuestionsFromPrelims(userJourney: UserJourney, industry: string): Promise<FullContextOutput> {
  try {
    return await callAIAssessmentAPI(userJourney, 'generate_questions', industry);
  } catch (error) {
    console.error('Question generation error:', error);
    return generateFallback('generate_questions');
  }
}

export async function generateCustomReport(userJourney: UserJourney, industry: string): Promise<FullContextOutput> {
  try {
    return await callAIAssessmentAPI(userJourney, 'generate_report', industry);
  } catch (error) {
    console.error('Report generation error:', error);
    return generateFallback('generate_report');
  }
}