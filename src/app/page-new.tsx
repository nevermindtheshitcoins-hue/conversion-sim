'use client';

import { AssessmentFlow } from '../components/AssessmentFlow';

export default function ConversionTool() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Assessment Tool</h1>
          <p className="text-gray-600">Get personalized insights based on your unique situation</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg">
          <AssessmentFlow />
        </div>
      </div>
    </div>
  );
}