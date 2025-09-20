// client/src/app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    // Check user authentication
    const { userId } = await auth();
  
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Please sign in to continue' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // Send userId via header
    const headers = {
      'Content-Type': 'application/json',
      'x-user-id': userId
    };
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:8080';
    const response = await axios.post(`${backendUrl}/api/analyze`, {
      url: url
    }, {
      headers,
      timeout: 60000
    });
    return NextResponse.json(response.data);

  } catch (error) {
    console.error('Analysis error:', error);
    
  }
}