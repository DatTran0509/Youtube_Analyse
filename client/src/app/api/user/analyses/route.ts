// client/src/app/api/user/analyses/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';


    // Gửi userId qua header
    const headers = {
      'Content-Type': 'application/json',
      'x-user-id': userId
    };


    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:8080';
    const url = `${backendUrl}/api/user/analyses?page=${page}&limit=${limit}`;
    
    console.log('Backend URL:', url);

    const response = await axios.get(url, {
      headers,
      timeout: 30000
    });


    return NextResponse.json(response.data);

  } catch (error) {
    console.error('User analyses API error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
      
      
  }
}