import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://devoteusa.com',
  'https://www.devoteusa.com',
  process.env.NEXT_PUBLIC_IFRAME_PARENT
].filter(Boolean);

export async function POST(request: NextRequest) {
  try {
    const parentOrigin = request.headers.get('X-Parent-Origin') || '';
    
    if (parentOrigin && !ALLOWED_ORIGINS.includes(parentOrigin)) {
      return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 });
    }

    const body = await request.json();
    
    // Log analytics data (replace with actual analytics service)
    console.log('Analytics:', JSON.stringify(body, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}