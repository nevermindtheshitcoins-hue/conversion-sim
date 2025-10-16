// Direct test of AI API with .env.local loaded
import { config } from 'dotenv';
import { generateQuestionsFromPrelims, generateCustomReport } from './src/ai/flows/full-context-flow.ts';

// Load .env.local manually (simulating what Next.js should do)
config({ path: '.env.local' });

console.log('🔍 Testing AI with manually loaded .env.local...\n');

// Check if environment variables are now available
console.log('📋 Environment Status After Loading .env.local:');
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0);
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);

if (!process.env.OPENAI_API_KEY) {
  console.log('\n❌ OPENAI_API_KEY not loaded from .env.local');
  console.log('This confirms Next.js is not loading .env.local properly');
  process.exit(1);
}

// Mock user journey data
const mockJourney = {
  responses: [
    {
      screen: 'PRELIM_1',
      buttonText: 'Healthcare',
      buttonIndex: 1
    },
    {
      screen: 'PRELIM_2',
      textInput: 'We need better patient data management and care coordination'
    },
    {
      screen: 'PRELIM_3',
      buttonText: 'Improve operational efficiency'
    }
  ]
};

async function testAI() {
  console.log('\n🚀 Testing AI functionality...\n');

  try {
    console.log('📝 Testing question generation...');
    const questions = await generateQuestionsFromPrelims(mockJourney, 'Healthcare');
    console.log('✅ Questions generated successfully!');
    console.log('Response:', questions.response);
    console.log('Number of questions:', questions.questions?.length || 0);

    if (questions.questions?.length > 0) {
      console.log('\n🎯 First question preview:');
      console.log('Text:', questions.questions[0].text?.substring(0, 100) + '...');
      console.log('Type:', questions.questions[0].type);
      console.log('Options count:', questions.questions[0].options?.length || 0);
    }

    console.log('\n📊 Testing report generation...');
    const report = await generateCustomReport(mockJourney, 'Healthcare');
    console.log('✅ Report generated successfully!');
    console.log('Response:', report.response);
    console.log('Number of report factors:', report.reportFactors?.length || 0);

    console.log('\n🎉 SUCCESS: Real AI integration is working perfectly!');
    console.log('The issue is that Next.js is not loading .env.local automatically.');

  } catch (error) {
    console.error('\n❌ AI test failed:', error.message);
    console.error('Error details:', error);

    if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
      console.error('\n🔧 This suggests the API keys are working but there might be a network issue');
    } else if (error.message.includes('Invalid API key') || error.message.includes('401')) {
      console.error('\n🔑 This suggests the API key format or permissions might be wrong');
    }
  }
}

testAI();