import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    // Make request to your Flask backend
    const response = await fetch('http://localhost:5000/search_jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in job search:', error);
    return NextResponse.json({ error: 'Failed to search jobs' }, { status: 500 });
  }
} 