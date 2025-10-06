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
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    // Sanitize and log analytics data (replace with actual analytics service)
    const sanitized = JSON.stringify(body).replace(/[\r\n\t]/g, ' ').substring(0, 500);
    console.log('Analytics:', sanitized);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}